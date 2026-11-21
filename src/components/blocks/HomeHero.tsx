import Image from 'next/image';

import {ButtonLink} from '@/components/ui/ButtonLink';
import {Container} from '@/components/ui/Container';
import {Heading} from '@/components/ui/Heading';
import {Icon} from '@/components/ui/Icon';
import {LEAD_ANCHOR} from '@/lib/site';

import type {ReactNode} from 'react';
import type {TCta, TImage} from '@/components/ui/types';
import type {TSocial} from '@/content/types';

type THomeHeroProps = {
	title: string;
	/** The heading split into display lines (the first line is the lead-in). */
	lines?: string[];
	/** Part of the heading highlighted in the brand colour. */
	accent?: string | null;
	text: string;
	/** Hero photo (priority/LCP) behind the frosted card. Without it the soft glow background is used. */
	image?: TImage;
	primaryCta?: TCta;
	secondaryCta?: TCta;
	socials?: TSocial[];
};

export function HeadingLine({line, accent}: {line: string; accent?: string | null}): ReactNode {
	const at = accent ? line.indexOf(accent) : -1;
	if (!accent || at === -1) return line;
	return (
		<>
			{line.slice(0, at)}
			<span className={'text-brand-700'}>{accent}</span>
			{line.slice(at + accent.length)}
		</>
	);
}

export function HomeHero({
	title,
	lines,
	accent,
	text,
	image,
	primaryCta = {label: 'Записаться на занятие', href: LEAD_ANCHOR},
	secondaryCta = {label: 'Все направления', href: '/napravleniya/'},
	socials
}: THomeHeroProps): ReactNode {
	const displayLines = lines && lines.length > 0 ? lines : [title];
	return (
		<section className={'py-4 md:py-6 lg:py-8'}>
			<Container>
				<div
					className={'relative lg:flex lg:min-h-[620px] lg:items-center lg:overflow-hidden lg:rounded-[28px]'}
				>
					{image ? (
						<div
							className={
								'relative aspect-[16/10] overflow-hidden rounded-[24px] bg-surface lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-[118%] lg:rounded-none'
							}
						>
							<Image
								src={image.src}
								alt={image.alt}
								fill
								priority
								fetchPriority={'high'}
								sizes={
									'(min-width: 1232px) 1340px, (min-width: 1024px) calc((100vw - 4rem) * 1.18), (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)'
								}
								className={'object-cover object-[50%_42%]'}
							/>
							<div
								aria-hidden
								className={
									'absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent max-lg:hidden'
								}
							/>
						</div>
					) : (
						<div aria-hidden className={'absolute inset-0 -z-10 overflow-hidden'}>
							<div className={'absolute -top-24 -left-24 size-96 rounded-full bg-brand-100 blur-3xl'} />
							<div className={'absolute top-10 -right-24 size-96 rounded-full bg-accent-100 blur-3xl'} />
						</div>
					)}
					<div
						className={
							'relative z-10 mx-3 -mt-10 max-w-[540px] rounded-[26px] border border-white/60 bg-white/85 p-6 shadow-pop backdrop-blur-md sm:mx-6 sm:p-8 lg:mx-0 lg:my-10 lg:mt-0 lg:ml-12'
						}
					>
						<Heading level={1} size={'display'}>
							{/* The h1 reads as one sentence; the visual line breaks are CSS-only. */}
							{displayLines.map((line, index) => (
								<span key={line} className={'block'}>
									<HeadingLine line={line} accent={accent} />
									{index < displayLines.length - 1 ? ' ' : null}
								</span>
							))}
						</Heading>
						<p className={'mt-4 text-base text-body sm:text-lg'}>{text}</p>
						<div className={'mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap'}>
							<ButtonLink href={primaryCta.href} size={'lg'}>
								{primaryCta.label}
							</ButtonLink>
							<ButtonLink href={secondaryCta.href} variant={'secondary'} size={'lg'}>
								{secondaryCta.label}
							</ButtonLink>
						</div>
						{socials && socials.length > 0 ? (
							<ul className={'mt-6 flex gap-2'}>
								{socials.map((social) => (
									<li key={social.kind}>
										<a
											href={social.url}
											target={'_blank'}
											rel={'noopener noreferrer'}
											aria-label={social.label}
											className={
												'grid size-11 place-items-center rounded-full border border-line bg-white text-brand-800 shadow-card transition-colors hover:bg-brand-100'
											}
										>
											<Icon name={social.kind} size={social.kind === 'telegram' ? 20 : 26} />
										</a>
									</li>
								))}
							</ul>
						) : null}
					</div>
				</div>
			</Container>
		</section>
	);
}
