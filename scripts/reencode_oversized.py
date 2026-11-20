#!/usr/bin/env python3
"""Re-encode heavy raster images in public/media/** (> 500 KB) to WebP (q82, max 1600 px wide) and repoint every reference.

Usage (needs Pillow):
    python3 scripts/reencode_oversized.py [--min-kb 500] [--apply]      # dry run unless --apply

Skips brand / og / seo images and the price list (must stay full resolution) and files nothing references
(reported, left on disk).  For every re-encoded file it rewrites `src` + the `width` / `height` that follow it in
`src/**` and updates scripts/data/media-manifest.json (+ the generated image-audit.json `localSrc`); the original
is deleted only after a final grep confirms that no reference to it remains.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / 'public' / 'media'
SKIP_DIRS = {'brand', 'seo'}
SKIP_NAMES = {'prejskurant-2026-2027.jpg'}
MAX_W = 1600
QUALITY = 82


def source_files() -> list[Path]:
    return [p for p in (ROOT / 'src').rglob('*') if p.is_file() and p.suffix in ('.ts', '.tsx', '.css', '.json')]


def referenced(rel: str) -> bool:
    return any(rel in p.read_text(errors='ignore') for p in source_files())


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--min-kb', type=int, default=500)
    ap.add_argument('--apply', action='store_true')
    args = ap.parse_args()
    manifest_path = ROOT / 'scripts' / 'data' / 'media-manifest.json'
    manifest = json.loads(manifest_path.read_text())
    audit_path = ROOT / 'scripts' / 'data' / 'image-audit.json'
    report = []
    for f in sorted(MEDIA.rglob('*')):
        if not f.is_file() or f.suffix.lower() not in ('.png', '.jpg', '.jpeg'):
            continue
        if f.relative_to(MEDIA).parts[0] in SKIP_DIRS or f.name in SKIP_NAMES or f.stat().st_size <= args.min_kb * 1024:
            continue
        rel = '/' + f.relative_to(ROOT / 'public').as_posix()
        if not referenced(rel):
            report.append((rel, f.stat().st_size, None, 'UNREFERENCED: left as is'))
            continue
        im = Image.open(f)
        im.load()
        if im.width > MAX_W:
            im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
        new_rel = re.sub(r'\.(png|jpe?g)$', '.webp', rel, flags=re.I)
        new_file = ROOT / 'public' / new_rel.lstrip('/')
        if im.mode not in ('RGB', 'RGBA'):
            im = im.convert('RGBA' if 'transparency' in im.info or im.mode in ('LA', 'PA') else 'RGB')
        if not args.apply:
            report.append((rel, f.stat().st_size, None, f'would write {new_rel} {im.width}x{im.height}'))
            continue
        im.save(new_file, 'WEBP', quality=QUALITY, method=6)
        w, h = im.size
        # content modules: src + following width / height
        pat = re.compile(r"(src:\s*')" + re.escape(rel) + r"(',\s*width:\s*)\d+(,\s*height:\s*)\d+")
        for p in source_files():
            text = p.read_text()
            new = pat.sub(lambda m: f'{m.group(1)}{new_rel}{m.group(2)}{w}{m.group(3)}{h}', text)
            new = new.replace(rel, new_rel)
            if new != text:
                p.write_text(new)
        for entry in manifest['images'].values():
            if entry['src'] == rel:
                entry.update(src=new_rel, width=w, height=h, bytes=new_file.stat().st_size)
        report.append((rel, f.stat().st_size, new_file.stat().st_size, f'-> {new_rel} {w}x{h}'))
    if args.apply:
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + '\n')
        text = audit_path.read_text()
        for rel, _, new, note in report:
            if new is not None:
                text = text.replace(rel, note.split(' ')[1])
        audit_path.write_text(text)
        for rel, _, new, _ in report:
            if new is not None:
                if referenced(rel):
                    print('STILL REFERENCED, original kept:', rel)
                else:
                    (ROOT / 'public' / rel.lstrip('/')).unlink()
    for rel, before, after, note in report:
        print(f'{rel}: {before // 1024} KB -> {"" if after is None else str(after // 1024) + " KB "}{note}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
