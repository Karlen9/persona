// Floor plan and hotspots for the interactive 3D agency map on the home page.
// Pure data: no three.js imports. Units are roughly metres. One big open-plan floor (about 44 x 30), no interior
// walls: activities are grouped into zones painted on the floor, with two back walls (-x and -z) behind them.

import {directions} from './directions';
import {getDirection} from './index';

import type {TDirection} from './types';

export type TAgencyZoneId = 'reception' | 'stage' | 'dance' | 'fitness' | 'art' | 'robots' | 'classes' | 'lounge';

export type TAgencyFloor = {
	/** Floor footprint: [width (x), depth (z)], centred on the origin. */
	size: [number, number];
	/** Visible thickness of the slab. */
	thickness: number;
	floorColor: string;
	edgeColor: string;
	wallColor: string;
	wallHeight: number;
};

export type TAgencyZone = {
	id: TAgencyZoneId;
	label: string;
	/** Zone centre on the floor: [x, z]. */
	position: [number, number];
	/** Footprint: [width (x), depth (z)]. For a round zone both values are the diameter. */
	size: [number, number];
	shape: 'rect' | 'round';
	/** Colour of the rug / floor patch. */
	patchColor: string;
	/** Colour of the zone name painted on the patch. */
	labelColor: string;
	/** Height of a raised platform (stage). Props in the zone stand on top of it. */
	elevation?: number;
};

export type TAgencyPropKind =
	| 'microphone'
	| 'piano'
	| 'curtainStage'
	| 'danceMirror'
	| 'danceCouple'
	| 'catwalk'
	| 'reformer'
	| 'yogaMat'
	| 'barre'
	| 'easel'
	| 'potteryWheel'
	| 'robot'
	| 'teslaCoil'
	| 'chessboard'
	| 'schoolDesks'
	| 'globe'
	| 'mirrorDesk'
	| 'lunchTable'
	| 'familySofa'
	| 'armchairs'
	| 'deskLamp'
	| 'reception';

export type TAgencyHotspot = {
	/** Direction slug (see `directions.ts`). Exactly one hotspot per direction. */
	slug: string;
	zone: TAgencyZoneId;
	kind: TAgencyPropKind;
	/** World position [x, y, z]. */
	position: [number, number, number];
	rotationY?: number;
	scale?: number;
};

/** A tappable prop that is not a direction (the reception desk opens the contacts card). */
export type TAgencySpecialHotspot = {
	id: 'reception';
	zone: TAgencyZoneId;
	kind: TAgencyPropKind;
	action: 'contacts';
	/** Card title. */
	label: string;
	/** Hover label on desktop. */
	hoverLabel: string;
	position: [number, number, number];
	rotationY?: number;
	scale?: number;
	/** Radius of the invisible hit cylinder and highlight ring (before `scale`). */
	hitRadius?: number;
};

export type TAgencyDecorKind = 'plant' | 'bench' | 'lowShelf' | 'deskRows' | 'workbench' | 'softSeat' | 'floorLamp';

/** Non-interactive set dressing: plants, benches and low shelving that divide the zones. */
export type TAgencyDecor = {
	kind: TAgencyDecorKind;
	/** Floor position [x, z]. */
	position: [number, number];
	rotationY?: number;
	scale?: number;
};

export type TAgencyDirectionInfo = Pick<TDirection, 'slug' | 'path' | 'title' | 'shortTitle' | 'excerpt'>;

export type TAgencyMapItem = TAgencyHotspot & {direction: TAgencyDirectionInfo};

export type TAgencyBounds = {minX: number; maxX: number; minZ: number; maxZ: number};

export type TAgencyMapData = {
	floor: TAgencyFloor;
	zones: TAgencyZone[];
	hotspots: TAgencyMapItem[];
	specialHotspots: TAgencySpecialHotspot[];
	decor: TAgencyDecor[];
	bounds: TAgencyBounds;
};

export const agencyFloor: TAgencyFloor = {
	size: [44, 30],
	thickness: 0.5,
	floorColor: '#f2e1bf',
	edgeColor: '#fbf7f0',
	wallColor: '#cf5a47',
	wallHeight: 3.5
};

