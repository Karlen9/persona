import {isLoggedIn} from '@/cms/access/roles';
import {lastModifiedField, oldPathsField, publishedGlobalVersions} from '@/cms/fields/common';
import {seoGroup} from '@/cms/fields/seo';
import {touchGlobalLastModified} from '@/cms/hooks/lastModified';
import {staticPreview} from '@/cms/preview';

import type {GlobalConfig} from 'payload';

export const SchedulePage: GlobalConfig = {
	slug: 'schedule-page',
	label: 'Страница «Расписание»',
	admin: {preview: staticPreview('/raspisanie/'), group: 'Страницы'},
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
						{
							name: 'widgetMountIds',
							type: 'text',
							hasMany: true,
							label: 'ID контейнеров виджетов МойКласс',
							admin: {description: 'Соответствуют виджету расписания в настройках сайта.'}
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
