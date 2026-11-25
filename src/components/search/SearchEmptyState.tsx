import Link from 'next/link';

import {PHONES} from '@/lib/site';

import type {ReactNode} from 'react';

type TSearchEmptyStateProps = {
	query: string;
	/** Closes the palette when one of the links is followed. */
	onNavigate?: () => void;
};

/** «Ничего не найдено» with a spelling hint and a way out. */
export function SearchEmptyState({query, onNavigate}: TSearchEmptyStateProps): ReactNode {
	const phone = PHONES[0];
	return (
		<div className={'px-3 py-8 text-center'}>
			<p className={'text-lg font-bold text-ink'}>{`Ничего не найдено по запросу «${query}»`}</p>
			<p className={'mt-2 text-[15px]'}>{'Проверьте написание или попробуйте другое слово, например «танцы».'}</p>
			<p className={'mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[15px] font-semibold'}>
				<Link
					href={'/napravleniya/'}
					prefetch={false}
					onClick={onNavigate}
					className={'text-brand-800 hover:underline'}
				>
					{'Все направления'}
				</Link>
				<a href={phone.href} className={'text-brand-800 hover:underline'}>
					{`Позвонить: ${phone.label}`}
				</a>
			</p>
		</div>
	);
}
