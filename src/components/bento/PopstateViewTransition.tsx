'use client';

import {useEffect} from 'react';

import type {ReactNode} from 'react';

type TVtDocument = Document & {
	startViewTransition?: (update: () => Promise<void> | void) => {finished: Promise<unknown>};
};

const ATTR = '[data-tile-vt]';

// True while we re-dispatch a popstate ourselves, so our own capture listener lets it through.
let redispatching = false;

function setNames(elements: Element[], names?: Set<string>): Element[] {
	const named: Element[] = [];
	for (const el of elements) {
		const name = el.getAttribute('data-tile-vt');
		if (!name || (names && !names.has(name))) continue;
		const style = (el as HTMLElement).style;
		style.setProperty('view-transition-name', name);
		style.setProperty('view-transition-class', 'tile-morph');
		named.push(el);
	}
	return named;
}

function clearNames(elements: Element[]): void {
	for (const el of elements) {
		const style = (el as HTMLElement).style;
		style.removeProperty('view-transition-name');
		style.removeProperty('view-transition-class');
	}
}

function waitForSwap(oldElements: Element[]): Promise<void> {
	return new Promise((resolve) => {
		const started = performance.now();
		const tick = (): void => {
			if (oldElements.every((el) => !el.isConnected) || performance.now() - started > 300) resolve();
			else setTimeout(tick, 16);
		};
		tick();
	});
}

/**
 * React flushes popstate transitions synchronously and never starts a view transition for them, so browser
 * Back/Forward would not morph a section hero back into its bento tile. We intercept the event, wrap Next's handling
 * (a re-dispatched popstate) in `document.startViewTransition` and name the matching tiles/heroes ourselves.
 */
export function PopstateViewTransition(): ReactNode {
	useEffect(() => {
		const onPop = (event: PopStateEvent): void => {
			const doc = document as TVtDocument;
			if (redispatching || !doc.startViewTransition) return;
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
			if (!document.querySelector(ATTR)) return;

			event.stopImmediatePropagation();
			const state: unknown = event.state;
			const oldElements = setNames(Array.from(document.querySelectorAll(ATTR)));
			const oldNames = new Set(oldElements.map((el) => el.getAttribute('data-tile-vt') ?? ''));
			let newElements: Element[] = [];

			const transition = doc.startViewTransition(async () => {
				redispatching = true;
				try {
					window.dispatchEvent(new PopStateEvent('popstate', {state}));
				} finally {
					redispatching = false;
				}
				await waitForSwap(oldElements);
				clearNames(oldElements);
				newElements = setNames(Array.from(document.querySelectorAll(ATTR)), oldNames);
			});

			const cleanup = (): void => {
				clearNames(oldElements);
				clearNames(newElements);
			};
			transition.finished.then(cleanup, cleanup);
		};

		window.addEventListener('popstate', onPop, {capture: true});
		return () => window.removeEventListener('popstate', onPop, {capture: true});
	}, []);

	return null;
}
