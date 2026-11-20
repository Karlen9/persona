// glTF-backed versions of the props. Every one keeps the `TPropProps` contract and is wrapped (see `withModels`) in its
// own <Suspense> whose fallback is the procedural prop, so the scene shows at once and models pop in as they load.
// Model sizes and orientation are normalised in `models/modelConfig.ts`; positions below are in prop-local metres.
import {Suspense, useRef} from 'react';

import {GltfModel} from '../models/GltfModel';
import {YogaBody} from './fitness';
import {Ball, Box, C, Cone, Cyl, Figure, Pill, useIdle} from './shared';

import type {ComponentType, ReactNode} from 'react';
import type {Group} from 'three';
import type {TPropProps} from './shared';

/** Keeps the procedural prop as is and adds model dressing next to it (the dressing pops in when loaded). */
export function withDressing(
	Base: ComponentType<TPropProps>,
	Dressing: ComponentType<TPropProps>
): ComponentType<TPropProps> {
	return function Dressed(props: TPropProps): ReactNode {
		return (
			<>
				<Base {...props} />
				<Suspense fallback={null}>
					<Dressing {...props} />
				</Suspense>
			</>
		);
	};
}

/** Wraps a model-backed prop in a Suspense boundary that shows `Fallback` (the procedural prop) while loading. */
export function withModels(
	Model: ComponentType<TPropProps>,
	Fallback: ComponentType<TPropProps>
): ComponentType<TPropProps> {
	return function ModelBacked(props: TPropProps): ReactNode {
		return (
			<Suspense fallback={<Fallback {...props} />}>
				<Model {...props} />
			</Suspense>
		);
	};
}

/** Vokal: a mic stand on a round podium. */
export function MicrophoneModel({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<Cyl r={1.5} h={0.25} pos={[0, 0.125, 0]} color={C.rose} hl={hl} />
			<Cyl r={1.15} h={0.04} pos={[0, 0.27, 0]} color={C.pink} hl={hl} />
			<GltfModel model={'microphone'} highlighted={hl} position={[0, 0.29, 0]} />
		</group>
	);
}

/** Muzykalnye instrumenty: a piano and its bench. */
export function PianoModel({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<GltfModel model={'piano'} highlighted={hl} />
			<Box size={[1.2, 0.08, 0.5]} pos={[0, 0.5, 1.6]} color={C.rose} hl={hl} />
			<Cyl r={0.05} h={0.46} pos={[-0.45, 0.23, 1.6]} color={C.dark} hl={hl} />
			<Cyl r={0.05} h={0.46} pos={[0.45, 0.23, 1.6]} color={C.dark} hl={hl} />
		</group>
	);
}

/** Teatr: a small stage with curtains and a performer. */
export function CurtainStageModel({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<Box size={[4.2, 0.3, 2.4]} pos={[0, 0.15, 0]} color={C.woodDark} hl={hl} />
			<Box size={[3.9, 2.6, 0.12]} pos={[0, 1.6, -1.1]} color={C.rose} hl={hl} />
			<GltfModel model={'curtains'} highlighted={hl} position={[0, 0.3, -0.95]} />
			<Pill r={0.2} len={0.5} pos={[0, 0.85, 0.4]} color={C.brand} hl={hl} />
			<Ball r={0.19} pos={[0, 1.5, 0.4]} color={C.skin} hl={hl} />
		</group>
	);
}

/** Tancy dressing: a pair of speakers beside the (procedural) mirror wall and disco ball. */
export function SpeakerDressing({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<GltfModel model={'speaker'} highlighted={hl} position={[-3.0, 0, 0.35]} rotationY={0.2} />
			<GltfModel model={'speaker'} highlighted={hl} position={[3.0, 0, 0.35]} rotationY={-0.2} />
		</group>
	);
}

/** Joga: a mat with the seated figure and a block. */
export function YogaMatModel({highlighted: hl, animate}: TPropProps): ReactNode {
	return (
		<group rotation={[0, 0.3, 0]}>
			<GltfModel model={'yogaMat'} highlighted={hl} />
			<Box size={[0.35, 0.22, 0.22]} pos={[-0.85, 0.11, -0.7]} color={C.gold} hl={hl} />
			<YogaBody highlighted={hl} animate={animate} />
		</group>
	);
}

