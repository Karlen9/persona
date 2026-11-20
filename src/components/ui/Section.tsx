import {cn} from '@/lib/cn';

import {Container} from './Container';
import {Eyebrow} from './Eyebrow';
import {Heading} from './Heading';

import type {ReactNode} from 'react';

type TSectionProps = {
	id?: string;
	variant?: 'plain' | 'tinted' | 'card';
	eyebrow?: string;
	title?: string;
	lead?: string;
	/** Center the heading block. */
	centered?: boolean;
	/** Renders after the heading on the right on wide screens (e.g. a link). */
	action?: ReactNode;
	className?: string;
	children?: ReactNode;
};

export function Section({
	id,
	variant = 'plain',
	eyebrow,
	title,
	lead,
	centered,
	action,
	className,
	children
}: TSectionProps): ReactNode {
	const hasHead = Boolean(eyebrow || title || lead);
	const head = hasHead ? (
		<div
			className={cn(
				'mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10',
				centered && 'justify-center text-center'
			)}
		>
			<div className={cn('max-w-3xl', centered && 'mx-auto')}>
				{eyebrow ? <Eyebrow className={'mb-4'}>{eyebrow}</Eyebrow> : null}
				{title ? <Heading level={2}>{title}</Heading> : null}
				{lead ? <p className={'mt-3 text-lg'}>{lead}</p> : null}
			</div>
			{action}
		</div>
	) : null;

	if (variant === 'card') {
		return (
			<section id={id} className={cn('py-section md:py-section-lg', className)}>
				<Container>
					<div className={'rounded-card border border-line bg-white p-6 shadow-card sm:p-10 lg:p-12'}>
						{head}
						{children}
					</div>
				</Container>
			</section>
		);
	}

	return (
		<section id={id} className={cn('py-section md:py-section-lg', variant === 'tinted' && 'bg-surface', className)}>
			<Container>
				{head}
				{children}
			</Container>
		</section>
	);
}
