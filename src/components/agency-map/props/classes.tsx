import {useRef} from 'react';

import {Ball, Box, C, Cone, Cyl, InstancedBoxes, Ring, useIdle} from './shared';

import type {ReactNode} from 'react';
import type {Group} from 'three';
import type {TInstance, TPropProps} from './shared';

const CELL = 0.36;

function cell(i: number): number {
	return (i - 3.5) * CELL;
}

const chessSquares: TInstance[] = Array.from({length: 64}, (_, n) => {
	const col = n % 8;
	const row = Math.floor(n / 8);
	return {pos: [cell(col), 0.23, cell(row)], color: (col + row) % 2 === 0 ? '#f1e4c8' : '#6b4a2f'};
});

type TPieceKind = 'pawn' | 'rook' | 'king' | 'queen';

function Piece({
	kind,
	col,
	row,
	color,
	hl
}: {
	kind: TPieceKind;
	col: number;
	row: number;
	color: string;
	hl: boolean;
}): ReactNode {
	const base: [number, number, number] = [cell(col), 0.25, cell(row)];
	return (
		<group position={base}>
			{kind === 'pawn' ? (
				<>
					<Cyl rTop={0.06} r={0.12} h={0.28} pos={[0, 0.14, 0]} color={color} hl={hl} />
					<Ball r={0.09} pos={[0, 0.34, 0]} color={color} hl={hl} />
				</>
			) : null}
			{kind === 'rook' ? (
				<>
					<Cyl rTop={0.11} r={0.14} h={0.38} pos={[0, 0.19, 0]} color={color} hl={hl} />
					<Box size={[0.28, 0.08, 0.28]} pos={[0, 0.42, 0]} color={color} hl={hl} />
				</>
			) : null}
			{kind === 'king' ? (
				<>
					<Cyl rTop={0.08} r={0.15} h={0.55} pos={[0, 0.275, 0]} color={color} hl={hl} />
					<Box size={[0.05, 0.2, 0.05]} pos={[0, 0.65, 0]} color={color} hl={hl} />
					<Box size={[0.16, 0.05, 0.05]} pos={[0, 0.66, 0]} color={color} hl={hl} />
				</>
			) : null}
			{kind === 'queen' ? (
				<>
					<Cyl rTop={0.07} r={0.15} h={0.5} pos={[0, 0.25, 0]} color={color} hl={hl} />
					<Ball r={0.11} pos={[0, 0.58, 0]} color={color} hl={hl} />
				</>
			) : null}
		</group>
	);
}

/** Shahmaty: an 8x8 board (instanced squares) with a handful of pieces. */
export function Chessboard({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<Box size={[3.2, 0.2, 3.2]} pos={[0, 0.1, 0]} color={C.woodDark} hl={hl} />
			<InstancedBoxes size={[CELL - 0.01, 0.06, CELL - 0.01]} items={chessSquares} hl={hl} />
			<Piece kind={'rook'} col={0} row={0} color={C.dark} hl={hl} />
			<Piece kind={'queen'} col={3} row={0} color={C.dark} hl={hl} />
			<Piece kind={'king'} col={4} row={0} color={C.dark} hl={hl} />
			<Piece kind={'pawn'} col={2} row={1} color={C.dark} hl={hl} />
			<Piece kind={'pawn'} col={5} row={2} color={C.dark} hl={hl} />
			<Piece kind={'pawn'} col={3} row={4} color={C.white} hl={hl} />
			<Piece kind={'pawn'} col={6} row={5} color={C.white} hl={hl} />
			<Piece kind={'rook'} col={7} row={7} color={C.white} hl={hl} />
			<Piece kind={'queen'} col={3} row={7} color={C.white} hl={hl} />
			<Piece kind={'king'} col={4} row={7} color={C.white} hl={hl} />
		</group>
	);
}

const deskCentres: [number, number][] = [
	[-0.8, -0.7],
	[0.8, -0.7],
	[-0.8, 0.7],
	[0.8, 0.7]
];
const deskTops: TInstance[] = deskCentres.map(([x, z]) => ({pos: [x, 0.7, z], color: C.wood}));
const deskLegs: TInstance[] = deskCentres.flatMap(([x, z]) => [
	{pos: [x - 0.42, 0.35, z] as [number, number, number], color: C.dark},
	{pos: [x + 0.42, 0.35, z] as [number, number, number], color: C.dark}
]);
const chairSeats: TInstance[] = deskCentres.map(([x, z]) => ({pos: [x, 0.4, z + 0.5], color: C.brand}));
const chairBacks: TInstance[] = deskCentres.map(([x, z]) => ({pos: [x, 0.68, z + 0.7], color: C.brandDark}));

/** Podgotovka k shkole: four desks with chairs (instanced). */
export function SchoolDesks({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<InstancedBoxes size={[1.0, 0.06, 0.55]} items={deskTops} hl={hl} />
			<InstancedBoxes size={[0.05, 0.7, 0.5]} items={deskLegs} hl={hl} />
			<InstancedBoxes size={[0.45, 0.06, 0.45]} items={chairSeats} hl={hl} />
			<InstancedBoxes size={[0.45, 0.4, 0.05]} items={chairBacks} hl={hl} />
			<Box size={[0.2, 0.2, 0.2]} pos={[-0.8, 0.83, -0.7]} color={C.red} hl={hl} />
			<Box size={[0.2, 0.2, 0.2]} pos={[-0.55, 0.83, -0.7]} color={C.gold} hl={hl} />
			<Box size={[0.5, 0.04, 0.35]} pos={[0.8, 0.75, -0.7]} color={C.white} hl={hl} />
		</group>
	);
}

