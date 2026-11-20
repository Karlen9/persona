'use client';

import {useEffect, useRef, useState} from 'react';

import {Button} from '@/components/ui/Button';
import {Icon} from '@/components/ui/Icon';

import type {ReactNode} from 'react';

type TYandexMapProps = {
	/** Yandex Maps constructor embed URL (https://yandex.ru/map-widget/v1/...). */
	embedUrl: string;
	title: string;
	address: string;
	metro?: string;
};

export function YandexMap({embedUrl, title, address, metro}: TYandexMapProps): ReactNode {
	const ref = useRef<HTMLDivElement>(null);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node || loaded || !('IntersectionObserver' in window)) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setLoaded(true);
					observer.disconnect();
				}
			},
			{rootMargin: '240px'}
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [loaded]);

	return (
		<div
			ref={ref}
			className={
				'relative aspect-[4/3] overflow-hidden rounded-card border border-line bg-surface shadow-card sm:aspect-[2/1]'
			}
		>
			{loaded ? (
				<iframe
					src={embedUrl}
					title={`Карта: ${title}`}
					loading={'lazy'}
					referrerPolicy={'strict-origin-when-cross-origin'}
					className={'absolute inset-0 size-full border-0'}
					allowFullScreen
				/>
			) : (
				<div
					className={
						'absolute inset-0 flex flex-col items-start justify-center gap-3 bg-gradient-to-br from-brand-50 to-accent-50 p-6 sm:p-10'
					}
				>
					<span className={'grid size-12 place-items-center rounded-2xl bg-brand-100 text-brand-800'}>
						<Icon name={'map-pin'} size={24} />
					</span>
					<p className={'text-xl font-extrabold text-ink'}>{title}</p>
					<p>{address}</p>
					{metro ? <p className={'text-sm text-muted'}>{metro}</p> : null}
					<Button onClick={() => setLoaded(true)}>{'Показать карту'}</Button>
				</div>
			)}
		</div>
	);
}
