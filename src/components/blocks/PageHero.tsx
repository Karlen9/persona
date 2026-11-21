import Image from 'next/image';
import {ViewTransition} from 'react';

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
	children?: ReactNode;
	/** Shared-element view-transition name: the hero content morphs from/to the matching bento tile. */
	transitionName?: string;
};

export function PageHero({
	breadcrumbs,
	eyebrow,
	title,
	lead,
	image,
	cta = {label: 'Записаться', href: LEAD_ANCHOR},
	secondaryCta,
	children,
	transitionName
}: TPageHeroProps): ReactNode {
	const layout = (
		<div
			className={image ? 'grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12' : 'max-w-3xl'}
			data-tile-vt={transitionName}
		>
			<div>
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
	);

	return (
		<section className={'pt-6 pb-section md:pt-8 md:pb-section-lg'}>
			<Container>
				{breadcrumbs ? (
					<div className={'mb-6'}>
						<Breadcrumbs items={breadcrumbs} />
					</div>
				) : null}
				{transitionName ? (
					<ViewTransition name={transitionName} share={'tile-morph'}>
						{layout}
					</ViewTransition>
				) : (
					layout
				)}
			</Container>
		</section>
	);
}
