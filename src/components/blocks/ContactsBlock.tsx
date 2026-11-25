import {Icon} from '@/components/ui/Icon';
import {getSiteInfo} from '@/lib/siteInfo';

import type {ReactNode} from 'react';
import type {TPhone} from '@/lib/site';

type TContactsBlockProps = {
	address?: string;
	metro?: string;
	hours?: string;
	/** Defaults to the centre's main phones. */
	phones?: TPhone[];
	email?: string;
	showSocials?: boolean;
};

export async function ContactsBlock({
	address,
	metro,
	hours,
	phones: phonesProp,
	email: emailProp,
	showSocials = true
}: TContactsBlockProps): Promise<ReactNode> {
	const info = await getSiteInfo();
	const phones = phonesProp ?? info.phones;
	const email = emailProp ?? info.email;
	const row = 'flex items-start gap-3';
	const icon = 'text-brand-700 mt-1 shrink-0';
	return (
		<address className={'flex flex-col gap-4 not-italic'}>
			{address ? (
				<p className={row}>
					<Icon name={'map-pin'} className={icon} />
					<span>
						<span className={'block text-xs font-bold tracking-widest text-muted uppercase'}>
							{'Адрес'}
						</span>
						<span className={'font-semibold text-ink'}>{address}</span>
					</span>
				</p>
			) : null}
			{metro ? (
				<p className={row}>
					<Icon name={'metro'} className={icon} />
					<span>
						<span className={'block text-xs font-bold tracking-widest text-muted uppercase'}>
							{'Метро'}
						</span>
						<span className={'font-semibold text-ink'}>{metro}</span>
					</span>
				</p>
			) : null}
			{hours ? (
				<p className={row}>
					<Icon name={'clock'} className={icon} />
					<span>
						<span className={'block text-xs font-bold tracking-widest text-muted uppercase'}>
							{'Режим работы'}
						</span>
						<span className={'font-semibold text-ink'}>{hours}</span>
					</span>
				</p>
			) : null}
			<div className={row}>
				<Icon name={'phone'} className={icon} />
				<ul className={'flex flex-col gap-1'}>
					{phones.map((phone) => (
						<li key={phone.href}>
							<a href={phone.href} className={'font-semibold text-ink hover:text-brand-800'}>
								{phone.label}
							</a>
						</li>
					))}
				</ul>
			</div>
			<p className={row}>
				<Icon name={'mail'} className={icon} />
				<a href={`mailto:${email}`} className={'font-semibold text-ink hover:text-brand-800'}>
					{email}
				</a>
			</p>
			{showSocials ? (
				<ul className={'flex gap-2'}>
					{info.socials.map((social) => (
						<li key={social.id}>
							<a
								href={social.href}
								target={'_blank'}
								rel={'noopener noreferrer'}
								aria-label={social.label}
								className={
									'grid size-11 place-items-center rounded-full bg-brand-100 text-brand-800 transition-colors hover:bg-brand'
								}
							>
								<Icon name={social.id} size={24} />
							</a>
						</li>
					))}
				</ul>
			) : null}
		</address>
	);
}
