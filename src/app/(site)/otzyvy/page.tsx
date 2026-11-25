import {PageHero} from '@/components/blocks/PageHero';
import {ReviewCard} from '@/components/blocks/ReviewCard';
import {GisReviewsLink, YandexRatingBadge} from '@/components/integrations/YandexRatingBadge';
import {YandexReviews} from '@/components/integrations/YandexReviews';
import {ButtonLink} from '@/components/ui/ButtonLink';
import {RichText} from '@/components/ui/RichText';
import {Section} from '@/components/ui/Section';
import {getReviews, getReviewsPage, getSite} from '@/lib/cms';
import {buildMetadata} from '@/lib/seo';
import {getSiteInfo} from '@/lib/siteInfo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export async function generateMetadata(): Promise<Metadata> {
	const reviewsPage = await getReviewsPage();
	return buildMetadata({seo: reviewsPage.seo, path: reviewsPage.path});
}

const sourceLabels = {yandex: 'Яндекс Карты', '2gis': '2ГИС', manual: ''} as const;

export default async function ReviewsPage(): Promise<ReactNode> {
	const [reviews, reviewsPage, site, info] = await Promise.all([
		getReviews(),
		getReviewsPage(),
		getSite(),
		getSiteInfo()
	]);
	return (
		<>
			<PageHero breadcrumbs={[{label: reviewsPage.h1}]} title={reviewsPage.h1} cta={null}>
				<div className={'mt-6'}>
					<RichText blocks={reviewsPage.intro} className={'text-lg sm:text-xl'} />
				</div>
				<div className={'mt-7 flex flex-wrap items-center gap-4'}>
					<ButtonLink href={reviewsPage.reviewLink} size={'lg'}>
						{'Оставить отзыв'}
					</ButtonLink>
					<YandexRatingBadge badgeUrl={site.yandex.ratingBadgeUrl} orgUrl={site.yandex.orgUrl} />
					<GisReviewsLink url={info.gisReviewsUrl} />
				</div>
			</PageHero>

			{reviews.length > 0 ? (
				<Section variant={'tinted'}>
					<ul className={'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'}>
						{reviews.map((review) => (
							<li key={review.id}>
								<ReviewCard
									author={review.author}
									text={review.text}
									rating={review.rating}
									meta={[sourceLabels[review.source], review.date].filter(Boolean).join(', ')}
								/>
							</li>
						))}
					</ul>
				</Section>
			) : null}

			<Section className={'pt-0 md:pt-0'}>
				<YandexReviews
					widgetUrl={reviewsPage.widgetUrl}
					orgUrl={site.yandex.orgUrl}
					title={'Отзывы на Яндекс Картах'}
				/>
			</Section>
		</>
	);
}
