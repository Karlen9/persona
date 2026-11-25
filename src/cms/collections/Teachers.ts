import {contentAccess} from '@/cms/access/roles';
import {blocksField} from '@/cms/fields/blocks';
import {orderField, publishedVersions, wpIdField} from '@/cms/fields/common';
import {imageField} from '@/cms/fields/image';
import {teacherPreview} from '@/cms/preview';

import type {CollectionConfig} from 'payload';

export const Teachers: CollectionConfig = {
	slug: 'teachers',
	labels: {singular: 'Педагог', plural: 'Педагоги'},
	admin: {
		preview: teacherPreview,
		group: 'Контент',
		useAsTitle: 'name',
		defaultColumns: ['name', 'role', 'isManagement', 'order'],
		listSearchableFields: ['name', 'role', 'slug']
	},
	defaultSort: 'order',
	access: contentAccess,
	versions: publishedVersions,
	fields: [
		{name: 'name', type: 'text', label: 'Имя', required: true},
		{name: 'role', type: 'text', label: 'Должность'},
		{
			type: 'row',
			fields: [
				imageField('photo', 'Портрет (в карточке педагога)', {required: true}),
				imageField('cardPhoto', 'Фото в сетке команды', {required: true})
			]
		},
		blocksField('bio', 'Биография'),
		{
			name: 'directions',
			type: 'relationship',
			relationTo: 'directions',
			hasMany: true,
			label: 'Направления',
			admin: {description: 'Дисциплины, которые ведёт педагог.'}
		},
		{
			name: 'isManagement',
			type: 'checkbox',
			label: 'Руководство',
			defaultValue: false,
			admin: {position: 'sidebar'}
		},
		{
			name: 'slug',
			type: 'text',
			label: 'Идентификатор',
			required: true,
			unique: true,
			index: true,
			admin: {position: 'sidebar', description: 'Транслитерация имени, стабильный ключ.'}
		},
		orderField,
		wpIdField('wpPopupId', 'ID всплывающего окна в WordPress')
	]
};
