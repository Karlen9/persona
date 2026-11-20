import {useRef} from 'react';

import {Ball, Box, C, Cyl, Pill, useIdle} from './shared';

import type {ReactNode} from 'react';
import type {Group} from 'three';
import type {TPropProps} from './shared';

/** Vokal: a mic stand on a small round stage. */
export function Microphone({highlighted: hl, animate}: TPropProps): ReactNode {
	const mic = useRef<Group>(null);
	useIdle(mic, animate, (obj, t) => {
		obj.position.y = Math.sin(t * 2) * 0.05;
		obj.rotation.z = Math.sin(t * 1.3) * 0.08;
	});
	return (
		<group>
			<Cyl r={1.5} h={0.25} pos={[0, 0.125, 0]} color={C.rose} hl={hl} />
			<Cyl r={1.15} h={0.04} pos={[0, 0.27, 0]} color={C.pink} hl={hl} />
			<Cyl r={0.35} h={0.06} pos={[0, 0.32, 0]} color={C.dark} hl={hl} />
			<Cyl r={0.04} h={1.4} pos={[0, 1.05, 0]} color={C.steel} hl={hl} />
			<group position={[0, 1.78, 0]}>
				<group ref={mic}>
					<Cyl r={0.05} h={0.3} pos={[0, -0.12, 0]} color={C.dark} hl={hl} />
					<Ball r={0.17} pos={[0, 0.1, 0]} color={C.dark} hl={hl} />
					<Ball r={0.12} pos={[0, 0.12, 0]} color={C.steel} hl={hl} scale={[1.2, 1, 1.2]} />
				</group>
			</group>
		</group>
	);
}

/** Muzykalnye instrumenty: a grand piano with a bench. Keyboard faces +z. */
export function Piano({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<Box size={[2.8, 0.3, 1.8]} pos={[0, 0.75, 0]} color={C.dark} hl={hl} />
			<Box size={[2.8, 0.05, 1.8]} pos={[0, 1.2, -0.55]} rot={[-0.55, 0, 0]} color={C.dark} hl={hl} />
			<Box size={[2.2, 0.07, 0.5]} pos={[0, 0.93, 0.95]} color={C.white} hl={hl} />
			{[-0.8, -0.5, -0.1, 0.2, 0.5, 0.8].map((x) => (
				<Box key={x} size={[0.08, 0.05, 0.28]} pos={[x, 0.98, 0.88]} color={C.dark} hl={hl} />
			))}
			{(
				[
					[-1.25, -0.7],
					[1.25, -0.7],
					[1.25, 0.7]
				] as const
			).map(([x, z]) => (
				<Cyl key={`${x}${z}`} r={0.07} h={0.6} pos={[x, 0.3, z]} color={C.dark} hl={hl} />
			))}
			<Box size={[1.2, 0.08, 0.5]} pos={[0, 0.5, 1.6]} color={C.rose} hl={hl} />
			<Cyl r={0.05} h={0.46} pos={[-0.45, 0.23, 1.6]} color={C.dark} hl={hl} />
			<Cyl r={0.05} h={0.46} pos={[0.45, 0.23, 1.6]} color={C.dark} hl={hl} />
		</group>
	);
}

/** Teatr: a small stage with a curtain and two masks. */
export function CurtainStage({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<Box size={[4.2, 0.3, 2.4]} pos={[0, 0.15, 0]} color={C.woodDark} hl={hl} />
			<Box size={[4, 2.4, 0.15]} pos={[0, 1.5, -1.1]} color={C.rose} hl={hl} />
			<Box size={[1.1, 2.4, 0.3]} pos={[-1.55, 1.5, -0.95]} color={'#b8395f'} hl={hl} />
			<Box size={[1.1, 2.4, 0.3]} pos={[1.55, 1.5, -0.95]} color={'#b8395f'} hl={hl} />
			<Box size={[4.2, 0.45, 0.4]} pos={[0, 2.85, -0.9]} color={C.gold} hl={hl} />
			<Cyl r={0.26} h={0.05} pos={[-0.5, 1.8, -1.0]} rot={[Math.PI / 2, 0, 0]} color={C.white} hl={hl} />
			<Cyl r={0.26} h={0.05} pos={[0.5, 1.8, -1.0]} rot={[Math.PI / 2, 0, 0]} color={C.dark} hl={hl} />
			<Pill r={0.2} len={0.5} pos={[0, 0.85, 0.4]} color={C.brand} hl={hl} />
			<Ball r={0.19} pos={[0, 1.5, 0.4]} color={C.skin} hl={hl} />
		</group>
	);
}
