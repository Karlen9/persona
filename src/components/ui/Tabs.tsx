'use client';

import {useId, useRef, useState} from 'react';

import {cn} from '@/lib/cn';

import type {KeyboardEvent, ReactNode} from 'react';

export type TTab = {
	id: string;
	label: string;
	content: ReactNode;
};

type TTabsProps = {
	tabs: TTab[];
	defaultTabId?: string;
	/** Render only the active panel's content, so inactive tabs add nothing to the DOM and load no media. */
	lazy?: boolean;
	className?: string;
};

export function Tabs({tabs, defaultTabId, lazy, className}: TTabsProps): ReactNode {
	const uid = useId();
	const [active, setActive] = useState(defaultTabId ?? tabs[0]?.id);
	const refs = useRef<Record<string, HTMLButtonElement | null>>({});

	function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
		const index = tabs.findIndex((tab) => tab.id === active);
		let next = index;
		if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
		else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
		else if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = tabs.length - 1;
		else return;
		event.preventDefault();
		const id = tabs[next].id;
		setActive(id);
		refs.current[id]?.focus();
	}

	return (
		<div className={className}>
			<div
				role={'tablist'}
				onKeyDown={onKeyDown}
				className={'no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0'}
			>
				{tabs.map((tab) => {
					const selected = tab.id === active;
					return (
						<button
							key={tab.id}
							ref={(node) => {
								refs.current[tab.id] = node;
							}}
							role={'tab'}
							type={'button'}
							id={`${uid}-tab-${tab.id}`}
							aria-selected={selected}
							aria-controls={`${uid}-panel-${tab.id}`}
							tabIndex={selected ? 0 : -1}
							onClick={() => setActive(tab.id)}
							className={cn(
								'h-11 shrink-0 rounded-btn border px-5 font-bold transition-colors',
								selected
									? 'border-brand bg-brand text-brand-ink'
									: 'border-line bg-white text-ink hover:border-brand-400'
							)}
						>
							{tab.label}
						</button>
					);
				})}
			</div>
			{tabs.map((tab) => (
				<div
					key={tab.id}
					role={'tabpanel'}
					id={`${uid}-panel-${tab.id}`}
					aria-labelledby={`${uid}-tab-${tab.id}`}
					hidden={tab.id !== active}
					className={'mt-6'}
				>
					{lazy && tab.id !== active ? null : tab.content}
				</div>
			))}
		</div>
	);
}
