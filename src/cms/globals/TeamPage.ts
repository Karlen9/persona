import {isLoggedIn} from '@/cms/access/roles';
import {lastModifiedField, oldPathsField, publishedGlobalVersions} from '@/cms/fields/common';
import {seoGroup} from '@/cms/fields/seo';
import {touchGlobalLastModified} from '@/cms/hooks/lastModified';
import {staticPreview} from '@/cms/preview';

import type {GlobalConfig} from 'payload';

export const TeamPage: GlobalConfig = {
	slug: 'team-page',
	label: 'Страница «Педагоги»',
	admin: {
		preview: staticPreview('/komanda/'),
		group: 'Страницы',
		description: 'Сами педагоги редактируются в разделе «Педагоги».'
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
					fields: [{name: 'h1', type: 'text', label: 'Заголовок страницы (H1)', required: true}]
				},
				{label: 'SEO', fields: [seoGroup()]}
			]
		},
		oldPathsField,
		lastModifiedField
	]
};
