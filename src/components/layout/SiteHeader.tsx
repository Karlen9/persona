import {ButtonLink} from '@/components/ui/ButtonLink';
import {Icon} from '@/components/ui/Icon';
import {LEAD_ANCHOR, PHONES} from '@/lib/site';

import {DesktopNav} from './DesktopNav';
import {HeaderScroll} from './HeaderScroll';
import {Logo} from './Logo';
import {MobileNav} from './MobileNav';

import type {ReactNode} from 'react';

export function SiteHeader(): ReactNode {
	const phone = PHONES[0];
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
					<DesktopNav />
					<div className={'flex items-center gap-1 sm:gap-3'}>
						<a
							href={phone.href}
							className={
								'flex items-center gap-2 text-[15px] font-bold text-ink hover:text-brand-800 max-xl:hidden'
							}
						>
							<Icon name={'phone'} size={18} className={'text-brand-700'} />
							{phone.label}
						</a>
						<ButtonLink href={LEAD_ANCHOR} size={'sm'}>
							{'Записаться'}
						</ButtonLink>
						<MobileNav logo={<Logo />} />
					</div>
				</div>
			</header>
		</>
	);
}
