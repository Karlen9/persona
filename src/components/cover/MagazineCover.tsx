import Image from 'next/image';

import {coverEntries, coverStory} from '@/content/cover';
import {cn} from '@/lib/cn';
import {displayFont} from '@/lib/fonts';
import {getIssue} from '@/lib/issue';
import {SITE_NAME} from '@/lib/site';

import {Barcode} from './Barcode';
import {CoverLink} from './CoverLink';

import type {TCoverEntry} from '@/content/cover';
import type {ReactNode} from 'react';

type TCoverLineProps = {
	entry: TCoverEntry;
	align: 'left' | 'right';
	/** Tall layout: the line lives in the list below the cover instead. */
	tallHidden?: boolean;
};

/** One cover line: kicker (+ page) over a serif headline over a teaser. Tall layout drops the teaser. */
function CoverLine({entry, align, tallHidden = false}: TCoverLineProps): ReactNode {
	const isRight = align === 'right';

	return (
		<li className={cn(tallHidden && 'poster-tall:is-hidden')}>
			<CoverLink
				href={entry.href}
				data-entry={entry.id}
				className={cn(
					'mag-line flex min-h-11 flex-col py-1',
					isRight ? 'items-end text-right' : 'items-start text-left'
				)}
			>
				<span className={'flex items-baseline gap-2 poster-wide:gap-3'}>
					<span
						className={
							'text-xs font-bold tracking-[0.06em] text-accent-700 uppercase poster-wide:text-sm poster-wide:tracking-[0.14em]'
						}
					>
						{entry.label}
					</span>
					<span className={'text-[11px] whitespace-nowrap text-muted'}>
						{'с. '}
						{entry.page}
					</span>
				</span>
				<span
					className={
						'mt-0.5 font-display text-[clamp(0.95rem,4.4cqw,1.125rem)] leading-tight font-semibold text-ink poster-wide:mt-1 poster-wide:text-[clamp(1.25rem,1.9cqw,1.9rem)]'
					}
				>
					<span className={'mag-headline'}>{entry.headline}</span>
				</span>
				<span
					className={cn(
						'mag-teaser-line mt-1 text-[15px] text-body poster-tall:is-hidden',
						!isRight && 'mag-teaser'
					)}
				>
					{entry.teaser}
				</span>
			</CoverLink>
		</li>
	);
}

