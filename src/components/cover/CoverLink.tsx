'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';

import type {ComponentProps, MouseEvent, ReactNode} from 'react';

type TCoverLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
	href: string;
};

type TViewTransition = {finished: Promise<void>};
type TTransitionDocument = Document & {
	startViewTransition?: (update: () => Promise<void> | void) => TViewTransition;
};

const NAVIGATION_TIMEOUT_MS = 1500;

function normalisePath(path: string): string {
	return path.endsWith('/') ? path : `${path}/`;
}

/**
 * Resolves once the router has committed the target path, or after the cap. Polls with setTimeout on purpose:
 * rendering (and so requestAnimationFrame) is suppressed while a view transition captures the old state.
 */
function waitForPath(targetPath: string): Promise<void> {
	return new Promise((resolve) => {
		const startedAt = performance.now();
		const check = (): void => {
			if (
				normalisePath(window.location.pathname) === targetPath ||
				performance.now() - startedAt > NAVIGATION_TIMEOUT_MS
			) {
				resolve();
				return;
			}
			window.setTimeout(check, 16);
		};
		check();
	});
}

export function CoverLink({href, onClick, onPointerEnter, onFocus, children, ...rest}: TCoverLinkProps): ReactNode {
	const router = useRouter();

	const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
		onClick?.(event);
		const doc = document as TTransitionDocument;
		if (
			event.defaultPrevented ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey ||
			(rest.target && rest.target !== '_self') ||
			!('startViewTransition' in document) ||
			typeof doc.startViewTransition !== 'function'
		) {
			return;
		}
		const url = new URL(href, window.location.href);
		if (url.origin !== window.location.origin) return;

		event.preventDefault();
		const root = document.documentElement;
		const clear = (): void => {
			delete root.dataset.coverTransition;
		};
		root.dataset.coverTransition = 'wipe';
		try {
			const transition = doc.startViewTransition(() => {
				router.push(href);
				return waitForPath(normalisePath(url.pathname));
			});
			transition.finished.then(clear, clear);
		} catch {
			clear();
			router.push(href);
		}
	};

	return (
		<Link
			{...rest}
			href={href}
			onClick={handleClick}
			onPointerEnter={(event) => {
				onPointerEnter?.(event);
				router.prefetch(href);
			}}
			onFocus={(event) => {
				onFocus?.(event);
				router.prefetch(href);
			}}
		>
			{children}
		</Link>
	);
}
