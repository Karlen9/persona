'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useCallback, useEffect, useRef, useState} from 'react';

import {Icon} from '@/components/ui/Icon';
import {cn} from '@/lib/cn';

import {StudioMapContacts} from './StudioMapContacts';

import type {ReactNode} from 'react';
import type {TStudioMapData, TStudioZone, TStudioZoneId} from '@/content/studioMap';

const CARD_WIDTH = 288;
const EDGE = 8;
/** Distance from the zone anchor to the card edge: clears the label pill. */
const CARD_GAP = 28;

const zoneLabel = (zone: TStudioZone): string => (zone.kind === 'contacts' ? `${zone.label} · контакты` : zone.label);

const pct = (value: number): string => `${(value * 100).toFixed(3)}%`;

/** Keeps the card inside the map: centred on the anchor horizontally (clamped), flipped above/below vertically. */
function cardStyle([x, y]: [number, number]): React.CSSProperties {
	return {
		width: CARD_WIDTH,
		maxWidth: `calc(100% - ${EDGE * 2}px)`,
		maxHeight: `calc(100% - ${EDGE * 2}px)`,
		left: `clamp(${EDGE}px, calc(${pct(x)} - ${CARD_WIDTH / 2}px), calc(100% - ${CARD_WIDTH + EDGE}px))`,
		...(y > 0.5 ? {bottom: `calc(${pct(1 - y)} + ${CARD_GAP}px)`} : {top: `calc(${pct(y)} + ${CARD_GAP}px)`})
	};
}

export function StudioMapInteractive({image, zones}: TStudioMapData): ReactNode {
	const [activeId, setActiveId] = useState<TStudioZoneId | null>(null);
	const [hoverId, setHoverId] = useState<TStudioZoneId | null>(null);
	const cardRef = useRef<HTMLDivElement>(null);
	const buttonRefs = useRef(new Map<TStudioZoneId, HTMLButtonElement>());
	const active = zones.find((zone) => zone.id === activeId) ?? null;
	const highlightedId = hoverId ?? activeId;

	const activeIdRef = useRef<TStudioZoneId | null>(null);
	activeIdRef.current = activeId;

	const close = useCallback((restoreFocus: boolean): void => {
		const current = activeIdRef.current;
		setActiveId(null);
		if (current && restoreFocus) buttonRefs.current.get(current)?.focus({preventScroll: true});
	}, []);

	// Move focus into the card when it opens.
	useEffect(() => {
		if (!activeId) return;
		cardRef.current?.querySelector<HTMLElement>('a')?.focus({preventScroll: true});
	}, [activeId]);

	useEffect(() => {
		if (!activeId) return;
		const onKeyDown = (event: KeyboardEvent): void => {
			if (event.key === 'Escape') close(true);
		};
		const onPointerDown = (event: PointerEvent): void => {
			const target = event.target;
			if (!(target instanceof Element)) return;
			// Zone triggers switch the card themselves; everything else outside the card closes it.
			if (target.closest('[data-studio-card], [data-studio-zone]')) return;
			close(false);
		};
		document.addEventListener('keydown', onKeyDown);
		document.addEventListener('pointerdown', onPointerDown);
		return () => {
			document.removeEventListener('keydown', onKeyDown);
			document.removeEventListener('pointerdown', onPointerDown);
		};
	}, [activeId, close]);

	const hoverProps = (
		id: TStudioZoneId
	): {onPointerEnter: (e: React.PointerEvent) => void; onPointerLeave: () => void} => ({
		onPointerEnter: (event) => {
			if (event.pointerType === 'mouse') setHoverId(id);
		},
		onPointerLeave: () => setHoverId(null)
	});

	return (
		<div
			className={
				'relative mx-auto w-full md:w-[min(100%,1440px,max(40rem,calc((100svh_-_var(--spacing-header-lg)_-_15rem)_*_1.6)))]'
			}
		>
			<Image
				src={image.src}
				width={image.width}
				height={image.height}
				alt={
					'Схема студии: сцена, танцевальный зал, классы, фитнес-студия, ресепшн, мастерская роботов, арт-мастерская и гостиная'
				}
				priority
				sizes={'(min-width: 1440px) 1440px, 100vw'}
				className={'h-auto w-full select-none'}
			/>

			<svg aria-hidden viewBox={`0 0 ${image.width} ${image.height}`} className={'absolute inset-0 size-full'}>
				{zones.map((zone) => (
					<polygon
						key={zone.id}
						data-studio-zone={zone.id}
						points={zone.points.map(([x, y]) => `${x * image.width},${y * image.height}`).join(' ')}
						strokeWidth={4}
						strokeLinejoin={'round'}
						vectorEffect={'non-scaling-stroke'}
						className={cn(
							'[pointer-events:all] cursor-pointer transition-[fill,stroke] duration-150 motion-reduce:transition-none max-md:[pointer-events:none]',
							highlightedId === zone.id
								? 'fill-white/40 stroke-brand-700'
								: 'fill-transparent stroke-transparent'
						)}
						onClick={() => setActiveId(zone.id)}
						{...hoverProps(zone.id)}
					/>
				))}
			</svg>

			{zones.map((zone) => (
				<button
					key={zone.id}
					ref={(node) => {
						if (node) buttonRefs.current.set(zone.id, node);
						else buttonRefs.current.delete(zone.id);
					}}
					type={'button'}
					data-studio-zone={zone.id}
					aria-expanded={activeId === zone.id}
					aria-controls={activeId === zone.id ? 'studio-map-card' : undefined}
					style={{left: pct(zone.anchor[0]), top: pct(zone.anchor[1])}}
					className={cn(
						'invisible absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-pill px-3 py-1.5 text-xs font-bold whitespace-nowrap text-ink shadow-card transition-colors duration-150 motion-reduce:transition-none md:visible lg:min-h-11 lg:px-4 lg:text-sm',
						'focus-visible:outline-3 focus-visible:outline-brand-700',
						highlightedId === zone.id ? 'bg-brand-100 ring-2 ring-brand-700' : 'bg-white'
					)}
					onClick={() => setActiveId(zone.id)}
					{...hoverProps(zone.id)}
				>
					{zoneLabel(zone)}
				</button>
			))}

			{active ? (
				<div
					ref={cardRef}
					id={'studio-map-card'}
					role={'region'}
					aria-label={zoneLabel(active)}
					data-studio-card={''}
					style={cardStyle(active.anchor)}
					className={'absolute z-10 overflow-y-auto rounded-card bg-white p-4 shadow-pop max-md:invisible'}
				>
					<button
						type={'button'}
						aria-label={'Закрыть'}
						className={
							'absolute top-1 right-1 grid size-11 place-items-center rounded-full text-muted hover:bg-surface focus-visible:outline-3 focus-visible:outline-brand-700'
						}
						onClick={() => close(true)}
					>
						<Icon name={'close'} size={18} />
					</button>
					<p className={'pr-10 text-lg leading-snug font-extrabold text-ink'}>{active.label}</p>
					<div className={'mt-1'}>
						{active.kind === 'contacts' ? (
							<StudioMapContacts onNavigate={() => close(false)} />
						) : (
							<ul>
								{active.directions.map((direction) => (
									<li key={direction.slug}>
										<Link
											href={direction.path}
											prefetch={false}
											className={
												'flex min-h-11 items-center rounded-btn px-2 font-semibold text-ink hover:bg-brand-50 hover:text-brand-800'
											}
										>
											{direction.shortTitle}
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			) : null}
		</div>
	);
}
