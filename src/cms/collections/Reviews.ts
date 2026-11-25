import {contentAccess} from '@/cms/access/roles';
import {publishedVersions} from '@/cms/fields/common';

import type {CollectionConfig} from 'payload';

export const Reviews: CollectionConfig = {
	slug: 'reviews',
	labels: {singular: 'Отзыв', plural: 'Отзывы'},
	admin: {
		group: 'Контент',
		useAsTitle: 'author',
		defaultColumns: ['author', 'source', 'rating', 'date'],
		listSearchableFields: ['author', 'text']
	},
	defaultSort: '-date',
	access: contentAccess,
	versions: publishedVersions,
	fields: [
		{name: 'author', type: 'text', label: 'Автор', required: true},
		{
			name: 'source',
			type: 'select',
			label: 'Источник',
			required: true,
			defaultValue: 'manual',
			options: [
				{label: 'Яндекс Карты', value: 'yandex'},
				{label: '2ГИС', value: '2gis'},
				{label: 'Вручную', value: 'manual'}
			]
		},
		{name: 'rating', type: 'number', label: 'Оценка', min: 1, max: 5},
		{name: 'text', type: 'textarea', label: 'Текст отзыва', required: true},
		{name: 'date', type: 'date', label: 'Дата'},
		{name: 'url', type: 'text', label: 'Ссылка на отзыв'},
		{
			name: 'key',
			type: 'text',
			label: 'Идентификатор',
			unique: true,
			index: true,
			admin: {position: 'sidebar', description: 'Необязательно; по умолчанию используется номер записи.'}
		}
	]
};
