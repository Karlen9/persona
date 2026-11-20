import {cn} from '@/lib/cn';

import type {ReactNode} from 'react';

type TEyebrowProps = {
	className?: string;
	children: ReactNode;
};

export function Eyebrow({className, children}: TEyebrowProps): ReactNode {
	return (
		<span
			className={cn(
				'inline-block rounded-full bg-accent-100 px-3 py-1 text-xs font-bold tracking-widest text-accent-700 uppercase',
				className
			)}
		>
			{children}
		</span>
	);
}
