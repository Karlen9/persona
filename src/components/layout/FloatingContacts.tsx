import {Icon} from '@/components/ui/Icon';
import {PHONES, SOCIALS} from '@/lib/site';

import type {ReactNode} from 'react';

const round = 'grid size-12 place-items-center rounded-full shadow-pop transition-transform hover:scale-105';

export function FloatingContacts(): ReactNode {
	const items = [
		{key: 'phone', label: 'Позвонить', href: PHONES[0].href, icon: 'phone' as const, external: false},
		...SOCIALS.map((s) => ({key: s.id, label: s.label, href: s.href, icon: s.id, external: true}))
	];
	const list = items.map((item) => (
		<a
			key={item.key}
			href={item.href}
			aria-label={item.label}
			{...(item.external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
			className={`${round} ${item.key === 'phone' ? 'bg-brand text-brand-ink' : 'border border-line bg-white text-brand-800'}`}
		>
			<Icon name={item.icon} size={item.icon === 'telegram' || item.icon === 'phone' ? 22 : 28} />
		</a>
	));
	return (
		<>
			<div className={'fixed right-5 bottom-6 z-30 flex flex-col gap-2.5 max-md:hidden'}>{list}</div>
			{/* --cookie-banner-offset is set on <html> by CookieConsent while the phone banner is visible. */}
			<details
				className={
					'group fixed right-4 bottom-[calc(1rem+var(--cookie-banner-offset,0px))] z-30 transition-[bottom] duration-200 md:hidden'
				}
			>
				<summary
					aria-label={'Связаться с нами'}
					className={`${round} size-14 cursor-pointer bg-brand text-brand-ink`}
				>
					<Icon name={'message'} size={26} className={'group-open:hidden'} />
					<Icon name={'close'} size={26} className={'is-hidden group-open:block'} />
				</summary>
				<div className={'absolute right-1 bottom-full mb-3 flex flex-col gap-2.5'}>{list}</div>
			</details>
		</>
	);
}
