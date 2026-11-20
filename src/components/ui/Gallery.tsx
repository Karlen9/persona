'use client';

import Image from 'next/image';
import {useState} from 'react';

import {cn} from '@/lib/cn';

import {Lightbox} from './Lightbox';

import type {ReactNode} from 'react';
import type {TGalleryImage} from './Lightbox';

type TGalleryProps = {
	images: TGalleryImage[];
	columns?: 2 | 3 | 4;
	/** Tile shape; `portrait` for 3:4 photos. */
	aspect?: 'landscape' | 'portrait';
	className?: string;
};

const cols = {
	2: 'grid-cols-2',
	3: 'grid-cols-2 md:grid-cols-3',
	4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
};

const sizes = {
	2: '(min-width: 1200px) 580px, 50vw',
	3: '(min-width: 1200px) 384px, (min-width: 768px) 33vw, 50vw',
	4: '(min-width: 1200px) 288px, (min-width: 768px) 33vw, 50vw'
};

export function Gallery({images, columns = 3, aspect = 'landscape', className}: TGalleryProps): ReactNode {
	const [index, setIndex] = useState<number | null>(null);
	return (
		<>
			<ul className={cn('grid gap-3 sm:gap-4', cols[columns], className)}>
				{images.map((image, i) => (
					<li key={image.src}>
						<button
							type={'button'}
							onClick={() => setIndex(i)}
							aria-label={`Открыть фото: ${image.alt}`}
							className={cn(
								'group relative block w-full overflow-hidden rounded-card',
								aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]'
							)}
						>
							<Image
								src={image.src}
								alt={image.alt}
								fill
								sizes={sizes[columns]}
								className={'object-cover transition-transform duration-300 group-hover:scale-105'}
							/>
						</button>
					</li>
				))}
			</ul>
			<Lightbox images={images} index={index} onChange={setIndex} />
		</>
	);
}
