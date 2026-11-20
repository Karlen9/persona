# Website examination: personamodel.ru (PersOna)

Snapshot date: 2026-11-20. Subject: https://personamodel.ru, a Moscow children's model agency and creative art centre ("Творческий центр PersOna", site name in WordPress: "Persona - Art Center", Open Graph site name "PersOna").

Purpose: single reference for a complete rebuild on Next.js 16 (App Router, React 19, Tailwind v4, bun) with a built-in CMS. All site content (titles, menu labels, headings, copy, addresses) is quoted verbatim in Russian; prose is English. Everything below is derived from the collected data (rendered HTML of all 37 sitemap URLs plus probes, WordPress REST API, sitemaps, robots.txt, response headers, the combined CSS and JS bundles). Items that could not be determined are collected in section 13.

Conventions: "observed" = seen in the data; "proposed" = recommendation of this document. Times are seconds measured from this machine (a UTC+7 machine to a Russian host) with a generic User-Agent and sequential requests, so absolute values include network latency; relative comparisons are the useful part.

## Contents

1. Executive summary
2. Technology stack and hosting
3. Route inventory
4. Navigation model
5. Page-by-page content breakdown
6. Proposed content model
7. Media inventory
8. Forms and integrations
9. SEO inventory and redirect map
10. Design inventory (as-is)
11. Performance audit
12. Rebuild recommendations
13. Unknown / needs owner input
14. Appendix: data sources and refresh procedure

## 1. Executive summary

**What the site is.** A marketing and lead-generation site for a children's creative centre in Moscow that has operated since 2002 ("Творческая студия PersOna существует с 2002 года"; "Вот уже более 20 лет мы, вместе с Вашими детьми, делаем этот мир добрее, талантливее, красивее!"). The home H1 is "Всё для гармоничного развития детей и взрослых в одном месте" with the sub-line "20+ премиум-направлений от лучших педагогов! Инвестируйте время в развитие — экономьте на логистике — получайте результат". The `<title>` still positions it as "Детское модельное агентство и творческая студия в Москве — PersOna".

