/**
 * Prints `{ "<old path>": {newPath, images: ["/media/...", ...]} }` as JSON: every local image the rebuilt content
 * references, per old URL (redirected old URLs share the images of their destination page).
 * Input for scripts/audit_images.py.   bun scripts/content-images.ts
 */
import * as content from '../src/content/index';
import {
	directions,
	directionsIndexPage,
	home,
	newsPage,
	redirects,
	studios,
	teachers,
	teamPage
} from '../src/content/index';

type TEntry = {newPath: string | null; images: Set<string>};

function collect(value: unknown, out: Set<string>): void {
	if (typeof value === 'string') {
		if (/^\/media\//.test(value)) out.add(value);
	} else if (Array.isArray(value)) {
		value.forEach((v) => collect(v, out));
	} else if (value && typeof value === 'object') {
		Object.values(value).forEach((v) => collect(v, out));
	}
}

const result: Record<string, TEntry> = {};
function add(oldPaths: string[], newPath: string | null, ...values: unknown[]): void {
	for (const oldPath of oldPaths) {
		const entry = (result[oldPath] ??= {newPath, images: new Set()});
		values.forEach((v) => collect(v, entry.images));
	}
}

for (const direction of directions) add(direction.oldPaths, direction.path, direction);
for (const studio of studios) add(studio.oldPaths, studio.path, studio);
add(['/'], '/', home);
add(
	directionsIndexPage.oldPaths,
	directionsIndexPage.path,
	directionsIndexPage,
	directions.map((d) => d.cardImage)
);
add(teamPage.oldPaths, teamPage.path, teamPage, teachers);
add(newsPage.oldPaths, newsPage.path, newsPage, content.newsPosts);
// Every other export that carries `oldPaths` (pages, tariffs, reviews, ...).
for (const exported of Object.values(content)) {
	const items = Array.isArray(exported) ? exported : [exported];
	for (const item of items) {
		if (
			item &&
			typeof item === 'object' &&
			'oldPaths' in item &&
			Array.isArray((item as {oldPaths: unknown}).oldPaths)
		) {
			const typed = item as {oldPaths: string[]; path?: string};
			add(typed.oldPaths, typed.path ?? null, item);
		}
	}
}
// Old URLs that only redirect (e.g. /areas/salsa-i-bachata/) show what their destination page shows.
const byNewPath = new Map(Object.values(result).flatMap((e) => (e.newPath ? [[e.newPath, e] as const] : [])));
for (const redirect of redirects) {
	const target = byNewPath.get(redirect.destination);
	if (target && !result[redirect.source]) {
		result[redirect.source] = {newPath: redirect.destination, images: target.images};
	}
}

console.log(
	JSON.stringify(
		Object.fromEntries(Object.entries(result).map(([k, v]) => [k, {newPath: v.newPath, images: [...v.images]}])),
		null,
		1
	)
);
