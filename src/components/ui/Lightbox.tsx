'use client';

import Image from 'next/image';
import {useEffect, useRef} from 'react';

import {Icon} from './Icon';

import type {ReactNode} from 'react';

export type TGalleryImage = {
	src: string;
	alt: string;
	width: number;
	height: number;
};

type TLightboxProps = {
	images: TGalleryImage[];
	/** Index of the open image or null when closed. */
	index: number | null;
	onChange: (index: number | null) => void;
};

export function Lightbox({images, index, onChange}: TLightboxProps): ReactNode {
	const ref = useRef<HTMLDialogElement>(null);
	const open = index !== null;

	useEffect(() => {
		const dialog = ref.current;
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	}, [open]);

	useEffect(() => {
		if (!open) return;
		function onKey(event: KeyboardEvent): void {
			if (index === null) return;
			if (event.key === 'ArrowRight') onChange((index + 1) % images.length);
			if (event.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length);
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [open, index, images.length, onChange]);

	const image = index !== null ? images[index] : null;
	const nav =
		'absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-card hover:bg-white';

	return (
		<dialog
			ref={ref}
			aria-label={'Просмотр фотографии'}
			onClose={() => onChange(null)}
			onClick={(event) => {
				if (event.target === ref.current) onChange(null);
			}}
			className={'m-auto max-h-[100dvh] w-full max-w-5xl overflow-visible bg-transparent p-4 backdrop:bg-ink/70'}
		>
			{image ? (
				<div className={'relative flex items-center justify-center'}>
					<Image
						src={image.src}
						alt={image.alt}
						width={image.width}
						height={image.height}
						sizes={'(min-width: 1024px) 960px, 100vw'}
						className={'max-h-[82dvh] w-auto rounded-2xl object-contain'}
					/>
					{images.length > 1 ? (
						<>
							<button
								type={'button'}
								className={`${nav} left-2`}
								aria-label={'Предыдущее фото'}
								onClick={() => onChange(((index ?? 0) - 1 + images.length) % images.length)}
							>
								<Icon name={'chevron-left'} />
							</button>
							<button
								type={'button'}
								className={`${nav} right-2`}
								aria-label={'Следующее фото'}
								onClick={() => onChange(((index ?? 0) + 1) % images.length)}
							>
								<Icon name={'chevron-right'} />
							</button>
						</>
					) : null}
					<button
						type={'button'}
						className={
							'absolute -top-2 -right-2 grid size-10 place-items-center rounded-full bg-white text-ink shadow-card'
						}
						aria-label={'Закрыть'}
						onClick={() => onChange(null)}
					>
						<Icon name={'close'} />
					</button>
				</div>
			) : null}
		</dialog>
	);
}
