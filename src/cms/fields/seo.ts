import {imageField} from '@/cms/fields/image';

import type {GroupField} from 'payload';

export const seoGroup = (): GroupField => ({
	name: 'seo',
	type: 'group',
	label: 'SEO',
	fields: [
		{name: 'title', type: 'text', label: 'Заголовок (title)', required: true},
		{name: 'description', type: 'textarea', label: 'Описание (description)', required: true},
		imageField('ogImage', 'Картинка для соцсетей (og:image)', {
			description: 'Если не задана, используется картинка по умолчанию из настроек сайта.'
		})
	]
});