/** Yazykovaya shkola: a globe on a stand. */
export function Globe({highlighted: hl, animate}: TPropProps): ReactNode {
	const planet = useRef<Group>(null);
	useIdle(planet, animate, (obj, t) => {
		obj.rotation.y = t * 0.6;
	});
	return (
		<group>
			<Cyl r={0.5} h={0.08} pos={[0, 0.04, 0]} color={C.dark} hl={hl} />
			<Cyl r={0.06} h={0.7} pos={[0, 0.4, 0]} color={C.woodDark} hl={hl} />
			<group position={[0, 1.4, 0]} rotation={[0, 0, 0.4]}>
				<Ring r={0.85} tube={0.03} rot={[0, Math.PI / 2, 0]} color={C.gold} hl={hl} />
				<group ref={planet}>
					<Ball r={0.75} color={C.blue} hl={hl} />
					<Ball r={0.3} pos={[0.45, 0.35, 0.45]} color={C.green} hl={hl} scale={[1, 0.9, 0.5]} />
					<Ball r={0.28} pos={[-0.5, -0.2, 0.45]} color={C.green} hl={hl} scale={[1, 1, 0.5]} />
					<Ball r={0.25} pos={[0.1, -0.1, -0.7]} color={C.green} hl={hl} scale={[1, 1, 0.5]} />
					<Cone r={0.1} h={0.2} pos={[0, 0.74, 0]} color={C.white} hl={hl} />
				</group>
			</group>
		</group>
	);
}

/** Logoped: a desk with a mirror and a speech bubble. */
export function MirrorDesk({highlighted: hl, animate}: TPropProps): ReactNode {
	const bubble = useRef<Group>(null);
	useIdle(bubble, animate, (obj, t) => {
		obj.position.y = 2.0 + Math.sin(t * 1.8) * 0.06;
	});
	return (
		<group>
			<Box size={[1.9, 0.08, 0.9]} pos={[0, 0.75, 0]} color={C.wood} hl={hl} />
			<Box size={[0.08, 0.72, 0.8]} pos={[-0.85, 0.36, 0]} color={C.woodDark} hl={hl} />
			<Box size={[0.08, 0.72, 0.8]} pos={[0.85, 0.36, 0]} color={C.woodDark} hl={hl} />
			<Box size={[1.2, 0.85, 0.06]} pos={[0, 1.22, -0.2]} rot={[-0.15, 0, 0]} color={C.dark} hl={hl} />
			<Box size={[1.05, 0.7, 0.04]} pos={[0, 1.23, -0.17]} rot={[-0.15, 0, 0]} color={C.glass} hl={hl} />
			<group ref={bubble} position={[0.1, 2.0, 0.1]}>
				<Ball r={0.4} color={C.white} hl={hl} scale={[1.5, 0.9, 0.5]} />
				<Ball r={0.06} pos={[-0.25, 0, 0.2]} color={C.brand} hl={hl} />
				<Ball r={0.06} pos={[0, 0, 0.2]} color={C.brand} hl={hl} />
				<Ball r={0.06} pos={[0.25, 0, 0.2]} color={C.brand} hl={hl} />
				<Cone r={0.1} h={0.25} pos={[-0.3, -0.45, 0]} rot={[0, 0, Math.PI]} color={C.white} hl={hl} />
			</group>
		</group>
	);
}

/** Prodlenka: a long lunch table with plates and benches. */
export function LunchTable({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<Box size={[3.2, 0.08, 1.3]} pos={[0, 0.75, 0]} color={C.wood} hl={hl} />
			{([-1.4, 1.4] as const).flatMap((x) =>
				([-0.5, 0.5] as const).map((z) => (
					<Box key={`${x}${z}`} size={[0.08, 0.72, 0.08]} pos={[x, 0.36, z]} color={C.woodDark} hl={hl} />
				))
			)}
			<Box size={[3.0, 0.08, 0.4]} pos={[0, 0.42, -1.0]} color={C.brand} hl={hl} />
			<Box size={[3.0, 0.08, 0.4]} pos={[0, 0.42, 1.0]} color={C.brand} hl={hl} />
			{[-1.1, -0.35, 0.4, 1.15].map((x) => (
				<group key={x}>
					<Cyl r={0.2} h={0.03} pos={[x, 0.81, -0.3]} color={C.white} hl={hl} />
					<Cyl r={0.2} h={0.03} pos={[x, 0.81, 0.3]} color={C.white} hl={hl} />
				</group>
			))}
			<Ball r={0.11} pos={[0, 0.93, 0]} color={C.red} hl={hl} />
			<Cyl r={0.09} h={0.18} pos={[0.6, 0.9, 0]} color={C.blue} hl={hl} />
		</group>
	);
}
