import {useFrame} from '@react-three/fiber';
import {useLayoutEffect, useRef} from 'react';
import {
	BoxGeometry,
	CapsuleGeometry,
	Color,
	ConeGeometry,
	CylinderGeometry,
	IcosahedronGeometry,
	MeshStandardMaterial,
	Object3D,
	SphereGeometry,
	TorusGeometry
} from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import type {ReactNode, RefObject} from 'react';
import type {BufferGeometry, InstancedMesh} from 'three';

export type TVec3 = [number, number, number];

export type TPropProps = {highlighted: boolean; animate: boolean};

/** Flat placeholder palette. Replace a prop with a glTF and these go away with it. */
export const C = {
	white: '#f8fafc',
	cream: '#f1e4c8',
	wood: '#d39a62',
	woodDark: '#b97a4a',
	dark: '#2b2f3a',
	steel: '#aab4c0',
	glass: '#cfeaf5',
	brand: '#3fa08d',
	brandLight: '#86d5c5',
	brandDark: '#1d6a5f',
	pink: '#f7b2c4',
	rose: '#9a2a4d',
	gold: '#f5c451',
	red: '#d9483b',
	blue: '#4a90c2',
	green: '#6fae5b',
	terracotta: '#c96f4a',
	purple: '#8b5cf6',
	skin: '#f2c9a5',
	blush: '#fde5ec'
} as const;

type TMatProps = {color: string; hl?: boolean; opacity?: number; emissive?: string; flat?: boolean};

// Geometries and materials are shared between all parts with the same parameters (module-level, never disposed):
// the map has hundreds of primitive parts, but only a few dozen distinct shapes and colours.
const geometries = new Map<string, BufferGeometry>();

function shared<T extends BufferGeometry>(key: string, make: () => T): T {
	let geometry = geometries.get(key);
	if (!geometry) {
		geometry = make();
		geometries.set(key, geometry);
	}
	return geometry as T;
}

const materials = new Map<string, MeshStandardMaterial>();

export function getMaterial({color, hl, opacity, emissive, flat}: TMatProps): MeshStandardMaterial {
	const key = `${color}|${hl ? 1 : 0}|${opacity ?? ''}|${emissive ?? ''}|${flat ? 1 : 0}`;
	let material = materials.get(key);
	if (!material) {
		material = new MeshStandardMaterial({
			color,
			roughness: 0.8,
			metalness: 0,
			emissive: emissive ?? '#ffd9a0',
			emissiveIntensity: emissive ? 0.9 : hl ? 0.25 : 0,
			transparent: opacity !== undefined,
			opacity: opacity ?? 1,
			flatShading: Boolean(flat)
		});
		materials.set(key, material);
	}
	return material;
}

type TPartProps = TMatProps & {pos?: TVec3; rot?: TVec3};

/** Chunky rounded box. Radius is capped by the thinnest side. */
export function Box({size, pos, rot, radius = 0.08, ...mat}: TPartProps & {size: TVec3; radius?: number}): ReactNode {
	const r = Math.max(0.005, Math.min(radius, Math.min(...size) / 2 - 0.002));
	const geometry = shared(
		`box|${size.join(',')}|${r}`,
		() => new RoundedBoxGeometry(size[0], size[1], size[2], 3, r)
	);
	return (
		<mesh geometry={geometry} material={getMaterial(mat)} position={pos} rotation={rot} castShadow receiveShadow />
	);
}

export function Cyl({r, rTop, h, pos, rot, ...mat}: TPartProps & {r: number; rTop?: number; h: number}): ReactNode {
	const geometry = shared(`cyl|${rTop ?? r}|${r}|${h}`, () => new CylinderGeometry(rTop ?? r, r, h, 32));
	return (
		<mesh geometry={geometry} material={getMaterial(mat)} position={pos} rotation={rot} castShadow receiveShadow />
	);
}

