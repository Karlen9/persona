import {CtaBand} from '@/components/blocks/CtaBand';
import {PageHero} from '@/components/blocks/PageHero';
import {StudioCard} from '@/components/blocks/StudioCard';
import {Gallery} from '@/components/ui/Gallery';
import {Section} from '@/components/ui/Section';
import {formatPhone, home, site, studios} from '@/content';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

const PATH = '/studii/';

export const metadata: Metadata = buildMetadata({
	seo: {
		title: `Студии — ${site.name}`,
		description: `Адреса, станции метро, телефоны и режим работы студий творческого центра ${site.name} в Москве: ${studios
			.map((studio) => studio.shortName)
			.join(', ')}.`
	},
	path: PATH
});

export default function StudiosPage(): ReactNode {
	return (
		<>
			<PageHero breadcrumbs={[{label: 'Студии'}]} title={'Студии'} />
			<Section className={'pt-0 md:pt-0'}>
				<ul className={'grid gap-5 sm:grid-cols-2'}>
					{studios.map((studio) => (
						<li key={studio.slug}>
							<StudioCard
								name={studio.name}
								href={studio.path}
								address={studio.address}
								metro={studio.metro.join(', ')}
								hours={studio.hours}
								phones={studio.phones.map((phone) => ({
									label: formatPhone(phone),
									href: `tel:${phone}`
								}))}
								image={studio.photos[0]}
								imageSizes={'(min-width: 1200px) 580px, (min-width: 640px) 45vw, 100vw'}
							/>
						</li>
					))}
				</ul>
			</Section>
			<Section title={home.studio.heading} className={'pt-0 md:pt-0'}>
				<Gallery images={home.studio.photos} columns={4} aspect={'portrait'} />
			</Section>
			<CtaBand title={home.cta.heading} />
		</>
	);
}
