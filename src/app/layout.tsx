import './globals.css';

import {Manrope} from 'next/font/google';

import {PopstateViewTransition} from '@/components/bento/PopstateViewTransition';
import {CookieConsent} from '@/components/integrations/CookieConsent';
import {YandexMetrika} from '@/components/integrations/YandexMetrika';
import {FloatingContacts} from '@/components/layout/FloatingContacts';
import {SiteFooter} from '@/components/layout/SiteFooter';
import {SiteHeader} from '@/components/layout/SiteHeader';
import {SkipLink} from '@/components/layout/SkipLink';
import {JsonLd} from '@/components/ui/JsonLd';
import {organizationJsonLd} from '@/lib/jsonld';
import {site} from '@/content/site';
import {SITE_DESCRIPTION, SITE_NAME, SITE_URL} from '@/lib/site';

import type {ReactNode} from 'react';
import type {Metadata, Viewport} from 'next';

const manrope = Manrope({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-manrope',
	display: 'swap'
});

const DEFAULT_TITLE = 'PersOna — творческий центр для детей и взрослых в Москве';

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {default: DEFAULT_TITLE, template: '%s — PersOna'},
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	alternates: {canonical: './'},
	openGraph: {
		type: 'website',
		locale: 'ru_RU',
		siteName: SITE_NAME,
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

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#5DBAA8'
};

type TRootLayoutProps = {
	children: ReactNode;
};

export default function RootLayout({children}: TRootLayoutProps): ReactNode {
	return (
		<html lang={'ru'} className={manrope.variable}>
			<body>
				<PopstateViewTransition />
				<SkipLink />
				<SiteHeader />
				<main id={'content'} tabIndex={-1} className={'outline-none'}>
					{children}
				</main>
				<SiteFooter />
				<FloatingContacts />
				<CookieConsent {...site.cookieBanner} />
				<YandexMetrika />
				<JsonLd data={organizationJsonLd()} />
			</body>
		</html>
	);
}
