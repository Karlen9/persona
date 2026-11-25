// Pure date helpers in the Europe/Moscow timezone. `YYYY-MM-DD` strings are treated as calendar dates (UTC math).

export const MOSCOW_TZ = 'Europe/Moscow';

const dateFormat = new Intl.DateTimeFormat('en-CA', {
	timeZone: MOSCOW_TZ,
	year: 'numeric',
	month: '2-digit',
	day: '2-digit'
});

const timeFormat = new Intl.DateTimeFormat('en-GB', {
	timeZone: MOSCOW_TZ,
	hour: '2-digit',
	minute: '2-digit',
	hourCycle: 'h23'
});

/** `YYYY-MM-DD` of the given instant in Moscow. */
export function moscowDate(now: Date = new Date()): string {
	return dateFormat.format(now);
}

/** `HH:MM` of the given instant in Moscow. */
export function moscowTime(now: Date = new Date()): string {
	return timeFormat.format(now);
}

function toUtc(ymd: string): Date {
	const [year, month, day] = ymd.split('-').map(Number);
	return new Date(Date.UTC(year, month - 1, day));
}

export function addDays(ymd: string, days: number): string {
	const date = toUtc(ymd);
	date.setUTCDate(date.getUTCDate() + days);
	return date.toISOString().slice(0, 10);
}

/** 0 = Monday ... 6 = Sunday. */
export function weekdayIndex(ymd: string): number {
	return (toUtc(ymd).getUTCDay() + 6) % 7;
}

export function startOfWeek(ymd: string): string {
	return addDays(ymd, -weekdayIndex(ymd));
}

export function dayNumber(ymd: string): number {
	return Number(ymd.slice(8, 10));
}

export function monthIndex(ymd: string): number {
	return Number(ymd.slice(5, 7)) - 1;
}
