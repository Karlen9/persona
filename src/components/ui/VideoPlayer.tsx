'use client';

import Image from 'next/image';
import {useState} from 'react';

import {cn} from '@/lib/cn';

import {Icon} from './Icon';

import type {ReactNode} from 'react';

type TVideoPlayerProps = {
	/** Video file URL; attached to the <video> only after the click. */
	src: string;
	/** Local poster path (rendered with next/image; reserves the aspect ratio). */
	poster: string;
	title: string;
	mimeType?: string;
	/** Tailwind aspect class, default 16/9. Ignored when `ratio` is given. */
	aspectClassName?: string;
	/** width / height of the poster; reserves the exact box (e.g. 720 / 1280 for portrait clips). */
	ratio?: number;
	sizes?: string;
	/** Short title printed over the poster (hidden once the video plays). */
	caption?: string;
	className?: string;
};

export function VideoPlayer({
	src,
	poster,
	title,
	mimeType,
	aspectClassName = 'aspect-video',
	ratio,
	sizes = '(min-width: 1200px) 580px, (min-width: 768px) 50vw, 100vw',
	caption,
	className
}: TVideoPlayerProps): ReactNode {
	const [playing, setPlaying] = useState(false);
	return (
		<div
			className={cn(
				'relative overflow-hidden rounded-card bg-ink',
				ratio ? undefined : aspectClassName,
				className
			)}
			style={ratio ? {aspectRatio: ratio} : undefined}
		>
			{playing ? (
				<video
					className={'absolute inset-0 size-full bg-ink object-contain'}
					poster={poster}
					controls
					autoPlay
					playsInline
					preload={'none'}
					aria-label={title}
				>
					<source src={src} type={mimeType} />
				</video>
			) : (
				<button
					type={'button'}
					onClick={() => setPlaying(true)}
					aria-label={`Смотреть видео: ${title}`}
					className={'group absolute inset-0 block size-full'}
				>
					<Image src={poster} alt={''} fill sizes={sizes} className={'object-cover'} />
					<span className={'absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent'} />
					{caption ? (
						<span
							className={
								'absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-3 pt-8 pb-3 text-left text-sm font-bold text-white'
							}
						>
							{caption}
						</span>
					) : null}
					<span
						className={
							'absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-brand-ink shadow-pop transition-transform group-hover:scale-105'
						}
					>
						<Icon name={'play'} size={26} className={'translate-x-0.5 fill-current'} />
					</span>
				</button>
			)}
		</div>
	);
}
