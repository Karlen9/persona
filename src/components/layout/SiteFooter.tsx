import Link from 'next/link';

import {GisReviewsLink, YandexRatingBadge} from '@/components/integrations/YandexRatingBadge';
import {Container} from '@/components/ui/Container';
import {Icon} from '@/components/ui/Icon';
import {footerNav} from '@/content/navigation';
import {EMAIL, PHONES, SOCIALS} from '@/lib/site';

import {Logo} from './Logo';
import {LeadSection} from './LeadSection';

import type {ReactNode} from 'react';

const linkClass = 'text-body hover:text-brand-800 py-1 text-[15px] hover:underline underline-offset-4';

export function SiteFooter(): ReactNode {
	const year = new Date().getFullYear();
	return (
		<>
			<LeadSection />
			<footer className={'border-t border-line bg-surface'}>
				<Container className={'py-12 md:py-16'}>
					<div className={'grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_repeat(4,1fr)]'}>
						<div id={'kontakty'} className={'sm:col-span-2 lg:col-span-1'}>
							<Logo />
							<p className={'mt-4 max-w-xs text-[15px]'}>
								{
									'Творческий центр для детей и взрослых в Москве. Более 20 лет помогаем раскрывать таланты.'
								}
							</p>
							<ul className={'mt-5 flex flex-col gap-1'}>
								{PHONES.map((phone) => (
									<li key={phone.href}>
										<a href={phone.href} className={'font-bold text-ink hover:text-brand-800'}>
											{phone.label}
										</a>
									</li>
								))}
								<li>
									<a
										href={`mailto:${EMAIL}`}
										className={'font-semibold text-ink hover:text-brand-800'}
									>
										{EMAIL}
									</a>
								</li>
							</ul>
							<ul className={'mt-5 flex gap-2'}>
								{SOCIALS.map((social) => (
									<li key={social.id}>
										<a
											href={social.href}
											target={'_blank'}
											rel={'noopener noreferrer'}
											aria-label={social.label}
											className={
												'grid size-11 place-items-center rounded-full border border-line bg-white text-brand-800 transition-colors hover:bg-brand'
											}
										>
											<Icon name={social.id} size={social.id === 'telegram' ? 20 : 26} />
										</a>
									</li>
								))}
							</ul>
						</div>
						{footerNav.map((column, index) => (
							<nav
								key={column.title}
								id={index === 0 ? 'karta-sajta' : undefined}
								aria-label={column.title}
							>
								<p className={'mb-3 font-extrabold text-ink'}>{column.title}</p>
								<ul className={'flex flex-col'}>
									{column.links.map((link) => (
										<li key={link.href}>
											{link.href.startsWith('/docs/') ? (
												<a
													href={link.href}
													target={'_blank'}
													rel={'noopener noreferrer'}
													className={linkClass}
												>
													{link.label}
												</a>
											) : (
												<Link href={link.href} className={linkClass}>
													{link.label}
												</Link>
											)}
										</li>
									))}
								</ul>
							</nav>
						))}
					</div>
					<div
						className={
							'mt-12 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between'
						}
					>
						<p className={'text-sm text-muted'}>
							{`© ${year} PersOna — творческий центр. Все права защищены.`}
						</p>
						<div className={'flex flex-wrap items-center gap-4'}>
							<YandexRatingBadge />
							<GisReviewsLink />
						</div>
					</div>
				</Container>
			</footer>
		</>
	);
}
