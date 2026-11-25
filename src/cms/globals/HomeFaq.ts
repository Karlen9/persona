import {isLoggedIn} from '@/cms/access/roles';
import {publishedGlobalVersions} from '@/cms/fields/common';
import {linkFields} from '@/cms/fields/link';
import {staticPreview} from '@/cms/preview';

import type {GlobalConfig} from 'payload';

export const HomeFaq: GlobalConfig = {
	slug: 'home-faq',
	label: 'Блок «Частые вопросы»',
	admin: {
		preview: staticPreview('/o-nas/#voprosy'),
		group: 'Страницы',
		description: 'Сами вопросы редактируются в разделе «Частые вопросы».'
	},
	access: {read: isLoggedIn, update: isLoggedIn},
	versions: publishedGlobalVersions,
	fields: [
		{name: 'heading', type: 'text', label: 'Заголовок', required: true},
		{name: 'subheading', type: 'text', label: 'Подзаголовок', required: true},
		{
			name: 'askButtons',
			type: 'array',
			label: 'Кнопки «Задать вопрос»',
			labels: {singular: 'Кнопка', plural: 'Кнопки'},
			fields: linkFields()
		}
	]
};
