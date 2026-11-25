import {isLoggedIn} from '@/cms/access/roles';
import {lastModifiedField, oldPathsField, publishedGlobalVersions} from '@/cms/fields/common';
import {linkGroup} from '@/cms/fields/link';
import {seoGroup} from '@/cms/fields/seo';
import {touchGlobalLastModified} from '@/cms/hooks/lastModified';
import {staticPreview} from '@/cms/preview';

import type {GlobalConfig} from 'payload';

export const DirectionsIndex: GlobalConfig = {
	slug: 'directions-index',
	label: 'Каталог направлений',
	admin: {preview: staticPreview('/napravleniya/'), group: 'Страницы'},
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
						linkGroup('cta', 'Кнопка'),
						{
							name: 'listed',
							type: 'relationship',
							relationTo: 'directions',
							hasMany: true,
							label: 'Направления в каталоге (по порядку)'
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
