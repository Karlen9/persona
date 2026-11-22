export type TIssue = {
	number: string;
	monthLabel: string;
	isoMonth: string;
};

const formatter = new Intl.DateTimeFormat('ru-RU', {month: 'long', year: 'numeric', timeZone: 'Europe/Moscow'});
const numericFormatter = new Intl.DateTimeFormat('en-GB', {
	month: '2-digit',
	year: 'numeric',
	timeZone: 'Europe/Moscow'
});

/** Issue of the "magazine" for the given moment (Moscow time). The home page is prerendered, so it freezes at build time. */
export function getIssue(date: Date = new Date()): TIssue {
	const parts = formatter.formatToParts(date);
	const month = parts.find((part) => part.type === 'month')?.value ?? '';
	const year = parts.find((part) => part.type === 'year')?.value ?? '';
	const numeric = numericFormatter.formatToParts(date);
	const monthNumber = numeric.find((part) => part.type === 'month')?.value ?? '01';
	const isoYear = numeric.find((part) => part.type === 'year')?.value ?? year;
	const capitalised = month.charAt(0).toLocaleUpperCase('ru-RU') + month.slice(1);

	return {
		number: monthNumber,
		monthLabel: `${capitalised} ${year}`,
		isoMonth: `${isoYear}-${monthNumber}`
	};
}
