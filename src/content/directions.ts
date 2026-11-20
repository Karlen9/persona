// Generated from the personamodel.ru crawl of 2026-11-20 by scripts/generate_ts.py.
// Copy is verbatim; fix it here (or in the CMS that replaces this module).

import {shkolaModeley} from './directions/shkola-modeley';
import {tancy} from './directions/tancy';
import {vokal} from './directions/vokal';
import {teatr} from './directions/teatr';
import {risovanie} from './directions/risovanie';
import {artMasterskaya} from './directions/art-masterskaya';
import {shahmaty} from './directions/shahmaty';
import {megavolt} from './directions/megavolt';
import {robototehnika} from './directions/robototehnika';
import {podgotovkaKShkole} from './directions/podgotovka-k-shkole';
import {yazykovayaShkola} from './directions/yazykovaya-shkola';
import {logoped} from './directions/logoped';
import {muzykalnyeInstrumenty} from './directions/muzykalnye-instrumenty';
import {dlyaVzroslyh} from './directions/dlya-vzroslyh';
import {pilates} from './directions/pilates';
import {joga} from './directions/joga';
import {barreFitnes} from './directions/barre-fitnes';
import {bachata} from './directions/bachata';
import {individualnyeZanyatiyaDlyaVzroslyh} from './directions/individualnye-zanyatiya-dlya-vzroslyh';
import {semejnayaShkola} from './directions/semejnaya-shkola';
import {prodlenka} from './directions/prodlenka';

import type {TAudience, TDirection, TDirectionCategory, TDirectionPageTemplate, TDirectionsIndexPage} from './types';

export const directions: TDirection[] = [
	shkolaModeley,
	tancy,
	vokal,
	teatr,
	risovanie,
	artMasterskaya,
	shahmaty,
	megavolt,
	robototehnika,
	podgotovkaKShkole,
	yazykovayaShkola,
	logoped,
	muzykalnyeInstrumenty,
	dlyaVzroslyh,
	pilates,
	joga,
	barreFitnes,
	bachata,
	individualnyeZanyatiyaDlyaVzroslyh,
	semejnayaShkola,
	prodlenka
];

export const audienceLabels: Record<TAudience, string> = {
	kids: 'Для детей',
	adults: 'Для взрослых',
	family: 'Семья'
};

export const directionCategoryLabels: Record<TDirectionCategory, string> = {
	creativity: 'Творчество',
	dance: 'Танцы',
	development: 'Развитие',
	languages: 'Языки',
	fitness: 'Фитнес',
	school: 'Школа',
	individual: 'Индивидуальные занятия'
};

/** Chrome shared by every direction page on the live site (buttons under the article and the page tail). */
export const directionPageTemplate: TDirectionPageTemplate = {
	cta: {
		label: 'Записаться',
		href: '#form'
	},
	scheduleButton: {
		label: 'Расписание',
		href: '/raspisanie/'
	},
	navLinks: [
		{
			label: 'Педагоги',
			href: '/komanda/'
		},
		{
			label: 'Расписание',
			href: '/raspisanie/'
		},
		{
			label: 'Выступления',
			href: '/#vistuplenia'
		},
		{
			label: 'Тарифы',
			href: '/tarify/'
		}
	],
	related: {
		heading: 'ДОПОЛНИТЕЛЬНЫЕ НАПРАВЛЕНИЯ НАШЕЙ ТВОРЧЕСКОЙ СТУДИИ',
		subheading: 'Наши направления',
		slugs: ['shkola-modeley', 'tancy', 'vokal']
	}
};

export const directionsIndexPage: TDirectionsIndexPage = {
	path: '/napravleniya/',
	h1: 'Наши направления',
	cta: {
		label: 'Записаться',
		href: '#form'
	},
	listedSlugs: [
		'podgotovka-k-shkole',
		'shahmaty',
		'teatr',
		'barre-fitnes',
		'semejnaya-shkola',
		'prodlenka',
		'yazykovaya-shkola',
		'muzykalnye-instrumenty',
		'art-masterskaya',
		'megavolt',
		'logoped',
		'joga',
		'risovanie',
		'shkola-modeley',
		'tancy',
		'vokal'
	],
	seo: {
		// TODO(content): The live meta description of the catalogue is a broken auto-extract («PersOna PersOna … Наши направления Записаться»); kept verbatim, needs a hand-written one.
		title: 'Наши направления | PersonaModel',
		description: 'PersOna PersOna PersOna PersOna PersOna PersOna PersOna PersOna Наши направления Записаться'
	},
	oldPaths: ['/brunches/', '/areas/', '/studios/'],
	lastModified: '2026-02-25T16:04:22Z'
};

/** Menu groups: «Для детей», «Для взрослых», family (family school, after-school care). */
export function getDirectionsByAudience(audience: TAudience): TDirection[] {
	return directions.filter((direction) => direction.audience === audience);
}

export function getDirectionsByCategory(category: TDirectionCategory): TDirection[] {
	return directions.filter((direction) => direction.category === category);
}
