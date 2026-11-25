import {isLoggedIn} from '@/cms/access/roles';
import {publishedGlobalVersions} from '@/cms/fields/common';
import {linkFields, linkGroup} from '@/cms/fields/link';

import type {GlobalConfig} from 'payload';

export const DirectionTemplate: GlobalConfig = {
	slug: 'direction-template',
	label: 'Шаблон страницы направления',
	admin: {group: 'Настройки', description: 'Элементы, одинаковые на всех страницах направлений.'},
	access: {read: isLoggedIn, update: isLoggedIn},
	versions: publishedGlobalVersions,
	fields: [
		linkGroup('cta', 'Кнопка «Записаться»'),
		linkGroup('scheduleButton', 'Кнопка «Расписание»'),
		{
			name: 'navLinks',
			type: 'array',
			label: 'Ссылки под статьёй',
			labels: {singular: 'Ссылка', plural: 'Ссылки'},
			fields: linkFields()
		},
		{
			name: 'related',
			type: 'group',
			label: 'Блок «Дополнительные направления»',
			fields: [
				{name: 'heading', type: 'text', label: 'Заголовок', required: true},
				{name: 'subheading', type: 'text', label: 'Подзаголовок', required: true},
				{
					name: 'directions',
					type: 'relationship',
					relationTo: 'directions',
					hasMany: true,
					label: 'Направления'
				}
			]
		}
	]
};
