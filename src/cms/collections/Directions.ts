import {contentAccess} from '@/cms/access/roles';
import {articleSectionBlock, blocksField, cardItemFields} from '@/cms/fields/blocks';
import {
	lastModifiedField,
	oldPathsField,
	orderField,
	publishedVersions,
	slugField,
	textListField,
	wpIdField
} from '@/cms/fields/common';
import {imageField} from '@/cms/fields/image';
import {seoGroup} from '@/cms/fields/seo';
import {videosField} from '@/cms/fields/video';
import {touchLastModified} from '@/cms/hooks/lastModified';
import {directionPreview} from '@/cms/preview';

import type {Block, CollectionConfig} from 'payload';

const introBlock: Block = {
	slug: 'intro',
	interfaceName: 'IntroSectionBlock',
	labels: {singular: 'Вступление', plural: 'Вступления'},
	fields: [blocksField('blocks', 'Содержимое')]
};

const programmeBlock: Block = {
	slug: 'programme',
	interfaceName: 'ProgrammeSectionBlock',
	labels: {singular: 'Программа курса', plural: 'Программа курса'},
	fields: [
		{name: 'heading', type: 'text', label: 'Заголовок'},
		{
			name: 'items',
			type: 'array',
			label: 'Карточки программы',
			labels: {singular: 'Карточка', plural: 'Карточки'},
			fields: cardItemFields()
		}
	]
};

const howClassesGoBlock: Block = {
	slug: 'howClassesGo',
	interfaceName: 'HowClassesGoSectionBlock',
	labels: {singular: 'Как проходят занятия', plural: 'Как проходят занятия'},
	fields: [{name: 'heading', type: 'text', label: 'Заголовок', required: true}, videosField()]
};

export const Directions: CollectionConfig = {
	slug: 'directions',
	labels: {singular: 'Направление', plural: 'Направления'},
	admin: {
		preview: directionPreview,
		group: 'Контент',
		useAsTitle: 'title',
		defaultColumns: ['title', 'shortTitle', 'audience', 'category', 'order'],
		listSearchableFields: ['title', 'shortTitle', 'slug']
	},
	defaultSort: 'order',
	access: contentAccess,
	versions: publishedVersions,
	hooks: {beforeChange: [touchLastModified]},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Основное',
					fields: [
						{name: 'title', type: 'text', label: 'Название (заголовок страницы)', required: true},
						{
							name: 'shortTitle',
							type: 'text',
							label: 'Короткое название',
							required: true,
							admin: {description: 'Подпись в меню и на карточках.'}
						},
						{
							type: 'row',
							fields: [
								{
									name: 'audience',
									type: 'select',
									label: 'Для кого',
									required: true,
									options: [
										{label: 'Для детей', value: 'kids'},
										{label: 'Для взрослых', value: 'adults'},
										{label: 'Семья', value: 'family'}
									]
								},
								{
									name: 'category',
									type: 'select',
									label: 'Категория',
									required: true,
									options: [
										{label: 'Творчество', value: 'creativity'},
										{label: 'Танцы', value: 'dance'},
										{label: 'Развитие', value: 'development'},
										{label: 'Языки', value: 'languages'},
										{label: 'Фитнес', value: 'fitness'},
										{label: 'Школа', value: 'school'},
										{label: 'Индивидуальные занятия', value: 'individual'}
									]
								}
							]
						},
						{
							name: 'excerpt',
							type: 'textarea',
							label: 'Краткое описание',
							required: true,
							admin: {description: 'Текст на карточках: слоган или описание страницы.'}
						},
						{name: 'tagline', type: 'text', label: 'Слоган'},
						textListField('highlightBullets', 'Тезисы для карточки', true),
						imageField('cardImage', 'Постер для каталога и главной', {
							description: 'Вертикальный постер направления.'
						}),
						{
							name: 'teachers',
							type: 'relationship',
							relationTo: 'teachers',
							hasMany: true,
							label: 'Педагоги'
						}
					]
				},
				{
					label: 'Шапка страницы',
					fields: [
						{
							name: 'hero',
							type: 'group',
							label: 'Шапка',
							fields: [
								{name: 'heading', type: 'text', label: 'Заголовок', required: true},
								{name: 'subheading', type: 'text', label: 'Подзаголовок'},
								imageField('image', 'Фоновое изображение')
							]
						}
					]
				},
				{
					label: 'Содержимое',
					fields: [
						{
							name: 'sections',
							type: 'blocks',
							label: 'Разделы страницы',
							labels: {singular: 'Раздел', plural: 'Разделы'},
							blocks: [introBlock, programmeBlock, articleSectionBlock, howClassesGoBlock]
						}
					]
				},
				{label: 'SEO', fields: [seoGroup()]}
			]
		},
		slugField('Адрес страницы: /napravleniya/<slug>/'),
		orderField,
		wpIdField(),
		oldPathsField,
		lastModifiedField
	]
};
