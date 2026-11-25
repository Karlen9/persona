import {notFound} from 'next/navigation';

import {ContactsBlock} from '@/components/blocks/ContactsBlock';
import {CtaBand} from '@/components/blocks/CtaBand';
import {PageHero} from '@/components/blocks/PageHero';
import {YandexMap} from '@/components/integrations/YandexMap';
import {Gallery} from '@/components/ui/Gallery';
import {Icon} from '@/components/ui/Icon';
import {JsonLd} from '@/components/ui/JsonLd';
import {Section} from '@/components/ui/Section';
import {formatPhoneFrom, getHome, getSite, getStudio, getStudios} from '@/lib/cms';
import {studioJsonLd} from '@/lib/jsonld';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

type TPageProps = {params: Promise<{slug: string}>};

export async function generateStaticParams(): Promise<{slug: string}[]> {
	return (await getStudios()).map((studio) => ({slug: studio.slug}));
}

export async function generateMetadata({params}: TPageProps): Promise<Metadata> {
	const {slug} = await params;
	const studio = await getStudio(slug);
	if (!studio) return {};
	return buildMetadata({seo: studio.seo, path: studio.path});
}

export default async function StudioPage({params}: TPageProps): Promise<ReactNode> {
	const {slug} = await params;
	const studio = await getStudio(slug);
	if (!studio) notFound();
	const [site, home] = await Promise.all([getSite(), getHome()]);

	const metro = studio.metro.join(', ');

	return (
		<>
			<PageHero
				breadcrumbs={[{label: 'Студии', href: '/studii/'}, {label: studio.shortName}]}
				title={studio.name}
				lead={studio.address}
			/>

			<Section className={'pt-0 md:pt-0'}>
				<div className={'grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12'}>
					<div className={'rounded-card border border-line bg-white p-6 shadow-card sm:p-8'}>
						<ContactsBlock
							address={studio.address}
							metro={metro}
							hours={studio.hours}
							phones={studio.phones.map((phone) => ({
								label: formatPhoneFrom(site.phones, phone),
								href: `tel:${phone}`
							}))}
							email={studio.email}
						/>
					</div>
					<div className={'flex flex-col gap-3'}>
						<YandexMap
							embedUrl={studio.mapEmbedUrl}
							title={studio.name}
							address={studio.address}
							metro={metro}
						/>
						<a
							href={studio.mapLink}
							target={'_blank'}
							rel={'noopener noreferrer'}
							className={
								'inline-flex min-h-11 items-center gap-2 font-bold text-brand-800 hover:underline'
							}
						>
							{'Открыть на Яндекс Картах'}
							<Icon name={'external'} size={16} />
						</a>
					</div>
				</div>
			</Section>

			<Section variant={'tinted'}>
				<Gallery images={studio.photos} columns={3} />
			</Section>

			<CtaBand title={home.cta.heading} />
			<JsonLd data={await studioJsonLd(studio)} />
		</>
	);
}
