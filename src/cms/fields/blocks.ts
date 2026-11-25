import {imageField} from '@/cms/fields/image';

import type {Block, BlocksField, Field, TextareaField} from 'payload';

export const RICH_TEXT_HELP =
	'Разметка: **жирный**, *курсив*, ***жирный курсив***, [текст ссылки](https://адрес). ' +
	'Чтобы вывести символы * [ ] \\ как есть, поставьте перед ними обратную косую черту (\\*).';

export const richTextField = (name: string, label: string, required = true): TextareaField => ({
	name,
	type: 'textarea',
	label,
	required,
	admin: {description: RICH_TEXT_HELP}
});

const paragraphBlock: Block = {
	slug: 'paragraph',
	interfaceName: 'ParagraphBlock',
	labels: {singular: 'Абзац', plural: 'Абзацы'},
	fields: [
		{
			name: 'variant',
			type: 'select',
			label: 'Вид',
			options: [{label: 'Надзаголовок (eyebrow)', value: 'eyebrow'}],
			admin: {description: 'Пусто — обычный абзац.'}
		},
		richTextField('text', 'Текст')
	]
};

const headingBlock: Block = {
	slug: 'heading',
	interfaceName: 'HeadingBlock',
	labels: {singular: 'Заголовок', plural: 'Заголовки'},
	fields: [
		{
			name: 'level',
			type: 'select',
			label: 'Уровень',
			required: true,
			defaultValue: '3',
			options: [
				{label: 'H2', value: '2'},
				{label: 'H3', value: '3'},
				{label: 'H4', value: '4'}
			]
		},
		{name: 'icon', type: 'text', label: 'Иконка (эмодзи)', admin: {description: 'Необязательно, например 🧘.'}},
		richTextField('text', 'Текст')
	]
};

const listBlock: Block = {
	slug: 'list',
	interfaceName: 'ListBlock',
	labels: {singular: 'Список', plural: 'Списки'},
	fields: [
		{name: 'ordered', type: 'checkbox', label: 'Нумерованный', defaultValue: false},
		{
			name: 'items',
			type: 'array',
			label: 'Пункты',
			labels: {singular: 'Пункт', plural: 'Пункты'},
			fields: [richTextField('text', 'Текст')]
		}
	]
};

const statBlock: Block = {
	slug: 'stat',
	interfaceName: 'StatBlock',
	labels: {singular: 'Цифра', plural: 'Цифры'},
	fields: [
		{name: 'value', type: 'text', label: 'Значение', required: true},
		{name: 'label', type: 'text', label: 'Подпись', required: true}
	]
};

/** `{title, text, image?}` card rows (programme items, home advantages, card sections). */
export const cardItemFields = (): Field[] => [
	{name: 'title', type: 'text', label: 'Заголовок', required: true},
	{name: 'text', type: 'textarea', label: 'Текст', required: true},
	imageField('image', 'Фото')
];

const cardsBlock: Block = {
	slug: 'cards',
	interfaceName: 'CardsBlock',
	labels: {singular: 'Карточки', plural: 'Карточки'},
	fields: [
		{
			name: 'items',
			type: 'array',
			label: 'Карточки',
			labels: {singular: 'Карточка', plural: 'Карточки'},
			fields: cardItemFields()
		}
	]
};

export const contentBlocks: Block[] = [paragraphBlock, headingBlock, listBlock, statBlock, cardsBlock];

/** Block set for `TBlock[]`. */
export const blocksField = (name: string, label: string, required = false): BlocksField => ({
	name,
	type: 'blocks',
	label,
	required,
	labels: {singular: 'Блок', plural: 'Блоки'},
	blocks: contentBlocks
});

/** Article block shared by directions and simple pages. */
export const articleSectionBlock: Block = {
	slug: 'article',
	interfaceName: 'ArticleSectionBlock',
	labels: {singular: 'Статья', plural: 'Статьи'},
	fields: [blocksField('blocks', 'Содержимое')]
};
