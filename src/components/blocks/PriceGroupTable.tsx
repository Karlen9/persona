import Link from 'next/link';

import {getDirection} from '@/content';
import {formatPrice} from '@/lib/format';

import type {ReactNode} from 'react';
import type {TPriceGroup, TPriceRow} from '@/content/types';

type TPriceGroupTableProps = {
	group: TPriceGroup;
	/** Defaults to every row of the group. */
	rows?: TPriceRow[];
	/** Link row labels to the direction page (single-direction rows only). */
	linkRows?: boolean;
	/** Header of the first column. */
	firstColumnLabel?: string;
	compact?: boolean;
};

/**
 * Real <table> for one price group: caption = group title, columns from `group.columns`, one row per direction.
 * It scrolls horizontally inside its own wrapper on narrow screens, so the page itself never overflows.
 */
export function PriceGroupTable({
	group,
	rows = group.rows,
	linkRows,
	firstColumnLabel = 'Направление',
	compact
}: TPriceGroupTableProps): ReactNode {
	const cell = compact ? 'px-4 py-3' : 'px-4 py-4 sm:px-6';
	return (
		<div
			role={'region'}
			aria-label={`${group.title}: таблица цен`}
			tabIndex={0}
			className={'max-w-full overflow-x-auto rounded-card border border-line bg-white shadow-card'}
		>
			<table className={'w-full min-w-[34rem] border-collapse text-left'}>
				<caption className={'px-4 pt-5 pb-3 text-left text-lg font-extrabold text-ink sm:px-6'}>
					{group.title}
				</caption>
				<thead className={'bg-surface text-sm text-muted'}>
					<tr>
						<th scope={'col'} className={`${cell} font-bold`}>
							{firstColumnLabel}
						</th>
						{group.columns.map((column) => (
							<th key={column.label} scope={'col'} className={`${cell} text-right font-bold`}>
								{column.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => {
						const direction =
							linkRows && row.directionSlugs.length === 1
								? getDirection(row.directionSlugs[0])
								: undefined;
						return (
							<tr key={row.id} className={'border-t border-line'}>
								<th scope={'row'} className={`${cell} font-bold text-ink`}>
									{direction ? (
										<Link href={direction.path} className={'hover:text-brand-800 hover:underline'}>
											{row.label}
										</Link>
									) : (
										row.label
									)}
									{row.note ? (
										<span className={'mt-1 block text-sm font-normal text-body'}>{row.note}</span>
									) : null}
								</th>
								{row.prices.map((price, index) => (
									<td
										key={group.columns[index]?.label ?? index}
										className={`${cell} text-right font-extrabold whitespace-nowrap ${
											price === null ? 'text-muted' : 'text-ink'
										}`}
									>
										{price === null ? (
											<span aria-label={'нет предложения'}>{formatPrice(null)}</span>
										) : (
											formatPrice(price)
										)}
									</td>
								))}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