export function MagazineCover(): ReactNode {
	const issue = getIssue();
	const rightEntries = coverEntries.filter((entry) => entry.slot === 'right');
	const leftEntries = coverEntries.filter((entry) => entry.slot === 'left');
	// Tall layout: the third right-slot line does not fit beside her face, so it moves to the list below the cover.
	const overflowEntry = rightEntries[2];
	const belowEntries = coverEntries.filter((entry) => entry.slot === 'left' || entry === overflowEntry);

	return (
		<>
			<section
				data-magazine-cover
				aria-labelledby={'cover-title'}
				className={cn(
					displayFont.variable,
					'mag-cover relative h-svh min-h-[720px] overflow-hidden bg-brand-50 text-body'
				)}
			>
				<div
					className={
						'mag-top z-20 flex items-center justify-between gap-4 text-[11px] font-bold tracking-[0.08em] text-ink uppercase sm:text-xs sm:tracking-[0.18em]'
					}
				>
					<p>
						<span className={'max-sm:sr-only'}>{'Выпуск '}</span>
						{'№ '}
						{issue.number}
						{' · '}
						<time dateTime={issue.isoMonth}>{issue.monthLabel}</time>
					</p>
					<nav aria-label={'Служебная навигация'} className={'-mr-2 flex'}>
						<a href={'#karta-sajta'} className={'inline-flex min-h-11 items-center px-2 hover:underline'}>
							{'Меню'}
						</a>
						<a href={'#kontakty'} className={'inline-flex min-h-11 items-center px-2 hover:underline'}>
							{'Контакты'}
						</a>
					</nav>
				</div>

				<h1 id={'cover-title'} className={'mag-masthead z-0 font-display font-normal text-brand-800'}>
					{SITE_NAME}
					<span className={'sr-only'}>{' — творческий центр для детей и взрослых в Москве'}</span>
				</h1>

				<Image
					src={'/images/cover-cutout.webp'}
					alt={
						'Серьёзная девочка с волнистыми светлыми волосами в оранжевом льняном костюме и белой рубашке держит руки в карманах — как маленький руководитель'
					}
					width={928}
					height={1232}
					priority
					sizes={'(min-width: 48rem) and (min-aspect-ratio: 1/1) 62vh, (min-width: 48rem) 102vw, 156vw'}
					className={'mag-figure z-10'}
				/>

				<div aria-hidden={'true'} className={'mag-scrim-bottom z-20'} />

				<ol
					aria-label={'В этом выпуске'}
					className={'mag-right z-20 flex flex-col poster-wide:justify-between'}
				>
					{rightEntries.map((entry) => (
						<CoverLine key={entry.id} entry={entry} align={'right'} tallHidden={entry === overflowEntry} />
					))}
				</ol>

				<div className={'mag-left z-20'}>
					<ol aria-label={'Также в выпуске'} className={'mb-5 flex flex-col gap-2 poster-tall:is-hidden'}>
						{leftEntries.map((entry) => (
							<CoverLine key={entry.id} entry={entry} align={'left'} />
						))}
					</ol>
					<CoverLink href={coverStory.href} className={'mag-line flex flex-col items-start py-1'}>
						<span className={'text-xs font-bold tracking-[0.16em] text-accent-700 uppercase'}>
							{coverStory.kicker}
						</span>
						<span
							className={
								'mt-1 font-display [font-size:var(--story-size)] leading-[1.02] font-normal tracking-[-0.02em] text-ink'
							}
						>
							<span className={'mag-headline'}>
								{coverStory.titleLines[0]}
								<br />
								{coverStory.titleLines[1]}
							</span>
						</span>
						<span className={'mt-2 line-clamp-2 text-sm text-body poster-wide:line-clamp-3'}>
							{coverStory.teaser}
						</span>
						<span className={'mt-1 text-[11px] whitespace-nowrap text-muted'}>
							{'с. '}
							{coverStory.page}
						</span>
					</CoverLink>
				</div>

				<div className={'mag-bottom z-20 flex items-center justify-between gap-4 text-xs text-ink'}>
					<div className={'flex items-center gap-4'}>
						<Barcode seed={issue.isoMonth} />
						<p>{'Цена: бесплатно'}</p>
					</div>
					<p className={'whitespace-nowrap'}>{'с. 1'}</p>
				</div>
			</section>

			<nav aria-labelledby={'cover-more-title'} className={'bg-brand-50 px-4 pb-6 sm:px-6 poster-wide:is-hidden'}>
				<h2 id={'cover-more-title'} className={'sr-only'}>
					{'Ещё в этом выпуске'}
				</h2>
				<ol className={'border-t border-ink/15'}>
					{belowEntries.map((entry) => (
						<li key={entry.id} className={'border-b border-ink/15'}>
							<CoverLink
								href={entry.href}
								className={'mag-line flex min-h-[72px] items-center gap-4 py-2.5'}
							>
								<span className={'w-6 shrink-0 font-display text-lg font-bold text-accent-700'}>
									{entry.number}
								</span>
								<span className={'min-w-0 flex-1'}>
									<span className={'block'}>
										<span
											className={
												'mag-headline font-display text-lg leading-tight font-bold text-ink'
											}
										>
											{entry.headline}
										</span>
									</span>
									<span className={'mt-1 line-clamp-2 text-sm text-body'}>{entry.teaser}</span>
								</span>
								<Image
									src={entry.thumb.src}
									alt={''}
									width={64}
									height={64}
									sizes={'64px'}
									className={'size-14 shrink-0 rounded-lg object-cover sm:size-16'}
								/>
							</CoverLink>
						</li>
					))}
				</ol>
			</nav>
		</>
	);
}
