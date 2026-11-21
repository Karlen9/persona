import {Icon} from '@/components/ui/Icon';

import type {ReactNode} from 'react';

type TContactPreviewProps = {
	cta: string;
	phone: string;
};

export function ContactPreview({cta, phone}: TContactPreviewProps): ReactNode {
	return (
		<div className={'flex h-full flex-col justify-end gap-2'}>
			<span
				className={
					'inline-flex w-fit items-center gap-2 rounded-btn bg-white px-3 py-1.5 text-sm font-extrabold text-brand-800'
				}
			>
				{cta}
				<Icon name={'arrow-right'} size={16} />
			</span>
			<span className={'text-sm font-semibold text-white/90 tabular-nums'}>{phone}</span>
		</div>
	);
}