**Three business lines** (from the "О НАС" page): "Творческая студия" (classes), "Фестивальное движение" (competitions and festivals; own trademark "Mini Miss & Mister"), "Семейная школа" (family school). A fourth commercial line, "Организация событий" (children's parties and events), and "ПРОДЛЕНКА" (after-school care) sit in the secondary navigation bar.

**Audience.** Parents of children roughly 3-17 (age bands appear in individual direction pages: 3-5, 4-6, 6-9, 7-10, 10-14, 11-14, 14-17) and, increasingly, adults (a group of adult directions: ПИЛАТЕС, Йога, Баррэ-фитнес, Бачата, Индивидуальные занятия). Russian-language, Moscow-only, four physical studios.

**Business goals and conversion paths (observed):**

1. Lead form in the global footer (anchor `#form`). Two lead paths exist in the markup. (a) **Moyklass CRM widget** (widget id `01gGAHCMTHh6sF5MFhcE7tRjEqC2dNs2KhPj`, mount `#SiteWidgetMoyklass130355`), rendered client-side, present on all 37 pages and the only lead form that is visible: on the home page it sits in the footer container `footer-cta` (H2 "Запишитесь на бесплатную консультацию"), on the other 36 pages inside the footer container `footer-form` (H2 "Связаться с нами"); submissions go to Moyklass, not to WordPress. (b) **Contact Form 7** (form id 730, plugin 6.1.5), server-rendered in the `footer-form` container on the 36 non-home pages only (name, required phone, message, button "Оставить заявку", helper text "Наш менеджер ответит вам в ближайшее время"), posting to WordPress (REST `/wp-json/contact-form-7/v1/contact-forms/730/feedback` when JS is active). Its Elementor widget carries all three visibility classes (`elementor-hidden-desktop`, `-tablet`, `-mobile`), which the site's combined CSS maps to `display:none` at every breakpoint, so the CF7 form is in the HTML but not shown to visitors (CSS rule read from the stylesheet, not confirmed in a real browser). Where CF7 mail goes, and whether CF7 leads ever reach Moyklass, is unknown and needs WP admin access (section 13). Almost every CTA button ("Записаться", "Записаться на консультацию", "Получить консультацию") is an anchor to `#form`; the home page also has a CTA banner with id `consult-form` (H2 "Запишитесь на бесплатную консультацию", button "Записаться" → `#form`), which is not a form.
2. Phone calls: three public numbers in the header and footer (`tel:` links tracked as Metrika goal `click_phone`).
3. Messengers: fixed floating buttons (Telegram, VK, MAX) plus "Задать вопрос в Telegram / ВКонтакте / max" buttons in the FAQ block (Telegram click tracked as `click_telegram`).
4. Public-review and map presence: Yandex Maps reviews widget on /otzyvy/, Yandex Sprav rating badge and 2GIS reviews link in every footer.
5. Secondary: payment (СБП QR link behind the button "Оплатить" on /tarify/, "Поле свободной оплаты"), downloadable festival regulations (PDF), self-serve schedule (Moyklass schedule widget on /content/raspisanie/).

**Size.** 37 indexable URLs in the sitemap (15 `page` + 22 `areas`), 0 blog posts, 825+ registered media items (834 reported by the API) totalling about 3.8 GB, heavily weighted towards raw phone videos (.mov/.mp4).

**Headline findings** (details in the sections named):

- The CMS content is almost entirely Elementor markup (home page content is 2.98 MB of REST `content.rendered`); there is very little structured data except the `areas` custom post type, whose per-item body is also Elementor-driven. A rebuild has to re-model content by hand rather than export it (section 6, 12).
- The tariff page is a single JPEG image ("Прейскурант 2026/2027", 1815x2560); the prices are not text on the site. They were transcribed in section 5.7 from the image and must be confirmed by the owner.
- The schedule page contains no schedule data of its own; it is two empty mount points for Moyklass widgets.
- URL structure is inconsistent: `areas` items are served under `/areas/`, `/studios/` and one Cyrillic `/районы/…` prefix, pages under `/content/…`, the directions index at `/brunches/` (typo for "branches") and `/areas/` 301-redirects to it. See sections 3 and 9.
- Performance is dominated by server response time (median TTFB 2.6 s, max 6.7 s) and a heavy client layer, not by HTML size (median 61 KB gzipped). See section 11.
- Content inconsistencies (studio metro stations and opening hours differ between footer and studio pages, copy-pasted Barre-fitness text on the "Для взрослых" page, an empty "Сальса и бачата" page that is still linked from the home page and the directions index) are catalogued in section 5.14.

## 2. Technology stack and hosting

### 2.1 Stack (observed)

| Layer                 | Finding                                                                                                                                                                                                                                                                                                                                                                                   | Evidence                                                                                                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CMS                   | WordPress (core version string `7.1.5` on `wp-emoji-release.min.js?ver=7.1.5`)                                                                                                                                                                                                                                                                                                            | REST index at `/wp-json/` (354 routes), `X-Powered-By`                                                                                                                                                     |
| Language runtime      | PHP 8.3.37                                                                                                                                                                                                                                                                                                                                                                                | `X-Powered-By: PHP/8.3.37` header                                                                                                                                                                          |
| Web server            | openresty (nginx build)                                                                                                                                                                                                                                                                                                                                                                   | `Server: openresty` header                                                                                                                                                                                 |
| Hosting provider      | RU-CENTER / nic.ru (domain and hosting vendor)                                                                                                                                                                                                                                                                                                                                            | The hosting-level 403 page served for `/studios/` and `/content/` is the nic.ru error template ("Ошибка 403", links to nic.ru help)                                                                        |
| Theme                 | `hello-elementor` parent + child theme `hello-elementor-child` (body classes `wp-theme-hello-elementor wp-child-theme-hello-elementor-child`)                                                                                                                                                                                                                                             | body class, `/wp-content/themes/hello-elementor-child/` fonts and JS                                                                                                                                       |
| Page builder          | Elementor + Elementor Pro (kit #7)                                                                                                                                                                                                                                                                                                                                                        | `elementor/v1`, `elementor-pro/v1` REST namespaces; `data-elementor-*` attributes; Pro widgets: loop grid, loop carousel, mega menu, flip box, nested tabs/accordion/carousel, theme post title, site logo |
| Elementor templates   | header #381, footer #426, single `areas` template #843, loop items #595 (7 home cards with bullet lists, 3 on every area page), #504 (17 image cards on home carousel and /brunches/), #2124 (footer loop grid, renders "nothing found"), popup #552 (mobile menu), 26 teacher popups on /content/nashi-pedagogi/ (IDs 6839, 1437-1506, 2738-2914)                                        | `data-elementor-type`/`-id` attributes                                                                                                                                                                     |
| SEO                   | Rank Math SEO (sitemaps "generated by Rank Math", `rankmath/v1` namespace, `class="rank-math-schema"`)                                                                                                                                                                                                                                                                                    | HTML comment in sitemap, REST, JSON-LD                                                                                                                                                                     |
| Custom fields         | Advanced Custom Fields is active (`acf` key in REST responses, plugin endpoint `acf-set`); the `acf` objects are empty in REST for all 22 `areas` items                                                                                                                                                                                                                                   | REST                                                                                                                                                                                                       |
| Forms                 | Contact Form 7 6.1.5 (REST namespace `contact-form-7/v1`, `wpcf7` JS object inlined). A server-rendered CF7 form (id 730, class `wpcf7-form`) sits in the footer `footer-form` container on all 36 non-home pages but is hidden at every breakpoint by Elementor visibility classes (8.3); the home page has no CF7 form. The visible lead form on all pages is the Moyklass widget (8.1) | REST, inline script                                                                                                                                                                                        |
| Cookie consent        | CookieYes (`cookie-law-info` plugin, `cky/v1` REST, CookieYes lite JS 3.4.0)                                                                                                                                                                                                                                                                                                              | HTML, assets                                                                                                                                                                                               |
| Cache/optimisation    | WP-Optimize (`WPO-Cache-Status` header and `wpo-plugins-tables-list.json` in robots.txt) plus a custom performance layer (2.3)                                                                                                                                                                                                                                                            | headers, robots.txt                                                                                                                                                                                        |
| Maps plugin           | "YaMaps" by yhunter.ru (`[yamaps]` shortcode placeholder on studio pages; `api-maps.yandex.ru/2.1` loaded on 4 pages)                                                                                                                                                                                                                                                                     | studio pages                                                                                                                                                                                               |
| Other REST namespaces | `sweep/v1`, `elementor-one/v1`, `elementor-ai/v1`, `elementor-hello-elementor/v1`, `wp-abilities/v1`, `wp-site-health/v1`, `wp-block-editor/v1`, `oembed/1.0`                                                                                                                                                                                                                             | REST index                                                                                                                                                                                                 |
| Custom plugin         | Namespace `persona-agent/v1` with routes `purge`, `branch4`, `acf-set` (all POST; deliberately not called). Indicates an automation/agent integration that edits ACF fields and purges the cache                                                                                                                                                                                          | REST index                                                                                                                                                                                                 |
| Post types            | `post`, `page`, `attachment`, `nav_menu_item`, `wp_block`, `wp_template`, `wp_template_part`, `wp_global_styles`, `wp_navigation`, `wp_font_family`, `wp_font_face`, `e-floating-buttons`, `elementor_library`, `elementor_snippet`, `areas` ("Направления", has_archive), `rm_content_editor` (Rank Math)                                                                                | `/wp-json/wp/v2/types`                                                                                                                                                                                     |
| Taxonomies            | `category` ("Рубрики", one term "Без рубрики", 0 posts), `post_tag` (0). `areas` has no taxonomy                                                                                                                                                                                                                                                                                          | REST                                                                                                                                                                                                       |
| Posts                 | 0 (no blog). The "Новости" page does not list posts; it links to social networks                                                                                                                                                                                                                                                                                                          | REST                                                                                                                                                                                                       |
| Analytics             | Yandex Metrika counter 112028433                                                                                                                                                                                                                                                                                                                                                          | inline script                                                                                                                                                                                              |
| CRM                   | Moyklass (app.moyklass.com widgets)                                                                                                                                                                                                                                                                                                                                                       | inline scripts, external script tags                                                                                                                                                                       |

### 2.2 Hosting and delivery evidence

- Homepage response headers: `Cache-Control: no-cache, must-revalidate, max-age=31536000` (contradictory) and `Expires` one year ahead; `Vary: Accept-Encoding,User-Agent` (varying on User-Agent prevents shared caching); `X-Persona-Static: 1`; `X-Persona-Html-Bytes: 542012` (decompressed size) with `Content-Length: 77955` and `Content-Encoding: gzip`.
- Static assets (combined CSS, JS, images, PDFs) return `Cache-Control: max-age=31536000`, `Expires` one year ahead, gzip for text types, `Last-Modified`/`ETag`.
- No CDN headers were observed (no `CF-*`, `X-Cache`, etc.).
- `http://personamodel.ru/` and `https://www.personamodel.ru/` each 301 to `https://personamodel.ru/`.
- Hosting-level 403 on directory-like paths `/studios/` and `/content/` (nic.ru template); `/районы/` returns a WordPress-style 404.
- Default login URL `/wp-login.php` answers 200 (relevant to the hardening notes in section 12).
- REST responses carry `X-Robots-Tag: noindex`.

### 2.3 The custom performance layer ("persona-*")

A theme/mu-plugin layer rewrites WordPress output before it is sent. Observed behaviours:

1. **Static HTML cache**: `<meta name="persona-static" content="1">`, `X-Persona-Static` header; full-page HTML served in gzip.
2. **Combined CSS**: one `all-css-<hash>.css?ver=20260911a` file per template family replaces dozens of Elementor/plugin stylesheets. 16 distinct hashes exist across the 37 pages (22 area pages share `all-css-9f530083df.css`). Sizes: home 726,845 bytes raw / about 72 KB gzip; area pages 714,621 raw / about 79 KB gzip.
3. **Combined JS**: Elementor frontend, Elementor Pro, Swiper, etc. are concatenated into `el-js-<hash>.js` (home 411,122 raw / 116 KB gzip) and loaded on idle by `persona-el-idle`, together with jQuery 87,553 raw / 30 KB gzip. Loading is delayed until idle (1.8 s timeout), load+1.5 s, or the first click on menu/popup/swiper controls (the click is replayed after load).
4. **Image holding**: `src` replaced by a 1x1 GIF and the real URL stored in `data-persona-hold` / `data-persona-hold-srcset`, restored by `persona-hold-images` when near the viewport. Hidden-viewport galleries are deferred (`persona-defer-hidden-gal`). Swiper preloading disabled (`persona-swiper-lazy`).
5. **Third parties deferred**: Moyklass widget loaded when the form scrolls within 280 px or on the first CTA click (`persona-moyklass-idle`); Metrika `tag.js` (about 86 KB per the inline comment) after `load` or 2.5 s on desktop, on first scroll/pointer or 12 s on mobile; CookieYes script on idle; Yandex map iframes lazy via `data-src` with IntersectionObserver (240 px margin); `persona-hcg-boot.js` (the "how classes going" video slider, 40,689 bytes raw) loaded when `#how-classes-going__slider` nears the viewport.
6. **Speculative navigation**: `speculationrules` prerender (or `<link rel=prefetch>`) of up to 8 internal links on hover/touch (skipped for `wp-admin`, `wp-json`, PDFs, images, mp4, and when Save-Data/2G).
7. **Fonts**: Montserrat self-hosted as two preloaded woff2 files in the child theme (`bx6ANxqUneKx06UkIXISn3F4Ck-L2qM2VQ.woff2` 6,092 bytes, `JTUQjIg1_i6t8kCHKm459WxRzS7m0dR9pBOi.woff2` 22,224 bytes).
8. **Emoji**: emoji glyphs in copy are swapped for SVGs under `/wp-content/uploads/persona-emoji/` (e.g. `1f389-oclean2.svg`).
9. **Elementor performance patch** (`persona-el-perf`): throttles Elementor's anchor-scroll MutationObserver.
10. **Debug/feature query parameters** listed as `Clean-param` in robots.txt: `persona_wp`, `persona_no_webp`, `persona_all_popups`.
11. **Video handling** (`persona-front`, 39,919 chars of inline JS): hosted videos open in a custom lightbox (`#persona-video-lb`), `preload: none`, with poster images.
12. **Lead goal bridge**: wraps `ym()` and DOM observers to fire Metrika goal `lead` when a Moyklass form shows its success state (section 8.4).

Rebuild implication: Next.js should replace this whole layer natively (static generation, `next/image`, `next/font`, `next/script` with `lazyOnload`, `<link rel="prefetch">` via `next/link`).

## 3. Route inventory

### 3.1 All 37 sitemap URLs

Source of truth for the list is `/sitemap_index.xml` → `/page-sitemap.xml` (15 URLs) and `/areas-sitemap.xml` (22 URLs). `Last modified` shows the REST `modified` timestamp (site local time, UTC+3) and the sitemap `lastmod` (date part only). All sitemap `lastmod` values are `2026-08-28T00:00:00+00:00` except `/privacy-policy/` (`2026-09-07T10:26:31+00:00`), i.e. the sitemap dates are manually or programmatically normalised and do not reflect real modification times (REST shows modification dates from 2026-02-03 to 2026-09-07). Every page returned HTTP 200, `robots: index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large`, and a self-referencing canonical (decoded for the Cyrillic URL). Timings are from the sequential crawl; "gzip" is bytes on the wire, "HTML" the decompressed document.

| #   | Path                                          | WP type / ID | Title tag                                                            | Meta description                                                                                                                                               | H1                                                           | Canonical | Last modified (REST / sitemap)   | Template family                   | HTTP | TTFB s | Total s | gzip KB | HTML KB |
| --- | --------------------------------------------- | ------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------- | -------------------------------- | --------------------------------- | ---- | ------ | ------- | ------- | ------- |
| 1   | `/areas/inzhenernyj-klub-megavolt/`           | areas #804   | Инженерный клуб Мегавольт - Persona - Art Center                     | Инженерный класс Мегавольт в центре Persona в Москве: электроника, пайка и проекты для детей.                                                                  | ИНЖЕНЕРНЫЙ КЛАСС МЕГАВОЛЬТ                                   | self      | 2026-08-23T00:13:03 / 2026-08-28 | Area single (template #843)       | 200  | 2.60   | 4.72    | 61.3    | 326.6   |
| 2   | `/areas/bachata/`                             | areas #1877  | Бачата - Persona - Art Center                                        | Бачата в творческом центре Persona в Москве: парный танец, ритм и занятия для взрослых.                                                                        | Бачата                                                       | self      | 2026-04-28T07:38:02 / 2026-08-28 | Area single (template #843)       | 200  | 1.36   | 3.59    | 60.9    | 322.8   |
| 3   | `/areas/barre-fitnes/`                        | areas #813   | Баррэ-фитнес - Persona - Art Center                                  | Баррэ-фитнес в творческом центре Persona в Москве: силовые занятия у станка для осанки и тонуса.                                                               | Баррэ-фитнес                                                 | self      | 2026-04-28T07:20:31 / 2026-08-28 | Area single (template #843)       | 200  | 4.44   | 8.66    | 61.1    | 325.0   |
| 4   | `/areas/pilates/`                             | areas #1899  | ПИЛАТЕС - Persona - Art Center                                       | Пилатес в творческом центре Persona в Москве: силовые и дыхательные занятия для осанки, гибкости и самочувствия.                                               | ПИЛАТЕС                                                      | self      | 2026-04-28T07:11:48 / 2026-08-28 | Area single (template #843)       | 200  | 1.34   | 7.18    | 61.3    | 323.4   |
| 5   | `/areas/art-masterskaya/`                     | areas #805   | Арт-мастерская - Persona - Art Center                                | Арт-мастерская Persona в Москве: рисование, творчество и занятия для детей.                                                                                    | Арт-мастерская                                               | self      | 2026-04-28T07:09:34 / 2026-08-28 | Area single (template #843)       | 200  | 6.52   | 9.91    | 61.2    | 327.3   |
| 6   | `/areas/igra-na-muzykalnyh-instrumentah/`     | areas #808   | Игра на музыкальных инструментах - Persona - Art Center              | Игра на музыкальных инструментах в творческом центре Persona в Москве: занятия для детей с преподавателем.                                                     | ИГРА НА МУЗЫКАЛЬНЫХ ИНСТРУМЕНТАХ                             | self      | 2026-04-28T07:09:10 / 2026-08-28 | Area single (template #843)       | 200  | 3.03   | 8.00    | 61.1    | 326.3   |
| 7   | `/areas/logoped/`                             | areas #801   | Логопед - Persona - Art Center                                       | Логопед в творческом центре Persona в Москве: занятия по речи для детей с преподавателем центра.                                                               | Логопед                                                      | self      | 2026-04-28T07:05:50 / 2026-08-28 | Area single (template #843)       | 200  | 5.22   | 7.74    | 61.3    | 321.9   |
| 8   | `/studios/yazykovaya-shkola/`                 | areas #810   | Курсы английского языка для детей и взрослых в Москве \| PersOna     | Курсы английского языка в Москве для детей 4–14 лет и взрослых в центре PersOna: для малышей, школьников, английский через музыку. Запись: +7 (499) 393-30-05. | Языковая школа                                               | self      | 2026-04-28T07:01:36 / 2026-08-28 | Area single (template #843)       | 200  | 1.14   | 4.98    | 61.7    | 328.3   |
| 9   | `/areas/joga/`                                | areas #800   | Йога - Persona - Art Center                                          | Йога в творческом центре Persona в Москве: дыхание, гибкость и занятия для взрослых.                                                                           | Йога                                                         | self      | 2026-04-28T06:53:01 / 2026-08-28 | Area single (template #843)       | 200  | 2.46   | 4.56    | 60.4    | 318.4   |
| 10  | `/areas/podgotovka-k-shkole/`                 | areas #1652  | ПОДГОТОВКА К ШКОЛЕ - Persona - Art Center                            | Подготовка к школе в творческом центре Persona в Москве: занятия для дошкольников перед первым классом.                                                        | ПОДГОТОВКА К ШКОЛЕ                                           | self      | 2026-04-28T06:16:01 / 2026-08-28 | Area single (template #843)       | 200  | 4.14   | 9.24    | 61.4    | 326.3   |
| 11  | `/areas/robototehnika/`                       | areas #1648  | Робототехника - Persona - Art Center                                 | Робототехника в творческом центре Persona в Москве: конструирование, логика и инженерные навыки для детей.                                                     | Робототехника                                                | self      | 2026-04-28T06:15:08 / 2026-08-28 | Area single (template #843)       | 200  | 4.59   | 14.61   | 61.4    | 327.4   |
| 12  | `/areas/shahmaty/`                            | areas #1642  | Шахматы - Persona - Art Center                                       | Шахматы в творческом центре Persona в Москве: мышление, стратегия и занятия для детей.                                                                         | Шахматы                                                      | self      | 2026-04-28T06:12:20 / 2026-08-28 | Area single (template #843)       | 200  | 1.30   | 3.98    | 61.0    | 323.2   |
| 13  | `/studios/teatralynaya_studiya/`              | areas #814   | Школа актерского мастерства для детей в Москве - студия «PersOna»    | Актёрское мастерство для детей в Москве: сценическая речь и движение, постановка миниатюр, спектаклей и мюзиклов. Запись в студию PersOna: +7 (499) 393-30-05. | Театр                                                        | self      | 2026-04-28T06:03:48 / 2026-08-28 | Area single (template #843)       | 200  | 1.57   | 4.14    | 61.1    | 325.9   |
| 14  | `/areas/risovanie/`                           | areas #787   | Рисование - Persona - Art Center                                     | Рисование в творческом центре Persona в Москве: художественные занятия для детей в студии.                                                                     | Рисование                                                    | self      | 2026-04-28T06:00:05 / 2026-08-28 | Area single (template #843)       | 200  | 2.78   | 13.64   | 61.9    | 329.8   |
| 15  | `/studios/vokalynaya_studiya/`                | areas #489   | Детская вокальная студия в Москве - Обучение вокалу в PersonaModel   | Творческий центр PersOna предлагает детям пройти обучение современному вокалу в профессиональной эстрадно-вокальной студии в Москве.                           | Вокальная студия                                             | self      | 2026-04-28T05:52:42 / 2026-08-28 | Area single (template #843)       | 200  | 6.67   | 15.39   | 61.6    | 326.8   |
| 16  | `/studios/teatr_tanca/`                       | areas #492   | Обучение танцам в Москве - Театр танца «PersOna»                     | Театр танца PersOna в Москве: современная хореография, эстрадный и сценический постановочный танец для детей. Запись на занятия по +7 (499) 393-30-05.         | Театр танца                                                  | self      | 2026-04-28T05:50:52 / 2026-08-28 | Area single (template #843)       | 200  | 6.21   | 8.92    | 60.7    | 325.7   |
| 17  | `/studios/shkola_modeley/`                    | areas #496   | Школа моделей для детей в Москве — курс «Театр Моды» \| PersonaModel | Школа моделей для детей в Москве: курс «Театр Моды» от PersonaModel — творческий потенциал, уверенность и навыки модельного искусства. +7 (499) 393-30-05.     | Детская школа моделей                                        | self      | 2026-04-28T05:40:51 / 2026-08-28 | Area single (template #843)       | 200  | 2.89   | 7.97    | 61.0    | 326.3   |
| 18  | `/areas/prodlenka/`                           | areas #811   | Продленка - Persona - Art Center                                     | Продлёнка в творческом центре Persona в Москве: после уроков — учёба, отдых и кружки.                                                                          | ПРОДЛЕНКА                                                    | self      | 2026-04-28T05:35:53 / 2026-08-28 | Area single (template #843)       | 200  | 1.70   | 2.65    | 61.0    | 324.0   |
| 19  | `/районы/семенная-школа/`                     | areas #812   | Семейная школа - Persona - Art Center                                | Семейная школа Persona в Москве: занятия для детей и родителей в одном центре.                                                                                 | Семейная школа                                               | self      | 2026-04-28T05:14:58 / 2026-08-28 | Area single (template #843)       | 200  | 4.49   | 8.11    | 60.4    | 320.7   |
| 20  | `/areas/individualnye-zanyati-dlya-vzroslyh/` | areas #1909  | ИНДИВИДУАЛЬНЫЕ ЗАНЯТИЯ ДЛЯ ВЗРОСЛЫХ - Persona - Art Center           | Индивидуальные занятия для взрослых в творческом центре Persona в Москве: персональный график и программа под ваши цели.                                       | ИНДИВИДУАЛЬНЫЕ ЗАНЯТИЯ ДЛЯ ВЗРОСЛЫХ                          | self      | 2026-04-13T18:34:45 / 2026-08-28 | Area single (template #843)       | 200  | 1.82   | 4.26    | 59.6    | 313.2   |
| 21  | `/areas/dlya-vzroslyh/`                       | areas #1865  | Для взрослых - Persona - Art Center                                  | Направления для взрослых в творческом центре Persona в Москве: танцы, фитнес и творчество в удобное время.                                                     | Для взрослых                                                 | self      | 2026-03-10T12:53:44 / 2026-08-28 | Area single (template #843)       | 200  | 4.10   | 8.85    | 59.4    | 312.0   |
| 22  | `/areas/salsa-i-bachata/`                     | areas #802   | Сальса и бачата - Persona - Art Center                               | Сальса и бачата в творческом центре Persona в Москве: парные танцы, ритм и занятия для взрослых.                                                               | Сальса и бачата                                              | self      | 2026-02-25T23:45:22 / 2026-08-28 | Area single (template #843)       | 200  | 2.60   | 5.71    | 55.8    | 297.4   |
| 23  | `/`                                           | page #12     | Детское модельное агентство и творческая студия в Москве — PersOna   | Детское модельное агентство и творческая студия PersonaModel в Москве: школа моделей, танцы, вокал, театр, рисование. 4 студии, работаем более 10 лет.         | Всё для гармоничного развития детей и взрослых в одном месте | self      | 2026-08-24T10:14:10 / 2026-08-28 | Home (wp-page #12)                | 200  | 1.07   | 2.35    | 76.1    | 529.3   |
| 24  | `/privacy-policy/`                            | page #3      | Политика обработки персональных данных - Persona - Art Center        | Политика обработки персональных данных творческого центра PersOna (personamodel.ru): какие данные собираем, как храним и защищаем, права пользователей.        | Политика обработки персональных данных                       | self      | 2026-09-07T13:26:31 / 2026-09-07 | Legal text page                   | 200  | 1.30   | 3.47    | 57.7    | 289.8   |
| 25  | `/content/organizaciya-prazdnikov/`           | page #1076   | Организация событий от творческой студии PersonaModel в Москве       | Организация детских праздников в Москве от творческого центра PersOna: дни рождения, Новый год, выпускные. Программа под возраст: игры, конкурсы, музыка.      | Организация событий                                          | self      | 2026-08-24T20:15:49 / 2026-08-28 | Content page (wp-page)            | 200  | 1.36   | 4.14    | 58.9    | 289.2   |
| 26  | `/content/festivalnoe-dvizhenie/`             | page #1053   | Фестивальное движение в Москве от творческого центра Persona         | Фестивальное движение PersOna в Москве: конкурсы и фестивали для детей и взрослых на профессиональных площадках. Более 10 лет опыта, работа на результат.      | Фестивальное движение                                        | self      | 2026-08-24T20:08:03 / 2026-08-28 | Content page (wp-page)            | 200  | 1.05   | 2.89    | 56.2    | 282.4   |
| 27  | `/o-nas/`                                     | page #1949   | О нас — творческая студия Persona в Москве                           | Творческая студия Persona в Москве: кто мы, как работаем и почему родители выбирают наш центр для развития детей.                                              | О НАС                                                        | self      | 2026-08-22T01:54:46 / 2026-08-28 | Content page (wp-page)            | 200  | 1.38   | 2.61    | 52.3    | 257.9   |
| 28  | `/content/studiya-profsoyuznaya/`             | page #6677   | СТУДИЯ М. КАЛУЖСКАЯ / ПРОФСОЮЗНАЯ - Persona - Art Center             | АДРЕС: ул. Профсоюзная, д. 61, МоскваБЛИЖАЙШАЯ СТАНЦИЯ МЕТРО: м. Калужская, м. ВоронцовскаяТЕЛЕФОН: +74993933005, +79251508738,e-mail:                         | СТУДИЯ М. КАЛУЖСКАЯ / ПРОФСОЮЗНАЯ                            | self      | 2026-08-21T19:54:27 / 2026-08-28 | Studio branch page                | 200  | 4.11   | 5.47    | 52.9    | 260.4   |
| 29  | `/content/nashi-pedagogi/`                    | page #927    | Педагоги творческой студии PersonaModel в Москве.                    | Наши талантливые педагоги творческой студии PersonaModel в Москве раскроют таланты Ваших детей.                                                                | Наша команда                                                 | self      | 2026-03-03T17:31:09 / 2026-08-28 | Content page (wp-page)            | 200  | 2.63   | 8.36    | 75.0    | 395.2   |
| 30  | `/news/`                                      | page #952    | Новости творческой студии в Москве - PersonaModel                    | Следите за новостями творческой студии в Москве на официальном сайте PersonaModel                                                                              | Новости творческой студии                                    | self      | 2026-03-03T00:53:30 / 2026-08-28 | Content page (wp-page)            | 200  | 1.05   | 2.10    | 51.1    | 254.1   |
| 31  | `/otzyvy/`                                    | page #2464   | Отзывы - Persona - Art Center                                        | Понравилось работать с нами? Поделитесь своим опытом в отзыве на Яндекс.Картах по ссылке!                                                                      | Отзывы                                                       | self      | 2026-02-26T02:07:14 / 2026-08-28 | Content page (wp-page)            | 200  | 1.05   | 4.08    | 51.7    | 257.3   |
| 32  | `/tarify/`                                    | page #1596   | Тарифы - Persona - Art Center                                        | Тарифы творческого центра Persona в Москве: абонементы и занятия. Актуальные условия уточняйте у администратора.                                               | Тарифы                                                       | self      | 2026-02-26T01:33:03 / 2026-08-28 | Content page (wp-page)            | 200  | 3.16   | 5.35    | 53.3    | 271.3   |
| 33  | `/brunches/`                                  | page #1590   | Наши направления \| PersonaModel                                     | PersOna PersOna PersOna PersOna PersOna PersOna PersOna PersOna Наши направления Записаться                                                                    | Наши направления                                             | self      | 2026-02-25T19:04:22 / 2026-08-28 | Directions index (loop-grid #504) | 200  | 2.11   | 5.10    | 52.9    | 278.5   |
| 34  | `/content/raspisanie/`                        | page #1130   | Общее расписание творческого центра PersonaModel в Москве            | Ознакомьтесь с расписанием творческих студий PersonaModel в Москве. Наши студии - это занятия хореографией, вокалом для детей в удобное время.                 | Расписание                                                   | self      | 2026-02-04T15:26:48 / 2026-08-28 | Content page (wp-page)            | 200  | 3.69   | 6.91    | 51.3    | 254.2   |
| 35  | `/content/studiya-solntsevo/`                 | page #1030   | СТУДИЯ М. Солнцево - Persona - Art Center                            | АДРЕС: улица Богданова, 19, МоскваБЛИЖАЙШАЯ СТАНЦИЯ МЕТРО: м. БагратионовскаяТЕЛЕФОН: +74993933005, +79251508738,e-mail: personamodel@mail.ruРЕЖИМ             | СТУДИЯ М. Солнцево                                           | self      | 2026-02-04T12:05:52 / 2026-08-28 | Studio branch page                | 200  | 1.05   | 1.98    | 52.4    | 257.9   |
| 36  | `/content/studiya-michurinskiy/`              | page #1001   | Студия для детей у м. Мичуринский проспект (Раменки) \| PersonaModel | Творческая студия PersOna у метро Мичуринский проспект / Раменки: расписание, схема проезда, адрес Мичуринский проспект, 56. Запись: +7 (499) 393-30-05.       | СТУДИЯ М. МИЧУРИНСКИЙ ПРОСПЕКТ/РАМЕНКИ                       | self      | 2026-02-03T23:47:56 / 2026-08-28 | Studio branch page                | 200  | 3.79   | 5.65    | 52.5    | 258.7   |
| 37  | `/content/studiya-slavyan/`                   | page #946    | Творческая студия для детей у м. Славянский бульвар \| PersonaModel  | Творческая студия PersOna у метро Славянский бульвар: расписание занятий, схема проезда, адрес Нежинская ул., 11. Запись на сайте или по +7 (499) 393-30-05.   | СТУДИЯ М. СЛАВЯНСКИЙ БУЛЬВАР                                 | self      | 2026-02-03T23:46:55 / 2026-08-28 | Studio branch page                | 200  | 3.30   | 6.09    | 52.4    | 258.5   |

Notes:

- The Cyrillic URL is served as `/%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%D1%8B/%D1%81%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F-%D1%88%D0%BA%D0%BE%D0%BB%D0%B0/` and reads "/районы/семенная-школа/". "семенная" means "seed-related": it is a typo for "семейная" (family). The REST `slug` of that item is `semejnaya-shkola`, so the served path is a manual override.
- Several WP `slug` values differ from the served last path segment, proving per-post custom permalinks: REST slug `teatralynaya-studiya` → served `teatralynaya_studiya` (underscore); `teatr-tanca` → `teatr_tanca`; `shkola-modeley` → `shkola_modeley`; `vokalynaya-studiya` → `vokalynaya_studiya`; `angliyskiy-yazyk` → `yazykovaya-shkola`; `semejnaya-shkola` → `семенная-школа`; page `studiya-m-solntsevo` → `studiya-solntsevo`; and all `page` items are served under `/content/…` although none has a parent (all `parent: 0`). No permalink plugin is identifiable from public data (the REST `meta` only has `_acf_changed`, `footnotes`), so the likely cause (a "custom permalinks" plugin or an ACF/Rank Math override) is unconfirmed; see section 13. Probes confirm WP does not honour the "natural" URLs: `/studios/shkola-modeley/` (slug form), `/areas/shkola_modeley/`, `/areas/teatr-tanca/`, `/areas/semejnaya-shkola/` and `/content/studiya-m-solntsevo/` all return 404.
- Title patterns: the Rank Math default `%title% - Persona - Art Center` is used on 22 pages; 15 have hand-written titles (see section 9).
- `/brunches/` and `/areas/` (CPT archive) share content; the archive URL 301-redirects (section 3.2). Manifest rows 33 and 38 are the same document.

### 3.2 Probes: redirects, errors, archives, search, feeds, files

| Request                                          | Result                                                                                                                                               | Notes                                                                                                           |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/areas/` (post type archive, `has_archive`)     | 301 → `/brunches/` (200, 54,220 gzip bytes, same document as the directions page)                                                                    | the archive slug is redirected to a normal page                                                                 |
| `/studios/`                                      | 403, hosting-level nic.ru HTML (14,737 bytes)                                                                                                        | not a WordPress route; the prefix has no index                                                                  |
| `/content/`                                      | 403, same hosting template                                                                                                                           | same                                                                                                            |
| `/районы/`                                       | 404                                                                                                                                                  | WordPress 404                                                                                                   |
| nonexistent URL `/this-page-does-not-exist-xyz/` | 404, 271-byte static HTML: title "Страница не найдена", `<meta name="robots" content="noindex">`, text "Нет такой страницы." and a link "На главную" | no theme chrome; very bare                                                                                      |
| `http://personamodel.ru/`                        | 301 → `https://personamodel.ru/`                                                                                                                     |                                                                                                                 |
| `https://www.personamodel.ru/`                   | 301 → `https://personamodel.ru/`                                                                                                                     |                                                                                                                 |
| `/o-nas` (no trailing slash)                     | 301 → `http://personamodel.ru/o-nas/`                                                                                                                | redirect goes to http first (extra hop; then http→https)                                                        |
| `/wp-sitemap.xml`                                | 301 → `/sitemap_index.xml`                                                                                                                           |                                                                                                                 |
| `/sitemap_index.xml`                             | 200                                                                                                                                                  | robots.txt `Sitemap:` target; `/sitemap.xml` also serves the same index                                         |
| `/feed/`                                         | 404                                                                                                                                                  | RSS feeds are disabled                                                                                          |
| `/category/bez-rubriki/`                         | 404                                                                                                                                                  | the only category archive is not routable                                                                       |
| `/?s=test`, `/?s=танцы` (site search)            | 200, returns the home page document (title "Детское модельное агентство и творческая студия в Москве — PersOna", indexable, H1 of the home page)     | search is effectively not implemented, although JSON-LD declares a `SearchAction` at `/?s={search_term_string}` |
| `/main-sitemap.xsl`                              | 200                                                                                                                                                  | Rank Math XSL                                                                                                   |
| `/wp-login.php`                                  | 200                                                                                                                                                  | default login exposed                                                                                           |
| `/robots.txt`                                    | 200                                                                                                                                                  | see 9.5                                                                                                         |
| `/wp-json/`                                      | 200, 354 routes                                                                                                                                      | public REST, `wp/v2/pages`, `areas`, `media` readable anonymously; `elementor_library` returns 401              |

### 3.3 Internal links not in the sitemap, orphans and broken links

Scan of all `<a href>` in the 37 documents (scripts and styles excluded):

- Every one of the 37 sitemap URLs is internally linked from every page (header, footer or mega menu) except two:
  - `/privacy-policy/` has **0 inbound anchors** (orphan). The footer link "Политика обработки персональных данных" points to the PDF `/wp-content/uploads/2026/01/politika-personalnyh-dannyh.pdf`, and the Moyklass consent link is rewritten to the same PDF by an inline script. The HTML page and the PDF are two separate copies of the policy.
  - `/areas/salsa-i-bachata/` has 2 inbound links (home page, from the "salsa" direction card, and `/brunches/`). It is **not in the main menu** and is an empty stub (section 5.13).
- Anchor targets: `#form` (26 pages, footer lead form, `id="form"`), `/#vistuplenia` (22 area pages, id `vistuplenia` on the home page "Наши выступления"), `#consult-form` (home CTA banner, not a form), `#content`, plus `#elementor-action…` popup triggers (menu popup #552, 26 teacher popups) and `#` placeholders ("Для детей" parent item and "Смотреть далее" on the home page).
- Files linked: three footer PDFs on every page (`abonentskij-dogovor.pdf` 1,733,025 B, `pravila-povedeniya.pdf` 898,125 B, `politika-personalnyh-dannyh.pdf` 5,829,845 B) and three festival PDFs on /content/festivalnoe-dvizhenie/ (`stars_international_2026_polozhenie.pdf`, `malenkie_miss_i_mister_rossiya_2026.pdf`, `fashion-kitchen.pdf`).
- Orphaned media: PDFs `polozhenie_chc_2025.pdf`, `polozhenie_mal_miss_i_mister_2025.pdf`, `stars_international_2025_polozhenie.pdf`, `prejskurant-25-26.pdf` exist in the media library but are not linked from any crawled page.
- Anchor `/` with fragment: one link `https://personamodel.ru` (no trailing slash) on /tarify/ (resolves, harmless).
- No broken internal links (non-200 targets) were found among the crawled anchors. The one broken-by-design item is the nonfunctional search.
- External links: Telegram `t.me/personamp56` and `t.me/PersonaRamenki`, VK `vk.com/personamodelmoscow` and a VK message link, MAX `max.ru/id615422777189_biz` and `max.ru/u/…`, Yandex Maps short links, Yandex org `yandex.ru/maps/org/persona/165851817022/`, 2GIS reviews link, the YaMaps vendor link (`yhunter.ru`, shown on 4 studio pages), the external Tilda site `https://personaschool.tilda.ws` (linked from the "Семейная школа" area page), the СБП payment link `qr.nspk.ru/…` on /tarify/. `personaschool.tilda.ws` indicates the family-school product lives on a separate site.

### 3.4 Other discovered files

- `/robots.txt`, `/sitemap_index.xml`, `/page-sitemap.xml`, `/areas-sitemap.xml`, `/main-sitemap.xsl`.
- Favicons: `/wp-content/themes/hello-elementor-child/favicon.svg`, `/wp-content/uploads/2026/01/fav.png` (32/192/apple-touch), `fav-120.png`.
- Price list image: `/wp-content/uploads/2026/08/prejskurant-26-27.jpg` (482,507 B).

## 4. Navigation model

The header (Elementor template #381), footer (#426) and mobile menu popup (#552) are identical on all 37 pages except for the footer lead block: the home page renders the container `footer-cta` (Moyklass mount only), the other 36 pages render the container `footer-form` (hidden CF7 form plus the same Moyklass mount). The rest of the footer matches apart from current-page menu highlighting and lazy-loading attributes (compared in the saved HTML). The template CSS has `.home .footer-form{display:none}` and `body:not(.home) .footer-cta{display:none}`, but the served markup only contains the container that applies. Menu items are Elementor nav-menu / mega-menu widgets with hard-coded internal links (`internal-url` dynamic tags), not WordPress menus (`nav_menu_item` REST type exposes nothing usable).

### 4.1 Header

Top row: logo (`/wp-content/uploads/2026/01/logo.png.webp`, alt "Persona Art Center", links to `/`), burger icon that opens popup #552 on mobile, primary menu, studio address links, phone numbers.

**Primary menu (nav-menu `7f8e8a0`, duplicated for desktop and mobile in the markup):**

```text
О нас                                  → /o-nas/
Направления                            → /brunches/
  Для детей                            → #  (non-link group label)
    Школа моделей                      → /studios/shkola_modeley/
    Танцы                              → /studios/teatr_tanca/
    Вокал                              → /studios/vokalynaya_studiya/
    Театр                              → /studios/teatralynaya_studiya/
    Рисование                          → /areas/risovanie/
    Арт-мастерская                     → /areas/art-masterskaya/
    Шахматы                            → /areas/shahmaty/
    Инженерный клуб Мегавольт          → /areas/inzhenernyj-klub-megavolt/
    Робототехника                      → /areas/robototehnika/
    ПОДГОТОВКА К ШКОЛЕ                 → /areas/podgotovka-k-shkole/
    Языковая школа                     → /studios/yazykovaya-shkola/
    Логопед                            → /areas/logoped/
    Игра на музыкальных инструментах   → /areas/igra-na-muzykalnyh-instrumentah/
  Для взрослых                         → /areas/dlya-vzroslyh/
    ПИЛАТЕС                            → /areas/pilates/
    Йога                               → /areas/joga/
    Баррэ-фитнес                       → /areas/barre-fitnes/
    Бачата                             → /areas/bachata/
    Индивидуальные занятия             → /areas/individualnye-zanyati-dlya-vzroslyh/
Команда                                → /content/nashi-pedagogi/
Расписание                             → /content/raspisanie/
Тарифы                                 → https://personamodel.ru/tarify/  (absolute URL)
Новости                                → /news/
Отзывы                                 → /otzyvy/
```

The brief's rendering "О НАС / НАПРАВЛЕНИЯ / КОМАНДА / РАСПИСАНИЕ / ТАРИФЫ / НОВОСТИ / ОТЗЫВЫ" is the CSS uppercase presentation; the markup text is mixed-case. Not in this menu: "Семейная школа", "Продленка", "Сальса и бачата" (they appear in the secondary bar or not at all).

**Studio address links (icon-list `171b991`):** "Мичуринский проспект 56" → `/content/studiya-michurinskiy/`; "Богданова 19" → `/content/studiya-solntsevo/`; "Нежинская 11" → `/content/studiya-slavyan/`; "Профсоюзная 61" → `/content/studiya-profsoyuznaya/`.

**Phones (icon-list `2386003`):** "+7 (999) 594-40-60" (`tel:+79995944060`), "+7 (925) 150-87-38" (`tel:+79251508738`), "+7 (499) 393-30-05" (`tel:+74993933005`).

**Secondary coral bar (mega-menu `41d8318`, tablet/mobile nav-menu `0644355`):**

```text
организация событий   → /content/organizaciya-prazdnikov/
фестивальное движение → /content/festivalnoe-dvizhenie/
СЕМЕЙНАЯ ШКОЛА        → /районы/семенная-школа/  (served percent-encoded)
ПРОДЛЕНКА             → /areas/prodlenka/
```

(The nav-menu variant capitalises the labels as "Организация событий", "Фестивальное движение", "Семейная школа", "Продленка".)

**Third bar, quick directions (mega-menu `d84ccb0`; mobile variants `8758e05`, `199aa66` with "Close Вокал"/"Open Вокал" toggle labels in English, an i18n leftover):** "Школа моделей" → `/studios/shkola_modeley/`, "Танцы" → `/studios/teatr_tanca/`, "Вокал" → `/studios/vokalynaya_studiya/`, "Театр" → `/studios/teatralynaya_studiya/`, "Рисование" → `/areas/risovanie/`. The brief's label for this bar (ШКОЛА МОДЕЛЕЙ / ТАНЦЫ / ВОКАЛ / ТЕАТР / РИСОВАНИЕ) matches.

### 4.2 Mobile menu popup (#552)

Contains the logo, a close action (`#elementor-action:action=popup:close`), the full primary menu above, the heading "Наши студии:" with the four address links (Yandex short links: `yandex.com/maps/-/CLtCUPm2` Мичуринский проспект 56, `CLtCYCNE` Богданова 19, `CLtCY-Jt` Нежинская 11, `yandex.ru/maps/org/kulturny_tsentr_meridian/1010597830/` Профсоюзная 61) and the three phones. Opened by the header burger icon (`#elementor-action:action=popup:open&settings=…id 552`). The popup contains no form or input field (checked in the saved HTML of all pages).

### 4.3 Floating messenger buttons

An Elementor icon-list (`30f4581`, class `social-fixed`, `_position: fixed`, scaled 0.66, anchored bottom-right) in the footer template, three icon-only links: Telegram `https://t.me/PersonaRamenki`, VK `https://vk.com/im/convo/-127439478?entrypoint=community_page&tab=all` (direct-message link to community 127439478), MAX `https://max.ru/u/f9LHodD0cOJdh8p7CvDStKuAkflx5QNgJMA_SWF7W8lH-LVLz97NcccMf6Y`. It is hidden when it would overlap carousel arrows (`is-arrow-clash`). The `e-floating-buttons` post type is empty (0 items), so this is not the Elementor floating-buttons feature.

### 4.4 Footer

Top to bottom: (1) fixed messenger buttons; (2) icon-box "Спасибо, что остаетесь с нами более 20 лет!" / "Мы готовим детей и подростков, и счастливы, что вместе делаем этот мир добрее, талантливее и красивее!"; (3) anchor `#form`, then the lead block, which differs by page: on the 36 non-home pages the container `footer-form` with H2 "Связаться с нами", the CF7 form (hidden at all breakpoints; fields "Ваше имя", "Ваш телефон", "Ваше сообщение", button "Оставить заявку", note "Наш менеджер ответит вам в ближайшее время") and the Moyklass mount `#SiteWidgetMoyklass130355`; on the home page the container `footer-cta` with H2 "Запишитесь на бесплатную консультацию" (a text block and a button "Записаться" → `#consult-form`, both hidden at all breakpoints) and the Moyklass mount; (4) a 4-slide carousel, one slide per studio: contact block (АДРЕС / БЛИЖАЙШАЯ СТАНЦИЯ МЕТРО / ТЕЛЕФОН / e-mail / РЕЖИМ РАБОТЫ), social icon list (Telegram `t.me/personamp56`, VK `vk.com/personamodelmoscow`, MAX `max.ru/id615422777189_biz`), three studio photos and a lazy Yandex map iframe (the Профсоюзная slide has photo alt texts "Профсоюзная 61 — фасад / холл / зал"; the others reuse alt "О НАС"); (5) heading "Наши студии в Москве:" with four address links; (6) contact list: the three phones and `personamodel@mail.ru`; (7) legal documents list; (8) Yandex Sprav rating badge iframe and a 2GIS reviews link (image alt "gis").

Legal documents (footer, all pages): "Абонентский договор" → `/wp-content/uploads/2026/01/abonentskij-dogovor.pdf` (1.7 MB); "Правила поведения" → `/wp-content/uploads/2026/01/pravila-povedeniya.pdf` (0.9 MB); "Политика обработки персональных данных" → `/wp-content/uploads/2026/01/politika-personalnyh-dannyh.pdf` (5.8 MB).

The footer also contains an empty Elementor loop grid (template #2124) that renders "nothing found": dead markup.

### 4.5 Popups and anchors

| Item                                 | Trigger                                                   | Content                                            |
| ------------------------------------ | --------------------------------------------------------- | -------------------------------------------------- |
| Popup #552                           | header burger (mobile/tablet)                             | menu, studios, phones                              |
| Teacher popups (26, IDs in 5.5)      | click on a teacher photo card on /content/nashi-pedagogi/ | photo, name (H2), bio                              |
| Cookie banner (CookieYes)            | first visit; revisit button bottom-left                   | section 8.5                                        |
| Video lightbox (`#persona-video-lb`) | click on a video poster                                   | hosted .mov/.mp4                                   |
| `#form`                              | any "Записаться…" button                                  | footer lead form                                   |
| `#consult-form`                      | home block "Запишитесь на бесплатную консультацию"        | CTA banner (H2 + button "Записаться" → `#form`)    |
| `#vistuplenia`                       | "Выступления" button on area pages (`/#vistuplenia`)      | home "Наши выступления" section                    |
| `#how-classes-going__slider`         | JS hook                                                   | "Как проходят занятия?" video slider on area pages |

### 4.6 Breadcrumbs, pagination, search

None found. No breadcrumb markup, no pagination (no posts), no working site search (section 3.2).

## 5. Page-by-page content breakdown

Block type vocabulary: hero, feature cards (icon-box), flip boxes (Elementor `flip-box`, front title and back description), carousel (Swiper-based `nested-carousel`, `image-carousel`, `loop-carousel`), tabs (`nested-tabs`), accordion (`nested-accordion`), gallery (`gallery`), video (hosted, lightbox), marquee ("PersOna" repeated strip via `html` widget), CRM widget, map, form.

Common to nearly every content page: a "PersOna" marquee strip under the header (decorative `html` widget with 8 repeated words "PersOna"), the global footer, and the Elementor popup #552.

### 5.1 Home `/` (WP page #12, 2,979,369 chars of REST content, 542,012 B document)

Ordered sections:

1. **Hero.** H1 "Всё для | гармоничного развития | детей и взрослых в одном месте"; text "20+ премиум-направлений от лучших педагогов! Инвестируйте время в развитие — экономьте на логистике — получайте результат"; button "Записаться на консультацию" → `#form`; social icon list (Telegram `t.me/personamp56`, VK, MAX).
2. **Direction cards, loop carousel** (template #595, 3 slides desktop / 2 tablet / 1 mobile, autoplay 5 s): 7 cards each with an H2 post title and a bullet list (verbatim):
   - "Школа моделей": Дефиле / фотопозирование | Танец | Актёрское мастерство | Этикет | Стилистика / самопрезентация | Основы правильного питания
   - "Танцы": Хип-хоп | Контемп | Джаз-фанк | K-pop | Брейк-данс | Хай-хилз | Вау-данс (для самых маленьких)
   - "Языковая школа": Английский язык | Французский язык | Итальянский язык | Испанский язык | Португальский язык | Китайский язык | Арабский язык
   - "Театр": Актёрское мастерство | Сценическая речь | Сценическое движение | Постановка этюдов, спектаклей | Опыт на сцене
   - "Шахматы": Логика и память | Усидчивость и концентрация | Стратегическое мышление | Принятие решений | Нацеленность на результат
   - "ПОДГОТОВКА К ШКОЛЕ": Обучение грамоте и чтение | Математика и логика | Развитие речи и кругозора | Постановка руки и подготовка к письму | Психологическая готовность
   - "Вокальная студия": Постановка голоса и дыхания | Расширение вокального диапазона | Подбор песенного материала | Работа с микрофоном | Опыт студийной записи | Подбор сценического образа
     The cards link to the corresponding direction pages (the carousel markup lists the links `shkola_modeley`, `teatr_tanca`, `yazykovaya-shkola`, `teatralynaya_studiya`, `shahmaty`, `podgotovka-k-shkole`, `vokalynaya_studiya`; the "Танцы" card is `/studios/teatr_tanca/`).
3. **"Мы не просто обучаем - мы растим победителей!"** (H2): image `persona-learn.jpg`; "Мы учитываем возраст, уровень подготовки и характер каждого ученика."; four bullets "Профессионалы отбора — мы нанимаем только лучших", "Синхронизация расписания — удобно для детей и родителей", "Концентрация качества — 20+ топ направлений в одном месте", "Ваш персональный менеджер — один контакт для всех вопросов"; button "Получить консультацию" → `#form`.
4. **Marquee** "PersOna" (decorative).
5. **"Наши преимущества"** (H2), feature cards (icon-box, 6, rendered twice: a desktop grid and a mobile carousel of 6 slides): "Прозрачность для родителей: Онлайн-видеонаблюдение за занятиями в реальном времени"; "Регулярные выступления: Участие в топовых конкурсах и фестивалях в России и за рубежом"; "Пробное занятие: Помогаем определить направление, в котором ребёнок раскроется"; "Жёсткий отбор педагогов: Только практикующие специалисты с подтверждёнными результатами"; "Творческие сборы и интенсивы: Погружение, рост и новые навыки в формате лагерей и выездов"; "Соотношение цены и качества: Оптимальная стоимость занятий без ущерба качеству обучения".
6. **"Наши направления"** (H2) with the word "PersOna" (heading), then a loop carousel (template #504) of 17 image cards (portrait webp posters 720x1280 such as `vokal.webp`, `tanzi.webp`, `shkola-modeley.webp`) each linking to a direction page; the 17 cards are the areas with IDs 496, 492, 489, 787, 800, 801, 802 (Сальса и бачата), 804, 805, 808, 810, 811, 812, 813, 814, 1642, 1652. Newer areas (1865 "Для взрослых", 1877 "Бачата", 1899 "ПИЛАТЕС", 1909 "ИНДИВИДУАЛЬНЫЕ ЗАНЯТИЯ ДЛЯ ВЗРОСЛЫХ") are not in this carousel.
7. **"Наши выступления"** (H2, anchor `#vistuplenia`), sub-heading "Ученики": a video carousel of 6 vertical videos (4 lightbox `.mov`/`.mp4` with posters `video-1.webp`, `video-3.webp`; 2 inline mp4: `2026/08/3132911871239949869-1-1.mp4`, `instories_result_c74ac2d5-….mp4`); link "Смотреть далее" → `#`.
8. **"Наша студия"** (H2): image carousel, 8 photos, 3 per view desktop / 2 tablet / 1 mobile, arrows, autoplay.
9. **"Жизнь нашего творческого центра в кадрах"** (H2, sub-heading "PersOna"): tabs `Танцы | Вокал | Театр | Мода | Достижения | Фотопроекты | Праздники`. Tabs 1-5 each contain a 4-column grid gallery (12 photos, 3:2 aspect, lightbox) plus a 12-slide image carousel (mobile); tab "Фотопроекты" has 6 lightbox videos (`persona-vid-foto-01…06.mp4`, posters `…-poster.jpg`); tab "Праздники" has 6 lightbox videos (`persona-vid-prazd-01…06.mp4`). The tab bar has custom JS for click handling and scroll restoration. (The "Ученики" carousel also includes 3 further video posters `izobrazhenie_2026-03-01_*.png.webp` for `.mov` files.)
10. **CTA block** (anchor `#consult-form`): H2 "Запишитесь на бесплатную консультацию", button "Записаться" → `#form` (and a duplicate hidden button).
11. **"Частые вопросы"** (H2, sub-heading "Вопросы"): three nested accordions with 7 items in total (see FAQ below), then buttons "Задать вопрос в Telegram" → `t.me/PersonaRamenki`, "Задать вопрос в ВКонтакте", "Задать вопрос в max".

FAQ (verbatim, 7 accordion items; JSON-LD `FAQPage` contains only items 1, 2, 3 and 7 and treats the CTA as a question):

1. "Как проходит отбор педагогов?" - "Отбор проходит среди специалистов с профильным образованием и опытом работы. В штат педагог принимается только после очного собеседования с управляющим или директором центра."
2. "Можно ли совмещать несколько направлений со скидкой?" - "В PersOna действует система лояльности: • скидка 15% — на второе направление или второго ребёнка из одной семьи при покупке группового абонемента • скидка 30% — на третье направление или третьего ребёнка из одной семьи при покупке группового абонемента"
3. "Если ребёнок заболел — как компенсировать пропуски?" - "Если вы заранее предупредили PersOna о болезни или отъезде, пропущенные занятия можно посетить в других группах вашего направления или попробовать новые направления при наличии действующего абонемента. Групповые абонементы действуют календарный месяц."
4. "Когда будет виден результат?" - "При регулярном посещении занятий и выполнении рекомендаций педагогов первые результаты обычно заметны через 1–3 месяца."
5. "Будут ли дополнительные траты кроме абонемента?" - "Дополнительные расходы возможны — например, на пошив костюмов, реквизит или учебные пособия. Все такие расходы заранее согласовываются с родителями и никогда не являются обязательными."
6. "Как вы обеспечиваете безопасность?" - "Центр PersOna находится на охраняемой территории ЖК «Небо». В студии постоянно присутствует администратор, который следит за порядком и безопасностью детей"
7. "Готовы инвестировать в развитие ребёнка?" - "Запишитесь на бесплатную консультацию — мы составим персональную карту развития и познакомим вас с центром."

Widget counts on the home page: image 32, text-editor 22, video 21, heading 17, icon 14, icon-list 13, icon-box 13, html 9, button 7, theme-post-title 7, image-carousel 6, gallery 5, nested-carousel 3, nested-accordion 3, nested-tabs 1, loop-carousel 2, loop-grid 1, plus header/footer widgets. 124 `<img>` tags, 2,245 opening tags in the saved HTML (the brief measured 2,262 live DOM nodes), 1 JSON-LD graph plus LocalBusiness and FAQPage.

### 5.2 "О НАС" `/o-nas/` (page #1949)

Hero H1 "О НАС"; one long text block: "Вот уже более 20 лет мы, вместе с Вашими детьми, делаем этот мир добрее, талантливее, красивее!", three directions "Творческая студия, Фестивальное движение, Семейная школа", "Творческая студия PersOna существует с 2002 года…", an invitation to follow VK / MAX / Telegram (`vk.com/personamodelmoscow`, `t.me/personamp56`, `max.ru/id615422777189_biz`), then 6 photo widgets (no alt text). Title tag "О нас — творческая студия Persona в Москве".

### 5.3 Directions index `/brunches/` (page #1590, H1 "Наши направления")

Hero: H1 and button "Записаться" → `#form`; 17 portrait direction images and a loop grid (template #504, 3 columns desktop / 2 tablet / 1 mobile) of the same 17 area cards (order: 1652 ПОДГОТОВКА К ШКОЛЕ, 1642 Шахматы, 814 Театр, 813 Баррэ-фитнес, 812 Семейная школа, 811 Продленка, 810 Языковая школа, 808 Игра на музыкальных инструментах, 805 Арт-мастерская, 804 Инженерный клуб Мегавольт, 802 Сальса и бачата, 801 Логопед, 800 Йога, 787 Рисование, 496 Школа моделей, 492 Танцы, 489 Вокальная студия). The `/areas/` archive redirects here.

### 5.4 Studio pages (4 pages, same layout)

Layout: marquee, H1, a two-column block with a map (YaMaps shortcode placeholder; the lazy map loads `api-maps.yandex.ru/2.1`) and a contact text block (АДРЕС / БЛИЖАЙШАЯ СТАНЦИЯ МЕТРО / ТЕЛЕФОН / e-mail / РЕЖИМ РАБОТЫ). No photos, no teachers, no schedule per studio.

Studio data as it appears on the studio page vs in the global footer (differences in bold):

| Studio (H1)                                                             | Address (studio page)                          | Metro (studio page)           | Phones (studio page)       | Hours (studio page) | Footer address / metro / hours                                                                             |
| ----------------------------------------------------------------------- | ---------------------------------------------- | ----------------------------- | -------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------- |
| СТУДИЯ М. МИЧУРИНСКИЙ ПРОСПЕКТ/РАМЕНКИ `/content/studiya-michurinskiy/` | г. Москва, Мичуринский проспект 56 (ЖК «Небо») | м. Раменки                    | +74993933005, +79995944060 | пн-сб по расписанию | Мичуринский проспект 56 / м. Мичуринский проспект / пн-вс по расписанию; phones +74993933005, +79251508738 |
| СТУДИЯ М. Солнцево `/content/studiya-solntsevo/`                        | улица Богданова, 19, Москва                    | **м. Багратионовская**        | +74993933005, +79251508738 | пн-сб по расписанию | Богданова 19 / **м. Солнцево** / **пн-вс с 11:00 до 20:00 по расписанию**                                  |
| СТУДИЯ М. СЛАВЯНСКИЙ БУЛЬВАР `/content/studiya-slavyan/`                | Нежинская улица, 11, Москва                    | м. Славянский бульвар         | +74993933005, +79251508738 | пн-сб по расписанию | Нежинская 11 / м. СЛАВЯНСКИЙ БУЛЬВАР / пн-вс с 11:00 до 20:00 по расписанию                                |
| СТУДИЯ М. КАЛУЖСКАЯ / ПРОФСОЮЗНАЯ `/content/studiya-profsoyuznaya/`     | ул. Профсоюзная, д. 61, Москва                 | м. Калужская, м. Воронцовская | +74993933005, +79251508738 | пн-вс по расписанию | Профсоюзная 61 / м. Калужская, м. Воронцовская / пн-вс по расписанию                                       |

E-mail on all: `personamodel@mail.ru`. Map links: Мичуринский `https://yandex.ru/maps/-/CPAUADMD` (page) and `yandex.com/maps/-/CLtCUPm2` (header/footer); Солнцево `…/CPAcnYlt` and `…/CLtCYCNE`; Славянский `…/CPAcjGyV` and `…/CLtCY-Jt`; Профсоюзная `yandex.ru/maps/org/kulturny_tsentr_meridian/1010597830/` (a Yandex organisation card of the host venue "Культурный центр «Меридиан»", not PersOna's own card).

Map coordinates from the footer embeds (lon, lat): Мичуринский 37.485727, 55.695510; Богданова 37.393335, 55.652898; Нежинская 37.473339, 55.707811; Профсоюзная embed uses organisation id 1010597830. JSON-LD lists the main address as "Мичуринский проспект, 56" and departments "PersOna · Солнцево", "PersOna · Славянский бульвар", "PersOna · Калужская / Профсоюзная".

Meta descriptions of the Профсоюзная and Солнцево pages are auto-generated from the contact block ("АДРЕС: ул. Профсоюзная, д. 61, МоскваБЛИЖАЙШАЯ СТАНЦИЯ МЕТРО…"): a Rank Math fallback.

### 5.5 Team `/content/nashi-pedagogi/` (page #927; H1 "Наша команда", title tag "Педагоги творческой студии PersonaModel в Москве.")

Layout: marquee, H1, then a grid of 26 clickable photo cards (an image widget each, alt text mostly meaningless: "rosnovskaya nataliya", "9 3 1", "Направления Персона — 19", "Наши преподаватели"); each opens an Elementor popup with photo, name (H2) and a free-text bio (text-editor). The grid shows no names or roles, so the visible team list is photos only; names and bios exist only in the popups (rendered in the page HTML, hence 404 KB document). The first card is the director.

The 26 popups (verbatim first lines; photo file names are the popup portraits, not the grid images):

| Popup ID | Name                     | Photo file                                                                           | Bio length (chars) | Bio opening (verbatim)                                                                                                                     |
| -------- | ------------------------ | ------------------------------------------------------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 6839     | Арменакян Михаил         | `persona-face-armenakyan-1024x1024.jpg`                                              | 50                 | Педагог по вокалу и гитаре. \| Опыт работы: \| 5 лет…                                                                                      |
| 1502     | Наталия Юрьевна Комарова | `persona-face-komarova.jpg`                                                          | 2066               | Опыт работы в сфере дополнительного образования и молодежи – более 20 лет \| Образование: \| Высшее (ТИУиЭ, 2004 год окончания) \| Вы…     |
| 1506     | Росновская Наталья       | `persona-face-rosnovskaya.jpg`                                                       | 851                | Добро пожаловать на мою персональную страницу! Я — заместитель директора центра PersOna! Моя миссия — создавать пространство, где …        |
| 1491     | Марковичев Александр     | `persona-face-markovichev.jpg`                                                       | 998                | Марковичев Александр – педагог по брейк-дансу 👍 \| Образование: \| ОГАУ им. Н. В. Парахина \| Педагогический стаж: \| 7 лет \| Танцевал…  |
| 1487     | Ионова Дарья             | `persona-face-ionova.jpg`                                                            | 689                | Хореограф и преподаватель с 12-летним танцевальным стажем. Владею широким спектром современных направлений: хип-хоп, контемпорари,…        |
| 1463     | Храмова Евгения          | `hramova_evgeniya_s-1-1024x1024.jpg`                                                 | 1858               | Образование: \| Рязанский государственный университет имени С.А. Есенина (факультет иностранных языков/учитель английского и немецк…       |
| 1456     | Грудинина Светлана       | `grudinina_svetlana_yazykovaya_shkola_angliyskiy_italyanskiy_yazyki-1-1024x1024.jpg` | 1805               | Образование: \| Высшее филологическое образование (Московский институт иностранных языков. Факультет «Языки и культуры». Специально…       |
| 1444     | Крымская Марина          | `krymskaya_marina_s-1.jpg`                                                           | 3137               | Образование: \| 2012 год. С отличием окончила Институт современного искусства (класс профессора Софроновой Н. П.). Квалификации опе…       |
| 1450     | Сурина Анастасия         | `surina_anastasiya_s-1.jpg`                                                          | 3129               | Образование: \| Алтайский государственный музыкальный колледж (Хоровое дирижирование) с отличием. Институт современного искусства (…       |
| 1453     | Литвинова Ирина          | `litvinova_irina_s-1.jpg`                                                            | 1725               | Образование: \| МГПУ ИСПО им. К. Д. Ушинского \| Специальность: \| педагогика дополнительного образования в области сценической деяте…     |
| 1437     | Савостьянова Светлана    | `sevostyanova_svetlana_logopediya_podgotovka_k_k_shkole-1-1024x1024.jpg`             | 1963               | Образование: \| Славянский государственный педагогический университет Факультет специального (дефектологического) образования Логоп…       |
| 1441     | Ахмедова Наргиз          | `ahmedova_nargiz_s-1.jpg`                                                            | 664                | Образование: \| Закончила Московский педагогический государственный университет. \| Опыт работы: \| 18 лет в танцах, 8 лет преподаю у…     |
| 1497     | Дедикина Валерия         | `persona-face-dedikina.jpg`                                                          | 1086               | Дедикина Валерия – педагог школы моделей 👠 \| Образование: \| МПЭК РЭУ им. Г. В. Плеханова \| ✨Обладательница Гран-При Международного…   |
| 2774     | Амиросланова Кристина    | `persona-face-amiroslanova.jpg`                                                      | 1717               | Педагог по вокалу \| Образование: \| Государственный музыкальный колледж им. Гнесиных \| Опыт работы педагогом: \| 10 лет \| Достижения…   |
| 2914     | Ахмедова Асият           | `image-5-1.png.webp`                                                                 | 1039               | Опыт работы: \| 13 лет \| Образование: \| РУДН \| Профессиональный опыт: \| — Российский университет дружбы народов (РУДН) — регулярно …   |
| 2777     | Брусника Екатерина       | `persona-face-brusnika.jpg`                                                          | 562                | Тренер по йоге \| Образование: \| МСГИ \| Опыт работы тренером: \| 11 лет \| Екатерина – преподаватель хатха-йоги и йогатерапии. Проход…   |
| 2771     | Вазигатова Азалия        | `persona-face-vazmgatova.jpg`                                                        | 1053               | Педагог по вокалу и клавишам \| Образование: \| ИСИ (эстрадно-джазовое пение) \| Опыт работы: \| 5 лет \| — Обладает методическими знан…   |
| 2910     | Вохмянин Никита          | `image-4-3.png.webp`                                                                 | 1449               | Педагог по гитаре и укулеле \| Образование: \| Марийский республиканский колледж культуры и искусств им. И.С. Палантая (специальност…      |
| 2905     | Котенева Анастасия       | `image-4.png.webp`                                                                   | 1585               | Педагог по барре и пилатесу \| Опыт работы: \| 10 лет \| Анастасия получала образование инструктора групповых программ в Московской ш…     |
| 2755     | Кулакова Елизавета       | `kulakova-elizaveta-2.jpg.webp`                                                      | 784                | Тренер по йоге \| Образование: \| РГУ им. Косыгина \| Опыт работы в спорте: \| 17 лет \| Педагогический стаж: \| 3 года \| Елизавета – се… |
| 2764     | Мелкумова Марина         | `persona-face-melkumova.jpg`                                                         | 927                | Педагог по английскому языку \| Образование: \| ВГУ (факультет Романо-германской филологии). \| Опыт работы педагогом: \| 18 лет \| На …   |
| 2761     | Меркулов Анатолий        | `merkulov-anatolij-1-2.jpg.webp`                                                     | 886                | Тренер по боксу \| Образование: \| МПГУ \| Опыт \| подготовки в единоборствах: 20 лет \| Педагогический стаж: \| 11 лет \| Тренер обладае… |
| 2751     | Полякова Кристина        | `polyakova-kristina-2-1024x1013.jpg`                                                 | 708                | Педагог по актерскому мастерству \| Образование: \| ГИТИС \| Опыт работы: \| более 20 лет \| Заслуги педагога: \| Принимает активное уча…  |
| 2747     | Суслова Евгения          | `suslova-evgeniya-2-1024x1024.jpg`                                                   | 583                | Педагог по джаз-фанку \| Образование: \| ГБПОУ «МК № 5» \| Танцевальный стаж: \| 10 лет \| Опыт работы педагогом: \| 3 года \| Педагог о … |
| 2742     | Ткачева Виктория         | `persona-face-tkacheva.jpg`                                                          | 653                | Педагог по К-РОР \| Образование: \| БГТУ им. Шухова \| Танцевальный стаж: \| 10 лет \| Опыт работы педагогом: \| 3 года \| На занятиях К-… |
| 2738     | Тюрина Ирина             | `persona-face-tyurina.jpg`                                                           | 442                | Тренер-терапевт по йоге \| Общий стаж: \| 15 лет \| Педагогический опыт: \| 3 года \| Ирина – сертифицированный преподаватель кундалини…   |

Observed structure of a bio (all free text, formatting inconsistent): optional role line (e.g. "Педагог по вокалу и гитаре.", "Тренер по йоге", "Педагог по К-РОР"), "Образование:", "Опыт работы:", "Достижения/Награды", sometimes "Педагог о себе:" and an emoji-rich style. Roles identifiable from text: director (Наталия Юрьевна Комарова, руководитель Т.Ц. PersOna per the price list; 20+ years in additional education), deputy director (Росновская Наталья), dance (Марковичев Александр брейк-данс, Ионова Дарья, Ахмедова Наргиз, Суслова Евгения джаз-фанк, Ткачева Виктория K-pop), models (Дедикина Валерия), vocal (Амиросланова Кристина, Арменакян Михаил вокал и гитара, Вазигатова Азалия вокал и клавиши, Крымская Марина, Сурина Анастасия), theatre (Литвинова Ирина, Полякова Кристина), languages (Храмова Евгения, Грудинина Светлана, Мелкумова Марина), speech therapy (Савостьянова Светлана), yoga (Брусника Екатерина, Кулакова Елизавета, Тюрина Ирина), barre/pilates (Котенева Анастасия), guitar/ukulele (Вохмянин Никита), boxing (Меркулов Анатолий), mehendi/art (Ахмедова Асият).

Note: the price list includes "БОКС" and the team page has a boxing coach, but there is no boxing direction page or menu entry.

### 5.6 Reviews `/otzyvy/` (page #2464)

H1 "Отзывы"; text "Понравилось работать с нами? Поделитесь своим опытом в отзыве на Яндекс.Картах по ссылке!" (link `https://yandex.ru/maps/-/CPeSuAn5`); three `html` widgets each embedding the Yandex Maps reviews widget iframe `https://yandex.ru/maps-reviews-widget/165851817022?comments` (likely responsive variants of one widget; fallback link text "PersOna на карте Москвы — Яндекс Карты"). No review text is stored on the site: all reviews live at Yandex (org id 165851817022). Meta description duplicates the intro sentence.

### 5.7 Tariffs `/tarify/` (page #1596)

H1 "Тарифы"; two copies of one image (`/wp-content/uploads/2026/08/prejskurant-26-27.jpg`, alt "Прейскурант 2026/2027", 1815x2560, one hidden on mobile, one on desktop/tablet); then H2 "Поле свободной оплаты", text "Данное поле предназначено для формирования индивидуальных оплат. Используйте после согласования с администратором.", button "Оплатить" → the СБП (Faster Payments System) QR link `https://qr.nspk.ru/…?type=01&bank=100000000284`. Title "Тарифы - Persona - Art Center", description "Тарифы творческого центра Persona в Москве: абонементы и занятия. Актуальные условия уточняйте у администратора…".

Price list "ПРЕЙСКУРАНТ 2026/2027" (transcribed by reading the image on 2026-11-20; headed "Утверждаю … /Комарова Н.Ю./ Руководитель Т.Ц. PersOna", signed and stamped; to be verified by the owner). Prices in rubles ("Р"). Group classes: columns 4 занятия/мес, 8 занятий/мес, 12 занятий/мес:

| ГРУППОВЫЕ ЗАНЯТИЯ                            | 4 ЗАНЯТИЯ/МЕС | 8 ЗАНЯТИЙ/МЕС | 12 ЗАНЯТИЙ/МЕС |
| -------------------------------------------- | ------------- | ------------- | -------------- |
| ШКОЛА МОДЕЛЕЙ                                | 8500 Р        | 11500 Р       | 17000 Р        |
| ТЕАТРАЛЬНАЯ СТУДИЯ                           | 8500 Р        | 11500 Р       | -              |
| ВОКАЛЬНАЯ СТУДИЯ                             | 8500 Р        | 11500 Р       | -              |
| СТУДИЯ ТАНЦА                                 | 8500 Р        | 11500 Р       | -              |
| РИСОВАНИЕ/АРТ-МАСТЕРСКАЯ                     | 8500 Р        | 11500 Р       | -              |
| АРТ-МАССТЕРСКАЯ (sic, second row as printed) | 8500 Р        | 11500 Р       | -              |
| ШАХМАТЫ                                      | 8500 Р        | 11500 Р       | -              |
| ЯЗЫКОВАЯ ШКОЛА                               | 8500 Р        | 11500 Р       | -              |
| ПОДГОТОВКА К ШКОЛЕ                           | 8500 Р        | 11500 Р       | -              |
| ЙОГА                                         | 8500 Р        | 11500 Р       | 17000 Р        |
| БАЧАТА/САЛЬСА                                | 8500 Р        | 11500 Р       | -              |
| БАРРЭ                                        | 8500 Р        | 11500 Р       | -              |
| ИНЖЕНЕРНЫЙ КУРС «МЕГАВОЛЬТ»                  | 11500 Р       | -             | -              |
| РОБОТОТЕХНИКА/ПРОГРАМИРОВАНИЕ/ВИДЕОПРОФИ     | 8500 Р        | 11500 Р       | -              |

"ПРОБНОЕ ГРУППОВОЕ ЗАНЯТИЕ (ПРИ ПОСЕЩЕНИИ НАПРАВЛЕНИЯ ВПЕРВЫЕ) – 1500 Р".

Individual classes (no currency sign printed): columns 1 занятие, 4 занятия, 8 занятий:

| ИНДИВИДУАЛЬНЫЕ ЗАНЯТИЯ             | 1 ЗАНЯТИЯ (sic) | 4 ЗАНЯТИЯ | 8 ЗАНЯТИЙ |
| ---------------------------------- | --------------- | --------- | --------- |
| ШКОЛА МОДЕЛЕЙ                      | 4000            | 14000     | 28000     |
| ТЕАТРАЛЬНАЯ СТУДИЯ                 | 4000            | 14000     | 28000     |
| ВОКАЛЬНАЯ СТУДИЯ                   | 4000            | 14000     | 28000     |
| СТУДИЯ ТАНЦА                       | 4000            | 14000     | 28000     |
| РИСОВАНИЕ/АРТ-МАСТЕРСКАЯ           | 4000            | 14000     | 28000     |
| ИНЖЕНЕРНЫЙ КУРС «МЕГАВОЛЬТ»        | 4000            | 14000     | 28000     |
| ШАХМАТЫ                            | 4000            | 14000     | 28000     |
| ЯЗЫКОВАЯ ШКОЛА                     | 4000            | 14000     | 28000     |
| ПОДГОТОВКА К ШКОЛЕ                 | 4000            | 14000     | 28000     |
| ЙОГА                               | 4000            | 14000     | 28000     |
| БАЧАТА/САЛЬСА (СОЦИАЛЬНЫЕ ТАНЦЫ)   | 5000            | 18000     | 36000     |
| БАРРЭ                              | 4000            | 14000     | 28000     |
| РОБОТОТЕХНИКА/ПРОГРАМИРО/ВИДЕОПРОФ | 5000            | 18000     | 36000     |
| ЛОГОПЕД                            | 4000            | 14000     | 28000     |
| БОКС                               | 5000            | 18000     | 36000     |

Footnote: "! ТАРИФ "ДУЭТ" Рассчитывается как индивидуальный абонемент за минусом 20 % с человека". Related rules elsewhere: loyalty discounts 15% (second direction/child) and 30% (third) on group subscriptions; group subscriptions valid a calendar month (FAQ). Pilates, "Для взрослых", "Продленка", "Семейная школа" and "Мини-группы" have no price rows (unknown whether priced elsewhere). Typos in the image ("АРТ-МАССТЕРСКАЯ", "ПРОГРАМИРОВАНИЕ", "1 ЗАНЯТИЯ") should be fixed in the structured rebuild.

### 5.8 Schedule `/content/raspisanie/` (page #1130)

Contains a visually-hidden H1 `<h1 class="persona-prcy-h1-clip">Расписание</h1>` (outside any Elementor widget) and two `html` widgets with empty mount points `<div id="SiteWidgetMoyklass65961">` and `<div id="SiteWidgetMoyklass130200">`. The content is injected by Moyklass widgets (script ids `01gGAHCMTHh6sF5MFhcE7tRjEqC2dNs2KhPj` and `38IaRqAF2GUQSoxG3JaEonvxriufNPjJGx`). The pages contains no schedule text in HTML, so the schedule is not indexable. Title "Общее расписание творческого центра PersonaModel в Москве".

### 5.9 News `/news/` (page #952; H1 "Новости творческой студии")

No news items. Text: "Актуальные новости, пресс-релизы наших и партнерских проектов, фото и видео с выступлений студийцев мы выкладываем в социальных сетях Vk и Telegram Переходите по ссылке Подписывайтесь и будьте в курсе самых интересных событий", followed by three links (`vk.com/personamodelmoscow`, `t.me/personamp56`, `max.ru/id615422777189_biz`) and six decorative icon images (`group-195.svg`). The `post` type is empty (0 posts).

### 5.10 Events `/content/organizaciya-prazdnikov/` (page #1076, H1 "Организация событий")

1. Hero: H1, "Организация детских и семейных мероприятий «под ключ» — от детского дня рождения до масштабного фестиваля", button "Записаться" → `#form`.
2. Six flip boxes: "Праздник под ключ", "Профессиональные аниматоры", "Яркие эмоции", "Безопасность детей", "Индивидуальный сценарий", "Комфорт родителей" (each with a one-sentence back text), plus 4 photos.
3. One long rich-text block (H2 "Организация событий — PersOna"): "Мы берём все хлопоты на себя"; lists "Мы организуем" (7 items: игровая программа с аниматором, индивидуальный сценарий, конкурсы/дискотека, сказочные герои, украшение помещения, накрытие столов/фуршет, уборка), "Вы можете принести" (7 items: еда и напитки, торт, скатерти, одноразовая посуда, свечи, сувениры, декор), "Почему это удобно" (5 items), "По желанию родителей" (угощение гостей), "Какие события мы организуем" (6 types: Детский день рождения; Детский корпоратив; Детский праздник по любому поводу; Мастер-класс; Шоу-показ; Фестиваль, конкурс, концерт, each with a description), "Наши цифры" (1 000+ организованных мероприятий; 20 лет в индустрии праздников; 60 000+ счастливых детей; 100+ авторских костюмов и программ), "Почему выбирают нас" (5 points incl. "Работаем с любым бюджетом", "Всегда на связи — персональный менеджер … 24/7", "Страхуем форс-мажоры"). Emoji are replaced by SVGs (`persona-emoji/*.svg`).
4. One hosted video (poster `group-60-1024x470.png.webp`).
   No prices for events are published.

### 5.11 Festivals `/content/festivalnoe-dvizhenie/` (page #1053, H1 "Фестивальное движение")

1. Hero: H1, "Более 20 лет на сцене", button "Записаться" → `#form`.
2. Six flip boxes: "Вокальное мастерство", "Танцевальное искусство", "Сценический опыт", "Постановка номеров", "Сценическая речь", "Командная работа"; 4 images.
3. Long rich-text block: "Творческий центр «PersOna» — первая компания, официально зарегистрировавшая товарный знак детского конкурса красоты и талантов."; stats "20+ лет в индустрии детских конкурсов", "№1 зарегистрированный товарный знак Mini Miss & Mister", "100% профессиональные площадки с hi-tech оборудованием", "∞ незабываемых воспоминаний для каждого ребёнка"; quote «Мы считаем, что дети — это маленькие взрослые, а значит, и требования к подготовке детских мероприятий у нас самые взрослые.»; six projects: "Всероссийский конкурс Маленькие мисс и мистер Россия" (since 2004, ages 4-17), "Международный фестиваль «STARS INTERNATIONAL»" (6 independent competitions: вокал, танец, театр, мода, фото, исполнительские виды боевых искусств; 4-17), "Профессиональный проект в сфере детского моделинга «FASHION KITCHEN»" (market entry for Asian children's fashion; bookers/scouts of China and South-East Asia; 4-17), "Показы ведущих детских дизайнеров «CHILDREN HAUTE COUTURE»", "Выездные зарубежные проекты", "Новый уникальный проект «BRICS STARS INTERNATIONAL»" (ART BRICS ASSOCIATION).
4. Download block: "Нажмите кнопку, чтобы скачать презентацию фестивалей и конкурсов." with three buttons: "STARS INTERNATIONAL 2026" (`stars_international_2026_polozhenie.pdf`), "МАЛЕНЬКИЕ МИСС И МИСТЕР РОССИЯ 2026" (`malenkie_miss_i_mister_rossiya_2026.pdf`, 9.9 MB), "FASHION KITCHEN 2026" (`fashion-kitchen.pdf`, 7.5 MB).

### 5.12 Privacy `/privacy-policy/` (page #3)

Title "Политика обработки персональных данных - Persona - Art Center"; H1 "Политика обработки персональных данных"; about 19.6k characters of legal text ("Утверждаю" header) as a plain WP page; not linked from anywhere (footer links to a PDF with the same title).

### 5.13 Area (direction) single template (#843) - shared structure

Used by all 22 `areas` items; rendered as a Elementor "single-page" template (there is no `<main>` element: the page body sits directly under the header). The per-item content is entered per post (post title, `post_content` tagline, featured image and the Elementor-authored text in the template instance); ACF fields are not exposed in REST. Shared skeleton, in order:

1. **Hero**: H1 (post title, sometimes different from the menu label), tagline (the `post_content`, e.g. "Интеллектуальный фитнес для вашего тела!", "Танцуй сердцем!"), button "Записаться" → `#form`.
2. **Intro + programme**: H2 intro paragraph(s), then "В программе курса:" followed by **6 flip boxes** (title on the front, 1-3 sentence description on the back).
3. **Photo strip**: 4 photo widgets.
4. **Long-form text block** (H2 as the pitch headline, e.g. "Умная система тренировок для гармонии тела и ума", then sub-sections such as "Что такое пилатес?", "Кому подойдут занятия пилатесом?", benefits list, "Как проходят занятия?" prose).
5. Button "Расписание" → `/content/raspisanie/`.
6. **"Как проходят занятия?"** H2 and a video slider (`#how-classes-going__slider`, nested carousel with 4 slides, autoplay 5 s, 1-3 hosted vertical videos with webp poster screenshots; the adult pages and "Сальса и бачата" have none).
7. **Navigation buttons**: "Педагоги" → `/content/nashi-pedagogi/`, "Расписание" → `/content/raspisanie/`, "Выступления" → `/#vistuplenia`, "Тарифы" → `/tarify/`.
8. **"ДОПОЛНИТЕЛЬНЫЕ НАПРАВЛЕНИЯ НАШЕЙ ТВОРЧЕСКОЙ СТУДИИ"** (heading linking to `/brunches/`) with 6 icon images, H2 "Наши направления" and a loop carousel (template #595) of exactly three cards on every area page: "Школа моделей" (6 bullets), "Танцы" (7 bullets), "Вокальная студия" (6 bullets); the same three regardless of the current direction.
9. Global footer.

Differences by item (generated from the rendered pages; "img tags / hosted videos" counts the item body only, excluding the shared tail in step 8; "program items" lists the flip-box titles):

| #   | REST ID | URL                                           | Title (WP)                          | H1                                  | Tagline (post_content)                                 | Program items (flip boxes)                                                                                                                                                                                                     | img tags / hosted videos (body) | Featured media | REST modified |
| --- | ------- | --------------------------------------------- | ----------------------------------- | ----------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | -------------- | ------------- |
| 1   | 804     | `/areas/inzhenernyj-klub-megavolt/`           | Инженерный клуб Мегавольт           | ИНЖЕНЕРНЫЙ КЛАСС МЕГАВОЛЬТ          |                                                        | Электрическая цепь; Пайка; Микросхема; Электроника; Практика; Проекты                                                                                                                                                          | 12 / 3                          | 2845           | 2026-08-23    |
| 2   | 1877    | `/areas/bachata/`                             | Бачата                              | Бачата                              | Танцуй сердцем!                                        | Контакт и рамка; Базовая техника шага; Работа тела; Ведение и следование; Социальный кодекс и уважение — Философия танцпола; Музыкальность и ритм                                                                              | 11 / 2                          | 2855           | 2026-04-28    |
| 3   | 813     | `/areas/barre-fitnes/`                        | Баррэ-фитнес                        | Баррэ-фитнес                        |                                                        | Балет; Пилатес; Йога; Функциональный тренинг; Изометрическая нагрузка; Стрейтчинг                                                                                                                                              | 13 / 2                          | 2851           | 2026-04-28    |
| 4   | 1899    | `/areas/pilates/`                             | ПИЛАТЕС                             | ПИЛАТЕС                             | Интеллектуальный фитнес для вашего тела!               | Дыхание; Концентрация; Центрирование; Контроль; Точность; Плавность                                                                                                                                                            | 10 / 2                          | 2861           | 2026-04-28    |
| 5   | 805     | `/areas/art-masterskaya/`                     | Арт-мастерская                      | Арт-мастерская                      |                                                        | Скульптура и керамика; Дизайн и декор; Бумагопластика; Работа с различными материалами; От простого к сложному; Выставки                                                                                                       | 12 / 3                          | 1638           | 2026-04-28    |
| 6   | 808     | `/areas/igra-na-muzykalnyh-instrumentah/`     | Игра на музыкальных инструментах    | ИГРА НА МУЗЫКАЛЬНЫХ ИНСТРУМЕНТАХ    |                                                        | Гитара; Укулеле; Скрипка; Синтезатор; Студийная запись; Выступления                                                                                                                                                            | 13 / 3                          | 2417           | 2026-04-28    |
| 7   | 801     | `/areas/logoped/`                             | Логопед                             | Логопед                             | Поможем голосу вашего ребенка звучать уверенно!        | Постановка и автоматизация звуков; Развитие связной речи; Коррекция темпо-ритмических нарушений; Развитие фонематического слуха и профилактика дисграфии; Коррекция голоса и просодики; Преодоление задержки речевого развития | 9 / 2                           | 2857           | 2026-04-28    |
| 8   | 810     | `/studios/yazykovaya-shkola/`                 | Языковая школа                      | Языковая школа                      | МИР БЕЗ ГРАНИЦ!                                        | Английский; Французский; Итальянский; Испанский; Китайский; Арабский                                                                                                                                                           | 14 / 3                          | 2859           | 2026-04-28    |
| 9   | 800     | `/areas/joga/`                                | Йога                                | Йога                                | Гармония тела и духа                                   | Асаны; Пранаяма; Пратьяхара; Дхарана; Дхьяна; Самадхи                                                                                                                                                                          | 8 / 1                           | 2853           | 2026-04-28    |
| 10  | 1652    | `/areas/podgotovka-k-shkole/`                 | ПОДГОТОВКА К ШКОЛЕ                  | ПОДГОТОВКА К ШКОЛЕ                  |                                                        | Чтение; Письмо; Математика; Окружающий мир; Творчество; Проектная деятельность                                                                                                                                                 | 12 / 2                          | 2849           | 2026-04-28    |
| 11  | 1648    | `/areas/robototehnika/`                       | Робототехника                       | Робототехника                       |                                                        | Scratch; LEGO Mindstorms; Python; C++; Arduino; Raspberry Pi                                                                                                                                                                   | 12 / 3                          | 2847           | 2026-04-28    |
| 12  | 1642    | `/areas/shahmaty/`                            | Шахматы                             | Шахматы                             |                                                        | Связка; Вилка; Шах; Отвлечение; Перегрузка фигуры; Цейтнот                                                                                                                                                                     | 9 / 2                           | 1643           | 2026-04-28    |
| 13  | 814     | `/studios/teatralynaya_studiya/`              | Театр                               | Театр                               |                                                        | Актерское мастерство; Сценическая речь; Сценическое движение; Работа с текстом; Постановка спектаклей; Публичные выступления                                                                                                   | 12 / 2                          | 2537           | 2026-04-28    |
| 14  | 787     | `/areas/risovanie/`                           | Рисование                           | Рисование                           |                                                        | Работа с цветом; Композиция; Различные техники; Работа с различными материалами; От простого к сложному; Выставки                                                                                                              | 13 / 3                          | 2843           | 2026-04-28    |
| 15  | 489     | `/studios/vokalynaya_studiya/`                | Вокальная студия                    | Вокальная студия                    |                                                        | Правильная постановка звукоизвлечения в вокале; Расширение вокального диапазона; Разработка сценического имиджа в вокале; Работа с микрофоном в вокале; Студийная запись; Подбор репертуара                                    | 9 / 3                           | 2865           | 2026-04-28    |
| 16  | 492     | `/studios/teatr_tanca/`                       | Танцы                               | Театр танца                         |                                                        | Брейк-данс; Хип-хоп; Джаз-фанк; K-pop; Контемп; Baby dance                                                                                                                                                                     | 10 / 3                          | 2867           | 2026-04-28    |
| 17  | 496     | `/studios/shkola_modeley/`                    | Школа моделей                       | Детская школа моделей               |                                                        | Актерское мастерство; Этикет; Танец; Стилистика; Дефиле; Фототренинг                                                                                                                                                           | 11 / 3                          | 2273           | 2026-04-28    |
| 18  | 811     | `/areas/prodlenka/`                           | Продленка                           | ПРОДЛЕНКА                           |                                                        | Праздники вместе; Уютное пространство; Научные эксперименты; Изучаем мир; Театральная студия; Развитие и общение                                                                                                               | 8 / 2                           | 3232           | 2026-04-28    |
| 19  | 812     | `/районы/семенная-школа/`                     | Семейная школа                      | Семейная школа                      |                                                        | Полезное питание; Индивидуальный подход; Команда педагогов; Обеденные перерывы; Творческое развитие; Интеллектуальные клубы                                                                                                    | 7 / 2                           | 2869           | 2026-04-28    |
| 20  | 1909    | `/areas/individualnye-zanyati-dlya-vzroslyh/` | ИНДИВИДУАЛЬНЫЕ ЗАНЯТИЯ ДЛЯ ВЗРОСЛЫХ | ИНДИВИДУАЛЬНЫЕ ЗАНЯТИЯ ДЛЯ ВЗРОСЛЫХ | Индивидуальные занятия. Запрос. Реализация. Результат! | Вокал; Танец; Языковые курсы; Силовые тренировки; Выступления; Живопись и декор                                                                                                                                                | 0 / 0                           | 2863           | 2026-04-13    |
| 21  | 1865    | `/areas/dlya-vzroslyh/`                       | Для взрослых                        | Для взрослых                        | Баррэ-фитнес                                           | Вокал; Танец; Живопись; Ораторское искусство; Йога и фитнес; Языки                                                                                                                                                             | 1 / 1                           | 1866           | 2026-03-10    |
| 22  | 802     | `/areas/salsa-i-bachata/`                     | Сальса и бачата                     | Сальса и бачата                     |                                                        | -                                                                                                                                                                                                                              | 0 / 0                           | none           | 2026-02-25    |

Per-item observations:

- Six flip boxes are filled on 21 of 22 items; "Сальса и бачата" has six empty flip boxes. The "В программе курса:" caption is present on most items; "Бачата", "Йога", "Рисование", "Языковая школа" and "Продленка" introduce the boxes differently (their H2 is the pitch headline). Item "Для взрослых" has the tagline "Баррэ-фитнес".
- "Инженерный класс Мегавольт": H1 "ИНЖЕНЕРНЫЙ КЛАСС МЕГАВОЛЬТ" differs from the menu label "Инженерный клуб Мегавольт"; the intro opens "От «Как это работает?» до «Я это сделал!» — всего один шаг". Price list quotes the 4-lessons tier at 11500 only.
- "Школа моделей": H1 "Детская школа моделей", H2 "Что ты получишь у нас?", audience "Для детей от 4-х лет, девушек и парней от 14 до 17 лет". Title tag "Школа моделей для детей в Москве — курс «Театр Моды» | PersonaModel".
- "Театр": age groups "4–6, 7–10 и 11–14 лет"; "Рисование": age groups "3–5 лет Творчество-игра", "6–9 лет Освоение техник", "10–14 лет Авторский…"; "Вокальная студия": "Вокальный старт (4–6 лет)…".
- "Языковая школа": languages with culture-themed paragraphs (English for ages 4-14 and adults per meta description, French, Italian, …).
- "Продленка": intro "Творческий центр PersOna — пространство, где дети успевают всё: и уроки, и кружки, и прогулки, и дружбу."; 8 images, 2 videos.
- "Семейная школа" (served at `/районы/семенная-школа/`): intro "Представьте школу, в которую ваш ребенок бежит с улыбкой…"; contains an external link to `https://personaschool.tilda.ws`.
- Adult pages "ИНДИВИДУАЛЬНЫЕ ЗАНЯТИЯ ДЛЯ ВЗРОСЛЫХ" and "Для взрослых" keep the six flip boxes (Вокал; Танец; Языковые курсы/Языки; Силовые тренировки/Йога и фитнес; Выступления/Ораторское искусство; Живопись и декор) but use a list-based body, no photo strip (H2 "Наши ключевые направления (и это не предел):", "Как это работает?", "Кому это нужно?", "Наша эксклюзивная услуга: Педагог/Тренер под запрос"; no videos). They start with the same opening paragraph "В творческом центре PersOna взрослые могут реализовать любые направления в индивидуальном формате: танец (любое направление студии), вокал, живопись, ораторское…". "Для взрослых" then continues with headings about Barre fitness ("Что такое Barre-фитнес?", "Почему именно в нашей детской студии?", "Кому подойдет Barre-фитнес?", "Что вы получите от занятий?") and has two "Как проходят занятия?" headings: it reads as copy-pasted; the menu uses it as the parent label of the adult group.
- "Сальса и бачата": no featured image, no tagline, H1 and the shared tail only (empty body), last modified 2026-02-25 while its siblings were edited in April 2026. It is a stale stub that duplicates "Бачата" (ID 1877, which has the full content), yet remains linked from the home and `/brunches/` card grids.
- Taglines (post_content) exist only for newer items: "Интеллектуальный фитнес для вашего тела!" (ПИЛАТЕС), "Танцуй сердцем!" (Бачата), "Индивидуальные занятия. Запрос. Реализация. Результат!" (индивидуальные), others' taglines are empty or generic.

### 5.14 Cross-cutting content inconsistencies (for the owner)

1. Studio metro/hours mismatch between footer and studio pages (5.4); "Богданова 19" labelled м. Багратионовская on the studio page but м. Солнцево in the footer and in the page name.
2. Brand naming varies: "PersOna" (copy), "Persona" (titles), "PersonaModel" (titles/descriptions), "Persona - Art Center" (site title/Rank Math default), "Творческий центр PersOna" (JSON-LD), "Т.Ц. PersOna" (price list), domain "personamodel.ru".
3. "более 20 лет" (header text, О нас, festivals, events: "20 лет в индустрии праздников"), "с 2002 года", festival contest "с 2004 года … 20-летней историей". Contest heritage and centre age differ (2002 vs 2004) by design. **Contradiction:** the meta description, `og:description` and `twitter:description` of the home page say "…4 студии, работаем более 10 лет." and those of the festival page say "…Более 10 лет опыта, работа на результат.", while body copy says "более 20 лет" / "20+" (the other "10 лет" hits, on the team page, are individual teachers' experience, not a claim about the centre). The owner must pick one figure (and the founding year); the rebuild should keep a single source for it.
4. FAQ item 6 describes the "охраняемая территория ЖК «Небо»" as a general safety fact although it applies only to the Мичуринский проспект studio.
5. The directions index is called "Наши направления" (H1), "Направления" (menu), "ДОПОЛНИТЕЛЬНЫЕ НАПРАВЛЕНИЯ НАШЕЙ ТВОРЧЕСКОЙ СТУДИИ" (area footer) and its URL is `/brunches/`.
6. Menu labels differ from H1s and titles (Инженерный клуб vs ИНЖЕНЕРНЫЙ КЛАСС; Танцы vs Театр танца; Школа моделей vs Детская школа моделей; Вокал vs Вокальная студия; Команда vs Наша команда; Отзывы).
7. Two parallel policy documents (page and PDF), plus the Moyklass widget's own `pdata.pdf` consent link rewritten to the site PDF.
8. The price list contains a boxing and a "Логопед" tariff; "Бокс" has no page; the home page claims "20+ премиум-направлений" while the menu lists 18 direction links (13 children's incl. "Для детей" label excluded, 5 adults).

## 6. Proposed content model

Derived from sections 4-5. Field status is marked in comments: `observed` = field exists in the current site or its data; `proposed` = new, needed by the rebuild. Types follow the repo conventions (`T` prefix, `type` not `interface`, tabs, single quotes, no trailing commas, no bracket spacing). Everything is Russian-language and single-locale, so fields are plain strings, not per-locale maps. Identifiers are `string` UUIDs/cuids or integer primary keys, whichever the CMS uses.

### 6.1 Entities and relations

```text
SiteSettings (1) ── Contacts, Socials, Integrations, SEO defaults, CookieBanner
Navigation (1)   ── NavItem tree (header primary, secondary bars, footer, mobile)
Page (N)         ── blocks[] (flexible) ── references Direction | Studio | Teacher | Tariff | Faq | MediaAsset
Direction (N)    ── audience, parent Direction?, programme items, FAQ, videos, teachers[], studios[], tariffPlans[]
Studio (4)       ── address, metro[], hours, phones[], map, photos[], directions[]
Teacher (26)     ── directions[], studios[]?, photo, bio
TariffPlan (N)   ── per Direction: group/individual price tiers; DiscountRule (N); PriceListDocument
Faq (N)          ── question/answer, scope: global or per Direction
Review (N)       ── optional local mirror of Yandex/2GIS reviews (source of truth stays external)
NewsPost (0..N)  ── new; currently the site has no posts
Performance (N)  ── festival/contest projects and "Наши выступления" media
GalleryItem (N)  ── photo/video with tab/category, optional Direction
LegalDocument (3+1) ── PDF or rich text; privacy page + PDF unify here
Redirect (N)     ── old path → new path, status
MediaAsset (N)   ── image/video/pdf records (CMS media collection)
```

Relations that exist implicitly today and should become explicit: Direction ↔ Teacher (only inferable from bio text such as "Педагог по вокалу"), Direction ↔ TariffPlan (only in the price list image), Direction ↔ Studio (not stated anywhere on the site), Direction ↔ Gallery tab (home tabs Танцы/Вокал/Театр/Мода), Direction ↔ related directions (the same three cards "Школа моделей/Танцы/Вокальная студия" on every area page).

### 6.2 TypeScript types

<!-- prettier-ignore -->
```ts
// ---------- shared ----------
export type TMediaKind = 'image' | 'video' | 'pdf' | 'svg';

export type TMediaAsset = {
	id: string;
	kind: TMediaKind; // observed (mime_type)
	url: string; // observed (source_url)
	filename: string; // observed
	mimeType: string; // observed
	width?: number; // observed
	height?: number; // observed
	filesizeBytes?: number; // observed (media_details.filesize)
	alt: string; // observed (alt_text), 97% empty today -> proposed: required
	caption?: string; // observed
	posterId?: string; // proposed: video poster (today set per video widget)
	focalPoint?: {x: number; y: number}; // proposed
	legacyWpId?: number; // proposed: migration key
};

export type TSeo = {
	title?: string; // observed (Rank Math title); fall back to pattern
	description?: string; // observed (Rank Math); never auto-extract from layout text
	canonicalPath?: string; // observed (always self)
	ogImageId?: string; // observed (default img_6233-1-1024x516.jpg on 15 pages)
	noindex?: boolean; // observed (404 page only)
	jsonLd?: 'default' | 'none'; // proposed: schema type chosen by entity, not hand-written
};

export type TPublishState = {
	status: 'draft' | 'published'; // proposed (drafts)
	publishedAt?: string; // observed (post date)
	updatedAt: string; // observed (modified)
};

export type TLink = {
	label: string;
	href: string; // internal path or absolute URL
	external?: boolean;
};

// ---------- site settings and navigation ----------
export type TPhone = {label: string; e164: string; display: string}; // observed, 3 phones

export type TSocial = {
	kind: 'telegram' | 'vk' | 'max';
	url: string;
	chatUrl?: string; // observed: floating button uses a different Telegram/VK/MAX URL than the footer icons
};

export type TSiteSettings = {
	siteName: string; // observed: 'PersOna'
	legalName?: string; // observed: 'Творческий центр PersOna' (JSON-LD)
	logoId: string; // observed
	faviconId: string; // observed
	email: string; // observed
	phones: TPhone[]; // observed
	socials: TSocial[]; // observed
	messengerButtons: TSocial[]; // observed (fixed floating buttons)
	moyklass: {
		leadWidgetId: string; // observed: 01gGAHCMTHh6sF5MFhcE7tRjEqC2dNs2KhPj
		scheduleWidgetId: string; // observed: 38IaRqAF2GUQSoxG3JaEonvxriufNPjJGx
	};
	metrikaCounterId?: string; // observed: 112028433
	yandexOrgId?: string; // observed: 165851817022
	twoGisReviewsUrl?: string; // observed
	paymentQrUrl?: string; // observed (СБП link on /tarify/)
	cookieBanner: {title: string; text: string; accept: string; reject: string}; // observed
	defaultSeo: TSeo; // observed
	tagline: string; // observed: 'Спасибо, что остаетесь с нами более 20 лет!'
	foundedYear: number; // observed: 2002
};

export type TNavItem = {
	id: string;
	label: string; // observed
	href?: string; // observed ('#' group labels have none)
	children?: TNavItem[]; // observed (Направления > Для детей / Для взрослых)
	placement: 'primary' | 'secondary' | 'quick' | 'footer' | 'mobile'; // observed bars
	target?: {collection: 'pages' | 'directions' | 'studios'; id: string}; // proposed: link by reference, not by URL
};

// ---------- directions ----------
export type TDirectionAudience = 'children' | 'adults' | 'family'; // observed grouping, 'family' proposed

export type TProgramItem = {title: string; text: string}; // observed: flip boxes (6 per direction)

export type TDirection = {
	id: string;
	slug: string; // observed (conflicting with served path today)
	title: string; // observed (menu label / post title)
	h1?: string; // observed (differs from title on 5 items)
	tagline?: string; // observed (post_content, 3 items only)
	audience: TDirectionAudience; // observed (menu groups)
	parentId?: string; // observed: 'Для взрослых' parent
	ageRanges?: string[]; // observed in text ('4-6', '7-10'...), proposed as data
	intro: string; // observed (rich text)
	programHeading?: string; // observed: 'В программе курса:'
	program: TProgramItem[]; // observed
	body: string; // observed (rich text, h2/h3/lists)
	photoIds: string[]; // observed (4 photo strip)
	videoIds: string[]; // observed (1-3 videos in 'Как проходят занятия?')
	faqIds?: string[]; // proposed
	teacherIds: string[]; // proposed relation
	studioIds: string[]; // proposed relation
	tariffPlanIds: string[]; // proposed relation
	cardImageId?: string; // observed (featured media, portrait 720x1280 card)
	showInDirectory: boolean; // observed implicitly (4 items missing from card grids); proposed explicit
	order: number; // proposed (today: query order)
	seo: TSeo;
	state: TPublishState;
	legacy?: {wpId: number; servedPath: string}; // proposed for redirects
};

// ---------- studios ----------
export type TStudio = {
	id: string;
	slug: string;
	name: string; // observed: 'СТУДИЯ М. МИЧУРИНСКИЙ ПРОСПЕКТ/РАМЕНКИ'
	shortName: string; // observed: 'Мичуринский проспект 56'
	address: string; // observed
	metro: string[]; // observed (conflicts exist, see 5.4)
	phones: string[]; // observed
	email: string; // observed
	hours: string; // observed ('пн-вс по расписанию')
	hoursStructured?: {days: string; from?: string; to?: string}[]; // proposed
	geo: {lat: number; lon: number}; // observed in map embeds for 3 of 4
	yandexMapUrl: string; // observed
	yandexOrgId?: string; // observed for Профсоюзная (host venue)
	photoIds: string[]; // observed (3 per studio in the footer carousel)
	note?: string; // observed ('ЖК «Небо»')
	order: number;
	seo: TSeo;
};

// ---------- people ----------
export type TTeacher = {
	id: string;
	name: string; // observed (popup H2)
	role: string; // observed (first bio line, e.g. 'Педагог по вокалу и гитаре.')
	photoId: string; // observed
	bio: string; // observed (rich text, free-form)
	education?: string; // observed in text, proposed as field
	experienceYears?: number; // observed in text, proposed as field
	directionIds: string[]; // proposed
	studioIds: string[]; // proposed
	isManagement: boolean; // observed (director, deputy director)
	order: number; // observed (grid order)
};

// ---------- pricing ----------
export type TPriceTier = {
	lessons: number;
	period?: 'month';
	priceRub: number | null;
}; // observed; null = '-'

export type TTariffPlan = {
	id: string;
	directionId?: string; // observed as row labels, e.g. 'ШКОЛА МОДЕЛЕЙ'
	label: string; // observed (row label, may merge directions)
	kind: 'group' | 'individual'; // observed
	tiers: TPriceTier[]; // observed (4/8/12 per month; 1/4/8)
	validFrom?: string; // proposed ('2026/2027')
};

export type TDiscountRule = {
	id: string;
	title: string; // observed: 'скидка 15%' / 'скидка 30%' / 'ТАРИФ "ДУЭТ"'
	percent: number; // observed
	description: string; // observed
};

export type TPriceList = {
	seasonLabel: string; // observed: 'ПРЕЙСКУРАНТ 2026/2027'
	trialGroupPriceRub: number; // observed: 1500
	plans: TTariffPlan[];
	discounts: TDiscountRule[];
	pdfId?: string; // proposed: downloadable original
	updatedAt: string;
};

// ---------- content ----------
export type TFaq = {
	id: string;
	question: string; // observed (7 on the home page)
	answer: string; // observed
	directionId?: string; // proposed: scope
	inJsonLd: boolean; // observed implicitly (4 of 7), proposed explicit
	order: number;
};

export type TReview = {
	id: string;
	source: 'yandex' | '2gis' | 'manual'; // observed (external only today)
	author: string;
	rating?: number;
	text: string;
	date?: string;
	url?: string;
};

export type TNewsPost = {
	id: string; // proposed (no posts exist today)
	slug: string;
	title: string;
	excerpt: string;
	body: string;
	coverId?: string;
	tags?: string[];
	seo: TSeo;
	state: TPublishState;
};

export type TPerformance = {
	id: string;
	title: string; // observed project names, e.g. 'Всероссийский конкурс Маленькие мисс и мистер Россия'
	description: string; // observed
	since?: number; // observed: 2004
	ageFrom?: number; // observed: 4
	ageTo?: number; // observed: 17
	documentId?: string; // observed: regulation PDF
	year?: number; // observed in file names (2026)
	order: number;
};

export type TGalleryItem = {
	id: string;
	kind: 'photo' | 'video';
	mediaId: string; // observed
	posterId?: string; // observed
	category: 'dance' | 'vocal' | 'theatre' | 'fashion' | 'achievements' | 'photoprojects' | 'events'; // observed tabs
	directionId?: string; // proposed
	order: number;
};

export type TLegalDocument = {
	id: string;
	slug: string;
	title: string; // observed: 'Абонентский договор', 'Правила поведения', 'Политика обработки персональных данных'
	pdfId?: string; // observed
	richText?: string; // observed for the privacy page
	placement: 'footer' | 'consent' | 'both'; // proposed
	updatedAt: string;
};

// ---------- flexible pages ----------
export type TBlock =
	| {
			type: 'hero';
			h1: string;
			subtitle?: string;
			cta?: TLink;
			imageId?: string;
	  }
	| {type: 'richText'; html: string}
	| {
			type: 'featureCards';
			heading?: string;
			items: {title: string; text: string; iconId?: string}[];
	  }
	| {type: 'flipBoxes'; heading?: string; items: TProgramItem[]}
	| {
			type: 'directionCards';
			directionIds: string[];
			variant: 'bullets' | 'poster';
	  }
	| {type: 'gallery'; items: TGalleryItem[]; tabs?: boolean}
	| {type: 'videoCarousel'; videoIds: string[]}
	| {type: 'faq'; faqIds: string[]}
	| {type: 'teachers'; teacherIds: string[]}
	| {type: 'priceList'; priceListId: string}
	| {type: 'studios'; studioIds: string[]}
	| {type: 'stats'; items: {value: string; label: string}[]}
	| {type: 'downloads'; documentIds: string[]}
	| {type: 'moyklassSchedule'; widgetId: string}
	| {type: 'moyklassLeadForm'; heading: string; subheading?: string}
	| {type: 'yandexReviews'; orgId: string}
	| {type: 'ctaBanner'; heading: string; cta: TLink};

export type TPage = {
	id: string;
	slug: string;
	path: string; // observed (e.g. '/content/nashi-pedagogi/')
	title: string; // observed
	template: 'home' | 'content' | 'legal'; // observed families
	blocks: TBlock[]; // proposed (today: Elementor JSON)
	seo: TSeo;
	state: TPublishState;
	legacy?: {wpId: number; servedPath: string};
};

// ---------- redirects ----------
export type TRedirect = {
	id: string;
	from: string; // decoded path
	to: string;
	status: 301 | 302 | 308;
	note?: string;
};
```

Leads are deliberately **not** modelled: the visible lead form is the Moyklass widget and leads stay in Moyklass (the site never stores them today). The dormant CF7 form (8.3) would store nothing either unless the Flamingo plugin is installed (not seen); its mail destination is unknown. The rebuild needs one unified lead form (see 8.1 and 12.4).

### 6.3 Content-model notes

- `TDirection.body` is the largest migration cost: 22 items with 2.3-4.1k characters of hand-formatted rich text, 6 flip boxes and 1-3 videos each.
- `TTeacher` bios (26) are free text with emoji; keep them as rich text and extract `role`, `education` and `experienceYears` by hand during migration.
- The price list is a picture; `TPriceList` must be re-keyed from the transcription in 5.7 and approved by the owner.
- The home page is a composition of reusable blocks (hero, directionCards, featureCards, videoCarousel, gallery with tabs, ctaBanner, faq); the same blocks serve /o-nas/, /sobytiya/ and /festivali/.
- Studio hours should become structured; currently they are strings with three different formats.

## 7. Media inventory

Source: `/wp-json/wp/v2/media?per_page=100`, pages 1-9. The API reports `X-WP-Total: 834` and 9 pages; **825 items were retrieved** (page 8 returned 91 instead of 100 items, so 9 items are missing and could not be recovered through the paginated endpoint). Sizes are the registered `media_details.filesize` values (bytes), summed per group and shown in decimal megabytes (bytes / 1,000,000); 20 records have no `filesize` (the 18 Elementor artefacts with an empty MIME type and 2 JPEGs, ids 3307 and 3308) and count as 0. Total: 3,795,674,917 bytes.

### 7.1 By MIME type

| MIME type         | Count   | Registered size (MB) |
| ----------------- | ------- | -------------------- |
| `image/png`       | 288     | 125.1                |
| `image/jpeg`      | 250     | 53.1                 |
| `image/webp`      | 121     | 14.2                 |
| `video/mp4`       | 79      | 1515.7               |
| `video/quicktime` | 39      | 2028.4               |
| `image/svg+xml`   | 21      | 1.6                  |
| `(empty)`         | 18      | 0.0                  |
| `application/pdf` | 9       | 57.5                 |
| **Total**         | **825** | **3795.7**           |

Videos total 118 files (3544 MB registered, of which 39 are `.mov` QuickTime): raw phone/Instories exports, not web-optimised. Elementor-generated records (`elementor` folder) are CSS/JSON/font/HTML artefacts that live in the media library (`css`, `json`, `txt`, `ttf`, `eot`, `woff`, `html`, `svg` records totalling 18 items); they must not be migrated.

### 7.2 By upload folder (year/month)

| Upload folder | Items | Size (MB) |
| ------------- | ----- | --------- |
| `2026/01`     | 433   | 2108.1    |
| `2026/02`     | 251   | 1148.9    |
| `2026/03`     | 40    | 28.6      |
| `2026/04`     | 8     | 128.8     |
| `2026/08`     | 75    | 381.4     |
| `elementor`   | 18    | 0.0       |

Uploads exist for 2026-01, 02, 03, 04 and 08 only: the site was rebuilt in January 2026 and the earlier library was not migrated (or not registered). The legacy centre history (since 2002) has no older media in this library.

### 7.3 Largest files

| Size MB | MIME              | File                                                                                    |
| ------- | ----------------- | --------------------------------------------------------------------------------------- |
| 301.7   | `video/mp4`       | `/wp-content/uploads/2026/01/otchetnik-persona-1.mp4`                                   |
| 212.5   | `video/mp4`       | `/wp-content/uploads/2026/01/7256386817469383054.mp4`                                   |
| 187.3   | `video/quicktime` | `/wp-content/uploads/2026/02/instories_921b05ed-c484-47fe-a63f-0ac5eca61d1f.mov`        |
| 145.8   | `video/quicktime` | `/wp-content/uploads/2026/02/instories_0dd7ce77-4721-4c9d-9804-13656f6da633.mov`        |
| 145.6   | `video/quicktime` | `/wp-content/uploads/2026/01/teatralnaya-studiya.mov`                                   |
| 144.7   | `video/quicktime` | `/wp-content/uploads/2026/02/instories_2796ec94-afbc-4be3-9ecc-f8336de6be0b.mov`        |
| 126.4   | `video/quicktime` | `/wp-content/uploads/2026/01/instories_77fca057-8b2d-4660-846c-2f5d8b53a577.mov`        |
| 109.9   | `video/quicktime` | `/wp-content/uploads/2026/01/720p.mov`                                                  |
| 108.1   | `video/quicktime` | `/wp-content/uploads/2026/01/video-output-e05e3134-aeb2-495e-82d8-7ad5f0947a0b.mov`     |
| 88.8    | `video/mp4`       | `/wp-content/uploads/2026/01/img_3162.mp4`                                              |
| 85.4    | `video/quicktime` | `/wp-content/uploads/2026/02/instories_d49971d6-f151-43fb-b607-1b5bd1b9deac.mov`        |
| 84.8    | `video/quicktime` | `/wp-content/uploads/2026/01/instories_1fc19827-5bf0-4c1b-90a8-fc40e065f07c.mov`        |
| 82.7    | `video/quicktime` | `/wp-content/uploads/2026/01/instories_9d7cddc3-24d8-4d2b-81d1-5c1d84ea2197.mov`        |
| 64.9    | `video/quicktime` | `/wp-content/uploads/2026/02/instories_result_c74ac2d5-5ac8-4e85-a0e6-ba2c5a65fc4f.mov` |
| 56.5    | `video/quicktime` | `/wp-content/uploads/2026/02/instories_a09d9aae-147a-4109-8663-3242d2bc33b2-1.mov`      |

### 7.4 Images

- 680 image records; 26 have alt text (3.8%). Alt texts on the pages are mostly file-name derived ("rosnovskaya nataliya", "9 3 1", "Направления Персона — 19").
- 121 items are WebP; most photographic originals are PNG (288) and JPEG (250). 40 images are wider than 2000 px; the maximum width is 2560 px.
- WordPress generated sizes (from `media_details.sizes` of the 680 image records, bucketed by the largest generated size present): 341 stop below `large`/`medium_large` (260 with exactly `thumbnail`/`medium`/`full`, 43 with only `thumbnail`/`full`, 38 with no sizes at all, e.g. SVG); 215 reach `large`/`medium_large` but not `1536x1536` (148 with the full set `thumbnail`/`medium`/`medium_large`/`large`/`full`, 35 without `large`, 32 without `medium_large`); 79 reach `1536x1536`; 45 reach `2048x2048`.
- Rendered usage across all 37 pages: 1,102 `<img>` tags (header/footer repeats included): 478 reference `.webp`, 346 `.jpg`, 240 `.svg`; 1,028 carry `loading="lazy"`; 634 have `srcset` and 701 `sizes` (typical srcset: `grid-1.webp 487w, grid-1-222x300.webp 222w`, `resized_1200x800-1-1024x567.jpg 1200w, …300w, …768w, …1024w`). A `.webp` suffix is often appended to the original name (`logo.png.webp`, `rosnovskaya_nataliya.jpg.webp`): the site generates WebP siblings (query `persona_no_webp` disables them).
- Card posters are portrait 720x1280 WebP; Open Graph images are 1024x516 / 1024x374 PNG/JPG; the logo is 552x275 PNG (+ `.webp`).
- Imagery style: staged and stock-like photographs (several file names indicate stock/AI sources such as `gemini_generated_image_…`, `photoroom`), vertical posters, studio photos, teacher portraits cut to a square, large decorative SVG frames (`--persona-frame` images `frame-13/14/15.png`).
- Media attached to a post: 675; unattached: 150 (candidates for deletion).

### 7.5 Documents (PDF)

Registered PDFs (path, bytes): `/wp-content/uploads/2026/03/malenkie_miss_i_mister_rossiya_2026.pdf` (9854943 B); `/wp-content/uploads/2026/03/fashion-kitchen.pdf` (7451091 B); `/wp-content/uploads/2026/02/prejskurant-25-26.pdf` (2547917 B); `/wp-content/uploads/2026/01/polozhenie_chc_2025.pdf` (2846267 B); `/wp-content/uploads/2026/01/polozhenie_mal_miss_i_mister_2025.pdf` (9609685 B); `/wp-content/uploads/2026/01/stars_international_2025_polozhenie.pdf` (16737049 B); `/wp-content/uploads/2026/01/pravila-povedeniya.pdf` (898125 B); `/wp-content/uploads/2026/01/politika-personalnyh-dannyh.pdf` (5829845 B); `/wp-content/uploads/2026/01/abonentskij-dogovor.pdf` (1733025 B). Footer-linked: `abonentskij-dogovor.pdf`, `pravila-povedeniya.pdf`, `politika-personalnyh-dannyh.pdf`. Festival regulations 2026 are linked from /content/festivalnoe-dvizhenie/; the 2025 regulations (`polozhenie_*_2025.pdf`, `stars_international_2025_polozhenie.pdf`) and the 2025/26 price list (`prejskurant-25-26.pdf`) are unreferenced leftovers.

### 7.6 Migration note

1. Download only media referenced by retained content (about 700 attached items), not the 3.8 GB whole; transcode the 118 videos to H.264/AAC MP4 (1080p/720p vertical) and WebM/AV1 if desired, generate poster images, and host them on object storage/CDN rather than in the app image. `.mov` files up to 187 MB (and a 302 MB mp4) must never ship as-is.
2. Convert PNG photographs to AVIF/WebP via `next/image`; keep SVG icons/logos as-is. Keep the original highest-resolution source for each hero image.
3. Preserve an `legacyWpId` and old URL on each asset so old `/wp-content/uploads/…` URLs can be redirected or proxied for a period (external links, Yandex Maps card photos, social posts may hotlink them).
4. Write alt text for every retained image (see section 13) and drop decorative duplicates.
5. The three footer PDFs (8.4 MB combined, the policy alone 5.8 MB) should be re-exported smaller or replaced by HTML pages with PDF download.

## 8. Forms and integrations

### 8.1 Lead form (Moyklass)

- Location: global footer, anchor `#form`; mount `<div id="SiteWidgetMoyklass130355">` (one mount per page, on all 37 pages: in `footer-cta` on the home page, in `footer-form` on the other 36). The home page's `#consult-form` is a CTA banner (H2 + button → `#form`), not a second form.
- Provider: Moyklass (https://app.moyklass.com/api/site/widget/?id=01gGAHCMTHh6sF5MFhcE7tRjEqC2dNs2KhPj). The strings "Оставить заявку" / "Наш менеджер ответит вам в ближайшее время" are NOT part of the Moyklass widget markup: in the saved HTML they occur only inside the hidden CF7 form (8.3), so the visible Moyklass form's heading and button text are unknown (client-rendered). The widget renders a form with id prefix `wdgMoyklass130355Form…`; the input `#wdgMoyklass130355Form17342` (a single-line field intended for the message) is converted by an inline script into a hidden input plus a 5-row `<textarea>` with placeholder "Ваше сообщение" (synchronised via `input`/`change`). The other field names/labels are generated by Moyklass inside the widget and were not captured (it renders client-side), so the full field list is unknown (section 13). The labels "Ваше имя", "Ваш телефон" and "Ваше сообщение" come from the hidden CF7 form (8.3); only the "Ваше сообщение" placeholder is also set by the inline script for the Moyklass field. Treat name / phone / message as the minimum fields for the rebuilt form.
- Consent: the widget includes a consent block (`.wdgMoyklassForm-consent`); its link to Moyklass' `pdata.pdf` is rewritten by script to `/wp-content/uploads/2026/01/politika-personalnyh-dannyh.pdf` (opens in a new tab). Preserve this: the privacy policy link must point to the owner's policy.
- Validation/destination: handled by Moyklass (lead goes to the Moyklass CRM, "success" state shown by widget). Nothing is stored in WordPress. This applies to the Moyklass path only; the hidden CF7 form (8.3) posts to WordPress and may bypass Moyklass.
- Loading: the widget script is loaded lazily when the mount scrolls within 280 px or when any CTA button is clicked.

### 8.2 Schedule widget (Moyklass)

`/content/raspisanie/` contains two mounts, `#SiteWidgetMoyklass65961` and `#SiteWidgetMoyklass130200`, driven by the widget script id `38IaRqAF2GUQSoxG3JaEonvxriufNPjJGx` (the second widget id from the brief; the page-to-mount mapping was not determined). The schedule has no HTML fallback. In the rebuild embed the same widget (client component, loaded on view) and consider also exposing the schedule from Moyklass' public API if the owner allows (13).

### 8.3 Other forms

- Contact Form 7 (plugin version 6.1.5; REST routes `/wp-json/contact-form-7/v1/contact-forms`, list requires authentication; `wpcf7` object inlined with `api.root` `https://personamodel.ru/wp-json/`, namespace `contact-form-7/v1`): form id 730 is server-rendered (`<div class="wpcf7 no-js" data-wpcf7-id="730">`, `<form class="wpcf7-form init" novalidate="novalidate" method="post">`) on the 36 non-home pages (all 37 pages except the home page), inside the footer container `footer-form` (Elementor id `264ca52`, `id="form"`, Elementor widget `aeb0409` with class `form-main`, under the H2 "Связаться с нами"). The home page (and `/studios/` 403, 404 probe) has no CF7 form.
  - Form action: the page's own URL, e.g. `/areas/<slug>/?persona_wp=1#wpcf7-f730-p<post id>-o1` on `areas` pages and `/<slug>/#wpcf7-f730-o1` or `…/?persona_wp=1#wpcf7-f730-o1` on other pages (the form posts back to WordPress; with JS active CF7 submits to the REST endpoint `/wp-json/contact-form-7/v1/contact-forms/730/feedback`). Hidden fields: `_wpcf7` = 730, `_wpcf7_version` = 6.1.5, `_wpcf7_locale` = `en_US`, `_wpcf7_unit_tag` (e.g. `wpcf7-f730-p804-o1`), `_wpcf7_container_post` (the area post id, 0 on pages), `_wpcf7_posted_data_hash` (empty).
  - Fields: `text-592` (text, placeholder "Ваше имя", not required, maxlength 400); `tel-605` (type `tel`, placeholder "Ваш телефон", required: class `wpcf7-validates-as-required`, `aria-required="true"`, maxlength 400); `textarea-953` (placeholder "Ваше сообщение", not required, maxlength 2000, 10 rows / 40 cols); submit `<button id="submit" class="wpcf7-form-control wpcf7-submit">Оставить заявку</button>` with an arrow icon, followed by the helper text "Наш менеджер ответит вам в ближайшее время". The form uses `novalidate` (validation is done by CF7 server-side/JS, no HTML5 `required` attribute). There is no acceptance (consent) checkbox, no reCAPTCHA/Turnstile field and no honeypot field in the markup.
  - Visibility: the Elementor shortcode widget carries `elementor-hidden-desktop elementor-hidden-tablet elementor-hidden-mobile`; the combined stylesheet `all-css-9f530083df.css` hides these at ≥1025 px, 768-1024 px and ≤767 px respectively, with no override found, so the form is `display:none` at every width (read from the CSS, not confirmed in a real browser). Styling for it (`.form-main …`) still exists in the CSS, so it looks like a form that was once shown and then switched off. No script found in the HTML un-hides it.
  - Unknown (needs WP admin): the CF7 mail recipient and template, whether Flamingo or another plugin stores submissions, and whether CF7 leads reach Moyklass. Because the form is hidden, real leads are likely none today, but a bot can still post to the endpoint.
  - Popups: the mobile menu popup #552 and the 26 teacher popups contain no form or input; the only `<form>` element on any crawled page is this CF7 form (other inputs on pages are CookieYes switches and the video lightbox seek bar).
- СБП payment: "Оплатить" button on /tarify/ opens a static NSPK QR payment link for free-amount payments after agreement with the administrator ("Поле свободной оплаты").
- No newsletter, no search form, no comment forms.

### 8.4 Analytics (Yandex Metrika, counter 112028433)

Initialisation: `ym(112028433, 'init', {ssr:true, clickmap:true, ecommerce:'dataLayer', referrer, url, accurateTrackBounce:true, trackLinks:true})`; no `webvisor`. `tag.js` loads after page load or 2.5 s (desktop) and on first interaction or 12 s (mobile); calls before that are queued.

Goals fired from site code (via `reachGoal`, each once per page view):

| Goal id          | Trigger                                                                                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lead`           | Moyklass form `submit`, a Moyklass `success` node appearing (MutationObserver), or any `ym(..., 'reachGoal', '01gGAH…')` call from the Moyklass widget (key `01gGAHCMTHh6sF5MFhcE7tRjEqC2dNs2KhPj`) |
| `click_phone`    | click on any `tel:` link                                                                                                                                                                            |
| `click_telegram` | click on any link containing `t.me/`, `telegram.me/` or `telegram.org/`                                                                                                                             |

Goals configured inside Metrika (conditions, funnels) are unknown; click/scroll maps (`clickmap`) and link tracking are on. The `<noscript>` fallback pixel is present. Rebuild: keep the counter and the three goals, send them through a small typed `track()` helper and load after consent/interaction.

### 8.5 Maps

- Studio maps are Yandex Maps constructor iframes (`yandex.ru/map-widget/v1/…`, 560x260, lazy via `data-src` + IntersectionObserver) for Мичуринский проспект 56, Богданова 19, Нежинская 11 and an organisation view (`oid=1010597830`) for Профсоюзная 61; studio pages use the YaMaps plugin (JS API 2.1) with a placeholder.
- Yandex Sprav rating badge iframe: `https://yandex.ru/sprav/widget/rating-badge/165851817022?type=rating`, 150x50; Yandex reviews widget iframe `https://yandex.ru/maps-reviews-widget/165851817022?comments` on /otzyvy/.
- 2GIS: link to firm 70000001048641490 reviews tab (image button, alt "gis").

### 8.6 Cookie consent (CookieYes)

- Banner type "box", bottom-left, with a "revisit consent" button (blue `#0056A7`); `_activeLaw: gdpr`, `_expiry: 365` days, consent logging on (`_logConsent: 1`), `loadAnalyticsByDefault: false`, `_block: 1`.
- Visible texts: title "Мы ценим вашу конфиденциальность"; default description "Мы используем файлы cookie, чтобы улучшить работу сайта, показывать персонализированную рекламу или контент, а также анализировать трафик. Нажимая «Принять все», вы соглашаетесь на использование файлов cookie."; buttons "Отказаться" and "Принять все". An inline script overrides the description with: "Этот сайт, как и наш детский центр, заботится о вашем удобстве. Мы собираем технические данные (cookies), чтобы сайт не «тормозил», а вы быстро находили расписание и новости. Мы не передаем ваши данные посторонним и используем их только для улучшения работы сайта.<br><br>Нажимая «Принять», вы помогаете нам стать лучше 🤗" (the override says "Принять", the buttons say "Принять все": inconsistent).
- The preference centre texts are English ("Customise Consent Preferences", "Necessary / Functional / Analytics / Performance / Advertisement", "Always Active", "No cookies to display.") because the banner language is `en` with partial Russian overrides; the cookie lists are empty (the cookie scan found no cookies).
- Metrika and Moyklass load regardless of the choice (no consent gating is visible in the inline code); an inline script blocks pointer events outside the header, menu and cookie banner while `body.persona-nav-pe-lock` is set (open mobile menu). For 152-ФЗ compliance the rebuild should gate non-essential scripts on consent or explicitly document the legal basis (owner/lawyer decision).

### 8.7 Social and messenger endpoints to preserve

VK `https://vk.com/personamodelmoscow` (community 127439478), Telegram `https://t.me/personamp56` (footer/hero), `https://t.me/PersonaRamenki` (floating button and FAQ), MAX `https://max.ru/id615422777189_biz` and `https://max.ru/u/…` (floating/FAQ), e-mail `personamodel@mail.ru`, phones as in 4.1.

## 9. SEO inventory and redirect map

### 9.1 Titles and descriptions

- Default pattern `{page title} - Persona - Art Center` on 22 pages (all `areas` except 8, 13, 15, 16, 17, plus /privacy-policy/, /otzyvy/, /tarify/, /content/studiya-profsoyuznaya/, /content/studiya-solntsevo/); 15 pages have custom titles ending in "| PersOna", "| PersonaModel", "— PersOna", "- PersonaModel" or "- студия «PersOna»" (mixed separators " - ", " — ", " | "). The 15 custom titles: home, О нас, Организация событий, Фестивальное движение, Наша команда (title "Педагоги творческой студии PersonaModel в Москве."), Новости, Наши направления, Расписание, Мичуринский, Славянский, Языковая школа, Театр, Вокальная студия, Театр танца, Школа моделей.
- Descriptions: written for every page, but three are broken auto-extractions: `/content/studiya-profsoyuznaya/` and `/content/studiya-solntsevo/` ("АДРЕС: …МоскваБЛИЖАЙШАЯ СТАНЦИЯ МЕТРО…"), and `/brunches/` ("PersOna PersOna PersOna … Наши направления Записаться"). The areas use a recurrent pattern "X в творческом центре Persona в Москве: …".
- The `<title>` for the 404 page is "Страница не найдена"; the 403 page is the hosting template.

### 9.2 Open Graph / Twitter

`og:locale ru_RU`, `og:type` `website` (home) / `article` (all others, including services: should be `website`), `og:title`, `og:description`, `og:url`, `og:site_name PersOna`, `og:image` (+ width/height/type), `og:updated_time`, `twitter:card summary_large_image`, `twitter:title/description/image`, `twitter:label1 Время чтения` / `twitter:data1 Меньше минуты`. Default share image `img_6233-1-1024x516.jpg` is used by 15 pages; area pages use their featured image; `theme-color` meta appears twice (`#7EC2BF` and `#5DBAA8`). `<html lang="ru-RU" prefix="og: https://ogp.me/ns#">`.

### 9.3 Structured data (JSON-LD) per page family

| Page family                                         | Types                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home `/`                                            | Rank Math graph: `Organization` (+logo `ImageObject`), `WebSite` with `SearchAction` (non-functional search), `ImageObject`, `WebPage` (datePublished 2026-01-21T19:13:02+03:00, dateModified 2026-08-24T10:14:10+03:00); custom `LocalBusiness` (id `#localbusiness`, main address Мичуринский проспект, 56, `department` x3: Солнцево, Славянский бульвар, Калужская / Профсоюзная; phone +7 499 393-30-05; sameAs VK and Telegram); `FAQPage` with 4 Q&As |
| All other 36 pages (areas, content, studios, legal) | only the custom `LocalBusiness` block (identical on all pages); no `WebPage`, `BreadcrumbList`, `Course`/`Service`, `Person` or `Event` schema                                                                                                                                                                                                                                                                                                               |

Gaps for the rebuild: BreadcrumbList, `EducationalOrganization`/`LocalBusiness` per studio with geo + opening hours, `Course` per direction, `Person` for teachers (optional), accurate `FAQPage` (include all 7 and exclude the CTA), `Event` for festivals if dated.

### 9.4 Canonical, robots, hreflang, sitemaps

- Canonical: self-referencing absolute URL on every page; the Cyrillic URL is canonicalised in percent-encoded form. Page robots meta: `index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large`; 404: `noindex`.
- hreflang: none (single `ru-RU`); no `rel=prev/next`.
- Sitemap index `/sitemap_index.xml` (also `/sitemap.xml`; `/wp-sitemap.xml` 301s to it): `page-sitemap.xml` (15 URLs, with `image:image` entries for home x15, Организация событий x4, Фестивальное движение x4, О нас x6, Команда x26, Новости x6) and `areas-sitemap.xml` (22 URLs, no images). `lastmod` is normalised (see section 3.1). XSL stylesheet `/main-sitemap.xsl`.
- robots.txt (verbatim):

```text
User-agent: *
Disallow: /wp-content/uploads/wpo/wpo-plugins-tables-list.json
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Clean-param: eye&etext&ybaip&id&erid&utm_source&utm_medium&utm_campaign&utm_content&utm_term&utm_referer&utm_ya_campaign&utm_candidate&yabizcmpgn&yclid&ymclid&gclid&fbclid&_openstat&persona_wp&persona_no_webp&persona_all_popups /

Sitemap: https://personamodel.ru/sitemap_index.xml
```

`Clean-param` is Yandex-specific (tracking parameters); keep equivalent handling (strip those params in canonical URLs, which Next.js does by default through explicit canonicals).

### 9.5 Redirect map (old URL → proposed new URL), all 37 sitemap URLs

Policy: the existing URLs are not ideal but have 10+ months of indexing in Yandex/Google (site created 2026-01); the owner decides between (a) keeping every URL unchanged (zero-risk, but retains `/brunches/`, `/studios/…`, `/районы/…`, underscores and the typo) and (b) moving to the consistent slugs below with 301 redirects for every old URL. This document proposes (b), implemented as `TRedirect` rows, and requires keeping the old paths alive as 301 for at least 12 months. Redirects must also cover: `/areas/` → `/napravleniya/`, the percent-encoded form of the Cyrillic URL, the `/o-nas` (no slash) variants, `/studios/` and `/content/` (currently 403: make 404 or redirect to `/napravleniya/` and `/`), and old PDF paths if the files move. Proposed prefixes: `/napravleniya/` (directions, flat; audience is a field, not a path segment), `/studii/` (branches), single-word top-level pages. Slugs are transliterated Russian (latin, hyphens, no underscores).

| #   | Old path (decoded)                            | Old path (as served)                                                                                                     | Proposed new path                                      | Action |
| --- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ------ |
| 1   | `/areas/inzhenernyj-klub-megavolt/`           | `same`                                                                                                                   | `/napravleniya/megavolt/`                              | 301    |
| 2   | `/areas/bachata/`                             | `same`                                                                                                                   | `/napravleniya/bachata/`                               | 301    |
| 3   | `/areas/barre-fitnes/`                        | `same`                                                                                                                   | `/napravleniya/barre-fitnes/`                          | 301    |
| 4   | `/areas/pilates/`                             | `same`                                                                                                                   | `/napravleniya/pilates/`                               | 301    |
| 5   | `/areas/art-masterskaya/`                     | `same`                                                                                                                   | `/napravleniya/art-masterskaya/`                       | 301    |
| 6   | `/areas/igra-na-muzykalnyh-instrumentah/`     | `same`                                                                                                                   | `/napravleniya/muzykalnye-instrumenty/`                | 301    |
| 7   | `/areas/logoped/`                             | `same`                                                                                                                   | `/napravleniya/logoped/`                               | 301    |
| 8   | `/studios/yazykovaya-shkola/`                 | `same`                                                                                                                   | `/napravleniya/yazykovaya-shkola/`                     | 301    |
| 9   | `/areas/joga/`                                | `same`                                                                                                                   | `/napravleniya/joga/`                                  | 301    |
| 10  | `/areas/podgotovka-k-shkole/`                 | `same`                                                                                                                   | `/napravleniya/podgotovka-k-shkole/`                   | 301    |
| 11  | `/areas/robototehnika/`                       | `same`                                                                                                                   | `/napravleniya/robototehnika/`                         | 301    |
| 12  | `/areas/shahmaty/`                            | `same`                                                                                                                   | `/napravleniya/shahmaty/`                              | 301    |
| 13  | `/studios/teatralynaya_studiya/`              | `same`                                                                                                                   | `/napravleniya/teatr/`                                 | 301    |
| 14  | `/areas/risovanie/`                           | `same`                                                                                                                   | `/napravleniya/risovanie/`                             | 301    |
| 15  | `/studios/vokalynaya_studiya/`                | `same`                                                                                                                   | `/napravleniya/vokal/`                                 | 301    |
| 16  | `/studios/teatr_tanca/`                       | `same`                                                                                                                   | `/napravleniya/tancy/`                                 | 301    |
| 17  | `/studios/shkola_modeley/`                    | `same`                                                                                                                   | `/napravleniya/shkola-modeley/`                        | 301    |
| 18  | `/areas/prodlenka/`                           | `same`                                                                                                                   | `/napravleniya/prodlenka/`                             | 301    |
| 19  | `/районы/семенная-школа/`                     | `/%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%D1%8B/%D1%81%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F-%D1%88%D0%BA%D0%BE%D0%BB%D0%B0/` | `/napravleniya/semejnaya-shkola/`                      | 301    |
| 20  | `/areas/individualnye-zanyati-dlya-vzroslyh/` | `same`                                                                                                                   | `/napravleniya/individualnye-zanyatiya-dlya-vzroslyh/` | 301    |
| 21  | `/areas/dlya-vzroslyh/`                       | `same`                                                                                                                   | `/napravleniya/dlya-vzroslyh/`                         | 301    |
| 22  | `/areas/salsa-i-bachata/`                     | `same`                                                                                                                   | `/napravleniya/bachata/ (merge; owner decision)`       | 301    |
| 23  | `/`                                           | `same`                                                                                                                   | `/`                                                    | keep   |
| 24  | `/privacy-policy/`                            | `same`                                                                                                                   | `/politika-konfidencialnosti/`                         | 301    |
| 25  | `/content/organizaciya-prazdnikov/`           | `same`                                                                                                                   | `/sobytiya/`                                           | 301    |
| 26  | `/content/festivalnoe-dvizhenie/`             | `same`                                                                                                                   | `/festivali/`                                          | 301    |
| 27  | `/o-nas/`                                     | `same`                                                                                                                   | `/o-nas/`                                              | keep   |
| 28  | `/content/studiya-profsoyuznaya/`             | `same`                                                                                                                   | `/studii/profsoyuznaya/`                               | 301    |
| 29  | `/content/nashi-pedagogi/`                    | `same`                                                                                                                   | `/komanda/`                                            | 301    |
| 30  | `/news/`                                      | `same`                                                                                                                   | `/novosti/`                                            | 301    |
| 31  | `/otzyvy/`                                    | `same`                                                                                                                   | `/otzyvy/`                                             | keep   |
| 32  | `/tarify/`                                    | `same`                                                                                                                   | `/tarify/`                                             | keep   |
| 33  | `/brunches/`                                  | `same`                                                                                                                   | `/napravleniya/`                                       | 301    |
| 34  | `/content/raspisanie/`                        | `same`                                                                                                                   | `/raspisanie/`                                         | 301    |
| 35  | `/content/studiya-solntsevo/`                 | `same`                                                                                                                   | `/studii/solntsevo/`                                   | 301    |
| 36  | `/content/studiya-michurinskiy/`              | `same`                                                                                                                   | `/studii/michurinskiy-prospekt/`                       | 301    |
| 37  | `/content/studiya-slavyan/`                   | `same`                                                                                                                   | `/studii/slavyanskiy-bulvar/`                          | 301    |

Notes: "Сальса и бачата" (ID 802) is a duplicate of "Бачата" (1877), so it should be merged into `/napravleniya/bachata/` with a 301 rather than recreated. "Для взрослых" becomes a landing page for the adult group with its own copy (the current copy is Barre-fitness text).

## 10. Design inventory (as-is)

Source: homepage combined CSS `all-css-4d9839e0b9.css` (726,845 bytes) and the Elementor kit (`elementor-kit-7`). This is a record of the current look only; the redesign will use new references.

### 10.1 Colours

Elementor global colours (kit): `primary` #FFFFFF, `secondary` #5DBAA8 (teal), `text` #000000, `accent` #FE7E71 (coral), plus custom #7EC2BF (also `theme-color`), #393738, #312E2E, #274442 (dark teal), #F4EEF0 and #FFF8F8 (blush backgrounds), #F3F3F3, translucent #000000B3 and #FFFFFFD4. Colours seen in CSS by frequency: #fff, #000, #eee, #111, #aaa, #1f2124, #393738, #69727d, #5dbaa8, #7cc1be, #b8dddc (light teal), #9ed1cf, `rgb(204,51,102)` pink (#c36 shorthand; the brief measured it used heavily), `rgb(254,126,113)` coral. Backgrounds measured on the home page by the brief: #F4EEF0, #FFF8F8, #F5F6F7; text rgb(31,33,36). Overlays: `rgba(0,0,0,.2/.8)`, `rgba(17,24,28,.22/.48/.72)`. Cookie banner blues #1863DC / #0056A7 and Swiper `#007aff` are plugin defaults, not brand colours.

### 10.2 Typography

- Family: **Montserrat** (weights 300, 400, 500, 600, 700; Latin and Cyrillic) for everything; self-hosted woff2 plus a Google Fonts stylesheet on one page. "Tenor Sans" is defined in two Elementor global presets (sizes `14vw`/`64px`) probably for the giant decorative "PersOna" words; it is not self-hosted.
- Body 18px/black (brief). Headings measured by the brief: H1 40px/500, section H2 55px/400, card H2 32px/600. Elementor global presets (size, weight): 55/400 with a 34px step (tablet), 46/500 with 34px, 48/500, 42/600, 36/700 (28px), 34/500, 32/700, 24/700, 22-24, 20/500, 20/300, 18-20/300, 16/300, 15/300, 14/500; sizes reduce at tablet/mobile via variables.
- Letter case: much copy is uppercase (menus, H1 on several pages).

### 10.3 Spacing, radius, effects

Card/container radius 30px (49 uses), 15px (36), 25px (21), 20px 20px 0 0 (12), 50% circles (28); small controls 3-4px. Containers are Elementor flex containers (boxed, `e-con-boxed`) with 40-90 px row gaps (loop grid 90px desktop, 30px tablet, 10px mobile), carousel image spacing 30-40px; decorative PNG frames around cards (`frame-13/14/15.png`, inner padding 40-72px); card icons are emoji swapped to SVG. Buttons use a gradient class `btn-gradient`. Marquee "PersOna" strip, flip-box hover animation, fade-in gallery hover, parallax/motion-effects on backgrounds, lazy-loaded container backgrounds.

### 10.4 Breakpoints

Elementor: mobile ≤767px, tablet 768-1024px, desktop ≥1025px. CSS media queries counted: `max-width:1024px` x85, `max-width:767px` x70, `min-width:768px` x29, `min-width:1025px` x12; extra custom widths 575/576, 700/701, 991/992, 1100, 1200, 500, 479, 768. Carousels: 3 slides desktop, 2 tablet, 1 mobile; grids 4/2/1 or 3/2/1 columns. Reference viewport used by the brief: 1440px.

### 10.5 Component catalogue (Elementor widgets actually used)

| Family                                                                                                | Widgets (count in main content)                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home                                                                                                  | heading 14, text-editor 17, button 6, icon-list 1, theme-post-title 7, loop-carousel 2, image 18, html 2, icon 12, icon-box 12, nested-carousel 2, video 21, image-carousel 6, gallery 5, nested-tabs 1, nested-accordion 3 |
| Area single (22 pages)                                                                                | heading 87, text-editor 124, button 132, flip-box 132, image 220, video 49, nested-carousel 22, theme-post-title 66, loop-carousel 22                                                                                       |
| Studio pages (4)                                                                                      | html 4 (marquee), heading 4, shortcode 4 (YaMaps), text-editor 4                                                                                                                                                            |
| Content pages (events, festivals, about, team, news, reviews, tariffs, directions, schedule, privacy) | heading 36, text-editor 35, button 7, flip-box 12, image 89, video 1, html 11, loop-grid 1                                                                                                                                  |
| Global chrome                                                                                         | theme-site-logo, nav-menu x3, mega-menu x4, icon, icon-list, icon-box, menu-anchor, shortcode (Moyklass), nested-carousel (studios), html (map, rating badge)                                                               |

Reusable UI components to build: Header (logo, mega nav, secondary bars, phones), mobile menu popup, floating messenger buttons, cookie banner, footer with lead form and studio carousel, hero, marquee, feature card, flip box, direction card (poster) and direction card (bullet list), image/video carousel, tabbed gallery, lightbox video player, accordion/FAQ, teacher card + modal, tariff table, studio card/map, CTA banner, rich-text.

### 10.6 Imagery style

Warm, bright, child-centred photography (classes, performances, studio interiors), portrait posters for direction cards, round/rounded masks and decorative PNG frames, teal/coral/pink accents on white or blush, large display typography ("PersOna" words), emoji used as icons.

## 11. Performance audit

### 11.1 Measured (37 sitemap URLs, sequential, this machine; includes network latency)

| Metric                  | Value                                                                                                                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TTFB                    | min 1.05 / median 2.60 / max 6.67 s                                                                                                                                                      |
| Total time              | min 1.98 / median 5.47 / max 15.39 s                                                                                                                                                     |
| HTML on the wire (gzip) | min 51.1 / median 60.7 / max 76.1 KB                                                                                                                                                     |
| HTML decompressed       | min 254.1 / median 321.9 / max 529.3 KB                                                                                                                                                  |
| DOM size (opening tags) | min 959 / median 1250 / max 2245                                                                                                                                                         |
| `<img>` tags per page   | min 18 / median 28 / max 124                                                                                                                                                             |
| Home page               | TTFB 1.07 s, total 2.35 s, 77,955 B gzip / 542,012 B raw, 124 `<img>`, 2,245 tags                                                                                                        |
| Slowest                 | totals: `/studios/vokalynaya_studiya/` 15.4 s, `/areas/robototehnika/` 14.6 s, `/areas/risovanie/` 13.6 s; TTFB: `/studios/vokalynaya_studiya/` 6.67 s, `/areas/art-masterskaya/` 6.52 s |
| 404                     | TTFB 0.79 s (271 B)                                                                                                                                                                      |

The slow tail (TTFB > 4 s on 10 of 37 pages, TTFB > 3 s on 15, total > 8 s on 11) points at origin variability even though a static HTML layer exists (`X-Persona-Static`, WP-Optimize): the cache header says `no-cache, must-revalidate` for the HTML itself and `Vary: User-Agent`, so a cold or revalidated hit goes through PHP. Individual page timings are in 3.1; per-page weights follow.

| #   | Path                                          | img tags | iframes | scripts | style blocks | DOM nodes | combined CSS file        |
| --- | --------------------------------------------- | -------- | ------- | ------- | ------------ | --------- | ------------------------ |
| 1   | `/areas/inzhenernyj-klub-megavolt/`           | 31       | 5       | 25      | 19           | 1267      | `all-css-9f530083df.css` |
| 2   | `/areas/bachata/`                             | 30       | 5       | 25      | 19           | 1264      | `all-css-9f530083df.css` |
| 3   | `/areas/barre-fitnes/`                        | 32       | 5       | 25      | 19           | 1280      | `all-css-9f530083df.css` |
| 4   | `/areas/pilates/`                             | 29       | 5       | 25      | 19           | 1253      | `all-css-9f530083df.css` |
| 5   | `/areas/art-masterskaya/`                     | 31       | 5       | 25      | 19           | 1291      | `all-css-9f530083df.css` |
| 6   | `/areas/igra-na-muzykalnyh-instrumentah/`     | 32       | 5       | 25      | 19           | 1267      | `all-css-9f530083df.css` |
| 7   | `/areas/logoped/`                             | 28       | 5       | 25      | 19           | 1246      | `all-css-9f530083df.css` |
| 8   | `/studios/yazykovaya-shkola/`                 | 33       | 5       | 25      | 19           | 1281      | `all-css-9f530083df.css` |
| 9   | `/areas/joga/`                                | 27       | 5       | 25      | 19           | 1236      | `all-css-9f530083df.css` |
| 10  | `/areas/podgotovka-k-shkole/`                 | 31       | 5       | 25      | 19           | 1287      | `all-css-9f530083df.css` |
| 11  | `/areas/robototehnika/`                       | 31       | 5       | 25      | 19           | 1283      | `all-css-9f530083df.css` |
| 12  | `/areas/shahmaty/`                            | 28       | 5       | 25      | 19           | 1272      | `all-css-9f530083df.css` |
| 13  | `/studios/teatralynaya_studiya/`              | 31       | 5       | 25      | 19           | 1281      | `all-css-9f530083df.css` |
| 14  | `/areas/risovanie/`                           | 32       | 5       | 25      | 19           | 1307      | `all-css-9f530083df.css` |
| 15  | `/studios/vokalynaya_studiya/`                | 28       | 5       | 25      | 19           | 1253      | `all-css-9f530083df.css` |
| 16  | `/studios/teatr_tanca/`                       | 29       | 5       | 25      | 19           | 1279      | `all-css-9f530083df.css` |
| 17  | `/studios/shkola_modeley/`                    | 30       | 5       | 25      | 19           | 1278      | `all-css-9f530083df.css` |
| 18  | `/areas/prodlenka/`                           | 27       | 5       | 25      | 19           | 1287      | `all-css-9f530083df.css` |
| 19  | `/районы/семенная-школа/`                     | 26       | 5       | 25      | 19           | 1250      | `all-css-9f530083df.css` |
| 20  | `/areas/individualnye-zanyati-dlya-vzroslyh/` | 19       | 5       | 25      | 19           | 1206      | `all-css-9f530083df.css` |
| 21  | `/areas/dlya-vzroslyh/`                       | 20       | 5       | 25      | 19           | 1195      | `all-css-9f530083df.css` |
| 22  | `/areas/salsa-i-bachata/`                     | 19       | 5       | 25      | 17           | 1136      | `all-css-9f530083df.css` |
| 23  | `/`                                           | 124      | 5       | 28      | 21           | 2245      | `all-css-4d9839e0b9.css` |
| 24  | `/privacy-policy/`                            | 19       | 5       | 25      | 12           | 1060      | `all-css-4ea23be0cb.css` |
| 25  | `/content/organizaciya-prazdnikov/`           | 29       | 5       | 26      | 13           | 1159      | `all-css-3a1029ea0a.css` |
| 26  | `/content/festivalnoe-dvizhenie/`             | 26       | 5       | 26      | 12           | 1132      | `all-css-393adef92c.css` |
| 27  | `/o-nas/`                                     | 19       | 5       | 25      | 12           | 985       | `all-css-8facf6e757.css` |
| 28  | `/content/studiya-profsoyuznaya/`             | 20       | 5       | 28      | 12           | 1003      | `all-css-00888bcd37.css` |
| 29  | `/content/nashi-pedagogi/`                    | 71       | 5       | 26      | 12           | 1831      | `all-css-8dea13f4d7.css` |
| 30  | `/news/`                                      | 18       | 5       | 25      | 12           | 959       | `all-css-caec2da764.css` |
| 31  | `/otzyvy/`                                    | 19       | 8       | 25      | 12           | 990       | `all-css-36667f3687.css` |
| 32  | `/tarify/`                                    | 21       | 5       | 29      | 11           | 1003      | `all-css-267ba540a8.css` |
| 33  | `/brunches/`                                  | 36       | 5       | 25      | 13           | 1085      | `all-css-1d63ff98f5.css` |
| 34  | `/content/raspisanie/`                        | 19       | 5       | 27      | 12           | 960       | `all-css-dc91e00cc2.css` |
| 35  | `/content/studiya-solntsevo/`                 | 19       | 5       | 28      | 12           | 992       | `all-css-9202e719b3.css` |
| 36  | `/content/studiya-michurinskiy/`              | 19       | 5       | 28      | 12           | 993       | `all-css-1ae9abe80a.css` |
| 37  | `/content/studiya-slavyan/`                   | 19       | 5       | 28      | 12           | 992       | `all-css-9b36f790a4.css` |

### 11.2 Payloads (home page)

| Resource                                          | Raw                                           | gzip         |
| ------------------------------------------------- | --------------------------------------------- | ------------ |
| HTML                                              | 542,012 B                                     | 77,955 B     |
| Combined CSS `all-css-4d9839e0b9.css`             | 726,845 B                                     | about 72 KB  |
| Elementor+Pro+Swiper bundle `el-js-52c9d94b28.js` | 411,122 B                                     | about 117 KB |
| jQuery 3 `jquery.min.js`                          | 87,553 B                                      | about 30 KB  |
| CookieYes `script.min.js`                         | 22,631 B                                      | about 7 KB   |
| `persona-hcg-boot.js` (video slider)              | 40,689 B                                      | about 7 KB   |
| Fonts (2 woff2)                                   | 28,316 B                                      | n/a          |
| Metrika `tag.js`                                  | about 86 KB (per inline comment; not fetched) | -            |
| Moyklass widget, Yandex Maps JS/iframes           | not measured (third party)                    | -            |

Area pages use `all-css-9f530083df.css` (714,621 B raw / about 79 KB gzip) and `el-js-4f74902044.js` (395,748 B / about 112 KB).

First-load JS+CSS for a typical page is therefore about 0.2-0.3 MB gzipped (1.3 MB uncompressed) before any image, plus third parties. Media pulled lazily include posters and hosted videos on interaction (`preload: none`).

### 11.3 Root causes of slowness

1. Slow origin (shared PHP hosting at nic.ru; median TTFB 2.6 s, no CDN) and a HTML cache that is not honoured by headers (`no-cache` + `Vary: User-Agent`).
2. Oversized, deeply nested Elementor DOM (up to 2,245 tags; the team page embeds 26 popups, the home page tabs/galleries render all tabs at once: 542 KB of HTML) and a 0.7 MB combined stylesheet of which most is unused on any one page.
3. jQuery + Elementor frontend + Swiper + Pro modules (about 0.5 MB JS raw) needed for simple carousels/accordions/tabs; mitigated only by delaying them (which causes late interactivity and replayed clicks).
4. Unoptimised media: raw `.mov` up to 187 MB, PNG photographs, 40 images > 2000 px, 118 videos; many posters are PNG-derived WebP screenshots.
5. Third-party scripts (Metrika, Moyklass CRM widget, Yandex Maps API and iframes, CookieYes) on every page; the Moyklass lead form and the schedule are client-rendered and non-indexable.
6. A large, fragile custom performance layer (inline scripts, string-rewriting) that works against Elementor and is itself a maintenance risk.

### 11.4 Targets for the rebuild (proposed)

- TTFB < 200 ms from the RU edge/CDN for static pages (SSG/ISR), < 600 ms uncached origin; LCP < 2.0 s on mobile 4G, CLS < 0.05, INP < 200 ms.
- Initial JS per page < 100 KB gzip (Server Components, islands only for menu, carousel, lightbox, forms), CSS < 40 KB gzip (Tailwind v4 per route).
- HTML < 60 KB gzip for the home page, < 35 KB for direction pages; DOM < 1,200 nodes on home; teacher bios loaded on demand (modal fetch) rather than inline.
- Images AVIF/WebP via `next/image` with correct `sizes`; no image over 200 KB on mobile; videos transcoded < 8 MB each, poster first, loaded on interaction.
- Third parties lazy: Metrika after interaction/consent, Moyklass on view/click, maps on click ("Показать карту") or intersect.
- Lighthouse mobile ≥ 90 on home, direction and studio templates; Core Web Vitals "good" for 75% of field data.

## 12. Rebuild recommendations (orchestrator's recommendation)

### 12.1 Application architecture

- Next.js 16 App Router, React 19, Server Components by default, Tailwind v4 (`@theme inline`), bun, TypeScript; static generation (`generateStaticParams`) for pages/directions/studios/teachers with on-demand revalidation: the CMS save hook calls `revalidateTag('direction:<slug>')` / `revalidatePath('/napravleniya/<slug>')` (and tags for navigation/settings that affect every page).
- `next/image` with AVIF/WebP and explicit `sizes`; `next/font/google` or local Montserrat with the `cyrillic` and `latin` subsets (weights 300-700 only as used); `next/script` `lazyOnload`/`afterInteractive` for Metrika after consent; Moyklass, maps and YouTube-like embeds mounted on interaction or intersection; native `<details>` or a small accordion instead of jQuery plugins; one carousel library (Embla) only where needed.
- Replace the Elementor "loop" cards with data-driven components; the route structure in 9.5; typed `track()` helper for the three Metrika goals; `robots.ts`/`sitemap.ts` generated from the CMS; JSON-LD per entity.

### 12.2 CMS options

**Primary recommendation: Payload CMS 3, embedded in the same Next.js app** (same repo and domain; admin under a non-default route through `routes.admin`, e.g. an unguessable path such as `/studio-<random>`; built-in email+password authentication, roles/access control, media uploads, drafts and versions, live preview, Lexical rich text, hooks for `revalidateTag`; Postgres or SQLite adapter). This yields one deployable, typed collections that map 1:1 to the model in section 6, and an editor-friendly UI for the owner. **Caveat: Payload's compatibility with Next.js 16.2 must be verified before committing** (the template pins Next 16; check Payload's supported Next range, the admin bundle's behaviour with Turbopack, and the `@payloadcms/next` version at start of the project, and prototype `routes.admin` plus drafts/live preview in a spike).

| Option                                                                          | Pros                                                                                                                                         | Cons                                                                                                                                                                          | Fit                                                                                                    |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Payload CMS 3 embedded** (recommended)                                        | Same app/domain/repo, typed schema, access control, drafts/versions, media, SQLite/Postgres, hooks for revalidation, admin path configurable | Next-version coupling (verify with 16.2), admin JS weight only on admin route, more moving parts than a bespoke form                                                          | Best overall                                                                                           |
| Custom minimal admin (server actions + Drizzle + SQLite + iron-session/Auth.js) | Full control, smallest dependency surface, fits Next 16 exactly                                                                              | Everything is hand-built: rich text editor, media library, versions, validation UI, roles; ongoing maintenance                                                                | If the editable surface is small (tariffs, FAQ, teachers, directions) and the owner accepts a basic UI |
| Keystatic / git-based                                                           | Content in the repo, free, simple, versioned                                                                                                 | Non-technical editing needs GitHub auth or local mode, no real roles/media pipeline, rebuild/redeploy per edit unless GitHub webhooks are used; poor fit for a business owner | Only if edits are rare and a developer helps                                                           |
| Headless WordPress kept as backend                                              | Fastest migration (content and Elementor-free REST already public, editors keep the admin), no content re-entry                              | Keeps the slow PHP host and Elementor-shaped content (content is Elementor JSON/HTML, not structured), plugin security surface, two deployments                               | Short-term bridge only                                                                                 |
| External SaaS (Sanity / Strapi Cloud / Contentful)                              | Mature editors, assets/CDN, roles                                                                                                            | Foreign SaaS: personal-data and availability concerns under 152-ФЗ and sanctions risk for RU access/payments; recurring cost; vendor lock-in                                  | Not recommended for this owner                                                                         |

**Hardening for the hidden admin** (do not rely on obscurity): `routes.admin` set to an unguessable path; `X-Robots-Tag: noindex` plus `Disallow` for that path in robots; email+password with strong password policy, optional TOTP 2FA (or passkeys), login rate limiting and lockout (per IP and per account), session cookies `HttpOnly; Secure; SameSite=Lax`, CSRF protection, roles (owner/editor) and least privilege, an optional reverse-proxy IP allow-list or basic-auth in front of the admin route, audit log, daily database and media backups tested by restore, separate API tokens only if needed, dependency pinning and update routine. The current WordPress site exposes `wp-login.php`, an anonymous REST API with 354 routes and plugin endpoints (including `persona-agent/v1/*` POST routes); none of this should be carried over.

### 12.3 Hosting (owner decision)

Audience and operator are in Russia, so personal-data law (152-ФЗ: leads, cookies, localisation of Russian citizens' personal data) argues for hosting on a Russian VPS or cloud (Node or bun runtime behind nginx/Caddy, Postgres or SQLite with backups, S3-compatible object storage plus CDN for media and video, TLS) rather than assuming Vercel. Currently the domain/hosting is at nic.ru (RU-CENTER); a VDS/VPS from the same or another RU provider is the natural step. Flag as owner decision, with a lawyer's confirmation on consent text and policy.

### 12.4 Migration plan

1. **Export**: pages, areas, media via the public WP REST API (already proven anonymous and complete; `pages` and `areas` return full rendered Elementor HTML; teacher popups are in the team page HTML, since popups are `elementor_library` items that return 401). Transform with a script to the types in 6.2; hand-edit rich text.
2. **Media**: download referenced files (~700 items), transcode, upload to object storage; keep a WP-id → URL map.
3. **Redirects**: load the table in 9.5 plus the extras listed there into the Next.js `redirects()` or middleware.
4. **Parity checklist**: all 37 URLs (or redirect), titles/descriptions/canonicals, JSON-LD, footer legal documents, one unified lead form works (see decision below) and fires `lead`, `click_phone`, `click_telegram`, schedule widget renders, maps, cookie banner behaviour, social links, floating buttons, tariffs transcribed and approved, teachers (26) with bios, FAQ (7), studios x4 with corrected metro/hours, sitemap/robots, 404 page.
   - **Lead form decision (owner):** today there are two parallel paths, the visible Moyklass widget (all pages) and a hidden WordPress CF7 form (36 non-home pages, destination unknown, may bypass Moyklass). The rebuild should have a single lead form on every page (name, required phone, optional message, consent checkbox with a link to the privacy policy). Choose its destination: (a) keep embedding the Moyklass widget (client component loaded on view; keeps current `lead` goal logic), (b) a native form whose server route posts to the Moyklass API (needs an API key from the owner) so the layout and validation are under our control, or (c) email/CRM webhook as a fallback. Do not reproduce the CF7 form unless the owner confirms it was used.
5. **Phased rollout**: (a) build design system and static pages on a staging domain; (b) CMS and content import; (c) QA against the parity checklist and the performance targets; (d) lower DNS TTL, switch, keep WordPress read-only for 2-4 weeks, monitor Yandex Webmaster/Search Console for 404s and crawl errors; (e) decommission WP and remove exposed endpoints.

## 13. Unknown / needs owner input

- WP admin access: needed to read the exact Moyklass form fields, the Contact Form 7 form 730 settings (mail recipient and template, whether submissions are stored, why it is hidden), Elementor popups/templates (REST gives 401), ACF field definitions (REST returns empty `acf`), permalink override mechanism (the cause of `/studios/`, `/areas/`, `/районы/`, `/content/` prefixes), and menus.
- Lead routing: where hidden Contact Form 7 form 730 sends its mail (recipient address, possibly a mailbox nobody reads) and whether anyone ever received leads from it; whether the owner wants a single lead form and its destination (Moyklass widget, Moyklass API, email/CRM).
- Moyklass account: lead form field list and required fields (the Moyklass widget fields are rendered client-side and were not captured; only the "Ваше сообщение" textarea tweak is visible in the page script), whether CF7 leads reach Moyklass or only an inbox, integration with groups/directions, consent text, which widget ID renders which mount on /content/raspisanie/ (`SiteWidgetMoyklass65961` vs `130200`), whether a public schedule API/feed is available to render the schedule server-side and make it indexable.
- Yandex Metrika: goals configured inside the counter (besides `lead`, `click_phone`, `click_telegram`), whether Webvisor/ecommerce is used, access for Search/Webmaster data (traffic by URL, which old URLs have inbound links).
- Cookie/consent: confirmation of consent gating policy and the final banner texts; whether Metrika/Moyklass must load only after consent.
- Pricing: confirm the transcribed 2026/2027 price list (5.7), what applies to Пилатес, Для взрослых, Продленка, Семейная школа, events and Бокс; whether to publish prices as text.
- Studios: correct metro stations and opening hours (Багратионовская vs Солнцево; `пн-сб` vs `пн-вс с 11:00 до 20:00`), which phone belongs to which studio (+7 999 594-40-60 used on the Мичуринский page vs +7 925 150-87-38 elsewhere), which directions run in which studio, whether Профсоюзная 61 is at the venue "Культурный центр «Меридиан»" (the map card points to that organisation), 4th-studio photos.
- Who edits what and how often (news, schedule, prices, teachers, FAQ), whether multiple editors/roles are needed, whether the owner wants approval workflows/drafts.
- Which pages are stale: "Сальса и бачата" (empty), "Для взрослых" (copy of Barre text), unreferenced 2025 PDFs, empty "Новости" (no news items), `Новости` page being just social links; whether a real news section is wanted.
- "Семейная школа": whether it remains a separate Tilda site (`personaschool.tilda.ws`) or is integrated; whether `Продленка` and `Семейная школа` should be moved out of the "areas" content type.
- Teachers: which teacher teaches which direction and in which studio; permission to publish photos/bios (personal data) on the new site; whether 26 popups should become individual teacher URLs.
- Reviews: whether a local copy of Yandex/2GIS reviews is wanted (licence/terms) or the widget remains; alt texts and captions for 825 media items; whether older media (before 2026-01) exist elsewhere.
- Domain/hosting: access to nic.ru DNS and hosting, whether `www` and old paths are in use externally; hosting choice (section 12.3).
- The `persona-agent/v1` plugin: who built and uses it (purge, `branch4`, `acf-set`), whether any automation depends on it.
- Brand: spelling to use ("PersOna", "Persona", "PersonaModel") and the role of "модельное агентство" in the positioning (the home title still says "Детское модельное агентство и творческая студия").
- Legal: owner's current legal documents (offer/abonent contract, rules, privacy policy: page vs PDF versions), the footer PDFs are 0.9-5.8 MB each.
- 9 media records missing from the paginated API (page 8 returned 91 of 100 items), and 2026-08 uploads such as `stars_international_2026_polozhenie.pdf` that may not be in the retrieved list.
- A real browser measurement (Lighthouse/CrUX) was not performed; numbers here are from curl.

## 14. Appendix: data sources and refresh procedure

Collected on 2026-11-20 (local time UTC+7) with a generic browser User-Agent, sequential read-only GET/HEAD requests, no POST requests, and without touching `wp-admin` or `persona-agent/v1`.

| Source                                                                                                                                                                                                                                     | Description                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`                                                                                                                                                                                                                               | decompressed home page (542,012 B)                                                                                                                                                                                                                                                          |
| `html/01…40.html` + `manifest.tsv`                                                                                                                                                                                                         | every page, decompressed; manifest columns n, http status, gzip transfer bytes, TTFB s, total s, final URL, requested URL. Rows 1-37 = `urls.txt` (sitemap order: areas first, then pages), 38 = `/areas/` (redirected to `/brunches/`), 39 = `/studios/` (403), 40 = nonexistent URL (404) |
| `page-sitemap.xml`, `areas-sitemap.xml`, `sitemap.xml`, `robots.txt`, `headers.txt`                                                                                                                                                        | sitemaps, robots, homepage response headers                                                                                                                                                                                                                                                 |
| `wpjson.json`                                                                                                                                                                                                                              | WP REST index with 354 routes and namespaces                                                                                                                                                                                                                                                |
| `api/types.json`, `taxonomies.json`, `pages_1.json` (15 pages), `areas_1.json` (22 items), `categories_1.json`, `posts_1.json` (0), `tags_1.json` (0), `e-floating-buttons_1.json` (0), `elementor_library_1.json` (401), `media_1…9.json` | REST data; media pages 1-9 (`per_page=100`): 825 of the 834 items reported                                                                                                                                                                                                                  |
| Additional probes (read-only HEAD/GET)                                                                                                                                                                                                     | redirects and error behaviours in 3.2; combined CSS/JS fetched for size (home and area pages); price list JPEG (read visually); one search request; WP REST media pages 7-9 re-fetched because the original background job stopped after page 6                                             |

Method: text extracted with Python `html.parser` (stdlib) walking `<header>`, `<main>`/single-template body, `<footer>` and Elementor popups, emitting widget type, heading level, text, links, images, video lightbox URLs; JSON-LD parsed with `json`; Elementor `data-settings` decoded; menus rebuilt from nested `<ul>`; internal link scan over `<a href>` (scripts/styles stripped) against the 37 URLs; media statistics computed from `media_details.filesize` and `mime_type`; timings computed from the manifest (min/median/max over the 37 sitemap URLs).

Refresh procedure: re-run the sitemap fetch (`/sitemap_index.xml`), fetch each URL with `curl -sS --compressed -w` for timing, re-download `/wp-json/wp/v2/{pages,areas,media}?per_page=100&page=N` until `X-WP-TotalPages`, re-run the extractors, and regenerate the tables in sections 3, 5.13, 7, 9.5 and 11. After the rebuild goes live, the same crawl against the new site doubles as the parity check.
