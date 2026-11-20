import {useRef} from 'react';

import {Ball, Box, C, Cyl, useIdle} from './shared';

import type {ReactNode} from 'react';
import type {Group} from 'three';
import type {TPropProps} from './shared';

/** Risovanie: an easel with a small painting and a paint tray. */
export function Easel({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<Cyl r={0.04} h={2.3} pos={[-0.55, 1.1, 0.1]} rot={[0.12, 0, -0.08]} color={C.wood} hl={hl} />
			<Cyl r={0.04} h={2.3} pos={[0.55, 1.1, 0.1]} rot={[0.12, 0, 0.08]} color={C.wood} hl={hl} />
			<Cyl r={0.04} h={2.2} pos={[0, 1.05, -0.65]} rot={[-0.3, 0, 0]} color={C.woodDark} hl={hl} />
			<Box size={[1.5, 1.1, 0.06]} pos={[0, 1.35, 0.12]} color={C.white} hl={hl} />
			<Box size={[1.5, 0.35, 0.02]} pos={[0, 1.0, 0.16]} color={C.green} hl={hl} />
			<Box size={[1.5, 0.75, 0.02]} pos={[0, 1.55, 0.16]} color={C.glass} hl={hl} />
			<Cyl r={0.2} h={0.02} pos={[0.35, 1.7, 0.18]} rot={[Math.PI / 2, 0, 0]} color={C.gold} hl={hl} />
			<Box size={[0.3, 0.3, 0.02]} pos={[-0.3, 1.25, 0.18]} color={C.red} hl={hl} />
			<Box size={[1.6, 0.06, 0.25]} pos={[0, 0.7, 0.2]} color={C.woodDark} hl={hl} />
			<Cyl r={0.08} h={0.12} pos={[-0.4, 0.78, 0.2]} color={C.red} hl={hl} />
			<Cyl r={0.08} h={0.12} pos={[0, 0.78, 0.2]} color={C.blue} hl={hl} />
			<Cyl r={0.08} h={0.12} pos={[0.4, 0.78, 0.2]} color={C.gold} hl={hl} />
		</group>
	);
}

/** Art-masterskaya: a pottery wheel with a vase on it. */
export function PotteryWheel({highlighted: hl, animate}: TPropProps): ReactNode {
	const wheel = useRef<Group>(null);
	useIdle(wheel, animate, (obj, t) => {
		obj.rotation.y = t * 2.5;
	});
	return (
		<group>
			<Box size={[1.5, 0.7, 1.2]} pos={[0, 0.35, 0]} color={C.wood} hl={hl} />
			<Box size={[1.5, 0.08, 1.2]} pos={[0, 0.74, 0]} color={C.woodDark} hl={hl} />
			<Cyl r={0.2} h={0.1} pos={[0, 0.83, 0]} color={C.dark} hl={hl} />
			<group ref={wheel} position={[0, 0.88, 0]}>
				<Cyl r={0.55} h={0.1} color={C.steel} hl={hl} />
				<Cyl rTop={0.15} r={0.3} h={0.55} pos={[0, 0.32, 0]} color={C.terracotta} hl={hl} />
				<Cyl rTop={0.2} r={0.15} h={0.18} pos={[0, 0.69, 0]} color={C.terracotta} hl={hl} />
			</group>
			<Cyl r={0.22} h={0.3} pos={[1.15, 0.15, 0.3]} color={C.blue} hl={hl} />
			<Ball r={0.18} pos={[-0.95, 0.18, 0.5]} color={C.terracotta} hl={hl} scale={[1, 0.7, 1]} />
		</group>
	);
}

