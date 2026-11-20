#!/usr/bin/env python3
"""Download the page-content images that scripts/audit_images.py found missing in the rebuilt site.

Usage (needs Pillow, like download_media.py):
    python3 scripts/download_missing_images.py --crawl <crawl dir> [--audit scripts/data/image-audit.json] [--dry-run]

Targets (class `content`, not migrated):
  * flip-box photos (programme cards)  -> public/media/<area>/<slug>-photo-<n>.<ext>   (n = card order on the old page)
  * page hero backgrounds on simple pages -> public/media/<area>/<slug>-hero.<ext>
  * posters injected by an inline script (home «Наши выступления») -> public/media/posters/<file stem>.<ext>
Size rule is the one of download_media.py (largest generated size <= 1600 px wide and <= 1.5 MB, `.webp` sibling
preferred when the old page served one); files that are not in the WordPress media API (the 2026/08 theme-patch
uploads) are fetched as they are and shrunk to 1600 px if larger.  Existing non-empty files are kept (re-runnable),
GET only, sequential, retries with back-off.  Appends to scripts/data/media-manifest.json (never removes entries).
"""

from __future__ import annotations

import argparse
import io
import json
import re
import sys
import time
import urllib.parse
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE))

from PIL import Image  # noqa: E402

import download_media as dm  # noqa: E402
from content_lib import SITE, Crawl  # noqa: E402

AREA = {'napravleniya': 'directions', 'sobytiya': 'events', 'festivali': 'festivals'}


def original_ref(files: list[str]) -> str:
    """The un-suffixed upload path among the paths the old page used (falls back to the first)."""
    for f in files:
        if not re.search(r'-\d+x\d+\.[a-z]+(\.webp)?$', f) and not f.endswith('-scaled.jpg'):
            return f
    return files[0]


def plan_targets(audit: dict[str, Any]) -> list[dict[str, Any]]:
    targets = []
    for page in audit['perPage']:
        new_path = page.get('newPath')
        if not new_path:
            continue
        parts = [p for p in new_path.split('/') if p]
        for item in page['images']:
            if item['class'] == 'content' and not item['migrated'] and 'script-poster' in item['kinds']:
                stem = Path(original_ref(item['files'])).stem
                targets.append({'page': new_path, 'area': 'posters', 'name': stem, 'kind': 'poster',
                                'label': item['elements'][0] if item['elements'] else None, 'files': item['files'],
                                'ref': original_ref(item['files'])})
        if not parts:
            continue  # home: hero photo is already in /media/brand
        area = AREA.get(parts[0], 'directions')
        slug = parts[-1]
        cards = [i for i in page['images'] if i['class'] == 'content' and not i['migrated'] and i['labels']]
        cards.sort(key=lambda i: (i['line'] or 0))
        for n, item in enumerate(cards, 1):
            targets.append({'page': new_path, 'area': area, 'name': f'{slug}-photo-{n}', 'kind': 'card',
                            'label': item['labels'][0], 'files': item['files'], 'ref': original_ref(item['files'])})
        heroes = [i for i in page['images'] if i['class'] == 'content' and not i['migrated'] and not i['labels']
                  and 'css-bg' in i['kinds'] and page['oldPath'] not in ('/areas/salsa-i-bachata/', '/')]
        for item in heroes:
            targets.append({'page': new_path, 'area': area, 'name': f'{slug}-hero', 'kind': 'hero', 'label': None,
                            'files': item['files'], 'ref': original_ref(item['files'])})
    return targets


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--crawl', required=True, type=Path)
    ap.add_argument('--audit', type=Path, default=HERE / 'data' / 'image-audit.json')
    ap.add_argument('--public', type=Path, default=ROOT / 'public')
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--only', choices=['card', 'hero', 'poster'], help='restrict to one kind of target')
    args = ap.parse_args()

    audit = json.loads(args.audit.read_text())
    index = dm.MediaIndex(Crawl(args.crawl).api_media)
    manifest_path = HERE / 'data' / 'media-manifest.json'
    manifest = json.loads(manifest_path.read_text())
    targets = [t for t in plan_targets(audit) if not args.only or t['kind'] == args.only]
    print(f'{len(targets)} images to fetch')
    failures = []
    for t in targets:
        rec = index.find(t['ref'])
        prefer_webp = any(f.endswith('.webp') for f in t['files'])
        if rec:
            ch = dm.choose(rec)
            url = ch['url']
            api_alt = (rec.get('alt_text') or '').strip()
        else:
            url = SITE + urllib.parse.quote(t['ref'])
            api_alt = ''
        path = urllib.parse.unquote(urllib.parse.urlparse(url).path)
        dest_dir = args.public / 'media' / t['area']
        existing = [p for p in dest_dir.glob(t['name'] + '.*') if p.stat().st_size > 0]
        print(f"{t['page']:48} {t['name']:34} {path.split('uploads/')[-1]}{' (+webp)' if prefer_webp else ''}")
        if args.dry_run:
            continue
        dest_dir.mkdir(parents=True, exist_ok=True)
        if existing:
            local = existing[0]
        else:
            body = ext = None
            if prefer_webp and Path(path).suffix.lower() in dm.RASTER_EXT:
                body = dm.http(url + '.webp')
                ext = '.webp'
            if body is None:
                body = dm.http(url)
                ext = Path(path).suffix.lower()
            if body is None:
                failures.append(t)
                continue
            with Image.open(io.BytesIO(body)) as im:
                if im.width > dm.MAX_WIDTH:  # not in the media API: shrink like the API sizes would be
                    im = im.convert('RGB') if ext in ('.jpg', '.jpeg') else im
                    im = im.resize((dm.MAX_WIDTH, round(im.height * dm.MAX_WIDTH / im.width)), Image.LANCZOS)
                    buf = io.BytesIO()
                    im.save(buf, format={'.jpg': 'JPEG', '.jpeg': 'JPEG', '.png': 'PNG', '.webp': 'WEBP'}[ext], quality=82)
                    body = buf.getvalue()
            local = dest_dir / (t['name'] + ext)
            local.write_bytes(body)
            time.sleep(1)
        with Image.open(local) as im:
            w, h = im.size
        entry = {'src': '/' + str(local.relative_to(args.public)), 'width': w, 'height': h,
                 'bytes': local.stat().st_size, 'apiAlt': api_alt, 'page': t['page'], 'kind': t['kind']}
        if t['label']:
            entry['label'] = t['label']
        manifest['images'][t['ref']] = entry
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'done, {len(failures)} failures')
    for f in failures:
        print('FAILED', f['ref'])
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
