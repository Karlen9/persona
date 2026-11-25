'use client';

import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useDeferredValue, useEffect, useId, useMemo, useRef, useState} from 'react';

import {Icon} from '@/components/ui/Icon';
import {mainNav} from '@/content/navigation';
import {groupHits} from '@/lib/search/groups';

import {SearchEmptyState} from './SearchEmptyState';
import {SearchResultRow} from './SearchResultRow';
import {useSearchEngine} from './useSearchEngine';

import type {KeyboardEvent, MouseEvent, ReactNode} from 'react';
import type {TSearchGroup} from '@/lib/search/groups';
import type {TIconName} from '@/components/ui/Icon';

const MAX_HITS = 12;

type TQuickLink = {label: string; href: string; icon: TIconName};

const QUICK_LINKS: TQuickLink[] = [
	...(mainNav[0].columns?.[0]?.links.slice(0, 6) ?? []).map((link) => ({...link, icon: 'sparkles' as const})),
	{label: 'Студии', href: '/studii/', icon: 'map-pin'},
	{label: 'Расписание', href: '/raspisanie/', icon: 'calendar'},
	{label: 'Цены', href: '/tarify/', icon: 'tag'}
];

type TSearchDialogProps = {
	open: boolean;
	onClose: () => void;
};

type TOption = {href: string};

