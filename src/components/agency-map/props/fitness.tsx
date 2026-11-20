import {useRef} from 'react';

import {Ball, Box, C, Cyl, Figure, useIdle} from './shared';

import type {ReactNode} from 'react';
import type {Group} from 'three';
import type {TPropProps} from './shared';

/** Pilates: a reformer with a sliding carriage. */
export function Reformer({highlighted: hl, animate}: TPropProps): ReactNode {
	const carriage = useRef<Group>(null);
	useIdle(carriage, animate, (obj, t) => {
		obj.position.x = Math.sin(t * 1.4) * 0.35;
	});
	return (
		<group>
			<Box size={[2.9, 0.1, 0.1]} pos={[0, 0.4, -0.36]} color={C.wood} hl={hl} />
			<Box size={[2.9, 0.1, 0.1]} pos={[0, 0.4, 0.36]} color={C.wood} hl={hl} />
			{([-1.4, 1.4] as const).flatMap((x) =>
				([-0.36, 0.36] as const).map((z) => (
					<Cyl key={`${x}${z}`} r={0.05} h={0.35} pos={[x, 0.175, z]} color={C.dark} hl={hl} />
				))
			)}
			<Box size={[0.12, 0.8, 0.9]} pos={[1.4, 0.85, 0]} color={C.brandDark} hl={hl} />
			<Cyl r={0.04} h={0.85} pos={[1.15, 1.2, 0]} rot={[Math.PI / 2, 0, 0]} color={C.steel} hl={hl} />
			<Box size={[0.3, 0.3, 0.7]} pos={[-1.2, 0.6, 0]} color={C.brandDark} hl={hl} />
			<group ref={carriage} position={[0, 0, 0]}>
				<Box size={[1.2, 0.18, 0.66]} pos={[0, 0.54, 0]} color={C.brandLight} hl={hl} />
			</group>
		</group>
	);
}

/** A seated figure with two hands resting on the knees; breathes while `animate`. Stands on y = 0. */
export function YogaBody({highlighted: hl, animate}: TPropProps): ReactNode {
	const body = useRef<Group>(null);
	useIdle(body, animate, (obj, t) => {
		obj.scale.y = 1 + Math.sin(t * 1.6) * 0.02;
	});
	return (
		<group ref={body} position={[0, 0.05, 0.1]}>
			<Box size={[0.8, 0.14, 0.45]} pos={[0, 0.08, 0.1]} color={C.rose} hl={hl} />
			<group position={[0, 0.12, 0]} scale={[1, 0.85, 1]}>
				<Figure color={C.rose} height={1.3} hl={hl} />
			</group>
			<Ball r={0.1} pos={[-0.38, 0.4, 0.15]} color={C.skin} hl={hl} />
			<Ball r={0.1} pos={[0.38, 0.4, 0.15]} color={C.skin} hl={hl} />
		</group>
	);
}

/** Joga: a rolled-out mat, a block and a seated figure. */
export function YogaMat({highlighted: hl, animate}: TPropProps): ReactNode {
	return (
		<group rotation={[0, 0.3, 0]}>
			<Box size={[1.1, 0.05, 2.3]} pos={[0, 0.025, 0]} color={C.brand} hl={hl} />
			<Cyl r={0.14} h={1.0} pos={[1.0, 0.14, 0.4]} rot={[Math.PI / 2, 0, 0]} color={C.pink} hl={hl} />
			<Box size={[0.35, 0.22, 0.22]} pos={[-0.85, 0.11, -0.6]} color={C.gold} hl={hl} />
			<YogaBody highlighted={hl} animate={animate} />
		</group>
	);
}

/** Barre fitnes: a double ballet barre in front of a mirror, plus a pair of ballet shoes. */
export function Barre({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<Box size={[4.2, 1.8, 0.08]} pos={[0, 0.9, -0.7]} color={C.glass} hl={hl} />
			<Cyl r={0.05} h={1.15} pos={[-1.9, 0.575, 0]} color={C.steel} hl={hl} />
			<Cyl r={0.05} h={1.15} pos={[1.9, 0.575, 0]} color={C.steel} hl={hl} />
			<Cyl r={0.05} h={3.9} pos={[0, 1.1, 0]} rot={[0, 0, Math.PI / 2]} color={C.wood} hl={hl} />
			<Cyl r={0.045} h={3.9} pos={[0, 0.82, 0]} rot={[0, 0, Math.PI / 2]} color={C.wood} hl={hl} />
			<Cyl r={0.2} h={0.04} pos={[-1.9, 0.02, 0]} color={C.dark} hl={hl} />
			<Cyl r={0.2} h={0.04} pos={[1.9, 0.02, 0]} color={C.dark} hl={hl} />
			<Box size={[0.14, 0.08, 0.3]} pos={[-0.3, 0.04, 0.7]} color={C.pink} hl={hl} />
			<Box size={[0.14, 0.08, 0.3]} pos={[0.3, 0.04, 0.7]} color={C.pink} hl={hl} />
		</group>
	);
}
