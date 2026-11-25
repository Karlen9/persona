import {ButtonLink} from '@/components/ui/ButtonLink';
import {Container} from '@/components/ui/Container';
import {Eyebrow} from '@/components/ui/Eyebrow';
import {Heading} from '@/components/ui/Heading';
import {getNavigation} from '@/lib/cms';
import {LEAD_ANCHOR} from '@/lib/site';
import {getSiteInfo} from '@/lib/siteInfo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export const metadata: Metadata = {title: 'Страница не найдена'};

export default async function NotFound(): Promise<ReactNode> {
	const [{sectionLinks}, {phones}] = await Promise.all([getNavigation(), getSiteInfo()]);
	const phone = phones[0];
	return (
		<Container className={'py-section-lg text-center'}>
			<Eyebrow>{'Ошибка 404'}</Eyebrow>
			<p aria-hidden className={'mt-4 text-8xl font-extrabold tracking-tight text-brand sm:text-9xl'}>
				{'404'}
			</p>
			<Heading level={1} className={'mt-2'}>
				{'Страница не найдена'}
			</Heading>
			<p className={'mx-auto mt-4 max-w-xl text-lg'}>
				{'Возможно, адрес изменился или страница была удалена. Загляните в один из разделов:'}
			</p>
			<ul className={'mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3'}>
				{sectionLinks.map((link) => (
					<li key={link.href}>
						<ButtonLink href={link.href} variant={'secondary'}>
							{link.label}
						</ButtonLink>
					</li>
				))}
			</ul>
			<div className={'mt-8 flex flex-wrap items-center justify-center gap-3'}>
				<ButtonLink href={'/'} size={'lg'}>
					{'На главную'}
				</ButtonLink>
				<ButtonLink href={LEAD_ANCHOR} size={'lg'} variant={'secondary'}>
					{'Контакты'}
				</ButtonLink>
			</div>
			<p className={'mt-6'}>
				{'Или позвоните: '}
				<a href={phone.href} className={'font-extrabold whitespace-nowrap text-ink hover:text-brand-800'}>
					{phone.label}
				</a>
			</p>
		</Container>
	);
}
