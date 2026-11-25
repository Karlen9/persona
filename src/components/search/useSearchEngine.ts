import {useEffect, useState} from 'react';

import {createSearchEngine} from '@/lib/search/engine';

import type {TSearchEngine} from '@/lib/search/engine';
import type {TSearchDoc} from '@/lib/search/types';

export type TSearchStatus = 'idle' | 'loading' | 'ready' | 'error';

let enginePromise: Promise<TSearchEngine> | null = null;
let loadedEngine: TSearchEngine | null = null;

/** Fetches `/search-index/` once, builds the engine and caches it for the lifetime of the page. */
export function loadSearchEngine(): Promise<TSearchEngine> {
	if (!enginePromise) {
		enginePromise = fetch('/search-index/')
			.then((response) => {
				if (!response.ok) throw new Error(`search index: ${response.status}`);
				return response.json() as Promise<TSearchDoc[]>;
			})
			.then((docs) => {
				loadedEngine = createSearchEngine(docs);
				return loadedEngine;
			})
			.catch((error: unknown) => {
				enginePromise = null;
				throw error;
			});
	}
	return enginePromise;
}

/** Warms the index on intent (pointerenter / focus / touchstart of the trigger). */
export function prefetchSearch(): void {
	loadSearchEngine().catch(() => undefined);
}

type TSearchEngineState = {engine: TSearchEngine | null; status: TSearchStatus};

export function useSearchEngine(enabled: boolean): TSearchEngineState & {retry: () => void} {
	const [state, setState] = useState<TSearchEngineState>(() =>
		loadedEngine ? {engine: loadedEngine, status: 'ready'} : {engine: null, status: 'idle'}
	);
	const [attempt, setAttempt] = useState(0);

	useEffect(() => {
		if (!enabled) return;
		if (loadedEngine) {
			setState({engine: loadedEngine, status: 'ready'});
			return;
		}
		let cancelled = false;
		setState({engine: null, status: 'loading'});
		loadSearchEngine()
			.then((engine) => {
				if (!cancelled) setState({engine, status: 'ready'});
			})
			.catch(() => {
				if (!cancelled) setState({engine: null, status: 'error'});
			});
		return () => {
			cancelled = true;
		};
	}, [enabled, attempt]);

	return {...state, retry: () => setAttempt((value) => value + 1)};
}
