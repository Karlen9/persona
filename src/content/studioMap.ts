// Zones of the static studio map on the home page. The picture itself is rendered once (see studioMapShapes.generated.ts
// for the polygon of every zone in image coordinates); this module only says which direction belongs to which zone.

import {directions} from './directions';
import {getDirection} from './index';
import {studioMapImage, studioMapShapes} from './studioMapShapes.generated';

import type {TDirection} from './types';
import type {TStudioMapShape} from './studioMapShapes.generated';

export type TStudioZoneId = 'reception' | 'stage' | 'dance' | 'fitness' | 'art' | 'robots' | 'classes' | 'lounge';

type TStudioZoneMeta = {
	id: TStudioZoneId;
	label: string;
	/** Colour of the floor patch in the picture; reused for the mobile list dots. */
	patchColor: string;
};

export type TStudioDirection = Pick<TDirection, 'slug' | 'path' | 'shortTitle'>;

export type TStudioZone = TStudioZoneMeta &
	TStudioMapShape & {
		/** The reception is not a direction: it opens the contacts card. */
		kind: 'directions' | 'contacts';
		directions: TStudioDirection[];
	};

export type TStudioMapData = {
	image: typeof studioMapImage;
	zones: TStudioZone[];
};

/** In reading order: back row left to right, the middle row, then the front row. */
const zoneMeta: TStudioZoneMeta[] = [
	{id: 'stage', label: 'Сцена', patchColor: '#9a2a4d'},
	{id: 'dance', label: 'Танцевальный зал', patchColor: '#d9a566'},
	{id: 'classes', label: 'Классы', patchColor: '#f2c66d'},
	{id: 'fitness', label: 'Фитнес-студия', patchColor: '#a9cf9f'},
	{id: 'reception', label: 'Ресепшн', patchColor: '#5bb5a2'},
	{id: 'robots', label: 'Мастерская роботов', patchColor: '#8fb4d8'},
	{id: 'art', label: 'Арт-мастерская', patchColor: '#f4a68a'},
	{id: 'lounge', label: 'Гостиная', patchColor: '#b9aee6'}
];

/** Direction slug -> zone. Every direction must appear exactly once. */
const zoneAssignment: {slug: string; zone: TStudioZoneId}[] = [
	{slug: 'vokal', zone: 'stage'},
	{slug: 'muzykalnye-instrumenty', zone: 'stage'},
	{slug: 'teatr', zone: 'stage'},
	{slug: 'tancy', zone: 'dance'},
	{slug: 'bachata', zone: 'dance'},
	{slug: 'shkola-modeley', zone: 'dance'},
	{slug: 'pilates', zone: 'fitness'},
	{slug: 'joga', zone: 'fitness'},
	{slug: 'barre-fitnes', zone: 'fitness'},
	{slug: 'risovanie', zone: 'art'},
	{slug: 'art-masterskaya', zone: 'art'},
	{slug: 'robototehnika', zone: 'robots'},
	{slug: 'megavolt', zone: 'robots'},
	{slug: 'shahmaty', zone: 'classes'},
	{slug: 'podgotovka-k-shkole', zone: 'classes'},
	{slug: 'yazykovaya-shkola', zone: 'classes'},
	{slug: 'logoped', zone: 'classes'},
	{slug: 'prodlenka', zone: 'classes'},
	{slug: 'semejnaya-shkola', zone: 'lounge'},
	{slug: 'dlya-vzroslyh', zone: 'lounge'},
	{slug: 'individualnye-zanyatiya-dlya-vzroslyh', zone: 'lounge'}
];

/**
 * Joins zones with their directions and shapes. Throws on an unknown slug, on a duplicated assignment and on a
 * direction without a zone, so typos and missed directions surface at build time.
 */
export function getStudioMapData(): TStudioMapData {
	const knownZones = new Set<string>(zoneMeta.map((zone) => zone.id));
	const bySlug = new Map<string, TStudioDirection>();
	const byZone = new Map<TStudioZoneId, TStudioDirection[]>();
	for (const {slug, zone} of zoneAssignment) {
		const direction = getDirection(slug);
		if (!direction) throw new Error(`studioMap: unknown direction slug "${slug}"`);
		if (bySlug.has(slug)) throw new Error(`studioMap: duplicate assignment for direction "${slug}"`);
		if (!knownZones.has(zone)) throw new Error(`studioMap: direction "${slug}" has unknown zone "${zone}"`);
		const item: TStudioDirection = {slug: direction.slug, path: direction.path, shortTitle: direction.shortTitle};
		bySlug.set(slug, item);
		byZone.set(zone, [...(byZone.get(zone) ?? []), item]);
	}
	const missing = directions.filter((direction) => !bySlug.has(direction.slug)).map((direction) => direction.slug);
	if (missing.length > 0) throw new Error(`studioMap: directions without a zone: ${missing.join(', ')}`);
	return {
		image: studioMapImage,
		zones: zoneMeta.map((meta) => ({
			...meta,
			...studioMapShapes[meta.id],
			kind: meta.id === 'reception' ? 'contacts' : 'directions',
			directions: byZone.get(meta.id) ?? []
		}))
	};
}
