/**
 * Seeds the CMS from the static content modules in `src/content/`.
 *
 *   bun run seed            idempotent: creates what is missing and updates what differs
 *   bun run seed:reset      deletes all content documents and media first (same as `bun run seed reset`)
 *
 * The first admin user is created only when SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are both set and no user exists.
 */
import fs from 'node:fs';
import path from 'node:path';

import {getPayload} from 'payload';

import config from '@payload-config';
import {assertMigrated} from '@/lib/cms/assertMigrated';
import {coverEntries, coverStory} from '@/content/cover';
import {
	directionPageTemplate,
	directions,
	directionsIndexPage,
	homeFaq,
	home,
	newsPage,
	newsPosts,
	pages,
	reviews,
	reviewsPage,
	schedulePage,
	site,
	studios,
	tariffsPage,
	teachers,
	teamPage
} from '@/content';
import {footerNav, mainNav, sectionLinks} from '@/content/navigation';
import {mapDirection, mapFaqItem, mapPage, mapStudio, mapTeacher} from '@/lib/cms/mappers/content';
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

import {diff} from './lib/diff';
import {
	toCover,
	toDirection,
	toDirectionsIndex,
	toDirectionTemplate,
	toFaqItem,
	toHome,
	toHomeFaq,
	toNavigation,
	toNewsPage,
	toPage,
	toReviewsPage,
	toSchedulePage,
	toSite,
	toStudio,
	toTariffs,
	toTeacher,
	toTeamPage
} from './seed/convert';

import type {TImage} from '@/content/types';
import type {CollectionSlug, GlobalSlug, Payload} from 'payload';

const ROOT = process.cwd();
const CONTEXT = {seeding: true, disableRevalidate: true};
const CONTENT_COLLECTIONS: CollectionSlug[] = [
	'directions',
	'studios',
	'teachers',
	'faq-items',
	'reviews',
	'news',
	'pages'
];

// `payload run` drops `--flags` from argv, so a reset is also requested with a plain word (`bun run seed reset`),
// the `seed:reset` script or SEED_RESET=1.
const reset = process.argv.includes('--reset') || process.argv.includes('reset') || process.env.SEED_RESET === '1';

const MIME_TYPES: Record<string, string> = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.avif': 'image/avif'
};

// ---------------------------------------------------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------------------------------------------------

const mediaKey = (image: Pick<TImage, 'src' | 'alt' | 'altGenerated'>): string =>
	JSON.stringify([image.src, image.alt, Boolean(image.altGenerated)]);

function collectImages(value: unknown, found: Map<string, TImage>): void {
	if (Array.isArray(value)) {
		value.forEach((item) => collectImages(item, found));
	} else if (value && typeof value === 'object') {
		const candidate = value as Partial<TImage>;
		if (
			typeof candidate.src === 'string' &&
			typeof candidate.width === 'number' &&
			typeof candidate.height === 'number' &&
			typeof candidate.alt === 'string'
		) {
			found.set(mediaKey(candidate as TImage), candidate as TImage);
		} else {
			Object.values(value).forEach((item) => collectImages(item, found));
		}
	}
}

async function syncMedia(payload: Payload): Promise<Map<string, number>> {
	const found = new Map<string, TImage>();
	collectImages([site, home, directions, studios, teachers, pages, tariffsPage, teamPage, homeFaq], found);

	const missing = [...new Set([...found.values()].map((image) => image.src))].filter(
		(src) => !fs.existsSync(path.join(ROOT, 'public', src))
	);
	if (missing.length > 0) {
		throw new Error(`Seed images are missing from public/:\n  ${missing.join('\n  ')}`);
	}

	const existing = await payload.find({
		collection: 'media',
		limit: 0,
		depth: 0,
		pagination: false,
		overrideAccess: true
	});
	const ids = new Map<string, number>();
	for (const doc of existing.docs) {
		if (doc.legacySrc) {
			ids.set(mediaKey({src: doc.legacySrc, alt: doc.alt, altGenerated: doc.altGenerated ?? false}), doc.id);
		}
	}

	let created = 0;
	const mismatched: string[] = [];
	// The same file can be used with different alt texts; each variant is its own media document. The first keeps the
	// file name, further ones get a `--2`, `--3` … suffix (Payload's own renaming would pick an unrelated number).
	const variants = new Map<string, number>();
	for (const doc of existing.docs) {
		if (doc.legacySrc) variants.set(doc.legacySrc, (variants.get(doc.legacySrc) ?? 0) + 1);
	}
	for (const [key, image] of found) {
		if (ids.has(key)) continue;
		const variant = (variants.get(image.src) ?? 0) + 1;
		variants.set(image.src, variant);
		const extension = path.extname(image.src);
		const name = path.basename(image.src, extension) + (variant > 1 ? `--${variant}` : '') + extension;
		const data = fs.readFileSync(path.join(ROOT, 'public', image.src));
		const doc = await payload.create({
			collection: 'media',
			data: {alt: image.alt, altGenerated: Boolean(image.altGenerated), legacySrc: image.src},
			file: {
				data,
				name,
				mimetype: MIME_TYPES[extension.toLowerCase()] ?? 'application/octet-stream',
				size: data.length
			},
			overrideAccess: true,
			context: CONTEXT
		});
		ids.set(key, doc.id);
		created += 1;
		if (doc.width !== image.width || doc.height !== image.height) {
			mismatched.push(`${image.src}: seed ${image.width}x${image.height}, stored ${doc.width}x${doc.height}`);
		}
	}
	console.log(`media: ${found.size} unique images, ${created} created, ${found.size - created} already present`);
	if (mismatched.length > 0) {
		console.warn(`media: dimension mismatches\n  ${mismatched.join('\n  ')}`);
	}
	return ids;
}

