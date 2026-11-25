import {imageField} from '@/cms/fields/image';

import type {ArrayField} from 'payload';

export const videosField = (name = 'videos', label = 'Видео'): ArrayField => ({
	name,
	type: 'array',
	label,
	labels: {singular: 'Видео', plural: 'Видео'},
	fields: [
		{
			name: 'src',
			type: 'text',
			label: 'Адрес видео',
			required: true,
			admin: {description: 'Полный адрес файла. Видео пока лежат на старом хостинге.'}
		},
		{name: 'mimeType', type: 'text', label: 'Тип файла (MIME)'},
		{name: 'sizeBytes', type: 'number', label: 'Размер, байт'},
		imageField('poster', 'Постер (кадр)'),
		{name: 'caption', type: 'text', label: 'Подпись на постере'}
	]
});
