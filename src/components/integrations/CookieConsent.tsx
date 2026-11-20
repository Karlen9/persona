'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';

import {Button} from '@/components/ui/Button';

import {useConsent, writeConsent} from './consent';

import type {ReactNode} from 'react';

type TCookieConsentProps = {
	title: string;
	description: string;
	accept: string;
	reject: string;
};

/** CSS variable on <html>: height of the visible banner on phones, used to lift the floating contacts button. */
const OFFSET_VAR = '--cookie-banner-offset';
const PHONE_QUERY = '(max-width: 639px)';

/** Fixed bottom notice. Appears shortly after hydration so it never competes with LCP and never shifts layout. */
export function CookieConsent({title, description, accept, reject}: TCookieConsentProps): ReactNode {
	const consent = useConsent();
	const [ready, setReady] = useState(false);
	const box = useRef<HTMLDivElement>(null);
	const visible = consent === null && ready;

	useEffect(() => {
		const timer = window.setTimeout(() => setReady(true), 1200);
		return () => window.clearTimeout(timer);
	}, []);

	// On phones the banner spans the width and would sit on top of the floating contacts button:
	// publish "banner height + gap" so FloatingContacts can lift itself above it; cleared when the banner goes away.
	useEffect(() => {
		const el = box.current;
		if (!visible || !el) return;
		const root = document.documentElement;
		const phone = window.matchMedia(PHONE_QUERY);
		const sync = (): void => {
			if (phone.matches)
				root.style.setProperty(OFFSET_VAR, `${Math.ceil(el.getBoundingClientRect().height) + 12}px`);
			else root.style.removeProperty(OFFSET_VAR);
		};
		sync();
		const observer = new ResizeObserver(sync);
		observer.observe(el);
		phone.addEventListener('change', sync);
		return () => {
			observer.disconnect();
			phone.removeEventListener('change', sync);
			root.style.removeProperty(OFFSET_VAR);
		};
	}, [visible]);

	if (!visible) return null;

	return (
		<div
			ref={box}
			role={'region'}
			aria-label={'Уведомление о cookie'}
			className={'fixed inset-x-3 bottom-3 z-[60] sm:right-auto sm:bottom-5 sm:left-5 sm:w-[420px]'}
		>
			<div className={'flex flex-col gap-2.5 rounded-card border border-line bg-white p-4 shadow-pop'}>
				<div>
					<p className={'text-sm font-extrabold text-ink'}>{title}</p>
					<p className={'mt-1 line-clamp-2 text-[13px] leading-snug text-ink'}>{description}</p>
					<Link
						href={'/politika-konfidencialnosti/'}
						className={
							'mt-1 inline-block py-0.5 text-[13px] font-semibold text-brand-800 underline underline-offset-2'
						}
					>
						{'Подробнее'}
					</Link>
				</div>
				<div className={'flex gap-2'}>
					<Button size={'sm'} className={'flex-1 px-3'} onClick={() => writeConsent('granted')}>
						{accept}
					</Button>
					<Button
						size={'sm'}
						variant={'secondary'}
						className={'flex-1 px-3'}
						onClick={() => writeConsent('denied')}
					>
						{reject}
					</Button>
				</div>
			</div>
		</div>
	);
}
