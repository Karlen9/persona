import Image from 'next/image';
import Link from 'next/link';

import type {ReactNode} from 'react';
import type {TImage} from '@/components/ui/types';

type TNewsCardProps = {
	title: string;
	href: string;
	/** Preformatted date, e.g. «12 марта 2026». */
	date?: string;
	/** ISO date for <time>. */
	dateTime?: string;
	excerpt?: string;
	image?: TImage;
};

export function NewsCard({title, href, date, dateTime, excerpt, image}: TNewsCardProps): ReactNode {
	return (
		<Link
			href={href}
			className={
				'group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-pop'
			}
		>
			<div className={'relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-100 to-accent-100'}>
				{image ? (
					<Image
						src={image.src}
						alt={image.alt}
						fill
						sizes={'(min-width: 1200px) 384px, (min-width: 640px) 45vw, 100vw'}
						className={'object-cover transition-transform duration-300 group-hover:scale-105'}
					/>
				) : null}
			</div>
			<div className={'flex flex-1 flex-col gap-2 p-5'}>
				{date ? (
					<time dateTime={dateTime} className={'text-sm font-semibold text-muted'}>
						{date}
					</time>
				) : null}
				<h3 className={'text-lg leading-snug font-extrabold text-ink group-hover:text-brand-800'}>{title}</h3>
				{excerpt ? <p className={'line-clamp-3 text-[15px]'}>{excerpt}</p> : null}
			</div>
		</Link>
	);
}
