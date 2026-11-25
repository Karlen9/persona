import './globals.css';

import {SiteDocument} from '@/components/layout/SiteDocument';
import {getSite} from '@/lib/cms';
import {SITE_DESCRIPTION} from '@/lib/site';

import type {ReactNode} from 'react';
import type {Metadata, Viewport} from 'next';

const DEFAULT_TITLE = 'PersOna — творческий центр для детей и взрослых в Москве';

export async function generateMetadata(): Promise<Metadata> {
	const site = await getSite();
	return {
		metadataBase: new URL(site.url),
		title: {default: DEFAULT_TITLE, template: '%s — PersOna'},
		description: SITE_DESCRIPTION,
		applicationName: site.name,
		alternates: {canonical: './'},
		openGraph: {
			type: 'website',
			locale: 'ru_RU',
			siteName: site.name,
			title: DEFAULT_TITLE,
			description: SITE_DESCRIPTION,
			url: '/',
			images: [
				{
					url: site.defaultOgImage.src,
					width: site.defaultOgImage.width,
					height: site.defaultOgImage.height,
					alt: site.defaultOgImage.alt
				}
			]
		},
		twitter: {card: 'summary_large_image', images: [site.defaultOgImage.src]}
	};
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#5DBAA8'
};

type TRootLayoutProps = {
	children: ReactNode;
};

export default function RootLayout({children}: TRootLayoutProps): ReactNode {
	return <SiteDocument>{children}</SiteDocument>;
}