/** Robototehnika: a small friendly robot whose head turns. */
export function Robot({highlighted: hl, animate}: TPropProps): ReactNode {
	const head = useRef<Group>(null);
	useIdle(head, animate, (obj, t) => {
		obj.rotation.y = Math.sin(t * 0.9) * 0.7;
	});
	return (
		<group>
			<Box size={[0.3, 0.65, 0.35]} pos={[-0.25, 0.33, 0]} color={C.steel} hl={hl} />
			<Box size={[0.3, 0.65, 0.35]} pos={[0.25, 0.33, 0]} color={C.steel} hl={hl} />
			<Box size={[0.4, 0.1, 0.5]} pos={[-0.25, 0.05, 0.05]} color={C.dark} hl={hl} />
			<Box size={[0.4, 0.1, 0.5]} pos={[0.25, 0.05, 0.05]} color={C.dark} hl={hl} />
			<Box size={[1.0, 1.0, 0.65]} pos={[0, 1.15, 0]} color={C.brandLight} hl={hl} />
			<Box size={[0.4, 0.3, 0.05]} pos={[0, 1.2, 0.34]} color={C.dark} hl={hl} />
			<Ball r={0.07} pos={[-0.1, 1.2, 0.38]} color={C.red} emissive={C.red} />
			<Ball r={0.07} pos={[0.1, 1.2, 0.38]} color={C.gold} emissive={C.gold} />
			<Box size={[0.2, 0.85, 0.22]} pos={[-0.65, 1.1, 0]} color={C.steel} hl={hl} />
			<Box size={[0.2, 0.85, 0.22]} pos={[0.65, 1.1, 0]} color={C.steel} hl={hl} />
			<group ref={head} position={[0, 1.9, 0]}>
				<Box size={[0.8, 0.55, 0.6]} pos={[0, 0.05, 0]} color={C.white} hl={hl} />
				<Box size={[0.15, 0.15, 0.05]} pos={[-0.18, 0.1, 0.32]} color={C.blue} emissive={C.blue} />
				<Box size={[0.15, 0.15, 0.05]} pos={[0.18, 0.1, 0.32]} color={C.blue} emissive={C.blue} />
				<Cyl r={0.03} h={0.3} pos={[0, 0.45, 0]} color={C.steel} hl={hl} />
				<Ball r={0.08} pos={[0, 0.62, 0]} color={C.red} emissive={C.red} />
			</group>
		</group>
	);
}

/** Megavolt: a tesla coil with flickering sparks. */
export function TeslaCoil({highlighted: hl, animate}: TPropProps): ReactNode {
	const sparks = useRef<Group>(null);
	useIdle(sparks, animate, (obj, t) => {
		obj.visible = Math.sin(t * 37) + Math.sin(t * 23) > -0.4;
		obj.rotation.y = Math.floor(t * 9) * 1.3;
	});
	return (
		<group>
			<Box size={[1.5, 0.3, 1.5]} pos={[0, 0.15, 0]} color={C.dark} hl={hl} />
			<Cyl rTop={0.3} r={0.5} h={1.6} pos={[0, 1.1, 0]} color={C.wood} hl={hl} />
			<Cyl r={0.34} h={0.08} pos={[0, 0.4, 0]} color={C.gold} hl={hl} />
			<Cyl r={0.34} h={0.08} pos={[0, 1.0, 0]} color={C.gold} hl={hl} />
			<Ball r={0.42} pos={[0, 2.15, 0]} color={C.steel} hl={hl} />
			<Ball r={0.18} pos={[0, 2.15, 0]} color={C.purple} emissive={C.purple} />
			<group ref={sparks} position={[0, 2.15, 0]}>
				{(
					[
						[0.7, 0.25, 0.3],
						[-0.6, 0.45, 0.4],
						[0.2, -0.3, -0.75],
						[-0.4, 0.7, -0.5]
					] as const
				).map(([x, y, z]) => (
					<Box
						key={`${x}${y}${z}`}
						size={[0.04, 0.04, 0.9]}
						pos={[x / 2, y / 2, z / 2]}
						rot={[-y * 0.8, Math.atan2(x, z) - 0, 0]}
						color={'#e9ddff'}
						emissive={C.purple}
					/>
				))}
			</group>
		</group>
	);
}
