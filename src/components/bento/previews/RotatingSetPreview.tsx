'use client';

import {useEffect, useState} from 'react';

import {useTileActivity} from '@/components/bento/TileActivity';
import {Icon} from '@/components/ui/Icon';
import {cn} from '@/lib/cn';

import type {ReactNode} from 'react';
import type {TIconName} from '@/components/ui/Icon';

type TRotatingItem = {
	title: string;
	text: string;
	icon: TIconName;
};

type TRotatingSetPreviewProps = {
	items: TRotatingItem[];
};

export function RotatingSetPreview({items}: TRotatingSetPreviewProps): ReactNode {
	const {active, visible, reducedMotion} = useTileActivity();
	const [index, setIndex] = useState(0);
	const running = visible && !reducedMotion && items.length > 1;

	useEffect(() => {
		if (!running) return;
		const timer = setInterval(() => setIndex((current) => (current + 1) % items.length), active ? 1300 : 3000);
		return () => clearInterval(timer);
	}, [running, active, items.length]);

	const current = reducedMotion ? 0 : index;

	return (
		<div className={'flex h-full flex-col justify-center gap-3'}>
			<div className={'relative h-16'}>
				{items.map((item, position) => (
					<div
						key={item.title}
						className={cn(
							'absolute inset-0 flex items-center gap-3 rounded-2xl bg-white px-4 shadow-card transition-opacity duration-500',
							position === current ? 'opacity-100' : 'opacity-0'
						)}
					>
						<span
							className={
								'grid size-10 shrink-0 place-items-center rounded-full bg-accent-100 text-accent-700'
							}
						>
							<Icon name={item.icon} size={20} />
						</span>
						<span className={'min-w-0'}>
							<span className={'block truncate text-sm font-extrabold text-ink'}>{item.title}</span>
							<span className={'block truncate text-xs text-body'}>{item.text}</span>
						</span>
					</div>
				))}
			</div>
			<div className={'flex gap-1.5'}>
				{items.map((item, position) => (
					<span
						key={item.title}
						className={cn(
							'h-1.5 rounded-full transition-all duration-300',
							position === current ? 'w-6 bg-accent-700' : 'w-1.5 bg-accent-300'
						)}
					/>
				))}
			</div>
		</div>
	);
}
