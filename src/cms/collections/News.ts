import {contentAccess} from '@/cms/access/roles';
import {blocksField} from '@/cms/fields/blocks';
import {publishedVersions, slugField} from '@/cms/fields/common';
import {imageField} from '@/cms/fields/image';

import type {CollectionConfig} from 'payload';

export const News: CollectionConfig = {
	slug: 'news',
	labels: {singular: 'Новость', plural: 'Новости'},
	admin: {
		group: 'Контент',
		useAsTitle: 'title',
		defaultColumns: ['title', 'publishedAt'],
		listSearchableFields: ['title', 'slug']
	},
	defaultSort: '-publishedAt',
	access: contentAccess,
	versions: publishedVersions,
	fields: [
		{name: 'title', type: 'text', label: 'Заголовок', required: true},
		{name: 'excerpt', type: 'textarea', label: 'Краткое описание', required: true},
		imageField('cover', 'Обложка'),
		blocksField('body', 'Текст новости', true),
		{
			name: 'publishedAt',
			type: 'date',
			label: 'Дата публикации',
			required: true,
			admin: {position: 'sidebar', date: {pickerAppearance: 'dayAndTime'}}
		},
		slugField('Адрес новости латиницей.'),
		{
			name: 'key',
			type: 'text',
			label: 'Идентификатор',
			unique: true,
			index: true,
			admin: {position: 'sidebar', description: 'Необязательно; по умолчанию совпадает со slug.'}
		}
	]
};
