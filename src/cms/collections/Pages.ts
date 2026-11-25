import {contentAccess} from '@/cms/access/roles';
import {articleSectionBlock, cardItemFields} from '@/cms/fields/blocks';
import {lastModifiedField, oldPathsField, publishedVersions} from '@/cms/fields/common';
import {imageField} from '@/cms/fields/image';
import {linkGroup} from '@/cms/fields/link';
import {seoGroup} from '@/cms/fields/seo';
import {videosField} from '@/cms/fields/video';
import {touchLastModified} from '@/cms/hooks/lastModified';
import {pagePreview} from '@/cms/preview';

import type {Block, CollectionConfig} from 'payload';

const heroBlock: Block = {
	slug: 'hero',
	interfaceName: 'HeroSectionBlock',
	labels: {singular: 'Шапка', plural: 'Шапки'},
	fields: [
		{name: 'heading', type: 'text', label: 'Заголовок', required: true},
		{name: 'subheading', type: 'text', label: 'Подзаголовок'},
		linkGroup('cta', 'Кнопка', {required: false}),
		imageField('image', 'Изображение')
	]
};

const cardSectionBlock: Block = {
	slug: 'cardSection',
	interfaceName: 'CardSectionBlock',
	labels: {singular: 'Карточки', plural: 'Карточки'},
	fields: [
		{name: 'heading', type: 'text', label: 'Заголовок'},
		{
			name: 'items',
			type: 'array',
			label: 'Карточки',
			labels: {singular: 'Карточка', plural: 'Карточки'},
			fields: cardItemFields()
		}
	]
};

const videoBlock: Block = {
	slug: 'video',
	interfaceName: 'VideoSectionBlock',
	labels: {singular: 'Видео', plural: 'Видео'},
	fields: [{name: 'heading', type: 'text', label: 'Заголовок'}, videosField()]
};

const downloadsBlock: Block = {
	slug: 'downloads',
	interfaceName: 'DownloadsSectionBlock',
	labels: {singular: 'Документы', plural: 'Документы'},
	fields: [
		{name: 'heading', type: 'text', label: 'Заголовок', required: true},
		{
			name: 'items',
			type: 'array',
			label: 'Файлы',
			labels: {singular: 'Файл', plural: 'Файлы'},
			fields: [
				{name: 'label', type: 'text', label: 'Название', required: true},
				{name: 'href', type: 'text', label: 'Адрес файла', required: true},
				{name: 'sizeBytes', type: 'number', label: 'Размер, байт', required: true}
			]
		}
	]
};

export const Pages: CollectionConfig = {
	slug: 'pages',
	labels: {singular: 'Страница', plural: 'Страницы'},
	admin: {
		preview: pagePreview,
		group: 'Страницы',
		useAsTitle: 'h1',
		defaultColumns: ['h1', 'key', 'updatedAt'],
		listSearchableFields: ['h1', 'key']
	},
	access: contentAccess,
	versions: publishedVersions,
	hooks: {beforeChange: [touchLastModified]},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Содержимое',
					fields: [
						{name: 'h1', type: 'text', label: 'Заголовок страницы (H1)', required: true},
						{
							name: 'sections',
							type: 'blocks',
							label: 'Разделы страницы',
							labels: {singular: 'Раздел', plural: 'Разделы'},
							blocks: [heroBlock, cardSectionBlock, articleSectionBlock, videoBlock, downloadsBlock]
						}
					]
				},
				{label: 'SEO', fields: [seoGroup()]}
			]
		},
		{
			name: 'key',
			type: 'select',
			label: 'Страница',
			required: true,
			unique: true,
			index: true,
			options: [
				{label: 'О нас (/o-nas/)', value: 'about'},
				{label: 'Праздники и события (/sobytiya/)', value: 'events'},
				{label: 'Фестивали (/festivali/)', value: 'festivals'},
				{label: 'Политика конфиденциальности (/politika-konfidencialnosti/)', value: 'privacy'}
			],
			admin: {position: 'sidebar', description: 'Определяет адрес страницы; не меняйте.'}
		},
		oldPathsField,
		lastModifiedField
	]
};
