import {Icon} from '@/components/ui/Icon';
import {RichInline} from '@/components/ui/RichInline';
import {bentoPattern, leadListPattern} from '@/lib/bento';
import {cn} from '@/lib/cn';

import type {ReactNode} from 'react';
import type {TSpan} from '@/lib/bento';
import type {TBodyBlock, TIconItem, TLeadItem, TSegment} from '@/lib/blockGroups';

type TCardsSegment = Extract<TSegment, {kind: 'cards'}>;
type TLeadListSegment = Extract<TSegment, {kind: 'lead-list'}>;
type TClosingSegment = Extract<TSegment, {kind: 'closing'}>;

const COL_CLASS = {
	2: 'lg:col-span-2',
	3: 'lg:col-span-3',
	4: 'lg:col-span-4',
	6: 'lg:col-span-6'
} as const;

const ROW_CLASS = {1: '', 2: 'lg:row-span-2'} as const;

/** Quiet per-card rhythm: soft background tint alternating by index. */
const CARD_TINTS = ['border-brand-100 bg-brand-50', 'border-accent-100 bg-accent-50', 'border-line bg-white'] as const;

type TCardTone = 'tinted' | 'plain';
type TLeadLayout = 'cards' | 'rows';

const PLAIN_TINT = 'border-line bg-white';

function cardTint(tone: TCardTone, index: number): string {
	return tone === 'plain' ? PLAIN_TINT : CARD_TINTS[index % CARD_TINTS.length];
}

const CARD_CLASS = 'flex h-full rounded-[24px] border shadow-card';

/** Column / row classes for one grid item. On `sm` (2 columns) an odd last card takes both columns. */
function spanClass(span: TSpan, index: number, count: number): string {
	return cn(COL_CLASS[span.col], ROW_CLASS[span.row], count % 2 === 1 && index === count - 1 && 'sm:col-span-2');
}

function isLarge(span: TSpan): boolean {
	return span.col >= 4 || span.row === 2;
}

function CardBody({blocks, large}: {blocks: TBodyBlock[]; large?: boolean}): ReactNode {
	const textClass = large ? 'text-base leading-relaxed' : 'text-[15px] leading-relaxed';
	return (
		<>
			{blocks.map((block, index) => {
				if (block.type === 'paragraph') {
					return (
						<p key={index} className={cn('mt-2 break-words', textClass)}>
							<RichInline value={block} />
						</p>
					);
				}
				const List = block.ordered ? 'ol' : 'ul';
				return (
					<List
						key={index}
						role={'list'}
						className={cn(
							'mt-3 flex flex-col gap-2',
							block.ordered && 'list-decimal pl-5 marker:font-bold'
						)}
					>
						{block.items.map((item, i) => (
							<li key={i} className={cn('flex items-start gap-2.5 break-words', textClass)}>
								{block.ordered ? null : (
									<span
										aria-hidden
										className={
											'mt-[3px] flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800'
										}
									>
										<Icon name={'check'} size={12} />
									</span>
								)}
								<span className={'min-w-0'}>
									<RichInline value={item} />
								</span>
							</li>
						))}
					</List>
				);
			})}
		</>
	);
}

function IconCard({
	item,
	index,
	large,
	tone
}: {
	item: TIconItem;
	index: number;
	large: boolean;
	tone: TCardTone;
}): ReactNode {
	return (
		<div className={cn(CARD_CLASS, cardTint(tone, index), 'flex-col p-5 sm:p-6', large && 'sm:p-7')}>
			<div className={'min-w-0 flex-1'}>
				<h3
					className={cn(
						'font-extrabold tracking-tight text-balance text-ink',
						large ? 'text-xl leading-snug sm:text-2xl' : 'text-lg leading-snug'
					)}
				>
					<RichInline value={item.heading} />
				</h3>
				<CardBody blocks={item.body} large={large} />
			</div>
		</div>
	);
}

/** Bento grid of icon cards: heading + body per card, explicit spans from `bentoPattern`. */
function CardsGrid({segment, tone}: {segment: TCardsSegment; tone: TCardTone}): ReactNode {
	const count = segment.items.length;
	const spans = bentoPattern(count);
	return (
		<ul role={'list'} className={'grid gap-4 sm:grid-cols-2 lg:grid-cols-6'}>
			{segment.items.map((item, index) => (
				<li key={index} className={spanClass(spans[index], index, count)}>
					<IconCard item={item} index={index} large={isLarge(spans[index])} tone={tone} />
				</li>
			))}
		</ul>
	);
}