/** Instant-results command palette on a native modal <dialog> (same pattern as MobileNav). */
export function SearchDialog({open, onClose}: TSearchDialogProps): ReactNode {
	const pathname = usePathname();
	const router = useRouter();
	const uid = useId();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const scrollActive = useRef(false);
	const [query, setQuery] = useState('');
	const [active, setActive] = useState(0);
	const deferredQuery = useDeferredValue(query);
	const {engine, status, retry} = useSearchEngine(open);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (open && !dialog.open) {
			dialog.showModal();
			inputRef.current?.focus();
			inputRef.current?.select();
		}
		if (!open && dialog.open) dialog.close();
		document.documentElement.style.overflow = open ? 'hidden' : '';
		return () => {
			document.documentElement.style.overflow = '';
		};
	}, [open]);

	useEffect(() => {
		onClose();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const result = useMemo(
		() => (open && engine && deferredQuery.trim() ? engine.search(deferredQuery, MAX_HITS) : null),
		[open, engine, deferredQuery]
	);
	const groups: TSearchGroup[] = useMemo(() => (result ? groupHits(result.hits) : []), [result]);
	const flatHits = useMemo(() => groups.flatMap((group) => group.hits), [groups]);

	const isQuickMode = query.trim().length === 0;
	const options: TOption[] = isQuickMode ? QUICK_LINKS : flatHits.map((hit) => ({href: hit.doc.href}));
	const activeIndex = options.length > 0 ? Math.min(active, options.length - 1) : -1;
	const optionId = (index: number): string => `${uid}-option-${index}`;

	useEffect(() => {
		if (!scrollActive.current || activeIndex < 0) return;
		scrollActive.current = false;
		document.getElementById(optionId(activeIndex))?.scrollIntoView({block: 'nearest'});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeIndex]);

	function closeNow(): void {
		document.documentElement.style.overflow = '';
		dialogRef.current?.close();
		onClose();
	}

	function goTo(href: string): void {
		closeNow();
		if (href.startsWith('/docs/')) {
			window.open(href, '_blank', 'noopener,noreferrer');
			return;
		}
		const url = new URL(href, window.location.origin);
		if (url.pathname === window.location.pathname && url.hash) {
			if (window.location.hash === url.hash) window.dispatchEvent(new HashChangeEvent('hashchange'));
			else window.location.hash = url.hash;
			return;
		}
		router.push(href);
	}

	function onLinkClick(event: MouseEvent<HTMLAnchorElement>, href: string): void {
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
		if (href.startsWith('/docs/')) {
			closeNow();
			return;
		}
		event.preventDefault();
		goTo(href);
	}

	function move(next: number): void {
		scrollActive.current = true;
		setActive(next);
	}

	function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
		const count = options.length;
		if (event.key === 'ArrowDown' && count > 0) {
			event.preventDefault();
			move((activeIndex + 1) % count);
		} else if (event.key === 'ArrowUp' && count > 0) {
			event.preventDefault();
			move((activeIndex - 1 + count) % count);
		} else if (event.key === 'Home' && count > 0 && event.currentTarget.selectionStart === 0) {
			event.preventDefault();
			move(0);
		} else if (event.key === 'End' && count > 0 && event.currentTarget.selectionStart === query.length) {
			event.preventDefault();
			move(count - 1);
		} else if (event.key === 'Escape') {
			event.preventDefault();
			closeNow();
		} else if (event.key === 'Enter') {
			event.preventDefault();
			const trimmed = query.trim();
			if (!trimmed) {
				if (activeIndex >= 0) goTo(options[activeIndex].href);
			} else if (deferredQuery !== query && engine) {
				// The deferred search has not caught up with the last keystrokes: search the fresh text now.
				const fresh = groupHits(engine.search(trimmed, MAX_HITS).hits).flatMap((group) => group.hits);
				goTo(fresh.length > 0 ? fresh[0].doc.href : `/poisk/?q=${encodeURIComponent(trimmed)}`);
			} else if (activeIndex >= 0) {
				goTo(options[activeIndex].href);
			} else {
				goTo(`/poisk/?q=${encodeURIComponent(trimmed)}`);
			}
		}
	}

	const listboxRendered = isQuickMode || (result !== null && flatHits.length > 0);
	const showLoading = open && status !== 'ready' && status !== 'error' && !isQuickMode;
	const allResultsHref = query.trim() ? `/poisk/?q=${encodeURIComponent(query.trim())}` : '/poisk/';
	let runningIndex = 0;

	return (
		<dialog
			ref={dialogRef}
			aria-label={'Поиск по сайту'}
			onClose={() => onClose()}
			onClick={(event) => {
				if (event.target === dialogRef.current) closeNow();
			}}
			className={
				'fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none flex-col bg-white p-0 backdrop:bg-ink/40 open:flex sm:inset-auto sm:top-[10vh] sm:left-1/2 sm:h-auto sm:max-h-[min(78vh,720px)] sm:w-[min(92vw,680px)] sm:-translate-x-1/2 sm:rounded-card sm:shadow-pop'
			}
		>
			<div className={'flex shrink-0 items-center gap-2 border-b border-line px-3 sm:px-4'}>
				<Icon name={'search'} size={20} className={'shrink-0 text-brand-700'} />
				<input
					ref={inputRef}
					type={'search'}
					role={'combobox'}
					enterKeyHint={'search'}
					autoComplete={'off'}
					autoCorrect={'off'}
					autoCapitalize={'off'}
					spellCheck={false}
					aria-label={'Поиск по сайту'}
					aria-expanded={listboxRendered}
					aria-controls={listboxRendered ? `${uid}-listbox` : undefined}
					aria-autocomplete={'list'}
					aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
					value={query}
					placeholder={'Направление, педагог, адрес, вопрос…'}
					onChange={(event) => {
						setQuery(event.target.value);
						setActive(0);
					}}
					onKeyDown={onKeyDown}
					className={
						'h-14 min-w-0 flex-1 appearance-none bg-transparent text-base font-semibold text-ink outline-none! placeholder:font-medium placeholder:text-muted sm:h-16 sm:text-lg [&::-webkit-search-cancel-button]:hidden'
					}
				/>
				{query ? (
					<button
						type={'button'}
						aria-label={'Очистить'}
						onClick={() => {
							setQuery('');
							setActive(0);
							inputRef.current?.focus();
						}}
						className={'grid size-10 shrink-0 place-items-center rounded-xl text-muted hover:bg-brand-50'}
					>
						<Icon name={'close'} size={18} />
					</button>
				) : null}
				<button
					type={'button'}
					aria-label={'Закрыть поиск'}
					onClick={closeNow}
					className={
						'grid size-10 shrink-0 place-items-center rounded-xl text-ink hover:bg-brand-50 sm:hidden'
					}
				>
					<Icon name={'close'} size={24} />
				</button>
			</div>

			<div className={'min-h-0 flex-1 overflow-y-auto overscroll-contain p-2'}>
				<p role={'status'} aria-live={'polite'} className={'sr-only'}>
					{result
						? flatHits.length > 0
							? `Найдено результатов: ${flatHits.length}`
							: 'Ничего не найдено'
						: ''}
				</p>
				{status === 'error' && !isQuickMode ? (
					<div className={'px-3 py-8 text-center'}>
						<p className={'font-bold text-ink'}>{'Не удалось загрузить поиск'}</p>
						<button
							type={'button'}
							onClick={retry}
							className={
								'mt-3 min-h-11 rounded-btn border border-line px-5 font-bold text-brand-800 hover:bg-brand-50'
							}
						>
							{'Повторить'}
						</button>
					</div>
				) : null}
				{showLoading ? (
					<p className={'flex items-center justify-center gap-2 px-3 py-8 text-muted'}>
						<Icon name={'spinner'} size={18} className={'animate-spin'} />
						{'Загружаем поиск…'}
					</p>
				) : null}

				{isQuickMode ? (
					<div>
						<p className={'px-3 pt-2 pb-1 text-xs font-bold tracking-widest text-accent-700 uppercase'}>
							{'Популярное'}
						</p>
						<ul id={`${uid}-listbox`} role={'listbox'} aria-label={'Популярное'}>
							{QUICK_LINKS.map((link, index) => (
								<li
									key={link.href}
									id={optionId(index)}
									role={'option'}
									aria-selected={index === activeIndex}
									onMouseMove={() => setActive(index)}
								>
									<Link
										href={link.href}
										prefetch={false}
										tabIndex={-1}
										onClick={(event) => onLinkClick(event, link.href)}
										className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold text-ink ${
											index === activeIndex ? 'bg-brand-50' : 'hover:bg-brand-50'
										}`}
									>
										<span
											aria-hidden
											className={
												'grid size-9 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-800'
											}
										>
											<Icon name={link.icon} size={18} />
										</span>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				) : null}

				{!isQuickMode && result ? (
					flatHits.length > 0 ? (
						<div>
							{result.correctedQuery ? (
								<p className={'px-3 pt-2 pb-1 text-sm text-muted'}>
									{`Показаны результаты для «${result.correctedQuery}»`}
								</p>
							) : null}
							<div id={`${uid}-listbox`} role={'listbox'} aria-label={'Результаты поиска'}>
								{groups.map((group) => (
									<div key={group.type} role={'group'} aria-label={group.label}>
										<p
											aria-hidden
											className={
												'px-3 pt-3 pb-1 text-xs font-bold tracking-widest text-accent-700 uppercase'
											}
										>
											{group.label}
										</p>
										<ul role={'presentation'}>
											{group.hits.map((hit) => {
												const index = runningIndex;
												runningIndex += 1;
												return (
													<SearchResultRow
														key={hit.doc.id}
														hit={hit}
														optionId={optionId(index)}
														active={index === activeIndex}
														onHover={() => setActive(index)}
														onNavigate={onLinkClick}
													/>
												);
											})}
										</ul>
									</div>
								))}
							</div>
						</div>
					) : (
						<SearchEmptyState query={deferredQuery.trim()} onNavigate={closeNow} />
					)
				) : null}
			</div>

			<div className={'flex shrink-0 items-center justify-between gap-3 border-t border-line px-4 py-3'}>
				<Link
					href={allResultsHref}
					prefetch={false}
					onClick={(event) => onLinkClick(event, allResultsHref)}
					className={
						'inline-flex min-h-10 items-center gap-1.5 text-sm font-bold text-brand-800 hover:underline'
					}
				>
					{'Все результаты'}
					<Icon name={'arrow-right'} size={16} />
				</Link>
				<p aria-hidden className={'items-center gap-3 text-xs text-muted max-sm:hidden sm:flex'}>
					<span>
						<Kbd>{'↑'}</Kbd>
						<Kbd>{'↓'}</Kbd>
						{' выбор'}
					</span>
					<span>
						<Kbd>{'Enter'}</Kbd>
						{' открыть'}
					</span>
					<span>
						<Kbd>{'Esc'}</Kbd>
						{' закрыть'}
					</span>
				</p>
			</div>
		</dialog>
	);
}

function Kbd({children}: {children: ReactNode}): ReactNode {
	return (
		<kbd className={'mr-1 inline-block rounded-md border border-line bg-surface px-1.5 py-0.5 font-sans'}>
			{children}
		</kbd>
	);
}
