import type {ReactNode} from 'react';

export function SkipLink(): ReactNode {
	return (
		<a
			href={'#content'}
			className={
				'sr-only z-[100] rounded-xl bg-brand-900 px-4 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3'
			}
		>
			{'Перейти к содержимому'}
		</a>
	);
}