export const agencyZones: TAgencyZone[] = [
	{
		id: 'reception',
		label: 'Ресепшн',
		position: [0, 0],
		size: [9.6, 9.6],
		shape: 'round',
		patchColor: '#5bb5a2',
		labelColor: '#ffffff'
	},
	{
		id: 'stage',
		label: 'Сцена',
		position: [-17, -10.4],
		size: [8.6, 7.4],
		shape: 'rect',
		patchColor: '#9a2a4d',
		labelColor: '#f9d3de',
		elevation: 0.4
	},
	{
		id: 'dance',
		label: 'Танцевальный зал',
		position: [-3, -10.4],
		size: [13, 7.4],
		shape: 'rect',
		patchColor: '#d9a566',
		labelColor: '#7d4f22'
	},
	{
		id: 'fitness',
		label: 'Фитнес-студия',
		position: [-17.2, 1.5],
		size: [8.2, 10],
		shape: 'rect',
		patchColor: '#a9cf9f',
		labelColor: '#34592f'
	},
	{
		id: 'classes',
		label: 'Классы',
		position: [13, -9.25],
		size: [13, 8.5],
		shape: 'rect',
		patchColor: '#f2c66d',
		labelColor: '#74500f'
	},
	{
		id: 'robots',
		label: 'Мастерская роботов',
		position: [14, 1.25],
		size: [10, 8],
		shape: 'rect',
		patchColor: '#8fb4d8',
		labelColor: '#1f4468'
	},
	{
		id: 'art',
		label: 'Арт-мастерская',
		position: [-8, 9.5],
		size: [9, 7],
		shape: 'rect',
		patchColor: '#f4a68a',
		labelColor: '#74291a'
	},
	{
		id: 'lounge',
		label: 'Гостиная',
		position: [11, 10.8],
		size: [16, 7],
		shape: 'rect',
		patchColor: '#b9aee6',
		labelColor: '#3c3079'
	}
];

const zoneById = new Map(agencyZones.map((zone) => [zone.id, zone]));

/** Position relative to the zone centre, converted to world coordinates (on top of a raised zone). */
function inZone(zoneId: TAgencyZoneId, dx: number, dz: number): [number, number, number] {
	const zone = zoneById.get(zoneId);
	if (!zone) throw new Error(`agencyMap: unknown zone "${zoneId}"`);
	return [zone.position[0] + dx, zone.elevation ?? 0, zone.position[1] + dz];
}

export const agencyHotspots: TAgencyHotspot[] = [
	// Сцена (back corner, raised platform)
	{slug: 'vokal', zone: 'stage', kind: 'microphone', position: inZone('stage', 2.4, 2.4)},
	{slug: 'muzykalnye-instrumenty', zone: 'stage', kind: 'piano', position: inZone('stage', 2.4, -1.6)},
	{slug: 'teatr', zone: 'stage', kind: 'curtainStage', position: inZone('stage', -2, -1.1)},
	// Танцевальный зал (back wall, mirror on the wall)
	{slug: 'tancy', zone: 'dance', kind: 'danceMirror', position: inZone('dance', -3, -4)},
	{slug: 'bachata', zone: 'dance', kind: 'danceCouple', position: inZone('dance', -3.4, 0.9)},
	{slug: 'shkola-modeley', zone: 'dance', kind: 'catwalk', position: inZone('dance', 1.8, 1.1)},
	// Фитнес-студия (left wall, barre on the wall)
	{slug: 'pilates', zone: 'fitness', kind: 'reformer', position: inZone('fitness', 0.4, -3)},
	{slug: 'joga', zone: 'fitness', kind: 'yogaMat', position: inZone('fitness', 0.4, 0.5)},
	{
		slug: 'barre-fitnes',
		zone: 'fitness',
		kind: 'barre',
		position: inZone('fitness', -3.45, 2.3),
		rotationY: Math.PI / 2
	},
	// Арт-мастерская
	{slug: 'risovanie', zone: 'art', kind: 'easel', position: inZone('art', -2.2, -0.6)},
	{slug: 'art-masterskaya', zone: 'art', kind: 'potteryWheel', position: inZone('art', 2, 0.2)},
	// Мастерская роботов
	{slug: 'robototehnika', zone: 'robots', kind: 'robot', position: inZone('robots', -2.6, -1.8)},
	{slug: 'megavolt', zone: 'robots', kind: 'teslaCoil', position: inZone('robots', 2.4, -1.6)},
	// Классы
	{slug: 'shahmaty', zone: 'classes', kind: 'chessboard', position: inZone('classes', -3.8, -2.4)},
	{slug: 'podgotovka-k-shkole', zone: 'classes', kind: 'schoolDesks', position: inZone('classes', 3.5, -2.1)},
	{slug: 'yazykovaya-shkola', zone: 'classes', kind: 'globe', position: inZone('classes', -0.5, -2.8)},
	{slug: 'logoped', zone: 'classes', kind: 'mirrorDesk', position: inZone('classes', -3.8, 2.3)},
	{slug: 'prodlenka', zone: 'classes', kind: 'lunchTable', position: inZone('classes', 0.5, 1.7)},
	// Гостиная (front edge)
	{slug: 'semejnaya-shkola', zone: 'lounge', kind: 'familySofa', position: inZone('lounge', -4.5, -1.7)},
	{slug: 'dlya-vzroslyh', zone: 'lounge', kind: 'armchairs', position: inZone('lounge', 1, 0.6)},
	{
		slug: 'individualnye-zanyatiya-dlya-vzroslyh',
		zone: 'lounge',
		kind: 'deskLamp',
		position: inZone('lounge', 5.8, -1)
	}
];

