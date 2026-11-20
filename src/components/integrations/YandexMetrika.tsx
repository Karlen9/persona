'use client';

import Script from 'next/script';
import {usePathname} from 'next/navigation';
import {useEffect, useRef} from 'react';

import {YANDEX_METRIKA_ID} from '@/lib/site';

import {useConsent} from './consent';
import {hit, reachGoal} from './track';

import type {ReactNode} from 'react';

const INIT = `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${YANDEX_METRIKA_ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});`;

/** Loads the counter after idle and only with cookie consent; sends SPA page views. */
export function YandexMetrika(): ReactNode {
	const consent = useConsent();
	const pathname = usePathname();
	const first = useRef(true);
	const granted = consent === 'granted';

	useEffect(() => {
		if (!granted) return;
		if (first.current) {
			first.current = false; // the init call already records the landing page view
			return;
		}
		hit(window.location.pathname + window.location.search);
	}, [pathname, granted]);

	useEffect(() => {
		if (!granted) return;
		function onClick(event: MouseEvent): void {
			const link = (event.target as Element | null)?.closest?.('a[href]');
			const href = link?.getAttribute('href') ?? '';
			if (href.startsWith('tel:')) reachGoal('click_phone');
			else if (/t\.me\/|telegram\.(me|org)\//.test(href)) reachGoal('click_telegram');
		}
		document.addEventListener('click', onClick);
		return () => document.removeEventListener('click', onClick);
	}, [granted]);

	if (!granted) return null;
	return (
		<>
			<Script id={'yandex-metrika'} strategy={'lazyOnload'}>
				{INIT}
			</Script>
			<noscript>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
					style={{position: 'absolute', left: '-9999px'}}
					alt={''}
				/>
			</noscript>
		</>
	);
}
