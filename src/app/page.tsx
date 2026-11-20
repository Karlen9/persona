import Image from 'next/image';

import {CtaBand} from '@/components/blocks/CtaBand';
import {DirectionCard} from '@/components/blocks/DirectionCard';
import {GalleryTabs} from '@/components/blocks/GalleryTabs';
import {HomeHero} from '@/components/blocks/HomeHero';
import {StudioCard} from '@/components/blocks/StudioCard';
import {VideoGrid} from '@/components/blocks/VideoGrid';
import {GisReviewsLink, YandexRatingBadge} from '@/components/integrations/YandexRatingBadge';
import {Accordion, faqJsonLd} from '@/components/ui/Accordion';
import {ButtonLink} from '@/components/ui/ButtonLink';
import {Card} from '@/components/ui/Card';
import {Carousel} from '@/components/ui/Carousel';
import {Container} from '@/components/ui/Container';
import {Gallery} from '@/components/ui/Gallery';
import {Heading} from '@/components/ui/Heading';
import {Icon} from '@/components/ui/Icon';
import {JsonLd} from '@/components/ui/JsonLd';
import {RichText} from '@/components/ui/RichText';
import {Section} from '@/components/ui/Section';
import {getDirection, home, homeFaq, studios} from '@/content';
import {centreJsonLd} from '@/lib/jsonld';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export const metadata: Metadata = buildMetadata({seo: home.seo, path: home.path});

