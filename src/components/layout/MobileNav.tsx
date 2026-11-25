'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';

import {Icon} from '@/components/ui/Icon';
import {LEAD_ANCHOR} from '@/lib/site';

import type {ReactNode} from 'react';
import type {TNavItem} from '@/content/navigation';
import type {TContactInfo} from '@/lib/site';

const linkClass = 'text-ink block rounded-xl px-3 py-2.5 font-semibold hover:bg-brand-50';

type TMobileNavProps = {
	/** Server-rendered logo (Logo reads the filesystem, so it cannot be imported here). */
	logo: ReactNode;
	mainNav: TNavItem[];
	contacts: TContactInfo;
};

export function MobileNav({logo, mainNav, contacts}: TMobileNavProps): ReactNode {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
		document.documentElement.style.overflow = open ? 'hidden' : '';
		return () => {
			document.documentElement.style.overflow = '';
		};
	}, [open]);

	useEffect(() => {
		const query = window.matchMedia('(min-width: 1024px)');
		const onChange = (): void => {
			if (query.matches) setOpen(false);
		};
		query.addEventListener('change', onChange);
		return () => query.removeEventListener('change', onChange);
	}, []);

	const close = (): void => setOpen(false);

	return (
		<>
			<button
				type={'button'}
				aria-label={'Открыть меню'}
				aria-haspopup={'dialog'}
				aria-expanded={open}
				onClick={() => setOpen(true)}
				className={'grid size-11 place-items-center rounded-xl text-ink hover:bg-brand-50 lg:hidden'}
			>
				<Icon name={'menu'} size={26} />
			</button>
			<dialog
				ref={dialogRef}
				aria-label={'Меню'}
				onClose={() => setOpen(false)}
				className={
					'fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none flex-col bg-white p-0 open:flex sm:left-auto sm:max-w-md sm:shadow-pop'
				}
			>
				<div className={'flex h-16 shrink-0 items-center justify-between px-4'}>
					{logo}
					<button
						type={'button'}
						aria-label={'Закрыть меню'}
						onClick={close}
						className={'grid size-11 place-items-center rounded-xl text-ink hover:bg-brand-50'}
					>
						<Icon name={'close'} size={26} />
					</button>
				</div>
				<div className={'flex-1 overflow-y-auto px-4 pb-6'}>
					<nav aria-label={'Мобильное меню'}>
						<ul className={'flex flex-col'}>
							{mainNav.map((item) => {
								const groups = item.columns
									? item.columns
									: item.children
										? [{title: '', links: item.children}]
										: null;
								if (!groups) {
									return (
										<li key={item.href} className={'border-b border-line'}>
											<Link
												href={item.href}
												onClick={close}
												className={`${linkClass} py-4 text-lg`}
											>
												{item.label}
											</Link>
										</li>
									);
								}
								return (
									<li key={item.href} className={'border-b border-line'}>
										<details className={'group'}>
											<summary
												className={
													'flex cursor-pointer items-center justify-between rounded-xl px-3 py-4 text-lg font-semibold text-ink'
												}
											>
												{item.label}
												<Icon
													name={'chevron-down'}
													className={'transition-transform group-open:rotate-180'}
												/>
											</summary>
											<div className={'pb-3'}>
												{groups.map((group) => (
													<div key={group.title} className={'mb-2'}>
														{group.title ? (
															<p
																className={
																	'px-3 pt-2 pb-1 text-xs font-bold tracking-widest text-accent-700 uppercase'
																}
															>
																{group.title}
															</p>
														) : null}
														<ul>
															{group.links.map((link) => (
																<li key={link.href}>
																	<Link
																		href={link.href}
																		onClick={close}
																		aria-current={
																			pathname === link.href ? 'page' : undefined
																		}
																		className={`${linkClass} text-[15px] font-medium`}
																	>
																		{link.label}
																	</Link>
																</li>
															))}
														</ul>
													</div>
												))}
												{item.allLink ? (
													<Link
														href={item.allLink.href}
														onClick={close}
														className={'block px-3 py-2 font-bold text-brand-800'}
													>
														{item.allLink.label}
													</Link>
												) : null}
											</div>
										</details>
									</li>
								);
							})}
						</ul>
					</nav>
					<ul className={'mt-6 flex flex-col gap-1'}>
						{contacts.phones.map((phone) => (
							<li key={phone.href}>
								<a href={phone.href} className={'flex items-center gap-3 px-3 py-2 font-bold text-ink'}>
									<Icon name={'phone'} size={18} className={'text-brand-700'} />
									{phone.label}
								</a>
							</li>
						))}
						<li>
							<a
								href={`mailto:${contacts.email}`}
								className={'flex items-center gap-3 px-3 py-2 font-semibold text-ink'}
							>
								<Icon name={'mail'} size={18} className={'text-brand-700'} />
								{contacts.email}
							</a>
						</li>
					</ul>
					<ul className={'mt-3 flex gap-2 px-3'}>
						{contacts.socials.map((social) => (
							<li key={social.id}>
								<a
									href={social.href}
									target={'_blank'}
									rel={'noopener noreferrer'}
									aria-label={social.label}
									className={
										'grid size-11 place-items-center rounded-full bg-brand-100 text-brand-800'
									}
								>
									<Icon name={social.id} size={24} />
								</a>
							</li>
						))}
					</ul>
				</div>
				<div className={'shrink-0 border-t border-line p-4'}>
					<a
						href={LEAD_ANCHOR}
						onClick={close}
						className={
							'flex h-14 w-full items-center justify-center rounded-btn bg-brand text-lg font-bold text-brand-ink'
						}
					>
						{'Записаться'}
					</a>
				</div>
			</dialog>
		</>
	);
}
