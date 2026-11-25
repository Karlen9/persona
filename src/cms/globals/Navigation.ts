import {isLoggedIn} from '@/cms/access/roles';
import {publishedGlobalVersions} from '@/cms/fields/common';
import {linkFields} from '@/cms/fields/link';
import {staticPreview} from '@/cms/preview';

import type {ArrayField, GlobalConfig} from 'payload';

const navLinks = (name: string, label: string): ArrayField => ({
	name,
	type: 'array',
	label,
	labels: {singular: 'Ссылка', plural: 'Ссылки'},
	fields: linkFields({external: false})
});

export const Navigation: GlobalConfig = {
	slug: 'navigation',
	label: 'Навигация',
	admin: {preview: staticPreview('/'), group: 'Настройки'},
	access: {read: isLoggedIn, update: isLoggedIn},
	versions: publishedGlobalVersions,
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Главное меню',
					fields: [
						{
							name: 'mainNav',
							type: 'array',
							label: 'Пункты меню',
							labels: {singular: 'Пункт', plural: 'Пункты'},
							fields: [
								...linkFields({external: false}),
								navLinks('children', 'Выпадающее меню (простое)'),
								{
									name: 'columns',
									type: 'array',
									label: 'Выпадающее меню (колонки)',
									labels: {singular: 'Колонка', plural: 'Колонки'},
									fields: [
										{name: 'title', type: 'text', label: 'Заголовок колонки', required: true},
										navLinks('links', 'Ссылки')
									]
								},
								{
									name: 'allLink',
									type: 'group',
									label: 'Ссылка внизу меню',
									fields: linkFields({required: false, external: false})
								}
							]
						}
					]
				},
				{
					label: 'Подвал',
					fields: [
						{
							name: 'footerNav',
							type: 'array',
							label: 'Колонки подвала',
							labels: {singular: 'Колонка', plural: 'Колонки'},
							fields: [
								{name: 'title', type: 'text', label: 'Заголовок', required: true},
								{
									name: 'legal',
									type: 'checkbox',
									label: 'Юридические ссылки',
									defaultValue: false,
									admin: {description: 'Колонка остаётся видимой на телефонах.'}
								},
								navLinks('links', 'Ссылки')
							]
						}
					]
				},
				{
					label: 'Страница 404',
					fields: [navLinks('sectionLinks', 'Разделы на странице 404')]
				}
			]
		}
	]
};
