import {ButtonLink} from '@/components/ui/ButtonLink';
import {LEAD_ANCHOR} from '@/lib/site';

import type {ReactNode} from 'react';

export type TPriceRow = {
	name: string;
	details?: string;
	price: string;
};

type TPriceTableProps = {
	caption: string;
	rows: TPriceRow[];
	headers?: [string, string, string];
};

export function PriceTable({
	caption,
	rows,
	headers = ['Программа', 'Условия', 'Стоимость']
}: TPriceTableProps): ReactNode {
	return (
		<div>
			<div className={'overflow-hidden rounded-card border border-line bg-white shadow-card max-md:hidden'}>
				<table className={'w-full text-left'}>
					<caption className={'sr-only'}>{caption}</caption>
					<thead className={'bg-surface text-sm text-muted'}>
						<tr>
							<th scope={'col'} className={'px-6 py-4 font-bold'}>
								{headers[0]}
							</th>
							<th scope={'col'} className={'px-6 py-4 font-bold'}>
								{headers[1]}
							</th>
							<th scope={'col'} className={'px-6 py-4 text-right font-bold'}>
								{headers[2]}
							</th>
							<th scope={'col'} className={'w-44 px-6 py-4'}>
								<span className={'sr-only'}>{'Действие'}</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr key={row.name} className={'border-t border-line'}>
								<th scope={'row'} className={'px-6 py-5 font-bold text-ink'}>
									{row.name}
								</th>
								<td className={'px-6 py-5'}>{row.details}</td>
								<td
									className={'px-6 py-5 text-right text-lg font-extrabold whitespace-nowrap text-ink'}
								>
									{row.price}
								</td>
								<td className={'px-6 py-5 text-right'}>
									<ButtonLink href={LEAD_ANCHOR} size={'sm'} variant={'secondary'}>
										{'Записаться'}
									</ButtonLink>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<ul className={'flex flex-col gap-3 md:hidden'} aria-label={caption}>
				{rows.map((row) => (
					<li key={row.name} className={'rounded-card border border-line bg-white p-5 shadow-card'}>
						<h3 className={'font-extrabold text-ink'}>{row.name}</h3>
						{row.details ? <p className={'mt-1 text-sm'}>{row.details}</p> : null}
						<div className={'mt-4 flex items-center justify-between gap-3'}>
							<span className={'text-xl font-extrabold text-ink'}>{row.price}</span>
							<ButtonLink href={LEAD_ANCHOR} size={'sm'} variant={'secondary'}>
								{'Записаться'}
							</ButtonLink>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
