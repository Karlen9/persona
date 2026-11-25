import {isLoggedIn} from '@/cms/access/roles';
import {publishedGlobalVersions} from '@/cms/fields/common';
import {staticPreview} from '@/cms/preview';

import type {GlobalConfig} from 'payload';

export const Cover: GlobalConfig = {
	slug: 'cover',
	label: 'Обложка журнала',
	admin: {
		preview: staticPreview('/'),
		group: 'Страницы',
		description: 'Оглавление и главная тема обложки на главной странице.'
	},
	access: {read: isLoggedIn, update: isLoggedIn},
	versions: publishedGlobalVersions,
	fields: [
		{
			name: 'entries',
			type: 'array',
			label: 'Разделы на обложке',
			labels: {singular: 'Раздел', plural: 'Разделы'},
			fields: [
				{
					name: 'entryId',
					type: 'select',
					label: 'Раздел',
					required: true,
					options: [
						{label: 'Направления', value: 'napravleniya'},
						{label: 'Студии', value: 'studii'},
						{label: 'Расписание', value: 'raspisanie'},
						{label: 'Цены', value: 'tarify'},
						{label: 'О центре', value: 'o-nas'}
					]
				},
				{
					name: 'slot',
					type: 'select',
					label: 'Колонка',
					required: true,
					options: [
						{label: 'Правая', value: 'right'},
						{label: 'Левая нижняя', value: 'left'}
					]
				},
				{name: 'number', type: 'text', label: 'Номер', required: true},
				{name: 'label', type: 'text', label: 'Название', required: true},
				{
					name: 'headline',
					type: 'text',
					label: 'Заголовок',
					admin: {
						description: 'Для раздела «Цены» заголовок собирается из цены пробного занятия в тарифах.',
						condition: (_data, siblingData) => siblingData?.entryId !== 'tarify'
					},
					validate: (value: unknown, {siblingData}: {siblingData: {entryId?: string}}) =>
						siblingData?.entryId === 'tarify' || (typeof value === 'string' && value.length > 0)
							? true
							: 'Укажите заголовок'
				},
				{name: 'teaser', type: 'text', label: 'Анонс', required: true},
				{name: 'href', type: 'text', label: 'Ссылка', required: true},
				{name: 'page', type: 'number', label: 'Номер страницы журнала', required: true}
			]
		},
		{
			name: 'story',
			type: 'group',
			label: 'Главная тема',
			fields: [
				{name: 'kicker', type: 'text', label: 'Надпись над заголовком', required: true},
				{name: 'titleLine1', type: 'text', label: 'Заголовок, строка 1', required: true},
				{name: 'titleLine2', type: 'text', label: 'Заголовок, строка 2', required: true},
				{name: 'teaser', type: 'text', label: 'Анонс', required: true},
				{name: 'href', type: 'text', label: 'Ссылка', required: true},
				{name: 'page', type: 'number', label: 'Номер страницы журнала', required: true}
			]
		}
	]
};
