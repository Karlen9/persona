// Generated from the personamodel.ru crawl of 2026-11-20 by scripts/generate_ts.py.
// Copy is verbatim; fix it here (or in the CMS that replaces this module).

import type {TStudio} from './types';

export const studios: TStudio[] = [
	{
		// TODO(content): Мичуринский проспект 56: studio page and site footer disagree (metro: page «м. Раменки» vs footer «м. Мичуринский проспект»; hours: page «пн-сб по расписанию» vs footer «пн-вс по расписанию»; phones: page +74993933005, +79995944060 vs footer +74993933005, +79251508738). Kept the studio page values.
		id: 'michurinskiy-prospekt',
		slug: 'michurinskiy-prospekt',
		wpId: 1001,
		path: '/studii/michurinskiy-prospekt/',
		name: 'СТУДИЯ М. МИЧУРИНСКИЙ ПРОСПЕКТ/РАМЕНКИ',
		shortName: 'Мичуринский проспект 56',
		address: 'г. Москва, Мичуринский проспект 56 (ЖК «Небо»)',
		metro: ['м. Раменки'],
		hours: 'пн-сб по расписанию',
		phones: ['+74993933005', '+79995944060'],
		email: 'personamodel@mail.ru',
		mapLink: 'https://yandex.ru/maps/-/CPAUADMD',
		mapEmbedUrl:
			'https://yandex.ru/map-widget/v1/?ll=37.485727%2C55.695510&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgo0MTk1NjgwMjkzEkfQoNC-0YHRgdC40Y8sINCc0L7RgdC60LLQsCwg0JzQuNGH0YPRgNC40L3RgdC60LjQuSDQv9GA0L7RgdC_0LXQutGCLCA1NiIKDWLxFUIVNMheQg%2C%2C&z=17.65',
		geo: {
			lat: 55.69551,
			lon: 37.485727
		},
		photos: [
			{
				src: '/media/studios/michurinskiy-prospekt-1.webp',
				width: 487,
				height: 657,
				alt: 'Студия PersOna, Мичуринский проспект 56: фото 1',
				altGenerated: true
			},
			{
				src: '/media/studios/michurinskiy-prospekt-2.webp',
				width: 498,
				height: 663,
				alt: 'Студия PersOna, Мичуринский проспект 56: фото 2',
				altGenerated: true
			},
			{
				src: '/media/studios/michurinskiy-prospekt-3.webp',
				width: 492,
				height: 645,
				alt: 'Студия PersOna, Мичуринский проспект 56: фото 3',
				altGenerated: true
			}
		],
		seo: {
			title: 'Студия для детей у м. Мичуринский проспект (Раменки) | PersonaModel',
			description:
				'Творческая студия PersOna у метро Мичуринский проспект / Раменки: расписание, схема проезда, адрес Мичуринский проспект, 56. Запись: +7 (499) 393-30-05.'
		},
		order: 1,
		oldPaths: ['/content/studiya-michurinskiy/'],
		lastModified: '2026-02-03T20:47:56Z'
	},
	{
		// TODO(content): Богданова 19: studio page and site footer disagree (metro: page «м. Багратионовская» vs footer «м. Солнцево»; hours: page «пн-сб по расписанию» vs footer «пн-вс с 11:00 до 20:00 по расписанию»). Kept the studio page values.
		id: 'solntsevo',
		slug: 'solntsevo',
		wpId: 1030,
		path: '/studii/solntsevo/',
		name: 'СТУДИЯ М. Солнцево',
		shortName: 'Богданова 19',
		address: 'улица Богданова, 19, Москва',
		metro: ['м. Багратионовская'],
		hours: 'пн-сб по расписанию',
		phones: ['+74993933005', '+79251508738'],
		email: 'personamodel@mail.ru',
		mapLink: 'https://yandex.ru/maps/-/CPAcnYlt',
		mapEmbedUrl:
			'https://yandex.ru/map-widget/v1/?ll=37.393335%2C55.652898&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NjY1NzY3ORI90KDQvtGB0YHQuNGPLCDQnNC-0YHQutCy0LAsINGD0LvQuNGG0LAg0JHQvtCz0LTQsNC90L7QstCwLCAxOSIKDcaSFUIVkZxeQg%2C%2C&z=17.65',
		geo: {
			lat: 55.652898,
			lon: 37.393335
		},
		photos: [
			{
				src: '/media/studios/solntsevo-1.webp',
				width: 960,
				height: 1280,
				alt: 'Студия PersOna, Богданова 19: фото 1',
				altGenerated: true
			},
			{
				src: '/media/studios/solntsevo-2.webp',
				width: 960,
				height: 1280,
				alt: 'Студия PersOna, Богданова 19: фото 2',
				altGenerated: true
			},
			{
				src: '/media/studios/solntsevo-3.jpg',
				width: 1280,
				height: 853,
				alt: 'Студия PersOna, Богданова 19: фото 3',
				altGenerated: true
			}
		],
		seo: {
			// TODO(content): Богданова 19: the live meta description is a broken auto-extract of the contact block («АДРЕС: … МоскваБЛИЖАЙШАЯ СТАНЦИЯ МЕТРО…»); kept verbatim, needs a hand-written one.
			title: 'СТУДИЯ М. Солнцево - Persona - Art Center',
			description:
				'АДРЕС: улица Богданова, 19, МоскваБЛИЖАЙШАЯ СТАНЦИЯ МЕТРО: м. БагратионовскаяТЕЛЕФОН: +74993933005, +79251508738,e-mail: personamodel@mail.ruРЕЖИМ'
		},
		order: 2,
		oldPaths: ['/content/studiya-solntsevo/'],
		lastModified: '2026-02-04T09:05:52Z'
	},
	{
		// TODO(content): Нежинская 11: studio page and site footer disagree (hours: page «пн-сб по расписанию» vs footer «пн-вс с 11:00 до 20:00 по расписанию»). Kept the studio page values.
		id: 'slavyanskiy-bulvar',
		slug: 'slavyanskiy-bulvar',
		wpId: 946,
		path: '/studii/slavyanskiy-bulvar/',
		name: 'СТУДИЯ М. СЛАВЯНСКИЙ БУЛЬВАР',
		shortName: 'Нежинская 11',
		address: 'Нежинская улица, 11, Москва',
		metro: ['м. Славянский бульвар'],
		hours: 'пн-сб по расписанию',
		phones: ['+74993933005', '+79251508738'],
		email: 'personamodel@mail.ru',
		mapLink: 'https://yandex.ru/maps/-/CPAcjGyV',
		mapEmbedUrl:
			'https://yandex.ru/map-widget/v1/?indoorLevel=1&ll=37.473339%2C55.707811&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NjY4MTg2ORI90KDQvtGB0YHQuNGPLCDQnNC-0YHQutCy0LAsINCd0LXQttC40L3RgdC60LDRjyDRg9C70LjRhtCwLCAxMSIKDbTkFUIVzdReQg%2C%2C&z=17.65',
		geo: {
			lat: 55.707811,
			lon: 37.473339
		},
		photos: [
			{
				src: '/media/studios/slavyanskiy-bulvar-1.webp',
				width: 1280,
				height: 781,
				alt: 'Студия PersOna, Нежинская 11: фото 1',
				altGenerated: true
			},
			{
				src: '/media/studios/slavyanskiy-bulvar-2.jpg',
				width: 1280,
				height: 960,
				alt: 'Студия PersOna, Нежинская 11: фото 2',
				altGenerated: true
			},
			{
				src: '/media/studios/slavyanskiy-bulvar-3.webp',
				width: 886,
				height: 1280,
				alt: 'Студия PersOna, Нежинская 11: фото 3',
				altGenerated: true
			}
		],
		seo: {
			title: 'Творческая студия для детей у м. Славянский бульвар | PersonaModel',
			description:
				'Творческая студия PersOna у метро Славянский бульвар: расписание занятий, схема проезда, адрес Нежинская ул., 11. Запись на сайте или по +7 (499) 393-30-05.'
		},
		order: 3,
		oldPaths: ['/content/studiya-slavyan/'],
		lastModified: '2026-02-03T20:46:55Z'
	},
	{
		// TODO(content): The map/organisation link points to the host venue «Культурный центр «Меридиан»», not to PersOna itself; geo is the map centre of that embed.
		id: 'profsoyuznaya',
		slug: 'profsoyuznaya',
		wpId: 6677,
		path: '/studii/profsoyuznaya/',
		name: 'СТУДИЯ М. КАЛУЖСКАЯ / ПРОФСОЮЗНАЯ',
		shortName: 'Профсоюзная 61',
		address: 'ул. Профсоюзная, д. 61, Москва',
		metro: ['м. Калужская', 'м. Воронцовская'],
		hours: 'пн-вс по расписанию',
		phones: ['+74993933005', '+79251508738'],
		email: 'personamodel@mail.ru',
		mapLink: 'https://yandex.ru/maps/org/kulturny_tsentr_meridian/1010597830/',
		mapEmbedUrl: 'https://yandex.ru/map-widget/v1/?ol=biz&oid=1010597830&ll=37.542500%2C55.656702&z=16',
		geo: {
			lat: 55.656702,
			lon: 37.5425
		},
		photos: [
			{
				src: '/media/studios/profsoyuznaya-1.jpg',
				width: 1024,
				height: 684,
				alt: 'Профсоюзная 61 — фасад'
			},
			{
				src: '/media/studios/profsoyuznaya-2.jpg',
				width: 750,
				height: 457,
				alt: 'Профсоюзная 61 — холл'
			},
			{
				src: '/media/studios/profsoyuznaya-3.jpg',
				width: 1024,
				height: 696,
				alt: 'Профсоюзная 61 — зал'
			}
		],
		seo: {
			// TODO(content): Профсоюзная 61: the live meta description is a broken auto-extract of the contact block («АДРЕС: … МоскваБЛИЖАЙШАЯ СТАНЦИЯ МЕТРО…»); kept verbatim, needs a hand-written one.
			title: 'СТУДИЯ М. КАЛУЖСКАЯ / ПРОФСОЮЗНАЯ - Persona - Art Center',
			description:
				'АДРЕС: ул. Профсоюзная, д. 61, МоскваБЛИЖАЙШАЯ СТАНЦИЯ МЕТРО: м. Калужская, м. ВоронцовскаяТЕЛЕФОН: +74993933005, +79251508738,e-mail:'
		},
		order: 4,
		oldPaths: ['/content/studiya-profsoyuznaya/'],
		lastModified: '2026-08-21T16:54:27Z'
	}
];
