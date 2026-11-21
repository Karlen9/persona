'use client';

import Image from 'next/image';
import {useEffect, useState} from 'react';

import {useTileActivity} from '@/components/bento/TileActivity';
import {cn} from '@/lib/cn';

import type {ReactNode} from 'react';

type TImageCarouselPreviewProps = {
	images: string[];
	sizes: string;
};

export function ImageCarouselPreview({images, sizes}: TImageCarouselPreviewProps): ReactNode {
	const {active, visible, reducedMotion} = useTileActivity();
	const [index, setIndex] = useState(0);
	// Highest slide reached so far: later images are mounted (and fetched) only when the carousel gets to them.
	const [reached, setReached] = useState(0);
	const running = visible && !reducedMotion && images.length > 1;

	useEffect(() => {
		if (!running) return;
		const timer = setInterval(() => setIndex((current) => (current + 1) % images.length), active ? 1200 : 3200);
		return () => clearInterval(timer);
	}, [running, active, images.length]);

	useEffect(() => {
		setReached((max) => Math.max(max, index));
	}, [index]);

	return (
		<div className={'relative size-full'}>
			{images.slice(0, reached + 1).map((src, slide) => (
				<Image
					key={src}
					src={src}
					alt={''}
					fill
					preload={slide === 0}
					sizes={sizes}
					className={cn(
						'object-cover transition-opacity duration-700',
						slide === (reducedMotion ? 0 : index) ? 'opacity-100' : 'opacity-0'
					)}
				/>
			))}
		</div>
	);
}
