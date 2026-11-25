/** Server only: a lazily built, process-wide engine for the `/poisk/` page. */
import {buildSearchDocs} from './buildDocs';
import {createSearchEngine} from './engine';

import type {TSearchEngine} from './engine';

let cached: TSearchEngine | null = null;

export function getServerSearchEngine(): TSearchEngine {
	cached ??= createSearchEngine(buildSearchDocs());
	return cached;
}
