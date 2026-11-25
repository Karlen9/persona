'use client';

import {usePathname} from 'next/navigation';
import {useEffect} from 'react';

import type {ReactNode} from 'react';

function openFromHash(): void {
	const id = decodeURIComponent(window.location.hash.slice(1));
	if (!id) return;
	const element = document.getElementById(id);
	if (!(element instanceof HTMLDetailsElement)) return;
	element.open = true;
	element.scrollIntoView({block: 'start'});
}

/**
 * Opens (and scrolls to) the `<details>` whose id matches the URL hash: on load, after every client-side route change
 * (the hash does not fire `hashchange` then) and on every `hashchange`.
 */
export function OpenDetailsOnHash(): ReactNode {
	const pathname = usePathname();

	useEffect(() => {
		openFromHash();
	}, [pathname]);

	useEffect(() => {
		window.addEventListener('hashchange', openFromHash);
		return () => window.removeEventListener('hashchange', openFromHash);
	}, []);

	return null;
}
