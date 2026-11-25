'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';

import {Icon} from '@/components/ui/Icon';

import {SearchDialog} from './SearchDialog';
import {prefetchSearch} from './useSearchEngine';

import type {ReactNode} from 'react';

function isTypingTarget(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

/** Header search control: a real link to `/poisk/` (works without JS) that opens the palette instead. */
export function SearchTrigger(): ReactNode {
	const [open, setOpen] = useState(false);
	const [shortcut, setShortcut] = useState('⌘K');

	useEffect(() => {
		if (!/Mac|iPhone|iPad/i.test(navigator.platform)) setShortcut('Ctrl K');
		function onKeyDown(event: KeyboardEvent): void {
			if ((event.metaKey || event.ctrlKey) && !event.altKey && event.code === 'KeyK') {
				event.preventDefault();
				setOpen((value) => !value);
				return;
			}
			if (
				event.key === '/' &&
				!event.metaKey &&
				!event.ctrlKey &&
				!event.altKey &&
				!isTypingTarget(event.target) &&
				!document.querySelector('dialog[open]')
			) {
				event.preventDefault();
				setOpen(true);
			}
		}
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, []);

	return (
		<>
			<Link
				href={'/poisk/'}
				prefetch={false}
				aria-label={'Поиск по сайту'}
				aria-haspopup={'dialog'}
				onClick={(event) => {
					event.preventDefault();
					setOpen(true);
				}}
				onPointerEnter={prefetchSearch}
				onFocus={prefetchSearch}
				onTouchStart={prefetchSearch}
				className={
					'grid size-11 shrink-0 place-items-center rounded-xl text-ink hover:bg-brand-50 xl:inline-flex xl:h-10 xl:w-60 xl:justify-start xl:gap-2 xl:rounded-btn xl:border xl:border-line xl:bg-surface xl:px-3 xl:text-[15px] xl:font-semibold xl:text-muted xl:hover:border-brand-400 xl:hover:text-brand-800 2xl:w-80'
				}
			>
				<Icon name={'search'} size={22} className={'xl:size-[18px]'} />
				<span className={'max-xl:hidden'}>{'Поиск'}</span>
				<kbd
					aria-hidden
					className={
						'ml-auto rounded-md border border-line bg-white px-1.5 py-0.5 font-sans text-xs font-semibold text-muted max-xl:hidden xl:inline'
					}
				>
					{shortcut}
				</kbd>
			</Link>
			<SearchDialog open={open} onClose={() => setOpen(false)} />
		</>
	);
}
