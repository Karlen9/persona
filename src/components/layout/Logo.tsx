import {existsSync} from 'node:fs';
import path from 'node:path';

import Image from 'next/image';
import Link from 'next/link';

import {cn} from '@/lib/cn';

import type {ReactNode} from 'react';

/** Resolved once at module load (build time): uses the downloaded logo if it exists, else the wordmark. */
const LOGO_SRC = ['/media/brand/logo.svg', '/media/brand/logo.png'].find((src) =>
	existsSync(path.join(process.cwd(), 'public', src))
);

type TLogoProps = {
	className?: string;
	/** Link to home (default true). Disable inside the home hero etc. */
	asLink?: boolean;
	/** Preload the image (header logo only). */
	priority?: boolean;
};

export function Logo({className, asLink = true, priority = false}: TLogoProps): ReactNode {
	const mark = LOGO_SRC ? (
		<Image src={LOGO_SRC} alt={'PersOna'} width={160} height={40} priority={priority} className={'h-9 w-auto'} />
	) : (
		<span className={'text-2xl font-extrabold tracking-tight text-ink'}>
			{'Pers'}
			<span className={'text-brand-600'}>{'O'}</span>
			{'na'}
		</span>
	);
	if (!asLink) return <span className={className}>{mark}</span>;
	return (
		<Link href={'/'} aria-label={'PersOna — на главную'} className={cn('inline-flex items-center', className)}>
			{mark}
		</Link>
	);
}
