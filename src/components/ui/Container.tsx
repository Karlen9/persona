import {cn} from '@/lib/cn';

import type {ElementType, ReactNode} from 'react';

type TContainerProps = {
	as?: ElementType;
	className?: string;
	children: ReactNode;
};

export function Container({as: Tag = 'div', className, children}: TContainerProps): ReactNode {
	return <Tag className={cn('mx-auto w-full max-w-site px-4 sm:px-6 lg:px-8', className)}>{children}</Tag>;
}
