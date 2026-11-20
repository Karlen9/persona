"""Shared helpers for the content pipeline (extract / download / generate).

Run with a Python that has beautifulsoup4, lxml and pillow installed:
    python3 -m venv .venv && .venv/bin/pip install beautifulsoup4 lxml pillow

Everything here is import-only; nothing is executed on import. These scripts are
tooling for the one-off migration from personamodel.ru and are NOT imported by the app.
"""

from __future__ import annotations

import base64
import json
import re
import urllib.parse
from pathlib import Path
from typing import Any

from bs4 import BeautifulSoup, NavigableString, Tag
from bs4.element import CData, Comment, Declaration, Doctype, ProcessingInstruction

SKIP_STRINGS = (Comment, Doctype, Declaration, ProcessingInstruction, CData)

SITE = 'https://personamodel.ru'
BULLET_RE = re.compile(r'^\s*[●•▪‣]\s*')
EMOJI_DIR = '/persona-emoji/'


# --------------------------------------------------------------------------- text utils


def norm(text: str) -> str:
    """Collapse whitespace (incl. nbsp/zero-width) to single spaces and trim."""
    text = text.replace('\xa0', ' ').replace('​', '').replace('﻿', '')
    return re.sub(r'\s+', ' ', text).strip()


def style_of(el: Tag) -> dict[str, str]:
    out: dict[str, str] = {}
    for part in (el.get('style') or '').split(';'):
        if ':' in part:
            k, v = part.split(':', 1)
            out[k.strip().lower()] = v.strip().lower()
    return out


def px(value: str | None) -> int:
    m = re.match(r'(\d+(?:\.\d+)?)px', value or '')
    return int(float(m.group(1))) if m else 0


def path_of(url: str | None) -> str | None:
    """Return a site-relative path (no host, no query) for a URL on the site, else None."""
    if not url:
        return None
    if url.startswith('data:'):
        return None
    parsed = urllib.parse.urlparse(url)
    if parsed.netloc and parsed.netloc not in ('personamodel.ru', 'www.personamodel.ru'):
        return None
    return urllib.parse.unquote(parsed.path)


# --------------------------------------------------------------------------- crawl access


class Crawl:
    """Read access to the saved crawl: html/NN.html + manifest.tsv + api/*.json."""

    def __init__(self, root: str | Path) -> None:
        self.root = Path(root)
        self.pages: dict[str, str] = {}  # final url path -> file number
        manifest = (self.root / 'html' / 'manifest.tsv').read_text(encoding='utf-8').splitlines()
        for line in manifest:
            cols = line.split('\t')
            if len(cols) < 6 or cols[1] != '200':
                continue
            url = urllib.parse.unquote(cols[5])
            self.pages.setdefault(urllib.parse.urlparse(url).path, cols[0])
        self._soups: dict[str, BeautifulSoup] = {}
        self.api_pages = self._load_json('pages_*.json')
        self.api_areas = self._load_json('areas_*.json')
        self.api_media = self._load_json('media_*.json')

    def _load_json(self, pattern: str) -> list[dict[str, Any]]:
        items: list[dict[str, Any]] = []
        for f in sorted((self.root / 'api').glob(pattern)):
            items.extend(json.loads(f.read_text(encoding='utf-8')))
        return items

    def soup(self, path: str) -> BeautifulSoup:
        num = self.pages[path]
        if num not in self._soups:
            raw = (self.root / 'html' / f'{num}.html').read_text(encoding='utf-8')
            self._soups[num] = BeautifulSoup(raw, 'lxml')
        return self._soups[num]

    def rest_item(self, link_path: str) -> dict[str, Any] | None:
        for item in self.api_pages + self.api_areas:
            if urllib.parse.unquote(urllib.parse.urlparse(item['link']).path) == link_path:
                return item
        return None


# --------------------------------------------------------------------------- media refs


def img_ref(img: Tag) -> str | None:
    """Real image path of an <img> (the optimiser holds it in data-persona-hold)."""
    for attr in ('data-persona-hold', 'data-src', 'src'):
        p = path_of(img.get(attr))
        if p:
            return p
    return None


