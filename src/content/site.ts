// Generated from the personamodel.ru crawl of 2026-11-20 by scripts/generate_ts.py.
// Copy is verbatim; fix it here (or in the CMS that replaces this module).

import type {TSite} from './types';

export const site: TSite = {
	// TODO(content): Brand spelling varies on the live site: «PersOna» (copy, og:site_name), «Persona» (titles), «PersonaModel» (titles/descriptions), «Persona - Art Center» (site title), «Творческий центр PersOna» (JSON-LD), «Т.Ц. PersOna» (price list), «ТЦ «Персона»» (privacy policy). Pick one.
	name: 'PersOna',
	cmsSiteName: 'Persona - Art Center',
	legalName: 'Творческий центр PersOna',
	url: 'https://personamodel.ru',
	lang: 'ru-RU',
	foundedYear: 2002,
	tagline: {
		title: 'Спасибо, что остаетесь с нами более 20 лет!',
		text: 'Мы готовим детей и подростков, и счастливы, что вместе делаем этот мир добрее, талантливее и красивее!'
	},
	email: 'personamodel@mail.ru',
	phones: [
		{
			display: '+7 (499) 393-30-05',
			tel: '+74993933005'
		},
		{
			display: '+7 (925) 150-87-38',
			tel: '+79251508738'
		},
		{
			display: '+7 (999) 594-40-60',
			tel: '+79995944060'
		}
	],
	logo: {
		src: '/media/brand/logo.png',
		width: 552,
		height: 275,
		alt: 'Persona Art Center'
	},
	favicon: {
		png: {
			src: '/media/brand/favicon.png',
			width: 54,
			height: 40,
			alt: 'Значок PersOna',
			altGenerated: true
		},
		svg: '/media/brand/favicon.svg'
	},
	defaultOgImage: {
		src: '/media/brand/og-default.jpg',
		width: 1536,
		height: 774,
		alt: 'PersOna — творческий центр',
		altGenerated: true
	},
	socials: [
		{
			kind: 'telegram',
			label: 'Telegram',
			url: 'https://t.me/personamp56'
		},
		{
			kind: 'vk',
			label: 'VK',
			url: 'https://vk.com/personamodelmoscow'
		},
		{
			kind: 'max',
			label: 'MAX',
			url: 'https://max.ru/id615422777189_biz'
		}
	],
	messengerButtons: [
		{
			kind: 'telegram',
			label: 'Telegram',
			url: 'https://t.me/PersonaRamenki'
		},
		{
			kind: 'vk',
			label: 'VK',
			url: 'https://vk.com/im/convo/-127439478?entrypoint=community_page&tab=all'
		},
		{
			kind: 'max',
			label: 'MAX',
			url: 'https://max.ru/u/f9LHodD0cOJdh8p7CvDStKuAkflx5QNgJMA_SWF7W8lH-LVLz97NcccMf6Y'
		}
	],
	moyklass: {
		lead: {
			widgetId: '01gGAHCMTHh6sF5MFhcE7tRjEqC2dNs2KhPj',
			mountId: 'SiteWidgetMoyklass130355'
		},
		schedule: {
			widgetId: '38IaRqAF2GUQSoxG3JaEonvxriufNPjJGx',
			mountIds: ['SiteWidgetMoyklass65961', 'SiteWidgetMoyklass130200']
		},
		api: {
			// TODO(content): fill with real Moyklass filial ids once known, e.g. {'1234': 'solntsevo'}.
			// Until then studios are matched by address keyword (see src/lib/moyklass/schedule.ts).
			filialStudio: {},
			classIds: [],
			courseIds: []
		}
	},
	metrika: {
		counterId: '112028433',
		goals: ['lead', 'click_phone', 'click_telegram']
	},
	yandex: {
		orgId: '165851817022',
		orgUrl: 'https://yandex.ru/maps/org/persona/165851817022/',
		ratingBadgeUrl: 'https://yandex.ru/sprav/widget/rating-badge/165851817022?type=rating',
		reviewsWidgetUrl: 'https://yandex.ru/maps-reviews-widget/165851817022?comments',
		reviewLink: 'https://yandex.ru/maps/-/CPeSuAn5'
	},
	twoGis: {
		reviewsUrl:
			'https://2gis.ru/moscow/branches/70000001048641482/firm/70000001048641490/37.485911%2C55.695559/tab/reviews?m=37.62017%2C55.753625%2F10.66',
		badge: {
			src: '/media/brand/2gis-reviews.jpg',
			width: 145,
			height: 45,
			alt: 'Отзывы на 2ГИС',
			altGenerated: true
		}
	},
	payment: {
		sbpUrl: 'https://qr.nspk.ru/AS1A002LFQ7JCAO09RJQV8EUTV4DV12N?type=01&bank=100000000284&crc=EEE0'
	},
	documents: [
		{
			id: 'subscription-agreement',
			title: 'Абонентский договор',
			href: '/docs/abonentskij-dogovor.pdf',
			sizeBytes: 1733025,
			oldPath: '/wp-content/uploads/2026/01/abonentskij-dogovor.pdf'
		},
		{
			id: 'rules-of-conduct',
			title: 'Правила поведения',
			href: '/docs/pravila-povedeniya.pdf',
			sizeBytes: 898125,
			oldPath: '/wp-content/uploads/2026/01/pravila-povedeniya.pdf'
		},
		{
			id: 'privacy-policy-pdf',
			title: 'Политика обработки персональных данных',
			href: '/docs/politika-personalnyh-dannyh.pdf',
			sizeBytes: 5829845,
			oldPath: '/wp-content/uploads/2026/01/politika-personalnyh-dannyh.pdf'
		}
	],
	cookieBanner: {
		title: 'Мы ценим вашу конфиденциальность',
		description:
			'Этот сайт, как и наш детский центр, заботится о вашем удобстве. Мы собираем технические данные (cookies), чтобы сайт не «тормозил», а вы быстро находили расписание и новости. Мы не передаем ваши данные посторонним и используем их только для улучшения работы сайта.\n\nНажимая «Принять», вы помогаете нам стать лучше 🤗',
		accept: 'Принять все',
		reject: 'Отказаться'
	},
	seo: {
		titleSuffix: ' - Persona - Art Center'
	}
};
