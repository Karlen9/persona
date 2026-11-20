#!/usr/bin/env python3
"""Attach the downloaded programme-card photos to the content modules (surgical text insert, idempotent).

Reads the `kind == "card"` entries that scripts/download_missing_images.py appended to
scripts/data/media-manifest.json (page, label = card title on the old page, src, size) and inserts

    image: {src, width, height, alt, altGenerated: true}

after the `text:` of the programme item / card whose `title:` equals the label.  Items that already have an
`image:` are left alone.  Run `bunx prettier --write` on the touched files afterwards.

    python3 scripts/apply_card_images.py [--dry-run]
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
CONTENT = ROOT / 'src' / 'content'


def norm(s: str) -> str:
    return re.sub(r'\s+', ' ', s.replace(' ', ' ')).strip()


def read_string(src: str, pos: int) -> tuple[str, int]:
    """Parse a JS string literal starting at `pos` (the quote char); returns (value, index after the closing quote)."""
    q = src[pos]
    i = pos + 1
    out = []
    while src[i] != q:
        if src[i] == '\\':
            nxt = src[i + 1]
            out.append({'n': '\n', 't': '\t'}.get(nxt, nxt))
            i += 2
        else:
            out.append(src[i])
            i += 1
    return ''.join(out), i + 1


def target_file(page: str) -> Path | None:
    parts = [p for p in page.split('/') if p]
    if parts and parts[0] == 'napravleniya':
        return CONTENT / 'directions' / f'{parts[1]}.ts'
    if parts and parts[0] in ('sobytiya', 'festivali'):
        return CONTENT / 'pages.ts'
    return None


def js_str(s: str) -> str:
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()
    manifest = json.loads((HERE / 'data' / 'media-manifest.json').read_text())['images']
    by_file: dict[Path, list[dict]] = {}
    for v in manifest.values():
        if v.get('kind') != 'card':
            continue
        f = target_file(v['page'])
        if f:
            by_file.setdefault(f, []).append(v)
    problems = 0
    for f, items in by_file.items():
        src = f.read_text(encoding='utf-8')
        # every `title: '...', text: '...'` pair: (normalised title, title, index after the text literal, start)
        pairs = []
        for m in re.finditer(r'title:\s*(?=[\'"])', src):
            title, end = read_string(src, m.end())
            tm = re.match(r'\s*,\s*text:\s*(?=[\'"])', src[end:])
            if not tm:
                continue
            _, text_end = read_string(src, end + tm.end())
            pairs.append((norm(title), title, text_end, m.start()))
        edits = []
        for v in items:
            hits = [p for p in pairs if p[0] == norm(v['label'])]
            if len(hits) != 1:
                print(f"!! {f.name}: {len(hits)} matches for «{v['label']}»", file=sys.stderr)
                problems += 1
                continue
            _, title, text_end, start = hits[0]
            if re.match(r'\s*,\s*image:', src[text_end:text_end + 40]):
                continue
            line_start = src.rfind('\n', 0, start) + 1
            indent = re.match(r'[ \t]*', src[line_start:]).group(0)
            api_alt = v.get('apiAlt') or ''
            meaningful = bool(api_alt) and not re.search(r'\.(jpe?g|png|webp)$|^img|photoroom', api_alt, re.I)
            alt = api_alt if meaningful else f'«{title}» — фото к программе'
            block = (
                f',\n{indent}image: {{\n{indent}\tsrc: {js_str(v["src"])},\n{indent}\twidth: {v["width"]},\n'
                f'{indent}\theight: {v["height"]},\n{indent}\talt: {js_str(alt)}'
                + ('' if meaningful else f',\n{indent}\taltGenerated: true')
                + f'\n{indent}}}'
            )
            edits.append((text_end, block))
        for pos, block in sorted(edits, reverse=True):
            src = src[:pos] + block + src[pos:]
        print(f'{f.relative_to(ROOT)}: {len(edits)} images inserted')
        if not args.dry_run and edits:
            f.write_text(src, encoding='utf-8')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