export default function HomePage(): ReactNode {
	const highlighted = home.directions.cards.flatMap((card) => {
		const direction = getDirection(card.slug);
		return direction ? [{card, direction}] : [];
	});
	const posters = home.directions.posterSlugs.flatMap((slug) => {
		const direction = getDirection(slug);
		return direction?.cardImage ? [{direction, image: direction.cardImage}] : [];
	});

	return (
		<>
			<HomeHero
				title={home.hero.heading}
				lines={home.hero.headingLines}
				accent={home.hero.headingAccent}
				text={home.hero.text}
				image={home.hero.image}
				primaryCta={home.hero.cta}
				secondaryCta={{label: 'Все направления', href: '/napravleniya/'}}
				socials={home.hero.socials}
			/>

			<Section
				id={'napravleniya'}
				title={home.directions.heading}
				action={
					<ButtonLink href={'/napravleniya/'} variant={'secondary'}>
						{'Все направления'}
					</ButtonLink>
				}
			>
				<Carousel id={'home-directions'} label={home.directions.heading}>
					{highlighted.map(({card, direction}) => (
						<DirectionCard
							key={card.slug}
							title={card.title}
							href={direction.path}
							bullets={card.bullets}
						/>
					))}
				</Carousel>

				<Heading level={3} className={'mt-12 mb-6'}>
					{`${home.directions.posterHeading} `}
					<span className={'text-brand-700'}>{home.directions.posterAccent}</span>
				</Heading>
				<Carousel
					id={'home-posters'}
					label={`${home.directions.posterHeading} ${home.directions.posterAccent}`}
					slideClassName={'w-[58%] sm:w-[34%] lg:w-[22.5%]'}
				>
					{posters.map(({direction, image}) => (
						<DirectionCard
							key={direction.slug}
							variant={'poster'}
							title={direction.shortTitle}
							href={direction.path}
							image={image}
							imageSizes={'(min-width: 1200px) 270px, (min-width: 640px) 34vw, 58vw'}
						/>
					))}
				</Carousel>
			</Section>

			<Section variant={'tinted'}>
				<div className={'grid items-center gap-8 lg:grid-cols-2 lg:gap-14'}>
					<div className={'relative aspect-[549/525] overflow-hidden rounded-card shadow-pop'}>
						<Image
							src={home.learn.image.src}
							alt={home.learn.image.alt}
							fill
							sizes={'(min-width: 1200px) 560px, (min-width: 1024px) 45vw, 100vw'}
							className={'object-cover'}
						/>
					</div>
					<div>
						<Heading level={2}>{home.learn.heading}</Heading>
						<p className={'mt-4 text-lg'}>{home.learn.text}</p>
						<ul className={'mt-6 flex flex-col gap-3'}>
							{home.learn.list.map((item) => (
								<li key={item.text} className={'flex items-start gap-3'}>
									<span
										className={
											'mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-800'
										}
									>
										<Icon name={'check'} size={14} />
									</span>
									{item.text}
								</li>
							))}
						</ul>
						<div className={'mt-8'}>
							<ButtonLink href={home.learn.cta.href} size={'lg'}>
								{home.learn.cta.label}
							</ButtonLink>
						</div>
					</div>
				</div>
			</Section>

			<Section title={home.advantagesHeading}>
				<ul className={'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'}>
					{home.advantages.map((item, index) => (
						<li key={item.title}>
							<Card className={'flex h-full flex-col overflow-hidden'}>
								{item.image ? (
									<Image
										src={item.image.src}
										alt={item.image.alt}
										width={item.image.width}
										height={item.image.height}
										sizes={
											'(min-width: 1200px) 384px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
										}
										className={'aspect-[16/9] w-full bg-surface object-cover'}
									/>
								) : null}
								<div className={'flex flex-1 flex-col gap-3 p-6'}>
									<span
										aria-hidden
										className={
											'grid size-10 place-items-center rounded-full bg-accent-100 text-lg font-extrabold text-accent-700'
										}
									>
										{index + 1}
									</span>
									<h3 className={'text-lg leading-snug font-extrabold text-ink'}>{item.title}</h3>
									<p className={'text-[15px]'}>{item.text}</p>
								</div>
							</Card>
						</li>
					))}
				</ul>
			</Section>

			<Section
				id={home.performances.anchor}
				variant={'tinted'}
				eyebrow={home.performances.subheading}
				title={home.performances.heading}
			>
				<VideoGrid
					videos={home.performances.videos}
					label={home.performances.heading}
					columnsClassName={'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'}
					sizes={'(min-width: 1200px) 180px, (min-width: 768px) 33vw, 50vw'}
				/>
			</Section>

			<Section id={'studii'} title={home.studio.heading}>
				<ul className={'grid gap-5 sm:grid-cols-2 lg:grid-cols-4'}>
					{studios.map((studio) => (
						<li key={studio.slug}>
							<StudioCard
								name={studio.shortName}
								href={studio.path}
								address={studio.address}
								metro={studio.metro.join(', ')}
								image={studio.photos[0]}
								imageSizes={'(min-width: 1200px) 280px, (min-width: 640px) 45vw, 100vw'}
							/>
						</li>
					))}
				</ul>
				<Gallery images={home.studio.photos} columns={4} aspect={'portrait'} className={'mt-10'} />
			</Section>

			<Section id={'galereya'} variant={'tinted'} eyebrow={home.gallery.subheading} title={home.gallery.heading}>
				<GalleryTabs tabs={home.gallery.tabs} />
			</Section>

			<CtaBand id={home.cta.anchorId} title={home.cta.heading} cta={home.cta.button} image={home.cta.image} />

			<Section id={'voprosy'} eyebrow={homeFaq.subheading} title={homeFaq.heading}>
				<Accordion
					openFirst
					items={homeFaq.items.map((item) => ({
						question: item.question,
						answer: <RichText blocks={item.answer} />,
						answerText: item.answerText
					}))}
				/>
				<ul className={'mt-8 flex flex-wrap gap-3'}>
					{homeFaq.askButtons.map((button) => (
						<li key={button.href}>
							<ButtonLink href={button.href} variant={'secondary'}>
								{button.label}
							</ButtonLink>
						</li>
					))}
				</ul>
				<JsonLd
					data={faqJsonLd(
						homeFaq.items.map((item) => ({question: item.question, answerText: item.answerText}))
					)}
				/>
			</Section>

			<section className={'pb-section md:pb-section-lg'} aria-labelledby={'home-rating-title'}>
				<Container>
					<Card className={'flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:p-8'}>
						<h2 id={'home-rating-title'} className={'text-xl font-extrabold text-ink'}>
							{'Отзывы'}
						</h2>
						<div className={'flex flex-wrap items-center gap-4 sm:ml-auto'}>
							<YandexRatingBadge />
							<GisReviewsLink />
							<ButtonLink href={'/otzyvy/'} variant={'ghost'} size={'sm'}>
								{'Все отзывы'}
							</ButtonLink>
						</div>
					</Card>
				</Container>
			</section>

			<JsonLd data={centreJsonLd()} />
		</>
	);
}
