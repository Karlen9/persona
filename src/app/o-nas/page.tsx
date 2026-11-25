import {CentreHighlights} from '@/components/blocks/CentreHighlights';
import {CtaBand} from '@/components/blocks/CtaBand';
import {PageSections} from '@/components/blocks/PageSections';
import {aboutPage, home} from '@/content';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export const metadata: Metadata = buildMetadata({seo: aboutPage.seo, path: aboutPage.path});

export default function AboutPage(): ReactNode {
	return (
		<>
			<PageSections page={aboutPage} breadcrumbs={[{label: aboutPage.h1}]} />
			<CentreHighlights />
			<CtaBand title={home.cta.heading} />
		</>
	);
}
