'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useId, useRef, useState} from 'react';

import {Icon} from '@/components/ui/Icon';
import {cn} from '@/lib/cn';

import type {FocusEvent, ReactNode} from 'react';
import type {TNavItem, TNavLink} from '@/content/navigation';

function allLinks(item: TNavItem): TNavLink[] {
	return [item, ...(item.children ?? []), ...(item.columns?.flatMap((column) => column.links) ?? [])];
}

function isActive(item: TNavItem, pathname: string): boolean {
	return allLinks(item).some((link) => pathname === link.href || pathname.startsWith(link.href));
}

const triggerClass =
	'inline-flex h-10 items-center gap-1 rounded-xl px-3 text-[15px] font-bold transition-colors hover:bg-brand-50 hover:text-brand-800';

type TDesktopNavProps = {
	mainNav: TNavItem[];
};

export function DesktopNav({mainNav}: TDesktopNavProps): ReactNode {
	const pathname = usePathname();
	const uid = useId();
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const navRef = useRef<HTMLElement>(null);
	const buttons = useRef<Array<HTMLButtonElement | null>>([]);

	useEffect(() => {
		setOpenIndex(null);
	}, [pathname]);

	useEffect(() => {
		if (openIndex === null) return;
		function onPointerDown(event: PointerEvent): void {
			if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenIndex(null);
		}
		document.addEventListener('pointerdown', onPointerDown);
		return () => document.removeEventListener('pointerdown', onPointerDown);
	}, [openIndex]);

	function onBlur(event: FocusEvent<HTMLLIElement>, index: number): void {
		const next = event.relatedTarget as Node | null;
		if (!next || !event.currentTarget.contains(next)) {
			setOpenIndex((current) => (current === index ? null : current));
		}
	}

	return (
		<nav
			ref={navRef}
			aria-label={'Основное меню'}
			className={'h-full max-lg:hidden'}
			onKeyDown={(event) => {
				if (event.key === 'Escape' && openIndex !== null) {
					const index = openIndex;
					setOpenIndex(null);
					buttons.current[index]?.focus();
				}
			}}
		>
			<ul className={'flex h-full items-center gap-0.5'}>
				{mainNav.map((item, index) => {
					const active = isActive(item, pathname);
					const hasPanel = Boolean(item.children || item.columns);
					const itemClass = cn(triggerClass, active ? 'text-brand-800 bg-brand-50' : 'text-ink');

					if (!hasPanel) {
						return (
							<li key={item.href} className={'flex h-full items-center'}>
								<Link href={item.href} aria-current={active ? 'page' : undefined} className={itemClass}>
									{item.label}
								</Link>
							</li>
						);
					}

					const open = openIndex === index;
					const panelId = `${uid}-panel-${index}`;
					const mega = Boolean(item.columns);
					return (
						<li
							key={item.href}
							className={cn('flex h-full items-center', !mega && 'relative')}
							onPointerEnter={(event) => {
								if (event.pointerType === 'mouse') setOpenIndex(index);
							}}
							onPointerLeave={(event) => {
								if (event.pointerType === 'mouse')
									setOpenIndex((current) => (current === index ? null : current));
							}}
							onBlur={(event) => onBlur(event, index)}
						>
							<button
								ref={(node) => {
									buttons.current[index] = node;
								}}
								type={'button'}
								aria-haspopup={'true'}
								aria-expanded={open}
								aria-controls={panelId}
								onClick={() => setOpenIndex(open ? null : index)}
								className={itemClass}
							>
								{item.label}
								<Icon
									name={'chevron-down'}
									size={16}
									className={cn('transition-transform duration-150', open && 'rotate-180')}
								/>
							</button>
							<div
								id={panelId}
								className={cn(
									'absolute top-full z-50 border border-line bg-white shadow-pop transition-[opacity,transform] duration-150',
									mega
										? 'left-1/2 w-[min(1080px,calc(100vw-2rem))] -translate-x-1/2 rounded-card p-6'
										: 'right-0 w-80 rounded-2xl p-2',
									open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0'
								)}
							>
								{item.columns ? (
									<>
										<div className={'grid grid-cols-[2.2fr_1fr_0.8fr] gap-8'}>
											{item.columns.map((column) => (
												<div key={column.title}>
													<p
														className={
															'mb-3 text-xs font-bold tracking-widest text-accent-700 uppercase'
														}
													>
														{column.title}
													</p>
													<ul
														className={cn(
															column.links.length > 8
																? 'columns-2 gap-4'
																: 'flex flex-col'
														)}
													>
														{column.links.map((link) => (
															<li key={link.href} className={'break-inside-avoid'}>
																<Link
																	href={link.href}
																	aria-current={
																		pathname === link.href ? 'page' : undefined
																	}
																	className={
																		'block rounded-lg px-2 py-1.5 text-[15px] font-semibold text-ink hover:bg-brand-50 hover:text-brand-800'
																	}
																>
																	{link.label}
																</Link>
															</li>
														))}
													</ul>
												</div>
											))}
										</div>
										{item.allLink ? (
											<div className={'mt-4 border-t border-line pt-4'}>
												<Link
													href={item.allLink.href}
													className={
														'inline-flex items-center gap-1.5 font-bold text-brand-800 hover:underline'
													}
												>
													{item.allLink.label}
													<Icon name={'arrow-right'} size={18} />
												</Link>
											</div>
										) : null}
									</>
								) : (
									<ul className={'flex flex-col'}>
										{item.children?.map((link) => (
											<li key={link.href}>
												<Link
													href={link.href}
													aria-current={pathname === link.href ? 'page' : undefined}
													className={
														'block rounded-xl px-3 py-2.5 text-[15px] font-semibold text-ink hover:bg-brand-50 hover:text-brand-800'
													}
												>
													{link.label}
												</Link>
											</li>
										))}
									</ul>
								)}
							</div>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
