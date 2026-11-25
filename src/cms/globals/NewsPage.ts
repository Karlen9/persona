import {isLoggedIn} from '@/cms/access/roles';
import {blocksField} from '@/cms/fields/blocks';
import {lastModifiedField, oldPathsField, publishedGlobalVersions} from '@/cms/fields/common';
import {linkFields} from '@/cms/fields/link';
import {seoGroup} from '@/cms/fields/seo';
import {touchGlobalLastModified} from '@/cms/hooks/lastModified';
import {staticPreview} from '@/cms/preview';

import type {GlobalConfig} from 'payload';

export const NewsPage: GlobalConfig = {
	slug: 'news-page',
	label: 'Страница «Новости»',
	admin: {
		preview: staticPreview('/novosti/'),
		group: 'Страницы',
		description: 'Сами новости редактируются в разделе «Новости».'
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
						{
							name: 'links',
							type: 'array',
							label: 'Ссылки на каналы',
							labels: {singular: 'Ссылка', plural: 'Ссылки'},
							fields: linkFields({external: false})
						}
					]
				},
				{label: 'SEO', fields: [seoGroup()]}
			]
		},
		oldPathsField,
		lastModifiedField
	]
};