def make_ref(path: str | None, group: str, name: str | None = None, alt: str | None = None,
             alt_gen: str | None = None, width: int | None = None, height: int | None = None) -> dict[str, Any] | None:
    """An unresolved image reference. The download step turns these into TImage objects."""
    if not path:
        return None
    ref: dict[str, Any] = {'$img': path, 'group': group}
    if name:
        ref['name'] = name
    if alt:
        ref['alt'] = norm(alt)
    if alt_gen:
        ref['altGen'] = alt_gen
    if width:
        ref['w'] = width
    if height:
        ref['h'] = height
    return ref


# --------------------------------------------------------------------------- rich text


def _is_emoji_img(img: Tag) -> bool:
    hold = img.get('data-persona-hold') or img.get('src') or ''
    return EMOJI_DIR in hold or 'persona-icon' in (img.get('class') or [])


def _runs(node: Tag | NavigableString, fmt: dict[str, Any], out: list[dict[str, Any]]) -> None:
    if isinstance(node, NavigableString):
        if isinstance(node, SKIP_STRINGS):
            return
        text = str(node)
        if text:
            out.append({'t': text, **fmt})
        return
    name = node.name
    if name in ('script', 'style', 'meta', 'link', 'noscript'):
        return
    classes = node.get('class') or []
    if 'p-icon' in classes or 'p-icon-glyph' in classes:
        return
    if name == 'br':
        out.append({'t': '\n', **fmt})
        return
    if name == 'img':
        if _is_emoji_img(node) and node.get('alt'):
            out.append({'t': node['alt'], **fmt})
        return
    sub = dict(fmt)
    if name in ('strong', 'b'):
        sub['bold'] = True
    elif name in ('em', 'i'):
        sub['italic'] = True
    elif name == 'a':
        href = (node.get('href') or '').strip()
        if href and not href.startswith('#') and not href.startswith('javascript'):
            sub['href'] = href
    for child in node.children:
        _runs(child, sub, out)


def runs_of(node: Tag) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for child in node.children:
        _runs(child, {}, out)
    return out


def _fmt_key(r: dict[str, Any]) -> tuple[Any, ...]:
    return (r.get('bold', False), r.get('italic', False), r.get('href'))


def lines_of_runs(runs: list[dict[str, Any]]) -> list[list[dict[str, Any]]]:
    """Split runs at line breaks; merge adjacent same-format runs; normalise whitespace."""
    lines: list[list[dict[str, Any]]] = [[]]
    for r in runs:
        if r['t'] == '\n':
            lines.append([])
        else:
            lines[-1].append(dict(r))
    result = []
    for line in lines:
        merged: list[dict[str, Any]] = []
        for r in line:
            text = r['t'].replace('\xa0', ' ').replace('​', '')
            text = re.sub(r'\s+', ' ', text)
            if merged and _fmt_key(merged[-1]) == _fmt_key(r):
                merged[-1]['t'] += text
            else:
                merged.append({**r, 't': text})
        # trim edges
        while merged and not merged[0]['t'].strip():
            merged.pop(0)
        while merged and not merged[-1]['t'].strip():
            merged.pop()
        if merged:
            merged[0]['t'] = merged[0]['t'].lstrip()
            merged[-1]['t'] = merged[-1]['t'].rstrip()
        # re-merge after trimming (format boundaries holding only spaces)
        final: list[dict[str, Any]] = []
        for r in merged:
            if final and _fmt_key(final[-1]) == _fmt_key(r):
                final[-1]['t'] += r['t']
            else:
                final.append(r)
        if final:
            result.append(final)
    return result


def rich(line: list[dict[str, Any]]) -> dict[str, Any]:
    """{text, inline?} for one line of runs. `inline` only if there is any formatting."""
    text = ''.join(r['t'] for r in line)
    formatted = any(r.get('bold') or r.get('italic') or r.get('href') for r in line)
    out: dict[str, Any] = {'text': text}
    if formatted:
        inline = []
        for r in line:
            item: dict[str, Any] = {'text': r['t']}
            if r.get('bold'):
                item['bold'] = True
            if r.get('italic'):
                item['italic'] = True
            if r.get('href'):
                item['href'] = r['href']
            inline.append(item)
        out['inline'] = inline
    return out


