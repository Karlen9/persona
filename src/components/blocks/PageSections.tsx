import {PageHero} from '@/components/blocks/PageHero';
import {ProgrammeGrid} from '@/components/blocks/ProgrammeGrid';
import {VideoGrid} from '@/components/blocks/VideoGrid';
import {Container} from '@/components/ui/Container';
import {Heading} from '@/components/ui/Heading';
import {Icon} from '@/components/ui/Icon';
import {RichText} from '@/components/ui/RichText';
import {Section} from '@/components/ui/Section';
import {SmartLink} from '@/components/ui/SmartLink';
import {formatBytes} from '@/lib/format';

import type {ReactNode} from 'react';
import type {TBreadcrumb} from '@/components/ui/Breadcrumbs';
import type {TDownload, TPage, TPageSection} from '@/content/types';

type TPageSectionsProps = {
	page: TPage;
	breadcrumbs: TBreadcrumb[];
	/** Narrow reading column (privacy policy). */
	narrow?: boolean;
};

function DownloadList({heading, items}: {heading: string; items: TDownload[]}): ReactNode {
	return (
		<Section>
			<Heading level={2}>{heading}</Heading>
			<ul className={'mt-6 flex max-w-3xl flex-col gap-3'}>
				{items.map((item) => {
					const size = formatBytes(item.sizeBytes);
					return (
						<li key={item.href}>
							<SmartLink
								href={item.href}
								className={
									'flex min-h-14 items-center justify-between gap-4 rounded-card border border-line bg-white px-5 py-3 shadow-card transition-colors hover:border-brand-400'
								}
							>
								<span className={'font-bold text-ink'}>{item.label}</span>
								<span
									className={
										'inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-800'
									}
								>
									{`PDF${size ? `, ${size}` : ''}`}
									<Icon name={'external'} size={16} />
								</span>
							</SmartLink>
						</li>
					);
				})}
			</ul>
		</Section>
	);
}

function renderSection(section: TPageSection, index: number, narrow: boolean): ReactNode {
	switch (section.type) {
		case 'hero':
			return null;
		case 'cards':
			return (
				<Section key={index} title={section.heading}>
					<ProgrammeGrid items={section.items} />
				</Section>
			);
		case 'article':
			if (narrow) {
				return (
					<section key={index} className={'pb-section md:pb-section-lg'}>
						<Container className={'max-w-3xl'}>
							<RichText blocks={section.blocks} />
						</Container>
					</section>
				);
			}
			return (
				<Section key={index}>
					<RichText blocks={section.blocks} />
				</Section>
			);
		case 'video': {
			const many = section.videos.length > 1;
			const columns = section.videos.length > 4 ? 5 : 3;
			return (
				<Section key={index} title={section.heading}>
					<div className={many ? undefined : 'mx-auto max-w-3xl'}>
						<VideoGrid
							videos={section.videos}
							label={section.heading ?? 'Видео'}
							columnsClassName={
								many
									? columns === 5
										? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
										: 'grid-cols-2 md:grid-cols-3'
									: 'grid-cols-1'
							}
							sizes={
								many
									? columns === 5
										? '(min-width: 1200px) 230px, (min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw'
										: '(min-width: 1200px) 384px, (min-width: 768px) 33vw, 50vw'
									: '(min-width: 768px) 720px, 100vw'
							}
						/>
					</div>
				</Section>
			);
		}
		case 'downloads':
			return <DownloadList key={index} heading={section.heading} items={section.items} />;
	}
}

/** Renders `TPage.sections`: the hero becomes the `PageHero` (the page's only h1), the rest follow in order. */
export function PageSections({page, breadcrumbs, narrow = false}: TPageSectionsProps): ReactNode {
	const hero = page.sections.find(
		(section): section is Extract<TPageSection, {type: 'hero'}> => section.type === 'hero'
	);
	return (
		<>
			<PageHero
				breadcrumbs={breadcrumbs}
				title={hero?.heading ?? page.h1}
				lead={hero?.subheading}
				image={hero?.image}
				cta={hero?.cta ? {label: hero.cta.label, href: hero.cta.href} : null}
			/>
			{page.sections.map((section, index) => renderSection(section, index, narrow))}
		</>
	);
}
