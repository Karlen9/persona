#!/usr/bin/env python3
"""Download images that the live-browser audit found on the old site and register them in the media manifest.

Usage (needs Pillow):
    python3 scripts/download_live_images.py <plan.json> [--dry-run]

`plan.json`: [{"url": "https://personamodel.ru/wp-content/uploads/...jpg?v=31a", "dest": "/media/posters/x.jpg",
               "page": "/napravleniya/logoped/", "kind": "poster"}]
GET only, sequential, retries with back-off; existing non-empty files are kept.  Files wider than 1600 px or heavier
than 500 KB are re-encoded to WebP (q82) and `dest` is switched to the `.webp` name.  Appends to
scripts/data/media-manifest.json under the old upload path (never removes entries) and prints the final src/width/height.
"""

from __future__ import annotations

import io
import json
import re
import subprocess
import sys
import time
import urllib.parse
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / 'scripts' / 'data' / 'media-manifest.json'


def fetch(url: str) -> bytes:
    for attempt in range(1, 6):
        res = subprocess.run(['curl', '-s', '--compressed', '-m', '120', '-w', '%{http_code}', '-o', '-', url], capture_output=True)
        body, code = res.stdout[:-3], res.stdout[-3:].decode()
        if code == '200' and body:
            return body
        time.sleep(3 * attempt)
    raise RuntimeError(f'cannot fetch {url}')


def ensure_image(manifest: dict, url: str, dest: str, page: str | None, kind: str, dry: bool = False) -> dict:
    """Download `url` to public/<dest> (once) and register it; returns {src, width, height, bytes, status}."""
    old_path = urllib.parse.unquote(urllib.parse.urlparse(url).path)
    known = manifest['images'].get(old_path)
    if known and (ROOT / 'public' / known['src'].lstrip('/')).exists():
        return {'url': url, **{k: known[k] for k in ('src', 'width', 'height')}, 'status': 'already in manifest'}
    if dry:
        return {'url': url, 'src': dest, 'status': 'would download'}
    data = fetch(url)
    im = Image.open(io.BytesIO(data))
    im.load()
    target = ROOT / 'public' / dest.lstrip('/')
    target.parent.mkdir(parents=True, exist_ok=True)
    if im.width > 1600 or len(data) > 500 * 1024:
        if im.width > 1600:
            im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
        if im.mode not in ('RGB', 'RGBA'):
            im = im.convert('RGBA' if 'transparency' in im.info else 'RGB')
        dest = re.sub(r'\.[a-z]+$', '.webp', dest, flags=re.I)
        target = ROOT / 'public' / dest.lstrip('/')
        im.save(target, 'WEBP', quality=82, method=6)
    else:
        target.write_bytes(data)
    entry = {'src': dest, 'width': im.width, 'height': im.height, 'bytes': target.stat().st_size, 'apiAlt': '', 'page': page, 'kind': kind}
    manifest['images'][old_path] = entry
    time.sleep(1)
    return {'url': url, 'src': dest, 'width': im.width, 'height': im.height, 'bytes': entry['bytes'], 'status': 'downloaded'}


def main() -> int:
    plan = json.loads(Path(sys.argv[1]).read_text())
    dry = '--dry-run' in sys.argv
    manifest = json.loads(MANIFEST.read_text())
    out = [ensure_image(manifest, i['url'], i['dest'], i.get('page'), i.get('kind', 'poster'), dry) for i in plan]
    if not dry:
        MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + '\n')
    print(json.dumps(out, ensure_ascii=False, indent=1))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
