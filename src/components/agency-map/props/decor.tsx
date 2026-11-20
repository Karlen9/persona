import {useLayoutEffect, useRef} from 'react';
import {Color, Object3D} from 'three';

import {Box, C, Cyl, Facets, InstancedBoxes} from './shared';

import type {ReactNode} from 'react';
import type {InstancedMesh} from 'three';
import type {TInstance, TVec3} from './shared';

/** Non-interactive set dressing shared by all rooms. */
export function Plant({pos, scale = 1}: {pos: TVec3; scale?: number}): ReactNode {
	return (
		<group position={pos} scale={scale}>
			<Cyl rTop={0.4} r={0.3} h={0.6} pos={[0, 0.3, 0]} color={C.terracotta} />
			<Facets r={0.45} pos={[0, 1.0, 0]} color={'#5f9a52'} />
			<Facets r={0.32} pos={[0.3, 1.35, 0.1]} color={'#78b062'} />
			<Facets r={0.28} pos={[-0.25, 1.3, -0.15]} color={'#4f8a47'} />
		</group>
	);
}

/** Framed picture hung on a wall. `axis` is the wall normal: 'z' for a wall at -z, 'x' for a wall at -x. */
export function Picture({pos, axis, color = C.gold}: {pos: TVec3; axis: 'x' | 'z'; color?: string}): ReactNode {
	return (
		<group position={pos} rotation={[0, axis === 'x' ? Math.PI / 2 : 0, 0]}>
			<Box size={[1.5, 1.1, 0.1]} radius={0.04} color={C.woodDark} />
			<mesh position={[0, 0, 0.06]}>
				<planeGeometry args={[1.25, 0.85]} />
				<meshStandardMaterial color={color} roughness={0.9} />
			</mesh>
			<mesh position={[0.2, -0.1, 0.065]}>
				<circleGeometry args={[0.22, 24]} />
				<meshStandardMaterial color={C.white} roughness={0.9} />
			</mesh>
		</group>
	);
}

const bookColors = ['#c9463d', '#3fa08d', '#e0a93b', '#4a90c2', '#e59aa8', '#9b8fd1'];
const books = Array.from({length: 10}, (_, i) => ({
	x: -0.85 + i * 0.19,
	h: 0.34 + ((i * 7) % 4) * 0.05,
	color: bookColors[i % bookColors.length]
}));

/** Wall shelf with a row of books (instanced). Same `axis` convention as `Picture`. */
export function Shelf({pos, axis}: {pos: TVec3; axis: 'x' | 'z'}): ReactNode {
	const ref = useRef<InstancedMesh>(null);
	useLayoutEffect(() => {
		const mesh = ref.current;
		if (!mesh) return;
		const dummy = new Object3D();
		const color = new Color();
		books.forEach((book, i) => {
			dummy.position.set(book.x, book.h / 2 + 0.06, 0);
			dummy.scale.set(1, book.h, 1);
			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);
			mesh.setColorAt(i, color.set(book.color));
		});
		mesh.instanceMatrix.needsUpdate = true;
		if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
	}, []);
	return (
		<group position={pos} rotation={[0, axis === 'x' ? Math.PI / 2 : 0, 0]}>
			<Box size={[2.1, 0.12, 0.5]} radius={0.04} color={C.wood} />
			<group position={[0, 0, 0]}>
				<instancedMesh ref={ref} args={[undefined, undefined, books.length]} castShadow frustumCulled={false}>
					<boxGeometry args={[0.15, 1, 0.3]} />
					<meshStandardMaterial color={'#ffffff'} roughness={0.85} />
				</instancedMesh>
			</group>
		</group>
	);
}

/** Window with a white frame and pale-blue rounded panes. Same `axis` convention as `Picture`. */
export function Window({
	pos,
	axis,
	width = 3,
	height = 2.2
}: {
	pos: TVec3;
	axis: 'x' | 'z';
	width?: number;
	height?: number;
}): ReactNode {
	return (
		<group position={pos} rotation={[0, axis === 'x' ? Math.PI / 2 : 0, 0]}>
			<Box size={[width, height, 0.14]} radius={0.06} color={C.white} />
			<Box
				size={[width - 0.3, height - 0.3, 0.08]}
				pos={[0, 0, 0.05]}
				radius={0.1}
				color={'#bfe0f2'}
				emissive={'#bfe0f2'}
			/>
			<Box size={[0.08, height - 0.3, 0.06]} pos={[0, 0, 0.1]} radius={0.02} color={C.white} />
			<Box size={[width - 0.3, 0.08, 0.06]} pos={[0, 0, 0.1]} radius={0.02} color={C.white} />
			<Box size={[width + 0.2, 0.1, 0.3]} pos={[0, -height / 2 - 0.02, 0.1]} radius={0.04} color={C.white} />
		</group>
	);
}

/** Bench, long axis along local x. Origin on the floor. */
export function Bench({pos, rotationY = 0}: {pos: TVec3; rotationY?: number}): ReactNode {
	return (
		<group position={pos} rotation={[0, rotationY, 0]}>
			<Box size={[2.6, 0.12, 0.7]} pos={[0, 0.5, 0]} radius={0.04} color={C.wood} />
			<Box size={[0.12, 0.46, 0.6]} pos={[-1.1, 0.23, 0]} radius={0.03} color={C.woodDark} />
			<Box size={[0.12, 0.46, 0.6]} pos={[1.1, 0.23, 0]} radius={0.03} color={C.woodDark} />
			<Box size={[0.7, 0.14, 0.5]} pos={[-0.7, 0.63, 0]} radius={0.06} color={C.brandLight} />
		</group>
	);
}

