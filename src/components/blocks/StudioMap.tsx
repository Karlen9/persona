import Link from 'next/link';

import {Container} from '@/components/ui/Container';
import {Heading} from '@/components/ui/Heading';
import {Icon} from '@/components/ui/Icon';
import {CC_BY_URL, ccByCredits} from '@/content/modelCredits';

import {HeadingLine} from './HomeHero';
import {StudioMapContacts} from './StudioMapContacts';
import {StudioMapInteractive} from './StudioMapInteractive';

import type {ReactNode} from 'react';
import type {TStudioMapData} from '@/content/studioMap';

type TStudioMapProps = TStudioMapData & {
	title: string;
	/** The heading split into display lines. */
	lines?: string[];
	/** Part of the heading highlighted in the brand colour. */
	accent?: string | null;
};

const summaryClasses =
	'flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-2 font-bold text-ink [&::-webkit-details-marker]:hidden';

export function StudioMap({title, lines, accent, image, zones}: TStudioMapProps): ReactNode {
	const displayLines = lines && lines.length > 0 ? lines : [title];
	return (
		<section className={'bg-surface pt-6 pb-section md:pt-10 md:pb-section-lg'}>
			<Container>
				<div className={'max-w-4xl'}>
					<Heading level={1} size={'display'}>
						{/* The h1 reads as one sentence; the visual line breaks are CSS-only. */}
						{displayLines.map((line, index) => (
							<span key={line} className={'block'}>
								<HeadingLine line={line} accent={accent} />
								{index < displayLines.length - 1 ? ' ' : null}
							</span>
						))}
					</Heading>
					<p className={'mt-3 text-lg'}>
						<span className={'md:hidden'}>{'Выберите зону, чтобы увидеть направления'}</span>
						<span className={'max-md:hidden'}>{'Наведите на зону и выберите направление'}</span>
					</p>
				</div>
			</Container>

			<div className={'mt-6 px-2 sm:px-4 md:mt-8'}>
				<StudioMapInteractive image={image} zones={zones} />
			</div>

			<Container>
				<div className={'mt-6 flex flex-col gap-2 md:hidden'}>
					{zones.map((zone) => (
						<details key={zone.id} className={'group rounded-card border border-line bg-white shadow-card'}>
							<summary className={summaryClasses}>
								<span
									aria-hidden
									className={'size-4 shrink-0 rounded-full'}
									style={{backgroundColor: zone.patchColor}}
								/>
								<span>{zone.label}</span>
								{zone.kind === 'directions' ? (
									<span className={'ml-auto text-sm font-semibold text-muted'}>
										{zone.directions.length}
									</span>
								) : (
									<span className={'ml-auto'} />
								)}
								<Icon
									name={'chevron-down'}
									size={18}
									className={
										'shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none'
									}
								/>
							</summary>
							<div className={'px-4 pb-3'}>
								{zone.kind === 'contacts' ? (
									<StudioMapContacts />
								) : (
									<ul>
										{zone.directions.map((direction) => (
											<li key={direction.slug}>
												<Link
													href={direction.path}
													prefetch={false}
													className={
														'flex min-h-11 items-center rounded-btn px-2 font-semibold text-ink hover:bg-brand-50 hover:text-brand-800'
													}
												>
													{direction.shortTitle}
												</Link>
											</li>
										))}
									</ul>
								)}
							</div>
						</details>
					))}
				</div>

				<div className={'mt-6 text-xs text-muted'}>
					<p>{'3D-модели: Kenney, Quaternius и др. (CC0)'}</p>
					<details className={'mt-1'}>
						<summary className={'min-h-8 cursor-pointer py-1 font-semibold'}>{'Авторы 3D-моделей'}</summary>
						<ul className={'mt-1 flex flex-col gap-1'}>
							{ccByCredits.map((credit) => (
								<li key={credit.file}>
									<a
										href={credit.source}
										target={'_blank'}
										rel={'noopener noreferrer'}
										className={'underline hover:text-ink'}
									>
										{`${credit.title} — ${credit.author}, CC BY 3.0`}
									</a>
								</li>
							))}
						</ul>
						<p className={'mt-1'}>
							<a
								href={CC_BY_URL}
								target={'_blank'}
								rel={'noopener noreferrer'}
								className={'underline hover:text-ink'}
							>
								{'Лицензия CC BY 3.0'}
							</a>
						</p>
					</details>
				</div>
			</Container>
		</section>
	);
}
