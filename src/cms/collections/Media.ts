import path from 'node:path';

import {isLoggedIn} from '@/cms/access/roles';

import type {CollectionConfig} from 'payload';

export const MEDIA_DIR = process.env.PAYLOAD_MEDIA_DIR
	? path.resolve(process.env.PAYLOAD_MEDIA_DIR)
	: path.resolve(process.cwd(), 'data/media');

export const Media: CollectionConfig = {
	slug: 'media',
	labels: {singular: 'Файл', plural: 'Медиа'},
	admin: {group: 'Контент', useAsTitle: 'alt', defaultColumns: ['filename', 'alt', 'mimeType', 'filesize']},
	access: {read: () => true, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn},
	hooks: {
		// Payload prefixes file URLs with serverURL and appends a trailing slash (the site uses trailingSlash). The file
		// route answers the slash with a 308 redirect that next/image's optimizer cannot follow, so expose the
		// same-origin, slash-less path (what next/image treats as a local image).
		afterRead: [
			({doc}) =>
				typeof doc.url === 'string'
					? {...doc, url: doc.url.replace(/^https?:\/\/[^/]+/, '').replace(/\/+$/, '')}
					: doc
		]
	},
	upload: {
		staticDir: MEDIA_DIR,
		mimeTypes: ['image/*', 'application/pdf']
	},
	fields: [
		{
			name: 'alt',
			type: 'text',
			label: 'Описание (alt)',
			required: true,
			admin: {description: 'Краткое описание изображения для скринридеров и поисковиков.'}
		},
		{
			name: 'legacySrc',
			type: 'text',
			label: 'Путь на старом сайте',
			admin: {readOnly: true, position: 'sidebar', description: 'Данные миграции (используются сидом).'}
		},
		{
			name: 'altGenerated',
			type: 'checkbox',
			label: 'Описание сгенерировано автоматически',
			defaultValue: false
		}
	]
};
