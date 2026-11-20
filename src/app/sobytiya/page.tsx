import {CtaBand} from '@/components/blocks/CtaBand';
import {PageSections} from '@/components/blocks/PageSections';
import {eventsPage, home} from '@/content';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export const metadata: Metadata = buildMetadata({seo: eventsPage.seo, path: eventsPage.path});

export default function EventsPage(): ReactNode {
	return (
		<>
			<PageSections page={eventsPage} breadcrumbs={[{label: eventsPage.h1}]} />
			<CtaBand title={home.cta.heading} />
		</>
	);
}
