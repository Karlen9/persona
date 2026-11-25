import type {Field} from 'payload';

export const lastModifiedField: Field = {
	name: 'lastModified',
	type: 'text',
	label: 'Дата изменения',
	admin: {
		position: 'sidebar',
		readOnly: true,
		description: 'Обновляется автоматически при сохранении (используется в sitemap.xml).'
	}
};

export const oldPathsField: Field = {
	name: 'oldPaths',
	type: 'text',
	hasMany: true,
	label: 'Старые адреса',
	admin: {
		position: 'sidebar',
		readOnly: true,
		description: 'Адреса со старого сайта (данные миграции). Редиректы настраиваются в коде.'
	}
};

export const orderField: Field = {
	name: 'order',
	type: 'number',
	label: 'Порядок',
	required: true,
	defaultValue: 1,
	admin: {position: 'sidebar', description: 'Чем меньше число, тем выше в списке.'}
};

export const wpIdField = (name = 'wpId', label = 'ID в WordPress'): Field => ({
	name,
	type: 'number',
	label,
	admin: {position: 'sidebar', readOnly: true, description: 'Ключ миграции со старого сайта.'}
});

export const slugField = (description = 'Адрес страницы латиницей. Не меняйте без необходимости.'): Field => ({
	name: 'slug',
	type: 'text',
	label: 'Slug',
	required: true,
	unique: true,
	index: true,
	admin: {position: 'sidebar', description}
});

/** List of long texts (bullets, notes, headline lines): an array with a single text sub-field. */
export const textListField = (name: string, label: string, textarea = false): Field => ({
	name,
	type: 'array',
	label,
	fields: [
		textarea
			? {name: 'text', type: 'textarea', label: 'Текст', required: true}
			: {name: 'text', type: 'text', label: 'Текст', required: true}
	]
});

export const publishedVersions = {drafts: true, maxPerDoc: 50} as const;
export const publishedGlobalVersions = {drafts: true, max: 50} as const;
