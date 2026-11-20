import {useRef} from 'react';

import {Ball, Box, C, Cyl, Facets, Figure, Pill, useIdle} from './shared';

import type {ReactNode} from 'react';
import type {Group} from 'three';
import type {TPropProps} from './shared';

/** Tancy: a mirror wall and a disco ball. */
export function DanceMirror({highlighted: hl, animate}: TPropProps): ReactNode {
	const ball = useRef<Group>(null);
	useIdle(ball, animate, (obj, t) => {
		obj.rotation.y = t * 1.2;
	});
	return (
		<group>
			<Box size={[5.2, 2.5, 0.14]} pos={[0, 1.25, 0]} color={C.steel} hl={hl} />
			<Box size={[4.8, 2.1, 0.05]} pos={[0, 1.3, 0.09]} color={C.glass} hl={hl} />
			<Cyl r={0.05} h={2.7} pos={[1.9, 1.35, 1.4]} color={C.steel} hl={hl} />
			<Cyl r={0.3} h={0.06} pos={[1.9, 0.03, 1.4]} color={C.dark} hl={hl} />
			<group ref={ball} position={[1.9, 2.95, 1.4]}>
				<Facets r={0.45} color={'#dfe6ee'} hl={hl} />
			</group>
			<Ball r={0.07} pos={[1.9, 2.5, 1.4]} color={C.gold} hl={hl} />
		</group>
	);
}

/** Bachata: two figures dancing on a round floor. */
export function DanceCouple({highlighted: hl, animate}: TPropProps): ReactNode {
	const couple = useRef<Group>(null);
	useIdle(couple, animate, (obj, t) => {
		obj.rotation.y = t * 0.7;
		obj.position.y = Math.abs(Math.sin(t * 2.4)) * 0.06;
	});
	return (
		<group>
			<Cyl r={1.35} h={0.08} pos={[0, 0.04, 0]} color={C.gold} hl={hl} />
			<group ref={couple}>
				<group position={[-0.28, 0.08, 0]} rotation={[0, 0, -0.12]}>
					<Figure color={C.pink} height={1.6} hl={hl} />
				</group>
				<group position={[0.28, 0.08, 0]} rotation={[0, 0, 0.12]}>
					<Figure color={C.brand} height={1.75} hl={hl} />
				</group>
				<Box size={[0.7, 0.1, 0.12]} pos={[0, 1.05, 0]} color={C.skin} hl={hl} />
			</group>
		</group>
	);
}

/** Shkola modeley: a runway with a walking model. */
export function Catwalk({highlighted: hl, animate}: TPropProps): ReactNode {
	const model = useRef<Group>(null);
	useIdle(model, animate, (obj, t) => {
		obj.position.x = Math.sin(t * 0.8) * 1.8;
		obj.rotation.y = Math.cos(t * 0.8) > 0 ? Math.PI / 2 : -Math.PI / 2;
	});
	return (
		<group>
			<Box size={[5, 0.25, 1.4]} pos={[0, 0.125, 0]} color={C.dark} hl={hl} />
			<Box size={[4.6, 0.02, 0.1]} pos={[0, 0.26, 0]} color={C.white} hl={hl} />
			<Box size={[1.5, 0.25, 1.9]} pos={[3.1, 0.125, 0]} color={C.dark} hl={hl} />
			<Cyl r={0.06} h={1.8} pos={[-2.4, 0.9, -0.85]} color={C.steel} hl={hl} />
			<Cyl r={0.06} h={1.8} pos={[-2.4, 0.9, 0.85]} color={C.steel} hl={hl} />
			<Ball r={0.12} pos={[-2.4, 1.85, -0.85]} color={C.gold} emissive={C.gold} />
			<Ball r={0.12} pos={[-2.4, 1.85, 0.85]} color={C.gold} emissive={C.gold} />
			<group ref={model} position={[0, 0.25, 0]}>
				<Figure color={C.rose} height={1.8} hl={hl} />
				<Pill r={0.05} len={0.2} pos={[0.2, 0.9, 0]} color={C.skin} hl={hl} />
			</group>
		</group>
	);
}