/** Barre fitnes: a rail mounted on a mirror panel, plus a pair of ballet shoes. */
export function BarreModel({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<Box size={[4.2, 1.8, 0.08]} pos={[0, 0.9, -0.7]} color={C.glass} hl={hl} />
			<GltfModel model={'barre'} highlighted={hl} position={[0, 1.1, -0.6]} />
			<Box size={[0.14, 0.08, 0.3]} pos={[-0.3, 0.04, 0.7]} color={C.pink} hl={hl} />
			<Box size={[0.14, 0.08, 0.3]} pos={[0.3, 0.04, 0.7]} color={C.pink} hl={hl} />
		</group>
	);
}

/** Risovanie: an easel. */
export function EaselModel({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<GltfModel model={'easel'} highlighted={hl} />
		</group>
	);
}

/** Art-masterskaya: the procedural wheel and bench with a clay pot spinning on it. */
export function PotteryWheelModel({highlighted: hl, animate}: TPropProps): ReactNode {
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
				<GltfModel model={'clayPot'} highlighted={hl} position={[0, 0.05, 0]} />
			</group>
			<Cyl r={0.22} h={0.3} pos={[1.15, 0.15, 0.3]} color={C.blue} hl={hl} />
			<Ball r={0.18} pos={[-0.95, 0.18, 0.5]} color={C.terracotta} hl={hl} scale={[1, 0.7, 1]} />
		</group>
	);
}

/** Robototehnika: the animated robot (idle clip). */
export function RobotModel({highlighted: hl, animate}: TPropProps): ReactNode {
	return (
		<group>
			<GltfModel model={'robot'} highlighted={hl} animate={animate} />
		</group>
	);
}

/** Megavolt dressing: a microscope on a small table beside the (procedural) coil. */
export function MicroscopeDressing({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<Box size={[0.9, 0.08, 0.7]} pos={[1.7, 0.6, 0.9]} color={C.wood} hl={hl} />
			<Box size={[0.8, 0.56, 0.05]} pos={[1.7, 0.28, 0.9]} color={C.woodDark} hl={hl} />
			<GltfModel model={'microscope'} highlighted={hl} position={[1.7, 0.64, 0.9]} rotationY={-0.6} />
		</group>
	);
}

/** Shahmaty: a chess set on a small table. */
export function ChessboardModel({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<Box size={[1.9, 0.1, 1.9]} pos={[0, 0.72, 0]} color={C.wood} hl={hl} />
			{([-0.8, 0.8] as const).flatMap((x) =>
				([-0.8, 0.8] as const).map((z) => (
					<Box key={`${x}${z}`} size={[0.1, 0.7, 0.1]} pos={[x, 0.35, z]} color={C.woodDark} hl={hl} />
				))
			)}
			<GltfModel model={'chessSet'} highlighted={hl} position={[0, 0.77, 0]} />
		</group>
	);
}

const deskPlaces: [number, number][] = [-1, 0, 1].flatMap((col) =>
	[-0.75, 0.75].map((z): [number, number] => [col * 1.15, z])
);

/** Podgotovka k shkole: two rows of school desks (one loaded file, cloned per desk). */
export function SchoolDesksModel({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			{deskPlaces.map(([x, z]) => (
				<GltfModel key={`${x}${z}`} model={'schoolDesk'} highlighted={hl} position={[x, 0, z]} />
			))}
		</group>
	);
}

/** Yazykovaya shkola: a globe on a small desk. */
export function GlobeModel({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<Box size={[1.5, 0.08, 0.95]} pos={[0, 0.75, 0]} color={C.wood} hl={hl} />
			<Box size={[0.08, 0.72, 0.85]} pos={[-0.68, 0.36, 0]} color={C.woodDark} hl={hl} />
			<Box size={[0.08, 0.72, 0.85]} pos={[0.68, 0.36, 0]} color={C.woodDark} hl={hl} />
			<GltfModel model={'globe'} highlighted={hl} position={[0, 0.79, 0]} />
		</group>
	);
}

