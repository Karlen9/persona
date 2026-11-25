import {isLoggedIn} from '@/cms/access/roles';
import {publishedGlobalVersions} from '@/cms/fields/common';
import {imageField} from '@/cms/fields/image';
import {staticPreview} from '@/cms/preview';

import type {Field, GlobalConfig} from 'payload';

const socialFields = (): Field[] => [
	{
		name: 'kind',
		type: 'select',
		label: 'Мессенджер',
		required: true,
		options: [
			{label: 'Telegram', value: 'telegram'},
			{label: 'ВКонтакте', value: 'vk'},
			{label: 'MAX', value: 'max'}
		]
	},
	{name: 'label', type: 'text', label: 'Название', required: true},
	{name: 'url', type: 'text', label: 'Адрес', required: true}
];

export const SiteSettings: GlobalConfig = {
	slug: 'site-settings',
	label: 'Настройки сайта',
	admin: {preview: staticPreview('/'), group: 'Настройки'},
	access: {read: isLoggedIn, update: isLoggedIn},
	versions: publishedGlobalVersions,
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Бренд',
					fields: [
						{name: 'name', type: 'text', label: 'Название бренда', required: true},
						{name: 'cmsSiteName', type: 'text', label: 'Название сайта в WordPress', required: true},
						{name: 'legalName', type: 'text', label: 'Юридическое название', required: true},
						{name: 'url', type: 'text', label: 'Адрес сайта', required: true},
						{name: 'lang', type: 'text', label: 'Язык', required: true, defaultValue: 'ru-RU'},
						{name: 'foundedYear', type: 'number', label: 'Год основания', required: true},
						{
							name: 'tagline',
							type: 'group',
							label: 'Слоган в подвале',
							fields: [
								{name: 'title', type: 'text', label: 'Заголовок', required: true},
								{name: 'text', type: 'textarea', label: 'Текст', required: true}
							]
						},
						imageField('logo', 'Логотип', {required: true}),
						{
							name: 'favicon',
							type: 'group',
							label: 'Значок сайта',
							fields: [
								imageField('png', 'PNG', {required: true}),
								{name: 'svg', type: 'text', label: 'Путь к SVG', required: true}
							]
						},
						imageField('defaultOgImage', 'Картинка для соцсетей по умолчанию', {required: true}),
						{
							name: 'seo',
							type: 'group',
							label: 'SEO',
							fields: [{name: 'titleSuffix', type: 'text', label: 'Суффикс заголовка', required: true}]
						}
					]
				},
				{
					label: 'Контакты',
					fields: [
						{name: 'email', type: 'email', label: 'E-mail', required: true},
						{
							name: 'phones',
							type: 'array',
							label: 'Телефоны',
							labels: {singular: 'Телефон', plural: 'Телефоны'},
							fields: [
								{
									name: 'display',
									type: 'text',
									label: 'Как показывать',
									required: true,
									admin: {description: '+7 (499) 393-30-05'}
								},
								{
									name: 'tel',
									type: 'text',
									label: 'Для звонка',
									required: true,
									admin: {description: '+74993933005'}
								}
							]
						},
						{
							name: 'socials',
							type: 'array',
							label: 'Соцсети (значки)',
							labels: {singular: 'Соцсеть', plural: 'Соцсети'},
							fields: socialFields()
						},
						{
							name: 'messengerButtons',
							type: 'array',
							label: 'Кнопки мессенджеров',
							labels: {singular: 'Кнопка', plural: 'Кнопки'},
							admin: {description: 'Плавающие кнопки и кнопки «Задать вопрос».'},
							fields: socialFields()
						}
					]
				},
				{
					label: 'Интеграции',
					fields: [
						{
							name: 'moyklass',
							type: 'group',
							label: 'МойКласс',
							fields: [
								{
									name: 'lead',
									type: 'group',
									label: 'Форма заявки',
									fields: [
										{name: 'widgetId', type: 'text', label: 'ID виджета', required: true},
										{name: 'mountId', type: 'text', label: 'ID контейнера', required: true}
									]
								},
								{
									name: 'schedule',
									type: 'group',
									label: 'Расписание',
									fields: [
										{name: 'widgetId', type: 'text', label: 'ID виджета', required: true},
										{name: 'mountIds', type: 'text', hasMany: true, label: 'ID контейнеров'}
									]
								},
								{
									name: 'api',
									type: 'group',
									label: 'REST API',
									admin: {description: 'Ключ API хранится в переменных окружения, не здесь.'},
									fields: [
										{
											name: 'filialStudio',
											type: 'array',
											label: 'Филиал → студия',
											labels: {singular: 'Соответствие', plural: 'Соответствия'},
											fields: [
												{
													name: 'filialId',
													type: 'text',
													label: 'ID филиала МойКласс',
													required: true
												},
												{name: 'studioSlug', type: 'text', label: 'Slug студии', required: true}
											]
										},
										{name: 'classIds', type: 'number', hasMany: true, label: 'Разрешённые классы'},
										{name: 'courseIds', type: 'number', hasMany: true, label: 'Разрешённые курсы'}
									]
								}
							]
						},
						{
							name: 'metrika',
							type: 'group',
							label: 'Яндекс Метрика',
							fields: [
								{name: 'counterId', type: 'text', label: 'Номер счётчика', required: true},
								{name: 'goals', type: 'text', hasMany: true, label: 'Цели'}
							]
						},
						{
							name: 'yandex',
							type: 'group',
							label: 'Яндекс Карты',
							fields: [
								{name: 'orgId', type: 'text', label: 'ID организации', required: true},
								{name: 'orgUrl', type: 'text', label: 'Страница организации', required: true},
								{name: 'ratingBadgeUrl', type: 'text', label: 'Виджет рейтинга', required: true},
								{name: 'reviewsWidgetUrl', type: 'text', label: 'Виджет отзывов', required: true},
								{name: 'reviewLink', type: 'text', label: 'Ссылка «Оставить отзыв»', required: true}
							]
						},
						{
							name: 'twoGis',
							type: 'group',
							label: '2ГИС',
							fields: [
								{name: 'reviewsUrl', type: 'text', label: 'Страница отзывов', required: true},
								imageField('badge', 'Значок', {required: true})
							]
						},
						{
							name: 'payment',
							type: 'group',
							label: 'Оплата',
							fields: [{name: 'sbpUrl', type: 'text', label: 'Ссылка СБП', required: true}]
						}
					]
				},
				{
					label: 'Документы и cookies',
					fields: [
						{
							name: 'documents',
							type: 'array',
							label: 'Документы',
							labels: {singular: 'Документ', plural: 'Документы'},
							fields: [
								{name: 'key', type: 'text', label: 'Идентификатор', required: true},
								{name: 'title', type: 'text', label: 'Название', required: true},
								{name: 'href', type: 'text', label: 'Путь к файлу', required: true},
								{name: 'sizeBytes', type: 'number', label: 'Размер, байт', required: true},
								{
									name: 'oldPath',
									type: 'text',
									label: 'Старый путь',
									required: true,
									admin: {readOnly: true, description: 'Данные миграции со старого сайта.'}
								}
							]
						},
						{
							name: 'cookieBanner',
							type: 'group',
							label: 'Баннер cookies',
							fields: [
								{name: 'title', type: 'text', label: 'Заголовок', required: true},
								{name: 'description', type: 'textarea', label: 'Текст', required: true},
								{name: 'accept', type: 'text', label: 'Кнопка «Принять»', required: true},
								{name: 'reject', type: 'text', label: 'Кнопка «Отказаться»', required: true}
							]
						}
					]
				}
			]
		}
	]
};
