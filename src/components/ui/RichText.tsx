import Image from 'next/image';
import {Fragment} from 'react';

import {IconCardGrid} from '@/components/blocks/IconCardGrid';
import {groupIconBlocks} from '@/lib/blockGroups';
import {cn} from '@/lib/cn';

import {Eyebrow} from './Eyebrow';
import {Heading} from './Heading';
import {RichInline} from './RichInline';

import type {ReactNode} from 'react';
import type {TBlock, TCard} from '@/content/types';

export {RichInline};

type TStat = Extract<TBlock, {type: 'stat'}>;

type TGroup = {kind: 'block'; block: Exclude<TBlock, {type: 'stat'}>} | {kind: 'stats'; stats: TStat[]};

/** Readable line length for running text; stats and card grids use the full width of their container. */
const measure = 'max-w-[72ch]';

function groupBlocks(blocks: readonly TBlock[]): TGroup[] {
	const groups: TGroup[] = [];
	for (const block of blocks) {
		if (block.type === 'stat') {
			const last = groups[groups.length - 1];
			if (last?.kind === 'stats') last.stats.push(block);
			else groups.push({kind: 'stats', stats: [block]});
		} else {
			groups.push({kind: 'block', block});
		}
	}
	return groups;
}

function CardGrid({items}: {items: TCard[]}): ReactNode {
	return (
		<ul className={'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'}>
			{items.map((card, index) => (
				<li
					key={`${card.title}-${index}`}
					className={'overflow-hidden rounded-card border border-line bg-white shadow-card'}
				>
					{card.image ? (
						<Image
							src={card.image.src}
							alt={card.image.alt}
							width={card.image.width}
							height={card.image.height}
							sizes={'(min-width: 1200px) 384px, (min-width: 640px) 45vw, 100vw'}
							className={'aspect-[4/3] w-full object-cover'}
						/>
					) : null}
					<div className={'p-5'}>
						<h3 className={'text-lg leading-snug font-extrabold text-ink'}>{card.title}</h3>
						<p className={'mt-2 text-[15px]'}>{card.text}</p>
					</div>
				</li>
			))}
		</ul>
	);
}

function StatRow({stats}: {stats: TStat[]}): ReactNode {
	return (
		<dl className={'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'}>
			{stats.map((stat, index) => (
				<div
					key={`${stat.value}-${index}`}
					className={'flex flex-col-reverse rounded-card border border-line bg-white p-5 shadow-card'}
				>
					<dt className={'mt-1 text-sm text-body'}>{stat.label}</dt>
					<dd className={'text-3xl font-extrabold text-brand-800'}>{stat.value}</dd>
				</div>
			))}
		</dl>
	);
}

type TRichTextProps = {
	blocks: readonly TBlock[];
	className?: string;
};

function renderPlainBlocks(blocks: readonly TBlock[]): ReactNode[] {
	return groupBlocks(blocks).map((group, index) => {
		if (group.kind === 'stats') return <StatRow key={index} stats={group.stats} />;
		const block = group.block;
		switch (block.type) {
			case 'heading':
				return (
					<Heading key={index} level={block.level} className={cn(measure, 'mt-4 first:mt-0')}>
						{block.icon ? (
							<span aria-hidden className={'mr-2'}>
								{block.icon}
							</span>
						) : null}
						<RichInline value={block} />
					</Heading>
				);
			case 'list': {
				const List = block.ordered ? 'ol' : 'ul';
				return (
					<List
						key={index}
						className={cn(
							measure,
							'flex flex-col gap-2 pl-6',
							block.ordered ? 'list-decimal marker:font-bold' : 'list-disc marker:text-brand-600'
						)}
					>
						{block.items.map((item, i) => (
							<li key={i}>
								<RichInline value={item} />
							</li>
						))}
					</List>
				);
			}
			case 'cards':
				return <CardGrid key={index} items={block.items} />;
			case 'paragraph':
				if (block.variant === 'eyebrow') {
					return (
						<div key={index}>
							<Eyebrow>{block.text}</Eyebrow>
						</div>
					);
				}
				return (
					<p key={index} className={measure}>
						<RichInline value={block} />
					</p>
				);
		}
	});
}

/**
 * Renders content `TBlock[]`: paragraphs (incl. eyebrow), headings (with emoji icon), lists, stat rows, card grids.
 * Runs of level-3 headings with an emoji icon (and their bodies) are rendered as icon-card grids (`IconCardGrid`).
 */
export function RichText({blocks, className}: TRichTextProps): ReactNode {
	return (
		<div className={cn('flex flex-col gap-4 text-[17px] leading-relaxed break-words', className)}>
			{groupIconBlocks(blocks).map((segment, index) =>
				segment.kind === 'blocks' ? (
					<Fragment key={index}>{renderPlainBlocks(segment.blocks)}</Fragment>
				) : (
					<div key={index} className={'my-2'}>
						<IconCardGrid segment={segment} />
					</div>
				)
			)}
		</div>
	);
}
