import Image from 'next/image';

import {cn} from '@/lib/cn';

import type {ReactNode} from 'react';
import type {TProgrammeItem} from '@/content/types';

type TProgrammeGridProps = {
	items: TProgrammeItem[];
	columns?: 2 | 3;
};

const imageSizes = {
	2: '(min-width: 1200px) 580px, (min-width: 640px) 50vw, 100vw',
	3: '(min-width: 1200px) 384px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
};

/**
 * Grid of white cards: title + text (course programme, advantages, event cards).
 * A card with `image` gets the photo on top (4:3, cropped from the top third where faces usually are).
 */
export function ProgrammeGrid({items, columns = 3}: TProgrammeGridProps): ReactNode {
	return (
		<ul className={cn('grid gap-4 sm:grid-cols-2', columns === 3 && 'lg:grid-cols-3')}>
			{items.map((item, index) => (
				<li
					key={`${item.title}-${index}`}
					className={'flex flex-col overflow-hidden rounded-card border border-line bg-white shadow-card'}
				>
					{item.image ? (
						<Image
							src={item.image.src}
							alt={item.image.alt}
							width={item.image.width}
							height={item.image.height}
							sizes={imageSizes[columns]}
							className={'aspect-[4/3] w-full bg-surface object-cover object-[50%_25%]'}
						/>
					) : null}
					<div className={'flex flex-1 flex-col gap-3 p-6'}>
						<h3 className={'text-xl leading-snug font-extrabold text-ink'}>{item.title}</h3>
						<p className={'text-base'}>{item.text}</p>
					</div>
				</li>
			))}
		</ul>
	);
}
