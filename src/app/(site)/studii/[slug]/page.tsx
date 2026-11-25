import Link from 'next/link';
import {notFound} from 'next/navigation';

import {ContactsBlock} from '@/components/blocks/ContactsBlock';
import {CtaBand} from '@/components/blocks/CtaBand';
import {PageHero} from '@/components/blocks/PageHero';
import {YandexMap} from '@/components/integrations/YandexMap';
import {Gallery} from '@/components/ui/Gallery';
import {Heading} from '@/components/ui/Heading';
import {Icon} from '@/components/ui/Icon';
import {JsonLd} from '@/components/ui/JsonLd';
import {Section} from '@/components/ui/Section';
import {audienceLabels} from '@/content';
import {formatPhoneFrom, getDirections, getHome, getSite, getStudio, getStudios} from '@/lib/cms';
import {studioJsonLd} from '@/lib/jsonld';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';
import type {TAudience} from '@/content/types';

type TPageProps = {params: Promise<{slug: string}>};

const audiences: TAudience[] = ['kids', 'adults', 'family'];

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
	const [site, directions, home] = await Promise.all([getSite(), getDirections(), getHome()]);

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

			<Section title={'Направления центра'}>
				<div className={'grid gap-8 md:grid-cols-3'}>
					{audiences.map((audience) => {
						const items = directions.filter((direction) => direction.audience === audience);
						if (items.length === 0) return null;
						return (
							<div key={audience}>
								<Heading level={3} size={'sm'}>
									{audienceLabels[audience]}
								</Heading>
								<ul className={'mt-3 flex flex-col'}>
									{items.map((direction) => (
										<li key={direction.slug}>
											<Link
												href={direction.path}
												className={
													'flex min-h-11 items-center gap-2 font-semibold text-ink hover:text-brand-800'
												}
											>
												<Icon name={'chevron-right'} size={16} className={'text-brand-700'} />
												{direction.shortTitle}
											</Link>
										</li>
									))}
								</ul>
							</div>
						);
					})}
				</div>
			</Section>

			<CtaBand title={home.cta.heading} />
			<JsonLd data={await studioJsonLd(studio)} />
		</>
	);
}
