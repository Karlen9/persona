import {Manrope} from 'next/font/google';

import {CookieConsent} from '@/components/integrations/CookieConsent';
import {YandexMetrika} from '@/components/integrations/YandexMetrika';
import {FloatingContacts} from '@/components/layout/FloatingContacts';
import {SiteFooter} from '@/components/layout/SiteFooter';
import {SiteHeader} from '@/components/layout/SiteHeader';
import {SkipLink} from '@/components/layout/SkipLink';
import {JsonLd} from '@/components/ui/JsonLd';
import {OpenDetailsOnHash} from '@/components/ui/OpenDetailsOnHash';
import {getSite} from '@/lib/cms';
import {organizationJsonLd, websiteJsonLd} from '@/lib/jsonld';

import type {ReactNode} from 'react';

const manrope = Manrope({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-manrope',
	display: 'swap'
});

type TSiteDocumentProps = {
	children: ReactNode;
};

// Shared <html> shell of the public site. Used by the (site) root layout and by global-not-found
// (the app has two root layouts, so unknown URLs need their own shell).
export async function SiteDocument({children}: TSiteDocumentProps): Promise<ReactNode> {
	const [site, organization, website] = await Promise.all([getSite(), organizationJsonLd(), websiteJsonLd()]);
	return (
		<html lang={'ru'} className={manrope.variable}>
			<body>
				<SkipLink />
				<SiteHeader />
				<main id={'content'} tabIndex={-1} className={'outline-none'}>
					{children}
				</main>
				<SiteFooter />
				<FloatingContacts />
				<CookieConsent {...site.cookieBanner} />
				<YandexMetrika counterId={Number(site.metrika.counterId)} />
				<JsonLd data={organization} />
				<JsonLd data={website} />
				<OpenDetailsOnHash />
			</body>
		</html>
	);
}
