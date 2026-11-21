// Data for the «Подберём занятие» block on the home page. The slug mapping is explicit (not derived from `category`)
// so editors decide which directions answer which interest.

import {directions} from './directions';
import {getDirection} from './index';

import type {TDirection} from './types';

export type TClassPickerAudienceId = 'child' | 'adult';

export type TClassPickerDirection = Pick<TDirection, 'slug' | 'path' | 'shortTitle' | 'excerpt' | 'cardImage'>;

export type TClassPickerInterest = {
	id: string;
	label: string;
	directions: TClassPickerDirection[];
};

export type TClassPickerOverview = {label: string; href: string};

export type TClassPickerAudience = {
	id: TClassPickerAudienceId;
	label: string;
	interests: TClassPickerInterest[];
	overview: TClassPickerOverview;
};

export type TClassPickerData = {
	audiences: TClassPickerAudience[];
};

type TInterestSource = {id: string; label: string; slugs: string[]};

type TAudienceSource = {
	id: TClassPickerAudienceId;
	label: string;
	interests: TInterestSource[];
	/** `slug`: the overview is a direction page (counted as covered); `href`: any other path. */
	overview: {label: string; slug?: string; href?: string};
};

const audienceSources: TAudienceSource[] = [
	{
		id: 'child',
		label: 'Для ребёнка',
		interests: [
			{
				id: 'stage',
				label: 'Сцена и музыка',
				slugs: ['vokal', 'muzykalnye-instrumenty', 'teatr', 'tancy', 'shkola-modeley']
			},
			{id: 'art', label: 'Рисование и ремёсла', slugs: ['risovanie', 'art-masterskaya']},
			{id: 'logic', label: 'Техника и логика', slugs: ['robototehnika', 'megavolt', 'shahmaty']},
			{
				id: 'study',
				label: 'Учёба и речь',
				slugs: ['podgotovka-k-shkole', 'yazykovaya-shkola', 'logoped', 'prodlenka', 'semejnaya-shkola']
			}
		],
		overview: {label: 'Все направления для детей →', href: '/napravleniya/'}
	},
	{
		id: 'adult',
		label: 'Для взрослого',
		interests: [
			{id: 'dance', label: 'Танцы', slugs: ['bachata']},
			{id: 'body', label: 'Фитнес и растяжка', slugs: ['barre-fitnes', 'joga', 'pilates']},
			{id: 'personal', label: 'Индивидуально', slugs: ['individualnye-zanyatiya-dlya-vzroslyh']}
		],
		overview: {label: 'Все занятия для взрослых →', slug: 'dlya-vzroslyh'}
	}
];

function pickDirection(slug: string, seen: Set<string>): TClassPickerDirection {
	const direction = getDirection(slug);
	if (!direction) throw new Error(`classPicker: unknown direction slug "${slug}"`);
	if (seen.has(slug)) throw new Error(`classPicker: direction "${slug}" is listed more than once`);
	seen.add(slug);
	const {path, shortTitle, excerpt, cardImage} = direction;
	return {slug, path, shortTitle, excerpt, cardImage};
}

export function getClassPickerData(): TClassPickerData {
	const seen = new Set<string>();
	const audiences = audienceSources.map((source): TClassPickerAudience => {
		const interests = source.interests.map(
			(interest): TClassPickerInterest => ({
				id: interest.id,
				label: interest.label,
				directions: interest.slugs.map((slug) => pickDirection(slug, seen))
			})
		);
		const {label, slug, href} = source.overview;
		let overviewHref = href;
		if (slug) {
			overviewHref = pickDirection(slug, seen).path;
		}
		if (!overviewHref) throw new Error(`classPicker: overview of "${source.id}" has no target`);
		return {id: source.id, label: source.label, interests, overview: {label, href: overviewHref}};
	});
	const missing = directions.filter((direction) => !seen.has(direction.slug)).map((direction) => direction.slug);
	if (missing.length > 0) throw new Error(`classPicker: directions not covered: ${missing.join(', ')}`);
	return {audiences};
}
