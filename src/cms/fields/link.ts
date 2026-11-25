import type {Field, GroupField} from 'payload';

type TLinkOptions = {required?: boolean; external?: boolean};

/** `{label, href, external?}` sub-fields; reused by link groups and link arrays. */
export const linkFields = ({required = true, external = true}: TLinkOptions = {}): Field[] => [
	{name: 'label', type: 'text', label: 'Текст ссылки', required},
	{
		name: 'href',
		type: 'text',
		label: 'Адрес',
		required,
		admin: {description: 'Путь на сайте (/raspisanie/, #form) или полный адрес (https://…).'}
	},
	...(external
		? [
				{
					name: 'external',
					type: 'checkbox',
					label: 'Внешняя ссылка (открывать в новой вкладке)',
					defaultValue: false
				} as Field
			]
		: [])
];

export const linkGroup = (name: string, label: string, options: TLinkOptions = {}): GroupField => ({
	name,
	type: 'group',
	label,
	fields: linkFields(options)
});
