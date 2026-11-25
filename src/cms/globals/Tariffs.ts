import {isLoggedIn} from '@/cms/access/roles';
import {lastModifiedField, oldPathsField, publishedGlobalVersions, textListField} from '@/cms/fields/common';
import {imageField} from '@/cms/fields/image';
import {linkGroup} from '@/cms/fields/link';
import {seoGroup} from '@/cms/fields/seo';
import {touchGlobalLastModified} from '@/cms/hooks/lastModified';
import {staticPreview} from '@/cms/preview';

import type {GlobalConfig} from 'payload';

export const Tariffs: GlobalConfig = {
	slug: 'tariffs',
	label: 'Тарифы',
	admin: {preview: staticPreview('/tarify/'), group: 'Страницы'},
	access: {read: isLoggedIn, update: isLoggedIn},
	versions: publishedGlobalVersions,
	hooks: {beforeChange: [touchGlobalLastModified]},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Прейскурант',
					fields: [
						{name: 'h1', type: 'text', label: 'Заголовок страницы (H1)', required: true},
						{
							name: 'priceList',
							type: 'group',
							label: 'Прейскурант',
							fields: [
								{name: 'title', type: 'text', label: 'Заголовок', required: true},
								{name: 'season', type: 'text', label: 'Сезон', required: true},
								{name: 'approvedBy', type: 'text', label: 'Кто утвердил', required: true},
								{
									name: 'trialLesson',
									type: 'group',
									label: 'Пробное занятие',
									admin: {description: 'Цена также показывается на обложке журнала.'},
									fields: [
										{name: 'label', type: 'text', label: 'Название', required: true},
										{name: 'priceRub', type: 'number', label: 'Цена, ₽', required: true}
									]
								},
								{
									name: 'groups',
									type: 'array',
									label: 'Таблицы цен',
									labels: {singular: 'Таблица', plural: 'Таблицы'},
									fields: [
										{
											name: 'groupId',
											type: 'select',
											label: 'Тип',
											required: true,
											options: [
												{label: 'Групповые занятия', value: 'group'},
												{label: 'Индивидуальные занятия', value: 'individual'}
											]
										},
										{name: 'title', type: 'text', label: 'Заголовок', required: true},
										{
											name: 'currencyPrinted',
											type: 'checkbox',
											label: 'Показывать знак ₽',
											defaultValue: false
										},
										{
											name: 'columns',
											type: 'array',
											label: 'Колонки',
											labels: {singular: 'Колонка', plural: 'Колонки'},
											fields: [
												{name: 'label', type: 'text', label: 'Название', required: true},
												{name: 'lessons', type: 'number', label: 'Занятий', required: true}
											]
										},
										{
											name: 'rows',
											type: 'array',
											label: 'Строки',
											labels: {singular: 'Строка', plural: 'Строки'},
											fields: [
												{name: 'key', type: 'text', label: 'Идентификатор', required: true},
												{name: 'label', type: 'text', label: 'Название', required: true},
												{
													name: 'directions',
													type: 'relationship',
													relationTo: 'directions',
													hasMany: true,
													label: 'Направления',
													admin: {
														description: 'Пусто, если у строки нет страницы направления.'
													}
												},
												{
													name: 'prices',
													type: 'array',
													label: 'Цены',
													labels: {singular: 'Цена', plural: 'Цены'},
													admin: {description: 'По порядку колонок; пусто — прочерк.'},
													fields: [{name: 'value', type: 'number', label: 'Цена, ₽'}]
												},
												{name: 'note', type: 'text', label: 'Примечание'}
											]
										}
									]
								},
								textListField('notes', 'Примечания', true),
								imageField('image', 'Прейскурант картинкой', {required: true})
							]
						}
					]
				},
				{
					label: 'Скидки и оплата',
					fields: [
						{
							name: 'discounts',
							type: 'array',
							label: 'Скидки',
							labels: {singular: 'Скидка', plural: 'Скидки'},
							fields: [
								{name: 'key', type: 'text', label: 'Идентификатор', required: true},
								{name: 'percent', type: 'number', label: 'Процент', required: true},
								{name: 'text', type: 'textarea', label: 'Условие', required: true}
							]
						},
						{
							name: 'freePayment',
							type: 'group',
							label: 'Свободная оплата',
							fields: [
								{name: 'heading', type: 'text', label: 'Заголовок', required: true},
								{name: 'text', type: 'textarea', label: 'Текст', required: true},
								linkGroup('button', 'Кнопка')
							]
						}
					]
				},
				{label: 'SEO', fields: [seoGroup()]}
			]
		},
		oldPathsField,
		lastModifiedField
	]
};
