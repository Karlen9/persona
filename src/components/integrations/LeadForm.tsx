'use client';

import {useRef} from 'react';

import {LEAD_ANCHOR} from '@/lib/site';

import {ContactFallback} from './ContactFallback';
import {useMoyklassWidget} from './moyklass';

import type {ReactNode} from 'react';
import type {TContactInfo} from '@/lib/site';

type TLeadFormProps = {
	widgetId: string;
	mountId: string;
	contacts: TContactInfo;
};

/** Moyklass lead form. Mount it once per page (the footer section #zapis does). */
export function LeadForm({widgetId, mountId, contacts}: TLeadFormProps): ReactNode {
	const ref = useRef<HTMLDivElement>(null);
	const state = useMoyklassWidget(ref, {scriptId: widgetId, ctaHash: LEAD_ANCHOR, trackLead: true});

	return (
		<div
			ref={ref}
			className={state === 'ready' ? 'relative' : 'relative min-h-[460px]'}
			aria-busy={state === 'loading'}
		>
			<div id={mountId} />
			{state === 'failed' ? (
				<div className={'absolute inset-0'}>
					<ContactFallback contacts={contacts} />
				</div>
			) : null}
			{state !== 'ready' && state !== 'failed' ? (
				<div aria-hidden className={'absolute inset-0 flex flex-col gap-4'}>
					{[0, 1, 2].map((n) => (
						<div
							key={n}
							className={'h-14 animate-[persona-pulse_1.6s_ease-in-out_infinite] rounded-2xl bg-surface'}
						/>
					))}
					<div className={'h-24 animate-[persona-pulse_1.6s_ease-in-out_infinite] rounded-2xl bg-surface'} />
					<div
						className={
							'h-14 w-48 animate-[persona-pulse_1.6s_ease-in-out_infinite] rounded-2xl bg-brand-100'
						}
					/>
				</div>
			) : null}
		</div>
	);
}
