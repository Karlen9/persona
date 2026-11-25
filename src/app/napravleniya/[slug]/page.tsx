import {notFound} from 'next/navigation';

import {CtaBand} from '@/components/blocks/CtaBand';
import {DirectionCard} from '@/components/blocks/DirectionCard';
import {PageHero} from '@/components/blocks/PageHero';
import {ProgrammeGrid} from '@/components/blocks/ProgrammeGrid';
import {TeacherCard} from '@/components/blocks/TeacherCard';
import {VideoGrid} from '@/components/blocks/VideoGrid';
import {ButtonLink} from '@/components/ui/ButtonLink';
import {Carousel} from '@/components/ui/Carousel';
import {JsonLd} from '@/components/ui/JsonLd';
import {RichText} from '@/components/ui/RichText';
import {Section} from '@/components/ui/Section';
import {directionPageTemplate, directions, getDirection, getTeachersByDirection, home} from '@/content';
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
					<RichText blocks={section.blocks} cardTone={'plain'} leadLayout={'rows'} />
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
					<RichText blocks={section.blocks} cardTone={'plain'} leadLayout={'rows'} />
				</Section>
			);
		case 'howClassesGo':
			if (section.videos.length === 0) return null;
			return (
				<Section key={index} variant={'tinted'} title={section.heading}>
					<VideoGrid
						videos={section.videos}
						label={`${direction.shortTitle}: как проходят занятия`}
						columnsClassName={'mx-auto max-w-4xl grid-cols-2 md:grid-cols-3'}
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
	const others = directions.filter((item) => item.slug !== direction.slug);

	return (
		<>
			<PageHero
				variant={'cover'}
				breadcrumbs={[{label: 'Направления', href: '/napravleniya/'}, {label: direction.title}]}
				title={direction.hero.heading}
				lead={direction.hero.subheading ?? undefined}
				image={direction.hero.image ?? undefined}
				cta={directionPageTemplate.cta}
				secondaryCta={directionPageTemplate.scheduleButton}
			/>

			{direction.sections.map((section, index) => renderSection(section, index, direction))}

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

			{others.length > 0 ? (
				<Section
					variant={'tinted'}
					eyebrow={directionPageTemplate.related.subheading}
					title={directionPageTemplate.related.heading}
				>
					<Carousel
						id={'related-directions'}
						label={'Другие направления'}
						slideClassName={'w-[62%] sm:w-[38%] lg:w-[23.5%]'}
					>
						{others.map((item) => (
							<DirectionCard
								key={item.slug}
								variant={'poster'}
								title={item.shortTitle}
								href={item.path}
								image={item.cardImage ?? undefined}
								text={item.excerpt}
								imageSizes={'(min-width: 1024px) 280px, (min-width: 640px) 38vw, 62vw'}
							/>
						))}
					</Carousel>
				</Section>
			) : null}

			<CtaBand title={home.cta.heading} cta={directionPageTemplate.cta} />
			<JsonLd data={courseJsonLd(direction)} />
		</>
	);
}
