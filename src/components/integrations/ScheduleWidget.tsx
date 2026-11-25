'use client';

import {useRef} from 'react';

import {ContactFallback} from './ContactFallback';
import {useMoyklassWidget} from './moyklass';

import type {ReactNode} from 'react';
import type {TContactInfo} from '@/lib/site';

type TScheduleWidgetProps = {
	widgetId: string;
	mountIds: string[];
	contacts: TContactInfo;
};

/** Moyklass schedule widgets for the schedule page. */
export function ScheduleWidget({widgetId, mountIds, contacts}: TScheduleWidgetProps): ReactNode {
	const ref = useRef<HTMLDivElement>(null);
	const state = useMoyklassWidget(ref, {scriptId: widgetId, timeoutMs: 15000});

	return (
		<div
			ref={ref}
			className={state === 'ready' ? 'relative' : 'relative min-h-[640px]'}
			aria-busy={state === 'loading'}
		>
			{mountIds.map((id) => (
				<div key={id} id={id} />
			))}
			{state === 'failed' ? (
				<div className={'absolute inset-0'}>
					<ContactFallback
						contacts={contacts}
						message={'Не удалось загрузить расписание. Позвоните нам — подскажем свободные группы.'}
					/>
				</div>
			) : null}
			{state !== 'ready' && state !== 'failed' ? (
				<div aria-hidden className={'absolute inset-0 flex flex-col gap-3'}>
					{[0, 1, 2, 3, 4].map((n) => (
						<div
							key={n}
							className={'h-16 animate-[persona-pulse_1.6s_ease-in-out_infinite] rounded-2xl bg-surface'}
						/>
					))}
				</div>
			) : null}
		</div>
	);
}