def _all_bold(line: list[dict[str, Any]]) -> bool:
    return bool(line) and all(r.get('bold') for r in line if r['t'].strip())


BLOCK_TAGS = {'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'div', 'table', 'tbody', 'thead', 'tr',
              'td', 'th', 'section', 'blockquote', 'li'}


def _has_block_child(el: Tag) -> bool:
    return any(isinstance(c, Tag) and c.name in BLOCK_TAGS - {'li'} for c in el.children)


class Converter:
    """Elementor/WP rich text -> typed block array (no HTML, no styling)."""

    def __init__(self, bold_para_heading: bool = False, numbered_headings: bool = False,
                 image_group: str = 'pages') -> None:
        self.image_group = image_group
        self.bold_para_heading = bold_para_heading
        self.numbered_headings = numbered_headings
        self.blocks: list[dict[str, Any]] = []
        self.pending_icon: str | None = None

    # -- emit helpers
    @staticmethod
    def _split_leading_emoji(text: str) -> tuple[str, str] | None:
        first, _, rest = text.partition(' ')
        if rest and len(first) <= 12 and not re.search(r'[0-9A-Za-zА-Яа-яЁё]', first) \
                and all(ord(c) >= 0x2190 or c in '\u200d\ufe0f' for c in first):
            return first, rest
        return None

    def _push(self, block: dict[str, Any]) -> None:
        if block['type'] == 'heading':
            lead = self._split_leading_emoji(block['text'])
            if lead:
                block['text'] = lead[1]
                self.pending_icon = lead[0]
                if block.get('inline'):
                    runs = block['inline']
                    runs[0]['text'] = runs[0]['text'].replace(lead[0], '', 1).lstrip()
                    if not runs[0]['text']:
                        runs.pop(0)
                    if not runs:
                        del block['inline']
        if block['type'] == 'heading' and self.pending_icon:
            block['icon'] = self.pending_icon
        self.pending_icon = None
        # merge consecutive lists of same kind (bullet paragraphs rendered one by one)
        if (block['type'] == 'list' and self.blocks and self.blocks[-1]['type'] == 'list'
                and self.blocks[-1].get('_merge') and block.get('_merge')):
            self.blocks[-1]['items'].extend(block['items'])
            return
        self.blocks.append(block)

    def _line_block(self, line: list[dict[str, Any]], el: Tag | None, heading_level: int | None = None) -> None:
        text = ''.join(r['t'] for r in line).strip()
        if not text:
            return
        if len(text) <= 8 and not re.search(r'[0-9A-Za-zА-Яа-яЁё]', text) and heading_level is None:
            self.pending_icon = text  # an emoji on its own line is a card icon
            return
        if BULLET_RE.match(text):
            line = [dict(r) for r in line]
            line[0]['t'] = BULLET_RE.sub('', line[0]['t'], count=1)
            if not line[0]['t']:
                line.pop(0)
            if line:
                self._push({'type': 'list', 'ordered': False, 'items': [rich(line)], '_merge': True})
            return
        if heading_level:
            self._push({'type': 'heading', 'level': heading_level, **rich(line)})
            return
        st = style_of(el) if el is not None else {}
        fs, fw = px(st.get('font-size')), int(re.match(r'\d+', st.get('font-weight', '0') or '0').group(0))
        if el is not None and el.name == 'p':
            if fs and fs <= 12 and 'uppercase' in st.get('text-transform', ''):
                self._push({'type': 'paragraph', **rich(line), 'variant': 'eyebrow'})
                return
            if fs >= 34 and fw >= 600:
                self._push({'type': 'paragraph', **rich(line), 'variant': 'stat'})
                return
            if fs >= 16 and fw >= 500 and len(text) < 120:
                self._push({'type': 'heading', 'level': 3, **rich(line)})
                return
            if (self.bold_para_heading and _all_bold(line) and len(text) < 120
                    and not re.match(r'^\d{1,2}[:.]\d{2}', text)):
                self._push({'type': 'heading', 'level': 4, **rich(line)})
                return
            if self.numbered_headings and re.match(r'^\d{1,2}\.\s+[А-ЯЁ][^.]{3,110}$', text):
                self._push({'type': 'heading', 'level': 3, **rich(line)})
                return
        self._push({'type': 'paragraph', **rich(line)})

    # -- traversal
    def visit(self, node: Tag) -> None:
        for ch in node.children:
            if isinstance(ch, NavigableString):
                if isinstance(ch, SKIP_STRINGS):
                    continue
                if str(ch).strip():
                    self._line_block([{'t': norm(str(ch))}], None)
                continue
            self.visit_tag(ch)

    def _is_icon(self, el: Tag) -> bool:
        classes = el.get('class') or []
        if 'p-icon' in classes or 'p-icon-glyph' in classes:
            return True
        imgs = el.find_all('img')
        if el.name in ('div', 'span') and len(imgs) == 1 and _is_emoji_img(imgs[0]) and not norm(el.get_text()):
            return True
        return False

    def visit_tag(self, el: Tag) -> None:
        name = el.name
        if name in ('script', 'style', 'meta', 'link', 'title', 'noscript', 'br', 'hr'):
            return
        if self._is_icon(el):
            img = el.find('img')
            if img is not None and img.get('alt'):
                self.pending_icon = img['alt']
            return
        classes = el.get('class') or []
        if 'persona-evt-tiles' in classes or 'persona-fest-tiles' in classes:
            items = []
            for tile in el.select('.persona-evt-tile, .persona-fest-tile'):
                img = tile.find('img')
                title = tile.select_one('.persona-evt-tile__title, .persona-fest-tile__title')
                more = tile.select_one('.persona-evt-tile__more, .persona-fest-tile__more')
                item: dict[str, Any] = {'title': plain(title), 'text': plain(more)}
                if img is not None:
                    item['image'] = make_ref(img_ref(img), self.image_group, alt=img.get('alt'),
                                             alt_gen=f'Иллюстрация: {plain(title)}')
                items.append(item)
            self._push({'type': 'cards', 'items': items})
            return
        if 'persona-evt-stat' in classes:
            n = el.select_one('.persona-evt-stat__n')
            t = el.select_one('.persona-evt-stat__t')
            self._push({'type': 'stat', 'value': plain(n), 'label': plain(t)})
            return
        if name in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            level = min(max(int(name[1]), 2), 4)
            for line in lines_of_runs(runs_of(el)):
                self._line_block(line, el, heading_level=level)
            return
        if name == 'p':
            for line in lines_of_runs(runs_of(el)):
                self._line_block(line, el)
            return
        if name in ('ul', 'ol'):
            items = []
            for li in el.find_all('li', recursive=False):
                lines = lines_of_runs(runs_of(li))
                if lines:
                    items.append(rich([r for ln in lines for r in ln + [{'t': ' '}]][:-1] if len(lines) > 1 else lines[0]))
            if items:
                self._push({'type': 'list', 'ordered': name == 'ol', 'items': items})
            return
        if name in ('div', 'span', 'section', 'table', 'tbody', 'thead', 'tr', 'td', 'th', 'blockquote', 'a',
                    'strong', 'b', 'em', 'i', 'li'):
            if name in ('div', 'section', 'table', 'tbody', 'thead', 'tr', 'td', 'th', 'blockquote', 'li') \
                    and _has_block_child(el):
                self.visit(el)
                return
            if name in ('table', 'tbody', 'thead', 'tr'):
                self.visit(el)
                return
            for line in lines_of_runs(runs_of(el)):
                self._line_block(line, el if name in ('div', 'td', 'th') else None)
            return
        if name == 'img':
            if _is_emoji_img(el) and el.get('alt'):
                self._line_block([{'t': el['alt']}], None)
            return
        self.visit(el)

    def finish(self) -> list[dict[str, Any]]:
        out: list[dict[str, Any]] = []
        blocks = self.blocks
        i = 0
        while i < len(blocks):
            b = blocks[i]
            b.pop('_merge', None)
            if b['type'] == 'heading' and 'inline' in b and all(
                    r.get('bold') and not r.get('italic') and not r.get('href') for r in b['inline']):
                del b['inline']  # headings are bold by definition
            if (b['type'] == 'paragraph' and 'variant' not in b and i + 1 < len(blocks)
                    and blocks[i + 1]['type'] == 'list' and len(b['text']) < 60
                    and not re.search(r'[.!?:;,]$', b['text'])):
                b = {'type': 'heading', 'level': 4, **{k: v for k, v in b.items() if k != 'type'}}
            if b['type'] == 'paragraph' and b.get('variant') == 'stat':
                label = ''
                if i + 1 < len(blocks) and blocks[i + 1]['type'] == 'paragraph' and 'variant' not in blocks[i + 1]:
                    label = blocks[i + 1]['text']
                    i += 1
                out.append({'type': 'stat', 'value': b['text'], 'label': label})
            else:
                out.append(b)
            i += 1
        return out


