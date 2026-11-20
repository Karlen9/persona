import {cn} from '@/lib/cn';

import {Icon} from './Icon';

import type {ReactNode} from 'react';
import type {TIconName} from './Icon';

export type TIconFeature = {
	icon: TIconName;
	title: string;
	text?: string;
};

export function IconFeature({icon, title, text}: TIconFeature): ReactNode {
	return (
		<div className={'flex items-start gap-4'}>
			<span className={'grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-800'}>
				<Icon name={icon} size={24} />
			</span>
			<div>
				<h3 className={'text-lg leading-snug font-extrabold text-ink'}>{title}</h3>
				{text ? <p className={'mt-1 text-[15px]'}>{text}</p> : null}
			</div>
		</div>
	);
}

type TFeatureGridProps = {
	items: TIconFeature[];
	columns?: 2 | 3 | 4;
	className?: string;
};

const cols = {
	2: 'sm:grid-cols-2',
	3: 'sm:grid-cols-2 lg:grid-cols-3',
	4: 'sm:grid-cols-2 lg:grid-cols-4'
};

export function FeatureGrid({items, columns = 3, className}: TFeatureGridProps): ReactNode {
	return (
		<div className={cn('grid gap-x-8 gap-y-8', cols[columns], className)}>
			{items.map((item) => (
				<IconFeature key={item.title} {...item} />
			))}
		</div>
	);
}
