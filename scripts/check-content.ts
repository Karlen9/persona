/**
 * Content sanity check. Run from the repo root:  bun scripts/check-content.ts
 *
 * - every local media/doc path referenced by the content exists under public/
 * - every one of the 37 old sitemap URLs is either a live route or has a redirect
 * - every redirect destination is a live route or an existing public file
 * - every direction has a title, excerpt, hero and body sections
 *
 * Tooling only: not imported by the app.
 */
import {existsSync, readdirSync, statSync} from 'node:fs';
import {join, resolve} from 'node:path';

import * as content from '../src/content/index';
import {contentTodos, directions, getAllRoutes, redirects, studios, teachers} from '../src/content/index';

const root = resolve(process.cwd());
const publicDir = join(root, 'public');
const errors: string[] = [];

const localPaths = new Set<string>();
function walk(value: unknown): void {
	if (typeof value === 'string') {
		if (/^\/(media|docs)\//.test(value)) {
			localPaths.add(value);
		}
	} else if (Array.isArray(value)) {
		value.forEach(walk);
	} else if (value && typeof value === 'object') {
		Object.values(value).forEach(walk);
	}
}
for (const exported of Object.values(content)) {
	if (typeof exported !== 'function') {
		walk(exported);
	}
}

for (const p of localPaths) {
	if (!existsSync(join(publicDir, p))) {
		errors.push(`missing file: ${p}`);
	}
}

// Every TImage object ({src: '/media/...', width, height, alt}): file exists (above), has real dimensions and alt text.
// Programme-card photos (TProgrammeItem.image) are also counted so a lost photo shows up in the log.
let imageObjects = 0;
let cardPhotos = 0;
function checkImages(value: unknown, trail: string): void {
	if (Array.isArray(value)) {
		value.forEach((v, i) => checkImages(v, `${trail}[${i}]`));
	} else if (value && typeof value === 'object') {
		const o = value as Record<string, unknown>;
		if (typeof o.src === 'string' && o.src.startsWith('/media/') && 'width' in o) {
			imageObjects += 1;
			if (!(typeof o.width === 'number' && o.width > 0 && typeof o.height === 'number' && o.height > 0)) {
				errors.push(`image without real width/height: ${o.src} (${trail})`);
			}
			if (typeof o.alt !== 'string' || o.alt.trim() === '') {
				errors.push(`image without alt text: ${o.src} (${trail})`);
			}
		}
		if ('title' in o && 'text' in o && 'image' in o) {
			cardPhotos += 1;
		}
		for (const [k, v] of Object.entries(o)) checkImages(v, `${trail}.${k}`);
	}
}
for (const [name, exported] of Object.entries(content)) {
	if (typeof exported !== 'function') checkImages(exported, name);
}

const OLD_URLS = [
	'/areas/inzhenernyj-klub-megavolt/',
	'/areas/bachata/',
	'/areas/barre-fitnes/',
	'/areas/pilates/',
	'/areas/art-masterskaya/',
	'/areas/igra-na-muzykalnyh-instrumentah/',
	'/areas/logoped/',
	'/studios/yazykovaya-shkola/',
	'/areas/joga/',
	'/areas/podgotovka-k-shkole/',
	'/areas/robototehnika/',
	'/areas/shahmaty/',
	'/studios/teatralynaya_studiya/',
	'/areas/risovanie/',
	'/studios/vokalynaya_studiya/',
	'/studios/teatr_tanca/',
	'/studios/shkola_modeley/',
	'/areas/prodlenka/',
	'/районы/семенная-школа/',
	'/areas/individualnye-zanyati-dlya-vzroslyh/',
	'/areas/dlya-vzroslyh/',
	'/areas/salsa-i-bachata/',
	'/',
	'/privacy-policy/',
	'/content/organizaciya-prazdnikov/',
	'/content/festivalnoe-dvizhenie/',
	'/o-nas/',
	'/content/studiya-profsoyuznaya/',
	'/content/nashi-pedagogi/',
	'/news/',
	'/otzyvy/',
	'/tarify/',
	'/brunches/',
	'/content/raspisanie/',
	'/content/studiya-solntsevo/',
	'/content/studiya-michurinskiy/',
	'/content/studiya-slavyan/'
];
const routes = new Set(getAllRoutes().map((r) => r.path));
const sources = new Set(redirects.map((r) => r.source));
for (const old of OLD_URLS) {
	if (!routes.has(old) && !sources.has(old)) {
		errors.push(`old URL neither a route nor redirected: ${old}`);
	}
}
for (const encoded of [
	'/%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%D1%8B/%D1%81%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F-%D1%88%D0%BA%D0%BE%D0%BB%D0%B0/'
]) {
	if (!sources.has(encoded)) {
		errors.push(`missing percent-encoded redirect: ${encoded}`);
	}
}
for (const r of redirects) {
	const dest = r.destination;
	if (!routes.has(dest) && !existsSync(join(publicDir, dest))) {
		errors.push(`redirect target does not exist: ${r.source} -> ${dest}`);
	}
	if (!r.source.endsWith('/') && !r.source.endsWith('.pdf')) {
		errors.push(`redirect source without trailing slash: ${r.source}`);
	}
}

if (directions.length !== 21) {
	errors.push(`expected 21 directions, got ${directions.length}`);
}
if (studios.length !== 4) {
	errors.push(`expected 4 studios, got ${studios.length}`);
}
if (teachers.length !== 26) {
	errors.push(`expected 26 teachers, got ${teachers.length}`);
}
for (const d of directions) {
	if (!d.title || !d.excerpt || !d.hero.heading || d.sections.length === 0 || !d.seo.title || !d.seo.description) {
		errors.push(`direction ${d.slug} is missing title/excerpt/hero/sections/seo`);
	}
	if (!d.sections.some((s) => s.type === 'article' || s.type === 'programme')) {
		errors.push(`direction ${d.slug} has no body sections`);
	}
}
const dup = (xs: string[]): string[] => xs.filter((x, i) => xs.indexOf(x) !== i);
for (const d of dup([...directions.map((x) => x.slug), ...studios.map((x) => x.slug), ...teachers.map((x) => x.id)])) {
	errors.push(`duplicate id/slug: ${d}`);
}

function dirSize(dir: string): {bytes: number; files: number} {
	let bytes = 0;
	let files = 0;
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		const st = statSync(full);
		if (st.isDirectory()) {
			const sub = dirSize(full);
			bytes += sub.bytes;
			files += sub.files;
		} else {
			bytes += st.size;
			files += 1;
		}
	}
	return {bytes, files};
}
const media = dirSize(join(publicDir, 'media'));
console.log(
	`checked ${localPaths.size} local paths, ${routes.size} routes, ${redirects.length} redirects, ${contentTodos.length} todos`
);
console.log(`${imageObjects} image objects, ${cardPhotos} cards with a photo`);
console.log(`public/media: ${media.files} files, ${(media.bytes / 1e6).toFixed(1)} MB`);
if (errors.length > 0) {
	console.error(errors.join('\n'));
	process.exit(1);
}
console.log('OK');
