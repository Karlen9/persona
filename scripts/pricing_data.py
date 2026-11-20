"""Price list «ПРЕЙСКУРАНТ 2026/2027» as structured data.

The live site only publishes the price list as a JPEG (public/media/pricing/prejskurant-2026-2027.jpg), so the
numbers here are a transcription of that image (docs/site-examination.md §5.7, re-checked against the downloaded
JPEG). Row labels are kept exactly as printed, typos included. Prices are RUB; None = a dash on the list.
"""

TITLE = 'ПРЕЙСКУРАНТ 2026/2027'
SEASON = '2026/2027'
APPROVED_BY = 'Утверждаю /Комарова Н.Ю./ Руководитель Т.Ц. PersOna'
TRIAL = {'label': 'ПРОБНОЕ ГРУППОВОЕ ЗАНЯТИЕ (ПРИ ПОСЕЩЕНИИ НАПРАВЛЕНИЯ ВПЕРВЫЕ)', 'priceRub': 1500}

GROUP_COLUMNS = [
    {'label': '4 ЗАНЯТИЯ/МЕС', 'lessons': 4},
    {'label': '8 ЗАНЯТИЙ/МЕС', 'lessons': 8},
    {'label': '12 ЗАНЯТИЙ/МЕС', 'lessons': 12},
]
INDIVIDUAL_COLUMNS = [
    {'label': '1 ЗАНЯТИЯ', 'lessons': 1},
    {'label': '4 ЗАНЯТИЯ', 'lessons': 4},
    {'label': '8 ЗАНЯТИЙ', 'lessons': 8},
]

# (id, label as printed, direction slugs, prices aligned with columns)
GROUP_ROWS = [
    ('shkola-modeley', 'ШКОЛА МОДЕЛЕЙ', ['shkola-modeley'], [8500, 11500, 17000]),
    ('teatralnaya-studiya', 'ТЕАТРАЛЬНАЯ СТУДИЯ', ['teatr'], [8500, 11500, None]),
    ('vokalnaya-studiya', 'ВОКАЛЬНАЯ СТУДИЯ', ['vokal'], [8500, 11500, None]),
    ('studiya-tanca', 'СТУДИЯ ТАНЦА', ['tancy'], [8500, 11500, None]),
    ('risovanie-art-masterskaya', 'РИСОВАНИЕ/АРТ-МАСТЕРСКАЯ', ['risovanie', 'art-masterskaya'], [8500, 11500, None]),
    ('art-massterskaya', 'АРТ-МАССТЕРСКАЯ', ['art-masterskaya'], [8500, 11500, None]),
    ('shahmaty', 'ШАХМАТЫ', ['shahmaty'], [8500, 11500, None]),
    ('yazykovaya-shkola', 'ЯЗЫКОВАЯ ШКОЛА', ['yazykovaya-shkola'], [8500, 11500, None]),
    ('podgotovka-k-shkole', 'ПОДГОТОВКА К ШКОЛЕ', ['podgotovka-k-shkole'], [8500, 11500, None]),
    ('joga', 'ЙОГА', ['joga'], [8500, 11500, 17000]),
    ('bachata-salsa', 'БАЧАТА/САЛЬСА', ['bachata'], [8500, 11500, None]),
    ('barre', 'БАРРЭ', ['barre-fitnes'], [8500, 11500, None]),
    ('megavolt', 'ИНЖЕНЕРНЫЙ КУРС «МЕГАВОЛЬТ»', ['megavolt'], [11500, None, None]),
    ('robototehnika', 'РОБОТОТЕХНИКА/ПРОГРАМИРОВАНИЕ/ВИДЕОПРОФИ', ['robototehnika'], [8500, 11500, None]),
]

INDIVIDUAL_ROWS = [
    ('shkola-modeley', 'ШКОЛА МОДЕЛЕЙ', ['shkola-modeley'], [4000, 14000, 28000]),
    ('teatralnaya-studiya', 'ТЕАТРАЛЬНАЯ СТУДИЯ', ['teatr'], [4000, 14000, 28000]),
    ('vokalnaya-studiya', 'ВОКАЛЬНАЯ СТУДИЯ', ['vokal'], [4000, 14000, 28000]),
    ('studiya-tanca', 'СТУДИЯ ТАНЦА', ['tancy'], [4000, 14000, 28000]),
    ('risovanie-art-masterskaya', 'РИСОВАНИЕ/АРТ-МАСТЕРСКАЯ', ['risovanie', 'art-masterskaya'], [4000, 14000, 28000]),
    ('megavolt', 'ИНЖЕНЕРНЫЙ КУРС «МЕГАВОЛЬТ»', ['megavolt'], [4000, 14000, 28000]),
    ('shahmaty', 'ШАХМАТЫ', ['shahmaty'], [4000, 14000, 28000]),
    ('yazykovaya-shkola', 'ЯЗЫКОВАЯ ШКОЛА', ['yazykovaya-shkola'], [4000, 14000, 28000]),
    ('podgotovka-k-shkole', 'ПОДГОТОВКА К ШКОЛЕ', ['podgotovka-k-shkole'], [4000, 14000, 28000]),
    ('joga', 'ЙОГА', ['joga'], [4000, 14000, 28000]),
    ('bachata-salsa', 'БАЧАТА/САЛЬСА (СОЦИАЛЬНЫЕ ТАНЦЫ)', ['bachata'], [5000, 18000, 36000]),
    ('barre', 'БАРРЭ', ['barre-fitnes'], [4000, 14000, 28000]),
    ('robototehnika', 'РОБОТОТЕХНИКА/ПРОГРАМИРО/ВИДЕОПРОФ', ['robototehnika'], [5000, 18000, 36000]),
    ('logoped', 'ЛОГОПЕД', ['logoped'], [4000, 14000, 28000]),
    ('boks', 'БОКС', [], [5000, 18000, 36000]),
]

NOTES = ['! ТАРИФ "ДУЭТ" Рассчитывается как индивидуальный абонемент за минусом 20 % с человека']
