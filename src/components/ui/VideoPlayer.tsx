'use client';

import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from '@headlessui/react';
import Image from 'next/image';
import {useState} from 'react';

import {cn} from '@/lib/cn';

import {Icon} from './Icon';

import type {CSSProperties, ReactNode} from 'react';

type TVideoPlayerProps = {
	/** Video file URL; attached to the <video> only after the modal opens. */
	src: string;
	/** Local poster path (rendered with next/image; reserves the aspect ratio). */
	poster: string;
	title: string;
	mimeType?: string;
	/** Tailwind aspect class, default 16/9. Ignored when `ratio` is given. */
	aspectClassName?: string;
	/** width / height of the poster; reserves the exact box (e.g. 720 / 1280 for portrait clips). */
	ratio?: number;
	/** width / height used to size the modal; falls back to `ratio`, then 16/9. */
	modalRatio?: number;
	sizes?: string;
	/** Short title printed over the poster tile. */
	caption?: string;
	className?: string;
};

const MODAL_MAX_HEIGHT = '85dvh';

export function VideoPlayer({
	src,
	poster,
	title,
	mimeType,
	aspectClassName = 'aspect-video',
	ratio,
	modalRatio,
	sizes = '(min-width: 1200px) 580px, (min-width: 768px) 50vw, 100vw',
	caption,
	className
}: TVideoPlayerProps): ReactNode {
	const [open, setOpen] = useState(false);
	const panelRatio = modalRatio ?? ratio ?? 16 / 9;
	const panelStyle: CSSProperties = {
		aspectRatio: panelRatio,
		width: `min(100%, calc(${MODAL_MAX_HEIGHT} * ${panelRatio}))`
	};
	return (
		<>
			<div
				className={cn(
					'relative overflow-hidden rounded-card bg-ink shadow-card',
					ratio ? undefined : aspectClassName,
					className
				)}
				style={ratio ? {aspectRatio: ratio} : undefined}
			>
				<button
					type={'button'}
					onClick={() => setOpen(true)}
					aria-label={`Смотреть видео: ${title}`}
					aria-haspopup={'dialog'}
					className={
						'group absolute inset-0 block size-full cursor-pointer rounded-card focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-700'
					}
				>
					<Image
						src={poster}
						alt={''}
						fill
						sizes={sizes}
						className={
							'object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]'
						}
					/>
					<span
						className={
							'absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/5 to-transparent group-hover:bg-ink/20 motion-safe:transition-colors motion-safe:duration-300'
						}
					/>
					<span
						className={
							'absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-card ring-1 ring-white/60 backdrop-blur-sm group-hover:scale-110 motion-safe:transition-transform motion-safe:duration-300'
						}
					>
						<Icon name={'play'} size={20} className={'translate-x-px fill-current'} />
					</span>
					{caption ? (
						<span
							className={
								'absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent px-3 pt-10 pb-3 text-left text-sm font-bold text-white'
							}
						>
							{caption}
						</span>
					) : null}
				</button>
			</div>
			<Dialog open={open} onClose={setOpen} className={'relative z-50'}>
				<DialogBackdrop
					transition
					className={
						'fixed inset-0 bg-ink/80 backdrop-blur-sm duration-200 ease-out data-closed:opacity-0 motion-reduce:duration-0'
					}
				/>
				<div className={'fixed inset-0 flex items-center justify-center p-4'}>
					<DialogPanel
						transition
						style={panelStyle}
						className={
							'relative max-w-full overflow-hidden rounded-card bg-ink shadow-pop duration-200 ease-out data-closed:scale-95 data-closed:opacity-0 motion-reduce:duration-0'
						}
					>
						<DialogTitle className={'sr-only'}>{title}</DialogTitle>
						<video
							className={'absolute inset-0 size-full bg-ink object-contain'}
							poster={poster}
							controls
							autoPlay
							playsInline
							preload={'none'}
						>
							<source src={src} type={mimeType} />
						</video>
						<button
							type={'button'}
							onClick={() => setOpen(false)}
							aria-label={'Закрыть видео'}
							className={
								'absolute top-3 right-3 grid size-10 cursor-pointer place-items-center rounded-full bg-ink/60 text-white backdrop-blur-sm hover:bg-ink/80 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white'
							}
						>
							<Icon name={'close'} size={20} />
						</button>
					</DialogPanel>
				</div>
			</Dialog>
		</>
	);
}
