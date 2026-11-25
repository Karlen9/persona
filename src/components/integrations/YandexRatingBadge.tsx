'use client';

import {useEffect, useRef, useState} from 'react';

import {buttonClasses} from '@/components/ui/Button';

import type {ReactNode} from 'react';

type TYandexRatingBadgeProps = {
	badgeUrl: string;
	orgUrl: string;
};

/**
 * Yandex rating badge. The iframe is not part of the initial HTML: it is created only when the placeholder
 * scrolls into view. The placeholder has the badge's fixed 150x50 size, so nothing shifts.
 */
export function YandexRatingBadge({badgeUrl, orgUrl}: TYandexRatingBadgeProps): ReactNode {
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
					src={badgeUrl}
					title={'Рейтинг PersOna на Яндекс Картах'}
					width={150}
					height={50}
					loading={'lazy'}
					className={'block h-[50px] w-[150px] border-0'}
				/>
			) : (
				<a
					href={orgUrl}
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

type TGisReviewsLinkProps = {
	url: string;
};

export function GisReviewsLink({url}: TGisReviewsLinkProps): ReactNode {
	return (
		<a
			href={url}
			target={'_blank'}
			rel={'noopener noreferrer'}
			className={buttonClasses({variant: 'secondary', size: 'sm'})}
		>
			{'Отзывы в 2ГИС'}
		</a>
	);
}
