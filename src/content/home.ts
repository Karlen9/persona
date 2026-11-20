// Generated from the personamodel.ru crawl of 2026-11-20 by scripts/generate_ts.py.
// Copy is verbatim; fix it here (or in the CMS that replaces this module).

import type {THome} from './types';

export const home: THome = {
	path: '/',
	hero: {
		// TODO(content): hero photo picked during the rebuild from the gallery; owner to confirm or replace.
		image: {
			src: '/media/gallery/persona-gal-tancy-a1437.jpg',
			width: 1536,
			height: 1024,
			alt: 'Галерея Persona — танцы — A1437'
		},
		heading: 'Всё для гармоничного развития детей и взрослых в одном месте',
		headingLines: ['Всё для', 'гармоничного развития детей и взрослых в одном месте'],
		headingAccent: 'детей и взрослых в одном месте',
		text: '20+ премиум-направлений от лучших педагогов! Инвестируйте время в развитие — экономьте на логистике — получайте результат',
		cta: {
			label: 'Записаться на консультацию',
			href: '#form'
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
		]
	},
	directions: {
		heading: 'Наши направления',
		cards: [
			{
				slug: 'shkola-modeley',
				title: 'Школа моделей',
				bullets: [
					'Дефиле / фотопозирование',
					'Танец',
					'Актёрское мастерство',
					'Этикет',
					'Стилистика / самопрезентация',
					'Основы правильного питания'
				]
			},
			{
				slug: 'tancy',
				title: 'Танцы',
				bullets: [
					'Хип-хоп',
					'Контемп',
					'Джаз-фанк',
					'K-pop',
					'Брейк-данс',
					'Хай-хилз',
					'Вау-данс (для самых маленьких)'
				]
			},
			{
				slug: 'yazykovaya-shkola',
				title: 'Языковая школа',
				bullets: [
					'Английский язык',
					'Французский язык',
					'Итальянский язык',
					'Испанский язык',
					'Португальский язык',
					'Китайский язык',
					'Арабский язык'
				]
			},
			{
				slug: 'teatr',
				title: 'Театр',
				bullets: [
					'Актёрское мастерство',
					'Сценическая речь',
					'Сценическое движение',
					'Постановка этюдов, спектаклей',
					'Опыт на сцене'
				]
			},
			{
				slug: 'shahmaty',
				title: 'Шахматы',
				bullets: [
					'Логика и память',
					'Усидчивость и концентрация',
					'Стратегическое мышление',
					'Принятие решений',
					'Нацеленность на результат'
				]
			},
			{
				slug: 'podgotovka-k-shkole',
				title: 'ПОДГОТОВКА К ШКОЛЕ',
				bullets: [
					'Обучение грамоте и чтение',
					'Математика и логика',
					'Развитие речи и кругозора',
					'Постановка руки и подготовка к письму',
					'Психологическая готовность'
				]
			},
			{
				slug: 'vokal',
				title: 'Вокальная студия',
				bullets: [
					'Постановка голоса и дыхания',
					'Расширение вокального диапазона',
					'Подбор песенного материала',
					'Работа с микрофоном',
					'Опыт студийной записи',
					'Подбор сценического образа'
				]
			}
		],
		posterHeading: 'Наши направления',
		posterAccent: 'PersOna',
		posterSlugs: [
			'vokal',
			'tancy',
			'shkola-modeley',
			'risovanie',
			'joga',
			'logoped',
			'megavolt',
			'art-masterskaya',
			'muzykalnye-instrumenty',
			'yazykovaya-shkola',
			'prodlenka',
			'semejnaya-shkola',
			'barre-fitnes',
			'teatr',
			'shahmaty',
			'podgotovka-k-shkole'
		]
	},
	learn: {
		heading: 'Мы не просто обучаем - мы растим победителей!',
		text: 'Мы учитываем возраст, уровень подготовки и характер каждого ученика.',
		list: [
			{
				text: 'Профессионалы отбора — мы нанимаем только лучших'
			},
			{
				text: 'Синхронизация расписания — удобно для детей и родителей'
			},
			{
				text: 'Концентрация качества — 20+ топ направлений в одном месте'
			},
			{
				text: 'Ваш персональный менеджер — один контакт для всех вопросов'
			}
		],
		cta: {
			label: 'Получить консультацию',
			href: '#form'
		},
		image: {
			src: '/media/home/learn.jpg',
			width: 549,
			height: 525,
			alt: 'Преподаватель с учениками на занятии',
			altGenerated: true
		}
	},
	advantagesHeading: 'Наши преимущества',
	advantages: [
		{
			title: 'Прозрачность для родителей',
			text: 'Онлайн-видеонаблюдение за занятиями в реальном времени',
			image: {
				src: '/media/home/advantages-1.webp',
				width: 1536,
				height: 1024,
				alt: 'Онлайн-видеонаблюдение за занятиями: мониторы с трансляцией из залов',
				altGenerated: true
			}
		},
		{
			title: 'Регулярные выступления',
			text: 'Участие в топовых конкурсах и фестивалях в России и за рубежом',
			image: {
				src: '/media/home/advantages-2.webp',
				width: 1280,
				height: 853,
				alt: 'Регулярные выступления: педагог измеряет рост мальчика, дети аплодируют',
				altGenerated: true
			}
		},
		{
			title: 'Пробное занятие',
			text: 'Помогаем определить направление, в котором ребёнок раскроется',
			image: {
				src: '/media/home/advantages-3.webp',
				width: 1280,
				height: 853,
				alt: 'Пробное занятие: педагог и мальчик',
				altGenerated: true
			}
		},
		{
			title: 'Жёсткий отбор педагогов',
			text: 'Только практикующие специалисты с подтверждёнными результатами',
			image: {
				src: '/media/home/advantages-4.webp',
				width: 1280,
				height: 732,
				alt: 'Жёсткий отбор педагогов: собеседование с кандидатами',
				altGenerated: true
			}
		},
		{
			title: 'Творческие сборы и интенсивы',
			text: 'Погружение, рост и новые навыки в формате лагерей и выездов',
			image: {
				src: '/media/home/advantages-5.webp',
				width: 1280,
				height: 853,
				alt: 'Творческие сборы и интенсивы: мальчик с медалью',
				altGenerated: true
			}
		},
		{
			title: 'Соотношение цены и качества',
			text: 'Оптимальная стоимость занятий без ущерба качеству обучения',
			image: {
				src: '/media/home/advantages-6.webp',
				width: 1536,
				height: 1024,
				alt: 'Соотношение цены и качества: дети с копилкой и монетами',
				altGenerated: true
			}
		}
	],
	performances: {
		anchor: 'vistuplenia',
		heading: 'Наши выступления',
		subheading: 'Ученики',
		moreLabel: 'Смотреть далее',
		videos: [
			{
				src: 'https://personamodel.ru/wp-content/uploads/2026/02/instories_921b05ed-c484-47fe-a63f-0ac5eca61d1f.mov',
				mimeType: 'video/quicktime',
				sizeBytes: 187289906,
				poster: {
					src: '/media/posters/persona-vist-56c053b.jpg',
					width: 1080,
					height: 1920,
					alt: 'Кадр из видео выступления 1',
					altGenerated: true
				}
			},
			{
				src: 'https://personamodel.ru/wp-content/uploads/2026/02/instories_a09d9aae-147a-4109-8663-3242d2bc33b2-1.mov',
				mimeType: 'video/quicktime',
				sizeBytes: 56518853,
				poster: {
					src: '/media/posters/persona-vist-3dd579a.jpg',
					width: 1080,
					height: 1920,
					alt: 'Кадр из видео выступления 2',
					altGenerated: true
				}
			},
			{
				src: 'https://personamodel.ru/wp-content/uploads/2026/08/persona-vist-bffc365.mp4',
				mimeType: 'video/mp4',
				sizeBytes: 17019371,
				poster: {
					src: '/media/posters/persona-vist-bffc365.jpg',
					width: 720,
					height: 1280,
					alt: 'Кадр из видео выступления 3',
					altGenerated: true
				}
			},
			{
				src: 'https://personamodel.ru/wp-content/uploads/2026/02/instories_0dd7ce77-4721-4c9d-9804-13656f6da633.mov',
				mimeType: 'video/quicktime',
				sizeBytes: 145796413,
				poster: {
					src: '/media/posters/persona-vist-b73727f.jpg',
					width: 1080,
					height: 1920,
					alt: 'Кадр из видео выступления 4',
					altGenerated: true
				}
			},
			{
				src: 'https://personamodel.ru/wp-content/uploads/2026/08/3132911871239949869-1-1.mp4',
				mimeType: 'video/mp4',
				sizeBytes: 6359326,
				poster: {
					src: '/media/posters/persona-vist-0d4f460.jpg',
					width: 720,
					height: 1280,
					alt: 'Кадр из видео выступления 5',
					altGenerated: true
				}
			},
			{
				src: 'https://personamodel.ru/wp-content/uploads/2026/02/437034809785243464.mp4',
				mimeType: 'video/mp4',
				sizeBytes: 38897704,
				poster: {
					src: '/media/posters/persona-vist-1b6ba76.jpg',
					width: 1080,
					height: 1920,
					alt: 'Кадр из видео выступления 6',
					altGenerated: true
				}
			}
		]
	},
	studio: {
		heading: 'Наша студия',
		photos: [
			{
				src: '/media/home/img-5572-1.webp',
				width: 424,
				height: 566,
				alt: 'Фотография студии PersOna',
				altGenerated: true
			},
			{
				src: '/media/home/img-5574-1.webp',
				width: 425,
				height: 567,
				alt: 'Фотография студии PersOna',
				altGenerated: true
			},
			{
				src: '/media/home/img-5578-1.webp',
				width: 425,
				height: 567,
				alt: 'Фотография студии PersOna',
				altGenerated: true
			},
			{
				src: '/media/home/img-5579-1.webp',
				width: 425,
				height: 566,
				alt: 'Фотография студии PersOna',
				altGenerated: true
			},
			{
				src: '/media/home/img-5573-1.webp',
				width: 424,
				height: 566,
				alt: 'Фотография студии PersOna',
				altGenerated: true
			},
			{
				src: '/media/home/img-5575-1.webp',
				width: 425,
				height: 567,
				alt: 'Фотография студии PersOna',
				altGenerated: true
			},
			{
				src: '/media/home/img-5577-1.webp',
				width: 425,
				height: 567,
				alt: 'Фотография студии PersOna',
				altGenerated: true
			},
			{
				src: '/media/home/img-5576-1.webp',
				width: 425,
				height: 566,
				alt: 'Фотография студии PersOna',
				altGenerated: true
			}
		]
	},
	gallery: {
		heading: 'Жизнь нашего творческого центра в кадрах',
		subheading: 'PersOna',
		tabs: [
			{
				id: 'dance',
				label: 'Танцы',
				images: [
					{
						src: '/media/gallery/img-3617.webp',
						width: 1536,
						height: 1024,
						alt: 'Фото из галереи «Танцы»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-4062.webp',
						width: 1536,
						height: 1025,
						alt: 'Фото из галереи «Танцы»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-5500.webp',
						width: 1536,
						height: 1025,
						alt: 'Фото из галереи «Танцы»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-5516.webp',
						width: 1536,
						height: 1025,
						alt: 'Фото из галереи «Танцы»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-5517.webp',
						width: 1536,
						height: 1024,
						alt: 'Фото из галереи «Танцы»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-9561.webp',
						width: 563,
						height: 389,
						alt: 'Фото из галереи «Танцы»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-9565.webp',
						width: 563,
						height: 381,
						alt: 'Фото из галереи «Танцы»',
						altGenerated: true
					},
					{
						src: '/media/gallery/persona-gal-tancy-a1345.jpg',
						width: 1536,
						height: 1024,
						alt: 'Галерея Persona — танцы — A1345'
					},
					{
						src: '/media/gallery/persona-gal-tancy-a1437.jpg',
						width: 1536,
						height: 1024,
						alt: 'Галерея Persona — танцы — A1437'
					},
					{
						src: '/media/gallery/persona-gal-tancy-a1442.jpg',
						width: 1280,
						height: 853,
						alt: 'Галерея Persona — танцы — A1442'
					},
					{
						src: '/media/gallery/persona-gal-tancy-a1603.jpg',
						width: 1280,
						height: 853,
						alt: 'Галерея Persona — танцы — A1603'
					},
					{
						src: '/media/gallery/persona-gal-tancy-img-4296.jpg',
						width: 1536,
						height: 1024,
						alt: 'Галерея Persona — танцы — IMG_4296'
					}
				],
				videos: []
			},
			{
				id: 'vocal',
				label: 'Вокал',
				images: [
					{
						src: '/media/gallery/img-5482.webp',
						width: 660,
						height: 450,
						alt: 'Фото из галереи «Вокал»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-5484.webp',
						width: 660,
						height: 469,
						alt: 'Фото из галереи «Вокал»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-5493.webp',
						width: 640,
						height: 427,
						alt: 'Фото из галереи «Вокал»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-5495.webp',
						width: 1536,
						height: 1025,
						alt: 'Фото из галереи «Вокал»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-5503.webp',
						width: 1536,
						height: 1025,
						alt: 'Фото из галереи «Вокал»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-5504.webp',
						width: 1536,
						height: 1025,
						alt: 'Фото из галереи «Вокал»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-9564.webp',
						width: 563,
						height: 422,
						alt: 'Фото из галереи «Вокал»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-9570-1.webp',
						width: 563,
						height: 381,
						alt: 'Фото из галереи «Вокал»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-9573.webp',
						width: 563,
						height: 377,
						alt: 'Фото из галереи «Вокал»',
						altGenerated: true
					},
					{
						src: '/media/gallery/persona-gal-vokal-a1490.jpg',
						width: 1280,
						height: 853,
						alt: 'Галерея Persona — вокал — A1490'
					},
					{
						src: '/media/gallery/persona-gal-vokal-a1567.jpg',
						width: 1280,
						height: 853,
						alt: 'Галерея Persona — вокал — A1567'
					},
					{
						src: '/media/gallery/persona-gal-vokal-a1601.jpg',
						width: 1280,
						height: 853,
						alt: 'Галерея Persona — вокал — A1601'
					}
				],
				videos: []
			},
			{
				id: 'theatre',
				label: 'Театр',
				images: [
					{
						src: '/media/gallery/img-4032.webp',
						width: 1536,
						height: 1024,
						alt: 'Фото из галереи «Театр»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-4038.webp',
						width: 1536,
						height: 1024,
						alt: 'Фото из галереи «Театр»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-4040.webp',
						width: 1536,
						height: 1024,
						alt: 'Фото из галереи «Театр»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-4049.webp',
						width: 1536,
						height: 1024,
						alt: 'Фото из галереи «Театр»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-4050.webp',
						width: 1536,
						height: 1024,
						alt: 'Фото из галереи «Театр»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-4291.webp',
						width: 1536,
						height: 1024,
						alt: 'Фото из галереи «Театр»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-4769.webp',
						width: 1536,
						height: 1024,
						alt: 'Фото из галереи «Театр»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-9575.webp',
						width: 563,
						height: 394,
						alt: 'Фото из галереи «Театр»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-9576.webp',
						width: 563,
						height: 401,
						alt: 'Фото из галереи «Театр»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-9577.webp',
						width: 563,
						height: 383,
						alt: 'Фото из галереи «Театр»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-9579.webp',
						width: 563,
						height: 377,
						alt: 'Фото из галереи «Театр»',
						altGenerated: true
					},
					{
						src: '/media/gallery/persona-gal-teatr-a1674.jpg',
						width: 1280,
						height: 853,
						alt: 'Галерея Persona — театр — A1674'
					}
				],
				videos: []
			},
			{
				id: 'fashion',
				label: 'Мода',
				images: [
					{
						src: '/media/gallery/img-0646.webp',
						width: 365,
						height: 230,
						alt: 'Фото из галереи «Мода»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-5364.webp',
						width: 1536,
						height: 1025,
						alt: 'Фото из галереи «Мода»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-5379.webp',
						width: 563,
						height: 392,
						alt: 'Фото из галереи «Мода»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-8909.webp',
						width: 1536,
						height: 1025,
						alt: 'Фото из галереи «Мода»',
						altGenerated: true
					},
					{
						src: '/media/gallery/persona-gal-moda-5j3b9247.jpg',
						width: 1536,
						height: 974,
						alt: 'Галерея Persona — мода — 5J3B9247'
					},
					{
						src: '/media/gallery/persona-gal-moda-img-1059.jpg',
						width: 1125,
						height: 756,
						alt: 'Галерея Persona — мода — IMG_1059'
					},
					{
						src: '/media/gallery/persona-gal-moda-img-2456.jpg',
						width: 1125,
						height: 749,
						alt: 'Галерея Persona — мода — IMG_2456'
					},
					{
						src: '/media/gallery/persona-gal-moda-img-5877.jpg',
						width: 1125,
						height: 822,
						alt: 'Галерея Persona — мода — IMG_5877'
					},
					{
						src: '/media/gallery/persona-gal-moda-img-8925.jpg',
						width: 1536,
						height: 1024,
						alt: 'Галерея Persona — мода — IMG_8925'
					},
					{
						src: '/media/gallery/persona-gal-moda-ls4b4830.jpg',
						width: 1280,
						height: 853,
						alt: 'Галерея Persona — мода — LS4B4830'
					},
					{
						src: '/media/gallery/persona-gal-moda-ls4b4853.jpg',
						width: 1280,
						height: 853,
						alt: 'Галерея Persona — мода — LS4B4853'
					},
					{
						src: '/media/gallery/persona-gal-moda-foto-7.jpg',
						width: 1536,
						height: 1024,
						alt: 'Галерея Persona — мода — фото (7)'
					}
				],
				videos: []
			},
			{
				id: 'achievements',
				label: 'Достижения',
				images: [
					{
						src: '/media/gallery/img-9570.webp',
						width: 563,
						height: 376,
						alt: 'Фото из галереи «Достижения»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-9571.webp',
						width: 1536,
						height: 1024,
						alt: 'Фото из галереи «Достижения»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-9631.webp',
						width: 563,
						height: 557,
						alt: 'Фото из галереи «Достижения»',
						altGenerated: true
					},
					{
						src: '/media/gallery/2026-02-19-09-44-27.webp',
						width: 563,
						height: 376,
						alt: 'Фото из галереи «Достижения»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-1552.webp',
						width: 563,
						height: 389,
						alt: 'Фото из галереи «Достижения»',
						altGenerated: true
					},
					{
						src: '/media/gallery/img-1553.webp',
						width: 563,
						height: 373,
						alt: 'Фото из галереи «Достижения»',
						altGenerated: true
					},
					{
						src: '/media/gallery/persona-gal-dostizheniya-1.jpg',
						width: 1280,
						height: 854,
						alt: 'Галерея Persona — достижения — 1'
					},
					{
						src: '/media/gallery/persona-gal-dostizheniya-2026-08-23-14-49-01.jpg',
						width: 1170,
						height: 914,
						alt: 'Галерея Persona — достижения — 2026-08-23 14-49-01'
					},
					{
						src: '/media/gallery/persona-gal-dostizheniya-2026-08-23-14-55-32.jpg',
						width: 1280,
						height: 958,
						alt: 'Галерея Persona — достижения — 2026-08-23 14-55-32'
					},
					{
						src: '/media/gallery/persona-gal-dostizheniya-sma-5868.jpg',
						width: 1536,
						height: 1024,
						alt: 'Галерея Persona — достижения — SMA_5868'
					},
					{
						src: '/media/gallery/persona-gal-dostizheniya-sma-6164.jpg',
						width: 1536,
						height: 1024,
						alt: 'Галерея Persona — достижения — SMA_6164'
					},
					{
						src: '/media/gallery/persona-gal-dostizheniya-sok-1569.jpg',
						width: 1536,
						height: 1024,
						alt: 'Галерея Persona — достижения — SOK_1569'
					}
				],
				videos: []
			},
			{
				// TODO(content): The live tab «Фотопроекты» holds 9 videos (3 «izobrazhenie…» clips + 6 persona-vid-foto); the audit assumed 6. The «Ученики» carousel above has its own 6 videos.
				id: 'photoprojects',
				label: 'Фотопроекты',
				images: [],
				videos: [
					{
						src: 'https://personamodel.ru/wp-content/uploads/2026/02/instories_4792d113-99c6-4138-97a8-cea4dc49d001.mov',
						mimeType: 'video/quicktime',
						sizeBytes: 17433285,
						poster: {
							src: '/media/posters/gallery-photoprojects-video-1.webp',
							width: 864,
							height: 1536,
							alt: 'Кадр из видео: Фотопроекты',
							altGenerated: true
						}
					},
					{
						src: 'https://personamodel.ru/wp-content/uploads/2026/02/instories_058c1676-2835-4184-87f2-d1caa34be924.mov',
						mimeType: 'video/quicktime',
						sizeBytes: 16257602,
						poster: {
							src: '/media/posters/gallery-photoprojects-video-2.webp',
							width: 864,
							height: 1536,
							alt: 'Кадр из видео: Фотопроекты',
							altGenerated: true
						}
					},
					{
						src: 'https://personamodel.ru/wp-content/uploads/2026/02/instories_e8990abe-ac55-485a-a873-406e1d628856.mov',
						mimeType: 'video/quicktime',
						sizeBytes: 17836804,
						poster: {
							src: '/media/posters/gallery-photoprojects-video-3.webp',
							width: 864,
							height: 1536,
							alt: 'Кадр из видео: Фотопроекты',
							altGenerated: true
						}
					},
					{
						src: 'https://personamodel.ru/wp-content/uploads/2026/08/persona-vid-foto-01.mp4',
						mimeType: 'video/mp4',
						sizeBytes: 2191768,
						poster: {
							src: '/media/posters/gallery-photoprojects-video-4.jpg',
							width: 704,
							height: 1280,
							alt: 'Кадр из видео: Фотопроекты',
							altGenerated: true
						}
					},
					{
						src: 'https://personamodel.ru/wp-content/uploads/2026/08/persona-vid-foto-02.mp4',
						mimeType: 'video/mp4',
						sizeBytes: 1689760,
						poster: {
							src: '/media/posters/gallery-photoprojects-video-5.jpg',
							width: 720,
							height: 1280,
							alt: 'Кадр из видео: Фотопроекты',
							altGenerated: true
						}
					},
					{
						src: 'https://personamodel.ru/wp-content/uploads/2026/08/persona-vid-foto-03.mp4',
						mimeType: 'video/mp4',
						sizeBytes: 9270094,
						poster: {
							src: '/media/posters/gallery-photoprojects-video-6.jpg',
							width: 480,
							height: 848,
							alt: 'Кадр из видео: Фотопроекты',
							altGenerated: true
						}
					},
					{
						src: 'https://personamodel.ru/wp-content/uploads/2026/08/persona-vid-foto-04.mp4',
						mimeType: 'video/mp4',
						sizeBytes: 3529313,
						poster: {
							src: '/media/posters/gallery-photoprojects-video-7.jpg',
							width: 720,
							height: 1280,
							alt: 'Кадр из видео: Фотопроекты',
							altGenerated: true
						}
					},
					{
						src: 'https://personamodel.ru/wp-content/uploads/2026/08/persona-vid-foto-05.mp4',
						mimeType: 'video/mp4',
						sizeBytes: 2465151,
						poster: {
							src: '/media/posters/gallery-photoprojects-video-8.jpg',
							width: 848,
							height: 1280,
							alt: 'Кадр из видео: Фотопроекты',
							altGenerated: true
						}
					},
					{
						src: 'https://personamodel.ru/wp-content/uploads/2026/08/persona-vid-foto-06.mp4',
						mimeType: 'video/mp4',
						sizeBytes: 5126024,
						poster: {
							src: '/media/posters/gallery-photoprojects-video-9.jpg',
							width: 720,
							height: 1280,
							alt: 'Кадр из видео: Фотопроекты',
							altGenerated: true
						}
					}
				]
			},
			{
				id: 'holidays',
				label: 'Праздники',
				images: [],
				videos: [
					{
						src: 'https://personamodel.ru/wp-content/uploads/2026/08/persona-vid-prazd-01.mp4',
						mimeType: 'video/mp4',
						sizeBytes: 9210493,
						poster: {
							src: '/media/posters/gallery-holidays-video-1.jpg',
							width: 480,
							height: 848,
							alt: 'Кадр из видео: Праздники',
							altGenerated: true
						}
					},
					{
						src: 'https://personamodel.ru/wp-content/uploads/2026/08/persona-vid-prazd-02.mp4',
						mimeType: 'video/mp4',
						sizeBytes: 40066935,
						poster: {
							src: '/media/posters/gallery-holidays-video-2.jpg',
							width: 720,
							height: 1280,
							alt: 'Кадр из видео: Праздники',
							altGenerated: true
						}
					},
					{
						src: 'https://personamodel.ru/wp-content/uploads/2026/08/persona-vid-prazd-03.mp4',
						mimeType: 'video/mp4',
						sizeBytes: 13708863,
						poster: {
							src: '/media/posters/gallery-holidays-video-3.jpg',
							width: 1072,
							height: 1920,
							alt: 'Кадр из видео: Праздники',
							altGenerated: true
						}
					},
					{
						src: 'https://personamodel.ru/wp-content/uploads/2026/08/persona-vid-prazd-04.mp4',
						mimeType: 'video/mp4',
						sizeBytes: 17803546,
						poster: {
							src: '/media/posters/gallery-holidays-video-4.jpg',
							width: 720,
							height: 1280,
							alt: 'Кадр из видео: Праздники',
							altGenerated: true
						}
					},
					{
						src: 'https://personamodel.ru/wp-content/uploads/2026/08/persona-vid-prazd-05.mp4',
						mimeType: 'video/mp4',
						sizeBytes: 2958956,
						poster: {
							src: '/media/posters/gallery-holidays-video-5.jpg',
							width: 720,
							height: 1280,
							alt: 'Кадр из видео: Праздники',
							altGenerated: true
						}
					},
					{
						src: 'https://personamodel.ru/wp-content/uploads/2026/08/persona-vid-prazd-06.mp4',
						mimeType: 'video/mp4',
						sizeBytes: 41735867,
						poster: {
							src: '/media/posters/gallery-holidays-video-6.jpg',
							width: 1080,
							height: 1920,
							alt: 'Кадр из видео: Праздники',
							altGenerated: true
						}
					}
				]
			}
		]
	},
	cta: {
		anchorId: 'consult-form',
		heading: 'Запишитесь на бесплатную консультацию',
		button: {
			label: 'Записаться',
			href: '#form'
		},
		image: {
			src: '/media/home/consultation-bg.webp',
			width: 1536,
			height: 1024,
			alt: 'Фоновое изображение: участницы детского показа мод на подиуме',
			altGenerated: true
		}
	},
	seo: {
		// TODO(content): Home meta/og/twitter description says «…4 студии, работаем более 10 лет», the page body says «более 20 лет» / «20+» (and the footer «более 20 лет»); pick one figure. The hero also claims «20+ премиум-направлений» while the site lists 21 direction pages.
		title: 'Детское модельное агентство и творческая студия в Москве — PersOna',
		description:
			'Детское модельное агентство и творческая студия PersonaModel в Москве: школа моделей, танцы, вокал, театр, рисование. 4 студии, работаем более 10 лет.'
	},
	lastModified: '2026-08-24T07:14:10Z'
};
