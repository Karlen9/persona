// Generated from the personamodel.ru crawl of 2026-11-20 by scripts/generate_ts.py.
// Copy is verbatim; fix it here (or in the CMS that replaces this module).

import type {TReview, TReviewsPage} from './types';

/**
 * The live /otzyvy/ page stores no review text: all reviews live at Yandex Maps (org 165851817022) and
 * are shown through the Yandex reviews widget iframe. The array stays empty until reviews are mirrored here.
 */
export const reviews: TReview[] = [];

export const reviewsPage: TReviewsPage = {
	path: '/otzyvy/',
	h1: 'Отзывы',
	intro: [
		{
			type: 'paragraph',
			text: 'Понравилось работать с нами? Поделитесь своим опытом в отзыве на Яндекс.Картах по ссылке!',
			inline: [
				{
					text: 'Понравилось работать с нами? Поделитесь своим опытом в отзыве на Яндекс.Картах '
				},
				{
					text: 'по ссылке',
					href: 'https://yandex.ru/maps/-/CPeSuAn5'
				},
				{
					text: '!'
				}
			]
		}
	],
	reviewLink: 'https://yandex.ru/maps/-/CPeSuAn5',
	widgetUrl: 'https://yandex.ru/maps-reviews-widget/165851817022?comments',
	seo: {
		title: 'Отзывы - Persona - Art Center',
		description: 'Понравилось работать с нами? Поделитесь своим опытом в отзыве на Яндекс.Картах по ссылке!'
	},
	oldPaths: ['/otzyvy/'],
	lastModified: '2026-02-25T23:07:14Z'
};
