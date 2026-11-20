'use client';

import {useState} from 'react';

import {Button} from '@/components/ui/Button';
import {Icon} from '@/components/ui/Icon';

import type {ReactNode} from 'react';

type TYandexReviewsProps = {
	/** `https://yandex.ru/maps-reviews-widget/<orgId>?comments` */
	widgetUrl: string;
	/** Plain link to the organisation's reviews, always available. */
	orgUrl: string;
	title: string;
};

/** The Yandex reviews widget is heavy: the iframe is created only after the visitor asks for it. */
export function YandexReviews({widgetUrl, orgUrl, title}: TYandexReviewsProps): ReactNode {
	const [loaded, setLoaded] = useState(false);

	return (
		<div
			className={
				'relative h-[560px] overflow-hidden rounded-card border border-line bg-surface shadow-card sm:h-[640px]'
			}
		>
			{loaded ? (
				<iframe
					src={widgetUrl}
					title={title}
					loading={'lazy'}
					referrerPolicy={'strict-origin-when-cross-origin'}
					className={'absolute inset-0 size-full border-0'}
				/>
			) : (
				<div
					className={
						'absolute inset-0 flex flex-col items-start justify-center gap-4 bg-gradient-to-br from-brand-50 to-accent-50 p-6 sm:p-10'
					}
				>
					<span className={'grid size-12 place-items-center rounded-2xl bg-brand-100 text-brand-800'}>
						<Icon name={'star'} size={24} />
					</span>
					<p className={'text-xl font-extrabold text-ink'}>{title}</p>
					<div className={'flex flex-wrap gap-3'}>
						<Button onClick={() => setLoaded(true)}>{'Показать отзывы'}</Button>
						<a
							href={orgUrl}
							target={'_blank'}
							rel={'noopener noreferrer'}
							className={
								'inline-flex min-h-12 items-center gap-2 px-3 font-bold text-brand-800 underline underline-offset-4'
							}
						>
							{'Открыть на Яндекс Картах'}
							<Icon name={'external'} size={16} />
						</a>
					</div>
				</div>
			)}
		</div>
	);
}