/** Logoped: a desk with a speech bubble and a standing mirror beside it. */
export function MirrorDeskModel({highlighted: hl, animate}: TPropProps): ReactNode {
	const bubble = useRef<Group>(null);
	useIdle(bubble, animate, (obj, t) => {
		obj.position.y = 2.0 + Math.sin(t * 1.8) * 0.06;
	});
	return (
		<group>
			<Box size={[1.7, 0.08, 0.9]} pos={[-0.3, 0.75, 0]} color={C.wood} hl={hl} />
			<Box size={[0.08, 0.72, 0.8]} pos={[-1.05, 0.36, 0]} color={C.woodDark} hl={hl} />
			<Box size={[0.08, 0.72, 0.8]} pos={[0.45, 0.36, 0]} color={C.woodDark} hl={hl} />
			<GltfModel model={'mirror'} highlighted={hl} position={[1.2, 0, 0]} rotationY={0.5} />
			<group ref={bubble} position={[-0.3, 2.0, 0.1]}>
				<Ball r={0.4} color={C.white} hl={hl} scale={[1.5, 0.9, 0.5]} />
				<Ball r={0.06} pos={[-0.25, 0, 0.2]} color={C.brand} hl={hl} />
				<Ball r={0.06} pos={[0, 0, 0.2]} color={C.brand} hl={hl} />
				<Ball r={0.06} pos={[0.25, 0, 0.2]} color={C.brand} hl={hl} />
				<Cone r={0.1} h={0.25} pos={[-0.3, -0.45, 0]} rot={[0, 0, Math.PI]} color={C.white} hl={hl} />
			</group>
		</group>
	);
}

/** Prodlenka: a picnic-style lunch table. */
export function LunchTableModel({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<GltfModel model={'lunchTable'} highlighted={hl} />
		</group>
	);
}

/** Semejnaya shkola: a sofa with a small family, an ottoman and a coffee table. Faces +z. */
export function FamilySofaModel({highlighted: hl, animate}: TPropProps): ReactNode {
	const kid = useRef<Group>(null);
	useIdle(kid, animate, (obj, t) => {
		obj.position.y = Math.abs(Math.sin(t * 2)) * 0.05;
	});
	return (
		<group>
			<GltfModel model={'sofa'} highlighted={hl} position={[0, 0, -0.5]} />
			<group position={[-0.6, 0.45, -0.5]}>
				<Figure color={C.brand} height={1.15} hl={hl} />
			</group>
			<group ref={kid} position={[0.2, 0.45, -0.45]}>
				<Figure color={C.gold} height={0.8} hl={hl} />
			</group>
			<group position={[0.75, 0.45, -0.5]}>
				<Figure color={C.blue} height={0.9} hl={hl} />
			</group>
			<GltfModel model={'coffeeTable'} highlighted={hl} position={[0, 0, 1.0]} />
			<GltfModel model={'ottoman'} highlighted={hl} position={[1.7, 0, 1.0]} rotationY={0.3} />
		</group>
	);
}

/** Dlya vzroslyh: two armchairs facing each other across a round table. */
export function ArmchairsModel({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<GltfModel model={'armchair'} highlighted={hl} position={[-1.5, 0, 0]} rotationY={Math.PI / 2} />
			<GltfModel model={'armchair'} highlighted={hl} position={[1.5, 0, 0]} rotationY={-Math.PI / 2} />
			<GltfModel model={'roundTable'} highlighted={hl} />
		</group>
	);
}

/** Individualnye zanyatiya dlya vzroslyh: a desk with a model lamp, a laptop and books. */
export function DeskLampModel({highlighted: hl}: TPropProps): ReactNode {
	return (
		<group>
			<Box size={[2.2, 0.08, 1.0]} pos={[0, 0.75, 0]} color={C.wood} hl={hl} />
			<Box size={[0.08, 0.72, 0.9]} pos={[-1.0, 0.36, 0]} color={C.woodDark} hl={hl} />
			<Box size={[0.08, 0.72, 0.9]} pos={[1.0, 0.36, 0]} color={C.woodDark} hl={hl} />
			<GltfModel model={'deskLamp'} highlighted={hl} position={[-0.7, 0.79, -0.15]} />
			<Box size={[0.7, 0.03, 0.5]} pos={[0.3, 0.81, 0.1]} color={C.steel} hl={hl} />
			<Box size={[0.7, 0.45, 0.03]} pos={[0.3, 1.0, -0.15]} rot={[-0.25, 0, 0]} color={C.dark} hl={hl} />
			<Box size={[0.5, 0.06, 0.35]} pos={[0.8, 0.82, 0.3]} color={C.red} hl={hl} />
			<Box size={[0.5, 0.06, 0.35]} pos={[0.8, 0.88, 0.3]} color={C.blue} hl={hl} />
		</group>
	);
}
