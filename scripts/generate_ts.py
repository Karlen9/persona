#!/usr/bin/env python3
"""Step 3/3 of the content pipeline: extracted.json + media-manifest.json -> src/content/*.ts.

Usage:
    python3 scripts/generate_ts.py --crawl <crawl dir> --out <work dir> [--content src/content]

Writes the data modules (site, directions/*, studios, teachers, pricing, faq, reviews, news, home, pages,
redirects, todos). Hand-written files (types.ts, index.ts) are never touched. Format the result afterwards:
    bunx prettier --use-tabs --tab-width 4 --single-quote --trailing-comma none --no-bracket-spacing \
        --print-width 120 --write src/content
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

import content_config as cfg  # noqa: E402
import pricing_data as price  # noqa: E402
from content_lib import Crawl  # noqa: E402

HEADER = ('// Generated from the personamodel.ru crawl of 2026-11-20 by scripts/generate_ts.py.\n'
          '// Copy is verbatim; fix it here (or in the CMS that replaces this module).\n')
IDENT = re.compile(r'^[A-Za-z_$][A-Za-z0-9_$]*$')

TODOS: list[str] = []


# --------------------------------------------------------------------------- TS serialiser


def q(s: str) -> str:
    s = s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n').replace('\r', '')
    return "'" + s + "'"


def js(v: Any, ind: int = 0) -> str:
    pad = '\t' * ind
    if v is None:
        return 'null'
    if v is True:
        return 'true'
    if v is False:
        return 'false'
    if isinstance(v, (int, float)):
        return json.dumps(v)
    if isinstance(v, str):
        return q(v)
    if isinstance(v, list):
        if not v:
            return '[]'
        if all(isinstance(x, (str, int, float, bool)) or x is None for x in v):
            return '[' + ', '.join(js(x) for x in v) + ']'
        return '[\n' + ',\n'.join(pad + '\t' + js(x, ind + 1) for x in v) + '\n' + pad + ']'
    if isinstance(v, dict):
        lines = []
        todo = v.get('_todo')
        items = [(k, x) for k, x in v.items() if k != '_todo']
        if todo:
            TODOS.append(todo)
            lines.append(pad + '\t// TODO(content): ' + todo)
        if not items and not lines:
            return '{}'
        for k, x in items:
            key = k if IDENT.match(k) else q(k)
            lines.append(f'{pad}\t{key}: {js(x, ind + 1)}')
        # commas between members, not after comments
        out = []
        members = [ln for ln in lines if not ln.lstrip().startswith('//')]
        n = 0
        for ln in lines:
            if ln.lstrip().startswith('//'):
                out.append(ln)
            else:
                n += 1
                out.append(ln + (',' if n < len(members) else ''))
        return '{\n' + '\n'.join(out) + '\n' + pad + '}'
    raise TypeError(type(v))


def camel(slug: str) -> str:
    parts = slug.split('-')
    return parts[0] + ''.join(p.capitalize() for p in parts[1:])


# --------------------------------------------------------------------------- resolution


def meaningful_alt(a: str | None) -> bool:
    if not a or a in ('Главная', 'Наши преподаватели', 'О НАС'):
        return False
    if re.search(r'[А-Яа-яЁё]{3,}', a):
        return True
    return bool(re.fullmatch(r'[A-Z][A-Za-z]+(?: [A-Za-z]+)+', a))


class Resolver:
    def __init__(self, manifest: dict[str, Any]) -> None:
        self.images = manifest['images']
        self.videos = manifest['videos']
        self.docs = manifest['docs']

    def image(self, ref: dict[str, Any]) -> dict[str, Any]:
        m = self.images[ref['$img']]
        explicit = ref.get('alt')
        api = m.get('apiAlt') if ref['group'] != 'team' else None
        generated = False
        if meaningful_alt(explicit):
            alt = explicit
        elif meaningful_alt(api):
            alt = api
        else:
            alt = ref['altGen']
            generated = True
        out: dict[str, Any] = {'src': m['src'], 'width': m['width'], 'height': m['height'], 'alt': alt}
        if generated:
            out['altGenerated'] = True
        return out

    def video(self, v: dict[str, Any]) -> dict[str, Any]:
        info = self.videos.get(v['src'], {})
        out: dict[str, Any] = {'src': v['src']}
        if info.get('mimeType'):
            out['mimeType'] = info['mimeType']
        if info.get('sizeBytes'):
            out['sizeBytes'] = info['sizeBytes']
        out['poster'] = self.image(v['poster']) if v.get('poster') else None
        return out

    def deep(self, o: Any) -> Any:
        if isinstance(o, dict):
            if '$img' in o:
                return self.image(o)
            if set(o.keys()) == {'src', 'poster'}:
                return self.video(o)
            return {k: self.deep(v) for k, v in o.items()}
        if isinstance(o, list):
            return [self.deep(v) for v in o]
        return o


def write(path: Path, imports: list[str], body: str) -> None:
    text = HEADER + '\n'
    if imports:
        text += "import type {" + ', '.join(imports) + "} from '../types';\n\n" if 'directions/' in str(path) else \
            "import type {" + ', '.join(imports) + "} from './types';\n\n"
    text += body
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding='utf-8')


# --------------------------------------------------------------------------- teacher meta

# Manual, strictly derived from the bio text (see docs/site-examination.md §5.5).
TEACHER_ROLE = {
    'nataliya-yurevna-komarova': 'Руководитель Т.Ц. PersOna',  # price list: «Руководитель Т.Ц. PersOna»
    'rosnovskaya-natalya': 'Заместитель директора центра PersOna',  # bio: «заместитель директора центра PersOna»
    'markovichev-aleksandr': 'Педагог по брейк-дансу',  # bio first line
    'ionova-darya': 'Хореограф и преподаватель',  # bio first line
    'grudinina-svetlana': 'Преподаватель английского и итальянского языков',  # bio line
    'dedikina-valeriya': 'Педагог школы моделей',  # bio first line
    'litvinova-irina': 'Педагог дополнительного образования в области сценической деятельности',  # «Должность:»
    'krymskaya-marina': 'Преподаватель вокала',  # bio: qualifications
    'surina-anastasiya': 'Педагог по эстрадному вокалу',  # bio: «2 года педагог по эстрадному вокалу»
    'savostyanova-svetlana': 'Логопед'  # bio: education «Логопед школьных и дошкольных заведений»
}
TEACHER_DIRECTIONS = {
    'markovichev-aleksandr': ['tancy'],
    'ionova-darya': ['tancy'],
    'khramova-evgeniya': ['yazykovaya-shkola'],
    'grudinina-svetlana': ['yazykovaya-shkola'],
    'krymskaya-marina': ['vokal'],
    'surina-anastasiya': ['vokal'],
    'litvinova-irina': ['teatr'],
    'savostyanova-svetlana': ['logoped'],
    'akhmedova-nargiz': ['tancy'],
    'dedikina-valeriya': ['shkola-modeley'],
    'amiroslanova-kristina': ['vokal'],
    'armenakyan-mikhail': ['vokal'],
    'brusnika-ekaterina': ['joga'],
    'vazigatova-azaliya': ['vokal'],
    'vokhmyanin-nikita': ['muzykalnye-instrumenty'],
    'koteneva-anastasiya': ['pilates', 'barre-fitnes'],
    'kulakova-elizaveta': ['joga'],
    'melkumova-marina': ['yazykovaya-shkola'],
    'polyakova-kristina': ['teatr'],
    'suslova-evgeniya': ['tancy'],
    'tkacheva-viktoriya': ['tancy'],
    'tyurina-irina': ['joga']
}
MANAGEMENT = {'nataliya-yurevna-komarova', 'rosnovskaya-natalya'}
ROLE_LINE = re.compile(r'^(Педагог по|Тренер)[^.]{2,70}\.?$')


# --------------------------------------------------------------------------- builders


def build_teachers(data: dict[str, Any], R: Resolver) -> list[dict[str, Any]]:
    out = []
    for t in data['teachers']:
        bio = R.deep(t['bio'])
        role = TEACHER_ROLE.get(t['id'])
        if role is None and bio and bio[0]['type'] in ('heading', 'paragraph') and ROLE_LINE.match(bio[0]['text']):
            role = bio[0]['text'].rstrip('.')
            bio = bio[1:]
        out.append({
            'id': t['id'],
            'wpPopupId': t['wpPopupId'],
            'name': t['name'],
            'role': role,
            'photo': R.image(t['photo']),
            'cardPhoto': R.image(t['cardPhoto']),
            'bio': bio,
            'directionSlugs': TEACHER_DIRECTIONS.get(t['id'], []),
            'isManagement': t['id'] in MANAGEMENT,
            'order': t['order']
        })
    return out


DIR_TODOS = {
    'dlya-vzroslyh': ('Page body keeps the live copy: the text after the six programme cards is copy-pasted Barre-fitness '
                      'text («Что такое Barre-фитнес?», «Почему именно в нашей детской студии?»), there are two '
                      '«Как проходят занятия?» headings and the tagline is «Баррэ-фитнес». The page is the parent of '
                      'the adult menu group and needs its own copy.'),
    'megavolt': ('Menu label is «Инженерный клуб Мегавольт», the page H1 is «ИНЖЕНЕРНЫЙ КЛАСС МЕГАВОЛЬТ» and the '
                 'price list says «ИНЖЕНЕРНЫЙ КУРС «МЕГАВОЛЬТ»»; pick one name.'),
    'prodlenka': ('Prices for the after-school care (48 000 ₽ with meals / 43 000 ₽ without) exist only in the page '
                  'body, not in the price list on /tarify/.'),
    'semejnaya-shkola': ('The page links to the separate family-school site https://personaschool.tilda.ws; the old '
                         'URL slug was the typo «семенная» (seed) instead of «семейная» (family).'),
    'shkola-modeley': 'Menu label «Школа моделей», page H1 «Детская школа моделей», meta title says «курс «Театр Моды»».',
    'tancy': 'Menu label «Танцы», page H1 «Театр танца», WP title «Танцы».',
    'vokal': 'Menu label «Вокал», page H1 «Вокальная студия».',
    'bachata': ('The old stub page «Сальса и бачата» (/areas/salsa-i-bachata/, empty body, no image) duplicated this '
                'direction and redirects here (owner decision); it was still linked from the home and catalogue grids.'),
    'logoped': 'The price list prices «ЛОГОПЕД» only as an individual tariff.',
}


def build_directions(data: dict[str, Any], R: Resolver, teachers: list[dict[str, Any]]) -> list[dict[str, Any]]:
    t_by_dir: dict[str, list[str]] = {}
    for t in teachers:
        for s in t['directionSlugs']:
            t_by_dir.setdefault(s, []).append(t['id'])
    out = []
    for d in data['directions']:
        seo = R.deep(d['seo'])
        excerpt = d['tagline'] or seo['description']
        item: dict[str, Any] = {
            '_todo': DIR_TODOS.get(d['slug']),
            'id': d['slug'],
            'wpId': d['wpId'],
            'slug': d['slug'],
            'path': d['path'],
            'title': d['title'],
            'shortTitle': d['shortTitle'],
            'audience': d['audience'],
            'category': d['category'],
            'excerpt': excerpt,
            'tagline': d['tagline'],
            'highlightBullets': d['highlightBullets'],
            'cardImage': R.deep(d['cardImage']),
            'hero': R.deep(d['hero']),
            'sections': R.deep(d['sections']),
            'teacherIds': t_by_dir.get(d['slug'], []),
            'seo': seo,
            'oldPaths': d['oldPaths'],
            'order': d['order'],
            'lastModified': d['lastModified']
        }
        if not item['_todo']:
            del item['_todo']
        out.append(item)
    return out


def build_studios(data: dict[str, Any], R: Resolver) -> list[dict[str, Any]]:
    out = []
    for s in data['studios']:
        f = s['_footer']
        notes = []
        if f['metro'] and f['metro'].lower() != s['metro'].lower():
            notes.append(f"metro: page «{s['metro']}» vs footer «{f['metro']}»")
        if f['hours'] and f['hours'] != s['hours']:
            notes.append(f"hours: page «{s['hours']}» vs footer «{f['hours']}»")
        if f['phones'] != s['phones']:
            notes.append(f"phones: page {', '.join(s['phones'])} vs footer {', '.join(f['phones'])}")
        todo = None
        if notes:
            todo = (f"{s['shortName']}: studio page and site footer disagree ({'; '.join(notes)}). "
                    'Kept the studio page values.')
        seo = R.deep(s['seo'])
        item: dict[str, Any] = {
            '_todo': todo,
            'id': s['slug'],
            'slug': s['slug'],
            'wpId': s['wpId'],
            'path': s['path'],
            'name': s['name'],
            'shortName': s['shortName'],
            'address': s['address'],
            'metro': [m.strip() for m in s['metro'].split(',')],
            'hours': s['hours'],
            'phones': s['phones'],
            'email': s['email'],
            'mapLink': s['mapLink'],
            'mapEmbedUrl': s['mapEmbedUrl'],
            'geo': s['geo'],
            'photos': [R.image(p) for p in s['photos']],
            'seo': seo,
            'order': s['order'],
            'oldPaths': s['oldPaths'],
            'lastModified': s['lastModified']
        }
        if s['slug'] in ('solntsevo', 'profsoyuznaya'):
            item['seo'] = {'_todo': (f"{s['shortName']}: the live meta description is a broken auto-extract of the "
                                     'contact block («АДРЕС: … МоскваБЛИЖАЙШАЯ СТАНЦИЯ МЕТРО…»); kept verbatim, '
                                     'needs a hand-written one.'), **seo}
        if s['slug'] == 'profsoyuznaya':
            item['mapLink'] = s['mapLink']
            item['_todo'] = (item.get('_todo', '') + ' ' if item.get('_todo') else '') + (
                'The map/organisation link points to the host venue «Культурный центр «Меридиан»», not to PersOna '
                'itself; geo is the map centre of that embed.')
        if not item['_todo']:
            del item['_todo']
        out.append(item)
    return out


def md_money(v: int | None) -> int | None:
    return v


def build_pricing(data: dict[str, Any], R: Resolver, faq_items: list[dict[str, Any]]) -> dict[str, Any]:
    img = R.image(data['tariffs']['priceListImage'])

    def rows(spec: list[Any]) -> list[dict[str, Any]]:
        return [{'id': r[0], 'label': r[1], 'directionSlugs': r[2], 'prices': r[3]} for r in spec]

    price_list = {
        'title': price.TITLE,
        'season': price.SEASON,
        'approvedBy': price.APPROVED_BY,
        'trialLesson': price.TRIAL,
        'groups': [
            {'id': 'group', 'title': 'ГРУППОВЫЕ ЗАНЯТИЯ', 'currencyPrinted': True, 'columns': price.GROUP_COLUMNS,
             'rows': rows(price.GROUP_ROWS)},
            {'id': 'individual', 'title': 'ИНДИВИДУАЛЬНЫЕ ЗАНЯТИЯ', 'currencyPrinted': False,
             'columns': price.INDIVIDUAL_COLUMNS, 'rows': rows(price.INDIVIDUAL_ROWS)}
        ],
        'notes': price.NOTES,
        'image': img
    }
    return price_list


# --------------------------------------------------------------------------- main


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--crawl', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--content', default=str(Path(__file__).resolve().parent.parent / 'src' / 'content'))
    args = ap.parse_args()

    work = Path(args.out)
    content = Path(args.content)
    data = json.loads((work / 'extracted.json').read_text(encoding='utf-8'))
    manifest = json.loads((work / 'media-manifest.json').read_text(encoding='utf-8'))
    R = Resolver(manifest)
    crawl = Crawl(args.crawl)

    docs_meta = manifest['docs']

    def doc(old: str, title: str, did: str) -> dict[str, Any]:
        m = docs_meta[old]
        return {'id': did, 'title': title, 'href': m['src'], 'sizeBytes': m['bytes'], 'oldPath': old}

    # ---------------------------------------------------------------- teachers
    teachers = build_teachers(data, R)
    team = data['teamPage']
    teachers_body = (
        'export const teamPage: TTeamPage = ' + js({
            'path': team['path'], 'h1': team['h1'], 'seo': R.deep(team['seo']), 'oldPaths': team['oldPaths'],
            'lastModified': team['lastModified']}) + ';\n\n'
        'export const teachers: TTeacher[] = ' + js(teachers) + ';\n')
    write(content / 'teachers.ts', ['TTeacher', 'TTeamPage'], teachers_body)

    # ---------------------------------------------------------------- directions
    directions = build_directions(data, R, teachers)
    dd = content / 'directions'
    for old in dd.glob('*.ts') if dd.exists() else []:
        old.unlink()
    names = []
    for d in directions:
        name = camel(d['slug'])
        names.append((name, d['slug']))
        write(dd / f"{d['slug']}.ts", ['TDirection'], f'export const {name}: TDirection = {js(d)};\n')
    di = data['directionsIndex']
    ds = [(n, s) for n, s in names]
    ordered = [n for n, _ in ds]
    imports = '\n'.join(f"import {{{n}}} from './directions/{s}';" for n, s in ds)
    body = (
        "import type {TAudience, TDirection, TDirectionCategory, TDirectionPageTemplate, TDirectionsIndexPage} "
        "from './types';\n" + imports + '\n\n'
        'export const directions: TDirection[] = [\n' + ',\n'.join('\t' + n for n in ordered) + '\n];\n\n'
        'export const audienceLabels: Record<TAudience, string> = ' + js(cfg.AUDIENCE_LABELS) + ';\n\n'
        'export const directionCategoryLabels: Record<TDirectionCategory, string> = ' + js(cfg.CATEGORY_LABELS) + ';\n\n'
        '/** Chrome shared by every direction page on the live site (buttons under the article and the page tail). */\n'
        'export const directionPageTemplate: TDirectionPageTemplate = ' + js({
            'cta': {'label': 'Записаться', 'href': '#form'},
            'scheduleButton': {'label': 'Расписание', 'href': '/raspisanie/'},
            'navLinks': [
                {'label': 'Педагоги', 'href': '/komanda/'},
                {'label': 'Расписание', 'href': '/raspisanie/'},
                {'label': 'Выступления', 'href': '/#vistuplenia'},
                {'label': 'Тарифы', 'href': '/tarify/'}
            ],
            'related': {'heading': 'ДОПОЛНИТЕЛЬНЫЕ НАПРАВЛЕНИЯ НАШЕЙ ТВОРЧЕСКОЙ СТУДИИ', 'subheading': 'Наши направления',
                        'slugs': ['shkola-modeley', 'tancy', 'vokal']}
        }) + ';\n\n'
        'export const directionsIndexPage: TDirectionsIndexPage = ' + js({
            'path': di['path'], 'h1': di['h1'], 'cta': di['cta'], 'listedSlugs': di['listedSlugs'],
            'seo': {'_todo': 'The live meta description of the catalogue is a broken auto-extract '
                             '(«PersOna PersOna … Наши направления Записаться»); kept verbatim, needs a hand-written one.',
                    **R.deep(di['seo'])},
            'oldPaths': di['oldPaths'], 'lastModified': di['lastModified']}) + ';\n\n'
        '/** Menu groups: «Для детей», «Для взрослых», family (family school, after-school care). */\n'
        'export function getDirectionsByAudience(audience: TAudience): TDirection[] {\n'
        '\treturn directions.filter((direction) => direction.audience === audience);\n}\n\n'
        'export function getDirectionsByCategory(category: TDirectionCategory): TDirection[] {\n'
        '\treturn directions.filter((direction) => direction.category === category);\n}\n')
    (content / 'directions.ts').write_text(HEADER + '\n' + body, encoding='utf-8')

    # ---------------------------------------------------------------- studios
    studios = build_studios(data, R)
    write(content / 'studios.ts', ['TStudio'], 'export const studios: TStudio[] = ' + js(studios) + ';\n')

    # ---------------------------------------------------------------- site
    ch = data['chrome']
    site = {
        'name': 'PersOna',
        'cmsSiteName': 'Persona - Art Center',
        '_todo': ('Brand spelling varies on the live site: «PersOna» (copy, og:site_name), «Persona» (titles), '
                  '«PersonaModel» (titles/descriptions), «Persona - Art Center» (site title), «Творческий центр PersOna» '
                  '(JSON-LD), «Т.Ц. PersOna» (price list), «ТЦ «Персона»» (privacy policy). Pick one.'),
        'legalName': 'Творческий центр PersOna',
        'url': 'https://personamodel.ru',
        'lang': ch['html']['lang'],
        'foundedYear': 2002,
        'tagline': ch['tagline'],
        'email': 'personamodel@mail.ru',
        'phones': [
            {'display': '+7 (499) 393-30-05', 'tel': '+74993933005'},
            {'display': '+7 (925) 150-87-38', 'tel': '+79251508738'},
            {'display': '+7 (999) 594-40-60', 'tel': '+79995944060'}
        ],
        'logo': R.image(ch['logo']),
        'favicon': {'png': R.image(ch['favicon']), 'svg': '/media/brand/favicon.svg'},
        'defaultOgImage': R.image(ch['defaultOg']),
        'socials': [
            {'kind': 'telegram', 'label': 'Telegram', 'url': 'https://t.me/personamp56'},
            {'kind': 'vk', 'label': 'VK', 'url': 'https://vk.com/personamodelmoscow'},
            {'kind': 'max', 'label': 'MAX', 'url': 'https://max.ru/id615422777189_biz'}
        ],
        'messengerButtons': [
            {'kind': 'telegram', 'label': 'Telegram', 'url': 'https://t.me/PersonaRamenki'},
            {'kind': 'vk', 'label': 'VK',
             'url': 'https://vk.com/im/convo/-127439478?entrypoint=community_page&tab=all'},
            {'kind': 'max', 'label': 'MAX',
             'url': 'https://max.ru/u/f9LHodD0cOJdh8p7CvDStKuAkflx5QNgJMA_SWF7W8lH-LVLz97NcccMf6Y'}
        ],
        'moyklass': {
            'lead': {'widgetId': '01gGAHCMTHh6sF5MFhcE7tRjEqC2dNs2KhPj', 'mountId': 'SiteWidgetMoyklass130355'},
            'schedule': {'widgetId': '38IaRqAF2GUQSoxG3JaEonvxriufNPjJGx',
                         'mountIds': ['SiteWidgetMoyklass65961', 'SiteWidgetMoyklass130200']}
        },
        'metrika': {'counterId': '112028433', 'goals': ['lead', 'click_phone', 'click_telegram']},
        'yandex': {
            'orgId': '165851817022',
            'orgUrl': 'https://yandex.ru/maps/org/persona/165851817022/',
            'ratingBadgeUrl': 'https://yandex.ru/sprav/widget/rating-badge/165851817022?type=rating',
            'reviewsWidgetUrl': 'https://yandex.ru/maps-reviews-widget/165851817022?comments',
            'reviewLink': data['reviews']['reviewLink']
        },
        'twoGis': {'reviewsUrl': ch['gisUrl'], 'badge': R.image(ch['gis'])},
        'payment': {'sbpUrl': data['tariffs']['freePayment']['button']['href']},
        'documents': [
            doc('/wp-content/uploads/2026/01/abonentskij-dogovor.pdf', 'Абонентский договор', 'subscription-agreement'),
            doc('/wp-content/uploads/2026/01/pravila-povedeniya.pdf', 'Правила поведения', 'rules-of-conduct'),
            doc('/wp-content/uploads/2026/01/politika-personalnyh-dannyh.pdf',
                'Политика обработки персональных данных', 'privacy-policy-pdf')
        ],
        'cookieBanner': {
            'title': 'Мы ценим вашу конфиденциальность',
            'description': ('Этот сайт, как и наш детский центр, заботится о вашем удобстве. Мы собираем технические '
                            'данные (cookies), чтобы сайт не «тормозил», а вы быстро находили расписание и новости. Мы '
                            'не передаем ваши данные посторонним и используем их только для улучшения работы сайта.\n\n'
                            'Нажимая «Принять», вы помогаете нам стать лучше 🤗'),
            'accept': 'Принять все',
            'reject': 'Отказаться'
        },
        'seo': {'titleSuffix': ' - Persona - Art Center'}
    }
    site_body = 'export const site: TSite = ' + js(site) + ';\n'
    write(content / 'site.ts', ['TSite'], site_body)

    # ---------------------------------------------------------------- faq
    home = data['home']
    faq = home['faq']
    faq_items = []
    for i, it in enumerate(faq['items'], start=1):
        answer = R.deep(it['answer'])
        text_parts = []
        for b in answer:
            if b['type'] == 'list':
                text_parts.extend('• ' + x['text'] for x in b['items'])
            else:
                text_parts.append(b['text'])
        item = {'id': f'faq-{i}', 'question': it['question'], 'answer': answer, 'answerText': ' '.join(text_parts),
                'order': i}
        if i == 6:
            item = {'_todo': ('FAQ «Как вы обеспечиваете безопасность?» presents the guarded territory of ЖК «Небо» as '
                              'a general fact, but it applies only to the Мичуринский проспект studio.'), **item}
        faq_items.append(item)
    faq_section = {'heading': faq['heading'], 'subheading': faq['subheading'], 'items': faq_items,
                   'askButtons': faq['askButtons']}
    write(content / 'faq.ts', ['TFaqSection'], 'export const homeFaq: TFaqSection = ' + js(faq_section) + ';\n')

    # ---------------------------------------------------------------- pricing
    price_list = build_pricing(data, R, faq_items)
    tar = data['tariffs']
    tar_page = {
        'path': tar['path'],
        'h1': tar['h1'],
        'priceList': price_list,
        'discounts': [
            {'id': 'second-direction', 'percent': 15,
             'text': 'скидка 15% — на второе направление или второго ребёнка из одной семьи при покупке группового абонемента'},
            {'id': 'third-direction', 'percent': 30,
             'text': 'скидка 30% — на третье направление или третьего ребёнка из одной семьи при покупке группового абонемента'},
            {'id': 'duet', 'percent': 20,
             'text': 'ТАРИФ "ДУЭТ" Рассчитывается как индивидуальный абонемент за минусом 20 % с человека'}
        ],
        'freePayment': tar['freePayment'],
        'seo': R.deep(tar['seo']),
        'oldPaths': tar['oldPaths'],
        'lastModified': tar['lastModified']
    }
    tar_page['priceList']['_todo'] = (
        'The price list is published only as a JPEG; these numbers are a transcription of that image and must be '
        'confirmed by the owner. Row labels keep the printed typos («АРТ-МАССТЕРСКАЯ», «ПРОГРАМИРОВАНИЕ», '
        '«1 ЗАНЯТИЯ»). Pilates, «Для взрослых», «Продлёнка», «Семейная школа» have no row; «БОКС» has a row but no '
        'direction page; the 4-lesson «Мегавольт» tier is quoted without 8/12-lesson tiers.')
    pricing_body = ('export const tariffsPage: TTariffsPage = ' + js(tar_page) + ';\n\n'
                    'export const priceList: TPriceList = tariffsPage.priceList;\n')
    write(content / 'pricing.ts', ['TPriceList', 'TTariffsPage'], pricing_body)

    # ---------------------------------------------------------------- reviews & news
    rv = data['reviews']
    reviews_body = (
        '/**\n * The live /otzyvy/ page stores no review text: all reviews live at Yandex Maps (org 165851817022) and\n'
        ' * are shown through the Yandex reviews widget iframe. The array stays empty until reviews are mirrored here.\n'
        ' */\n'
        'export const reviews: TReview[] = [];\n\n'
        'export const reviewsPage: TReviewsPage = ' + js({
            'path': rv['path'], 'h1': rv['h1'], 'intro': rv['blocks'], 'reviewLink': rv['reviewLink'],
            'widgetUrl': rv['widgetUrls'][0], 'seo': R.deep(rv['seo']), 'oldPaths': rv['oldPaths'],
            'lastModified': rv['lastModified']}) + ';\n')
    write(content / 'reviews.ts', ['TReview', 'TReviewsPage'], reviews_body)
    nw = data['news']
    news_body = (
        '/**\n * The live /news/ page contains no posts (WordPress has 0 posts): it only points visitors to the\n'
        ' * VK / Telegram / MAX channels. `newsPosts` stays empty until the site gets its own news feed.\n */\n'
        'export const newsPosts: TNewsPost[] = [];\n\n'
        'export const newsPage: TNewsPage = ' + js({
            'path': nw['path'], 'h1': nw['h1'], 'intro': nw['blocks'], 'links': nw['links'],
            'seo': R.deep(nw['seo']), 'oldPaths': nw['oldPaths'], 'lastModified': nw['lastModified']}) + ';\n')
    write(content / 'news.ts', ['TNewsPage', 'TNewsPost'], news_body)

    # ---------------------------------------------------------------- home
    h = R.deep(home)
    home_obj = {
        'path': h['path'],
        'hero': {**h['hero'], 'socials': [
            {'kind': k, 'label': l, 'url': u} for (k, l), u in zip(
                [('telegram', 'Telegram'), ('vk', 'VK'), ('max', 'MAX')], h['hero']['socials'])]},
        'directions': {'heading': h['directions']['highlightHeading'], 'cards': h['directions']['cards'],
                       'posterHeading': h['directions']['posterHeading'],
                       'posterAccent': h['directions']['posterAccent'],
                       'posterSlugs': h['directions']['posterSlugs']},
        'learn': {**h['learn'], 'list': h['learn']['list']['items']},
        'advantagesHeading': h['advantagesHeading'],
        'advantages': h['advantages'],
        'performances': h['performances'],
        'studio': h['studio'],
        'gallery': h['gallery'],
        'cta': h['cta'],
        'seo': {'_todo': ('Home meta/og/twitter description says «…4 студии, работаем более 10 лет», the page body says '
                          '«более 20 лет» / «20+» (and the footer «более 20 лет»); pick one figure. The hero also claims '
                          '«20+ премиум-направлений» while the site lists 21 direction pages.'), **h['seo']},
        'lastModified': h['lastModified']
    }
    # gallery tab `photoprojects` note
    for tab in home_obj['gallery']['tabs']:
        if tab['id'] == 'photoprojects':
            tab['_todo'] = ('The live tab «Фотопроекты» holds 9 videos (3 «izobrazhenie…» clips + 6 persona-vid-foto); '
                            'the audit assumed 6. The «Ученики» carousel above has its own 6 videos.')
    write(content / 'home.ts', ['THome'], 'export const home: THome = ' + js(home_obj) + ';\n')

    # ---------------------------------------------------------------- pages
    ab, ev, fe, pv, sc = data['about'], data['events'], data['festivals'], data['privacy'], data['schedule']

    def hero(h1: str, sub: str | None = None, cta: dict[str, Any] | None = None) -> dict[str, Any]:
        o: dict[str, Any] = {'type': 'hero', 'heading': h1}
        if sub:
            o['subheading'] = sub
        if cta:
            o['cta'] = cta
        return o

    def dl(item: dict[str, Any]) -> dict[str, Any]:
        m = docs_meta[item['href']]
        return {'label': item['label'], 'href': m['src'], 'sizeBytes': m['bytes']}

    about = {'id': 'about', 'path': ab['path'], 'h1': ab['h1'],
             'sections': [hero(ab['h1']), {'type': 'article', 'blocks': R.deep(ab['blocks'])}],
             'seo': R.deep(ab['seo']), 'oldPaths': ab['oldPaths'], 'lastModified': ab['lastModified']}
    about['sections'][1]['_todo'] = ('«Вот уже более 20 лет» / «с 2002 года» in the body vs «более 10 лет» in the home '
                                     'meta description; pick one figure.')
    events = {'id': 'events', 'path': ev['path'], 'h1': ev['h1'],
              'sections': [hero(ev['h1'], ev['lead'], ev['cta']),
                           {'type': 'cards', 'items': ev['cards']},
                           {'type': 'article', 'blocks': R.deep(ev['article'])},
                           {'type': 'video', 'video': R.deep(ev['video'])}],
              'seo': R.deep(ev['seo']), 'oldPaths': ev['oldPaths'], 'lastModified': ev['lastModified']}
    events['sections'][2]['_todo'] = 'No prices for events are published on the live site.'
    fest_seo = R.deep(fe['seo'])
    fest_seo = {'_todo': ('Festival meta description says «Более 10 лет опыта», the body says «Более 20 лет на сцене» '
                          'and «20+ лет в индустрии детских конкурсов»; pick one figure.'), **fest_seo}
    festivals = {'id': 'festivals', 'path': fe['path'], 'h1': fe['h1'],
                 'sections': [hero(fe['h1'], fe['lead'], fe['cta']),
                              {'type': 'cards', 'items': fe['cards']},
                              {'type': 'article', 'blocks': R.deep(fe['article'])},
                              {'type': 'downloads', 'heading': fe['downloadsHeading'],
                               'items': [dl(x) for x in fe['downloads']]}],
                 'seo': fest_seo, 'oldPaths': fe['oldPaths'], 'lastModified': fe['lastModified']}
    privacy = {'id': 'privacy', 'path': pv['path'], 'h1': pv['h1'],
               'sections': [hero(pv['h1']), {'type': 'article', 'blocks': R.deep(pv['blocks'])}],
               'seo': R.deep(pv['seo']), 'oldPaths': pv['oldPaths'], 'lastModified': pv['lastModified']}
    privacy['sections'][1]['_todo'] = (
        'The privacy page text is a separate copy of the PDF «Политика обработки персональных данных» (the page had '
        'no inbound links, the footer linked the PDF); it names the operator «ИП Комаровой Наталией Юрьевной», signs '
        'as «Руководитель ТЦ «Персона»» and still points to the old URL https://www.personamodel.ru/content/raspisanie. '
        'Unify page and PDF and update the URL.')
    schedule = {'path': sc['path'], 'h1': sc['h1'], 'widgetMountIds': sc['mounts'], 'seo': R.deep(sc['seo']),
                'oldPaths': sc['oldPaths'], 'lastModified': sc['lastModified']}
    pages_body = (
        'export const aboutPage: TPage = ' + js(about) + ';\n\n'
        'export const eventsPage: TPage = ' + js(events) + ';\n\n'
        'export const festivalsPage: TPage = ' + js(festivals) + ';\n\n'
        'export const privacyPage: TPage = ' + js(privacy) + ';\n\n'
        '/** The schedule is rendered client-side by the Moyklass widgets; the live page has no schedule text. */\n'
        'export const schedulePage: TSchedulePage = ' + js(schedule) + ';\n\n'
        'export const pages: TPage[] = [aboutPage, eventsPage, festivalsPage, privacyPage];\n')
    write(content / 'pages.ts', ['TPage', 'TSchedulePage'], pages_body)

    # ---------------------------------------------------------------- redirects
    redirects: list[tuple[str, str]] = []

    def add(src: str, dst: str) -> None:
        if src != dst and (src, dst) not in redirects:
            redirects.append((src, dst))

    for d in directions:
        for old in d['oldPaths']:
            add(old, d['path'])
    add('/areas/salsa-i-bachata/', '/napravleniya/bachata/')
    for s in studios:
        for old in s['oldPaths']:
            add(old, s['path'])
    for old, (_key, new) in cfg.PAGES.items():
        add(old, new)
    add('/areas/', '/napravleniya/')
    add('/studios/', '/napravleniya/')
    add('/content/', '/')
    for old, new in cfg.DOCS.items():
        add(old, new)
    red_body = ('/** For `redirects()` in next.config.ts. Sources are the exact old paths (trailing slash); '
                'Next.js also matches the slash-less variants. */\n'
                'export const redirects: TRedirect[] = ' + js(
                    [{'source': s, 'destination': d, 'permanent': True} for s, d in redirects]) + ';\n')
    write(content / 'redirects.ts', ['TRedirect'], red_body)

    # ---------------------------------------------------------------- todos
    extra = [
        'Directions index: the live menu label «Направления», the H1 «Наши направления» and the page-tail heading '
        '«ДОПОЛНИТЕЛЬНЫЕ НАПРАВЛЕНИЯ НАШЕЙ ТВОРЧЕСКОЙ СТУДИИ» all name the catalogue differently.',
        'Direction pages: menu labels differ from H1/titles (Инженерный клуб/КЛАСС, Танцы/Театр танца, '
        'Школа моделей/Детская школа моделей, Вокал/Вокальная студия); both are kept (`shortTitle`, `hero.heading`).',
        'The home page and the old catalogue linked the empty stub «Сальса и бачата»; it is not migrated and '
        'redirects to /napravleniya/bachata/ (owner decision). Its poster `salsa.webp` was not downloaded.',
        'Direction pages: the decorative absolute-positioned image widgets (4 «photo strip» widgets per page) are '
        'empty on the live site and the 6 programme-card backgrounds are template-level CSS; none were migrated.',
        'Studio opening hours are free text in three formats («пн-сб по расписанию», «пн-вс по расписанию», '
        '«пн-вс с 11:00 до 20:00 по расписанию»); structure them once the owner confirms.',
        'Teacher roles for 10 bios are derived from phrases in the bio text (see TEACHER_ROLE in '
        'scripts/generate_ts.py); `directionSlugs` is derived only where the bio names the discipline.',
        'Teacher «Ахмедова Асият» (mehendi / art techniques) and «Меркулов Анатолий» (boxing) have no matching '
        'direction page; `directionSlugs` is empty for them. The price list has «БОКС» but there is no boxing page.',
        'Team page: grid card photos differ from popup portraits and their live alt texts were meaningless '
        '(«Наши преподаватели», «9 3 1»); alts were regenerated.',
    ]
    todos_unique = list(dict.fromkeys(TODOS + extra))
    todos_body = ('/** Every place where the live site contradicts itself or content needs an owner decision. Each item\n'
                  ' * also appears as a `// TODO(content): …` comment next to the affected data. */\n'
                  'export const contentTodos: string[] = ' + js(todos_unique) + ';\n')
    (content / 'todos.ts').write_text(HEADER + '\n' + todos_body, encoding='utf-8')
    print('generated', len(todos_unique), 'todos')


if __name__ == '__main__':
    main()
