import {directions, directionsIndexPage} from './directions';
import {homeFaq} from './faq';
import {home} from './home';
import {newsPage, newsPosts} from './news';
import {aboutPage, eventsPage, festivalsPage, pages, privacyPage, schedulePage} from './pages';
import {priceList, tariffsPage} from './pricing';
import {reviews, reviewsPage} from './reviews';
import {site} from './site';
import {studios} from './studios';
import {teachers, teamPage} from './teachers';
import {contentTodos} from './todos';
import {redirects} from './redirects';

import type {TDirection, TPriceRow, TRoute, TStudio, TTeacher} from './types';

export type * from './types';

export {
	aboutPage,
	contentTodos,
	directions,
	directionsIndexPage,
	eventsPage,
	festivalsPage,
	home,
	homeFaq,
	newsPage,
	newsPosts,
	pages,
	priceList,
	privacyPage,
	redirects,
	reviews,
	reviewsPage,
	schedulePage,
	site,
	studios,
	tariffsPage,
	teachers,
	teamPage
};

export {
	audienceLabels,
	directionCategoryLabels,
	directionPageTemplate,
	getDirectionsByAudience,
	getDirectionsByCategory
} from './directions';

export function getDirection(slug: string): TDirection | undefined {
	return directions.find((direction) => direction.slug === slug);
}

export function getStudio(slug: string): TStudio | undefined {
	return studios.find((studio) => studio.slug === slug);
}

export function getTeacher(id: string): TTeacher | undefined {
	return teachers.find((teacher) => teacher.id === id);
}

export function getTeachersByDirection(slug: string): TTeacher[] {
	return teachers.filter((teacher) => teacher.directionSlugs.includes(slug));
}

/** Price-list rows (group first, then individual) that price the given direction. */
export function getPriceRowsForDirection(slug: string): {groupId: 'group' | 'individual'; row: TPriceRow}[] {
	return priceList.groups.flatMap((group) =>
		group.rows.filter((row) => row.directionSlugs.includes(slug)).map((row) => ({groupId: group.id, row}))
	);
}

/** `+74993933005` -> `+7 (499) 393-30-05` (falls back to the input for numbers that are not in `site.phones`). */
export function formatPhone(e164: string): string {
	return site.phones.find((phone) => phone.tel === e164)?.display ?? e164;
}

/** Every public path of the new site with its last-modified date (WordPress `modified_gmt`), for the sitemap. */
export function getAllRoutes(): TRoute[] {
	const simple: {path: string; lastModified: string}[] = [
		home,
		directionsIndexPage,
		aboutPage,
		teamPage,
		schedulePage,
		tariffsPage,
		reviewsPage,
		newsPage,
		festivalsPage,
		eventsPage,
		privacyPage
	];
	return [
		...simple.map(({path, lastModified}) => ({path, lastModified})),
		...directions.map(({path, lastModified}) => ({path, lastModified})),
		...studios.map(({path, lastModified}) => ({path, lastModified}))
	];
}
