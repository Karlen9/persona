import {isLoggedIn} from '@/cms/access/roles';
import {cardItemFields, richTextField} from '@/cms/fields/blocks';
import {lastModifiedField, publishedGlobalVersions, textListField} from '@/cms/fields/common';
import {imageField} from '@/cms/fields/image';
import {linkGroup} from '@/cms/fields/link';
import {seoGroup} from '@/cms/fields/seo';
import {videosField} from '@/cms/fields/video';
import {touchGlobalLastModified} from '@/cms/hooks/lastModified';
import {staticPreview} from '@/cms/preview';

import type {GlobalConfig} from 'payload';

export const Home: GlobalConfig = {
	slug: 'home',
	label: 'Главная страница',
	admin: {preview: staticPreview('/'), group: 'Страницы'},
	access: {read: isLoggedIn, update: isLoggedIn},
	versions: publishedGlobalVersions,
	hooks: {beforeChange: [touchGlobalLastModified]},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Первый экран',
					fields: [
						{
							name: 'hero',
							type: 'group',
							label: 'Первый экран',
							fields: [
								{name: 'heading', type: 'text', label: 'Заголовок (для поисковиков)', required: true},
								textListField('headingLines', 'Строки заголовка'),
								{name: 'headingAccent', type: 'text', label: 'Выделенное слово'},
								{name: 'text', type: 'textarea', label: 'Текст', required: true},
								linkGroup('cta', 'Кнопка'),
								{
									name: 'socials',
									type: 'array',
									label: 'Соцсети',
									labels: {singular: 'Соцсеть', plural: 'Соцсети'},
									fields: [
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
									]
								},
								imageField('image', 'Фото')
							]
						}
					]
				},
				{
					label: 'Направления',
					fields: [
						{
							name: 'directions',
							type: 'group',
							label: 'Направления',
							fields: [
								{name: 'heading', type: 'text', label: 'Заголовок', required: true},
								{
									name: 'cards',
									type: 'array',
									label: 'Карточки направлений',
									labels: {singular: 'Карточка', plural: 'Карточки'},
									fields: [
										{
											name: 'direction',
											type: 'relationship',
											relationTo: 'directions',
											label: 'Направление',
											required: true
										},
										{name: 'title', type: 'text', label: 'Заголовок', required: true},
										textListField('bullets', 'Тезисы', true)
									]
								},
								{
									name: 'posterHeading',
									type: 'text',
									label: 'Заголовок ленты постеров',
									required: true
								},
								{name: 'posterAccent', type: 'text', label: 'Выделенное слово ленты', required: true},
								{
									name: 'posters',
									type: 'relationship',
									relationTo: 'directions',
									hasMany: true,
									label: 'Постеры в ленте (по порядку)'
								}
							]
						}
					]
				},
				{
					label: 'Блоки',
					fields: [
						{
							name: 'learn',
							type: 'group',
							label: 'Чему учим',
							fields: [
								{name: 'heading', type: 'text', label: 'Заголовок', required: true},
								{name: 'text', type: 'textarea', label: 'Текст', required: true},
								{
									name: 'list',
									type: 'array',
									label: 'Список',
									labels: {singular: 'Пункт', plural: 'Пункты'},
									fields: [richTextField('text', 'Текст')]
								},
								linkGroup('cta', 'Кнопка'),
								imageField('image', 'Фото', {required: true})
							]
						},
						{name: 'advantagesHeading', type: 'text', label: 'Заголовок преимуществ', required: true},
						{
							name: 'advantages',
							type: 'array',
							label: 'Преимущества',
							labels: {singular: 'Преимущество', plural: 'Преимущества'},
							fields: cardItemFields()
						},
						{
							name: 'performances',
							type: 'group',
							label: 'Выступления',
							fields: [
								{name: 'anchor', type: 'text', label: 'Якорь', required: true},
								{name: 'heading', type: 'text', label: 'Заголовок', required: true},
								{name: 'subheading', type: 'text', label: 'Подзаголовок', required: true},
								{name: 'moreLabel', type: 'text', label: 'Подпись кнопки «Ещё»', required: true},
								videosField()
							]
						},
						{
							name: 'studio',
							type: 'group',
							label: 'Студия',
							fields: [
								{name: 'heading', type: 'text', label: 'Заголовок', required: true},
								imageField('photos', 'Фотографии', {hasMany: true})
							]
						},
						{
							name: 'gallery',
							type: 'group',
							label: 'Галерея',
							fields: [
								{name: 'heading', type: 'text', label: 'Заголовок', required: true},
								{name: 'subheading', type: 'text', label: 'Подзаголовок', required: true},
								{
									name: 'tabs',
									type: 'array',
									label: 'Вкладки',
									labels: {singular: 'Вкладка', plural: 'Вкладки'},
									fields: [
										{name: 'key', type: 'text', label: 'Идентификатор', required: true},
										{name: 'label', type: 'text', label: 'Название', required: true},
										imageField('images', 'Фотографии', {hasMany: true}),
										videosField()
									]
								}
							]
						},
						{
							name: 'cta',
							type: 'group',
							label: 'Блок заявки',
							fields: [
								{name: 'anchorId', type: 'text', label: 'Якорь', required: true},
								{name: 'heading', type: 'text', label: 'Заголовок', required: true},
								linkGroup('button', 'Кнопка'),
								imageField('image', 'Фото')
							]
						}
					]
				},
				{label: 'SEO', fields: [seoGroup()]}
			]
		},
		lastModifiedField
	]
};
