import Image from 'next/image';

import {Breadcrumbs} from '@/components/ui/Breadcrumbs';
import {ButtonLink} from '@/components/ui/ButtonLink';
import {Container} from '@/components/ui/Container';
import {Eyebrow} from '@/components/ui/Eyebrow';
import {Heading} from '@/components/ui/Heading';
import {LEAD_ANCHOR} from '@/lib/site';

import type {ReactNode} from 'react';
import type {TBreadcrumb} from '@/components/ui/Breadcrumbs';
import type {TCta, TImage} from '@/components/ui/types';

type TPageHeroProps = {
	breadcrumbs?: TBreadcrumb[];
	eyebrow?: string;
	title: string;
	lead?: string;
	/** Hero image, gets `priority` (it is the LCP element). */
	image?: TImage;
	/** Defaults to «Записаться» → #zapis. Pass null to hide. */
	cta?: TCta | null;
	secondaryCta?: TCta;
	/** `split`: text + image card (default). `cover`: full-bleed background image (needs `image`). */
	variant?: 'split' | 'cover';
	children?: ReactNode;
};

type TPageHeroTextProps = Pick<TPageHeroProps, 'eyebrow' | 'title' | 'lead' | 'cta' | 'secondaryCta' | 'children'>;

function PageHeroText({eyebrow, title, lead, cta, secondaryCta, children}: TPageHeroTextProps): ReactNode {
	return (
		<>
			{eyebrow ? <Eyebrow className={'mb-4'}>{eyebrow}</Eyebrow> : null}
			<Heading level={1}>{title}</Heading>
			{lead ? <p className={'mt-4 max-w-2xl text-lg sm:text-xl'}>{lead}</p> : null}
			{cta || secondaryCta ? (
				<div className={'mt-7 flex flex-wrap gap-3'}>
					{cta ? (
						<ButtonLink href={cta.href} size={'lg'}>
							{cta.label}
						</ButtonLink>
					) : null}
					{secondaryCta ? (
						<ButtonLink href={secondaryCta.href} variant={'secondary'} size={'lg'}>
							{secondaryCta.label}
						</ButtonLink>
					) : null}
				</div>
			) : null}
			{children}
		</>
	);
}

export function PageHero({
	breadcrumbs,
	eyebrow,
	title,
	lead,
	image,
	cta = {label: 'Записаться', href: LEAD_ANCHOR},
	secondaryCta,
	variant = 'split',
	children
}: TPageHeroProps): ReactNode {
	const text = {eyebrow, title, lead, cta, secondaryCta, children};

	if (variant === 'cover' && image) {
		return (
			<section className={'relative isolate overflow-hidden'}>
				<Image
					src={image.src}
					alt={image.alt}
					fill
					priority
					sizes={'100vw'}
					className={'-z-20 object-cover object-center'}
				/>
				<div
					aria-hidden
					className={
						'absolute inset-0 -z-10 bg-gradient-to-b from-white/80 via-white/55 to-white/20 lg:bg-gradient-to-r lg:from-white/85 lg:via-white/45 lg:via-35% lg:to-transparent lg:to-60%'
					}
				/>
				<Container
					className={'flex min-h-[440px] flex-col pt-6 pb-section md:pt-8 md:pb-section-lg lg:min-h-[560px]'}
				>
					{breadcrumbs ? (
						<div className={'mb-6'}>
							<Breadcrumbs items={breadcrumbs} />
						</div>
					) : null}
					<div className={'flex flex-1 flex-col justify-center'}>
						<div className={'max-w-2xl [text-shadow:0_1px_12px_rgb(255_255_255/0.8)]'}>
							<PageHeroText {...text} />
						</div>
					</div>
				</Container>
			</section>
		);
	}

	return (
		<section className={'pt-6 pb-section md:pt-8 md:pb-section-lg'}>
			<Container>
				{breadcrumbs ? (
					<div className={'mb-6'}>
						<Breadcrumbs items={breadcrumbs} />
					</div>
				) : null}
				<div className={image ? 'grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12' : 'max-w-3xl'}>
					<div>
						<PageHeroText {...text} />
					</div>
					{image ? (
						<div className={'relative aspect-[16/10] overflow-hidden rounded-card shadow-pop'}>
							<Image
								src={image.src}
								alt={image.alt}
								fill
								priority
								sizes={'(min-width: 1200px) 560px, (min-width: 1024px) 45vw, 100vw'}
								className={'object-cover object-bottom'}
							/>
						</div>
					) : null}
				</div>
			</Container>
		</section>
	);
}
