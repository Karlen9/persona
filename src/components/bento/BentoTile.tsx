'use client';

import Link from 'next/link';
import {useEffect, useRef, useState, ViewTransition} from 'react';

import {TileActivityProvider} from '@/components/bento/TileActivity';
import {Icon} from '@/components/ui/Icon';
import {cn} from '@/lib/cn';

import type {PointerEvent, ReactNode} from 'react';
import type {TBentoSize} from '@/components/bento/sizes';
import type {TBentoTone} from '@/components/bento/tiles';

type TBentoTileProps = {
	id: string;
	title: string;
	eyebrow?: string;
	description: string;
	href: string;
	size: TBentoSize;
	tone?: TBentoTone;
	/** The live preview (a server-rendered element). */
	children: ReactNode;
};

const toneClasses: Record<TBentoTone, string> = {
	photo: 'border-transparent bg-brand-900 text-white',
	deep: 'border-transparent bg-brand-800 text-white',
	light: 'border-line bg-white text-ink',
	brand: 'border-brand-100 bg-brand-50 text-ink',
	accent: 'border-accent-100 bg-accent-50 text-ink'
};

const eyebrowClasses: Record<TBentoTone, string> = {
	photo: 'text-brand-200',
	deep: 'text-brand-200',
	light: 'text-brand-700',
	brand: 'text-brand-700',
	accent: 'text-accent-700'
};

export function BentoTile({
	id,
	title,
	eyebrow,
	description,
	href,
	size,
	tone = 'light',
	children
}: TBentoTileProps): ReactNode {
	const linkRef = useRef<HTMLAnchorElement>(null);
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	const [onScreen, setOnScreen] = useState(false);
	const [tabVisible, setTabVisible] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);

	useEffect(() => {
		const node = linkRef.current;
		if (!node) return;
		const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {threshold: 0.1});
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const update = (): void => setTabVisible(document.visibilityState === 'visible');
		update();
		document.addEventListener('visibilitychange', update);
		return () => document.removeEventListener('visibilitychange', update);
	}, []);

	useEffect(() => {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = (): void => setReducedMotion(query.matches);
		update();
		query.addEventListener('change', update);
		return () => query.removeEventListener('change', update);
	}, []);

	const onPointerEnter = (event: PointerEvent<HTMLAnchorElement>): void => {
		if (event.pointerType === 'mouse') setHovered(true);
	};

	const onPointerMove = (event: PointerEvent<HTMLAnchorElement>): void => {
		if (event.pointerType !== 'mouse') return;
		const node = linkRef.current;
		if (!node) return;
		const rect = node.getBoundingClientRect();
		node.style.setProperty('--mx', `${event.clientX - rect.left}px`);
		node.style.setProperty('--my', `${event.clientY - rect.top}px`);
	};

	const dark = tone === 'photo' || tone === 'deep';
	const photo = tone === 'photo';
	const wide = size === 'wide';
	const activity = {active: hovered || focused, visible: onScreen && tabVisible, reducedMotion};

	return (
		<ViewTransition name={`tile-${id}`} share={'tile-morph'}>
			<Link
				ref={linkRef}
				href={href}
				data-tile-vt={`tile-${id}`}
				onPointerEnter={onPointerEnter}
				onPointerMove={onPointerMove}
				onPointerLeave={() => setHovered(false)}
				onFocus={(event) => setFocused(event.currentTarget.matches(':focus-visible'))}
				onBlur={() => setFocused(false)}
				className={cn(
					'bento-tile group relative flex h-full flex-col overflow-hidden rounded-card border p-5 shadow-card transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-pop motion-reduce:hover:translate-y-0 sm:p-6',
					toneClasses[tone],
					photo ? 'justify-end' : null,
					wide ? 'md:flex-row md:items-center md:gap-8' : 'gap-4'
				)}
			>
				{photo ? (
					<>
						<div aria-hidden className={'absolute inset-0'}>
							<TileActivityProvider value={activity}>{children}</TileActivityProvider>
						</div>
						<div
							aria-hidden
							className={
								'absolute inset-0 bg-linear-to-t from-brand-900/90 via-brand-900/40 to-brand-900/5'
							}
						/>
					</>
				) : null}

				<div className={cn('relative z-10 pr-12', wide ? 'md:w-2/5 md:shrink-0' : null)}>
					{eyebrow ? (
						<p className={cn('mb-1 text-xs font-bold tracking-wide uppercase', eyebrowClasses[tone])}>
							{eyebrow}
						</p>
					) : null}
					<h2 className={'text-xl leading-snug font-extrabold text-balance sm:text-2xl'}>{title}</h2>
					<p
						className={cn(
							'mt-1.5 line-clamp-3 text-sm',
							dark ? 'text-white/85' : 'text-body',
							size === 'sm' ? 'md:sr-only' : null
						)}
					>
						{description}
					</p>
				</div>

				{photo ? null : (
					<div aria-hidden className={cn('relative z-10 min-h-0 flex-1', wide ? 'md:min-w-0' : null)}>
						<TileActivityProvider value={activity}>{children}</TileActivityProvider>
					</div>
				)}

				<span
					aria-hidden
					className={cn(
						'absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5',
						dark ? 'bg-white text-brand-800' : 'bg-brand-800 text-white'
					)}
				>
					<Icon name={'arrow-right'} size={18} />
				</span>

				<span
					aria-hidden
					className={
						'pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
					}
					style={{
						backgroundImage:
							'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgb(255 255 255 / 0.35), transparent 60%)'
					}}
				/>
			</Link>
		</ViewTransition>
	);
}
