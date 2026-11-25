import 'server-only';

import {cache} from 'react';

import {getPayloadClient} from '@/lib/cms/payload';
import {
	mapDirection,
	mapFaqItem,
	mapNewsPost,
	mapPage,
	mapReview,
	mapStudio,
	mapTeacher
} from '@/lib/cms/mappers/content';
import {
	mapCover,
	mapDirectionsIndex,
	mapDirectionTemplate,
	mapHome,
	mapHomeFaqSection,
	mapNavigation,
	mapNewsPage,
	mapReviewsPage,
	mapSchedulePage,
	mapSite,
	mapTariffs,
	mapTeamPage
} from '@/lib/cms/mappers/globals';

import type {TCoverEntry, TCoverEntryId, TCoverStory} from '@/content/cover';
import type {TFooterColumn, TNavItem, TNavLink} from '@/content/navigation';
import type {
	TAudience,
	TDirection,
	TDirectionCategory,
	TDirectionPageTemplate,
	TDirectionsIndexPage,
	TFaqSection,
	THome,
	TNewsPage,
	TNewsPost,
	TPage,
	TPhone,
	TPriceList,
	TPriceRow,
	TReview,
	TReviewsPage,
	TRoute,
	TSchedulePage,
	TSite,
	TStudio,
	TTariffsPage,
	TTeacher,
	TTeamPage
} from '@/content/types';
import type {DataFromCollectionSlug, DataFromGlobalSlug} from 'payload';

const EMPTY_MESSAGE = 'CMS is empty — run bun run seed';

const DEPTH = 1;

type TGlobalSlug =
	| 'site-settings'
	| 'navigation'
	| 'direction-template'
	| 'home'
	| 'home-faq'
	| 'tariffs'
	| 'directions-index'
	| 'team-page'
	| 'reviews-page'
	| 'news-page'
	| 'schedule-page'
	| 'cover';

type TCollectionSlug = 'directions' | 'studios' | 'teachers' | 'faq-items' | 'reviews' | 'news' | 'pages';

// Published docs only; `overrideAccess` because the public site reads through the Local API, not the REST API.
async function readGlobal<S extends TGlobalSlug>(slug: S): Promise<DataFromGlobalSlug<S>> {
	const client = await getPayloadClient();
	const doc = await client.findGlobal({slug, depth: DEPTH, overrideAccess: true, draft: false});
	if (doc._status !== 'published') {
		throw new Error(EMPTY_MESSAGE);
	}
	return doc;
}

async function readCollection<S extends TCollectionSlug>(
	slug: S,
	sort: string,
	required = true
): Promise<DataFromCollectionSlug<S>[]> {
	const payload = await getPayloadClient();
	const result = await payload.find({
		collection: slug,
		where: {_status: {equals: 'published'}},
		sort,
		limit: 0,
		depth: DEPTH,
		overrideAccess: true,
		draft: false
	});
	if (required && result.docs.length === 0) {
		throw new Error(EMPTY_MESSAGE);
	}
	return result.docs;
}

// ---------------------------------------------------------------------------------------------------------------------
// Globals
// ---------------------------------------------------------------------------------------------------------------------

export const getSite = cache(async (): Promise<TSite> => mapSite(await readGlobal('site-settings')));

export const getNavigation = cache(
	async (): Promise<{mainNav: TNavItem[]; footerNav: TFooterColumn[]; sectionLinks: TNavLink[]}> =>
		mapNavigation(await readGlobal('navigation'))
);

export const getHome = cache(async (): Promise<THome> => mapHome(await readGlobal('home')));

export const getDirectionPageTemplate = cache(
	async (): Promise<TDirectionPageTemplate> => mapDirectionTemplate(await readGlobal('direction-template'))
);

export const getDirectionsIndexPage = cache(
	async (): Promise<TDirectionsIndexPage> => mapDirectionsIndex(await readGlobal('directions-index'))
);

export const getTeamPage = cache(async (): Promise<TTeamPage> => mapTeamPage(await readGlobal('team-page')));

export const getTariffsPage = cache(async (): Promise<TTariffsPage> => mapTariffs(await readGlobal('tariffs')));

export const getPriceList = cache(async (): Promise<TPriceList> => (await getTariffsPage()).priceList);

export const getReviewsPage = cache(
	async (): Promise<TReviewsPage> => mapReviewsPage(await readGlobal('reviews-page'))
);

export const getNewsPage = cache(async (): Promise<TNewsPage> => mapNewsPage(await readGlobal('news-page')));

export const getSchedulePage = cache(
	async (): Promise<TSchedulePage> => mapSchedulePage(await readGlobal('schedule-page'))
);

// ---------------------------------------------------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------------------------------------------------

export const getDirections = cache(
	async (): Promise<TDirection[]> => (await readCollection('directions', 'order')).map(mapDirection)
);

export const getDirection = cache(
	async (slug: string): Promise<TDirection | undefined> =>
		(await getDirections()).find((direction) => direction.slug === slug)
);

export const getDirectionsByAudience = cache(
	async (audience: TAudience): Promise<TDirection[]> =>
		(await getDirections()).filter((direction) => direction.audience === audience)
);

