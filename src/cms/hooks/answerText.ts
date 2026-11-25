import {faqAnswerText, stringToRichText} from '@/cms/richtext';

import type {TBlock} from '@/content/types';
import type {CollectionBeforeChangeHook} from 'payload';

type TAnswerBlock = {
	blockType?: string;
	text?: string | null;
	value?: string | null;
	label?: string | null;
	items?: {text?: string | null; title?: string | null}[] | null;
};

const plain = (value: string | null | undefined): string => stringToRichText(value ?? '').text;

/** Keeps `answerText` (used by FAQPage JSON-LD and search) in sync with the answer blocks. */
export const setAnswerText: CollectionBeforeChangeHook = ({data}) => {
	const blocks = ((data.answer ?? []) as TAnswerBlock[]).map((block): TBlock => {
		switch (block.blockType) {
			case 'list':
				return {
					type: 'list',
					ordered: false,
					items: (block.items ?? []).map((item) => ({text: plain(item.text)}))
				};
			case 'stat':
				return {type: 'stat', value: block.value ?? '', label: block.label ?? ''};
			case 'cards':
				return {
					type: 'cards',
					items: (block.items ?? []).map((item) => ({title: item.title ?? '', text: plain(item.text)}))
				};
			default:
				return {type: 'paragraph', text: plain(block.text)};
		}
	});
	return {...data, answerText: faqAnswerText(blocks)};
};
