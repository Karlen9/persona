import {contentAccess} from '@/cms/access/roles';
import {
	lastModifiedField,
	oldPathsField,
	orderField,
	publishedVersions,
	slugField,
	wpIdField
} from '@/cms/fields/common';
import {imageField} from '@/cms/fields/image';
import {seoGroup} from '@/cms/fields/seo';
import {touchLastModified} from '@/cms/hooks/lastModified';
import {studioPreview} from '@/cms/preview';

import type {CollectionConfig} from 'payload';

export const Studios: CollectionConfig = {
	slug: 'studios',
	labels: {singular: 'Студия', plural: 'Студии'},
	admin: {
		preview: studioPreview,
		group: 'Контент',
		useAsTitle: 'shortName',
		defaultColumns: ['shortName', 'address', 'order'],
		listSearchableFields: ['name', 'shortName', 'address', 'slug']
	},
	defaultSort: 'order',
	access: contentAccess,
	versions: publishedVersions,
	hooks: {beforeChange: [touchLastModified]},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Основное',
					fields: [
						{name: 'name', type: 'text', label: 'Заголовок страницы', required: true},
						{
							name: 'shortName',
							type: 'text',
							label: 'Короткий адрес',
							required: true,
							admin: {description: 'Подпись в шапке, подвале и на карточках.'}
						},
						{name: 'address', type: 'text', label: 'Адрес', required: true},
						{name: 'metro', type: 'text', hasMany: true, label: 'Метро'},
						{name: 'hours', type: 'text', label: 'Часы работы', required: true},
						{
							name: 'phones',
							type: 'text',
							hasMany: true,
							label: 'Телефоны',
							admin: {description: 'В формате +74993933005.'}
						},
						{name: 'email', type: 'email', label: 'E-mail', required: true},
						imageField('photos', 'Фотографии', {hasMany: true})
					]
				},
				{
					label: 'Карта',
					fields: [
						{name: 'mapLink', type: 'text', label: 'Ссылка на карту', required: true},
						{
							name: 'mapEmbedUrl',
							type: 'textarea',
							label: 'Адрес карты для подвала (iframe src)',
							required: true
						},
						{
							name: 'geo',
							type: 'group',
							label: 'Координаты',
							fields: [
								{name: 'lat', type: 'number', label: 'Широта', required: true},
								{name: 'lon', type: 'number', label: 'Долгота', required: true}
							]
						}
					]
				},
				{label: 'SEO', fields: [seoGroup()]}
			]
		},
		slugField('Адрес страницы: /studii/<slug>/'),
		orderField,
		wpIdField(),
		oldPathsField,
		lastModifiedField
	]
};
