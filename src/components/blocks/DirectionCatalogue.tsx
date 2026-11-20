'use client';

import {useState} from 'react';

import {DirectionCard} from '@/components/blocks/DirectionCard';
import {Heading} from '@/components/ui/Heading';
import {cn} from '@/lib/cn';

import type {ReactNode} from 'react';
import type {TAudience, TDirectionCategory, TImage} from '@/content/types';

export type TCatalogueItem = {
	slug: string;
	href: string;
	title: string;
	excerpt: string;
	category: TDirectionCategory;
	image: TImage | null;
};

export type TCatalogueGroup = {
	id: TAudience;
	label: string;
	items: TCatalogueItem[];
};

type TDirectionCatalogueProps = {
	groups: TCatalogueGroup[];
	/** Category chips, in display order. */
	categories: {id: TDirectionCategory; label: string}[];
	/** Label of the «show everything» chip. */
	allLabel: string;
};

const chipBase =
	'inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-bold transition-colors focus-visible:outline-offset-2';

/**
 * Audience groups with a category filter. Every card is rendered on the server and stays visible without JS;
 * the filter only toggles `hidden` on cards (and on groups left empty), so no markup is added or removed.
 */
export function DirectionCatalogue({groups, categories, allLabel}: TDirectionCatalogueProps): ReactNode {
	const [active, setActive] = useState<TDirectionCategory | null>(null);
	const usedCategories = categories.filter((category) =>
		groups.some((group) => group.items.some((item) => item.category === category.id))
	);

	return (
		<div>
			{/* Chips need JS; without it everything is already visible, so hide the inert buttons. */}
			<noscript>
				<style>{'[data-js-only]{display:none}'}</style>
			</noscript>
			<div data-js-only={''} role={'group'} aria-label={'Фильтр по категории'} className={'flex flex-wrap gap-2'}>
				<button
					type={'button'}
					aria-pressed={active === null}
					onClick={() => setActive(null)}
					className={cn(
						chipBase,
						active === null
							? 'border-brand bg-brand text-brand-ink'
							: 'border-line bg-white text-ink hover:border-brand-400'
					)}
				>
					{allLabel}
				</button>
				{usedCategories.map((category) => (
					<button
						key={category.id}
						type={'button'}
						aria-pressed={active === category.id}
						onClick={() => setActive(category.id)}
						className={cn(
							chipBase,
							active === category.id
								? 'border-brand bg-brand text-brand-ink'
								: 'border-line bg-white text-ink hover:border-brand-400'
						)}
					>
						{category.label}
					</button>
				))}
			</div>

			<div className={'mt-10 flex flex-col gap-14'}>
				{groups.map((group) => {
					const groupHidden = active !== null && !group.items.some((item) => item.category === active);
					return (
						<section
							key={group.id}
							id={group.id}
							aria-labelledby={`${group.id}-title`}
							hidden={groupHidden}
							className={'scroll-mt-24'}
						>
							<Heading id={`${group.id}-title`} level={2}>
								{group.label}
							</Heading>
							<ul className={'mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'}>
								{group.items.map((item) => (
									<li key={item.slug} hidden={active !== null && item.category !== active}>
										<DirectionCard
											href={item.href}
											title={item.title}
											text={item.excerpt}
											image={item.image ?? undefined}
										/>
									</li>
								))}
							</ul>
						</section>
					);
				})}
			</div>
		</div>
	);
}
