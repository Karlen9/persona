import Image from 'next/image';
import Link from 'next/link';

import {Icon} from '@/components/ui/Icon';

import type {ReactNode} from 'react';
import type {TImage} from '@/components/ui/types';

type TStudioCardProps = {
	name: string;
	href: string;
	address: string;
	metro?: string;
	hours?: string;
	/** Phone numbers as `{label, href}` (`tel:`); rendered as links above the stretched card link. */
	phones?: {label: string; href: string}[];
	image?: TImage;
	imageSizes?: string;
};

export function StudioCard({
	name,
	href,
	address,
	metro,
	hours,
	phones,
	image,
	imageSizes = '(min-width: 1200px) 384px, (min-width: 640px) 45vw, 100vw'
}: TStudioCardProps): ReactNode {
	return (
		<article
			className={
				'group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-pop'
			}
		>
			<div className={'relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50'}>
				{image ? (
					<Image
						src={image.src}
						alt={''}
						fill
						sizes={imageSizes}
						className={'object-cover transition-transform duration-300 group-hover:scale-105'}
					/>
				) : null}
			</div>
			<div className={'flex flex-1 flex-col gap-2 p-5'}>
				<h3 className={'text-xl leading-snug font-extrabold text-ink'}>
					{/* Stretched link: the whole card is clickable, phone links below sit above it. */}
					<Link href={href} className={'after:absolute after:inset-0 after:content-[""]'}>
						{name}
					</Link>
				</h3>
				<p className={'flex items-start gap-2 text-[15px]'}>
					<Icon name={'map-pin'} size={18} className={'mt-0.5 shrink-0 text-brand-700'} />
					{address}
				</p>
				{metro ? (
					<p className={'flex items-start gap-2 text-[15px]'}>
						<Icon name={'metro'} size={18} className={'mt-0.5 shrink-0 text-brand-700'} />
						{metro}
					</p>
				) : null}
				{hours ? (
					<p className={'flex items-start gap-2 text-[15px]'}>
						<Icon name={'clock'} size={18} className={'mt-0.5 shrink-0 text-brand-700'} />
						{hours}
					</p>
				) : null}
				{phones && phones.length > 0 ? (
					<ul className={'flex flex-col gap-1 text-[15px]'}>
						{phones.map((phone) => (
							<li key={phone.href} className={'flex items-start gap-2'}>
								<Icon name={'phone'} size={18} className={'mt-0.5 shrink-0 text-brand-700'} />
								<a
									href={phone.href}
									className={
										'relative z-10 inline-flex min-h-11 items-center font-semibold whitespace-nowrap text-ink hover:text-brand-800'
									}
								>
									{phone.label}
								</a>
							</li>
						))}
					</ul>
				) : null}
				<span aria-hidden className={'mt-auto inline-flex items-center gap-1.5 pt-2 font-bold text-brand-800'}>
					{'О студии'}
					<Icon name={'arrow-right'} size={18} className={'transition-transform group-hover:translate-x-1'} />
				</span>
			</div>
		</article>
	);
}
