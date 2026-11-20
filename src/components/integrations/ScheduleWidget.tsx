'use client';

import {useRef} from 'react';

import {site} from '@/content/site';

import {ContactFallback} from './ContactFallback';
import {useMoyklassWidget} from './moyklass';

import type {ReactNode} from 'react';

const {widgetId: SCRIPT_ID, mountIds: MOUNT_IDS} = site.moyklass.schedule;

/** Moyklass schedule widgets for the schedule page. */
export function ScheduleWidget(): ReactNode {
	const ref = useRef<HTMLDivElement>(null);
	const state = useMoyklassWidget(ref, {scriptId: SCRIPT_ID, timeoutMs: 15000});

	return (
		<div
			ref={ref}
			className={state === 'ready' ? 'relative' : 'relative min-h-[640px]'}
			aria-busy={state === 'loading'}
		>
			{MOUNT_IDS.map((id) => (
				<div key={id} id={id} />
			))}
			{state === 'failed' ? (
				<div className={'absolute inset-0'}>
					<ContactFallback
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
