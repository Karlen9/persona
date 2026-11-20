import Link from 'next/link';
import {notFound} from 'next/navigation';

import {CtaBand} from '@/components/blocks/CtaBand';
import {DirectionCard} from '@/components/blocks/DirectionCard';
import {PageHero} from '@/components/blocks/PageHero';
import {PriceGroupTable} from '@/components/blocks/PriceGroupTable';
import {ProgrammeGrid} from '@/components/blocks/ProgrammeGrid';
import {TeacherCard} from '@/components/blocks/TeacherCard';
import {VideoGrid} from '@/components/blocks/VideoGrid';
import {ButtonLink} from '@/components/ui/ButtonLink';
import {Icon} from '@/components/ui/Icon';
import {JsonLd} from '@/components/ui/JsonLd';
import {RichText} from '@/components/ui/RichText';
import {Section} from '@/components/ui/Section';
import {
	directionPageTemplate,
	directions,
	getDirection,
	getPriceRowsForDirection,
	getTeachersByDirection,
	home,
	priceList
} from '@/content';
import {courseJsonLd} from '@/lib/jsonld';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';
import type {TDirection, TDirectionSection} from '@/content';

type TPageProps = {params: Promise<{slug: string}>};

export const dynamicParams = false;

export function generateStaticParams(): {slug: string}[] {
	return directions.map((direction) => ({slug: direction.slug}));
}

export async function generateMetadata({params}: TPageProps): Promise<Metadata> {
	const {slug} = await params;
	const direction = getDirection(slug);
	if (!direction) return {};
	return buildMetadata({seo: direction.seo, path: direction.path});
}

function renderSection(section: TDirectionSection, index: number, direction: TDirection): ReactNode {
	switch (section.type) {
		case 'intro':
			return (
				<Section key={index}>
					<RichText blocks={section.blocks} />
				</Section>
			);
		case 'programme':
			return (
				<Section key={index} variant={'tinted'} title={section.heading}>
					<ProgrammeGrid items={section.items} />
				</Section>
			);
		case 'article':
			return (
				<Section key={index}>
					<RichText blocks={section.blocks} />
				</Section>
			);
		case 'howClassesGo':
			if (section.videos.length === 0) return null;
			return (
				<Section key={index} variant={'tinted'} title={section.heading}>
					<VideoGrid
						videos={section.videos}
						label={`${direction.shortTitle}: как проходят занятия`}
						columnsClassName={'grid-cols-2 md:grid-cols-3'}
						sizes={'(min-width: 1200px) 384px, (min-width: 768px) 33vw, 50vw'}
					/>
				</Section>
			);
	}
}

export default async function DirectionPage({params}: TPageProps): Promise<ReactNode> {
	const {slug} = await params;
	const direction = getDirection(slug);
	if (!direction) notFound();

	const teachers = getTeachersByDirection(direction.slug);
	const priceRows = getPriceRowsForDirection(direction.slug);
	const priceGroups = priceList.groups.flatMap((group) => {
		const rows = priceRows.filter((item) => item.groupId === group.id).map((item) => item.row);
		return rows.length > 0 ? [{group, rows}] : [];
	});
	const related = directionPageTemplate.related.slugs
		.filter((relatedSlug) => relatedSlug !== direction.slug)
		.flatMap((relatedSlug) => {
			const item = getDirection(relatedSlug);
			return item ? [item] : [];
		});

	return (
		<>
			<PageHero
				breadcrumbs={[{label: 'Направления', href: '/napravleniya/'}, {label: direction.title}]}
				title={direction.hero.heading}
				lead={direction.hero.subheading ?? undefined}
				image={direction.hero.image ?? undefined}
				cta={directionPageTemplate.cta}
				secondaryCta={directionPageTemplate.scheduleButton}
			/>

			{direction.sections.map((section, index) => renderSection(section, index, direction))}

			<nav aria-label={'Разделы центра'} className={'mx-auto w-full max-w-site px-4 pb-section sm:px-6 lg:px-8'}>
				<ul className={'flex flex-wrap gap-3'}>
					{directionPageTemplate.navLinks.map((link) => (
						<li key={link.href}>
							<ButtonLink href={link.href} variant={'secondary'}>
								{link.label}
							</ButtonLink>
						</li>
					))}
				</ul>
			</nav>

			{teachers.length > 0 ? (
				<Section
					variant={'tinted'}
					title={'Педагоги направления'}
					action={
						<ButtonLink href={'/komanda/'} variant={'secondary'}>
							{'Вся команда'}
						</ButtonLink>
					}
				>
					<ul className={'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'}>
						{teachers.map((teacher) => (
							<li key={teacher.id}>
								<TeacherCard name={teacher.name} role={teacher.role} photo={teacher.cardPhoto} />
							</li>
						))}
					</ul>
				</Section>
			) : null}

			{priceGroups.length > 0 ? (
				<Section
					title={'Цены'}
					action={
						<Link
							href={'/tarify/'}
							className={
								'inline-flex min-h-11 items-center gap-1.5 font-bold text-brand-800 hover:underline'
							}
						>
							{'Полный прайс-лист'}
							<Icon name={'arrow-right'} size={18} />
						</Link>
					}
				>
					<div className={'flex flex-col gap-6'}>
						{priceGroups.map(({group, rows}) => (
							<PriceGroupTable key={group.id} group={group} rows={rows} compact />
						))}
					</div>
				</Section>
			) : null}

			{related.length > 0 ? (
				<Section
					variant={'tinted'}
					eyebrow={directionPageTemplate.related.subheading}
					title={directionPageTemplate.related.heading}
				>
					<ul className={'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'}>
						{related.map((item) => (
							<li key={item.slug}>
								<DirectionCard
									title={item.shortTitle}
									href={item.path}
									bullets={item.highlightBullets ?? undefined}
									text={item.highlightBullets ? undefined : item.excerpt}
								/>
							</li>
						))}
					</ul>
				</Section>
			) : null}

			<CtaBand title={home.cta.heading} cta={directionPageTemplate.cta} />
			<JsonLd data={courseJsonLd(direction)} />
		</>
	);
}
