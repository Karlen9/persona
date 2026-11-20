import {Icon} from '@/components/ui/Icon';

import type {ReactNode} from 'react';

type TReviewCardProps = {
	author: string;
	text: string;
	/** 1–5 */
	rating?: number;
	/** e.g. «Яндекс Карты», date etc. */
	meta?: string;
};

export function ReviewCard({author, text, rating, meta}: TReviewCardProps): ReactNode {
	return (
		<figure className={'flex h-full flex-col gap-4 rounded-card border border-line bg-white p-6 shadow-card'}>
			{rating ? (
				<div role={'img'} aria-label={`Оценка ${rating} из 5`} className={'flex gap-0.5'}>
					{[1, 2, 3, 4, 5].map((n) => (
						<Icon
							key={n}
							name={'star'}
							size={18}
							className={n <= rating ? 'fill-amber-400 text-amber-400' : 'text-line'}
						/>
					))}
				</div>
			) : null}
			<blockquote className={'text-[15px] leading-relaxed'}>{text}</blockquote>
			<figcaption className={'mt-auto'}>
				<span className={'block font-bold text-ink'}>{author}</span>
				{meta ? <span className={'text-sm text-muted'}>{meta}</span> : null}
			</figcaption>
		</figure>
	);
}
