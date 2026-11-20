import Image from 'next/image';

import type {ReactNode} from 'react';
import type {TImage} from '@/components/ui/types';

export type TLogoItem = {
	name: string;
	logo?: TImage;
};

type TLogoStripProps = {
	title?: string;
	items: TLogoItem[];
};

export function LogoStrip({title, items}: TLogoStripProps): ReactNode {
	return (
		<div>
			{title ? (
				<p className={'mb-5 text-center text-sm font-bold tracking-widest text-muted uppercase'}>{title}</p>
			) : null}
			<ul className={'flex flex-wrap items-center justify-center gap-x-10 gap-y-5'}>
				{items.map((item) => (
					<li key={item.name} className={'flex h-12 items-center'}>
						{item.logo ? (
							<Image
								src={item.logo.src}
								alt={item.logo.alt}
								width={140}
								height={48}
								className={
									'h-10 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0'
								}
							/>
						) : (
							<span className={'text-lg font-extrabold text-muted'}>{item.name}</span>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}
