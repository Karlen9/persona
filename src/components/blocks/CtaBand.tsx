import Image from 'next/image';

import {ButtonLink} from '@/components/ui/ButtonLink';
import {Container} from '@/components/ui/Container';
import {Heading} from '@/components/ui/Heading';
import {cn} from '@/lib/cn';
import {LEAD_ANCHOR} from '@/lib/site';

import type {ReactNode} from 'react';
import type {TCta} from '@/components/ui/types';
import type {TImage} from '@/content/types';

type TCtaBandProps = {
	/** Anchor id of the band (e.g. the old `consult-form`). */
	id?: string;
	title: string;
	text?: string;
	cta?: TCta;
	secondaryCta?: TCta;
	/** Photo behind the band (the old home «consultation» block); text switches to white over a dark veil. */
	image?: TImage;
};

export function CtaBand({
	id,
	title,
	text,
	cta = {label: 'Записаться', href: LEAD_ANCHOR},
	secondaryCta,
	image
}: TCtaBandProps): ReactNode {
	return (
		<section id={id} className={'py-section md:py-section-lg'}>
			<Container>
				<div
					className={
						'relative overflow-hidden rounded-card border border-brand-200 bg-gradient-to-br from-brand-100 via-brand-50 to-accent-100 px-6 py-10 text-center sm:px-12 sm:py-14'
					}
				>
					{image ? (
						<>
							<Image
								src={image.src}
								alt={image.alt}
								fill
								sizes={'(min-width: 1280px) 1200px, 100vw'}
								className={'object-cover'}
							/>
							<span aria-hidden className={'absolute inset-0 bg-ink/55'} />
						</>
					) : null}
					<Heading level={2} size={'xl'} className={cn('relative mx-auto max-w-3xl', image && 'text-white')}>
						{title}
					</Heading>
					{text ? (
						<p
							className={cn(
								'relative mx-auto mt-4 max-w-2xl text-lg',
								image ? 'text-white' : 'text-body'
							)}
						>
							{text}
						</p>
					) : null}
					<div className={'relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'}>
						<ButtonLink href={cta.href} size={'lg'}>
							{cta.label}
						</ButtonLink>
						{secondaryCta ? (
							<ButtonLink href={secondaryCta.href} variant={'secondary'} size={'lg'}>
								{secondaryCta.label}
							</ButtonLink>
						) : null}
					</div>
				</div>
			</Container>
		</section>
	);
}
