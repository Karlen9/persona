import {SmartLink} from './SmartLink';

import type {ReactNode} from 'react';
import type {TInline, TRichText} from '@/content/types';

const linkClass = 'font-semibold text-brand-800 underline decoration-brand-300 underline-offset-4 hover:text-brand-900';

function renderRun(run: TInline, index: number): ReactNode {
	let node: ReactNode = run.text;
	if (run.bold) node = <strong className={'font-bold text-ink'}>{node}</strong>;
	if (run.italic) node = <em>{node}</em>;
	if (run.href) {
		node = (
			<SmartLink href={run.href} className={linkClass}>
				{node}
			</SmartLink>
		);
	}
	return <span key={index}>{node}</span>;
}

/** Inline runs (bold / italic / links) of a `TRichText`; plain text when there is no formatting. */
export function RichInline({value}: {value: TRichText}): ReactNode {
	if (!value.inline) return value.text;
	return <>{value.inline.map(renderRun)}</>;
}
