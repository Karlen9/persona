import {Icon} from '@/components/ui/Icon';
import {EMAIL, PHONES, SOCIALS} from '@/lib/site';

import type {ReactNode} from 'react';

type TContactFallbackProps = {
	message?: string;
};

export function ContactFallback({
	message = 'Не удалось загрузить форму. Позвоните или напишите нам — ответим в ближайшее время.'
}: TContactFallbackProps): ReactNode {
	return (
		<div className={'flex flex-col gap-4 rounded-card bg-surface p-6'} role={'status'}>
			<p className={'font-semibold text-ink'}>{message}</p>
			<ul className={'flex flex-col gap-1.5'}>
				{PHONES.map((phone) => (
					<li key={phone.href}>
						<a href={phone.href} className={'inline-flex items-center gap-2 font-bold text-brand-800'}>
							<Icon name={'phone'} size={18} />
							{phone.label}
						</a>
					</li>
				))}
				<li>
					<a href={`mailto:${EMAIL}`} className={'inline-flex items-center gap-2 font-bold text-brand-800'}>
						<Icon name={'mail'} size={18} />
						{EMAIL}
					</a>
				</li>
			</ul>
			<ul className={'flex gap-2'}>
				{SOCIALS.map((social) => (
					<li key={social.id}>
						<a
							href={social.href}
							target={'_blank'}
							rel={'noopener noreferrer'}
							aria-label={social.label}
							className={'grid size-11 place-items-center rounded-full bg-brand-100 text-brand-800'}
						>
							<Icon name={social.id} size={social.id === 'telegram' ? 20 : 26} />
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