function LeadCard({lead, index, tone}: {lead: TLeadItem; index: number; tone: TCardTone}): ReactNode {
	return (
		<div className={cn(CARD_CLASS, 'flex-col gap-3 bg-white p-5', 'border-line')}>
			<span
				aria-hidden
				className={cn(
					'flex size-9 items-center justify-center rounded-xl border text-sm font-extrabold text-brand-800',
					cardTint(tone, index)
				)}
			>
				{index + 1}
			</span>
			<div>
				<h4 className={'text-[17px] leading-snug font-extrabold text-ink'}>{lead.lead}</h4>
				{lead.rest ? (
					<p className={'mt-1.5 text-[15px] leading-relaxed break-words'}>
						<RichInline value={lead.rest} />
					</p>
				) : null}
			</div>
		</div>
	);
}

/** Quiet single-column rows for a lead-list: marker, bold label, description. No cards. */
function LeadRows({segment}: {segment: TLeadListSegment}): ReactNode {
	return (
		<ul role={'list'} className={'mt-6 divide-y divide-line border-y border-line'}>
			{segment.leads.map((lead, index) => (
				<li key={index} className={'flex items-start gap-4 py-5 md:gap-5'}>
					<span
						aria-hidden
						className={
							'flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-extrabold text-brand-800'
						}
					>
						{segment.ordered ? index + 1 : <Icon name={'check'} size={14} />}
					</span>
					<div className={'min-w-0 flex-1 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-8'}>
						<h4 className={'text-[17px] leading-snug font-extrabold text-ink'}>{lead.lead}</h4>
						{lead.rest ? (
							<p className={'mt-1 text-base leading-relaxed break-words md:mt-0'}>
								<RichInline value={lead.rest} />
							</p>
						) : null}
					</div>
				</li>
			))}
		</ul>
	);
}

/** «Label — description» list: the icon heading stays a real h3 above a grid of smaller cards (h4 titles) or rows. */
function LeadListGrid({
	segment,
	tone,
	layout
}: {
	segment: TLeadListSegment;
	tone: TCardTone;
	layout: TLeadLayout;
}): ReactNode {
	const count = segment.leads.length;
	const spans = leadListPattern(count);
	return (
		<div>
			<h3 className={'text-xl leading-snug font-extrabold tracking-tight text-balance text-ink sm:text-2xl'}>
				<RichInline value={segment.item.heading} />
			</h3>
			{segment.intro.length > 0 ? (
				<div className={'max-w-[72ch]'}>
					<CardBody blocks={segment.intro} large />
				</div>
			) : null}
			{layout === 'rows' ? (
				<LeadRows segment={segment} />
			) : (
				<ul role={'list'} className={'mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-6'}>
					{segment.leads.map((lead, index) => (
						<li key={index} className={spanClass(spans[index], index, count)}>
							<LeadCard lead={lead} index={index} tone={tone} />
						</li>
					))}
				</ul>
			)}
			{segment.outro.length > 0 ? (
				<div className={'mt-5 max-w-[72ch]'}>
					<CardBody blocks={segment.outro} large />
				</div>
			) : null}
		</div>
	);
}

/** Final «Результат» / «Итог» item: one full-width highlight card on a teal-to-pink wash. */
function ClosingCard({segment}: {segment: TClosingSegment}): ReactNode {
	const {item} = segment;
	return (
		<div
			className={
				'flex flex-col gap-5 rounded-[26px] border border-brand-100 bg-gradient-to-br from-brand-50 to-accent-50 p-6 shadow-card sm:p-8'
			}
		>
			<div className={'min-w-0 flex-1'}>
				<h3 className={'text-2xl leading-snug font-extrabold tracking-tight text-balance text-ink'}>
					<RichInline value={item.heading} />
				</h3>
				<div className={'max-w-[72ch]'}>
					<CardBody blocks={item.body} large />
				</div>
			</div>
		</div>
	);
}

type TIconCardGridProps = {
	segment: Exclude<TSegment, {kind: 'blocks'}>;
	/** `tinted` (default) cycles soft backgrounds; `plain` makes every card and badge white. */
	tone?: TCardTone;
	/** Lead-list layout: `cards` (default) bento cards, `rows` plain readable rows. */
	leadLayout?: TLeadLayout;
};

export function IconCardGrid({segment, tone = 'tinted', leadLayout = 'cards'}: TIconCardGridProps): ReactNode {
	switch (segment.kind) {
		case 'cards':
			return <CardsGrid segment={segment} tone={tone} />;
		case 'lead-list':
			return <LeadListGrid segment={segment} tone={tone} layout={leadLayout} />;
		case 'closing':
			return <ClosingCard segment={segment} />;
	}
}
