import {faqAnswerText} from '@/cms/richtext';
import {
	mapBlocks,
	mapCards,
	mapImage,
	mapImages,
	mapOptionalLink,
	mapSeo,
	mapVideos,
	requireImage,
	slugsOf,
	texts
} from '@/lib/cms/mappers/common';

import type {
	TDirection,
	TDirectionSection,
	TFaqItem,
	TNewsPost,
	TPage,
	TPageSection,
	TReview,
	TStudio,
	TTeacher
} from '@/content/types';
import type {Direction, FaqItem, News, Page, Review, Studio, Teacher} from '@/payload-types';

export const pagePaths: Record<TPage['id'], string> = {
	about: '/o-nas/',
	events: '/sobytiya/',
	festivals: '/festivali/',
	privacy: '/politika-konfidencialnosti/'
};

function mapDirectionSection(section: NonNullable<Direction['sections']>[number]): TDirectionSection {
	switch (section.blockType) {
		case 'intro':
			return {type: 'intro', blocks: mapBlocks(section.blocks)};
		case 'programme': {
			const result: TDirectionSection = {type: 'programme', items: mapCards(section.items)};
			if (section.heading) {
				result.heading = section.heading;
			}
			return result;
		}
		case 'article':
			return {type: 'article', blocks: mapBlocks(section.blocks)};
		case 'howClassesGo':
			return {type: 'howClassesGo', heading: section.heading, videos: mapVideos(section.videos)};
	}
}

export function mapDirection(doc: Direction): TDirection {
	return {
		id: doc.slug,
		wpId: doc.wpId ?? 0,
		slug: doc.slug,
		path: `/napravleniya/${doc.slug}/`,
		title: doc.title,
		shortTitle: doc.shortTitle,
		audience: doc.audience,
		category: doc.category,
		excerpt: doc.excerpt,
		tagline: doc.tagline ?? null,
		highlightBullets: doc.highlightBullets && doc.highlightBullets.length > 0 ? texts(doc.highlightBullets) : null,
		cardImage: mapImage(doc.cardImage, 'direction.cardImage') ?? null,
		hero: {
			heading: doc.hero.heading,
			subheading: doc.hero.subheading ?? null,
			image: mapImage(doc.hero.image, 'direction.hero.image') ?? null
		},
		sections: (doc.sections ?? []).map(mapDirectionSection),
		teacherIds: slugsOf(doc.teachers, 'direction.teachers'),
		seo: mapSeo(doc.seo),
		oldPaths: doc.oldPaths ?? [],
		order: doc.order,
		lastModified: doc.lastModified ?? ''
	};
}

export function mapStudio(doc: Studio): TStudio {
	return {
		id: doc.slug,
		slug: doc.slug,
		wpId: doc.wpId ?? 0,
		path: `/studii/${doc.slug}/`,
		name: doc.name,
		shortName: doc.shortName,
		address: doc.address,
		metro: doc.metro ?? [],
		hours: doc.hours,
		phones: doc.phones ?? [],
		email: doc.email,
		mapLink: doc.mapLink,
		mapEmbedUrl: doc.mapEmbedUrl,
		geo: {lat: doc.geo.lat, lon: doc.geo.lon},
		photos: mapImages(doc.photos, 'studio.photos'),
		seo: mapSeo(doc.seo),
		order: doc.order,
		oldPaths: doc.oldPaths ?? [],
		lastModified: doc.lastModified ?? ''
	};
}

export function mapTeacher(doc: Teacher): TTeacher {
	return {
		id: doc.slug,
		wpPopupId: doc.wpPopupId ?? 0,
		name: doc.name,
		role: doc.role ?? null,
		photo: requireImage(doc.photo, 'teacher.photo'),
		cardPhoto: requireImage(doc.cardPhoto, 'teacher.cardPhoto'),
		bio: mapBlocks(doc.bio),
		directionSlugs: slugsOf(doc.directions, 'teacher.directions'),
		isManagement: Boolean(doc.isManagement),
		order: doc.order
	};
}

export function mapFaqItem(doc: FaqItem): TFaqItem {
	const answer = mapBlocks(doc.answer);
	return {id: doc.key, question: doc.question, answer, answerText: faqAnswerText(answer), order: doc.order};
}

export function mapReview(doc: Review): TReview {
	const review: TReview = {id: doc.key ?? String(doc.id), source: doc.source, author: doc.author, text: doc.text};
	if (doc.rating !== null && doc.rating !== undefined) review.rating = doc.rating;
	if (doc.date) review.date = doc.date;
	if (doc.url) review.url = doc.url;
	return review;
}

export function mapNewsPost(doc: News): TNewsPost {
	const post: TNewsPost = {
		id: doc.key ?? doc.slug,
		slug: doc.slug,
		title: doc.title,
		excerpt: doc.excerpt,
		body: mapBlocks(doc.body),
		publishedAt: doc.publishedAt
	};
	const cover = mapImage(doc.cover, 'news.cover');
	if (cover) post.cover = cover;
	return post;
}

function mapPageSection(section: NonNullable<Page['sections']>[number]): TPageSection {
	switch (section.blockType) {
		case 'hero': {
			const result: TPageSection = {type: 'hero', heading: section.heading};
			if (section.subheading) result.subheading = section.subheading;
			const cta = mapOptionalLink(section.cta);
			if (cta) result.cta = cta;
			const image = mapImage(section.image, 'page hero image');
			if (image) result.image = image;
			return result;
		}
		case 'cardSection': {
			const result: TPageSection = {type: 'cards', items: mapCards(section.items)};
			if (section.heading) result.heading = section.heading;
			return result;
		}
		case 'article':
			return {type: 'article', blocks: mapBlocks(section.blocks)};
		case 'video': {
			const result: TPageSection = {type: 'video', videos: mapVideos(section.videos)};
			if (section.heading) result.heading = section.heading;
			return result;
		}
		case 'downloads':
			return {
				type: 'downloads',
				heading: section.heading,
				items: (section.items ?? []).map((item) => ({
					label: item.label,
					href: item.href,
					sizeBytes: item.sizeBytes
				}))
			};
	}
}

export function mapPage(doc: Page): TPage {
	return {
		id: doc.key,
		path: pagePaths[doc.key],
		h1: doc.h1,
		sections: (doc.sections ?? []).map(mapPageSection),
		seo: mapSeo(doc.seo),
		oldPaths: doc.oldPaths ?? [],
		lastModified: doc.lastModified ?? ''
	};
}
