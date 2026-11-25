/** Client-safe: must not import `@/content`. */
import MiniSearch from 'minisearch';

import {fixKeyboardLayout, processTerm, tokenize} from './normalize';

import type {TSearchDoc, TSearchDocType} from './types';

export type TSearchHit = {doc: TSearchDoc; score: number; terms: string[]};
export type TSearchResult = {hits: TSearchHit[]; correctedQuery: string | null};
export type TSearchEngine = {search: (query: string, limit?: number) => TSearchResult};

const DOC_BOOST: Record<TSearchDocType, number> = {
	direction: 2.2,
	studio: 1.3,
	page: 1.1,
	price: 1.0,
	teacher: 0.8,
	faq: 0.9,
	document: 0.9
};

/** Hub pages that should win generic intent queries (price, signup, contacts). */
const DOC_ID_BOOST: Record<string, number> = {'page:tariffs': 2.5, 'page:schedule': 2.2, 'page:studios': 3};

const DEFAULT_LIMIT = 20;

export function createSearchEngine(docs: TSearchDoc[]): TSearchEngine {
	const byId = new Map<string, TSearchDoc>(docs.map((doc) => [doc.id, doc]));
	const index = new MiniSearch<TSearchDoc>({
		fields: ['title', 'keywords', 'subtitle', 'body'],
		idField: 'id',
		storeFields: [],
		tokenize: (text) => tokenize(text),
		processTerm: (term) => processTerm(term)
	});
	index.addAll(docs);

	function run(query: string, combineWith: 'AND' | 'OR'): TSearchHit[] {
		return index
			.search(query, {
				combineWith,
				boost: {title: 6, keywords: 3, subtitle: 1.5, body: 1},
				prefix: (term) => term.length >= 2,
				fuzzy: (term) => (term.length >= 7 ? 0.25 : term.length >= 4 ? 1 : false),
				weights: {fuzzy: 0.4, prefix: 0.7},
				boostDocument: (id) => {
					const doc = byId.get(id);
					return doc ? DOC_BOOST[doc.type] * (DOC_ID_BOOST[id] ?? 1) : 1;
				}
			})
			.flatMap((result) => {
				const doc = byId.get(result.id);
				return doc ? [{doc, score: result.score, terms: result.terms}] : [];
			});
	}

	function runBoth(query: string): TSearchHit[] {
		const strict = run(query, 'AND');
		return strict.length > 0 ? strict : run(query, 'OR');
	}

	function search(rawQuery: string, limit = DEFAULT_LIMIT): TSearchResult {
		const query = rawQuery.trim();
		if (query.length === 0) return {hits: [], correctedQuery: null};

		let hits = runBoth(query);
		let correctedQuery: string | null = null;
		const converted = fixKeyboardLayout(query);
		if (converted !== null && converted !== query) {
			const alternative = runBoth(converted);
			const rawTop = hits[0]?.score ?? 0;
			const altTop = alternative[0]?.score ?? 0;
			if (hits.length === 0 ? alternative.length > 0 : altTop > rawTop * 2) {
				hits = alternative;
				correctedQuery = converted;
			}
		}
		return {hits: hits.slice(0, limit), correctedQuery};
	}

	return {search};
}
