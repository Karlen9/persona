import Image from 'next/image';
import Link from 'next/link';

import {Badge} from '@/components/ui/Badge';
import {Icon} from '@/components/ui/Icon';

import type {ReactNode} from 'react';
import type {TImage} from '@/components/ui/types';

type TDirectionCardProps = {
	title: string;
	href: string;
	text?: string;
	/** e.g. «5–12 лет» */
	age?: string;
	image?: TImage;
	/** Bullet list (the highlighted directions of the home page). */
	bullets?: string[];
	/**
	 * `default`: image on top (4/3 crop of the poster) + text.
	 * `poster`: the whole portrait poster is the card (the poster already carries the title and bullets).
	 */
	variant?: 'default' | 'poster';
	/** `sizes` for the card image; set by the caller because it depends on the grid. */
	imageSizes?: string;
	/** Set only for the first card of a page when it is the LCP image. */
	priority?: boolean;
	/** Catalogue: the poster already shows the name, so only «Подробнее» is shown under it (title stays for screen readers). */
	compact?: boolean;
};

const frame =
	'group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-pop';

export function DirectionCard({
	title,
	href,
	text,
	age,
	image,
	bullets,
	variant = 'default',
	imageSizes = '(min-width: 1200px) 384px, (min-width: 640px) 45vw, 100vw',
	priority,
	compact
}: TDirectionCardProps): ReactNode {
	if (variant === 'poster' && image) {
		return (
			<Link href={href} className={frame}>
				<div className={'relative aspect-[9/16] bg-surface'}>
					<Image
						src={image.src}
						alt={''}
						fill
						sizes={imageSizes}
						priority={priority}
						className={'object-cover'}
					/>
				</div>
				<span className={'sr-only'}>{title}</span>
			</Link>
		);
	}

	return (
		<Link href={href} className={frame}>
			{image ? (
				<div className={'relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-100 to-accent-100'}>
					<Image
						src={image.src}
						alt={''}
						fill
						sizes={imageSizes}
						priority={priority}
						className={'object-cover object-top transition-transform duration-300 group-hover:scale-105'}
					/>
					{age ? (
						<Badge tone={'accent'} className={'absolute top-3 left-3'}>
							{age}
						</Badge>
					) : null}
				</div>
			) : null}
			<div className={'flex flex-1 flex-col gap-2 p-5'}>
				<h3 className={compact ? 'sr-only' : 'text-xl leading-snug font-extrabold text-ink'}>{title}</h3>
				{!compact && text ? <p className={'text-[15px]'}>{text}</p> : null}
				{!compact && bullets && bullets.length > 0 ? (
					<ul className={'mt-1 flex flex-col gap-1.5 text-[15px]'}>
						{bullets.map((bullet) => (
							<li key={bullet} className={'flex items-start gap-2'}>
								<Icon name={'check'} size={16} className={'mt-1 shrink-0 text-brand-700'} />
								{bullet}
							</li>
						))}
					</ul>
				) : null}
				<span className={'mt-auto inline-flex items-center gap-1.5 pt-2 font-bold text-brand-800'}>
					{'Подробнее'}
					<Icon name={'arrow-right'} size={18} className={'transition-transform group-hover:translate-x-1'} />
				</span>
			</div>
		</Link>
	);
}
