// Generated from the personamodel.ru crawl of 2026-11-20 by scripts/generate_ts.py.
// Copy is verbatim; fix it here (or in the CMS that replaces this module).

/** Every place where the live site contradicts itself or content needs an owner decision. Each item
 * also appears as a `// TODO(content): …` comment next to the affected data. */
export const contentTodos: string[] = [
	'Hero photo picked during the rebuild from the gallery; owner to confirm or replace.',
	'Menu label «Школа моделей», page H1 «Детская школа моделей», meta title says «курс «Театр Моды»».',
	'Menu label «Танцы», page H1 «Театр танца», WP title «Танцы».',
	'Menu label «Вокал», page H1 «Вокальная студия».',
	'Menu label is «Инженерный клуб Мегавольт», the page H1 is «ИНЖЕНЕРНЫЙ КЛАСС МЕГАВОЛЬТ» and the price list says «ИНЖЕНЕРНЫЙ КУРС «МЕГАВОЛЬТ»»; pick one name.',
	'The price list prices «ЛОГОПЕД» only as an individual tariff.',
	'Page body keeps the live copy: the text after the six programme cards is copy-pasted Barre-fitness text («Что такое Barre-фитнес?», «Почему именно в нашей детской студии?»), there are two «Как проходят занятия?» headings and the tagline is «Баррэ-фитнес». The page is the parent of the adult menu group and needs its own copy.',
	'The old stub page «Сальса и бачата» (/areas/salsa-i-bachata/, empty body, no image) duplicated this direction and redirects here (owner decision); it was still linked from the home and catalogue grids.',
	'The page links to the separate family-school site https://personaschool.tilda.ws; the old URL slug was the typo «семенная» (seed) instead of «семейная» (family).',
	'Prices for the after-school care (48 000 ₽ with meals / 43 000 ₽ without) exist only in the page body, not in the price list on /tarify/.',
	'The live meta description of the catalogue is a broken auto-extract («PersOna PersOna … Наши направления Записаться»); kept verbatim, needs a hand-written one.',
	'Мичуринский проспект 56: studio page and site footer disagree (metro: page «м. Раменки» vs footer «м. Мичуринский проспект»; hours: page «пн-сб по расписанию» vs footer «пн-вс по расписанию»; phones: page +74993933005, +79995944060 vs footer +74993933005, +79251508738). Kept the studio page values.',
	'Богданова 19: studio page and site footer disagree (metro: page «м. Багратионовская» vs footer «м. Солнцево»; hours: page «пн-сб по расписанию» vs footer «пн-вс с 11:00 до 20:00 по расписанию»). Kept the studio page values.',
	'Богданова 19: the live meta description is a broken auto-extract of the contact block («АДРЕС: … МоскваБЛИЖАЙШАЯ СТАНЦИЯ МЕТРО…»); kept verbatim, needs a hand-written one.',
	'Нежинская 11: studio page and site footer disagree (hours: page «пн-сб по расписанию» vs footer «пн-вс с 11:00 до 20:00 по расписанию»). Kept the studio page values.',
	'The map/organisation link points to the host venue «Культурный центр «Меридиан»», not to PersOna itself; geo is the map centre of that embed.',
	'Профсоюзная 61: the live meta description is a broken auto-extract of the contact block («АДРЕС: … МоскваБЛИЖАЙШАЯ СТАНЦИЯ МЕТРО…»); kept verbatim, needs a hand-written one.',
	'Brand spelling varies on the live site: «PersOna» (copy, og:site_name), «Persona» (titles), «PersonaModel» (titles/descriptions), «Persona - Art Center» (site title), «Творческий центр PersOna» (JSON-LD), «Т.Ц. PersOna» (price list), «ТЦ «Персона»» (privacy policy). Pick one.',
	'FAQ «Как вы обеспечиваете безопасность?» presents the guarded territory of ЖК «Небо» as a general fact, but it applies only to the Мичуринский проспект studio.',
	'The price list is published only as a JPEG; these numbers are a transcription of that image and must be confirmed by the owner. Row labels keep the printed typos («АРТ-МАССТЕРСКАЯ», «ПРОГРАМИРОВАНИЕ», «1 ЗАНЯТИЯ»). Pilates, «Для взрослых», «Продлёнка», «Семейная школа» have no row; «БОКС» has a row but no direction page; the 4-lesson «Мегавольт» tier is quoted without 8/12-lesson tiers.',
	'The live tab «Фотопроекты» holds 9 videos (3 «izobrazhenie…» clips + 6 persona-vid-foto); the audit assumed 6. The «Ученики» carousel above has its own 6 videos.',
	'Home meta/og/twitter description says «…4 студии, работаем более 10 лет», the page body says «более 20 лет» / «20+» (and the footer «более 20 лет»); pick one figure. The hero also claims «20+ премиум-направлений» while the site lists 21 direction pages.',
	'«Вот уже более 20 лет» / «с 2002 года» in the body vs «более 10 лет» in the home meta description; pick one figure.',
	'No prices for events are published on the live site.',
	'Festival meta description says «Более 10 лет опыта», the body says «Более 20 лет на сцене» and «20+ лет в индустрии детских конкурсов»; pick one figure.',
	'The privacy page text is a separate copy of the PDF «Политика обработки персональных данных» (the page had no inbound links, the footer linked the PDF); it names the operator «ИП Комаровой Наталией Юрьевной», signs as «Руководитель ТЦ «Персона»» and still points to the old URL https://www.personamodel.ru/content/raspisanie. Unify page and PDF and update the URL.',
	'Directions index: the live menu label «Направления», the H1 «Наши направления» and the page-tail heading «ДОПОЛНИТЕЛЬНЫЕ НАПРАВЛЕНИЯ НАШЕЙ ТВОРЧЕСКОЙ СТУДИИ» all name the catalogue differently.',
	'Direction pages: menu labels differ from H1/titles (Инженерный клуб/КЛАСС, Танцы/Театр танца, Школа моделей/Детская школа моделей, Вокал/Вокальная студия); both are kept (`shortTitle`, `hero.heading`).',
	'The home page and the old catalogue linked the empty stub «Сальса и бачата»; it is not migrated and redirects to /napravleniya/bachata/ (owner decision). Its poster `salsa.webp` was not downloaded.',
	'Direction pages: the decorative absolute-positioned image widgets (4 «photo strip» widgets per page) are empty on the live site and the 6 programme-card backgrounds are template-level CSS; none were migrated.',
	'Studio opening hours are free text in three formats («пн-сб по расписанию», «пн-вс по расписанию», «пн-вс с 11:00 до 20:00 по расписанию»); structure them once the owner confirms.',
	'Teacher roles for 10 bios are derived from phrases in the bio text (see TEACHER_ROLE in scripts/generate_ts.py); `directionSlugs` is derived only where the bio names the discipline.',
	'Teacher «Ахмедова Асият» (mehendi / art techniques) and «Меркулов Анатолий» (boxing) have no matching direction page; `directionSlugs` is empty for them. The price list has «БОКС» but there is no boxing page.',
	'Team page: grid card photos differ from popup portraits and their live alt texts were meaningless («Наши преподаватели», «9 3 1»); alts were regenerated.'
];
