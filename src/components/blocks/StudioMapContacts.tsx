import {ButtonLink} from '@/components/ui/ButtonLink';
import {Icon} from '@/components/ui/Icon';
import {LEAD_ANCHOR, PHONES} from '@/lib/site';

import type {ReactNode} from 'react';

type TStudioMapContactsProps = {
	/** Called when a link that scrolls the page (lead form, contacts) is used. */
	onNavigate?: () => void;
};

/** Phones and calls to action behind the reception zone. Shared by the map card and the mobile list. */
export function StudioMapContacts({onNavigate}: TStudioMapContactsProps): ReactNode {
	return (
		<>
			<ul className={'flex flex-col'}>
				{PHONES.map((phone) => (
					<li key={phone.href}>
						<a
							href={phone.href}
							className={
								'inline-flex min-h-11 items-center gap-2 font-bold text-ink hover:text-brand-800'
							}
						>
							<Icon name={'phone'} size={18} className={'text-brand-700'} />
							{phone.label}
						</a>
					</li>
				))}
			</ul>
			<div className={'mt-2 flex gap-2'}>
				<ButtonLink href={LEAD_ANCHOR} size={'sm'} className={'flex-1'} onClick={onNavigate}>
					{'Записаться'}
				</ButtonLink>
				{/* Smooth scrolling (and its reduced-motion override) is handled by the root scroll-behavior. */}
				<ButtonLink
					href={'#kontakty'}
					variant={'secondary'}
					size={'sm'}
					className={'flex-1'}
					onClick={onNavigate}
				>
					{'Все контакты'}
				</ButtonLink>
			</div>
		</>
	);
}
