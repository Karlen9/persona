'use client';

import {Minus, Plus, RotateCcw} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {ButtonLink} from '@/components/ui/ButtonLink';
import {Icon} from '@/components/ui/Icon';
import {cn} from '@/lib/cn';
import {CC_BY_URL, ccByCredits} from '@/content/modelCredits';
import {LEAD_ANCHOR, PHONES} from '@/lib/site';

import {useMediaQuery} from './hooks';

import type {MouseEvent as TReactMouseEvent, ReactNode} from 'react';
import type {TAgencyMapData, TAgencySpecialHotspot} from '@/content/agencyMap';
import type {TAgencyFocus} from './AgencyScene';
import type {TMapApi} from './view';

type TAgencyMapProps = TAgencyMapData & {heading: string};

function MapPlaceholder({children, className}: {children?: ReactNode; className?: string}): ReactNode {
	return (
		<div
			className={cn(
				'absolute inset-0 grid place-items-center bg-gradient-to-br from-brand-50 to-accent-100 p-6 text-center',
				className
			)}
		>
			<div className={'flex max-w-xs flex-col items-center gap-4'}>
				<div aria-hidden className={'grid grid-cols-3 gap-2 opacity-60'}>
					{Array.from({length: 6}, (_, i) => (
						<span key={i} className={'size-10 rounded-card bg-white shadow-card'} />
					))}
				</div>
				{children}
			</div>
		</div>
	);
}

// No `loading` component: the page-level placeholder below stays over the canvas until the first frame is rendered.
const AgencyScene = dynamic(() => import('./AgencyScene').then((module) => module.AgencyScene), {ssr: false});

function detectWebgl(): boolean {
	try {
		const canvas = document.createElement('canvas');
		return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
	} catch {
		return false;
	}
}

const controlButton =
	'grid size-11 place-items-center rounded-btn bg-white text-ink shadow-card transition-colors hover:bg-brand-50 focus-visible:outline-3 focus-visible:outline-brand-700';

const CONTACTS_ANCHOR = 'kontakty';

