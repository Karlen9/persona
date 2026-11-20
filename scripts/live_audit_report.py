#!/usr/bin/env python3
"""Turn the raw live-browser dumps (scripts/live_audit.mjs) into the two audit reports.

Usage:
    python3 scripts/live_audit_report.py --raw <dir with NN.json> [--stage before|after]

Writes scripts/data/live-video-audit.json (videos presented by the old pages after all runtime swaps, compared with the
rebuilt content) and scripts/data/live-image-audit.json (every image rendered live in the page body, outside header /
footer / menus / popups / cookie UI, vs. the images the rebuilt content references).  `--stage before` keeps the numbers
as a snapshot (`before` key); `--stage after` (default) fills `after` and merges an existing `before` block.
Needs `bun` (content-images.ts / content-videos.ts) and the media manifest.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import urllib.parse
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
DATA = HERE / 'data'
SITE = 'https://personamodel.ru'
SHARED_MIN_PAGES = 5  # an image shown on >= 5 old pages and present somewhere in the rebuild is template-like
DECORATIVE = re.compile(r'(persona-emoji/|\.svg$|default-skin|(^|/)(frame|ellipse|rectangle|vector|union|star|polygon)-?\d*\.(png|webp|svg)$)', re.I)


ACCEPTED = [
    'Old home hero img_6233-1: the logo is baked into the photo; the rebuild uses a gallery photo.',
    'Footer banner resized_1200x800-1.jpg (footer is outside the audited page body).',
    'Decorative frames / ellipses / rectangles / vectors (frame-NN, ellipse-NN ...), default-skin.png and emoji SVGs (persona-emoji/*.svg).'
]

NOTES = {
    '26': 'Flip-box card backgrounds (chatgpt-image ...00_54_43-2..-7): the 6 flip-box widgets are display:none !important on the live page '
    '(rule `body.page-id-1053 .elementor-element-0e8d907 > .elementor-element:not(.persona-fest-tiles)`), replaced by the 6 afisha tiles. '
    'Added to the rebuild cards anyway, as requested by the task.'
}


def stem_key(path: str) -> str:
    p = path
    if p.endswith('.webp') and Path(p[:-5]).suffix.lower() in ('.jpg', '.jpeg', '.png'):
        p = p[:-5]
    p = re.sub(r'\.[A-Za-z0-9]+$', '', p)
    p = re.sub(r'-\d+x\d+$', '', p)
    p = re.sub(r'-scaled$', '', p)
    p = re.sub(r'-e\d{10,}$', '', p)  # Elementor crop suffix
    return p


def norm_url(url: str) -> str | None:
    url = url.strip()
    if not url or url.startswith('data:'):
        return None
    u = urllib.parse.urlparse(urllib.parse.urljoin(SITE + '/', url))
    if u.netloc not in ('personamodel.ru', 'www.personamodel.ru'):
        return None
    return urllib.parse.unquote(u.path)


def absolute(url: str | None) -> str | None:
    if not url:
        return None
    return urllib.parse.urljoin(SITE + '/', url)


def snapshots(raw: dict[str, Any]) -> list[dict[str, Any]]:
    return [raw['base'], *raw.get('extra', [])]


def rendered_images(raw: dict[str, Any]) -> tuple[dict[str, dict[str, Any]], dict[str, dict[str, Any]]]:
    """(shown, hidden): normalised stem -> {url, kinds, where}. `hidden` = in the DOM but never visible (display:none ...)."""
    shown: dict[str, dict[str, Any]] = {}
    hidden: dict[str, dict[str, Any]] = {}

    def add(target: dict[str, dict[str, Any]], url: str, kind: str, info: dict[str, Any]) -> None:
        path = norm_url(url)
        if not path or DECORATIVE.search(path):
            return
        entry = target.setdefault(stem_key(path), {'url': path, 'kinds': set(), 'labels': set()})
        entry['kinds'].add(kind)
        label = (info.get('flip') or {}).get('title') or info.get('heading') or info.get('section')
        if label:
            entry['labels'].add(label)

    for snap in snapshots(raw):
        for b in snap['bg']:
            for url in b['urls']:
                add(shown if b['visible'] else hidden, url, 'css-bg' + (b['pseudo'] or ''), b)
        for i in snap['img']:
            if (i['naturalWidth'] > 1 or i['visible']) and i['src']:
                add(shown if i['visible'] else hidden, i['src'], 'img', i)
        for z in snap.get('lazy', []):
            add(shown if z['visible'] else hidden, z['url'], 'lazy:' + z['attr'], z)
        for v in snap['videos']:
            if v.get('poster') and v['kind'] == 'video':
                add(shown if v['visible'] else hidden, v['poster'], 'video-poster', v)
    for k in list(hidden):
        if k in shown:
            del hidden[k]
    for d in (shown, hidden):
        for e in d.values():
            e['kinds'] = sorted(e['kinds'])
            e['labels'] = sorted(e['labels'])[:3]
    return shown, hidden


def video_items(raw: dict[str, Any]) -> list[dict[str, Any]]:
    # Carousel widgets: the settled snapshot only (stepping a slider afterwards clones slides, Swiper loop).
    # Everything else (tab panes) may become visible only in a later snapshot, so all snapshots count.
    seen: dict[str, dict[str, Any]] = {}
    for n, snap in enumerate(snapshots(raw)):
        for w in snap['widgets']:
            if (w.get('widgetType') or 'video').split('.')[0] != 'video':
                continue  # the carousel widget that merely contains the lightboxes
            if w.get('carousel') and n > 0:
                continue
            src = w.get('lightboxUrl') or w.get('hostedUrl') or w.get('youtubeUrl') or w.get('videoSrc') or w.get('iframeSrc')
            overlay_bg = re.findall(r'url\("?([^")]+)"?\)', w.get('overlayBg') or '')
            tab = (w.get('tab') or {}).get('label')
            item = {
                'widgetId': w['id'],
                'section': (w.get('section') or '') + (f' / {tab}' if tab else ''),
                'src': absolute(src),
                'poster': {
                    'overlayImg': (w.get('overlayImg') or {}).get('src'),
                    'overlayBackground': overlay_bg[0] if overlay_bg else None,
                    'videoPosterAttr': absolute(w.get('videoPoster')),
                    'lightboxPoster': absolute(w.get('lightboxPoster')),
                    'overlaySetting': absolute(w.get('overlaySetting'))
                },
                'caption': w.get('caption'),
                'visible': w['visible'],
                'posterLoaded': (w.get('overlayImg') or {}).get('nw', 0) > 0,
                'rect': w['rect']
            }
            old = seen.get(w['id'])
            if old is None or (item['visible'] and not old['visible']):
                seen[w['id']] = item
    items = list(seen.values())
    items.sort(key=lambda i: (round(i['rect']['y'] / 40), i['rect']['x']) if i['visible'] else (10**6, 0))
    return items


def poster_of(item: dict[str, Any]) -> str | None:
    p = item['poster']
    return p['overlayBackground'] or p['overlayImg'] or p['lightboxPoster'] or p['videoPosterAttr']


def run_bun(script: str) -> Any:
    out = subprocess.run(['bun', str(HERE / script)], cwd=ROOT, capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--raw', required=True, type=Path)
    ap.add_argument('--stage', choices=['before', 'after'], default='after')
    args = ap.parse_args()

    audit = json.loads((DATA / 'image-audit.json').read_text())
    path_map: dict[str, str | None] = {}  # old url -> new path (the old static audit already resolved redirects)
    for p in audit['perPage']:
        path_map[p['oldUrl']] = p['newPath']
    manifest = json.loads((DATA / 'media-manifest.json').read_text())['images']
    local_to_stems: dict[str, set[str]] = defaultdict(set)
    for old, v in manifest.items():
        local_to_stems[v['src']].add(stem_key(old))
        local_to_stems[v['src']].add(stem_key(Path(old).name))
    content_images = run_bun('content-images.ts')
    content_videos = run_bun('content-videos.ts')
    exceptions = json.loads((DATA / 'image-audit-exceptions.json').read_text()) if (DATA / 'image-audit-exceptions.json').exists() else []
    accepted_stems = {stem_key(e['image']): e['reason'] for e in exceptions}
    accepted_stems.update({
        stem_key('/wp-content/uploads/2026/03/img_6233-1'): 'Old home hero: the logo is baked into the photo; the rebuild uses a gallery photo (accepted).',
        stem_key('/wp-content/uploads/2026/01/resized_1200x800-1'): 'Footer banner of the old site (accepted).'
    })

    pages = []
    for f in sorted(args.raw.glob('*.json')):
        raw = json.loads(f.read_text())
        pages.append(raw)
    rendered = {raw['id']: rendered_images(raw) for raw in pages}
    on_pages: Counter[str] = Counter()
    for shown, _ in rendered.values():
        on_pages.update(shown.keys())
    rebuild_all: set[str] = set()
    for entry in content_images.values():
        for src in entry['images']:
            rebuild_all |= local_to_stems.get(src, set())

    image_pages, video_pages = [], []
    seen_urls: set[str] = set()
    for raw in pages:
        url = raw['url']
        if url in seen_urls:
            continue
        seen_urls.add(url)
        old_path = urllib.parse.unquote(urllib.parse.urlparse(url).path)
        new_path = path_map.get(url)
        shown, hidden = rendered[raw['id']]
        entry = content_images.get(old_path) or content_images.get(urllib.parse.urlparse(url).path)
        rebuild_stems: set[str] = set()
        if old_path == '/':  # the home poster carousel shows the direction cards (content-images.ts files them under /brunches/)
            entry = {'images': [*(entry or {'images': []})['images'], *(content_images.get('/brunches/') or {'images': []})['images']]}
        if entry:
            for src in entry['images']:
                rebuild_stems |= local_to_stems.get(src, set())
        missing, deliberate, present = [], [], []
        for stem, info in sorted(shown.items()):
            base = stem_key(Path(info['url']).name)
            if stem in rebuild_stems or base in rebuild_stems:
                present.append({'image': info['url'], 'kinds': info['kinds']})
            elif stem in accepted_stems:
                deliberate.append({'image': info['url'], 'reason': accepted_stems[stem]})
            elif on_pages[stem] >= SHARED_MIN_PAGES and (stem in rebuild_all or base in rebuild_all):
                deliberate.append({'image': info['url'], 'reason': f'template-like image shown on {on_pages[stem]} old pages; present elsewhere in the rebuild (shared component)'})
            else:
                missing.append({'image': info['url'], 'kinds': info['kinds'], 'labels': info['labels']})
        hidden_list = [{'image': i['url'], 'labels': i['labels'], 'inRebuild': s in rebuild_stems, 'reason': NOTES.get(raw['id'], 'in the DOM but display:none / zero-size on the live page at 1440px')} for s, i in sorted(hidden.items())]
        image_pages.append({
            'id': raw['id'], 'oldUrl': url, 'newPath': new_path,
            'shownLiveCount': len(shown), 'presentInRebuildCount': len(present), 'missingCount': len(missing),
            'shownLive': [i['image'] for i in present] + [i['image'] for i in deliberate] + [i['image'] for i in missing],
            'presentInRebuild': [i['image'] for i in present],
            'missing': missing, 'notMigratedDeliberately': deliberate, 'inDomButHiddenLive': hidden_list
        })
        # videos
        items = video_items(raw)
        sections: dict[str, list[dict[str, Any]]] = defaultdict(list)
        for it in items:
            sections[it['section'] or ''].append(it)
        rebuilt = content_videos.get(new_path or '', [])
        live_sections = []
        for heading, its in sections.items():
            presented = [i for i in its if i['visible']]
            live_sections.append({
                'section': heading, 'count': len(presented),
                'videos': [{'order': n + 1, 'widgetId': i['widgetId'], 'src': i['src'], 'posterRendered': poster_of(i), 'poster': i['poster'], 'caption': i['caption'], 'posterLoaded': i['posterLoaded']} for n, i in enumerate(presented)],
                'notPresented': [{'widgetId': i['widgetId'], 'src': i['src']} for i in its if not i['visible']]
            })
        live_srcs = [(v['src'] or '').split('?')[0] for s in live_sections for v in s['videos']]
        live_posters = [stem_key(norm_url(v['posterRendered'] or '') or '') for s in live_sections for v in s['videos']]
        re_srcs = [v['src'].split('?')[0] for s in rebuilt for v in s['videos']]
        mp = {v['src']: v for s in rebuilt for v in s['videos']}
        re_posters = []
        for s in rebuilt:
            for v in s['videos']:
                re_posters.append(next(iter(sorted(local_to_stems.get(v['poster'] or '', {''}))), ''))
        ok = live_srcs == re_srcs and all(
            lp in local_to_stems.get(v['poster'] or '', set()) or lp == ''
            for lp, v in zip(live_posters, [v for s in rebuilt for v in s['videos']])
        )
        video_pages.append({
            'id': raw['id'], 'oldUrl': url, 'newPath': new_path, 'liveSections': live_sections,
            'liveCount': len(live_srcs), 'rebuildCount': len(re_srcs), 'rebuildSrcs': re_srcs,
            'matchesRebuild': ok,
            'sameVideosDifferentOrderOrUploadFolder': (not ok) and sorted(x.rsplit('/', 1)[-1] for x in live_srcs) == sorted(x.rsplit('/', 1)[-1] for x in re_srcs)
        })

    img_summary = {'pagesCovered': len(image_pages), 'pagesWithMissing': sum(1 for p in image_pages if p['missingCount']), 'missingTotal': sum(p['missingCount'] for p in image_pages)}
    vid_summary = {'pagesCovered': len(video_pages), 'pagesMismatching': sum(1 for p in video_pages if p['liveCount'] and not p['matchesRebuild'] and not p['sameVideosDifferentOrderOrUploadFolder']), 'liveVideosTotal': sum(p['liveCount'] for p in video_pages)}
    stage = args.stage
    for fname, key, pages_out, summary in (('live-image-audit.json', 'images', image_pages, img_summary), ('live-video-audit.json', 'videos', video_pages, vid_summary)):
        path = DATA / fname
        old = json.loads(path.read_text()) if path.exists() else {}
        body: dict[str, Any] = {'method': 'headless Chrome (puppeteer-core), 1440x900, scrolled through, 3s+ settle, tabs clicked, sliders stepped; see scripts/live_audit.mjs', 'generatedBy': 'scripts/live_audit_report.py', 'summary': {stage: summary}, 'acceptedExceptions': ACCEPTED, 'pages': pages_out}
        if 'summary' in old and stage == 'after':
            body['summary']['before'] = old['summary'].get('before')
        if stage == 'before':
            body['summaryBefore'] = summary
        elif 'summaryBefore' in old:
            body['summaryBefore'] = old['summaryBefore']
            body['pagesBefore'] = old.get('pagesBefore')
        if stage == 'before':
            body['pagesBefore'] = [{'id': p['id'], 'newPath': p['newPath'], **({'missingCount': p['missingCount']} if key == 'images' else {'liveCount': p['liveCount'], 'rebuildCount': p['rebuildCount'], 'matchesRebuild': p['matchesRebuild']})} for p in pages_out]
        path.write_text(json.dumps(body, ensure_ascii=False, indent=1) + '\n')
    print(json.dumps({'images': img_summary, 'videos': vid_summary}))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
