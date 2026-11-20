// Generated from the personamodel.ru crawl of 2026-11-20 by scripts/generate_ts.py.
// Copy is verbatim; fix it here (or in the CMS that replaces this module).

import type {TPriceList, TTariffsPage} from './types';

export const tariffsPage: TTariffsPage = {
	path: '/tarify/',
	h1: 'Тарифы',
	priceList: {
		// TODO(content): The price list is published only as a JPEG; these numbers are a transcription of that image and must be confirmed by the owner. Row labels keep the printed typos («АРТ-МАССТЕРСКАЯ», «ПРОГРАМИРОВАНИЕ», «1 ЗАНЯТИЯ»). Pilates, «Для взрослых», «Продлёнка», «Семейная школа» have no row; «БОКС» has a row but no direction page; the 4-lesson «Мегавольт» tier is quoted without 8/12-lesson tiers.
		title: 'ПРЕЙСКУРАНТ 2026/2027',
		season: '2026/2027',
		approvedBy: 'Утверждаю /Комарова Н.Ю./ Руководитель Т.Ц. PersOna',
		trialLesson: {
			label: 'ПРОБНОЕ ГРУППОВОЕ ЗАНЯТИЕ (ПРИ ПОСЕЩЕНИИ НАПРАВЛЕНИЯ ВПЕРВЫЕ)',
			priceRub: 1500
		},
		groups: [
			{
				id: 'group',
				title: 'ГРУППОВЫЕ ЗАНЯТИЯ',
				currencyPrinted: true,
				columns: [
					{
						label: '4 ЗАНЯТИЯ/МЕС',
						lessons: 4
					},
					{
						label: '8 ЗАНЯТИЙ/МЕС',
						lessons: 8
					},
					{
						label: '12 ЗАНЯТИЙ/МЕС',
						lessons: 12
					}
				],
				rows: [
					{
						id: 'shkola-modeley',
						label: 'ШКОЛА МОДЕЛЕЙ',
						directionSlugs: ['shkola-modeley'],
						prices: [8500, 11500, 17000]
					},
					{
						id: 'teatralnaya-studiya',
						label: 'ТЕАТРАЛЬНАЯ СТУДИЯ',
						directionSlugs: ['teatr'],
						prices: [8500, 11500, null]
					},
					{
						id: 'vokalnaya-studiya',
						label: 'ВОКАЛЬНАЯ СТУДИЯ',
						directionSlugs: ['vokal'],
						prices: [8500, 11500, null]
					},
					{
						id: 'studiya-tanca',
						label: 'СТУДИЯ ТАНЦА',
						directionSlugs: ['tancy'],
						prices: [8500, 11500, null]
					},
					{
						id: 'risovanie-art-masterskaya',
						label: 'РИСОВАНИЕ/АРТ-МАСТЕРСКАЯ',
						directionSlugs: ['risovanie', 'art-masterskaya'],
						prices: [8500, 11500, null]
					},
					{
						id: 'art-massterskaya',
						label: 'АРТ-МАССТЕРСКАЯ',
						directionSlugs: ['art-masterskaya'],
						prices: [8500, 11500, null]
					},
					{
						id: 'shahmaty',
						label: 'ШАХМАТЫ',
						directionSlugs: ['shahmaty'],
						prices: [8500, 11500, null]
					},
					{
						id: 'yazykovaya-shkola',
						label: 'ЯЗЫКОВАЯ ШКОЛА',
						directionSlugs: ['yazykovaya-shkola'],
						prices: [8500, 11500, null]
					},
					{
						id: 'podgotovka-k-shkole',
						label: 'ПОДГОТОВКА К ШКОЛЕ',
						directionSlugs: ['podgotovka-k-shkole'],
						prices: [8500, 11500, null]
					},
					{
						id: 'joga',
						label: 'ЙОГА',
						directionSlugs: ['joga'],
						prices: [8500, 11500, 17000]
					},
					{
						id: 'bachata-salsa',
						label: 'БАЧАТА/САЛЬСА',
						directionSlugs: ['bachata'],
						prices: [8500, 11500, null]
					},
					{
						id: 'barre',
						label: 'БАРРЭ',
						directionSlugs: ['barre-fitnes'],
						prices: [8500, 11500, null]
					},
					{
						id: 'megavolt',
						label: 'ИНЖЕНЕРНЫЙ КУРС «МЕГАВОЛЬТ»',
						directionSlugs: ['megavolt'],
						prices: [11500, null, null]
					},
					{
						id: 'robototehnika',
						label: 'РОБОТОТЕХНИКА/ПРОГРАМИРОВАНИЕ/ВИДЕОПРОФИ',
						directionSlugs: ['robototehnika'],
						prices: [8500, 11500, null]
					}
				]
			},
			{
				id: 'individual',
				title: 'ИНДИВИДУАЛЬНЫЕ ЗАНЯТИЯ',
				currencyPrinted: false,
				columns: [
					{
						label: '1 ЗАНЯТИЯ',
						lessons: 1
					},
					{
						label: '4 ЗАНЯТИЯ',
						lessons: 4
					},
					{
						label: '8 ЗАНЯТИЙ',
						lessons: 8
					}
				],
				rows: [
					{
						id: 'shkola-modeley',
						label: 'ШКОЛА МОДЕЛЕЙ',
						directionSlugs: ['shkola-modeley'],
						prices: [4000, 14000, 28000]
					},
					{
						id: 'teatralnaya-studiya',
						label: 'ТЕАТРАЛЬНАЯ СТУДИЯ',
						directionSlugs: ['teatr'],
						prices: [4000, 14000, 28000]
					},
					{
						id: 'vokalnaya-studiya',
						label: 'ВОКАЛЬНАЯ СТУДИЯ',
						directionSlugs: ['vokal'],
						prices: [4000, 14000, 28000]
					},
					{
						id: 'studiya-tanca',
						label: 'СТУДИЯ ТАНЦА',
						directionSlugs: ['tancy'],
						prices: [4000, 14000, 28000]
					},
					{
						id: 'risovanie-art-masterskaya',
						label: 'РИСОВАНИЕ/АРТ-МАСТЕРСКАЯ',
						directionSlugs: ['risovanie', 'art-masterskaya'],
						prices: [4000, 14000, 28000]
					},
					{
						id: 'megavolt',
						label: 'ИНЖЕНЕРНЫЙ КУРС «МЕГАВОЛЬТ»',
						directionSlugs: ['megavolt'],
						prices: [4000, 14000, 28000]
					},
					{
						id: 'shahmaty',
						label: 'ШАХМАТЫ',
						directionSlugs: ['shahmaty'],
						prices: [4000, 14000, 28000]
					},
					{
						id: 'yazykovaya-shkola',
						label: 'ЯЗЫКОВАЯ ШКОЛА',
						directionSlugs: ['yazykovaya-shkola'],
						prices: [4000, 14000, 28000]
					},
					{
						id: 'podgotovka-k-shkole',
						label: 'ПОДГОТОВКА К ШКОЛЕ',
						directionSlugs: ['podgotovka-k-shkole'],
						prices: [4000, 14000, 28000]
					},
					{
						id: 'joga',
						label: 'ЙОГА',
						directionSlugs: ['joga'],
						prices: [4000, 14000, 28000]
					},
					{
						id: 'bachata-salsa',
						label: 'БАЧАТА/САЛЬСА (СОЦИАЛЬНЫЕ ТАНЦЫ)',
						directionSlugs: ['bachata'],
						prices: [5000, 18000, 36000]
					},
					{
						id: 'barre',
						label: 'БАРРЭ',
						directionSlugs: ['barre-fitnes'],
						prices: [4000, 14000, 28000]
					},
					{
						id: 'robototehnika',
						label: 'РОБОТОТЕХНИКА/ПРОГРАМИРО/ВИДЕОПРОФ',
						directionSlugs: ['robototehnika'],
						prices: [5000, 18000, 36000]
					},
					{
						id: 'logoped',
						label: 'ЛОГОПЕД',
						directionSlugs: ['logoped'],
						prices: [4000, 14000, 28000]
					},
					{
						id: 'boks',
						label: 'БОКС',
						directionSlugs: [],
						prices: [5000, 18000, 36000]
					}
				]
			}
		],
		notes: ['! ТАРИФ "ДУЭТ" Рассчитывается как индивидуальный абонемент за минусом 20 % с человека'],
		image: {
			src: '/media/pricing/prejskurant-2026-2027.jpg',
			width: 1815,
			height: 2560,
			alt: 'Прейскурант 2026/2027'
		}
	},
	discounts: [
		{
			id: 'second-direction',
			percent: 15,
			text: 'скидка 15% — на второе направление или второго ребёнка из одной семьи при покупке группового абонемента'
		},
		{
			id: 'third-direction',
			percent: 30,
			text: 'скидка 30% — на третье направление или третьего ребёнка из одной семьи при покупке группового абонемента'
		},
		{
			id: 'duet',
			percent: 20,
			text: 'ТАРИФ "ДУЭТ" Рассчитывается как индивидуальный абонемент за минусом 20 % с человека'
		}
	],
	freePayment: {
		heading: 'Поле свободной оплаты',
		text: 'Данное поле предназначено для формирования индивидуальных оплат. Используйте после согласования с администратором.',
		button: {
			label: 'Оплатить',
			href: 'https://qr.nspk.ru/AS1A002LFQ7JCAO09RJQV8EUTV4DV12N?type=01&bank=100000000284&crc=EEE0'
		}
	},
	seo: {
		title: 'Тарифы - Persona - Art Center',
		description:
			'Тарифы творческого центра Persona в Москве: абонементы и занятия. Актуальные условия уточняйте у администратора.'
	},
	oldPaths: ['/tarify/'],
	lastModified: '2026-02-25T22:33:03Z'
};

export const priceList: TPriceList = tariffsPage.priceList;
