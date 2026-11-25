import {CtaBand} from '@/components/blocks/CtaBand';
import {PageSections} from '@/components/blocks/PageSections';
import {VideoGrid} from '@/components/blocks/VideoGrid';
import {Section} from '@/components/ui/Section';
import {getHome, requirePage} from '@/lib/cms';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export async function generateMetadata(): Promise<Metadata> {
	const festivalsPage = await requirePage('festivals');
	return buildMetadata({seo: festivalsPage.seo, path: festivalsPage.path});
}

export default async function FestivalsPage(): Promise<ReactNode> {
	const [festivalsPage, home] = await Promise.all([requirePage('festivals'), getHome()]);
	return (
		<>
			<PageSections page={festivalsPage} breadcrumbs={[{label: festivalsPage.h1}]} />
			<Section
				id={home.performances.anchor}
				variant={'tinted'}
				eyebrow={home.performances.subheading}
				title={home.performances.heading}
			>
				<VideoGrid
					videos={home.performances.videos}
					label={home.performances.heading}
					columnsClassName={'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'}
					sizes={'(min-width: 1200px) 180px, (min-width: 768px) 33vw, 50vw'}
				/>
			</Section>
			<CtaBand title={home.cta.heading} />
		</>
	);
}
