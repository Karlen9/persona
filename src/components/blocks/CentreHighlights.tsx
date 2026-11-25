import Image from 'next/image';

import {GalleryTabs} from '@/components/blocks/GalleryTabs';
import {GisReviewsLink, YandexRatingBadge} from '@/components/integrations/YandexRatingBadge';
import {Accordion, faqJsonLd} from '@/components/ui/Accordion';
import {ButtonLink} from '@/components/ui/ButtonLink';
import {Card} from '@/components/ui/Card';
import {Container} from '@/components/ui/Container';
import {Heading} from '@/components/ui/Heading';
import {Icon} from '@/components/ui/Icon';
import {JsonLd} from '@/components/ui/JsonLd';
import {RichText} from '@/components/ui/RichText';
import {Section} from '@/components/ui/Section';
import {getHome, getHomeFaq, getSite} from '@/lib/cms';
import {getSiteInfo} from '@/lib/siteInfo';

import type {ReactNode} from 'react';

/** Content that used to live on the home page: why PersOna, advantages, gallery, FAQ and ratings. */
export async function CentreHighlights(): Promise<ReactNode> {
	const [home, homeFaq, site, info] = await Promise.all([getHome(), getHomeFaq(), getSite(), getSiteInfo()]);
	return (
		<>
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

			<Section id={'galereya'} variant={'tinted'} eyebrow={home.gallery.subheading} title={home.gallery.heading}>
				<GalleryTabs tabs={home.gallery.tabs} />
			</Section>

			<Section id={'voprosy'} eyebrow={homeFaq.subheading} title={homeFaq.heading}>
				<Accordion
					openFirst
					items={homeFaq.items.map((item) => ({
						id: item.id,
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
							<YandexRatingBadge badgeUrl={site.yandex.ratingBadgeUrl} orgUrl={site.yandex.orgUrl} />
							<GisReviewsLink url={info.gisReviewsUrl} />
							<ButtonLink href={'/otzyvy/'} variant={'ghost'} size={'sm'}>
								{'Все отзывы'}
							</ButtonLink>
						</div>
					</Card>
				</Container>
			</section>
		</>
	);
}
