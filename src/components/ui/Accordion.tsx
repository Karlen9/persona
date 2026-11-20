import {cn} from '@/lib/cn';

import {Icon} from './Icon';
import {JsonLd} from './JsonLd';

import type {ReactNode} from 'react';

export type TAccordionItem = {
	question: string;
	/** Rendered inside the panel. */
	answer: ReactNode;
	/** Plain-text answer for FAQPage JSON-LD; defaults to `answer` when that is a string. */
	answerText?: string;
};

type TAccordionProps = {
	items: TAccordionItem[];
	/** Open the first item by default. */
	openFirst?: boolean;
	/** Emit FAQPage JSON-LD (use once per page). */
	jsonLd?: boolean;
	className?: string;
};

export function faqJsonLd(items: {question: string; answerText: string}[]): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {'@type': 'Answer', text: item.answerText}
		}))
	};
}

/** Native <details>: works without JS and keeps every answer in the server-rendered HTML. */
export function Accordion({items, openFirst, jsonLd, className}: TAccordionProps): ReactNode {
	const ldItems = items.flatMap((item) => {
		const answerText = item.answerText ?? (typeof item.answer === 'string' ? item.answer : null);
		return answerText ? [{question: item.question, answerText}] : [];
	});
	return (
		<div className={cn('flex flex-col gap-3', className)}>
			{items.map((item, index) => (
				<details
					key={item.question}
					open={openFirst && index === 0}
					className={'group rounded-card border border-line bg-white shadow-card open:border-brand-300'}
				>
					<summary
						className={
							'flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-card px-5 py-4 text-left font-bold text-ink sm:px-6 sm:py-5 sm:text-lg'
						}
					>
						{item.question}
						<Icon
							name={'chevron-down'}
							size={22}
							className={
								'shrink-0 text-brand-700 transition-transform duration-200 group-open:rotate-180'
							}
						/>
					</summary>
					<div className={'px-5 pb-5 sm:px-6 sm:pb-6'}>{item.answer}</div>
				</details>
			))}
			{jsonLd && ldItems.length > 0 ? <JsonLd data={faqJsonLd(ldItems)} /> : null}
		</div>
	);
}
