import {formatPrice} from '@/lib/format';

import {priceList} from './pricing';

export type TCoverEntryId = 'napravleniya' | 'studii' | 'raspisanie' | 'tarify' | 'o-nas';

export type TCoverEntry = {
	id: TCoverEntryId;
	/** Where the line sits on the cover poster: right column or bottom-left column. */
	slot: 'right' | 'left';
	number: string;
	label: string;
	headline: string;
	teaser: string;
	href: string;
	page: number;
};

export type TCoverStory = {
	kicker: string;
	/** Two display lines, rendered with a line break between them. */
	titleLines: [string, string];
	teaser: string;
	href: string;
	page: number;
};

export const coverEntries: TCoverEntry[] = [
	{
		id: 'napravleniya',
		slot: 'right',
		number: '01',
		label: 'Направления',
		headline: '20+ направлений под одной крышей',
		teaser: 'Подиум, танцы, вокал, театр, шахматы и робототехника — для детей и взрослых',
		href: '/napravleniya/',
		page: 12
	},
	{
		id: 'studii',
		slot: 'right',
		number: '02',
		label: 'Студии',
		headline: 'Четыре студии в Москве',
		teaser: 'Мичуринский проспект, Солнцево, Славянский бульвар и Профсоюзная',
		href: '/studii/',
		page: 28
	},
	{
		id: 'raspisanie',
		slot: 'right',
		number: '03',
		label: 'Расписание',
		headline: 'Вся неделя на одной странице',
		teaser: 'Расписание занятий всех студий и направлений',
		href: '/raspisanie/',
		page: 36
	},
	{
		id: 'tarify',
		slot: 'left',
		number: '04',
		label: 'Цены',
		headline: `Пробное занятие — ${formatPrice(priceList.trialLesson.priceRub)}`,
		teaser: 'Абонементы, разовые и индивидуальные занятия',
		href: '/tarify/',
		page: 44
	},
	{
		id: 'o-nas',
		slot: 'left',
		number: '05',
		label: 'О центре',
		headline: 'Более 20 лет раскрываем таланты',
		teaser: 'Кто мы, чему учим и ответы на частые вопросы родителей',
		href: '/o-nas/',
		page: 52
	}
];

export const coverStory: TCoverStory = {
	kicker: 'Главная тема',
	titleLines: ['Маленькие мисс', 'и мистер Россия'],
	teaser: 'Всероссийский конкурс с 20-летней историей для детей от 4 до 17 лет',
	href: '/festivali/',
	page: 64
};

export function getCoverEntry(id: TCoverEntryId): TCoverEntry {
	const entry = coverEntries.find((item) => item.id === id);
	if (!entry) throw new Error(`cover.ts: unknown cover entry "${id}"`);
	return entry;
}

export function getNextCoverEntry(id: TCoverEntryId): TCoverEntry {
	const index = coverEntries.findIndex((item) => item.id === id);
	if (index === -1) throw new Error(`cover.ts: unknown cover entry "${id}"`);
	return coverEntries[(index + 1) % coverEntries.length] as TCoverEntry;
}