const shelfBooks: TInstance[] = [
	{pos: [-1.1, 0.88, 0], color: '#e0a93b'},
	{pos: [-0.85, 0.88, 0], color: '#4a90c2'},
	{pos: [-0.2, 0.88, 0], color: '#e59aa8'},
	{pos: [0.9, 0.88, 0], color: '#3fa08d'},
	{pos: [-0.6, 0.38, 0], color: '#c9463d'},
	{pos: [0.4, 0.38, 0], color: '#9b8fd1'},
	{pos: [0.65, 0.38, 0], color: '#e0a93b'}
];

/** Low open shelving unit (a divider), long axis along local x. Origin on the floor. */
export function LowShelf({pos, rotationY = 0}: {pos: TVec3; rotationY?: number}): ReactNode {
	return (
		<group position={pos} rotation={[0, rotationY, 0]}>
			<Box size={[3.0, 0.08, 0.5]} pos={[0, 1.1, 0]} radius={0.03} color={C.wood} />
			<Box size={[3.0, 0.08, 0.5]} pos={[0, 0.6, 0]} radius={0.03} color={C.wood} />
			<Box size={[3.0, 0.08, 0.5]} pos={[0, 0.06, 0]} radius={0.03} color={C.wood} />
			<Box size={[0.08, 1.1, 0.5]} pos={[-1.5, 0.55, 0]} radius={0.03} color={C.woodDark} />
			<Box size={[0.08, 1.1, 0.5]} pos={[0, 0.55, 0]} radius={0.03} color={C.woodDark} />
			<Box size={[0.08, 1.1, 0.5]} pos={[1.5, 0.55, 0]} radius={0.03} color={C.woodDark} />
			<InstancedBoxes size={[0.2, 0.4, 0.3]} items={shelfBooks} />
		</group>
	);
}

const deskRowItems: TInstance[] = [0, 1].flatMap((row) =>
	[0, 1, 2].map((col) => ({pos: [(col - 1) * 1.2, 0.62, (row - 0.5) * 1.5] as TVec3, color: C.wood}))
);
const deskRowChairs: TInstance[] = deskRowItems.map((desk) => ({
	pos: [desk.pos[0], 0.36, desk.pos[2] + 0.55] as TVec3,
	color: C.blue
}));
const deskRowLegs: TInstance[] = deskRowItems.flatMap((desk) => [
	{pos: [desk.pos[0] - 0.45, 0.3, desk.pos[2]] as TVec3, color: C.dark},
	{pos: [desk.pos[0] + 0.45, 0.3, desk.pos[2]] as TVec3, color: C.dark}
]);

/** Classroom dressing: two rows of three small desks with chairs (instanced). */
export function DeskRows({pos, rotationY = 0}: {pos: TVec3; rotationY?: number}): ReactNode {
	return (
		<group position={pos} rotation={[0, rotationY, 0]}>
			<InstancedBoxes size={[1.0, 0.06, 0.55]} items={deskRowItems} />
			<InstancedBoxes size={[0.05, 0.6, 0.5]} items={deskRowLegs} />
			<InstancedBoxes size={[0.42, 0.06, 0.42]} items={deskRowChairs} />
		</group>
	);
}

/** Robotics workshop dressing: a workbench with tools and a monitor. */
export function Workbench({pos, rotationY = 0}: {pos: TVec3; rotationY?: number}): ReactNode {
	return (
		<group position={pos} rotation={[0, rotationY, 0]}>
			<Box size={[4, 0.1, 1.0]} pos={[0, 0.95, 0]} radius={0.04} color={C.steel} />
			<Box size={[0.1, 0.9, 0.9]} pos={[-1.9, 0.45, 0]} radius={0.03} color={C.dark} />
			<Box size={[0.1, 0.9, 0.9]} pos={[1.9, 0.45, 0]} radius={0.03} color={C.dark} />
			<Box size={[3.8, 0.1, 0.8]} pos={[0, 0.3, 0]} radius={0.03} color={C.dark} />
			<Box size={[0.9, 0.55, 0.05]} pos={[-1.2, 1.5, -0.2]} rot={[-0.1, 0, 0]} color={C.dark} />
			<Box
				size={[0.8, 0.45, 0.02]}
				pos={[-1.2, 1.5, -0.17]}
				rot={[-0.1, 0, 0]}
				color={C.glass}
				emissive={C.glass}
			/>
			<Box size={[0.5, 0.2, 0.4]} pos={[0.4, 1.1, 0.1]} color={C.red} />
			<Box size={[0.6, 0.06, 0.3]} pos={[1.2, 1.03, 0.1]} color={C.brand} />
			<Cyl r={0.08} h={0.3} pos={[-0.4, 1.15, 0.2]} color={C.gold} />
		</group>
	);
}

/** Lounge armchair for dressing; faces local +z. */
export function SoftSeat({pos, rotationY = 0}: {pos: TVec3; rotationY?: number}): ReactNode {
	return (
		<group position={pos} rotation={[0, rotationY, 0]}>
			<Box size={[1.1, 0.35, 1.0]} pos={[0, 0.3, 0]} color={C.pink} />
			<Box size={[1.1, 0.8, 0.22]} pos={[0, 0.78, -0.4]} color={C.pink} />
			<Box size={[0.2, 0.55, 1.0]} pos={[-0.55, 0.52, 0]} color={C.rose} />
			<Box size={[0.2, 0.55, 1.0]} pos={[0.55, 0.52, 0]} color={C.rose} />
			<Box size={[0.8, 0.12, 0.7]} pos={[0, 0.54, 0.05]} color={C.blush} />
		</group>
	);
}
