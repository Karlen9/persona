import Link from 'next/link';

import {Icon} from '@/components/ui/Icon';
import {cn} from '@/lib/cn';
import {highlightSegments, makeSnippet} from '@/lib/search/highlight';

import type {MouseEvent, ReactNode} from 'react';
import type {TIconName} from '@/components/ui/Icon';
import type {TSearchHit} from '@/lib/search/engine';
import type {TSearchDocType} from '@/lib/search/types';

export const TYPE_ICONS: Record<TSearchDocType, TIconName> = {
	direction: 'sparkles',
	studio: 'map-pin',
	teacher: 'user',
	faq: 'help',
	price: 'tag',
	page: 'layout',
	document: 'file-text'
};

type THighlightedProps = {text: string; terms: string[]};

/** Matched words become `<mark>` elements (never raw HTML). */
export function Highlighted({text, terms}: THighlightedProps): ReactNode {
	return (
		<>
			{highlightSegments(text, terms).map((segment, index) =>
				segment.match ? (
					<mark key={index} className={'rounded-sm bg-brand-100 text-ink'}>
						{segment.text}
					</mark>
				) : (
					<span key={index}>{segment.text}</span>
				)
			)}
		</>
	);
}

type TSearchResultRowProps = {
	hit: TSearchHit;
	/** Set inside the palette listbox: the row becomes an ARIA option. */
	optionId?: string;
	active?: boolean;
	/** Allow a longer snippet (results page). */
	roomy?: boolean;
	onHover?: () => void;
	onNavigate?: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
};

/** One result: type icon, highlighted title, subtitle and a highlighted snippet. Works in server and client trees. */
export function SearchResultRow({hit, optionId, active, roomy, onHover, onNavigate}: TSearchResultRowProps): ReactNode {
	const {doc, terms} = hit;
	const isFile = doc.href.startsWith('/docs/');
	const snippet = doc.body ? makeSnippet(doc.body, terms) : '';
	const inListbox = optionId !== undefined;
	return (
		<li
			id={optionId}
			role={inListbox ? 'option' : undefined}
			aria-selected={inListbox ? Boolean(active) : undefined}
			onMouseMove={onHover}
		>
			<Link
				href={doc.href}
				prefetch={false}
				tabIndex={inListbox ? -1 : undefined}
				target={isFile ? '_blank' : undefined}
				rel={isFile ? 'noopener noreferrer' : undefined}
				onClick={onNavigate ? (event) => onNavigate(event, doc.href) : undefined}
				className={cn(
					'flex items-start gap-3 rounded-xl px-3 py-2.5 text-left',
					active ? 'bg-brand-50' : 'hover:bg-brand-50'
				)}
			>
				<span
					aria-hidden
					className={
						'mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-800'
					}
				>
					<Icon name={TYPE_ICONS[doc.type]} size={18} />
				</span>
				<span className={'min-w-0 flex-1'}>
					<span className={'block text-[15px] leading-snug font-bold text-ink'}>
						<Highlighted text={doc.title} terms={terms} />
					</span>
					<span className={'block truncate text-sm text-muted'}>{doc.subtitle}</span>
					{snippet ? (
						<span
							className={cn(
								'mt-0.5 block text-sm leading-snug text-body',
								roomy ? 'line-clamp-3' : 'line-clamp-2'
							)}
						>
							<Highlighted text={snippet} terms={terms} />
						</span>
					) : null}
				</span>
			</Link>
		</li>
	);
}
