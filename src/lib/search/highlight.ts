import {normalizeText, stemRu} from './normalize';

export type TSegment = {text: string; match: boolean};

const WORD = /[\p{L}\p{N}]+/gu;

function wordMatches(word: string, terms: string[]): boolean {
	const stem = stemRu(normalizeText(word));
	if (stem.length < 2) return false;
	return terms.some((term) => term.length >= 2 && (stem.startsWith(term) || term.startsWith(stem)));
}

/** Splits `text` into plain and matched runs without altering a single character. */
export function highlightSegments(text: string, terms: string[]): TSegment[] {
	if (terms.length === 0 || text.length === 0) return [{text, match: false}];
	const segments: TSegment[] = [];
	let cursor = 0;
	const push = (value: string, match: boolean): void => {
		if (value.length === 0) return;
		const last = segments[segments.length - 1];
		if (last && last.match === match) last.text += value;
		else segments.push({text: value, match});
	};
	for (const found of text.matchAll(WORD)) {
		const start = found.index ?? 0;
		push(text.slice(cursor, start), false);
		push(found[0], wordMatches(found[0], terms));
		cursor = start + found[0].length;
	}
	push(text.slice(cursor), false);
	return segments;
}

/** A short excerpt around the first matching word, cut on word boundaries. */
export function makeSnippet(text: string, terms: string[], radius = 70): string {
	const value = text.replace(/\s+/g, ' ').trim();
	const fallback = (): string => {
		if (value.length <= 140) return value;
		const cut = value.lastIndexOf(' ', 140);
		return `${value.slice(0, cut > 60 ? cut : 140)}…`;
	};
	if (value.length === 0 || terms.length === 0) return fallback();

	let matchStart = -1;
	for (const found of value.matchAll(WORD)) {
		if (wordMatches(found[0], terms)) {
			matchStart = found.index ?? 0;
			break;
		}
	}
	if (matchStart === -1) return fallback();

	let from = Math.max(0, matchStart - radius);
	let to = Math.min(value.length, matchStart + radius);
	if (from > 0) {
		const space = value.indexOf(' ', from);
		from = space === -1 || space > matchStart ? from : space + 1;
	}
	if (to < value.length) {
		const space = value.lastIndexOf(' ', to);
		to = space > matchStart ? space : to;
	}
	return `${from > 0 ? '…' : ''}${value.slice(from, to).trim()}${to < value.length ? '…' : ''}`;
}
