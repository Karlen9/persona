'use client';

import {useEffect, useId, useLayoutEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

import {cn} from '@/lib/cn';
import {LEAD_ANCHOR} from '@/lib/site';

import {lessonAriaLabel, lessonTooltip, seatsText, tintFor} from './LessonCard';
import {pluralLessons} from './format';
import {formatMinutes, GROUP_ROW_PX as ROW_PX, planGroupRows} from './layout';

import type {CSSProperties, ReactNode} from 'react';
import type {TPlacedLesson} from './layout';

type TGroupCardProps = {
	items: TPlacedLesson[];
	startMin: number;
	endMin: number;
	/** Card height in px. */
	height: number;
	isEnded: (item: TPlacedLesson) => boolean;
	/** Day label for accessible names, e.g. «23 ноября». */
	dayLabel: string;
};

const MARGIN = 8;
const frameClass = 'overflow-hidden rounded-md border border-line bg-surface';
const stripClass = 'block truncate border-b border-dashed border-muted/40 px-2 py-0.5 text-xs text-body tabular-nums';

function Row({
	item,
	startMin,
	ended,
	dayLabel
}: {
	item: TPlacedLesson;
	startMin: number;
	ended: boolean;
	dayLabel: string;
}): ReactNode {
	const {lesson} = item;
	const tint = tintFor(lesson.directionKey);
	const seats = ended ? null : seatsText(lesson.freeSeats);
	const inner = (
		<>
			<span aria-hidden className={cn('size-2 shrink-0 rounded-full', tint.dot)} />
			{item.startMin === startMin ? null : (
				<span className={'shrink-0 text-muted tabular-nums'}>{lesson.begin}</span>
			)}
			<span className={'min-w-0 flex-1 truncate font-semibold text-ink'}>{lesson.title}</span>
			{seats ? (
				<span
					aria-hidden
					className={cn(
						'size-1.5 shrink-0 rounded-full',
						lesson.freeSeats === 0 ? 'bg-muted' : 'bg-accent-700'
					)}
				/>
			) : null}
		</>
	);
	const rowClass = 'flex items-center gap-1.5 rounded px-1 text-xs';
	return (
		<li style={{height: ROW_PX}} className={'flex'}>
			{ended ? (
				<span className={cn(rowClass, 'w-full opacity-50')}>{inner}</span>
			) : (
				<a
					href={LEAD_ANCHOR}
					aria-label={lessonAriaLabel(lesson, dayLabel, seats)}
					title={lessonTooltip(lesson)}
					className={cn(rowClass, 'w-full transition-colors hover:bg-white focus-visible:bg-white')}
				>
					{inner}
				</a>
			)}
		</li>
	);
}

/** Viewport-fixed position for the panel: below the toggle (flipped above when short of room), clamped to the screen. */
function placePanel(toggle: HTMLElement, card: HTMLElement, panel: HTMLElement): CSSProperties {
	const rect = toggle.getBoundingClientRect();
	const width = Math.min(Math.max(card.offsetWidth, 224), window.innerWidth - MARGIN * 2);
	const left = Math.min(Math.max(card.getBoundingClientRect().left, MARGIN), window.innerWidth - width - MARGIN);
	const height = panel.offsetHeight;
	let top = rect.bottom + 4;
	if (top + height > window.innerHeight - MARGIN && rect.top - height - 4 >= MARGIN) {
		top = rect.top - height - 4;
	}
	return {top: Math.max(MARGIN, top), left, width};
}

/** One card for a cluster of overlapping lessons that is too narrow to split into side-by-side lanes. */
export function GroupCard({items, startMin, endMin, height, isEnded, dayLabel}: TGroupCardProps): ReactNode {
	const rows = [...items].sort(
		(a, b) => a.startMin - b.startMin || a.lesson.title.localeCompare(b.lesson.title, 'ru')
	);
	const plan = planGroupRows(height, rows.length);
	const visible = rows.slice(0, plan.visible);

	const [open, setOpen] = useState(false);
	const [position, setPosition] = useState<CSSProperties>({top: 0, left: 0});
	const root = useRef<HTMLDivElement>(null);
	const toggle = useRef<HTMLButtonElement>(null);
	const panel = useRef<HTMLDivElement>(null);
	const panelId = useId();
	const range = `${formatMinutes(startMin)} – ${formatMinutes(endMin)}`;

	useLayoutEffect(() => {
		if (open && toggle.current && root.current && panel.current) {
			setPosition(placePanel(toggle.current, root.current, panel.current));
		}
	}, [open]);

	useEffect(() => {
		if (!open) {
			return;
		}
		(panel.current?.querySelector<HTMLElement>('a') ?? panel.current)?.focus({preventScroll: true});
		const close = (): void => setOpen(false);
		const onPointerDown = (event: PointerEvent): void => {
			const target = event.target as Node;
			if (!root.current?.contains(target) && !panel.current?.contains(target)) {
				setOpen(false);
			}
		};
		document.addEventListener('pointerdown', onPointerDown);
		window.addEventListener('scroll', close, true);
		window.addEventListener('resize', close);
		return () => {
			document.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('scroll', close, true);
			window.removeEventListener('resize', close);
		};
	}, [open]);

	const renderRows = (list: TPlacedLesson[]): ReactNode =>
		list.map((item) => (
			<Row key={item.lesson.id} item={item} startMin={startMin} ended={isEnded(item)} dayLabel={dayLabel} />
		));

	return (
		<div
			ref={root}
			className={'relative h-full'}
			// Events from the portaled panel bubble here through the React tree.
			onKeyDown={(event) => {
				if (event.key === 'Escape' && open) {
					setOpen(false);
					toggle.current?.focus();
				}
			}}
			onBlur={(event) => {
				const next = event.relatedTarget as Node | null;
				if (open && !root.current?.contains(next) && !panel.current?.contains(next)) {
					setOpen(false);
				}
			}}
		>
			<div className={cn(frameClass, 'h-full')}>
				<span className={stripClass}>{range}</span>
				<ul className={'p-0.5'}>
					{renderRows(visible)}
					{plan.hidden > 0 ? (
						<li style={{height: ROW_PX}} className={'flex'}>
							<button
								ref={toggle}
								type={'button'}
								aria-expanded={open}
								aria-controls={panelId}
								onClick={() => setOpen((value) => !value)}
								className={cn(
									'w-full rounded px-1 text-left text-xs transition-colors hover:bg-white focus-visible:bg-white',
									plan.mode === 'toggle' ? 'font-semibold text-ink' : 'text-muted'
								)}
							>
								{plan.mode === 'toggle'
									? `${plan.hidden} ${pluralLessons(plan.hidden)}`
									: `+${plan.hidden} ещё`}
							</button>
						</li>
					) : null}
				</ul>
			</div>
			{open
				? createPortal(
						<div
							ref={panel}
							id={panelId}
							role={'group'}
							aria-label={`Занятия ${range}`}
							tabIndex={-1}
							style={position}
							className={cn(frameClass, 'fixed z-50 max-h-72 overflow-auto bg-white shadow-pop')}
						>
							<span className={stripClass}>{range}</span>
							<ul className={'p-0.5'}>{renderRows(rows)}</ul>
						</div>,
						document.body
					)
				: null}
		</div>
	);
}
