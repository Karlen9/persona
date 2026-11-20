import {cn} from '@/lib/cn';

import {CarouselControls} from './CarouselControls';

import type {ReactNode} from 'react';

type TCarouselProps = {
	/** Unique id, needed for prev/next controls and aria. */
	id: string;
	label: string;
	/** Slide width classes, e.g. "w-[80%] sm:w-[45%] lg:w-[31%]". */
	slideClassName?: string;
	controls?: boolean;
	className?: string;
	children: ReactNode[];
};

/** CSS scroll-snap carousel. Slides are the children; controls are an optional tiny client leaf. */
export function Carousel({
	id,
	label,
	slideClassName = 'w-[82%] sm:w-[46%] lg:w-[31.5%]',
	controls = true,
	className,
	children
}: TCarouselProps): ReactNode {
	return (
		<div className={cn('relative', className)}>
			{controls ? (
				<div className={'mb-4 flex justify-end'}>
					<CarouselControls targetId={id} />
				</div>
			) : null}
			<div
				id={id}
				role={'region'}
				aria-roledescription={'carousel'}
				aria-label={label}
				tabIndex={0}
				className={
					'no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-6 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0'
				}
			>
				{children.map((child, index) => (
					<div key={index} className={cn('shrink-0 snap-start', slideClassName)}>
						{child}
					</div>
				))}
			</div>
		</div>
	);
}
