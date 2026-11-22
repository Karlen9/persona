import Link from 'next/link';

import {Container} from '@/components/ui/Container';
import {getCoverEntry, getNextCoverEntry} from '@/content/cover';
import {displayFont} from '@/lib/fonts';
import {SITE_NAME} from '@/lib/site';

import type {TCoverEntryId} from '@/content/cover';
import type {ReactNode} from 'react';

type TSectionFrameProps = {
	entryId: TCoverEntryId;
	children: ReactNode;
};

export function SectionFrame({entryId, children}: TSectionFrameProps): ReactNode {
	const entry = getCoverEntry(entryId);
	const next = getNextCoverEntry(entryId);

	return (
		<div className={displayFont.variable}>
			<Container>
				<div
					className={
						'flex min-h-11 items-center justify-between gap-4 border-b border-ink/15 text-[11px] font-bold tracking-[0.18em] text-muted uppercase sm:text-xs'
					}
				>
					<p>
						<span className={'font-display text-ink'}>{entry.label}</span>
					</p>
					<Link href={'/'} className={'inline-flex min-h-11 items-center hover:text-ink hover:underline'}>
						{SITE_NAME}
					</Link>
				</div>
			</Container>
			{children}
			<Container>
				<nav aria-label={'Следующий раздел'} className={'border-t border-ink/15 py-8 lg:py-12'}>
					<Link
						href={next.href}
						className={
							'inline-flex min-h-11 items-center font-display text-2xl font-bold text-ink decoration-2 underline-offset-4 hover:underline focus-visible:underline lg:text-4xl'
						}
					>
						{'Далее: '}
						{next.label}
						{' →'}
					</Link>
				</nav>
			</Container>
		</div>
	);
}
