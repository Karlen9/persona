import {SearchTrigger} from '@/components/search/SearchTrigger';
import {ButtonLink} from '@/components/ui/ButtonLink';
import {getNavigation} from '@/lib/cms';
import {LEAD_ANCHOR} from '@/lib/site';
import {getSiteInfo} from '@/lib/siteInfo';

import {DesktopNav} from './DesktopNav';
import {HeaderScroll} from './HeaderScroll';
import {Logo} from './Logo';
import {MobileNav} from './MobileNav';

import type {ReactNode} from 'react';

export async function SiteHeader(): Promise<ReactNode> {
	const [{mainNav}, info] = await Promise.all([getNavigation(), getSiteInfo()]);
	return (
		<>
			<HeaderScroll />
			<header
				id={'site-header'}
				data-scrolled={'false'}
				className={
					'sticky top-0 z-40 h-header border-b border-transparent bg-white/90 backdrop-blur-md transition-[border-color,box-shadow] duration-200 data-[scrolled=true]:border-line data-[scrolled=true]:shadow-[0_4px_20px_rgb(2_6_23/0.05)] lg:h-header-lg'
				}
			>
				<div
					className={
						'mx-auto flex h-full w-full max-w-site items-center justify-between gap-3 px-4 sm:px-6 lg:px-8'
					}
				>
					<Logo className={'shrink-0'} priority />
					<DesktopNav mainNav={mainNav} />
					<div className={'flex items-center gap-1 sm:gap-3'}>
						<SearchTrigger mainNav={mainNav} phone={info.phones[0]} />
						<ButtonLink href={LEAD_ANCHOR} size={'sm'}>
							{'Записаться'}
						</ButtonLink>
						<MobileNav logo={<Logo />} mainNav={mainNav} contacts={info} />
					</div>
				</div>
			</header>
		</>
	);
}
