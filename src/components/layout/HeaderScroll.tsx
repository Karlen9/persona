'use client';

import {useEffect, useRef} from 'react';

import type {ReactNode} from 'react';

/** Toggles data-scrolled on #site-header via IntersectionObserver (no scroll listener, no re-render). */
export function HeaderScroll(): ReactNode {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const sentinel = ref.current;
		const header = document.getElementById('site-header');
		if (!sentinel || !header) return;
		const observer = new IntersectionObserver(([entry]) => {
			header.dataset.scrolled = entry.isIntersecting ? 'false' : 'true';
		});
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, []);
	return <div ref={ref} aria-hidden className={'pointer-events-none absolute top-0 left-0 h-2 w-px'} />;
}
