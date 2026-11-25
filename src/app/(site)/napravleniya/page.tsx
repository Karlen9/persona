import {DirectionCatalogue} from '@/components/blocks/DirectionCatalogue';
import {PageHero} from '@/components/blocks/PageHero';
import {Section} from '@/components/ui/Section';
import {audienceLabels, directionCategoryLabels} from '@/content';
import {getDirections, getDirectionsIndexPage} from '@/lib/cms';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';
import type {TCatalogueGroup} from '@/components/blocks/DirectionCatalogue';
import type {TAudience, TDirectionCategory} from '@/content/types';

export async function generateMetadata(): Promise<Metadata> {
	const directionsIndexPage = await getDirectionsIndexPage();
	return buildMetadata({seo: directionsIndexPage.seo, path: directionsIndexPage.path});
}

const audiences: TAudience[] = ['kids', 'adults', 'family'];

export default async function DirectionsPage(): Promise<ReactNode> {
	const [directions, directionsIndexPage] = await Promise.all([getDirections(), getDirectionsIndexPage()]);
	const groups: TCatalogueGroup[] = audiences
		.map((audience) => ({
			id: audience,
			label: audienceLabels[audience],
			items: directions
				.filter((direction) => direction.audience === audience)
				.sort((a, b) => a.order - b.order)
				.map((direction) => ({
					slug: direction.slug,
					href: direction.path,
					title: direction.shortTitle,
					excerpt: direction.excerpt,
					category: direction.category,
					image: direction.cardImage
				}))
		}))
		.filter((group) => group.items.length > 0);

	const categories = (Object.keys(directionCategoryLabels) as TDirectionCategory[]).map((id) => ({
		id,
		label: directionCategoryLabels[id]
	}));

	return (
		<>
			<PageHero
				breadcrumbs={[{label: 'Направления'}]}
				title={directionsIndexPage.h1}
				cta={directionsIndexPage.cta}
			/>
			<Section className={'pt-0 md:pt-0'}>
				<DirectionCatalogue groups={groups} categories={categories} allLabel={'Все'} />
			</Section>
		</>
	);
}
