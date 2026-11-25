import {PageSections} from '@/components/blocks/PageSections';
import {requirePage} from '@/lib/cms';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export async function generateMetadata(): Promise<Metadata> {
	const privacyPage = await requirePage('privacy');
	return buildMetadata({seo: privacyPage.seo, path: privacyPage.path});
}

export default async function PrivacyPage(): Promise<ReactNode> {
	const privacyPage = await requirePage('privacy');
	return <PageSections page={privacyPage} breadcrumbs={[{label: privacyPage.h1}]} narrow />;
}
