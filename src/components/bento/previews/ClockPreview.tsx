'use client';

import Image from 'next/image';
import {useEffect, useState} from 'react';

import {useTileActivity} from '@/components/bento/TileActivity';

import type {ReactNode} from 'react';

type TAvatar = {
	src: string;
};

type TClockPreviewProps = {
	avatars: TAvatar[];
	hours?: string;
};

const formatter = new Intl.DateTimeFormat('ru-RU', {timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit'});

export function ClockPreview({avatars, hours}: TClockPreviewProps): ReactNode {
	const {visible} = useTileActivity();
	// Stable placeholder for the server render and first client render: the real time is filled in after mount.
	const [time, setTime] = useState('--:--');

	useEffect(() => {
		const update = (): void => setTime(formatter.format(new Date()));
		update();
		if (!visible) return;
		const timer = setInterval(update, 1000);
		return () => clearInterval(timer);
	}, [visible]);

	return (
		<div className={'flex h-full flex-col justify-end gap-3'}>
			<div>
				<p className={'text-xs font-semibold text-muted'}>{'Сейчас в Москве'}</p>
				<p className={'text-4xl leading-none font-extrabold text-ink tabular-nums'}>{time}</p>
				{hours ? <p className={'mt-1.5 text-xs text-body'}>{`Студии: ${hours}`}</p> : null}
			</div>
			<div className={'flex -space-x-2'}>
				{avatars.map((avatar) => (
					<span
						key={avatar.src}
						className={'relative size-10 overflow-hidden rounded-full border-2 border-white bg-surface'}
					>
						<Image src={avatar.src} alt={''} fill sizes={'40px'} className={'object-cover'} />
					</span>
				))}
			</div>
		</div>
	);
}
