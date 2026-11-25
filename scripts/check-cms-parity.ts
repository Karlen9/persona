/**
 * Compares every getter of the CMS read layer (`src/lib/cms`) with the static modules in `src/content/`.
 * `TImage.src` may differ (it must point at the same file); everything else must be strictly equal.
 * Exits with code 1 on any difference.
 */
import * as content from '@/content';
import * as cover from '@/content/cover';
import * as navigation from '@/content/navigation';
import * as cms from '@/lib/cms';

import {diff, formatDiffs} from './lib/diff';

import type {TDiff} from './lib/diff';

type TCheck = {name: string; run: () => Promise<TDiff[]>};

const checks: TCheck[] = [];
const check = (name: string, expected: () => unknown, actual: () => Promise<unknown>): void => {
	checks.push({name, run: async () => diff(expected(), await actual())});
};

// Singletons and lists
check(
	'getSite',
	() => content.site,
	() => cms.getSite()
);
check(
	'getNavigation',
	() => navigation,
	async () => {
		const {mainNav, footerNav, sectionLinks} = await cms.getNavigation();
		return {mainNav, footerNav, sectionLinks};
	}
);
check(
	'getHome',
	() => content.home,
	() => cms.getHome()
);
check(
	'getHomeFaq',
	() => content.homeFaq,
	() => cms.getHomeFaq()
);
check(
	'getDirections',
	() => content.directions,
	() => cms.getDirections()
);
check(
	'getDirectionPageTemplate',
	() => content.directionPageTemplate,
	() => cms.getDirectionPageTemplate()
);
check(
	'getDirectionsIndexPage',
	() => content.directionsIndexPage,
	() => cms.getDirectionsIndexPage()
);
check(
	'getStudios',
	() => content.studios,
	() => cms.getStudios()
);
check(
	'getTeachers',
	() => content.teachers,
	() => cms.getTeachers()
);
check(
	'getTeamPage',
	() => content.teamPage,
	() => cms.getTeamPage()
);
check(
	'getTariffsPage',
	() => content.tariffsPage,
	() => cms.getTariffsPage()
);
check(
	'getPriceList',
	() => content.priceList,
	() => cms.getPriceList()
);
check(
	'getReviews',
	() => content.reviews,
	() => cms.getReviews()
);
check(
	'getReviewsPage',
	() => content.reviewsPage,
	() => cms.getReviewsPage()
);
check(
	'getNewsPosts',
	() => content.newsPosts,
	() => cms.getNewsPosts()
);
check(
	'getNewsPage',
	() => content.newsPage,
	() => cms.getNewsPage()
);
check(
	'getPages',
	() => content.pages,
	() => cms.getPages()
);
check(
	'getSchedulePage',
	() => content.schedulePage,
	() => cms.getSchedulePage()
);
check(
	'getAllRoutes',
	() => content.getAllRoutes(),
	() => cms.getAllRoutes()
);

// Cover (entries, story and helpers)
check(
	'getCover.entries',
	() => cover.coverEntries,
	async () => (await cms.getCover()).entries
);
check(
	'getCover.story',
	() => cover.coverStory,
	async () => (await cms.getCover()).story
);
for (const entry of cover.coverEntries) {
	check(
		`getCover.getEntry(${entry.id})`,
		() => cover.getCoverEntry(entry.id),
		async () => (await cms.getCover()).getEntry(entry.id)
	);
	check(
		`getCover.getNextEntry(${entry.id})`,
		() => cover.getNextCoverEntry(entry.id),
		async () => (await cms.getCover()).getNextEntry(entry.id)
	);
}

// Keyed getters
for (const direction of content.directions) {
	check(
		`getDirection(${direction.slug})`,
		() => content.getDirection(direction.slug),
		() => cms.getDirection(direction.slug)
	);
	check(
		`getTeachersByDirection(${direction.slug})`,
		() => content.getTeachersByDirection(direction.slug),
		() => cms.getTeachersByDirection(direction.slug)
	);
	check(
		`getPriceRowsForDirection(${direction.slug})`,
		() => content.getPriceRowsForDirection(direction.slug),
		() => cms.getPriceRowsForDirection(direction.slug)
	);
}
check(
	'getDirection(unknown)',
	() => undefined,
	() => cms.getDirection('net-takogo')
);
for (const audience of ['kids', 'adults', 'family'] as const) {
	check(
		`getDirectionsByAudience(${audience})`,
		() => content.getDirectionsByAudience(audience),
		() => cms.getDirectionsByAudience(audience)
	);
}
for (const category of Object.keys(
	content.directionCategoryLabels
) as (keyof typeof content.directionCategoryLabels)[]) {
	check(
		`getDirectionsByCategory(${category})`,
		() => content.getDirectionsByCategory(category),
		() => cms.getDirectionsByCategory(category)
	);
}
for (const studio of content.studios) {
	check(
		`getStudio(${studio.slug})`,
		() => content.getStudio(studio.slug),
		() => cms.getStudio(studio.slug)
	);
}
for (const teacher of content.teachers) {
	check(
		`getTeacher(${teacher.id})`,
		() => content.getTeacher(teacher.id),
		() => cms.getTeacher(teacher.id)
	);
}
for (const page of content.pages) {
	check(
		`getPage(${page.id})`,
		() => page,
		() => cms.getPage(page.id)
	);
}
for (const phone of ['+74993933005', '+79251508738', '+79995944060', '+70000000000']) {
	check(
		`formatPhone(${phone})`,
		() => content.formatPhone(phone),
		() => cms.formatPhone(phone)
	);
}

async function main(): Promise<void> {
	let failed = 0;
	for (const {name, run} of checks) {
		let diffs: TDiff[];
		try {
			diffs = await run();
		} catch (error) {
			diffs = [
				{path: '(threw)', expected: 'a value', actual: error instanceof Error ? error.message : String(error)}
			];
		}
		if (diffs.length > 0) {
			failed += diffs.length;
			console.log(`FAIL ${name}: ${diffs.length} difference(s)\n${formatDiffs(diffs)}`);
		}
	}
	console.log(`\nchecked ${checks.length} getter calls: ${failed} differences`);
	process.exit(failed === 0 ? 0 : 1);
}

// `payload run` exits as soon as the script module has loaded, so the work has to be awaited at the top level.
try {
	await main();
} catch (error) {
	console.error(error);
	process.exit(1);
}
