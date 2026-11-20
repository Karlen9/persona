#!/usr/bin/env python3
"""Step 2/3 of the content pipeline: resolve image refs, download media and legal PDFs.

Usage:
    python3 scripts/download_media.py --crawl <crawl dir> --out <work dir> [--public public] [--dry-run]

Reads `<work dir>/extracted.json` (from scripts/extract.py), resolves every `{"$img": ...}` reference
against the WordPress media API dump, picks the largest generated size that is <= 1600 px wide and
<= 1.5 MB, downloads it to `public/media/<group>/<name>.<ext>` and writes `media-manifest.json`
(ref path -> local src, intrinsic size, API alt text). Videos are NOT downloaded; their byte sizes
are looked up from the API for the manifest. Legal/festival PDFs go to `public/docs/`.

Politeness: generic UA, <= 2 concurrent requests, GET only, retries with back-off, re-runnable
(existing non-empty files are kept).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))

from PIL import Image  # noqa: E402

import content_config as cfg  # noqa: E402
from content_lib import SITE, Crawl, path_of  # noqa: E402

UA = 'Mozilla/5.0 (compatible; content-migration/1.0)'
MAX_WIDTH = 1600
MAX_BYTES = 1_500_000
RASTER_EXT = ('.jpg', '.jpeg', '.png')


def walk(o: Any, out: list[dict[str, Any]]) -> None:
    if isinstance(o, dict):
        if '$img' in o:
            out.append(o)
        for v in o.values():
            walk(v, out)
    elif isinstance(o, list):
        for v in o:
            walk(v, out)


def stem_key(path: str) -> str:
    """dir/stem with `.webp` sibling suffix, extension, size suffix and -scaled removed."""
    p = path
    if p.endswith('.webp') and Path(p[:-5]).suffix.lower() in RASTER_EXT:
        p = p[:-5]
    p = re.sub(r'\.[A-Za-z0-9]+$', '', p)
    p = re.sub(r'-\d+x\d+$', '', p)
    p = re.sub(r'-scaled$', '', p)
    return p


class MediaIndex:
    def __init__(self, records: list[dict[str, Any]]) -> None:
        self.by_path: dict[str, dict[str, Any]] = {}
        self.by_stem: dict[str, dict[str, Any]] = {}
        for rec in records:
            md = rec.get('media_details') or {}
            urls = [rec['source_url']] + [s['source_url'] for s in (md.get('sizes') or {}).values()]
            file = md.get('file')
            if file and md.get('original_image'):
                urls.append(f"{SITE}/wp-content/uploads/{Path(file).parent}/{md['original_image']}")
            for u in urls:
                p = urllib.parse.unquote(urllib.parse.urlparse(u).path)
                self.by_path.setdefault(p, rec)
                self.by_stem.setdefault(stem_key(p), rec)

    def find(self, path: str) -> dict[str, Any] | None:
        for cand in (path, path[:-5] if path.endswith('.webp') else None):
            if cand and cand in self.by_path:
                return self.by_path[cand]
        return self.by_stem.get(stem_key(path))


def variants(rec: dict[str, Any]) -> list[dict[str, Any]]:
    md = rec.get('media_details') or {}
    out = []
    for name, s in (md.get('sizes') or {}).items():
        out.append({'url': s['source_url'], 'w': s['width'], 'h': s['height'], 'bytes': s.get('filesize'),
                    'mime': s.get('mime_type'), 'size': name})
    if 'full' not in (md.get('sizes') or {}):
        out.append({'url': rec['source_url'], 'w': md.get('width'), 'h': md.get('height'),
                    'bytes': md.get('filesize'), 'mime': rec.get('mime_type'), 'size': 'full'})
    else:
        for v in out:
            if v['size'] == 'full' and v['bytes'] is None:
                v['bytes'] = md.get('filesize')
    return [v for v in out if v['w']]


def choose(rec: dict[str, Any]) -> dict[str, Any]:
    vs = variants(rec)
    ok = [v for v in vs if v['w'] <= MAX_WIDTH and (v['bytes'] is None or v['bytes'] <= MAX_BYTES)]
    if ok:
        return max(ok, key=lambda v: (v['w'], v['mime'] == 'image/webp'))
    return min(vs, key=lambda v: v['w'])


def http(url: str, method: str = 'GET', retries: int = 3) -> bytes | None:
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA}, method=method)
            with urllib.request.urlopen(req, timeout=90) as r:
                return r.read() if method == 'GET' else b'ok'
        except urllib.error.HTTPError as e:
            if e.code in (404, 403):
                return None
            last = e
        except Exception as e:  # noqa: BLE001
            last = e
        time.sleep(2 * (attempt + 1))
    print('FAILED', url, last, file=sys.stderr)
    return None


def slugify(name: str) -> str:
    s = name.lower().replace('_', '-')
    s = re.sub(r'[^a-z0-9-]+', '-', s)
    return re.sub(r'-+', '-', s).strip('-') or 'image'


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--crawl', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--public', default=str(Path(__file__).resolve().parent.parent / 'public'))
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--docs', choices=['skip', 'fetch'], default='fetch',
                    help='the PDFs are large and the origin is slow; `skip` only records their sizes')
    args = ap.parse_args()

    crawl = Crawl(args.crawl)
    index = MediaIndex(crawl.api_media)
    work = Path(args.out)
    data = json.loads((work / 'extracted.json').read_text(encoding='utf-8'))
    refs: list[dict[str, Any]] = []
    walk(data, refs)

    # one entry per distinct source path; first ref wins naming/group
    plan: dict[str, dict[str, Any]] = {}
    for r in refs:
        plan.setdefault(r['$img'], r)

    public = Path(args.public)
    used: dict[str, str] = {}  # local rel path -> source ref path
    jobs = []
    for src_path, r in plan.items():
        rec = index.find(src_path)
        group = r['group']
        chosen_url = None
        if rec:
            ch = choose(rec)
            chosen_url = ch['url']
            api_alt = (rec.get('alt_text') or '').strip()
        else:
            chosen_url = SITE + urllib.parse.quote(src_path)
            api_alt = ''
        chosen_path = urllib.parse.unquote(urllib.parse.urlparse(chosen_url).path)
        prefer_webp = (src_path.endswith('.webp') and Path(chosen_path).suffix.lower() in RASTER_EXT
                       and group not in ('brand', 'seo') and not (r.get('name') or '').endswith('-og'))
        if r.get('name'):
            base_name = r['name']
        else:
            stem = re.sub(r'\.(jpg|jpeg|png)$', '', Path(chosen_path).stem, flags=re.I)
            base_name = slugify(re.sub(r'-(\d+x\d+|scaled)$', '', stem))
        jobs.append({'ref': src_path, 'group': group, 'name': base_name, 'url': chosen_url, 'path': chosen_path,
                     'prefer_webp': prefer_webp, 'apiAlt': api_alt, 'found': bool(rec)})

    # resolve unique local paths (extension is decided at download time; reserve by group/name).
    # Two refs that resolve to the same remote file share one local file (e.g. hero + og image).
    taken: dict[str, str] = {}
    by_url: dict[str, dict[str, Any]] = {}
    aliases: list[tuple[dict[str, Any], dict[str, Any]]] = []
    unique_jobs = []
    for j in jobs:
        if j['url'] in by_url:
            aliases.append((j, by_url[j['url']]))
            continue
        by_url[j['url']] = j
        unique_jobs.append(j)
        key = f"{j['group']}/{j['name']}"
        n = 2
        while key in taken and taken[key] != j['ref']:
            key = f"{j['group']}/{j['name']}-{n}"
            n += 1
        taken[key] = j['ref']
        j['key'] = key
    jobs_all = jobs
    jobs = unique_jobs

    if args.dry_run:
        for j in jobs[:40]:
            print(j['key'], '<-', j['url'], 'webp' if j['prefer_webp'] else '')
        print(len(jobs), 'images,', sum(1 for j in jobs if not j['found']), 'not in API')
        return

    def fetch(j: dict[str, Any]) -> dict[str, Any]:
        d = public / 'media' / Path(j['key']).parent
        d.mkdir(parents=True, exist_ok=True)
        stem = Path(j['key']).name
        existing = [p for p in d.glob(stem + '.*') if p.stat().st_size > 0]
        if existing:
            local = existing[0]
        else:
            body = None
            ext = Path(j['path']).suffix
            if j['prefer_webp']:
                body = http(j['url'] + '.webp')
                if body is not None:
                    ext = '.webp'
            if body is None:
                body = http(j['url'])
                ext = Path(j['path']).suffix
            if body is None:
                return {**j, 'error': 'download failed'}
            local = d / (stem + ext.lower())
            local.write_bytes(body)
        try:
            with Image.open(local) as im:
                w, h = im.size
        except Exception:  # noqa: BLE001
            w = h = None  # e.g. svg
        return {**j, 'local': '/' + str(local.relative_to(public)), 'width': w, 'height': h,
                'bytes': local.stat().st_size}

    with ThreadPoolExecutor(max_workers=2) as ex:
        results = list(ex.map(fetch, jobs))
    by_ref = {r['ref']: r for r in results}
    for alias, target in aliases:
        res = dict(by_ref[target['ref']])
        res['ref'] = alias['ref']
        res['apiAlt'] = alias['apiAlt']
        results.append(res)

    manifest: dict[str, Any] = {}
    errors = []
    for res in results:
        if 'error' in res:
            errors.append(res)
            continue
        manifest[res['ref']] = {'src': res['local'], 'width': res['width'], 'height': res['height'],
                                'bytes': res['bytes'], 'apiAlt': res['apiAlt']}

    # fix up refs without PIL dimensions (svg) using the extractor-provided size
    for r in refs:
        m = manifest.get(r['$img'])
        if m and not m['width'] and r.get('w'):
            m['width'], m['height'] = r['w'], r.get('h')

    # video sizes from the API
    videos: dict[str, Any] = {}
    vids: list[str] = []

    def collect(o: Any) -> None:
        if isinstance(o, dict):
            if 'src' in o and 'poster' in o and isinstance(o['src'], str):
                vids.append(o['src'])
            for v in o.values():
                collect(v)
        elif isinstance(o, list):
            for v in o:
                collect(v)

    collect(data)
    api_by_path = {urllib.parse.unquote(urllib.parse.urlparse(m['source_url']).path): m for m in crawl.api_media}
    for src in dict.fromkeys(vids):
        rec = api_by_path.get(urllib.parse.unquote(urllib.parse.urlparse(src).path))
        info: dict[str, Any] = {}
        if rec:
            md = rec.get('media_details') or {}
            if md.get('filesize'):
                info['sizeBytes'] = md['filesize']
            info['mimeType'] = rec.get('mime_type')
        videos[src] = info

    # documents (sizes come from the file when present, else from the API)
    docs: dict[str, Any] = {}
    for old, new in cfg.DOCS.items():
        dest = public / new.lstrip('/')
        dest.parent.mkdir(parents=True, exist_ok=True)
        if args.docs == 'fetch' and (not dest.exists() or dest.stat().st_size == 0):
            body = http(SITE + old)
            if body is None:
                errors.append({'ref': old, 'error': 'pdf download failed'})
            else:
                dest.write_bytes(body)
        rec = api_by_path.get(old)
        size = dest.stat().st_size if dest.exists() else ((rec or {}).get('media_details') or {}).get('filesize', 0)
        docs[old] = {'src': new, 'bytes': size, 'present': dest.exists()}

    # prune files from earlier runs that no manifest entry points to
    keep = {public / m['src'].lstrip('/') for m in manifest.values()}
    for f in (public / 'media').rglob('*'):
        if f.is_file() and f not in keep and f.name != 'favicon.svg':
            f.unlink()
    (work / 'media-manifest.json').write_text(
        json.dumps({'images': manifest, 'videos': videos, 'docs': docs}, ensure_ascii=False, indent=1),
        encoding='utf-8')
    print(f'{len(manifest)} images, {len(docs)} docs, {len(videos)} videos; errors: {len(errors)}')
    for e in errors:
        print('ERROR', e.get('ref'), e.get('error'))


if __name__ == '__main__':
    main()
