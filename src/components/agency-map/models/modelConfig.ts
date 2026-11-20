// Table of glTF models in public/models/. Source files have inconsistent units, origins and orientation, so every
// entry says how to normalise one: an optional pre-rotation (radians, applied before measuring), then a uniform scale
// that makes one dimension of the bounding box match `fit`, centred on x/z with the bottom on y = 0.
// `offset` then nudges the normalised model inside its parent. `animation` is a clip played when animation is on.

export type TModelFit = {height: number} | {maxSide: number} | {width: number};

export type TModelConfig = {
	url: string;
	fit: TModelFit;
	rotation?: [number, number, number];
	offset?: [number, number, number];
	animation?: string;
};

const HALF_PI = Math.PI / 2;

export const modelConfig = {
	microphone: {url: '/models/microphone.glb', fit: {height: 1.8}},
	piano: {url: '/models/piano.glb', fit: {maxSide: 2.6}, rotation: [0, -HALF_PI, 0]},
	curtains: {url: '/models/curtain-stage.glb', fit: {height: 3.0}},
	chessSet: {url: '/models/chessboard.glb', fit: {maxSide: 1.4}},
	easel: {url: '/models/easel.glb', fit: {height: 2.0}},
	clayPot: {url: '/models/pottery-wheel.glb', fit: {maxSide: 0.9}},
	robot: {url: '/models/robot.glb', fit: {height: 1.8}, animation: 'RobotArmature|Robot_Idle'},
	microscope: {url: '/models/tesla-coil.glb', fit: {height: 0.75}},
	speaker: {url: '/models/disco-ball.glb', fit: {height: 1.2}},
	yogaMat: {url: '/models/yoga-mat.glb', fit: {maxSide: 2.3}},
	barre: {url: '/models/barre.glb', fit: {maxSide: 3.9}},
	schoolDesk: {url: '/models/school-desk.glb', fit: {height: 1.1}},
	globe: {url: '/models/globe.glb', fit: {height: 0.9}},
	mirror: {url: '/models/mirror.glb', fit: {height: 1.9}},
	lunchTable: {url: '/models/lunch-table.glb', fit: {height: 1.25}},
	sofa: {url: '/models/family-sofa.glb', fit: {maxSide: 2.4}},
	ottoman: {url: '/models/cushion.glb', fit: {maxSide: 0.8}},
	coffeeTable: {url: '/models/coffee-table.glb', fit: {maxSide: 1.1}},
	armchair: {url: '/models/armchair.glb', fit: {maxSide: 1.2}},
	roundTable: {url: '/models/table-round.glb', fit: {maxSide: 0.9}},
	deskLamp: {url: '/models/desk-lamp.glb', fit: {height: 0.8}},
	plantLarge: {url: '/models/plant-large.glb', fit: {height: 1.5}},
	plantSmall: {url: '/models/plant-small.glb', fit: {height: 1.2}},
	bookcase: {url: '/models/bookcase.glb', fit: {height: 2.6}},
	shelf: {url: '/models/shelf.glb', fit: {width: 2.1}},
	picture: {url: '/models/picture-frame.glb', fit: {maxSide: 1.4}, rotation: [HALF_PI, 0, 0]},
	floorLamp: {url: '/models/floor-lamp.glb', fit: {height: 2.0}},
	chair: {url: '/models/chair.glb', fit: {maxSide: 1.1}}
} satisfies Record<string, TModelConfig>;

export type TModelKey = keyof typeof modelConfig;

/** Every distinct file used by the map; preloaded once the canvas has mounted. */
export const modelUrls: string[] = [...new Set(Object.values<TModelConfig>(modelConfig).map((config) => config.url))];
