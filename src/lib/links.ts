import {redirects} from '@/content/redirects';

import {LEAD_ANCHOR} from './site';

export type TResolvedHref = {
	href: string;
	/**
	 * `internal` (next/link), `hash` (same-page anchor), `external` (new tab), `file` (local PDF/document, new tab,
	 * never routed through next/link), `other` (tel:, mailto:, ...).
	 */
	kind: 'internal' | 'hash' | 'external' | 'file' | 'other';
};

const FILE_EXTENSION = /\.(?:pdf|docx?|xlsx?|pptx?|zip|rar|mov|mp4|jpe?g|png|webp|avif|svg)$/i;
const OLD_ORIGIN = /^https?:\/\/(?:www\.)?personamodel\.ru(?=[/?#]|$)/i;

function safeDecode(value: string): string {
	try {
		return decodeURI(value);
	} catch {
		return value;
	}
}

function withTrailingSlash(path: string): string {
	return path.endsWith('/') ? path : `${path}/`;
}

/** Old path -> new path, with raw and percent-encoded Cyrillic sources folded into one key. */
const redirectMap = new Map<string, string>(
	redirects.map((redirect) => [withTrailingSlash(safeDecode(redirect.source)), redirect.destination])
);

/**
 * Normalises a link coming from content:
 * - `#form` (the old lead anchor) -> `#zapis`;
 * - absolute links to the old site (`https://personamodel.ru/...`) -> the new internal path (via `redirects`);
 * - everything else is classified so the renderer can pick next/link or a plain anchor.
 */
export function resolveHref(input: string): TResolvedHref {
	if (input === '#form') return {href: LEAD_ANCHOR, kind: 'hash'};
	if (input.startsWith('#')) return {href: input, kind: 'hash'};

	let value = input;
	if (OLD_ORIGIN.test(value)) {
		value = value.replace(OLD_ORIGIN, '') || '/';
		if (!value.startsWith('/')) value = `/${value}`;
	}

	if (value.startsWith('/') && !value.startsWith('//')) {
		const match = /^([^?#]*)([?#].*)?$/.exec(value);
		const path = match?.[1] ?? value;
		const rest = match?.[2] ?? '';
		const mapped = redirectMap.get(withTrailingSlash(safeDecode(path)));
		const target = mapped ?? path;
		return {href: `${target}${rest}`, kind: FILE_EXTENSION.test(target) ? 'file' : 'internal'};
	}

	if (/^https?:\/\//i.test(value)) return {href: value, kind: 'external'};
	return {href: value, kind: 'other'};
}
