import {cn} from '@/lib/cn';

import type {ReactNode} from 'react';

type TBadgeProps = {
	tone?: 'brand' | 'accent' | 'neutral';
	className?: string;
	children: ReactNode;
};

const tones = {
	brand: 'bg-brand-100 text-brand-ink',
	accent: 'bg-accent-100 text-accent-700',
	neutral: 'bg-surface text-body border border-line'
};

export function Badge({tone = 'brand', className, children}: TBadgeProps): ReactNode {
	return (
		<span
			className={cn(
				'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold',
				tones[tone],
				className
			)}
		>
			{children}
		</span>
	);
}