export function Ball({r, pos, rot, scale, ...mat}: TPartProps & {r: number; scale?: TVec3}): ReactNode {
	const geometry = shared(`ball|${r}`, () => new SphereGeometry(r, 20, 14));
	return (
		<mesh
			geometry={geometry}
			material={getMaterial(mat)}
			position={pos}
			rotation={rot}
			scale={scale}
			castShadow
			receiveShadow
		/>
	);
}

export function Facets({r, pos, rot, ...mat}: TPartProps & {r: number}): ReactNode {
	const geometry = shared(`facets|${r}`, () => new IcosahedronGeometry(r, 1));
	return (
		<mesh
			geometry={geometry}
			material={getMaterial({...mat, flat: true})}
			position={pos}
			rotation={rot}
			castShadow
			receiveShadow
		/>
	);
}

export function Cone({r, h, pos, rot, ...mat}: TPartProps & {r: number; h: number}): ReactNode {
	const geometry = shared(`cone|${r}|${h}`, () => new ConeGeometry(r, h, 24));
	return (
		<mesh geometry={geometry} material={getMaterial(mat)} position={pos} rotation={rot} castShadow receiveShadow />
	);
}

/** Capsule of total height `len + 2 * r`. */
export function Pill({r, len, pos, rot, ...mat}: TPartProps & {r: number; len: number}): ReactNode {
	const geometry = shared(`pill|${r}|${len}`, () => new CapsuleGeometry(r, len, 6, 14));
	return (
		<mesh geometry={geometry} material={getMaterial(mat)} position={pos} rotation={rot} castShadow receiveShadow />
	);
}

export function Ring({r, tube, pos, rot, ...mat}: TPartProps & {r: number; tube: number}): ReactNode {
	const geometry = shared(`ring|${r}|${tube}`, () => new TorusGeometry(r, tube, 10, 32));
	return (
		<mesh geometry={geometry} material={getMaterial(mat)} position={pos} rotation={rot} castShadow receiveShadow />
	);
}

/** A simple person: capsule body plus a head. Origin at the feet. */
export function Figure({
	color,
	height = 1.5,
	hl,
	skin = C.skin
}: {
	color: string;
	height?: number;
	hl?: boolean;
	skin?: string;
}): ReactNode {
	const r = height * 0.15;
	const len = height - 2 * r - height * 0.28;
	return (
		<group>
			<Pill r={r} len={len} pos={[0, len / 2 + r, 0]} color={color} hl={hl} />
			<Ball r={r * 0.95} pos={[0, len + 2 * r + r * 0.7, 0]} color={skin} hl={hl} />
		</group>
	);
}

/** Runs `fn` every frame on the referenced object while `animate` is true. */
export function useIdle(
	ref: RefObject<Object3D | null>,
	animate: boolean,
	fn: (obj: Object3D, t: number) => void
): void {
	useFrame((state) => {
		if (animate && ref.current) fn(ref.current, state.clock.elapsedTime);
	});
}

export type TInstance = {pos: TVec3; color?: string};

/** One draw call for many identical boxes (chess squares, desks, chairs). `items` must be a stable reference. */
export function InstancedBoxes({size, items, hl}: {size: TVec3; items: readonly TInstance[]; hl?: boolean}): ReactNode {
	const ref = useRef<InstancedMesh>(null);
	useLayoutEffect(() => {
		const mesh = ref.current;
		if (!mesh) return;
		const dummy = new Object3D();
		const color = new Color();
		items.forEach((item, i) => {
			dummy.position.set(...item.pos);
			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);
			mesh.setColorAt(i, color.set(item.color ?? '#ffffff'));
		});
		mesh.instanceMatrix.needsUpdate = true;
		if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
		mesh.computeBoundingSphere();
	}, [items]);
	return (
		<instancedMesh
			ref={ref}
			args={[shared(`ibox|${size.join(',')}`, () => new BoxGeometry(...size)), undefined, items.length]}
			material={getMaterial({color: '#ffffff', hl})}
			castShadow
			receiveShadow
		/>
	);
}
