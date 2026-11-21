import {CtaBand} from '@/components/blocks/CtaBand';
import {PageSections} from '@/components/blocks/PageSections';
import {festivalsPage, home} from '@/content';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export const metadata: Metadata = buildMetadata({seo: festivalsPage.seo, path: festivalsPage.path});

export default function FestivalsPage(): ReactNode {
	return (
		<>
			<PageSections page={festivalsPage} breadcrumbs={[{label: festivalsPage.h1}]} transitionName={'tile-work'} />
			<CtaBand title={home.cta.heading} />
		</>
	);
}
