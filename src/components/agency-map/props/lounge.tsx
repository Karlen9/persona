import {useRef} from 'react';

import {Box, C, Cone, Cyl, Figure, useIdle} from './shared';

import type {ReactNode} from 'react';
import type {Group} from 'three';
import type {TPropProps} from './shared';

/** Semejnaya shkola: a sofa with a small family. Faces +z. */
export function FamilySofa({highlighted: hl, animate}: TPropProps): ReactNode {
	const kid = useRef<Group>(null);
	useIdle(kid, animate, (obj, t) => {
		obj.position.y = Math.abs(Math.sin(t * 2)) * 0.05;
	});
	return (
		<group>
			<Box size={[3.2, 0.45, 1.1]} pos={[0, 0.35, 0]} color={C.pink} hl={hl} />
			<Box size={[3.2, 0.85, 0.3]} pos={[0, 0.8, -0.4]} color={C.pink} hl={hl} />
			<Box size={[0.3, 0.7, 1.1]} pos={[-1.45, 0.55, 0]} color={C.rose} hl={hl} />
			<Box size={[0.3, 0.7, 1.1]} pos={[1.45, 0.55, 0]} color={C.rose} hl={hl} />
			<Box size={[0.9, 0.14, 0.8]} pos={[-0.55, 0.64, 0.05]} color={C.blush} hl={hl} />
			<Box size={[0.9, 0.14, 0.8]} pos={[0.55, 0.64, 0.05]} color={C.blush} hl={hl} />
			<group position={[-0.6, 0.7, 0]}>
				<Figure color={C.brand} height={1.15} hl={hl} />
			</group>
			<group ref={kid} position={[0.2, 0.7, 0.05]}>
				<Figure color={C.gold} height={0.8} hl={hl} />
			</group>
			<group position={[0.75, 0.7, 0]}>
				<Figure color={C.blue} height={0.9} hl={hl} />
			</group>
			<Cyl r={0.05} h={0.12} pos={[-1.4, 0.06, 0.5]} color={C.dark} hl={hl} />
			<Cyl r={0.05} h={0.12} pos={[1.4, 0.06, 0.5]} color={C.dark} hl={hl} />
		</group>
	);
}

function Armchair({hl, rotationY, x}: {hl: boolean; rotationY: number; x: number}): ReactNode {
	return (
		<group position={[x, 0, 0]} rotation={[0, rotationY, 0]}>
			<Box size={[1.0, 0.35, 0.95]} pos={[0, 0.3, 0]} color={C.brandLight} hl={hl} />
			<Box size={[1.0, 0.75, 0.2]} pos={[0, 0.75, -0.38]} color={C.brandLight} hl={hl} />
			<Box size={[0.18, 0.5, 0.95]} pos={[-0.5, 0.5, 0]} color={C.brand} hl={hl} />
			<Box size={[0.18, 0.5, 0.95]} pos={[0.5, 0.5, 0]} color={C.brand} hl={hl} />
			<Box size={[0.8, 0.12, 0.7]} pos={[0, 0.54, 0.05]} color={C.cream} hl={hl} />
		</group>
	);
}

/** Dlya vzroslyh: two armchairs and a coffee table. */
export function Armchairs({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<Armchair x={-1.5} rotationY={Math.PI / 2} hl={hl} />
			<Armchair x={1.5} rotationY={-Math.PI / 2} hl={hl} />
			<Cyl r={0.4} h={0.06} pos={[0, 0.5, 0]} color={C.wood} hl={hl} />
			<Cyl r={0.05} h={0.47} pos={[0, 0.25, 0]} color={C.woodDark} hl={hl} />
			<Cyl r={0.12} h={0.04} pos={[0, 0.55, 0]} color={C.white} hl={hl} />
			<Cyl r={0.07} h={0.12} pos={[0.15, 0.6, 0.1]} color={C.red} hl={hl} />
		</group>
	);
}

/** Individualnye zanyatiya dlya vzroslyh: a desk with a lamp, a laptop and books. */
export function DeskLamp({highlighted: hl, animate}: TPropProps): ReactNode {
	const glow = useRef<Group>(null);
	useIdle(glow, animate, (obj, t) => {
		obj.scale.setScalar(1 + Math.sin(t * 2.2) * 0.06);
	});
	return (
		<group>
			<Box size={[2.2, 0.08, 1.0]} pos={[0, 0.75, 0]} color={C.wood} hl={hl} />
			<Box size={[0.08, 0.72, 0.9]} pos={[-1.0, 0.36, 0]} color={C.woodDark} hl={hl} />
			<Box size={[0.08, 0.72, 0.9]} pos={[1.0, 0.36, 0]} color={C.woodDark} hl={hl} />
			<Cyl r={0.15} h={0.05} pos={[-0.8, 0.82, -0.25]} color={C.dark} hl={hl} />
			<Cyl r={0.025} h={0.8} pos={[-0.8, 1.2, -0.25]} rot={[0, 0, 0.15]} color={C.dark} hl={hl} />
			<Cyl r={0.025} h={0.6} pos={[-0.55, 1.55, -0.25]} rot={[0, 0, -1.2]} color={C.dark} hl={hl} />
			<group ref={glow} position={[-0.3, 1.5, -0.25]}>
				<Cone r={0.22} h={0.3} rot={[0, 0, Math.PI]} color={C.gold} emissive={C.gold} />
			</group>
			<Box size={[0.7, 0.03, 0.5]} pos={[0.3, 0.81, 0.1]} color={C.steel} hl={hl} />
			<Box size={[0.7, 0.45, 0.03]} pos={[0.3, 1.0, -0.15]} rot={[-0.25, 0, 0]} color={C.dark} hl={hl} />
			<Box size={[0.5, 0.06, 0.35]} pos={[0.8, 0.82, 0.3]} color={C.red} hl={hl} />
			<Box size={[0.5, 0.06, 0.35]} pos={[0.8, 0.88, 0.3]} color={C.blue} hl={hl} />
		</group>
	);
}