/** Tappable props that are not directions. Excluded from the "one hotspot per direction" validation. */
export const agencySpecialHotspots: TAgencySpecialHotspot[] = [
	{
		id: 'reception',
		zone: 'reception',
		kind: 'reception',
		action: 'contacts',
		label: 'Ресепшн',
		hoverLabel: 'Ресепшн · Контакты',
		position: inZone('reception', 0, 0),
		rotationY: Math.PI / 4,
		scale: 1.15,
		hitRadius: 2.7
	}
];

export const agencyDecor: TAgencyDecor[] = [
	// Dividers between the back-row zones
	{kind: 'lowShelf', position: [-11.1, -10.4], rotationY: Math.PI / 2},
	{kind: 'plant', position: [-11.1, -13.4]},
	{kind: 'plant', position: [-11.1, -7.4]},
	{kind: 'plant', position: [4.9, -13.4]},
	{kind: 'lowShelf', position: [4.9, -9.8], rotationY: Math.PI / 2},
	{kind: 'plant', position: [4.9, -6.4]},
	// Between the back row and the reception ring
	{kind: 'plant', position: [-9, -5.6]},
	{kind: 'bench', position: [-4, -5.4]},
	{kind: 'plant', position: [0.6, -5.6]},
	{kind: 'plant', position: [-20.6, -5.2]},
	{kind: 'bench', position: [-17.2, -5.2]},
	{kind: 'plant', position: [-13.8, -5.2]},
	// Between classes, robotics and the lounge
	{kind: 'plant', position: [7.6, -3.9]},
	{kind: 'lowShelf', position: [13, -3.9]},
	{kind: 'plant', position: [19.2, -3.9]},
	{kind: 'plant', position: [9, 6.3]},
	{kind: 'bench', position: [14, 6.3]},
	{kind: 'plant', position: [19.4, 6.3]},
	// Between the art zone, fitness and the lounge
	{kind: 'plant', position: [-13.2, 7.9]},
	{kind: 'lowShelf', position: [-0.3, 10.8], rotationY: Math.PI / 2},
	{kind: 'plant', position: [-0.3, 7.8]},
	{kind: 'plant', position: [-0.3, 13.6]},
	// Front-left and back-right corners
	{kind: 'plant', position: [-20.2, 9.6]},
	{kind: 'bench', position: [-17, 13.8]},
	{kind: 'plant', position: [-13.8, 13.6]},
	{kind: 'plant', position: [-20.6, 13.6]},
	{kind: 'plant', position: [21, -13.6]},
	{kind: 'plant', position: [21, -5]},
	// Dressing inside zones
	{kind: 'deskRows', position: [17.6, -7]},
	{kind: 'workbench', position: [14.2, 3.4]},
	{kind: 'softSeat', position: [4.8, 12.6], rotationY: -Math.PI / 5},
	{kind: 'softSeat', position: [18.4, 12.9], rotationY: Math.PI / 5},
	{kind: 'floorLamp', position: [6.4, 13.4]},
	{kind: 'floorLamp', position: [16.6, 13.6]}
];

export const agencyBounds: TAgencyBounds = {
	minX: -agencyFloor.size[0] / 2,
	maxX: agencyFloor.size[0] / 2,
	minZ: -agencyFloor.size[1] / 2,
	maxZ: agencyFloor.size[1] / 2
};

/**
 * Joins hotspots with their directions. Throws on an unknown slug, on a duplicated hotspot and on a direction
 * without a hotspot, so typos and missed directions surface at build time. Special hotspots (reception) are not
 * directions and are passed through untouched.
 */
export function getAgencyMapData(): TAgencyMapData {
	const seen = new Set<string>();
	const hotspots = agencyHotspots.map((hotspot): TAgencyMapItem => {
		const direction = getDirection(hotspot.slug);
		if (!direction) throw new Error(`agencyMap: hotspot references unknown direction slug "${hotspot.slug}"`);
		if (seen.has(hotspot.slug)) throw new Error(`agencyMap: duplicate hotspot for direction "${hotspot.slug}"`);
		if (!zoneById.has(hotspot.zone)) throw new Error(`agencyMap: hotspot "${hotspot.slug}" has unknown zone`);
		seen.add(hotspot.slug);
		const {slug, path, title, shortTitle, excerpt} = direction;
		return {...hotspot, direction: {slug, path, title, shortTitle, excerpt}};
	});
	const missing = directions.filter((direction) => !seen.has(direction.slug)).map((direction) => direction.slug);
	if (missing.length > 0) throw new Error(`agencyMap: directions without a hotspot: ${missing.join(', ')}`);
	return {
		floor: agencyFloor,
		zones: agencyZones,
		hotspots,
		specialHotspots: agencySpecialHotspots,
		decor: agencyDecor,
		bounds: agencyBounds
	};
}
