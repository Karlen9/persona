import Link from 'next/link';

import {getSiteInfo} from '@/lib/siteInfo';

import {Icon} from './Icon';
import {JsonLd} from './JsonLd';

import type {ReactNode} from 'react';

export type TBreadcrumb = {
	label: string;
	/** Omit for the current page. */
	href?: string;
};

type TBreadcrumbsProps = {
	items: TBreadcrumb[];
};

export async function Breadcrumbs({items}: TBreadcrumbsProps): Promise<ReactNode> {
	const {url} = await getSiteInfo();
	const all: TBreadcrumb[] = [{label: 'Главная', href: '/'}, ...items];
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: all.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.label,
			...(item.href ? {item: `${url}${item.href}`} : {})
		}))
	};

	return (
		<nav aria-label={'Хлебные крошки'}>
			<ol className={'flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted'}>
				{all.map((item, index) => {
					const last = index === all.length - 1;
					return (
						<li key={`${item.label}-${index}`} className={'flex items-center gap-1.5'}>
							{item.href && !last ? (
								<Link
									href={item.href}
									className={'underline-offset-4 hover:text-brand-800 hover:underline'}
								>
									{item.label}
								</Link>
							) : (
								<span
									aria-current={last ? 'page' : undefined}
									className={last ? 'font-semibold text-ink' : undefined}
								>
									{item.label}
								</span>
							)}
							{last ? null : <Icon name={'chevron-right'} size={14} className={'text-muted'} />}
						</li>
					);
				})}
			</ol>
			<JsonLd data={jsonLd} />
		</nav>
	);
}
