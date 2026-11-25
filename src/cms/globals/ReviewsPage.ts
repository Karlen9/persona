import {isLoggedIn} from '@/cms/access/roles';
import {blocksField} from '@/cms/fields/blocks';
import {lastModifiedField, oldPathsField, publishedGlobalVersions} from '@/cms/fields/common';
import {seoGroup} from '@/cms/fields/seo';
import {touchGlobalLastModified} from '@/cms/hooks/lastModified';
import {staticPreview} from '@/cms/preview';

import type {GlobalConfig} from 'payload';

export const ReviewsPage: GlobalConfig = {
	slug: 'reviews-page',
	label: 'Страница «Отзывы»',
	admin: {
		preview: staticPreview('/otzyvy/'),
		group: 'Страницы',
		description: 'Сами отзывы редактируются в разделе «Отзывы».'
	},
	access: {read: isLoggedIn, update: isLoggedIn},
	versions: publishedGlobalVersions,
	hooks: {beforeChange: [touchGlobalLastModified]},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Содержимое',
					fields: [
						{name: 'h1', type: 'text', label: 'Заголовок страницы (H1)', required: true},
						blocksField('intro', 'Вступление', true),
						{name: 'reviewLink', type: 'text', label: 'Ссылка «Оставить отзыв»', required: true},
						{name: 'widgetUrl', type: 'text', label: 'Адрес виджета отзывов', required: true}
					]
				},
				{label: 'SEO', fields: [seoGroup()]}
			]
		},
		oldPathsField,
		lastModifiedField
	]
};