// ---------------------------------------------------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------------------------------------------------

async function resetContent(payload: Payload): Promise<void> {
	for (const collection of [...CONTENT_COLLECTIONS, 'media'] as CollectionSlug[]) {
		const result = await payload.delete({
			collection,
			where: {id: {exists: true}},
			overrideAccess: true,
			context: CONTEXT
		});
		console.log(`reset: deleted ${result.docs.length} from ${collection}`);
	}
}

/** True when the CMS document already maps to exactly the seed value (nothing to write). */
function inSync(expected: unknown, read: () => unknown): boolean {
	try {
		return diff(expected, read()).length === 0;
	} catch {
		return false;
	}
}

async function main(): Promise<void> {
	const payload = await getPayload({config});
	await assertMigrated(payload);

	if (reset) {
		await resetContent(payload);
	}

	const mediaIds = await syncMedia(payload);
	const img = (image: TImage): number => {
		const id = mediaIds.get(mediaKey(image));
		if (id === undefined) throw new Error(`No media document for ${image.src}`);
		return id;
	};

	let created = 0;
	let updated = 0;
	let unchanged = 0;

	async function upsert<S extends CollectionSlug>(
		collection: S,
		key: {field: string; value: string},
		data: Record<string, unknown>,
		isSynced: (existing: never) => boolean
	): Promise<number> {
		const found = await payload.find({
			collection,
			where: {[key.field]: {equals: key.value}},
			limit: 1,
			depth: 1,
			overrideAccess: true,
			draft: false
		});
		const existing = found.docs[0];
		if (!existing) {
			const doc = await payload.create({
				collection,
				data: data as never,
				overrideAccess: true,
				draft: false,
				context: CONTEXT
			});
			created += 1;
			return doc.id as number;
		}
		if (isSynced(existing as never)) {
			unchanged += 1;
			return existing.id as number;
		}
		await payload.update({
			collection,
			id: existing.id,
			data: data as never,
			overrideAccess: true,
			draft: false,
			context: CONTEXT
		});
		console.log(`updated ${collection}/${key.value}`);
		updated += 1;
		return existing.id as number;
	}

	async function setGlobal(
		slug: GlobalSlug,
		data: Record<string, unknown>,
		isSynced: (existing: never) => boolean
	): Promise<void> {
		const existing = await payload.findGlobal({slug, depth: 1, overrideAccess: true, draft: false});
		if ((existing as {_status?: string})._status === 'published' && isSynced(existing as never)) {
			unchanged += 1;
			return;
		}
		await payload.updateGlobal({slug, data: data as never, overrideAccess: true, draft: false, context: CONTEXT});
		console.log(`updated global ${slug}`);
		updated += 1;
	}

	// Teachers and directions reference each other: create missing teachers first (without their directions), then
	// the directions (with their teachers), then bring the teachers (with their directions) in sync.
	const teacherIds = new Map<string, number>();
	for (const teacher of teachers) {
		const found = await payload.find({
			collection: 'teachers',
			where: {slug: {equals: teacher.id}},
			limit: 1,
			depth: 0,
			overrideAccess: true,
			draft: false
		});
		const existing = found.docs[0];
		if (existing) {
			teacherIds.set(teacher.id, existing.id);
		} else {
			const doc = await payload.create({
				collection: 'teachers',
				data: toTeacher(teacher, img, []),
				overrideAccess: true,
				draft: false,
				context: CONTEXT
			});
			teacherIds.set(teacher.id, doc.id);
		}
	}

	const directionIds = new Map<string, number>();
	for (const direction of directions) {
		directionIds.set(
			direction.slug,
			await upsert(
				'directions',
				{field: 'slug', value: direction.slug},
				toDirection(
					direction,
					img,
					direction.teacherIds.map((id) => teacherIds.get(id) as number)
				),
				(existing) => inSync(direction, () => mapDirection(existing))
			)
		);
	}
	const directionId = (slug: string): number => {
		const id = directionIds.get(slug);
		if (id === undefined) throw new Error(`Unknown direction "${slug}"`);
		return id;
	};

	for (const teacher of teachers) {
		await upsert(
			'teachers',
			{field: 'slug', value: teacher.id},
			toTeacher(teacher, img, teacher.directionSlugs.map(directionId)),
			(existing) => inSync(teacher, () => mapTeacher(existing))
		);
	}

	for (const studio of studios) {
		await upsert('studios', {field: 'slug', value: studio.slug}, toStudio(studio, img), (existing) =>
			inSync(studio, () => mapStudio(existing))
		);
	}

	for (const item of homeFaq.items) {
		await upsert('faq-items', {field: 'key', value: item.id}, toFaqItem(item, img), (existing) =>
			inSync(item, () => mapFaqItem(existing))
		);
	}

	for (const page of pages) {
		await upsert('pages', {field: 'key', value: page.id}, toPage(page, img), (existing) =>
			inSync(page, () => mapPage(existing))
		);
	}

	if (reviews.length > 0 || newsPosts.length > 0) {
		console.warn('seed: static reviews / news posts are not empty, but the seed does not import them yet');
	}

	await setGlobal('site-settings', toSite(site, img), (doc) => inSync(site, () => mapSite(doc)));
	await setGlobal('navigation', toNavigation({mainNav, footerNav, sectionLinks}), (doc) =>
		inSync({mainNav, footerNav, sectionLinks}, () => mapNavigation(doc))
	);
	await setGlobal('direction-template', toDirectionTemplate(directionPageTemplate, directionId), (doc) =>
		inSync(directionPageTemplate, () => mapDirectionTemplate(doc))
	);
	await setGlobal('home', toHome(home, img, directionId), (doc) => inSync(home, () => mapHome(doc)));
	await setGlobal('home-faq', toHomeFaq(homeFaq), (doc) =>
		inSync({...homeFaq, items: []}, () => mapHomeFaqSection(doc, []))
	);
	await setGlobal('tariffs', toTariffs(tariffsPage, img, directionId), (doc) =>
		inSync(tariffsPage, () => mapTariffs(doc))
	);
	await setGlobal('directions-index', toDirectionsIndex(directionsIndexPage, img, directionId), (doc) =>
		inSync(directionsIndexPage, () => mapDirectionsIndex(doc))
	);
	await setGlobal('team-page', toTeamPage(teamPage, img), (doc) => inSync(teamPage, () => mapTeamPage(doc)));
	await setGlobal('reviews-page', toReviewsPage(reviewsPage, img), (doc) =>
		inSync(reviewsPage, () => mapReviewsPage(doc))
	);
	await setGlobal('news-page', toNewsPage(newsPage, img), (doc) => inSync(newsPage, () => mapNewsPage(doc)));
	await setGlobal('schedule-page', toSchedulePage(schedulePage, img), (doc) =>
		inSync(schedulePage, () => mapSchedulePage(doc))
	);
	await setGlobal('cover', toCover(coverEntries, coverStory), (doc) =>
		inSync({entries: coverEntries, story: coverStory}, () =>
			mapCover(doc, tariffsPage.priceList.trialLesson.priceRub)
		)
	);

	console.log(`content: ${created} created, ${updated} updated, ${unchanged} unchanged`);

	const email = process.env.SEED_ADMIN_EMAIL;
	const password = process.env.SEED_ADMIN_PASSWORD;
	const users = await payload.count({collection: 'users', overrideAccess: true});
	if (users.totalDocs > 0) {
		console.log('admin: a user already exists, nothing to create');
	} else if (email && password) {
		await payload.create({
			collection: 'users',
			data: {email, password, name: 'Администратор', role: 'admin'},
			overrideAccess: true,
			context: CONTEXT
		});
		console.log(`admin: created ${email}`);
	} else {
		console.log('admin: no users yet — create the first one at /upravlenie/create-first-user');
	}
}

// `payload run` exits as soon as the script module has loaded, so the work has to be awaited at the top level.
try {
	await main();
} catch (error) {
	console.error(error);
	process.exit(1);
}
