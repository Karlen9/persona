#!/usr/bin/env python3
"""Bring the video sections of src/content/** in line with what the live site presents (scripts/data/live-video-audit.json).

Usage (needs Pillow, bun, prettier via bunx):
    python3 scripts/apply_live_videos.py [--dry-run]

For the direction pages («Как проходят занятия?»), the events page, the festivals page and the home «Наши выступления»
row it rewrites the `videos: [...]` arrays: live order and count, absolute personamodel.ru video URLs (videos stay
remote), posters as rendered live (downloaded to public/media/posters/ with real dimensions and appended to the media
manifest), the live caption when the page prints one.  Size / mime type come from a range GET of each video.  The home
gallery tabs are left alone (the audit shows them identical).  Old poster files are never deleted.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import urllib.parse
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE))

import download_live_images as dli  # noqa: E402

MANIFEST = HERE / 'data' / 'media-manifest.json'
AUDIT = HERE / 'data' / 'live-video-audit.json'
DRY = '--dry-run' in sys.argv


def strip_query(url: str) -> str:
    return url.split('?')[0]


def video_meta(url: str, cache: dict[str, Any]) -> dict[str, Any]:
    url = strip_query(url)
    if url in cache:
        return cache[url]
    out = subprocess.run(['curl', '-s', '-m', '60', '-r', '0-0', '-D', '-', '-o', '/dev/null', url], capture_output=True, text=True).stdout
    size = re.search(r'content-range:\s*bytes 0-0/(\d+)', out, re.I)
    ctype = re.search(r'content-type:\s*([^\r\n;]+)', out, re.I)
    meta = {'sizeBytes': int(size.group(1)) if size else None, 'mimeType': ctype.group(1).strip() if ctype else None}
    if url.endswith('.mov'):
        meta['mimeType'] = 'video/quicktime'
    elif url.endswith('.mp4'):
        meta['mimeType'] = 'video/mp4'
    cache[url] = meta
    return meta


def ts_video(v: dict[str, Any], poster: dict[str, Any], meta: dict[str, Any], alt: str, caption: str | None) -> str:
    lines = [f"src: '{strip_query(v['src'])}'"]
    if meta.get('mimeType'):
        lines.append(f"mimeType: '{meta['mimeType']}'")
    if meta.get('sizeBytes'):
        lines.append(f"sizeBytes: {meta['sizeBytes']}")
    lines.append(
        "poster: {\n"
        f"src: '{poster['src']}',\nwidth: {poster['width']},\nheight: {poster['height']},\n"
        f"alt: '{alt}',\naltGenerated: true\n}}"
    )
    if caption:
        lines.append(f"caption: '{caption}'")
    return '{\n' + ',\n'.join(lines) + '\n}'


def match_bracket(text: str, start: int) -> int:
    """Index of the `]` closing the `[` at `start` (strings contain no brackets in these modules)."""
    depth = 0
    for i in range(start, len(text)):
        if text[i] == '[':
            depth += 1
        elif text[i] == ']':
            depth -= 1
            if depth == 0:
                return i
    raise ValueError('unbalanced')


def replace_videos(path: Path, anchor: str, new_items: list[str]) -> None:
    text = path.read_text()
    a = text.index(anchor)
    b = text.index('videos: [', a) + len('videos: ')
    e = match_bracket(text, b)
    path.write_text(text[:b] + '[\n' + ',\n'.join(new_items) + '\n]' + text[e + 1:])


def existing_alt(path: Path, anchor: str, default: str) -> str:
    text = path.read_text()
    a = text.index(anchor)
    m = re.search(r"alt: '([^']*)'", text[a:])
    return m.group(1) if m else default


def main() -> int:
    audit = json.loads(AUDIT.read_text())
    manifest = json.loads(MANIFEST.read_text())
    meta_cache_path = HERE / 'data' / 'video-meta.json'
    meta_cache = json.loads(meta_cache_path.read_text()) if meta_cache_path.exists() else {}
    seen_paths: set[str] = set()
    report = []

    def poster_of(v: dict[str, Any], page: str) -> dict[str, Any]:
        url = v['posterRendered']
        dest = '/media/posters/' + Path(urllib.parse.unquote(urllib.parse.urlparse(url).path)).name
        return dli.ensure_image(manifest, url, dest, page, 'poster', DRY)

    def build(page_path: str, videos: list[dict[str, Any]], alt_default: str) -> list[str]:
        items = []
        for v in videos:
            poster = poster_of(v, page_path)
            meta = video_meta(v['src'], meta_cache) if not DRY else {}
            alt = f"Кадр из видео: {v['caption']}" if v.get('caption') else alt_default
            if DRY:
                poster = {'width': 0, 'height': 0, **poster}
            items.append(ts_video(v, poster, meta, alt.replace("'", "\\'"), v.get('caption')))
            report.append({'page': page_path, 'src': strip_query(v['src']), 'poster': poster.get('src'), 'size': poster.get('width') and f"{poster.get('width')}x{poster.get('height')}", 'status': poster['status']})
        return items

    for page in audit['pages']:
        new_path = page['newPath']
        if not new_path or new_path in seen_paths or not page['liveCount']:
            continue
        seen_paths.add(new_path)
        sections = page['liveSections']
        if new_path.startswith('/napravleniya/'):
            slug = new_path.strip('/').split('/')[-1]
            f = ROOT / 'src' / 'content' / 'directions' / f'{slug}.ts'
            anchor = "type: 'howClassesGo'"
            alt = existing_alt(f, anchor, 'Кадр из видео занятия')
            live = [v for s in sections if s['section'].startswith('Как проходят') for v in s['videos']]
            if not DRY:
                replace_videos(f, anchor, build(new_path, live, alt))
            else:
                build(new_path, live, alt)
        elif new_path == '/sobytiya/':
            f = ROOT / 'src' / 'content' / 'pages.ts'
            anchor = "heading: 'Почему выбирают нас',\n\t\t\tvideos"
            live = [v for s in sections for v in s['videos']]
            items = build(new_path, live, 'Кадр из видео об организации событий')
            if not DRY:
                replace_videos(f, anchor, items)
        elif new_path == '/':
            f = ROOT / 'src' / 'content' / 'home.ts'
            live = [v for s in sections if s['section'].endswith('Наши выступления') for v in s['videos']]
            alt = existing_alt(f, 'performances: {', 'Кадр из видео выступления')
            items = build(new_path, live, alt)
            if not DRY:
                replace_videos(f, 'performances: {', items)
        elif new_path == '/festivali/':
            f = ROOT / 'src' / 'content' / 'pages.ts'
            live = [v for s in sections for v in s['videos']]
            items = build(new_path, live, 'Кадр из видео фестивального движения')
            if not DRY:
                text = f.read_text()
                if "type: 'video',\n\t\t\tvideos" not in text[text.index('export const festivalsPage'):text.index('export const privacyPage')]:
                    start = text.index('export const festivalsPage')
                    end = text.index('\n\t],\n\tseo:', start)
                    text = text[:end] + ",\n\t\t{\n\t\t\ttype: 'video',\n\t\t\tvideos: []\n\t\t}" + text[end:]
                    f.write_text(text)
                replace_videos(f, "type: 'video',\n\t\t\tvideos", items)
    if not DRY:
        dli.MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + '\n')
        meta_cache_path.write_text(json.dumps(meta_cache, indent=1) + '\n')
    print(json.dumps(report, ensure_ascii=False, indent=1))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
