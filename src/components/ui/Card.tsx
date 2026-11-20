import {cn} from '@/lib/cn';

import type {ElementType, ReactNode} from 'react';

type TCardProps = {
	as?: ElementType;
	/** Adds a hover lift; use for cards that are links. */
	interactive?: boolean;
	className?: string;
	children: ReactNode;
};

export function Card({as: Tag = 'div', interactive, className, children}: TCardProps): ReactNode {
	return (
		<Tag
			className={cn(
				'rounded-card border border-line bg-white shadow-card',
				interactive && 'transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-pop',
				className
			)}
		>
			{children}
		</Tag>
	);
}
