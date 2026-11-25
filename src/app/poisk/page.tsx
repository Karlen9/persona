import {PageHero} from '@/components/blocks/PageHero';
import {SearchEmptyState} from '@/components/search/SearchEmptyState';
import {SearchResultRow} from '@/components/search/SearchResultRow';
import {Icon} from '@/components/ui/Icon';
import {Section} from '@/components/ui/Section';
import {getServerSearchEngine} from '@/lib/search/serverEngine';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

const MAX_QUERY_LENGTH = 200;
const RESULT_LIMIT = 30;

export const metadata: Metadata = buildMetadata({
	seo: {
		title: 'Поиск по сайту — PersOna',
		description: 'Поиск по направлениям, студиям, педагогам, ценам и вопросам творческого центра PersOna.'
	},
	path: '/poisk/',
	noindex: true
});

type TSearchPageProps = {
	searchParams: Promise<{q?: string | string[]}>;
};

function pluralize(count: number): string {
	const mod100 = count % 100;
	const mod10 = count % 10;
	if (mod100 >= 11 && mod100 <= 14) return `${count} результатов`;
	if (mod10 === 1) return `${count} результат`;
	if (mod10 >= 2 && mod10 <= 4) return `${count} результата`;
	return `${count} результатов`;
}

export default async function SearchPage({searchParams}: TSearchPageProps): Promise<ReactNode> {
	const {q} = await searchParams;
	const raw = Array.isArray(q) ? (q[0] ?? '') : (q ?? '');
	const query = raw.trim().slice(0, MAX_QUERY_LENGTH);
	const result = query ? getServerSearchEngine().search(query, RESULT_LIMIT) : null;

	return (
		<>
			<PageHero breadcrumbs={[{label: 'Поиск'}]} title={'Поиск'} cta={null} />
			<Section className={'pt-0 md:pt-0'}>
				<form
					action={'/poisk/'}
					method={'get'}
					role={'search'}
					className={'flex max-w-2xl flex-col gap-3 sm:flex-row'}
				>
					<label className={'relative flex-1'}>
						<span className={'sr-only'}>{'Поиск по сайту'}</span>
						<Icon
							name={'search'}
							size={20}
							className={'pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-brand-700'}
						/>
						<input
							type={'search'}
							name={'q'}
							defaultValue={query}
							maxLength={MAX_QUERY_LENGTH}
							enterKeyHint={'search'}
							autoComplete={'off'}
							placeholder={'Направление, педагог, адрес, вопрос…'}
							className={
								'h-14 w-full rounded-btn border border-line bg-white pr-4 pl-12 text-base font-semibold text-ink outline-none! placeholder:font-medium placeholder:text-muted focus:border-brand-500'
							}
						/>
					</label>
					<button
						type={'submit'}
						className={
							'min-h-14 rounded-btn bg-brand px-7 text-lg font-bold text-brand-ink hover:bg-brand-300 active:bg-brand-200'
						}
					>
						{'Найти'}
					</button>
				</form>

				{result ? (
					<div className={'mt-8 max-w-3xl'}>
						{result.hits.length > 0 ? (
							<>
								<p className={'text-[15px] text-muted'}>
									{result.correctedQuery ? (
										<>
											{'Показаны результаты для «'}
											{result.correctedQuery}
											{'»: '}
										</>
									) : null}
									{`Найдено: ${pluralize(result.hits.length)}`}
								</p>
								<ul className={'mt-3 flex flex-col gap-1'}>
									{result.hits.map((hit) => (
										<SearchResultRow key={hit.doc.id} hit={hit} roomy />
									))}
								</ul>
							</>
						) : (
							<SearchEmptyState query={query} />
						)}
					</div>
				) : (
					<p className={'mt-8 max-w-2xl text-lg'}>
						{'Введите слово или фразу: название направления, имя педагога, станцию метро или вопрос.'}
					</p>
				)}
			</Section>
		</>
	);
}
