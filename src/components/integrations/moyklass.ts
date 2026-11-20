import {useEffect, useRef, useState} from 'react';

import {reachGoal} from './track';

import type {RefObject} from 'react';

const BASE = 'https://app.moyklass.com';
const SCRIPT_URL = `${BASE}/api/site/widget/`;

type TWidget = {init?: () => void; __personaMk?: number};

const loading = new Map<string, Promise<boolean>>();

function initWidgets(force: boolean): void {
	try {
		const widgets = (window as unknown as {WdgMoyklass?: Record<string, TWidget | undefined>}).WdgMoyklass ?? {};
		Object.keys(widgets).forEach((key) => {
			const widget = widgets[key];
			if (widget && typeof widget.init === 'function' && (force || !widget.__personaMk)) {
				widget.__personaMk = 1;
				widget.init();
			}
		});
	} catch {
		/* widget internals are third-party */
	}
}

/**
 * Injects the Moyklass widget script once and (like the current site) calls WdgMoyklass[*].init()
 * after load, because the script only self-initialises on DOMContentLoaded.
 * Resolves true when this call loaded the script, false when it had already been loaded.
 */
export function loadMoyklass(scriptId: string): Promise<boolean> {
	const existing = loading.get(scriptId);
	if (existing) return existing.then(() => false);

	const promise = new Promise<boolean>((resolve, reject) => {
		if (!document.querySelector('link[data-moyklass-preconnect]')) {
			const link = document.createElement('link');
			link.rel = 'preconnect';
			link.href = BASE;
			link.crossOrigin = 'anonymous';
			link.dataset.moyklassPreconnect = '1';
			document.head.appendChild(link);
		}
		const script = document.createElement('script');
		script.src = `${SCRIPT_URL}?id=${scriptId}`;
		script.charset = 'UTF-8';
		script.async = true;
		script.onload = () => {
			initWidgets(false);
			resolve(true);
		};
		script.onerror = () => {
			loading.delete(scriptId);
			script.remove();
			reject(new Error('Moyklass widget failed to load'));
		};
		document.body.appendChild(script);
	});
	loading.set(scriptId, promise);
	return promise;
}

export type TWidgetState = 'idle' | 'loading' | 'ready' | 'failed';

type TOptions = {
	scriptId: string;
	/** Also start loading when a link to this hash (e.g. #zapis) is clicked / is in the URL. */
	ctaHash?: string;
	rootMargin?: string;
	timeoutMs?: number;
	trackLead?: boolean;
};

/**
 * Lazy-loads a Moyklass widget for the container: when it is near the viewport (IntersectionObserver)
 * or when a CTA link is clicked. Reports ready when a mount node inside gets children.
 */
export function useMoyklassWidget(
	containerRef: RefObject<HTMLElement | null>,
	{scriptId, ctaHash, rootMargin = '400px', timeoutMs = 12000, trackLead}: TOptions
): TWidgetState {
	const [state, setState] = useState<TWidgetState>('idle');
	const started = useRef(false);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		let timer: number | undefined;

		const hasContent = (): boolean =>
			Array.from(container.querySelectorAll('[id^="SiteWidgetMoyklass"]')).some(
				(node) => node.childNodes.length > 0
			);

		const mutations = new MutationObserver(() => {
			if (hasContent()) {
				window.clearTimeout(timer);
				setState('ready');
			}
		});
		mutations.observe(container, {childList: true, subtree: true});

		const start = (): void => {
			if (started.current) return;
			started.current = true;
			setState('loading');
			timer = window.setTimeout(() => {
				if (!hasContent()) setState('failed');
			}, timeoutMs);
			loadMoyklass(scriptId)
				.then((fresh) => {
					// Remounted after SPA navigation: widget script is already there, re-run init.
					if (!fresh) initWidgets(true);
				})
				.catch(() => {
					window.clearTimeout(timer);
					setState('failed');
				});
		};

		let io: IntersectionObserver | undefined;
		if ('IntersectionObserver' in window) {
			io = new IntersectionObserver(
				(entries) => {
					if (entries.some((entry) => entry.isIntersecting)) {
						io?.disconnect();
						start();
					}
				},
				{rootMargin}
			);
			io.observe(container);
		} else {
			timer = globalThis.setTimeout(start, 2500) as unknown as number;
		}

		const onClick = (event: Event): void => {
			if (!ctaHash) return;
			const link = (event.target as Element | null)?.closest?.('a[href]');
			if (link && link.getAttribute('href')?.endsWith(ctaHash)) start();
		};
		document.addEventListener('click', onClick, true);
		if (ctaHash && window.location.hash === ctaHash) start();

		const onSubmit = (): void => {
			if (trackLead) reachGoal('lead');
		};
		container.addEventListener('submit', onSubmit, true);

		return () => {
			io?.disconnect();
			mutations.disconnect();
			window.clearTimeout(timer);
			document.removeEventListener('click', onClick, true);
			container.removeEventListener('submit', onSubmit, true);
			started.current = false;
		};
	}, [containerRef, scriptId, ctaHash, rootMargin, timeoutMs, trackLead]);

	return state;
}
