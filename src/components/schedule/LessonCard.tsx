import {cn} from '@/lib/cn';
import {LEAD_ANCHOR} from '@/lib/site';

import {pluralSeats} from './format';

import type {CSSProperties, ReactNode} from 'react';
import type {TScheduleLesson} from '@/lib/moyklass/types';

type TLessonCardProps = {
	lesson: TScheduleLesson;
	/** Card height in px: decides how much content fits. */
	height: number;
	ended: boolean;
	/** Day label for the accessible name, e.g. «23 ноября». */
	dayLabel: string;
};

export type TTint = {
	card: string;
	hover: string;
	strip: string;
	divider: string;
	title: string;
	dot: string;
};

const TINTS: TTint[] = [
	{
		card: 'border-brand-200 bg-brand-50',
		hover: 'hover:bg-brand-100 focus-visible:bg-brand-100',
		strip: 'text-brand-800',
		divider: 'border-brand-200',
		title: 'text-brand-900',
		dot: 'bg-brand-500'
	},
	{
		card: 'border-accent-300 bg-accent-50',
		hover: 'hover:bg-accent-100 focus-visible:bg-accent-100',
		strip: 'text-accent-700',
		divider: 'border-accent-300',
		title: 'text-accent-700',
		dot: 'bg-accent-300'
	},
	{
		card: 'border-line bg-surface',
		hover: 'hover:bg-line focus-visible:bg-line',
		strip: 'text-body',
		divider: 'border-muted/40',
		title: 'text-ink',
		dot: 'bg-muted'
	}
];

const COMPACT_HEIGHT = 40;
const STRIP_PX = 22;
const LINE_PX = 18;
const SMALL_LINE_PX = 16;

/** Stable tint per direction: the same direction always gets the same colour. */
export function tintFor(directionKey: string): TTint {
	let hash = 0;
	for (const char of directionKey) {
		hash = (hash * 31 + char.charCodeAt(0)) % 997;
	}
	return TINTS[hash % TINTS.length];
}

export function seatsText(freeSeats: number | null): string | null {
	if (freeSeats === 0) {
		return 'Мест нет';
	}
	if (freeSeats !== null && freeSeats <= 3) {
		return `Осталось ${freeSeats} ${pluralSeats(freeSeats)}`;
	}
	return null;
}

export function lessonAriaLabel(lesson: TScheduleLesson, dayLabel: string, seats: string | null): string {
	return `Записаться: ${lesson.title}, ${dayLabel} ${lesson.begin}–${lesson.end}${seats ? `, ${seats.toLowerCase()}` : ''}`;
}

export function lessonTooltip(lesson: TScheduleLesson): string | undefined {
	return [lesson.studioLabel, lesson.teachers.join(', ')].filter(Boolean).join(' · ') || undefined;
}

export function LessonCard({lesson, height, ended, dayLabel}: TLessonCardProps): ReactNode {
	const tint = tintFor(lesson.directionKey);
	const seats = ended ? null : seatsText(lesson.freeSeats);
	const compact = height < COMPACT_HEIGHT;

	// Rows below the time strip: the title always, studio and seat text only when they fit.
	const free = height - STRIP_PX - 8;
	const showStudio = free >= LINE_PX * 2 + SMALL_LINE_PX;
	const showSeats = seats !== null && free >= LINE_PX * 2 + SMALL_LINE_PX * (showStudio ? 2 : 1);
	const used = (showStudio ? SMALL_LINE_PX : 0) + (showSeats ? SMALL_LINE_PX : 0);
	const titleLines = Math.max(1, Math.floor((free - used) / LINE_PX));
	const clamp: CSSProperties = {
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: titleLines,
		overflow: 'hidden'
	};

	const content = compact ? (
		<span className={cn('block truncate px-2 py-0.5 text-xs', tint.strip)}>
			<time dateTime={`${lesson.date}T${lesson.begin}`} className={'tabular-nums'}>
				{lesson.begin}
			</time>{' '}
			<span className={cn('font-semibold', tint.title)}>{lesson.title}</span>
		</span>
	) : (
		<>
			<span
				className={cn(
					'relative block truncate border-b border-dashed py-0.5 text-xs tabular-nums',
					'px-2',
					tint.strip,
					tint.divider
				)}
			>
				<time dateTime={`${lesson.date}T${lesson.begin}`}>{lesson.begin}</time>
				{' – '}
				<time dateTime={`${lesson.date}T${lesson.end}`}>{lesson.end}</time>
				{seats && !showSeats ? (
					<span
						aria-hidden
						className={cn(
							'absolute top-1/2 right-1.5 size-2 -translate-y-1/2 rounded-full',
							lesson.freeSeats === 0 ? 'bg-muted' : 'bg-accent-700'
						)}
					/>
				) : null}
			</span>
			<span style={clamp} className={cn('px-2 pt-1 text-sm leading-[18px] font-semibold', tint.title)}>
				{lesson.title}
			</span>
			{showStudio ? <span className={'block truncate px-2 text-xs text-muted'}>{lesson.studioLabel}</span> : null}
			{showSeats ? (
				<span
					className={cn(
						'block truncate px-2 text-xs',
						lesson.freeSeats === 0 ? 'text-muted' : 'font-semibold text-accent-700'
					)}
				>
					{seats}
				</span>
			) : null}
		</>
	);

	const base = cn('block h-full overflow-hidden rounded-md border text-left', tint.card);

	if (ended) {
		return <div className={cn(base, 'opacity-50')}>{content}</div>;
	}

	return (
		<a
			href={LEAD_ANCHOR}
			aria-label={lessonAriaLabel(lesson, dayLabel, seats)}
			title={lessonTooltip(lesson)}
			className={cn(base, 'transition-colors', tint.hover)}
		>
			{content}
		</a>
	);
}