def convert(el: Tag, **opts: bool) -> list[dict[str, Any]]:
    c = Converter(**opts)
    c.visit(el)
    return c.finish()


def plain(el: Tag | None) -> str:
    return norm(el.get_text(' ', strip=True)) if el is not None else ''


# --------------------------------------------------------------------------- Elementor widgets


def widgets(root: Tag, types: str | tuple[str, ...] | None = None) -> list[Tag]:
    out = []
    for w in root.find_all(attrs={'data-widget_type': True}):
        wt = w['data-widget_type'].split('.')[0]
        if types is None or wt in ((types,) if isinstance(types, str) else types):
            out.append(w)
    return out


def widget_by_id(root: Tag, wid: str) -> Tag | None:
    return root.find(attrs={'data-id': wid, 'data-widget_type': True})


def heading_text(w: Tag) -> str:
    h = w.find(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) or w
    return plain(h)


def flip_box(w: Tag) -> dict[str, str]:
    title = w.select_one('.elementor-flip-box__layer__title')
    desc = w.select_one('.elementor-flip-box__layer__description')
    return {'title': plain(title), 'text': plain(desc)}


def video_of(w: Tag, group: str, poster_name: str | None = None) -> dict[str, Any] | None:
    """Extract a hosted video from a `video` widget (lightbox or inline)."""
    src = None
    poster = None
    lb = w.find(attrs={'data-elementor-lightbox': True})
    if lb is not None:
        try:
            data = json.loads(lb['data-elementor-lightbox'])
        except json.JSONDecodeError:
            data = {}
        src = data.get('url')
        poster = (data.get('videoParams') or {}).get('poster')
    vid = w.find('video')
    if vid is not None:
        src = src or vid.get('src')
        poster = poster or vid.get('data-persona-hold-poster') or vid.get('poster')
    if not src:
        return None
    img = w.find('img')
    if img is not None and img_ref(img):
        poster = img_ref(img)  # the overlay <img> is the optimised (.webp) copy of the lightbox poster
    abs_src = src if src.startswith('http') else SITE + urllib.parse.unquote(src)
    poster_path = path_of(poster)
    return {
        'src': abs_src,
        'poster': make_ref(poster_path, group, name=poster_name) if poster_path else None
    }


def decode_popup_id(href: str) -> str | None:
    m = re.search(r'settings%3D([A-Za-z0-9%=]+)', href or '')
    if not m:
        return None
    try:
        data = json.loads(base64.b64decode(urllib.parse.unquote(m.group(1))).decode('utf-8'))
        return str(data.get('id'))
    except Exception:  # noqa: BLE001
        return None


def meta(soup: BeautifulSoup) -> dict[str, str | None]:
    def content(sel: str) -> str | None:
        el = soup.select_one(sel)
        return norm(el['content']) if el is not None and el.get('content') else None

    title = soup.find('title')
    return {
        'title': norm(title.get_text()) if title else None,
        'description': content('meta[name="description"]'),
        'ogImage': content('meta[property="og:image"]'),
        'ogTitle': content('meta[property="og:title"]'),
        'ogDescription': content('meta[property="og:description"]')
    }
