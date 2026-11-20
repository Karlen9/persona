'use client';

import {useEffect, useRef, useState} from 'react';

import {buttonClasses} from '@/components/ui/Button';
import {site} from '@/content/site';
import {GIS_REVIEWS_URL} from '@/lib/site';

import type {ReactNode} from 'react';

/**
 * Yandex rating badge. The iframe is not part of the initial HTML: it is created only when the placeholder
 * scrolls into view. The placeholder has the badge's fixed 150x50 size, so nothing shifts.
 */
export function YandexRatingBadge(): ReactNode {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node || visible) return;
		if (!('IntersectionObserver' in window)) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{rootMargin: '200px'}
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [visible]);

	return (
		<div ref={ref} className={'h-[50px] w-[150px]'}>
			{visible ? (
				<iframe
					src={site.yandex.ratingBadgeUrl}
					title={'Рейтинг PersOna на Яндекс Картах'}
					width={150}
					height={50}
					loading={'lazy'}
					className={'block h-[50px] w-[150px] border-0'}
				/>
			) : (
				<a
					href={site.yandex.orgUrl}
					target={'_blank'}
					rel={'noopener noreferrer'}
					className={
						'flex size-full items-center justify-center rounded-xl border border-line bg-white text-sm font-bold text-ink'
					}
				>
					{'Яндекс Карты'}
				</a>
			)}
		</div>
	);
}

export function GisReviewsLink(): ReactNode {
	return (
		<a
			href={GIS_REVIEWS_URL}
			target={'_blank'}
			rel={'noopener noreferrer'}
			className={buttonClasses({variant: 'secondary', size: 'sm'})}
		>
			{'Отзывы в 2ГИС'}
		</a>
	);
}
