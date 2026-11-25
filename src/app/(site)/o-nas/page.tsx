import {CentreHighlights} from '@/components/blocks/CentreHighlights';
import {CtaBand} from '@/components/blocks/CtaBand';
import {PageSections} from '@/components/blocks/PageSections';
import {getHome, requirePage} from '@/lib/cms';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export async function generateMetadata(): Promise<Metadata> {
	const aboutPage = await requirePage('about');
	return buildMetadata({seo: aboutPage.seo, path: aboutPage.path});
}

export default async function AboutPage(): Promise<ReactNode> {
	const [aboutPage, home] = await Promise.all([requirePage('about'), getHome()]);
	return (
		<>
			<PageSections page={aboutPage} breadcrumbs={[{label: aboutPage.h1}]} />
			<CentreHighlights />
			<CtaBand title={home.cta.heading} />
		</>
	);
}
