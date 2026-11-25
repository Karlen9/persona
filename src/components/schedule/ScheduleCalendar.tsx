'use client';

import {useEffect, useMemo, useRef, useState} from 'react';

import {Icon} from '@/components/ui/Icon';
import {cn} from '@/lib/cn';
import {addDays, dayNumber, moscowDate, moscowTime, monthIndex, startOfWeek, weekdayIndex} from '@/lib/moyklass/dates';

import {GroupCard} from './GroupCard';
import {LessonCard} from './LessonCard';
import {computeHourRange, layoutDay, toMinutes} from './layout';
import {formatMonthTitle, formatRange, WEEKDAYS_LONG, WEEKDAYS_SHORT, monthGenitive} from './format';

import type {CSSProperties, ReactNode} from 'react';
import type {TSchedule, TScheduleLesson} from '@/lib/moyklass/types';

type TScheduleCalendarProps = {
	schedule: TSchedule;
};

const HOUR_PX = 96;
const GUTTER_REM = 4.5;

const STUDIO_PARAM = 'studiya';
const DIRECTION_PARAM = 'napravlenie';

const pillClass =
	'inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink';
const selectClass = `${pillClass} sm:min-w-44`;
const arrowClass =
	'inline-flex size-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface disabled:pointer-events-none disabled:opacity-30';
const HATCH =
	'repeating-linear-gradient(45deg, transparent 0 6px, color-mix(in srgb, var(--color-line) 70%, transparent) 6px 7px)';
const textButtonClass = 'min-h-11 font-bold text-brand-700 hover:text-brand-800';

function gutterPx(root: HTMLElement): number {
	return parseFloat(getComputedStyle(root).fontSize) * GUTTER_REM;
}