export function AgencyMap({
	floor,
	zones,
	hotspots,
	specialHotspots,
	decor,
	bounds,
	heading
}: TAgencyMapProps): ReactNode {
	const router = useRouter();
	const rootRef = useRef<HTMLElement>(null);
	const apiRef = useRef<TMapApi | null>(null);
	const lastPointer = useRef<string | null>(null);
	const sheetCloseRef = useRef<HTMLButtonElement>(null);
	const tipRef = useRef<HTMLDivElement>(null);

	const [webgl, setWebgl] = useState<boolean | null>(null);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [focus, setFocus] = useState<TAgencyFocus | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [inView, setInView] = useState(true);
	const [tabVisible, setTabVisible] = useState(true);
	const [sceneReady, setSceneReady] = useState(false);

	const noHover = useMediaQuery('(hover: none)');
	const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

	const bySlug = useMemo(() => new Map(hotspots.map((item) => [item.slug, item])), [hotspots]);
	const specialById = useMemo(
		() => new Map<string, TAgencySpecialHotspot>(specialHotspots.map((item) => [item.id, item])),
		[specialHotspots]
	);
	const selected = selectedId ? (bySlug.get(selectedId) ?? null) : null;
	const selectedSpecial = selectedId ? (specialById.get(selectedId) ?? null) : null;
	const hasCard = Boolean(selected || selectedSpecial);

	useEffect(() => {
		setWebgl(detectWebgl());
	}, []);

	useEffect(() => {
		const root = rootRef.current;
		if (!root) return;
		const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
		observer.observe(root);
		const onVisibility = (): void => setTabVisible(document.visibilityState === 'visible');
		document.addEventListener('visibilitychange', onVisibility);
		return () => {
			observer.disconnect();
			document.removeEventListener('visibilitychange', onVisibility);
		};
	}, []);

	useEffect(() => {
		if (selected) router.prefetch(selected.direction.path);
	}, [selected, router]);

	useEffect(() => {
		if (sheetOpen) sheetCloseRef.current?.focus();
	}, [sheetOpen]);

	const handlePick = useCallback(
		(id: string): void => {
			const special = specialById.get(id);
			if (special) {
				// Special props (reception) open their card on every device: mouse and touch alike.
				setSelectedId(id);
				setFocus((prev) => ({x: special.position[0], z: special.position[2], nonce: (prev?.nonce ?? 0) + 1}));
				return;
			}
			const item = bySlug.get(id);
			if (!item) return;
			const touch = lastPointer.current ? lastPointer.current === 'touch' : noHover;
			if (touch && selectedId !== id) {
				setSelectedId(id);
				setFocus((prev) => ({x: item.position[0], z: item.position[2], nonce: (prev?.nonce ?? 0) + 1}));
				return;
			}
			router.push(item.direction.path);
		},
		[bySlug, noHover, router, selectedId, specialById]
	);

	const handleClear = useCallback((): void => setSelectedId(null), []);
	const handleReady = useCallback((): void => setSceneReady(true), []);

	const handleAllContacts = (event: TReactMouseEvent<HTMLAnchorElement>): void => {
		const target = document.getElementById(CONTACTS_ANCHOR);
		if (!target) return;
		event.preventDefault();
		target.scrollIntoView({behavior: reducedMotion ? 'instant' : 'smooth', block: 'start'});
	};

	const handleKeyDown = (event: React.KeyboardEvent): void => {
		if (event.key !== 'Escape') return;
		if (sheetOpen) setSheetOpen(false);
		else setSelectedId(null);
	};

	return (
		<section
			ref={rootRef}
			aria-label={'Интерактивная карта студии'}
			className={
				'relative isolate h-[calc(100svh-var(--spacing-header)-3.5rem)] min-h-[26rem] w-full overflow-hidden bg-[#e9e6e1] lg:h-[calc(100svh-var(--spacing-header-lg))]'
			}
			onPointerDownCapture={(event) => {
				lastPointer.current = event.pointerType;
			}}
			onKeyDown={handleKeyDown}
		>
			{webgl === true ? (
				<AgencyScene
					floor={floor}
					zones={zones}
					hotspots={hotspots}
					specialHotspots={specialHotspots}
					decor={decor}
					bounds={bounds}
					selectedId={selectedId}
					focus={focus}
					animate={!reducedMotion}
					reducedMotion={reducedMotion}
					active={inView && tabVisible}
					apiRef={apiRef}
					tipRef={tipRef}
					onPick={handlePick}
					onClear={handleClear}
					onReady={handleReady}
				/>
			) : null}
			{webgl === false ? (
				<MapPlaceholder>
					<p className={'font-bold text-brand-800'}>
						{'Интерактивная карта недоступна на этом устройстве. Выберите направление из списка.'}
					</p>
					<button
						type={'button'}
						className={'rounded-btn bg-brand px-5 py-3 font-bold text-brand-ink'}
						onClick={() => setSheetOpen(true)}
					>
						{'Все направления'}
					</button>
				</MapPlaceholder>
			) : (
				// Covers the canvas until the scene has rendered its first frames, then fades out.
				<MapPlaceholder
					className={cn(
						'transition-[opacity,visibility] duration-500 motion-reduce:transition-none',
						sceneReady ? 'invisible opacity-0' : 'opacity-100'
					)}
				>
					<p role={'status'} className={'font-bold text-brand-800'}>
						{'Строим карту студии…'}
					</p>
				</MapPlaceholder>
			)}

			{/* Hover label: a plain DOM element positioned by the scene (drei <Html> breaks under React strict mode). */}
			<div
				ref={tipRef}
				aria-hidden
				className={
					'pointer-events-none absolute top-0 left-0 z-10 rounded-pill bg-ink px-3 py-1 text-xs font-bold whitespace-nowrap text-white opacity-0 shadow-pop'
				}
			/>

			<div
				className={
					'pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3 lg:inset-x-5 lg:top-5'
				}
			>
				<div className={'flex max-w-[60%] flex-col gap-2 sm:max-w-72 lg:max-w-80'}>
					<h1
						className={
							'pointer-events-auto rounded-card bg-white/90 px-3 py-2 text-base leading-snug font-extrabold text-balance text-ink shadow-card backdrop-blur max-sm:sr-only lg:text-lg'
						}
					>
						{heading}
					</h1>
					<p
						className={
							'w-fit rounded-pill bg-white/90 px-3 py-1.5 text-xs font-semibold text-body shadow-card'
						}
					>
						{noHover
							? 'Нажмите на предмет · двумя пальцами — масштаб'
							: 'Кликните на предмет, чтобы открыть направление'}
					</p>
				</div>
				<button
					type={'button'}
					className={cn(
						'pointer-events-auto min-h-11 rounded-btn bg-white px-4 text-sm font-bold text-ink shadow-card transition-colors hover:bg-brand-50',
						'focus-visible:outline-3 focus-visible:outline-brand-700'
					)}
					aria-expanded={sheetOpen}
					aria-controls={'agency-map-sheet'}
					onClick={() => setSheetOpen((open) => !open)}
				>
					{'Все направления'}
				</button>
			</div>

			<div
				className={cn(
					'absolute left-3 z-10 flex flex-col gap-2 transition-[bottom] lg:left-5',
					hasCard
						? selectedSpecial
							? 'bottom-72 sm:bottom-5'
							: 'bottom-48 sm:bottom-5'
						: 'bottom-3 lg:bottom-5'
				)}
			>
				<button
					type={'button'}
					className={controlButton}
					aria-label={'Приблизить'}
					onClick={() => apiRef.current?.zoomBy(1.5)}
				>
					<Plus size={20} aria-hidden />
				</button>
				<button
					type={'button'}
					className={controlButton}
					aria-label={'Отдалить'}
					onClick={() => apiRef.current?.zoomBy(1 / 1.5)}
				>
					<Minus size={20} aria-hidden />
				</button>
				<button
					type={'button'}
					className={controlButton}
					aria-label={'Сбросить вид'}
					onClick={() => apiRef.current?.reset()}
				>
					<RotateCcw size={18} aria-hidden />
				</button>
			</div>

			{selected || selectedSpecial ? (
				<div
					role={'region'}
					aria-live={'polite'}
					aria-label={selected ? selected.direction.shortTitle : selectedSpecial?.label}
					className={
						'absolute inset-x-3 bottom-3 z-10 rounded-card bg-white p-4 shadow-pop sm:right-auto sm:bottom-5 sm:left-20 sm:w-96'
					}
				>
					<button
						type={'button'}
						aria-label={'Закрыть'}
						className={
							'absolute top-2 right-2 grid size-11 place-items-center rounded-full text-muted hover:bg-surface'
						}
						onClick={() => setSelectedId(null)}
					>
						<Icon name={'close'} size={18} />
					</button>
					{selected ? (
						<>
							<p className={'pr-10 text-lg font-extrabold text-ink'}>{selected.direction.shortTitle}</p>
							<p className={'mt-1 line-clamp-2 text-sm'}>{selected.direction.excerpt}</p>
							<ButtonLink href={selected.direction.path} size={'sm'} className={'mt-3 w-full'}>
								{'Перейти'}
							</ButtonLink>
						</>
					) : (
						<>
							<p className={'pr-10 text-lg font-extrabold text-ink'}>{selectedSpecial?.label}</p>
							<ul className={'mt-1 flex flex-col'}>
								{PHONES.map((phone) => (
									<li key={phone.href}>
										<a
											href={phone.href}
											className={
												'inline-flex min-h-11 items-center gap-2 font-bold text-ink hover:text-brand-800'
											}
										>
											<Icon name={'phone'} size={18} className={'text-brand-700'} />
											{phone.label}
										</a>
									</li>
								))}
							</ul>
							<div className={'mt-2 flex gap-2'}>
								<ButtonLink href={LEAD_ANCHOR} size={'sm'} className={'flex-1'}>
									{'Записаться'}
								</ButtonLink>
								<ButtonLink
									href={`#${CONTACTS_ANCHOR}`}
									variant={'secondary'}
									size={'sm'}
									className={'flex-1'}
									onClick={handleAllContacts}
								>
									{'Все контакты'}
								</ButtonLink>
							</div>
						</>
					)}
				</div>
			) : null}

			<div
				id={'agency-map-sheet'}
				className={cn(
					'absolute z-30 flex flex-col bg-white shadow-pop transition-[transform,visibility] duration-300 motion-reduce:transition-none',
					'inset-x-0 bottom-0 max-h-[78%] rounded-t-card',
					'lg:inset-x-auto lg:top-4 lg:right-4 lg:bottom-4 lg:max-h-none lg:w-96 lg:rounded-card',
					sheetOpen
						? 'visible translate-y-0 lg:translate-x-0'
						: 'invisible translate-y-full lg:translate-x-[110%] lg:translate-y-0'
				)}
			>
				<div className={'flex items-center justify-between border-b border-line px-4 py-2'}>
					<h2 className={'text-lg font-extrabold text-ink'}>{'Все направления'}</h2>
					<button
						ref={sheetCloseRef}
						type={'button'}
						aria-label={'Закрыть список'}
						className={'grid size-11 place-items-center rounded-full text-muted hover:bg-surface'}
						onClick={() => setSheetOpen(false)}
					>
						<Icon name={'close'} size={18} />
					</button>
				</div>
				<nav aria-label={'Направления на карте'} className={'overflow-y-auto overscroll-contain px-4 py-3'}>
					{zones
						.filter((zone) => hotspots.some((item) => item.zone === zone.id))
						.map((zone) => (
							<section key={zone.id} className={'mb-4'}>
								<h3 className={'mb-1 text-xs font-extrabold tracking-wide text-muted uppercase'}>
									{zone.label}
								</h3>
								<ul>
									{hotspots
										.filter((item) => item.zone === zone.id)
										.map((item) => (
											<li key={item.slug}>
												<Link
													href={item.direction.path}
													prefetch={false}
													className={
														'flex min-h-11 items-center rounded-btn px-2 font-semibold text-ink hover:bg-brand-50 hover:text-brand-800'
													}
												>
													{item.direction.shortTitle}
												</Link>
											</li>
										))}
								</ul>
							</section>
						))}
					<section className={'mb-4'}>
						<h3 className={'mb-1 text-xs font-extrabold tracking-wide text-muted uppercase'}>
							{'Ресепшн'}
						</h3>
						<ul>
							<li>
								<a
									href={`#${CONTACTS_ANCHOR}`}
									className={
										'flex min-h-11 items-center rounded-btn px-2 font-semibold text-ink hover:bg-brand-50 hover:text-brand-800'
									}
									onClick={() => setSheetOpen(false)}
								>
									{'Ресепшн — контакты'}
								</a>
							</li>
						</ul>
					</section>
					<footer className={'mt-2 border-t border-line pt-3 text-xs text-muted'}>
						<p>{'3D-модели: Kenney, Quaternius и др. (CC0)'}</p>
						<details className={'mt-1'}>
							<summary className={'min-h-8 cursor-pointer py-1 font-semibold'}>
								{'Авторы моделей'}
							</summary>
							<ul className={'mt-1 flex flex-col gap-1'}>
								{ccByCredits.map((credit) => (
									<li key={credit.file}>
										<a
											href={credit.source}
											target={'_blank'}
											rel={'noopener noreferrer'}
											className={'underline hover:text-ink'}
										>
											{`${credit.title} — ${credit.author}, CC BY 3.0`}
										</a>
									</li>
								))}
							</ul>
							<p className={'mt-1'}>
								<a
									href={CC_BY_URL}
									target={'_blank'}
									rel={'noopener noreferrer'}
									className={'underline hover:text-ink'}
								>
									{'Лицензия CC BY 3.0'}
								</a>
							</p>
						</details>
					</footer>
				</nav>
			</div>
		</section>
	);
}
