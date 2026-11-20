import {PageSections} from '@/components/blocks/PageSections';
import {privacyPage} from '@/content';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export const metadata: Metadata = buildMetadata({seo: privacyPage.seo, path: privacyPage.path});

export default function PrivacyPage(): ReactNode {
	return <PageSections page={privacyPage} breadcrumbs={[{label: privacyPage.h1}]} narrow />;
}
