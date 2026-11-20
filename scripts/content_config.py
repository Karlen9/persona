"""Hand-maintained mapping tables for the personamodel.ru -> Next.js content migration.

Owner decisions (URL scheme, slugs, audiences) live here and nowhere else; the extractor,
the TypeScript generator and the redirect generator all read this module.
"""

from __future__ import annotations

# (old path as served, new slug, audience, category)
# Order = display order: children menu order, then the adult group, then family.
DIRECTIONS = [
    ('/studios/shkola_modeley/', 'shkola-modeley', 'kids', 'creativity'),
    ('/studios/teatr_tanca/', 'tancy', 'kids', 'dance'),
    ('/studios/vokalynaya_studiya/', 'vokal', 'kids', 'creativity'),
    ('/studios/teatralynaya_studiya/', 'teatr', 'kids', 'creativity'),
    ('/areas/risovanie/', 'risovanie', 'kids', 'creativity'),
    ('/areas/art-masterskaya/', 'art-masterskaya', 'kids', 'creativity'),
    ('/areas/shahmaty/', 'shahmaty', 'kids', 'development'),
    ('/areas/inzhenernyj-klub-megavolt/', 'megavolt', 'kids', 'development'),
    ('/areas/robototehnika/', 'robototehnika', 'kids', 'development'),
    ('/areas/podgotovka-k-shkole/', 'podgotovka-k-shkole', 'kids', 'development'),
    ('/studios/yazykovaya-shkola/', 'yazykovaya-shkola', 'kids', 'languages'),
    ('/areas/logoped/', 'logoped', 'kids', 'development'),
    ('/areas/igra-na-muzykalnyh-instrumentah/', 'muzykalnye-instrumenty', 'kids', 'creativity'),
    ('/areas/dlya-vzroslyh/', 'dlya-vzroslyh', 'adults', 'individual'),
    ('/areas/pilates/', 'pilates', 'adults', 'fitness'),
    ('/areas/joga/', 'joga', 'adults', 'fitness'),
    ('/areas/barre-fitnes/', 'barre-fitnes', 'adults', 'fitness'),
    ('/areas/bachata/', 'bachata', 'adults', 'dance'),
    ('/areas/individualnye-zanyati-dlya-vzroslyh/', 'individualnye-zanyatiya-dlya-vzroslyh', 'adults', 'individual'),
    ('/районы/семенная-школа/', 'semejnaya-shkola', 'family', 'school'),
    ('/areas/prodlenka/', 'prodlenka', 'family', 'school'),
]

# (old path, slug, short label as used in header/footer address links)
STUDIOS = [
    ('/content/studiya-michurinskiy/', 'michurinskiy-prospekt', 'Мичуринский проспект 56'),
    ('/content/studiya-solntsevo/', 'solntsevo', 'Богданова 19'),
    ('/content/studiya-slavyan/', 'slavyanskiy-bulvar', 'Нежинская 11'),
    ('/content/studiya-profsoyuznaya/', 'profsoyuznaya', 'Профсоюзная 61')
]

# Simple pages: old path -> (key, new path)
PAGES = {
    '/': ('home', '/'),
    '/o-nas/': ('about', '/o-nas/'),
    '/content/nashi-pedagogi/': ('team', '/komanda/'),
    '/content/raspisanie/': ('schedule', '/raspisanie/'),
    '/tarify/': ('tariffs', '/tarify/'),
    '/otzyvy/': ('reviews', '/otzyvy/'),
    '/news/': ('news', '/novosti/'),
    '/content/festivalnoe-dvizhenie/': ('festivals', '/festivali/'),
    '/content/organizaciya-prazdnikov/': ('events', '/sobytiya/'),
    '/privacy-policy/': ('privacy', '/politika-konfidencialnosti/'),
    '/brunches/': ('directions-index', '/napravleniya/')
}

# Old PDF paths -> new local paths (under public/)
DOCS = {
    '/wp-content/uploads/2026/01/abonentskij-dogovor.pdf': '/docs/abonentskij-dogovor.pdf',
    '/wp-content/uploads/2026/01/pravila-povedeniya.pdf': '/docs/pravila-povedeniya.pdf',
    '/wp-content/uploads/2026/01/politika-personalnyh-dannyh.pdf': '/docs/politika-personalnyh-dannyh.pdf',
    '/wp-content/uploads/2026/08/stars_international_2026_polozhenie.pdf': '/docs/festivals/stars-international-2026-polozhenie.pdf',
    '/wp-content/uploads/2026/03/malenkie_miss_i_mister_rossiya_2026.pdf': '/docs/festivals/malenkie-miss-i-mister-rossiya-2026.pdf',
    '/wp-content/uploads/2026/03/fashion-kitchen.pdf': '/docs/festivals/fashion-kitchen-2026.pdf'
}

PRICE_LIST_PATH = '/wp-content/uploads/2026/08/prejskurant-26-27.jpg'
DEFAULT_OG_PATH = '/wp-content/uploads/2026/03/img_6233-1-1024x516.jpg'
LOGO_PATH = '/wp-content/uploads/2026/01/logo.png'

CATEGORY_LABELS = {
    'creativity': 'Творчество',
    'dance': 'Танцы',
    'development': 'Развитие',
    'languages': 'Языки',
    'fitness': 'Фитнес',
    'school': 'Школа',
    'individual': 'Индивидуальные занятия'
}

AUDIENCE_LABELS = {'kids': 'Для детей', 'adults': 'Для взрослых', 'family': 'Семья'}


def translit(text: str) -> str:
    table = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya'
    }
    out = ''.join(table.get(ch, ch) for ch in text.lower())
    import re
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', out)).strip('-')
