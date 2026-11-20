#!/usr/bin/env python3
"""Image audit: every image the OLD site (personamodel.ru) displays vs. what the rebuilt content references.

Usage (stdlib + bs4):
    python3 scripts/audit_images.py --crawl <crawl dir with html/NN.html + html/manifest.tsv> \
        [--css-dir <dir with the site CSS, fetched with GET when absent>] [--out scripts/data/image-audit.json]

For every old page it lists each image shown by the page: <img> (src / data-src / data-lazy-src / srcset /
<noscript>), <source srcset>, <video poster>, inline `style="background-image"`, CSS `background-image` rules from the
inline <style> blocks AND the linked (aggregated Elementor) stylesheet resolved to the elements they style (CSS
selectors are evaluated against the page DOM), Elementor `data-settings` JSON (gallery / carousel / video overlay /
poster), and image links (lightbox).  Size suffixes (-1024x514, -scaled, `.webp` siblings) are normalised to the
original file.  Each image is classified:

    content   a page-specific image in the page body
    template  header / footer / popup / mega-menu or an image that is on (nearly) every page
    related   cards of the "related directions" loop at the page tail
    decorative  svg, emoji, ornaments
    external  tracking pixels, other hosts

The "page content" set is diffed against the images the matching content module references (via
`scripts/data/media-manifest.json`: old path -> local file), and the report is written as JSON.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from bs4 import BeautifulSoup

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SITE = 'https://personamodel.ru'
UA = 'Mozilla/5.0 (compatible; content-migration/1.0)'
IMG_EXT = ('.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif')
EXCEPTIONS = HERE / 'data' / 'image-audit-exceptions.json'  # [{oldPath, image (normalised stem), reason}]
TEMPLATE_SHARE = 0.85  # image on >= 85% of the pages => template-shared
DECORATIVE_NAME = re.compile(r'(^|/)(frame|ellipse|rectangle|vector|union|star|polygon)-?\d*[^/]*$', re.I)


def stem_key(path: str) -> str:
    """dir/stem with the `.webp` sibling suffix, extension, size suffix and -scaled removed."""
    p = path
    if p.endswith('.webp') and Path(p[:-5]).suffix.lower() in ('.jpg', '.jpeg', '.png'):
        p = p[:-5]
    p = re.sub(r'\.[A-Za-z0-9]+$', '', p)
    p = re.sub(r'-\d+x\d+$', '', p)
    p = re.sub(r'-scaled$', '', p)
    return p


def to_path(url: str) -> str | None:
    """Local `/wp-content/...` path of an image URL, or None for data: URIs / other hosts."""
    url = url.strip().strip('"\'')
    if not url or url.startswith('data:'):
        return None
    u = urllib.parse.urlparse(url)
    if u.netloc and u.netloc not in ('personamodel.ru', 'www.personamodel.ru'):
        return 'EXTERNAL:' + url
    path = urllib.parse.unquote(u.path)
    return path if path.lower().endswith(IMG_EXT) else None


def srcset_urls(value: str) -> list[str]:
    return [part.strip().split()[0] for part in value.split(',') if part.strip()]


def walk_json(o: Any, out: list[tuple[str, str]], key: str = '') -> None:
    if isinstance(o, dict):
        for k, v in o.items():
            walk_json(v, out, k)
    elif isinstance(o, list):
        for v in o:
            walk_json(v, out, key)
    elif isinstance(o, str) and o.lower().split('?')[0].endswith(IMG_EXT):
        out.append((key, o))


def location(el: Any) -> str:
    for parent in [el, *el.parents]:
        t = parent.get('data-elementor-type') if hasattr(parent, 'get') else None
        if t in ('header', 'footer', 'popup'):
            return t
        if t == 'loop-item':
            return 'related'
        if t:
            return 'main'
    return 'main'


def widget_of(el: Any) -> tuple[str | None, str | None, bool]:
    """(widget type, element id, absolute-positioned?) of the nearest Elementor widget/container."""
    for parent in [el, *el.parents]:
        if hasattr(parent, 'get') and parent.get('data-id'):
            cls = ' '.join(parent.get('class') or [])
            return parent.get('data-widget_type'), parent.get('data-id'), 'elementor-absolute' in cls
    return None, None, False


def split_selectors(group: str) -> list[str]:
    parts, depth, cur = [], 0, ''
    for ch in group:
        if ch in '([':
            depth += 1
        elif ch in ')]':
            depth -= 1
        if ch == ',' and depth == 0:
            parts.append(cur)
            cur = ''
        else:
            cur += ch
    return [p.strip() for p in [*parts, cur] if p.strip()]


def specificity(sel: str) -> tuple[int, int, int]:
    ids = len(re.findall(r'#[\w-]+', sel))
    classes = len(re.findall(r'\.[\w-]+|\[[^\]]*\]|:(?!not\b|is\b|where\b|:)[\w-]+', sel))
    elems = len(re.findall(r'(?:^|[\s>+~(])[a-z][\w-]*', sel))
    return ids, classes, elems


STATE_RE = re.compile(r'(::?(?:before|after))$')
SKIP_STATE_RE = re.compile(r'::?(hover|focus|active|visited|focus-within|focus-visible|first-letter|first-line)')


def css_decls(css: str) -> list[dict[str, Any]]:
    """Background declarations of every rule: selector, url (None for `none`), !important."""
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    out = []
    for m in re.finditer(r'([^{}]+)\{([^{}]*)\}', css):
        body = m.group(2)
        for dm in re.finditer(r'(background-image|background)\s*:\s*([^;]*)', body):
            prop, value = dm.group(1), dm.group(2)
            important = '!important' in value
            um = re.search(r'url\(\s*([^)]+?)\s*\)', value)
            if um:
                url: str | None = um.group(1)
            elif prop == 'background-image' and re.search(r'\bnone\b', value):
                url = None
            else:
                continue  # colour-only shorthand: not tracked
            for sel in split_selectors(m.group(1)):
                out.append({'selector': sel, 'url': url, 'important': important})
    return out


def fetch_css(href: str, css_dirs: list[Path]) -> str:
    """Stylesheet text for `href`, cached per file name AND `?ver=` (the aggregated Elementor CSS keeps its name while its
    content changes).  An earlier version fell back to any local `all.css` for every `all-css-*` link: a stale snapshot
    that lacked the late per-page rules (e.g. the festivals flip-box backgrounds) and hid them from the audit."""
    parsed = urllib.parse.urlparse(href)
    name = Path(parsed.path).name
    ver = urllib.parse.parse_qs(parsed.query).get('ver', [''])[0]
    key = f'{name}@{ver}' if ver else name
    for d in css_dirs:
        cand = d / key
        if cand.exists():
            return cand.read_text(encoding='utf-8', errors='replace')
    url = href if href.startswith('http') else SITE + href
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=90) as r:
        text = r.read().decode('utf-8', errors='replace')
    for d in css_dirs:
        if d.exists():
            (d / key).write_text(text, encoding='utf-8')
            break
    return text


def label_of(el: Any) -> str | None:
    """Title of the flip-box / card the element belongs to (to map photos to programme cards)."""
    if el is None:
        return None
    for parent in [el, *el.parents]:
        if hasattr(parent, 'get') and parent.get('data-widget_type') == 'flip-box.default':
            t = parent.select_one('.elementor-flip-box__layer__title')
            return t.get_text(' ', strip=True) if t else None
    return None


def collect(soup: BeautifulSoup, css_texts: list[str]) -> list[dict[str, Any]]:
    refs: list[dict[str, Any]] = []
    position = {id(t): n for n, t in enumerate(soup.find_all(True))}  # document order of every element

    def add(url: str, kind: str, el: Any, **extra: Any) -> None:
        path = to_path(url)
        if not path:
            return
        wtype, wid, absolute = widget_of(el) if el is not None else (None, None, False)
        refs.append({'path': path, 'kind': kind, 'where': location(el) if el is not None else 'main',
                     'widget': wtype, 'elementId': wid, 'absolute': absolute,
                     'label': label_of(el), 'line': position.get(id(el)), **extra})

    for img in soup.find_all('img'):
        alt = img.get('alt') or ''
        for attr in ('src', 'data-src', 'data-lazy-src', 'data-orig-src', 'data-persona-hold'):
            if img.get(attr):
                add(img[attr], 'img', img, alt=alt)
        for attr in ('srcset', 'data-srcset', 'data-lazy-srcset', 'data-persona-hold-srcset'):
            if img.get(attr):
                for u in srcset_urls(img[attr]):
                    add(u, 'img-srcset', img, alt=alt)
    for tag in soup.find_all('source'):
        for attr in ('srcset', 'data-srcset'):
            if tag.get(attr):
                for u in srcset_urls(tag[attr]):
                    add(u, 'source', tag)
    for noscript in soup.find_all('noscript'):
        inner = BeautifulSoup(noscript.decode_contents(), 'lxml')
        for img in inner.find_all('img'):
            if img.get('src'):
                add(img['src'], 'noscript-img', noscript, alt=img.get('alt') or '')
    for v in soup.find_all('video'):
        if v.get('poster'):
            add(v['poster'], 'video-poster', v)
    for a in soup.find_all('a', href=True):
        if a['href'].lower().split('?')[0].endswith(IMG_EXT) and 'wp-content' in a['href']:
            add(a['href'], 'image-link', a)
    for el in soup.find_all(style=True):
        for um in re.finditer(r'url\(\s*([^)]+?)\s*\)', el['style']):
            add(um.group(1), 'inline-style-bg', el)
    for el in soup.find_all(attrs={'data-settings': True}):
        try:
            data = json.loads(el['data-settings'])
        except ValueError:
            continue
        found: list[tuple[str, str]] = []
        walk_json(data, found)
        for key, u in found:
            add(u, f'data-settings:{key}', el)
    for el in soup.find_all(attrs={'data-elementor-settings': True}):
        try:
            data = json.loads(el['data-elementor-settings'])
        except ValueError:
            continue
        found = []
        walk_json(data, found)
        for key, u in found:
            add(u, f'elementor-settings:{key}', el)
    # Posters injected by inline scripts as `<elementor id>: '<url>'` maps (e.g. the home «Наши выступления» lightbox):
    # shown on the element with that data-id when it exists on the page.
    for script in soup.find_all('script'):
        text = script.string or ''
        for m in re.finditer(r"['\"]?([0-9a-f]{7})['\"]?\s*:\s*['\"]((?:https?:)?/[^'\"]+?\.(?:jpe?g|png|webp))(?:\?[^'\"]*)?['\"]", text):
            target = soup.find(attrs={'data-id': m.group(1)})
            if target is not None:
                add(m.group(2), 'script-poster', target)
    # CSS: inline <style> blocks + linked stylesheets in document order, cascade-resolved against the DOM
    # (important > specificity > source order) so overridden backgrounds are not counted as displayed.
    order = 0
    cascade: dict[tuple[int, str], list[tuple[Any, dict[str, Any], Any]]] = defaultdict(list)
    sources = []
    link_iter = iter(css_texts)
    for node in soup.find_all(['style', 'link']):
        if node.name == 'style':
            sources.append(node.get_text())
        elif node.get('rel') and 'stylesheet' in node.get('rel') and ('personamodel' in (node.get('href') or '') or (node.get('href') or '').startswith('/wp-content')):
            sources.append(next(link_iter, ''))
    for css in sources:
        for decl in css_decls(css):
            order += 1
            sel = decl['selector']
            if sel.startswith('@') or SKIP_STATE_RE.search(sel):
                continue
            sm = STATE_RE.search(sel)
            state = sm.group(1) if sm else ''
            plain = STATE_RE.sub('', sel).strip()
            path = to_path(decl['url']) if decl['url'] else None
            if decl['url'] and not path:
                continue
            if not plain:
                continue
            try:
                matches = soup.select(plain, limit=60)
            except Exception:  # unsupported selector syntax
                continue
            rank = (decl['important'], specificity(plain), order)
            for el in matches:
                cascade[(id(el), state)].append((rank, {'path': path, 'selector': plain[-90:]}, el))
    for (_, state), decls in cascade.items():
        decls.sort(key=lambda d: d[0])
        win_rank, win, el = decls[-1]
        if win['path']:
            add(win['path'], 'css-bg' + (state or ''), el, selector=win['selector'])
        for rank, d, _el in decls[:-1]:
            if d['path'] and d['path'] != win['path']:
                add(d['path'], 'css-bg-overridden', el, selector=d['selector'], overriddenBy=win['path'])
    # a poster injected by script replaces the static poster of the same widget
    replaced = {r['elementId'] for r in refs if r['kind'] == 'script-poster'}
    for r in refs:
        if r['elementId'] in replaced and r['kind'] != 'script-poster':
            r['kind'] = 'js-replaced'
    return refs


def load_content_images(path: Path | None) -> dict[str, dict[str, Any]]:
    if path is None:
        out = subprocess.run(['bun', str(HERE / 'content-images.ts')], cwd=ROOT, capture_output=True, text=True, check=True)
        return json.loads(out.stdout)
    return json.loads(path.read_text())


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--crawl', required=True, type=Path)
    ap.add_argument('--css-dir', action='append', type=Path, default=[])
    ap.add_argument('--content-json', type=Path, help='output of scripts/content-images.ts (default: run it with bun)')
    ap.add_argument('--out', type=Path, default=HERE / 'data' / 'image-audit.json')
    args = ap.parse_args()

    manifest = json.loads((HERE / 'data' / 'media-manifest.json').read_text())['images']
    by_stem = {stem_key(k): v['src'] for k, v in manifest.items()}
    content = load_content_images(args.content_json)
    exceptions = {(e['oldPath'], e['image']): e['reason'] for e in json.loads(EXCEPTIONS.read_text())} if EXCEPTIONS.exists() else {}
    all_content_srcs = {src for entry in content.values() for src in entry['images']}
    by_name: dict[str, str] = {}  # basename fallback: the same file re-uploaded in another month folder
    for k, v in manifest.items():
        by_name.setdefault(stem_key(Path(k).name), v['src'])

    pages = []
    for line in (args.crawl / 'html' / 'manifest.tsv').read_text().splitlines():
        cols = line.split('\t')
        if len(cols) >= 6 and cols[1] == '200':
            pages.append((cols[0], cols[5]))
    seen_urls = set()
    css_cache: dict[str, str] = {}
    raw: dict[str, list[dict[str, Any]]] = {}
    html_text: dict[str, str] = {}
    for num, url in pages:
        if url in seen_urls:
            continue
        seen_urls.add(url)
        soup = BeautifulSoup((args.crawl / 'html' / f'{num}.html').read_text(encoding='utf-8'), 'lxml')
        css_texts = []
        for link in soup.find_all('link', rel=lambda r: r and 'stylesheet' in r):
            href = link.get('href') or ''
            if 'personamodel' in href or href.startswith('/wp-content'):
                if href not in css_cache:
                    try:
                        css_cache[href] = fetch_css(href, args.css_dir or [args.crawl / 'css', args.crawl.parent / 'css'])
                    except Exception as exc:  # stylesheet gone / unreachable: audit without it, but say so
                        print(f'warning: cannot load {href}: {exc}', file=sys.stderr)
                        css_cache[href] = ''
                css_texts.append(css_cache[href])
        raw[url] = collect(soup, css_texts)
        html_text[url] = (args.crawl / 'html' / f'{num}.html').read_text(encoding='utf-8').replace('\\/', '/')

    # frequency of each normalised image across pages
    freq: Counter[str] = Counter()
    for refs in raw.values():
        for key in {stem_key(r['path']) for r in refs}:
            freq[key] += 1
    n_pages = len(raw)

    report_pages = []
    totals = {'content': 0, 'migrated': 0, 'missing': 0}
    for url, refs in raw.items():
        old_path = urllib.parse.unquote(urllib.parse.urlparse(url).path)
        entry = content.get(old_path) or content.get(urllib.parse.quote(old_path)) or {'newPath': None, 'images': []}
        migrated_srcs = set(entry['images'])
        groups: dict[str, dict[str, Any]] = {}
        for r in refs:
            if r['path'].startswith('EXTERNAL:'):
                key = r['path']
            else:
                key = stem_key(r['path'])
            g = groups.setdefault(key, {'key': key, 'files': set(), 'kinds': set(), 'where': set(), 'widgets': set(),
                                        'elements': set(), 'alts': set(), 'selectors': set(), 'absolute': set(), 'labels': set(),
                                        'lines': [], 'overriddenBy': set()})
            g['files'].add(r['path'])
            g['kinds'].add(r['kind'])
            g['where'].add(r['where'])
            if r['widget']:
                g['widgets'].add(r['widget'])
            if r['elementId']:
                g['elements'].add(r['elementId'])
            g['absolute'].add(bool(r['absolute']))
            if r.get('alt'):
                g['alts'].add(r['alt'])
            if r.get('selector'):
                g['selectors'].add(r['selector'])
            if r.get('label'):
                g['labels'].add(r['label'])
            if r.get('line'):
                g['lines'].append(r['line'])
            if r.get('overriddenBy'):
                g['overriddenBy'].add(r['overriddenBy'])
        items = []
        for key, g in groups.items():
            where = sorted(g['where'])
            shown = g['kinds'] - {'css-bg-overridden', 'js-replaced'}
            if key.startswith('EXTERNAL:'):
                cls = 'external'
            elif not shown:
                cls = 'overridden'
            elif key.endswith('.svg') or any(f.lower().endswith('.svg') for f in g['files']):
                cls = 'decorative'
            elif DECORATIVE_NAME.search(key) and 'main' not in where:
                cls = 'decorative'
            elif freq[key] / n_pages >= TEMPLATE_SHARE or set(where) <= {'header', 'footer', 'popup'}:
                cls = 'template'
            elif set(where) == {'related'}:
                cls = 'related'
            else:
                cls = 'content'
            local = by_stem.get(key) or by_name.get(stem_key(Path(key).name))
            in_content = bool(local and local in migrated_srcs)
            items.append({
                'image': key + Path(sorted(g['files'])[0]).suffix if not key.startswith('EXTERNAL:') else key,
                'class': cls, 'where': where, 'kinds': sorted(g['kinds']), 'widgets': sorted(g['widgets']),
                'elements': sorted(g['elements']), 'onPages': freq[key],
                'selectors': sorted(g['selectors'])[:2], 'alts': sorted(g['alts'])[:1],
                'files': sorted(g['files']), 'labels': sorted(g['labels']), 'line': min(g['lines']) if g['lines'] else None,
                'overriddenBy': sorted(g['overriddenBy']),
                'localSrc': local, 'migrated': in_content if cls == 'content' else None,
                'shownElsewhereOnRebuild': bool(local and local in all_content_srcs)
            })
        seen_keys = set(groups)
        raw_only = sorted({stem_key(m) for m in re.findall(r'/wp-content/uploads/[^\s"\'()<>\\&;]+?\.(?:jpe?g|png|webp|gif|avif)(?![\w])', html_text[url])} - seen_keys)
        for i in items:
            reason = exceptions.get((old_path, stem_key(i['files'][0]) if i['files'] else ''))
            i['accepted'] = reason if i['class'] == 'content' and not i['migrated'] else None
        content_items = [i for i in items if i['class'] == 'content']
        missing = [i for i in content_items if not i['migrated'] and not i['accepted']]
        accepted = [i for i in content_items if i['accepted']]
        totals['content'] += len(content_items)
        totals['migrated'] += len([i for i in content_items if i['migrated']])
        totals['missing'] += len(missing)
        totals['accepted'] = totals.get('accepted', 0) + len(accepted)
        report_pages.append({
            'oldUrl': url, 'oldPath': old_path, 'newPath': entry['newPath'],
            'counts': dict(Counter(i['class'] for i in items)),
            'content': len(content_items), 'migrated': len([i for i in content_items if i['migrated']]),
            'missing': len(missing), 'accepted': len(accepted),
            'missingImages': [i['image'] for i in missing], 'rawOnly': raw_only, 'images': sorted(items, key=lambda i: (i['class'], i['line'] or 0, i['image']))
        })

    shared = sorted(((k, c) for k, c in freq.items() if c / n_pages >= TEMPLATE_SHARE), key=lambda kc: -kc[1])
    report = {'pages': n_pages, 'totals': totals, 'templateShared': [{'image': k, 'pages': c} for k, c in shared],
              'perPage': report_pages}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, ensure_ascii=False, indent=1) + '\n')

    print(f"{'old path':60} {'content':>7} {'migr.':>6} {'missing':>7} {'accepted':>8}")
    for p in report_pages:
        print(f"{p['oldPath'][:60]:60} {p['content']:7d} {p['migrated']:6d} {p['missing']:7d} {p['accepted']:8d}")
    print('TOTAL', totals)
    return 0


if __name__ == '__main__':
    sys.exit(main())
