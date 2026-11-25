const MONTHS_GENITIVE = [
	'января',
	'февраля',
	'марта',
	'апреля',
	'мая',
	'июня',
	'июля',
	'августа',
	'сентября',
	'октября',
	'ноября',
	'декабря'
];

export const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
export const WEEKDAYS_LONG = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export function monthGenitive(monthIndex: number): string {
	return MONTHS_GENITIVE[monthIndex] ?? '';
}

/** Russian plural for «занятие»: 1 занятие, 2-4 занятия, 5+ занятий. */
export function pluralLessons(count: number): string {
	const mod10 = count % 10;
	const mod100 = count % 100;
	if (mod10 === 1 && mod100 !== 11) {
		return 'занятие';
	}
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
		return 'занятия';
	}
	return 'занятий';
}

const MONTHS_NOMINATIVE = [
	'январь',
	'февраль',
	'март',
	'апрель',
	'май',
	'июнь',
	'июль',
	'август',
	'сентябрь',
	'октябрь',
	'ноябрь',
	'декабрь'
];
const MONTHS_SHORT = ['янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'];

function monthOf(ymd: string): number {
	return Number(ymd.slice(5, 7)) - 1;
}

/** `Ноябрь 2026`, or `Ноябрь – декабрь 2026` when the week crosses a month boundary. */
export function formatMonthTitle(first: string, last: string): string {
	const firstName = MONTHS_NOMINATIVE[monthOf(first)] ?? '';
	const title = monthOf(first) === monthOf(last) ? firstName : `${firstName} – ${MONTHS_NOMINATIVE[monthOf(last)]}`;
	return `${title.charAt(0).toUpperCase()}${title.slice(1)} ${last.slice(0, 4)}`;
}

/** `23 – 28 нояб. 2026` or `30 нояб. – 5 дек. 2026`. */
export function formatRange(first: string, last: string): string {
	const firstDay = Number(first.slice(8, 10));
	const lastDay = Number(last.slice(8, 10));
	const year = last.slice(0, 4);
	if (monthOf(first) === monthOf(last)) {
		return `${firstDay} – ${lastDay} ${MONTHS_SHORT[monthOf(last)]} ${year}`;
	}
	return `${firstDay} ${MONTHS_SHORT[monthOf(first)]} – ${lastDay} ${MONTHS_SHORT[monthOf(last)]} ${year}`;
}

/** Russian plural for «место»: 1 место, 2-4 места, 5+ мест. */
export function pluralSeats(count: number): string {
	const mod10 = count % 10;
	const mod100 = count % 100;
	if (mod10 === 1 && mod100 !== 11) {
		return 'место';
	}
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
		return 'места';
	}
	return 'мест';
}
