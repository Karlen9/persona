import {contentAccess} from '@/cms/access/roles';
import {blocksField} from '@/cms/fields/blocks';
import {orderField, publishedVersions} from '@/cms/fields/common';
import {setAnswerText} from '@/cms/hooks/answerText';

import type {CollectionConfig} from 'payload';

export const FaqItems: CollectionConfig = {
	slug: 'faq-items',
	labels: {singular: 'Вопрос', plural: 'Частые вопросы'},
	admin: {
		group: 'Контент',
		useAsTitle: 'question',
		defaultColumns: ['question', 'order'],
		listSearchableFields: ['question']
	},
	defaultSort: 'order',
	access: contentAccess,
	versions: publishedVersions,
	hooks: {beforeChange: [setAnswerText]},
	fields: [
		{name: 'question', type: 'text', label: 'Вопрос', required: true},
		blocksField('answer', 'Ответ', true),
		{
			name: 'answerText',
			type: 'textarea',
			label: 'Ответ простым текстом',
			admin: {readOnly: true, description: 'Заполняется автоматически (для микроразметки FAQ).'}
		},
		{
			name: 'key',
			type: 'text',
			label: 'Идентификатор',
			required: true,
			unique: true,
			index: true,
			admin: {position: 'sidebar', description: 'Якорь вопроса, например faq-1.'}
		},
		orderField
	]
};
