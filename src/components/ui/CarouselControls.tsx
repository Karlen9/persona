'use client';

import {Icon} from './Icon';

import type {ReactNode} from 'react';

type TCarouselControlsProps = {
	/** id of the scroll container */
	targetId: string;
};

export function CarouselControls({targetId}: TCarouselControlsProps): ReactNode {
	function scrollBy(direction: 1 | -1): void {
		const el = document.getElementById(targetId);
		if (!el) return;
		const step = Math.max(el.clientWidth * 0.8, 280);
		el.scrollBy({left: step * direction, behavior: 'smooth'});
	}
	const btn =
		'border-line text-ink hover:border-brand-400 grid size-11 place-items-center rounded-full border bg-white shadow-card transition-colors';
	return (
		<div className={'flex gap-2 max-sm:hidden'}>
			<button type={'button'} className={btn} aria-label={'Назад'} onClick={() => scrollBy(-1)}>
				<Icon name={'chevron-left'} />
			</button>
			<button type={'button'} className={btn} aria-label={'Вперёд'} onClick={() => scrollBy(1)}>
				<Icon name={'chevron-right'} />
			</button>
		</div>
	);
}
