import {PageHero} from '@/components/blocks/PageHero';
import {ButtonLink} from '@/components/ui/ButtonLink';
import {RichText} from '@/components/ui/RichText';
import {Section} from '@/components/ui/Section';
import {newsPage} from '@/content';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export const metadata: Metadata = buildMetadata({seo: newsPage.seo, path: newsPage.path});

export default function NewsPage(): ReactNode {
	return (
		<>
			<PageHero breadcrumbs={[{label: newsPage.h1}]} title={newsPage.h1} cta={null} />
			<Section className={'pt-0 md:pt-0'}>
				<RichText blocks={newsPage.intro} className={'text-lg'} />
				<ul className={'mt-8 flex flex-col items-start gap-3'}>
					{newsPage.links.map((link) => (
						<li key={link.href} className={'max-w-full'}>
							<ButtonLink href={link.href} variant={'secondary'} className={'max-w-full break-all'}>
								{link.label}
							</ButtonLink>
						</li>
					))}
				</ul>
			</Section>
		</>
	);
}
