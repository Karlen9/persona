import {cn} from '@/lib/cn';

import type {ReactNode} from 'react';

type THeadingProps = {
	level?: 1 | 2 | 3 | 4;
	/** Visual size, defaults to a size matching the level. */
	size?: 'hero' | 'display' | 'xl' | 'lg' | 'md' | 'sm';
	className?: string;
	id?: string;
	children: ReactNode;
};

const defaultSize = {1: 'xl', 2: 'lg', 3: 'md', 4: 'sm'} as const;

const sizeClasses = {
	hero: 'text-4xl sm:text-5xl lg:text-6xl leading-[1.05]',
	display: 'text-3xl sm:text-4xl leading-[1.08]',
	xl: 'text-3xl sm:text-4xl lg:text-5xl leading-tight',
	lg: 'text-2xl sm:text-3xl leading-tight',
	md: 'text-xl sm:text-2xl leading-snug',
	sm: 'text-lg leading-snug'
};

export function Heading({level = 2, size, className, id, children}: THeadingProps): ReactNode {
	const Tag = `h${level}` as const;
	return (
		<Tag
			id={id}
			className={cn(
				'font-extrabold tracking-tight text-balance text-ink',
				sizeClasses[size ?? defaultSize[level]],
				className
			)}
		>
			{children}
		</Tag>
	);
}