export const getDirectionsByCategory = cache(
	async (category: TDirectionCategory): Promise<TDirection[]> =>
		(await getDirections()).filter((direction) => direction.category === category)
);

export const getStudios = cache(
	async (): Promise<TStudio[]> => (await readCollection('studios', 'order')).map(mapStudio)
);

export const getStudio = cache(
	async (slug: string): Promise<TStudio | undefined> => (await getStudios()).find((studio) => studio.slug === slug)
);

export const getTeachers = cache(
	async (): Promise<TTeacher[]> => (await readCollection('teachers', 'order')).map(mapTeacher)
);

export const getTeacher = cache(
	async (id: string): Promise<TTeacher | undefined> => (await getTeachers()).find((teacher) => teacher.id === id)
);

export const getTeachersByDirection = cache(
	async (slug: string): Promise<TTeacher[]> =>
		(await getTeachers()).filter((teacher) => teacher.directionSlugs.includes(slug))
);

export const getReviews = cache(
	async (): Promise<TReview[]> => (await readCollection('reviews', '-date', false)).map(mapReview)
);

export const getNewsPosts = cache(
	async (): Promise<TNewsPost[]> => (await readCollection('news', '-publishedAt', false)).map(mapNewsPost)
);

const PAGE_ORDER: TPage['id'][] = ['about', 'events', 'festivals', 'privacy'];

export const getPages = cache(async (): Promise<TPage[]> => {
	const pages = (await readCollection('pages', 'key')).map(mapPage);
	return pages.sort((a, b) => PAGE_ORDER.indexOf(a.id) - PAGE_ORDER.indexOf(b.id));
});

export const getPage = cache(
	async (key: TPage['id']): Promise<TPage | undefined> => (await getPages()).find((page) => page.id === key)
);

/** Like `getPage`, but throws when the page is missing (the CMS has not been seeded). */
export const requirePage = cache(async (key: TPage['id']): Promise<TPage> => {
	const page = await getPage(key);
	if (!page) throw new Error(EMPTY_MESSAGE);
	return page;
});

export const getHomeFaq = cache(async (): Promise<TFaqSection> => {
	const items = (await readCollection('faq-items', 'order')).map(mapFaqItem);
	return mapHomeFaqSection(await readGlobal('home-faq'), items);
});

// ---------------------------------------------------------------------------------------------------------------------
// Derived
// ---------------------------------------------------------------------------------------------------------------------

/** Price-list rows (group first, then individual) that price the given direction. */
export const getPriceRowsForDirection = cache(
	async (slug: string): Promise<{groupId: 'group' | 'individual'; row: TPriceRow}[]> =>
		(await getPriceList()).groups.flatMap((group) =>
			group.rows.filter((row) => row.directionSlugs.includes(slug)).map((row) => ({groupId: group.id, row}))
		)
);

/** `+74993933005` -> `+7 (499) 393-30-05` (falls back to the input for numbers that are not in the site phones). */
export function formatPhoneFrom(phones: TPhone[], e164: string): string {
	return phones.find((phone) => phone.tel === e164)?.display ?? e164;
}

export const formatPhone = async (e164: string): Promise<string> => formatPhoneFrom((await getSite()).phones, e164);

export type TCover = {
	entries: TCoverEntry[];
	story: TCoverStory;
	getEntry: (id: TCoverEntryId) => TCoverEntry;
	getNextEntry: (id: TCoverEntryId) => TCoverEntry;
};

export const getCover = cache(async (): Promise<TCover> => {
	const [doc, priceList] = await Promise.all([readGlobal('cover'), getPriceList()]);
	const {entries, story} = mapCover(doc, priceList.trialLesson.priceRub);
	return {
		entries,
		story,
		getEntry(id) {
			const entry = entries.find((item) => item.id === id);
			if (!entry) throw new Error(`cover: unknown cover entry "${id}"`);
			return entry;
		},
		getNextEntry(id) {
			const index = entries.findIndex((item) => item.id === id);
			if (index === -1) throw new Error(`cover: unknown cover entry "${id}"`);
			return entries[(index + 1) % entries.length] as TCoverEntry;
		}
	};
});

/** Every public path of the site with its last-modified date, for the sitemap. */
export const getAllRoutes = cache(async (): Promise<TRoute[]> => {
	const [home, directionsIndex, about, team, schedule, tariffs, reviews, news, festivals, events, privacy] =
		await Promise.all([
			getHome(),
			getDirectionsIndexPage(),
			getPage('about'),
			getTeamPage(),
			getSchedulePage(),
			getTariffsPage(),
			getReviewsPage(),
			getNewsPage(),
			getPage('festivals'),
			getPage('events'),
			getPage('privacy')
		]);
	const [directions, studios] = await Promise.all([getDirections(), getStudios()]);
	const simple = [home, directionsIndex, about, team, schedule, tariffs, reviews, news, festivals, events, privacy];
	return [
		...simple.map((page) => {
			if (!page) throw new Error(EMPTY_MESSAGE);
			return {path: page.path, lastModified: page.lastModified};
		}),
		...directions.map(({path, lastModified}) => ({path, lastModified})),
		...studios.map(({path, lastModified}) => ({path, lastModified}))
	];
});
