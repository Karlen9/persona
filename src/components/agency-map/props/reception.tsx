import {ExtrudeGeometry, Shape} from 'three';

import {MapText} from '../MapText';
import {Plant} from './decor';
import {Ball, Box, C, Cone, Cyl, Figure} from './shared';

import type {ReactNode} from 'react';
import type {TPropProps} from './shared';

const ARC_HALF = (105 * Math.PI) / 180;

/** Annular sector around local -z (the back of the desk), extruded upwards from y = 0. */
function arcSlab(inner: number, outer: number, height: number): ExtrudeGeometry {
	// Shape coordinates (x, y) map to world (x, -z) after the rotation below, so the arc is centred on shape angle +90deg.
	const a0 = Math.PI / 2 - ARC_HALF;
	const a1 = Math.PI / 2 + ARC_HALF;
	const shape = new Shape();
	shape.absarc(0, 0, outer, a0, a1, false);
	shape.absarc(0, 0, inner, a1, a0, true);
	shape.closePath();
	const geometry = new ExtrudeGeometry(shape, {depth: height, bevelEnabled: false, curveSegments: 40});
	geometry.rotateX(-Math.PI / 2);
	return geometry;
}

const deskBody = arcSlab(1.55, 2.3, 0.92);
const deskTop = arcSlab(1.45, 2.42, 0.1);
const deskPlinth = arcSlab(1.6, 2.34, 0.12);

/**
 * Reception: a curved front desk wrapping the back (-z) of the prop, with a monitor, a bell, a plant, a chair
 * and a small "PersOna" sign. Visitors stand on the open (+z) side, which faces the camera at rotationY = PI / 4.
 */
export function Reception({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<mesh geometry={deskPlinth} castShadow receiveShadow>
				<meshStandardMaterial
					color={C.dark}
					roughness={0.8}
					emissive={'#ffd9a0'}
					emissiveIntensity={hl ? 0.25 : 0}
				/>
			</mesh>
			<mesh geometry={deskBody} position={[0, 0.12, 0]} castShadow receiveShadow>
				<meshStandardMaterial
					color={C.brand}
					roughness={0.75}
					emissive={'#ffd9a0'}
					emissiveIntensity={hl ? 0.25 : 0}
				/>
			</mesh>
			<mesh geometry={deskTop} position={[0, 1.04, 0]} castShadow receiveShadow>
				<meshStandardMaterial
					color={C.white}
					roughness={0.6}
					emissive={'#ffd9a0'}
					emissiveIntensity={hl ? 0.25 : 0}
				/>
			</mesh>
			{/* Monitor, keyboard and bell on the desk (back centre) */}
			<Cyl r={0.16} h={0.04} pos={[0, 1.16, -1.95]} color={C.dark} hl={hl} />
			<Cyl r={0.04} h={0.3} pos={[0, 1.31, -1.95]} color={C.dark} hl={hl} />
			<Box size={[1.0, 0.62, 0.06]} pos={[0, 1.7, -1.95]} rot={[-0.08, 0, 0]} color={C.dark} hl={hl} />
			<Box
				size={[0.9, 0.52, 0.02]}
				pos={[0, 1.7, -1.91]}
				rot={[-0.08, 0, 0]}
				color={C.glass}
				emissive={C.glass}
			/>
			<Box size={[0.6, 0.03, 0.2]} pos={[0, 1.17, -1.6]} color={C.steel} hl={hl} />
			<Cyl r={0.17} h={0.04} pos={[1.0, 1.16, -1.75]} color={C.gold} hl={hl} />
			<Ball r={0.13} pos={[1.0, 1.2, -1.75]} color={C.gold} hl={hl} scale={[1, 0.7, 1]} />
			<Ball r={0.03} pos={[1.0, 1.32, -1.75]} color={C.gold} hl={hl} />
			<group position={[-1.2, 1.1, -1.6]}>
				<Plant pos={[0, 0, 0]} scale={0.5} />
			</group>
			{/* Sign on two posts behind the desk */}
			<Cyl r={0.05} h={1.4} pos={[-1.15, 1.75, -2.2]} color={C.steel} hl={hl} />
			<Cyl r={0.05} h={1.4} pos={[1.15, 1.75, -2.2]} color={C.steel} hl={hl} />
			<Box size={[2.6, 0.75, 0.1]} pos={[0, 2.65, -2.2]} color={C.white} hl={hl} />
			<Box size={[2.6, 0.08, 0.14]} pos={[0, 3.0, -2.2]} color={C.brand} hl={hl} />
			<MapText
				script={'latin'}
				position={[0, 2.62, -2.14]}
				fontSize={0.42}
				color={'#3fa08d'}
				anchorX={'center'}
				anchorY={'middle'}
				fontWeight={700}
			>
				{'PersOna'}
			</MapText>
			{/* Receptionist behind the desk */}
			<Cone r={0.28} h={0.5} pos={[0.2, 0.3, -1.1]} color={C.dark} hl={hl} />
			<group position={[0.2, 0.55, -1.1]}>
				<Figure color={C.pink} height={1.4} hl={hl} />
			</group>
		</group>
	);
}
