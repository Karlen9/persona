// glTF set dressing for the floor. Each piece sits in its own <Suspense> and falls back to the procedural version
// from `decor.tsx` (or nothing) until its file has loaded.
import {Suspense} from 'react';

import {GltfModel} from '../models/GltfModel';
import {Picture, Plant, Shelf, SoftSeat} from './decor';

import type {ReactNode} from 'react';
import type {TVec3} from './shared';

/** Houseplant; `variant` picks the large or the small model, `scale` is relative to the procedural plant (1.25 = default). */
export function PlantModel({
	pos,
	scale = 1.25,
	variant
}: {
	pos: TVec3;
	scale?: number;
	variant: 'large' | 'small';
}): ReactNode {
	return (
		<Suspense fallback={<Plant pos={pos} scale={scale} />}>
			<GltfModel
				model={variant === 'large' ? 'plantLarge' : 'plantSmall'}
				position={pos}
				scale={scale / 1.25}
				rotationY={pos[0] * 1.7}
			/>
		</Suspense>
	);
}

/** Painting on a wall. Same `axis` convention as the procedural `Picture`. */
export function PictureModel({pos, axis, color}: {pos: TVec3; axis: 'x' | 'z'; color?: string}): ReactNode {
	return (
		<Suspense fallback={<Picture pos={pos} axis={axis} color={color} />}>
			<group position={pos} rotation={[0, axis === 'x' ? Math.PI / 2 : 0, 0]}>
				<GltfModel model={'picture'} position={[0, 0, 0]} />
			</group>
		</Suspense>
	);
}

/** Small wall shelf. Same `axis` convention as the procedural `Shelf`. */
export function ShelfModel({pos, axis}: {pos: TVec3; axis: 'x' | 'z'}): ReactNode {
	return (
		<Suspense fallback={<Shelf pos={pos} axis={axis} />}>
			<group position={pos} rotation={[0, axis === 'x' ? Math.PI / 2 : 0, 0]}>
				<GltfModel model={'shelf'} />
			</group>
		</Suspense>
	);
}

/** Freestanding bookcase against a wall. `pos` is on the floor; `axis` is the wall normal. */
export function BookcaseModel({pos, axis}: {pos: TVec3; axis: 'x' | 'z'}): ReactNode {
	return (
		<Suspense fallback={null}>
			<group position={pos} rotation={[0, axis === 'x' ? Math.PI / 2 : 0, 0]}>
				<GltfModel model={'bookcase'} />
			</group>
		</Suspense>
	);
}

export function FloorLampModel({pos}: {pos: TVec3}): ReactNode {
	return (
		<Suspense fallback={null}>
			<GltfModel model={'floorLamp'} position={pos} />
		</Suspense>
	);
}

/** Lounge armchair for dressing; faces local +z. */
export function SoftSeatModel({pos, rotationY = 0}: {pos: TVec3; rotationY?: number}): ReactNode {
	return (
		<Suspense fallback={<SoftSeat pos={pos} rotationY={rotationY} />}>
			<GltfModel model={'chair'} position={pos} rotationY={rotationY} />
		</Suspense>
	);
}
