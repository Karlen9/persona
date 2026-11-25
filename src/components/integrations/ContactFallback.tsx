import {Icon} from '@/components/ui/Icon';

import type {ReactNode} from 'react';
import type {TContactInfo} from '@/lib/site';

type TContactFallbackProps = {
	contacts: TContactInfo;
	message?: string;
};

export function ContactFallback({
	contacts,
	message = 'Не удалось загрузить форму. Позвоните или напишите нам — ответим в ближайшее время.'
}: TContactFallbackProps): ReactNode {
	return (
		<div className={'flex flex-col gap-4 rounded-card bg-surface p-6'} role={'status'}>
			<p className={'font-semibold text-ink'}>{message}</p>
			<ul className={'flex flex-col gap-1.5'}>
				{contacts.phones.map((phone) => (
					<li key={phone.href}>
						<a href={phone.href} className={'inline-flex items-center gap-2 font-bold text-brand-800'}>
							<Icon name={'phone'} size={18} />
							{phone.label}
						</a>
					</li>
				))}
				<li>
					<a
						href={`mailto:${contacts.email}`}
						className={'inline-flex items-center gap-2 font-bold text-brand-800'}
					>
						<Icon name={'mail'} size={18} />
						{contacts.email}
					</a>
				</li>
			</ul>
			<ul className={'flex gap-2'}>
				{contacts.socials.map((social) => (
					<li key={social.id}>
						<a
							href={social.href}
							target={'_blank'}
							rel={'noopener noreferrer'}
							aria-label={social.label}
							className={'grid size-11 place-items-center rounded-full bg-brand-100 text-brand-800'}
						>
							<Icon name={social.id} size={24} />
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