function syncUrl(studio: string, direction: string): void {
	const params = new URLSearchParams(window.location.search);
	for (const [name, value] of [
		[STUDIO_PARAM, studio],
		[DIRECTION_PARAM, direction]
	]) {
		if (value) {
			params.set(name, value);
		} else {
			params.delete(name);
		}
	}
	const query = params.toString();
	window.history.replaceState(
		null,
		'',
		`${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
	);
}

/** Monday of the week to show first; a hidden Sunday rolls over to the next week. */
function anchorWeek(today: string, visibleDays: number, from: string, to: string): string {
	const target = startOfWeek(weekdayIndex(today) >= visibleDays ? addDays(today, 1) : today);
	const first = startOfWeek(from);
	const last = startOfWeek(to);
	return target < first ? first : target > last ? last : target;
}

export function ScheduleCalendar({schedule}: TScheduleCalendarProps): ReactNode {
	const hasSunday = useMemo(() => schedule.lessons.some((lesson) => weekdayIndex(lesson.date) === 6), [schedule]);
	const dayCount = hasSunday ? 7 : 6;
	// Starts from the server timestamp so the first client render matches the server HTML; real "now" arrives on mount.
	const [today, setToday] = useState(() => moscowDate(new Date(schedule.generatedAt)));
	const [nowTime, setNowTime] = useState<string | null>(null);
	const [studio, setStudio] = useState('');
	const [direction, setDirection] = useState('');
	const [weekStart, setWeekStart] = useState(() =>
		anchorWeek(moscowDate(new Date(schedule.generatedAt)), dayCount, schedule.from, schedule.to)
	);

	useEffect(() => {
		const tick = (): void => {
			const now = new Date();
			setToday(moscowDate(now));
			setNowTime(moscowTime(now));
		};
		tick();
		const timer = window.setInterval(tick, 60000);
		return () => window.clearInterval(timer);
	}, []);

	// Real "today" can differ from the generation day (stale ISR page): re-anchor the week once when it changes.
	useEffect(() => {
		setWeekStart(anchorWeek(today, dayCount, schedule.from, schedule.to));
	}, [today, dayCount, schedule.from, schedule.to]);

	// Filters are read from the URL once on mount; unknown values are ignored.
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const studioParam = params.get(STUDIO_PARAM) ?? '';
		const directionParam = params.get(DIRECTION_PARAM) ?? '';
		if (schedule.studios.some((item) => item.slug === studioParam)) {
			setStudio(studioParam);
		}
		if (schedule.directions.some((item) => item.key === directionParam)) {
			setDirection(directionParam);
		}
	}, [schedule.studios, schedule.directions]);

	const firstWeek = startOfWeek(schedule.from);
	const lastWeek = startOfWeek(schedule.to);
	const days = useMemo(() => Array.from({length: dayCount}, (_, i) => addDays(weekStart, i)), [weekStart, dayCount]);

	const byDay = useMemo(() => {
		const map = new Map<string, TScheduleLesson[]>();
		for (const lesson of schedule.lessons) {
			if (studio && lesson.studioSlug !== studio) {
				continue;
			}
			if (direction && lesson.directionKey !== direction) {
				continue;
			}
			const list = map.get(lesson.date);
			if (list) {
				list.push(lesson);
			} else {
				map.set(lesson.date, [lesson]);
			}
		}
		return map;
	}, [schedule.lessons, studio, direction]);

	const updateFilters = (nextStudio: string, nextDirection: string): void => {
		setStudio(nextStudio);
		setDirection(nextDirection);
		syncUrl(nextStudio, nextDirection);
	};

	const isEnded = (lesson: TScheduleLesson): boolean =>
		lesson.date < today || (lesson.date === today && nowTime !== null && lesson.end <= nowTime);

	const dayLabel = (day: string): string => `${dayNumber(day)} ${monthGenitive(monthIndex(day))}`;

	// On narrow screens the grid scrolls inside itself: bring today (else the first busy day) into view.
	const scroller = useRef<HTMLDivElement>(null);
	const hasLessons = days.some((day) => byDay.has(day));
	useEffect(() => {
		const root = scroller.current;
		const target =
			root?.querySelector<HTMLElement>('[data-today]') ?? root?.querySelector<HTMLElement>('[data-busy]');
		if (root && target) {
			// Leave room for the sticky time gutter.
			root.scrollLeft = target.offsetLeft - gutterPx(root);
		}
	}, [weekStart, today, hasLessons]);

	const {startHour, endHour} = useMemo(() => computeHourRange(schedule.lessons), [schedule.lessons]);
	const hours = useMemo(
		() => Array.from({length: endHour - startHour + 1}, (_, i) => startHour + i),
		[startHour, endHour]
	);
	const bodyHeight = (endHour - startHour) * HOUR_PX;
	const layouts = days.map((day) => layoutDay(byDay.get(day) ?? []));
	// Below lg columns keep a minimum width per lane and the grid scrolls; from lg they share the width equally.
	const gridVars = {
		'--cols-sm': `${GUTTER_REM}rem ${layouts.map(({maxLanes}) => `minmax(${maxLanes * 7}rem, ${maxLanes}fr)`).join(' ')}`,
		'--cols-lg': `${GUTTER_REM}rem repeat(${dayCount}, minmax(0, 1fr))`
	} as CSSProperties;

	const nowMin = nowTime === null ? null : toMinutes(nowTime);
	const nowTop =
		nowMin !== null && days.includes(today) && nowMin >= startHour * 60 && nowMin <= endHour * 60
			? ((nowMin - startHour * 60) / 60) * HOUR_PX
			: null;

	const currentWeek = anchorWeek(today, dayCount, schedule.from, schedule.to);
	const lastDay = addDays(weekStart, dayCount - 1);
	const canPrev = weekStart > firstWeek;
	const canNext = weekStart < lastWeek;

	return (
		<div className={'flex flex-col gap-6'}>
			<div className={'flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'}>
				<div className={'flex flex-wrap items-center gap-3'}>
					<p className={'text-3xl font-extrabold text-ink'}>{formatMonthTitle(weekStart, lastDay)}</p>
					<button
						type={'button'}
						disabled={weekStart === currentWeek}
						onClick={() => setWeekStart(currentWeek)}
						className={`${pillClass} rounded-btn transition-colors hover:bg-surface disabled:pointer-events-none disabled:opacity-40`}
					>
						{'Сегодня'}
					</button>
				</div>
				<div className={'flex flex-wrap items-end gap-3'}>
					<label className={'flex flex-col gap-1 text-xs font-bold text-muted'}>
						{'Студия'}
						<select
							value={studio}
							onChange={(event) => updateFilters(event.target.value, direction)}
							className={selectClass}
						>
							<option value={''}>{'Все студии'}</option>
							{schedule.studios.map((item) => (
								<option key={item.slug} value={item.slug}>
									{item.label}
								</option>
							))}
						</select>
					</label>
					<label className={'flex flex-col gap-1 text-xs font-bold text-muted'}>
						{'Направление'}
						<select
							value={direction}
							onChange={(event) => updateFilters(studio, event.target.value)}
							className={selectClass}
						>
							<option value={''}>{'Все направления'}</option>
							{schedule.directions.map((item) => (
								<option key={item.key} value={item.key}>
									{item.label}
								</option>
							))}
						</select>
					</label>
					<p aria-live={'polite'} className={pillClass}>
						<Icon name={'calendar'} size={18} className={'text-muted'} />
						{formatRange(weekStart, lastDay)}
					</p>
				</div>
			</div>

			<div className={'overflow-hidden rounded-2xl border border-line'}>
				<div ref={scroller} className={'relative overflow-x-auto'}>
					<div
						className={
							'grid [grid-template-columns:var(--cols-sm)] lg:[grid-template-columns:var(--cols-lg)]'
						}
						style={gridVars}
					>
						<div
							className={
								'sticky left-0 z-20 flex items-center justify-center gap-0.5 border-b border-line bg-white'
							}
						>
							<button
								type={'button'}
								aria-label={'Предыдущая неделя'}
								disabled={!canPrev}
								onClick={() => setWeekStart(addDays(weekStart, -7))}
								className={arrowClass}
							>
								<Icon name={'chevron-left'} size={18} />
							</button>
							<button
								type={'button'}
								aria-label={'Следующая неделя'}
								disabled={!canNext}
								onClick={() => setWeekStart(addDays(weekStart, 7))}
								className={arrowClass}
							>
								<Icon name={'chevron-right'} size={18} />
							</button>
						</div>
						{days.map((day, index) => {
							const isToday = day === today;
							return (
								<h2
									key={day}
									id={`day-${day}`}
									aria-current={isToday ? 'date' : undefined}
									style={{gridColumnStart: index + 2}}
									className={cn(
										'border-b border-l border-line px-2 py-3 text-center text-sm uppercase',
										isToday ? 'bg-brand-50 font-semibold text-ink' : 'font-medium text-muted'
									)}
								>
									<span
										className={'sr-only'}
									>{`${WEEKDAYS_LONG[weekdayIndex(day)]}, ${dayLabel(day)}`}</span>
									<span aria-hidden>{`${WEEKDAYS_SHORT[weekdayIndex(day)]} ${dayNumber(day)}`}</span>
								</h2>
							);
						})}

						{!hasLessons ? (
							<div
								className={'col-span-full flex flex-col items-start gap-1 p-6 text-body'}
								style={{gridRow: 2}}
							>
								<p>{'На этой неделе занятий не нашлось.'}</p>
								<div className={'flex flex-wrap gap-x-6'}>
									{studio || direction ? (
										<button
											type={'button'}
											className={textButtonClass}
											onClick={() => updateFilters('', '')}
										>
											{'Сбросить фильтры'}
										</button>
									) : null}
									{canNext ? (
										<button
											type={'button'}
											className={textButtonClass}
											onClick={() => setWeekStart(addDays(weekStart, 7))}
										>
											{'Следующая неделя →'}
										</button>
									) : null}
								</div>
							</div>
						) : (
							<>
								<div
									className={'sticky left-0 z-20 bg-white'}
									style={{gridColumn: 1, gridRow: 2, height: bodyHeight}}
									aria-hidden
								>
									{hours.map((hour) => (
										<span
											key={hour}
											className={cn(
												'absolute inset-x-0 text-center text-sm text-muted tabular-nums',
												hour === startHour ? 'mt-1' : '-translate-y-1/2',
												hour === endHour && 'hidden'
											)}
											style={{top: (hour - startHour) * HOUR_PX}}
										>
											{`${String(hour).padStart(2, '0')}:00`}
										</span>
									))}
									{nowTop !== null && nowMin !== null ? (
										<span
											className={
												'absolute right-1 z-10 -translate-y-1/2 rounded-md border border-line bg-white px-1.5 text-xs font-semibold text-ink tabular-nums'
											}
											style={{top: nowTop}}
										>
											{nowTime}
										</span>
									) : null}
								</div>

								<div
									aria-hidden
									className={'pointer-events-none relative'}
									style={{gridColumn: '2 / -1', gridRow: 2, height: bodyHeight}}
								>
									{hours.slice(1, -1).map((hour) => (
										<div
											key={hour}
											className={'absolute inset-x-0 border-t border-line'}
											style={{top: (hour - startHour) * HOUR_PX}}
										/>
									))}
									{nowTop !== null ? (
										<div
											className={'absolute inset-x-0 z-10 border-t border-brand-700/25'}
											style={{top: nowTop}}
										/>
									) : null}
								</div>

								{days.map((day, index) => {
									const isToday = day === today;
									const layout = layouts[index];
									return (
										<ul
											key={day}
											aria-labelledby={`day-${day}`}
											data-today={isToday ? '' : undefined}
											data-busy={layout.clusters.length > 0 ? '' : undefined}
											className={cn('relative border-l border-line', isToday && 'bg-brand-50/40')}
											style={{
												gridColumnStart: index + 2,
												gridRow: 2,
												height: bodyHeight,
												backgroundImage: weekdayIndex(day) >= 5 ? HATCH : undefined
											}}
										>
											{layout.clusters.map((cluster) => {
												const lanes = cluster.items.map((item) => {
													const height = ((item.endMin - item.startMin) / 60) * HOUR_PX - 2;
													return (
														<li
															key={item.lesson.id}
															className={cn('absolute', cluster.lanes > 1 && 'lg:hidden')}
															style={{
																top: ((item.startMin - startHour * 60) / 60) * HOUR_PX,
																height,
																left: `calc(${(item.lane / item.lanes) * 100}% + 4px)`,
																width: `calc(${100 / item.lanes}% - 8px)`
															}}
														>
															<LessonCard
																lesson={item.lesson}
																height={height}
																ended={isEnded(item.lesson)}
																dayLabel={dayLabel(day)}
															/>
														</li>
													);
												});
												if (cluster.lanes === 1) {
													return lanes;
												}
												// Side-by-side lanes below lg (wide min-width columns); one grouped card from lg up, where lanes are too narrow.
												const height = ((cluster.endMin - cluster.startMin) / 60) * HOUR_PX - 2;
												return [
													...lanes,
													<li
														key={`group-${cluster.items[0].lesson.id}`}
														className={'absolute max-lg:hidden'}
														style={{
															top: ((cluster.startMin - startHour * 60) / 60) * HOUR_PX,
															height,
															left: 4,
															width: 'calc(100% - 8px)'
														}}
													>
														<GroupCard
															items={cluster.items}
															startMin={cluster.startMin}
															endMin={cluster.endMin}
															height={height}
															isEnded={(item) => isEnded(item.lesson)}
															dayLabel={dayLabel(day)}
														/>
													</li>
												];
											})}
											{isToday && nowTop !== null ? (
												<li
													aria-hidden
													className={
														'pointer-events-none absolute inset-x-0 z-10 h-0.5 bg-brand-700'
													}
													style={{top: nowTop - 1}}
												>
													<span
														className={
															'absolute -top-1 left-0 size-2.5 rounded-full bg-brand-700'
														}
													/>
													<span
														className={
															'absolute -top-1 right-0 size-2.5 rounded-full bg-brand-700'
														}
													/>
												</li>
											) : null}
										</ul>
									);
								})}
							</>
						)}
					</div>
				</div>
			</div>

			<p className={'text-sm text-muted'}>
				{`Обновлено ${moscowTime(new Date(schedule.generatedAt))}. Расписание может меняться — уточняйте у администратора.`}
			</p>
		</div>
	);
}
