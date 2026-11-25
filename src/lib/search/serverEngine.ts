import 'server-only';

import {cache} from 'react';

import {buildSearchDocs} from './buildDocs';
import {createSearchEngine} from './engine';

import type {TSearchEngine} from './engine';

/** Server only: the engine for the `/poisk/` page. Built per request so CMS edits show up immediately. */
export const getServerSearchEngine = cache(
	async (): Promise<TSearchEngine> => createSearchEngine(await buildSearchDocs())
);
