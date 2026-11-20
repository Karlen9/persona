#!/usr/bin/env python3
"""Step 1/3 of the content pipeline: saved crawl -> structured JSON (`extracted.json`).

Usage:
    python3 scripts/extract.py --crawl <crawl dir> --out <work dir>

`<crawl dir>` holds html/NN.html (+ manifest.tsv) and api/*.json from personamodel.ru
(see scripts/fetch_crawl.py). Output images are *unresolved references* (`{"$img": path, ...}`);
scripts/download_media.py resolves and downloads them, scripts/generate_ts.py writes src/content/*.ts.

Any object may carry a `_todo` key; the TypeScript generator emits it as a
`// TODO(content): ...` comment at that spot and collects it into `contentTodos`.
The crawl data is untrusted input: this script only parses text, it never evaluates anything.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.parse
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))

from bs4 import BeautifulSoup, Tag  # noqa: E402

import content_config as cfg  # noqa: E402
from content_lib import (  # noqa: E402
    SITE, Crawl, convert, decode_popup_id, flip_box, img_ref, lines_of_runs, make_ref, meta, norm, path_of, plain,
    rich, runs_of, video_of, widgets
)

DEFAULT_OG = cfg.DEFAULT_OG_PATH


def mod_iso(item: dict[str, Any] | None) -> str | None:
    if not item:
        return None
    return item['modified_gmt'] + 'Z'


def tel_digits(href: str) -> str:
    return re.sub(r'[^\d+]', '', urllib.parse.unquote(href).replace('tel:', ''))


class Extractor:
    def __init__(self, crawl: Crawl) -> None:
        self.c = crawl
        self.todos: list[str] = []
        self.hero_bgs = self._hero_backgrounds()
        self.media_by_id = {m['id']: m for m in crawl.api_media}
        self.slug_by_wpid: dict[int, str] = {}
        self.slug_by_oldpath: dict[str, str] = {}
        for old, slug, _aud, _cat in cfg.DIRECTIONS:
            rest = crawl.rest_item(old)
            if rest:
                self.slug_by_wpid[rest['id']] = slug
            self.slug_by_oldpath[old] = slug
        self.slug_by_oldpath['/areas/salsa-i-bachata/'] = 'bachata'

    # ------------------------------------------------------------------ helpers
    def todo(self, text: str) -> str:
        if text not in self.todos:
            self.todos.append(text)
        return text

    def _hero_backgrounds(self) -> dict[int, str]:
        html = (self.c.root / 'html' / '04.html').read_text(encoding='utf-8')
        out: dict[int, str] = {}
        for m in re.finditer(r'body\.postid-(\d+) \.elementor-element-32d8742:not[^{]*\{background-image:url\("([^"]+)"\)',
                             html):
            out[int(m.group(1))] = m.group(2)
        return out

    def seo(self, path: str, og_name: str | None = None, og_group: str = 'seo') -> dict[str, Any]:
        soup = self.c.soup(path)
        m = meta(soup)
        out: dict[str, Any] = {'title': m['title'], 'description': m['description']}
        og = path_of(m['ogImage'])
        if og and not Path(og).stem.startswith('img_6233-1'):  # site-wide default share image
            out['ogImage'] = make_ref(og, og_group, name=og_name, alt_gen=m['title'] or None)
        return out

    def hdr_labels(self) -> dict[str, str]:
        """href path -> menu label from the primary header nav (verbatim)."""
        soup = self.c.soup('/')
        nav = soup.find(attrs={'data-id': '7f8e8a0', 'data-widget_type': True})
        out: dict[str, str] = {}
        for a in nav.select('a.elementor-item, a.elementor-sub-item'):
            p = path_of(a.get('href'))
            if p:
                out.setdefault(p, norm(a.get_text()))
        return out

    # ------------------------------------------------------------------ directions
    def directions(self) -> list[dict[str, Any]]:
        labels = self.hdr_labels()
        home = self.c.soup('/')
        # home loop #504 image cards and #595 bullet cards, keyed by WP id
        cards: dict[int, Tag] = {}
        for it in home.select('[data-elementor-type="loop-item"][data-elementor-id="504"]'):
            wp = int(next(c for c in it['class'] if c.startswith('e-loop-item-')).split('-')[-1])
            cards[wp] = it
        bullets: dict[int, list[str]] = {}
        for it in home.select('[data-elementor-type="loop-item"][data-elementor-id="595"]'):
            wp = int(next(c for c in it['class'] if c.startswith('e-loop-item-')).split('-')[-1])
            bullets[wp] = [plain(li) for li in it.select('li')]

        result = []
        for order, (old, slug, audience, category) in enumerate(cfg.DIRECTIONS, start=1):
            soup = self.c.soup(old)
            rest = self.c.rest_item(old)
            assert rest, old
            wp = rest['id']
            root = soup.select_one('.elementor-location-single')
            body_ws = []
            for w in widgets(root):
                if w['data-id'] == '58598f2':
                    break
                body_ws.append(w)
            by_id = {w['data-id']: w for w in body_ws}
            h1 = plain(by_id['7068d6b'])
            tagline = plain(by_id['19a9995']) if '19a9995' in by_id else None

            sections: list[dict[str, Any]] = []
            if '1031b33' in by_id:
                blocks = convert(by_id['1031b33'], bold_para_heading=True, image_group='directions')
                prog_heading = None
                if blocks and blocks[-1]['type'] == 'heading':
                    prog_heading = blocks.pop()['text']
                if blocks:
                    sections.append({'type': 'intro', 'blocks': blocks})
            else:
                prog_heading = None
            items = [flip_box(w) for w in body_ws if w['data-widget_type'].startswith('flip-box')]
            items = [i for i in items if i['title']]
            prog: dict[str, Any] = {'type': 'programme', 'items': items}
            if prog_heading:
                prog['heading'] = prog_heading
            if items:
                sections.append(prog)
            if 'e498859' in by_id:
                blocks = convert(by_id['e498859'], bold_para_heading=True, image_group='directions')
                sections.append({'type': 'article', 'blocks': blocks})
            videos: list[dict[str, Any]] = []
            seen: set[str] = set()
            for w in body_ws:
                if w['data-widget_type'].startswith('video'):
                    v = video_of(w, 'posters', poster_name=f'{slug}-video-{len(videos) + 1}')
                    if v and v['src'] not in seen:
                        seen.add(v['src'])
                        v['poster'] and v['poster'].update(
                            {'altGen': f'Кадр из видео занятия: {plain(by_id["7068d6b"])}'})
                        videos.append(v)
            if videos:
                heading = plain(by_id['afeed10']) if 'afeed10' in by_id else 'Как проходят занятия?'
                sections.append({'type': 'howClassesGo', 'heading': heading, 'videos': videos})

            # images
            card_ref = None
            if wp in cards:
                img = cards[wp].find('img')
                card_ref = make_ref(img_ref(img), 'directions', name=f'{slug}-card',
                                    alt_gen=f'Постер направления «{h1}»', width=None)
            elif rest.get('featured_media') in self.media_by_id:
                fm = self.media_by_id[rest['featured_media']]
                card_ref = make_ref(path_of(fm['source_url']), 'directions', name=f'{slug}-card',
                                    alt_gen=f'Постер направления «{h1}»')
            hero_url = self.hero_bgs.get(wp)
            hero_ref = make_ref(path_of(hero_url), 'directions', name=f'{slug}-hero',
                                alt_gen=f'Фоновое изображение: {h1}') if hero_url else None
            seo = self.seo(old, og_name=f'{slug}-og', og_group='directions')

            excerpt_html = rest.get('excerpt', {}).get('rendered', '')
            excerpt = norm(BeautifulSoup(excerpt_html, 'lxml').get_text())

            d: dict[str, Any] = {
                'wpId': wp,
                'slug': slug,
                'path': f'/napravleniya/{slug}/',
                'title': norm(BeautifulSoup(rest['title']['rendered'], 'lxml').get_text()),
                'shortTitle': labels.get(old, labels.get(urllib.parse.quote(old), None)),
                'h1': h1,
                'audience': audience,
                'category': category,
                'order': order,
                'tagline': tagline or None,
                'excerpt': excerpt or None,
                'highlightBullets': bullets.get(wp),
                'cardImage': card_ref,
                'hero': {'heading': h1, 'subheading': tagline or None, 'image': hero_ref},
                'sections': sections,
                'seo': seo,
                'oldPaths': [old] + ([urllib.parse.quote(old)] if old != urllib.parse.unquote(old) or not old.isascii() else []),
                'lastModified': mod_iso(rest)
            }
            if d['shortTitle'] is None:
                d['shortTitle'] = d['title']
            result.append(d)
        return result

    # ------------------------------------------------------------------ studios
    def studios(self) -> list[dict[str, Any]]:
        home_soup = self.c.soup('/')
        footer = home_soup.select_one('[data-elementor-type="footer"]')
        slides = footer.select('.swiper-slide')
        slide_by_addr: dict[str, Tag] = {}
        for sl in slides:
            t = sl.select_one('[data-widget_type="text-editor.default"]')
            if t is not None:
                ps = [norm(p.get_text()) for p in t.find_all('p')]
                if len(ps) > 1:
                    slide_by_addr[ps[1]] = sl
        out = []
        for order, (old, slug, short) in enumerate(cfg.STUDIOS, start=1):
            soup = self.c.soup(old)
            rest = self.c.rest_item(old)
            root = soup.select_one('[data-elementor-type="wp-page"]')
            h1 = plain(root.select_one('h1, [data-widget_type="heading.default"]'))
            tw = root.select_one('[data-widget_type="text-editor.default"]')
            fields: dict[str, str] = {}
            key = None
            for line in lines_of_runs(runs_of(tw.find('p'))):
                text = ''.join(r['t'] for r in line)
                m = re.match(r'^(АДРЕС|БЛИЖАЙШАЯ СТАНЦИЯ МЕТРО|ТЕЛЕФОН|e-mail|РЕЖИМ РАБОТЫ):\s*(.*)$', text)
                if m:
                    key, val = m.group(1), m.group(2)
                    fields[key] = val.strip()
                elif key:
                    fields[key] = (fields[key] + ' ' + text).strip()
            map_link = None
            for a in tw.find_all('a'):
                if a.get('href', '').startswith('https://yandex'):
                    map_link = a['href']
            phones = [tel_digits(a['href']) for a in tw.find_all('a') if a.get('href', '').startswith('tel:')]
            email = next((a['href'].replace('mailto:', '') for a in tw.find_all('a')
                          if a.get('href', '').startswith('mailto:')), None)
            # footer slide
            sl = slide_by_addr.get(short)
            assert sl is not None, short
            iframe = sl.find('iframe')
            embed = iframe.get('data-src') or iframe.get('src')
            ll = re.search(r'll=([\d.]+)%2C([\d.]+)', embed)
            geo = {'lat': float(ll.group(2)), 'lon': float(ll.group(1))} if ll else None
            photos = []
            for i, img in enumerate(sl.select('[data-widget_type="image.default"] img'), start=1):
                photos.append(make_ref(img_ref(img), 'studios', name=f'{slug}-{i}',
                                       alt=img.get('alt') if img.get('alt') and img.get('alt') != 'О НАС' else None,
                                       alt_gen=f'Студия PersOna, {short}: фото {i}'))
            fslide = [norm(p.get_text()) for p in sl.select('[data-widget_type="text-editor.default"] p')]
            seo = self.seo(old)
            s: dict[str, Any] = {
                'slug': slug,
                'wpId': rest['id'],
                'path': f'/studii/{slug}/',
                'name': h1,
                'shortName': short,
                'address': fields.get('АДРЕС', ''),
                'metro': fields.get('БЛИЖАЙШАЯ СТАНЦИЯ МЕТРО', ''),
                'hours': fields.get('РЕЖИМ РАБОТЫ', ''),
                'phones': phones,
                'email': email,
                'mapLink': map_link,
                'mapEmbedUrl': embed,
                'geo': geo,
                'photos': photos,
                'seo': seo,
                'order': order,
                'oldPaths': [old],
                'lastModified': mod_iso(rest),
                '_footer': {
                    'address': fslide[1] if len(fslide) > 1 else None,
                    'metro': fslide[3] if len(fslide) > 3 else None,
                    'hours': fslide[-1] if fslide else None,
                    'phones': [tel_digits(a['href']) for a in sl.select('a[href^="tel:"]')]
                }
            }
            out.append(s)
        return out

    # ------------------------------------------------------------------ teachers
    def teachers(self) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        path = '/content/nashi-pedagogi/'
        soup = self.c.soup(path)
        root = soup.select_one('[data-elementor-type="wp-page"]')
        popups = {p['data-elementor-id']: p for p in soup.select('[data-elementor-type="popup"]')}
        out = []
        for order, img in enumerate(root.select('a[href*="popup"] img'), start=1):
            pid = decode_popup_id(img.find_parent('a')['href'])
            pop = popups[pid]
            name = plain(pop.find('h2'))
            tslug = cfg.translit(name)
            photo = pop.find('img')
            bio_w = pop.select_one('[data-widget_type="text-editor.default"]')
            blocks = convert(bio_w, bold_para_heading=True)
            out.append({
                'id': tslug,
                'wpPopupId': int(pid),
                'name': name,
                'photo': make_ref(img_ref(photo), 'team', name=tslug, alt=None,
                                  alt_gen=f'Фотография педагога: {name}'),
                'cardPhoto': make_ref(img_ref(img), 'team', name=f'{tslug}-card', alt=None,
                                      alt_gen=f'Педагог {name}'),
                'bio': blocks,
                'order': order
            })
        page = {
            'path': '/komanda/',
            'oldPaths': [path],
            'h1': plain(root.find(attrs={'data-widget_type': 'heading.default'}, string=None)),
            'seo': self.seo(path),
            'lastModified': mod_iso(self.c.rest_item(path))
        }
        # the first heading widget is the h1
        hw = [w for w in widgets(root, 'heading')][0]
        page['h1'] = plain(hw)
        return page, out

    # ------------------------------------------------------------------ home
    def faq(self, root: Tag) -> list[dict[str, Any]]:
        items = []
        for d in root.select('details.e-n-accordion-item'):
            q = plain(d.select_one('.e-n-accordion-item-title-text'))
            tw = d.select_one('[data-widget_type="text-editor.default"]')
            blocks = convert(tw)
            items.append({'question': q, 'answer': blocks})
        return items

    def gallery_tab(self, panel: Tag, tab: str, key: str) -> dict[str, Any]:
        alt_by_stem: dict[str, str] = {}
        for img in panel.select('.swiper-slide img'):
            p = img_ref(img)
            if p:
                alt_by_stem[Path(p).stem] = img.get('alt') or ''
        images, seen = [], set()
        for a in panel.select('.elementor-gallery-item'):
            div = a.find('div')
            p = path_of(div.get('data-persona-thumbnail') or a.get('data-persona-href'))
            if not p or p in seen:
                continue
            seen.add(p)
            alt = alt_by_stem.get(Path(p).stem)
            images.append(make_ref(p, 'gallery', alt=alt, alt_gen=f'Фото из галереи «{tab}»'))
        if not images:  # carousel only
            for img in panel.select('.swiper-slide img'):
                p = img_ref(img)
                if p and p not in seen:
                    seen.add(p)
                    images.append(make_ref(p, 'gallery', alt=img.get('alt'), alt_gen=f'Фото из галереи «{tab}»'))
        videos, vseen = [], set()
        for w in panel.select('[data-widget_type="video.default"]'):
            v = video_of(w, 'posters', poster_name=None)
            if v and v['src'] not in vseen:
                vseen.add(v['src'])
                if v['poster']:
                    v['poster']['altGen'] = f'Кадр из видео: {tab}'
                videos.append(v)
        out: dict[str, Any] = {'id': key, 'label': tab}
        out['images'] = images
        out['videos'] = videos
        return out

    def home(self) -> dict[str, Any]:
        soup = self.c.soup('/')
        root = soup.select_one('[data-elementor-type="wp-page"]')
        W = {w['data-id']: w for w in widgets(root)}
        h1 = W['24fbc81'].find('h1')
        accent = h1.find('span', class_='accent')
        hero_lines = [norm(t) for t in re.split(r'<br\s*/?>', str(h1.decode_contents())) if norm(BeautifulSoup(t, 'lxml').get_text())]
        hero_lines = [norm(BeautifulSoup(t, 'lxml').get_text()) for t in re.split(r'<br\s*/?>', h1.decode_contents())]
        hero = {
            'heading': plain(h1),
            'headingLines': [l for l in hero_lines if l],
            'headingAccent': plain(accent) if accent else None,
            'text': plain(W['83c42f5']),
            'cta': {'label': plain(W['002cdb7']), 'href': W['002cdb7'].find('a')['href']},
            'socials': [a['href'] for a in W['10fd03c'].find_all('a')]
        }
        # learn block
        learn_img = W['aafac5f'].find('img')
        bullets = convert(W['1c41235'])
        learn = {
            'heading': plain(W['31dba05']),
            'text': plain(W['4ab2910']),
            'list': bullets[0],
            'cta': {'label': plain(W['84f5013']), 'href': W['84f5013'].find('a')['href']},
            'image': make_ref(img_ref(learn_img), 'home', name='learn',
                              alt=None, alt_gen='Преподаватель с учениками на занятии')
        }
        adv_ids = ['eb4bd99', '0eb90a7', '7ad8f48', '4cc9f1b', 'aff48f1', '215b82e']
        advantages = []
        for i in adv_ids:
            w = W[i]
            advantages.append({
                'title': plain(w.select_one('.elementor-icon-box-title')),
                'text': plain(w.select_one('.elementor-icon-box-description'))
            })
        # performances
        perf_videos, seen = [], set()
        for w in W['df80bb9'].select('[data-widget_type="video.default"]'):
            v = video_of(w, 'posters')
            if v and v['src'] not in seen:
                seen.add(v['src'])
                perf_videos.append(v)
        for n, v in enumerate(perf_videos, start=1):
            if v['poster']:
                v['poster']['name'] = f'home-performance-{n}'
                v['poster']['altGen'] = f'Кадр из видео выступления {n}'
        perf = {
            'anchor': 'vistuplenia',
            'heading': plain(W['c67165b']),
            'subheading': plain(W['72a349e']),
            'moreLabel': plain(W['9a68b86']),
            'videos': perf_videos
        }
        # studio photos
        studio_photos = []
        seen_p = set()
        for img in W['af241f9'].select('.swiper-slide img'):
            p = img_ref(img)
            if p and p not in seen_p:
                seen_p.add(p)
                studio_photos.append(make_ref(p, 'home', alt=None, alt_gen='Фотография студии PersOna'))
        studio = {'heading': plain(W['c2be46d']), 'photos': studio_photos}
        # gallery tabs
        tabs_w = W['6a7a19b']
        tab_titles = [norm(b.get_text()) for b in tabs_w.select('.e-n-tabs-heading .e-n-tab-title')]
        panels = tabs_w.select('.e-n-tabs-content > div')
        keys = ['dance', 'vocal', 'theatre', 'fashion', 'achievements', 'photoprojects', 'holidays']
        tabs = []
        for i, (title, panel) in enumerate(zip(tab_titles, panels)):
            t = self.gallery_tab(panel, title, keys[i])
            for n, v in enumerate(t['videos'], start=1):
                if v['poster']:
                    v['poster']['name'] = f'gallery-{keys[i]}-video-{n}'
            tabs.append(t)
        gallery = {'heading': plain(W['41ef10e']), 'subheading': plain(W['7146759']), 'tabs': tabs}
        faq_items = self.faq(root)
        faq = {
            'heading': plain(W['1054d3d']),
            'subheading': plain(W['77b0651']),
            'items': faq_items,
            'askButtons': [
                {'label': plain(W[i]), 'href': W[i].find('a')['href']} for i in ('684f377', '2e950a3', '291bf03')
            ]
        }
        cta = {
            'anchorId': 'consult-form',
            'heading': plain(W['b5d1302']),
            'button': {'label': plain(W['0d24d28']), 'href': W['0d24d28'].find('a')['href']}
        }
        # direction highlight cards (loop #595) -> in order of the carousel
        cards = []
        for it in soup.select('[data-elementor-type="loop-item"][data-elementor-id="595"]'):
            wp = int(next(c for c in it['class'] if c.startswith('e-loop-item-')).split('-')[-1])
            cards.append({'slug': self.slug_by_wpid[wp], 'title': plain(it.find('h2')),
                          'bullets': [plain(li) for li in it.select('li')]})
        # poster cards (loop #504) in carousel order; the salsa stub is dropped
        posters = []
        for it in soup.select('[data-elementor-type="loop-item"][data-elementor-id="504"]'):
            wp = int(next(c for c in it['class'] if c.startswith('e-loop-item-')).split('-')[-1])
            if wp in self.slug_by_wpid:
                posters.append(self.slug_by_wpid[wp])
        directions_block = {
            'highlightHeading': 'Наши направления',
            'cards': cards,
            'posterHeading': plain(W['f5550cd']),
            'posterAccent': plain(W['50fc2af']),
            'posterSlugs': posters
        }
        return {
            'path': '/',
            'hero': hero,
            'directions': directions_block,
            'learn': learn,
            'advantagesHeading': plain(W['26d9c8b']),
            'advantages': advantages,
            'performances': perf,
            'studio': studio,
            'gallery': gallery,
            'cta': cta,
            'faq': faq,
            'seo': self.seo('/'),
            'lastModified': mod_iso(self.c.rest_item('/'))
        }

    # ------------------------------------------------------------------ simple pages
    def about(self) -> dict[str, Any]:
        path = '/o-nas/'
        root = self.c.soup(path).select_one('[data-elementor-type="wp-page"]')
        W = {w['data-id']: w for w in widgets(root)}
        blocks = convert(W['d1001f4'], bold_para_heading=True)
        return {'path': '/o-nas/', 'oldPaths': [path], 'h1': plain(W['c750b64']), 'blocks': blocks,
                'seo': self.seo(path), 'lastModified': mod_iso(self.c.rest_item(path))}

    def events(self) -> dict[str, Any]:
        path = '/content/organizaciya-prazdnikov/'
        root = self.c.soup(path).select_one('[data-elementor-type="wp-page"]')
        W = {w['data-id']: w for w in widgets(root)}
        video = video_of(W['b97e9cc'], 'events', poster_name='events-video')
        if video and video['poster']:
            video['poster']['altGen'] = 'Кадр из видео об организации событий'
        art = convert(W['b603497'], bold_para_heading=True, image_group='events')
        return {
            'path': '/sobytiya/', 'oldPaths': [path],
            'h1': plain(W['4837fc0']),
            'lead': plain(W['e68fc4e']),
            'cta': {'label': plain(W['c116e9f']), 'href': W['c116e9f'].find('a')['href']},
            'cards': [flip_box(w) for w in widgets(root, 'flip-box')],
            'article': art,
            'video': video,
            'seo': self.seo(path), 'lastModified': mod_iso(self.c.rest_item(path))
        }

    def festivals(self) -> dict[str, Any]:
        path = '/content/festivalnoe-dvizhenie/'
        root = self.c.soup(path).select_one('[data-elementor-type="wp-page"]')
        W = {w['data-id']: w for w in widgets(root)}
        art = convert(W['b603497'], bold_para_heading=True, image_group='festivals')
        downloads = []
        for i in ('2a86e3b', '2f3d83c', 'b398b01'):
            a = W[i].find('a')
            downloads.append({'label': plain(W[i]), 'href': path_of(a['href'])})
        return {
            'path': '/festivali/', 'oldPaths': [path],
            'h1': plain(W['4837fc0']),
            'lead': plain(W['e68fc4e']),
            'cta': {'label': plain(W['c116e9f']), 'href': W['c116e9f'].find('a')['href']},
            'cards': [flip_box(w) for w in widgets(root, 'flip-box')],
            'article': art,
            'downloadsHeading': plain(W['870a11c']),
            'downloads': downloads,
            'seo': self.seo(path), 'lastModified': mod_iso(self.c.rest_item(path))
        }

    def privacy(self) -> dict[str, Any]:
        path = '/privacy-policy/'
        soup = self.c.soup(path)
        main = soup.select_one('main#content .page-content')
        h1 = plain(main.find('h1'))
        main.find('h1').decompose()
        blocks = convert(main, numbered_headings=True)
        return {'path': '/politika-konfidencialnosti/', 'oldPaths': [path], 'h1': h1, 'blocks': blocks,
                'seo': self.seo(path), 'lastModified': mod_iso(self.c.rest_item(path))}

    def news(self) -> dict[str, Any]:
        path = '/news/'
        root = self.c.soup(path).select_one('[data-elementor-type="wp-page"]')
        W = {w['data-id']: w for w in widgets(root)}
        links = [{'label': plain(a), 'href': a['href']} for a in W['5cdbdfd'].find_all('a')]
        return {'path': '/novosti/', 'oldPaths': [path], 'h1': plain(W['f74e903']),
                'blocks': convert(W['1c46188']), 'links': links,
                'seo': self.seo(path), 'lastModified': mod_iso(self.c.rest_item(path))}

    def reviews(self) -> dict[str, Any]:
        path = '/otzyvy/'
        root = self.c.soup(path).select_one('[data-elementor-type="wp-page"]')
        W = {w['data-id']: w for w in widgets(root)}
        a = W['28641f6'].find('a')
        iframes = [f['src'] for f in root.find_all('iframe')]
        return {'path': '/otzyvy/', 'oldPaths': [path], 'h1': plain(W['1a35061']),
                'blocks': convert(W['28641f6']), 'reviewLink': a['href'] if a else None,
                'widgetUrls': sorted(set(iframes)),
                'seo': self.seo(path), 'lastModified': mod_iso(self.c.rest_item(path))}

    def tariffs(self) -> dict[str, Any]:
        path = '/tarify/'
        root = self.c.soup(path).select_one('[data-elementor-type="wp-page"]')
        W = {w['data-id']: w for w in widgets(root)}
        img = W['ecdff42'].find('img')
        pay = W['cc4db26'].find('a')
        return {
            'path': '/tarify/', 'oldPaths': [path], 'h1': plain(W['b38e249']),
            'priceListImage': make_ref(img_ref(img), 'pricing', name='prejskurant-2026-2027',
                                       alt=img.get('alt'), alt_gen='Прейскурант 2026/2027'),
            'freePayment': {'heading': plain(W['63c60cc']), 'text': plain(W['9ecec90']),
                            'button': {'label': plain(W['cc4db26']), 'href': pay['href']}},
            'seo': self.seo(path), 'lastModified': mod_iso(self.c.rest_item(path))
        }

    def schedule(self) -> dict[str, Any]:
        path = '/content/raspisanie/'
        soup = self.c.soup(path)
        h1 = soup.select_one('h1')
        mounts = [d['id'] for d in soup.find_all('div', id=re.compile(r'^SiteWidgetMoyklass'))
                  if d.find_parent('footer') is None and d.find_parent(attrs={'data-elementor-type': 'footer'}) is None]
        return {'path': '/raspisanie/', 'oldPaths': [path], 'h1': plain(h1), 'mounts': mounts,
                'seo': self.seo(path), 'lastModified': mod_iso(self.c.rest_item(path))}

    def directions_index(self) -> dict[str, Any]:
        path = '/brunches/'
        root = self.c.soup(path).select_one('[data-elementor-type="wp-page"]')
        W = {w['data-id']: w for w in widgets(root)}
        cards = []
        for it in self.c.soup(path).select('[data-elementor-type="loop-item"][data-elementor-id="504"]'):
            wp = int(next(c for c in it['class'] if c.startswith('e-loop-item-')).split('-')[-1])
            if wp in self.slug_by_wpid:
                cards.append(self.slug_by_wpid[wp])
        return {'path': '/napravleniya/', 'oldPaths': [path, '/areas/', '/studios/'], 'h1': plain(W['d1ab5bd']),
                'cta': {'label': plain(W['98e00ba']), 'href': W['98e00ba'].find('a')['href']},
                'listedSlugs': cards,
                'seo': self.seo(path), 'lastModified': mod_iso(self.c.rest_item(path))}

    # ------------------------------------------------------------------ site chrome
    def chrome(self) -> dict[str, Any]:
        soup = self.c.soup('/')
        logo = soup.select_one('[data-widget_type="theme-site-logo.default"] img')
        gis = soup.find('img', alt='gis')
        gis_a = gis.find_parent('a')
        footer = soup.select_one('[data-elementor-type="footer"]')
        tagline = footer.find(attrs={'data-widget_type': 'icon-box.default'})
        return {
            'logo': make_ref(cfg.LOGO_PATH, 'brand', name='logo', alt='Persona Art Center',
                             width=int(logo['width']), height=int(logo['height'])),
            'favicon': make_ref('/wp-content/uploads/2026/01/fav.png', 'brand', name='favicon', alt_gen='Значок PersOna'),
            'faviconSvg': '/wp-content/themes/hello-elementor-child/favicon.svg',
            'defaultOg': make_ref(DEFAULT_OG, 'brand', name='og-default', alt_gen='PersOna — творческий центр'),
            'gis': make_ref(img_ref(gis), 'brand', name='2gis-reviews', alt='gis', alt_gen='Отзывы на 2ГИС'),
            'gisUrl': gis_a['href'],
            'tagline': {'title': plain(tagline.select_one('.elementor-icon-box-title')),
                        'text': plain(tagline.select_one('.elementor-icon-box-description'))},
            'html': {'lang': soup.find('html').get('lang')}
        }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--crawl', required=True)
    ap.add_argument('--out', required=True)
    args = ap.parse_args()
    crawl = Crawl(args.crawl)
    ex = Extractor(crawl)
    team_page, teachers = ex.teachers()
    data = {
        'chrome': ex.chrome(),
        'directions': ex.directions(),
        'studios': ex.studios(),
        'teamPage': team_page,
        'teachers': teachers,
        'home': ex.home(),
        'about': ex.about(),
        'events': ex.events(),
        'festivals': ex.festivals(),
        'privacy': ex.privacy(),
        'news': ex.news(),
        'reviews': ex.reviews(),
        'tariffs': ex.tariffs(),
        'schedule': ex.schedule(),
        'directionsIndex': ex.directions_index()
    }
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    (out / 'extracted.json').write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf-8')
    print('wrote', out / 'extracted.json')


if __name__ == '__main__':
    main()
