'use client';

import {useEffect, useState} from 'react';

import {useTileActivity} from '@/components/bento/TileActivity';
import {cn} from '@/lib/cn';

import type {ReactNode} from 'react';

type TCyclingListPreviewProps = {
	items: string[];
};

export function CyclingListPreview({items}: TCyclingListPreviewProps): ReactNode {
	const {active, visible, reducedMotion} = useTileActivity();
	const [index, setIndex] = useState(0);
	const running = visible && !reducedMotion && items.length > 1;

	useEffect(() => {
		if (!running) return;
		const timer = setInterval(() => setIndex((current) => (current + 1) % items.length), active ? 900 : 2200);
		return () => clearInterval(timer);
	}, [running, active, items.length]);

	const highlighted = reducedMotion ? 0 : index;

	return (
		<ul className={'flex h-full flex-col justify-end gap-1'}>
			{items.map((item, position) => (
				<li
					key={item}
					className={cn(
						'truncate rounded-xl px-3 py-1.5 text-sm font-bold transition-[background-color,color,transform,box-shadow] duration-300',
						position === highlighted
							? 'translate-x-1 bg-white text-brand-800 shadow-card'
							: 'text-brand-800/60'
					)}
				>
					{item}
				</li>
			))}
		</ul>
	);
}
