import {CtaBand} from '@/components/blocks/CtaBand';
import {PageSections} from '@/components/blocks/PageSections';
import {getHome, requirePage} from '@/lib/cms';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export async function generateMetadata(): Promise<Metadata> {
	const eventsPage = await requirePage('events');
	return buildMetadata({seo: eventsPage.seo, path: eventsPage.path});
}

export default async function EventsPage(): Promise<ReactNode> {
	const [eventsPage, home] = await Promise.all([requirePage('events'), getHome()]);
	return (
		<>
			<PageSections page={eventsPage} breadcrumbs={[{label: eventsPage.h1}]} />
			<CtaBand title={home.cta.heading} />
		</>
	);
}
