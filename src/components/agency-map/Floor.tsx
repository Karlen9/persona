import {RoundedBox} from '@react-three/drei';
import {useMemo} from 'react';
import {ExtrudeGeometry, Shape} from 'three';

import {MapText} from './MapText';
import {Bench, DeskRows, LowShelf, Window, Workbench} from './props/decor';
import {BookcaseModel, FloorLampModel, PictureModel, PlantModel, ShelfModel, SoftSeatModel} from './props/decorModels';

import type {ReactNode} from 'react';
import type {TAgencyDecor, TAgencyFloor, TAgencyZone} from '@/content/agencyMap';

const WALL_THICKNESS = 0.4;
const PATCH_HEIGHT = 0.03;
const PICTURE_COLORS = ['#e0a93b', '#4a90c2', '#e59aa8', '#8fb08a'];
const SLAB_BOTTOM_GAP = 0.02;

type TWallItem = {at: number; kind: 'window' | 'picture' | 'shelf' | 'bookcase'; y?: number};

/** Dressing along the back (-z) wall: `at` is x. Keeps clear of the dance mirror (x -8.8 .. -3.2). */
const backWallItems: TWallItem[] = [
	{at: -19, kind: 'window'},
	{at: -15.2, kind: 'picture'},
	{at: -11, kind: 'shelf'},
	{at: -0.5, kind: 'window'},
	{at: 2.0, kind: 'bookcase'},
	{at: 3.8, kind: 'picture'},
	{at: 8.5, kind: 'window'},
	{at: 12.5, kind: 'shelf'},
	{at: 16.5, kind: 'window'},
	{at: 20, kind: 'picture'}
];

/** Dressing along the left (-x) wall: `at` is z. Keeps clear of the fitness barre mirror (z 1.9 .. 6.1, up to 1.8 high). */
const leftWallItems: TWallItem[] = [
	{at: -12, kind: 'window'},
	{at: -9.5, kind: 'bookcase'},
	{at: -7.8, kind: 'picture'},
	{at: -4, kind: 'window'},
	{at: -0.4, kind: 'shelf'},
	{at: 4, kind: 'picture', y: 2.75},
	{at: 8.5, kind: 'window'},
	{at: 12.5, kind: 'picture'}
];

function roundedRect(width: number, depth: number, radius: number): Shape {
	const x = -width / 2;
	const y = -depth / 2;
	const r = Math.min(radius, width / 2, depth / 2);
	const shape = new Shape();
	shape.moveTo(x + r, y);
	shape.lineTo(x + width - r, y);
	shape.quadraticCurveTo(x + width, y, x + width, y + r);
	shape.lineTo(x + width, y + depth - r);
	shape.quadraticCurveTo(x + width, y + depth, x + width - r, y + depth);
	shape.lineTo(x + r, y + depth);
	shape.quadraticCurveTo(x, y + depth, x, y + depth - r);
	shape.lineTo(x, y + r);
	shape.quadraticCurveTo(x, y, x + r, y);
	return shape;
}

function Wall({
	size,
	pos,
	color
}: {
	size: [number, number, number];
	pos: [number, number, number];
	color: string;
}): ReactNode {
	return (
		<RoundedBox args={size} radius={0.06} smoothness={3} position={pos} castShadow receiveShadow>
			<meshStandardMaterial color={color} roughness={0.85} metalness={0} />
		</RoundedBox>
	);
}

function WallItem({
	item,
	wall,
	index,
	floor
}: {
	item: TWallItem;
	wall: 'back' | 'left';
	index: number;
	floor: TAgencyFloor;
}): ReactNode {
	const [w, d] = floor.size;
	const axis = wall === 'back' ? 'z' : 'x';
	const face = wall === 'back' ? -d / 2 + WALL_THICKNESS : -w / 2 + WALL_THICKNESS;
	const place = (offset: number, y: number): [number, number, number] =>
		wall === 'back' ? [item.at, y, face + offset] : [face + offset, y, item.at];
	if (item.kind === 'window') return <Window pos={place(0.07, item.y ?? 2.0)} axis={axis} />;
	if (item.kind === 'shelf') return <ShelfModel pos={place(0.3, item.y ?? 1.9)} axis={axis} />;
	if (item.kind === 'bookcase') return <BookcaseModel pos={place(0.34, 0)} axis={axis} />;
	return (
		<PictureModel
			pos={place(0.06, item.y ?? 2.2)}
			axis={axis}
			color={PICTURE_COLORS[index % PICTURE_COLORS.length]}
		/>
	);
}

/** A coloured rug / floor patch (rounded rectangle or circle), slightly raised above the floor. */
function ZonePatch({zone}: {zone: TAgencyZone}): ReactNode {
	const [w, d] = zone.size;
	const geometry = useMemo(() => {
		if (zone.shape !== 'rect') return null;
		const extruded = new ExtrudeGeometry(roundedRect(w, d, 1.2), {
			depth: PATCH_HEIGHT,
			bevelEnabled: false,
			curveSegments: 10
		});
		extruded.rotateX(-Math.PI / 2);
		return extruded;
	}, [zone.shape, w, d]);
	const [cx, cz] = zone.position;
	const elevation = zone.elevation ?? 0;
	const labelZ = zone.shape === 'round' ? cz + d / 2 - 1.3 : cz + d / 2 - 0.7;
	return (
		<group>
			{elevation > 0 ? (
				<>
					<RoundedBox
						args={[w, elevation, d]}
						radius={0.08}
						smoothness={3}
						position={[cx, elevation / 2, cz]}
						castShadow
						receiveShadow
					>
						<meshStandardMaterial color={'#c98f5a'} roughness={0.85} metalness={0} />
					</RoundedBox>
					<RoundedBox
						args={[2.8, 0.2, 0.6]}
						radius={0.05}
						smoothness={3}
						position={[cx + 0.6, 0.1, cz + d / 2 + 0.3]}
						castShadow
						receiveShadow
					>
						<meshStandardMaterial color={'#c98f5a'} roughness={0.85} metalness={0} />
					</RoundedBox>
				</>
			) : null}
			{geometry ? (
				<mesh geometry={geometry} position={[cx, elevation + 0.002, cz]} receiveShadow>
					<meshStandardMaterial color={zone.patchColor} roughness={0.95} metalness={0} />
				</mesh>
			) : (
				<mesh position={[cx, PATCH_HEIGHT / 2 + 0.002, cz]} receiveShadow>
					<cylinderGeometry args={[w / 2, w / 2, PATCH_HEIGHT, 64]} />
					<meshStandardMaterial color={zone.patchColor} roughness={0.95} metalness={0} />
				</mesh>
			)}
			{/* Painted on the floor: flat, reads left to right along +x (parallel to the rug's front edge). */}
			<MapText
				script={'cyrillic'}
				position={[cx, elevation + PATCH_HEIGHT + 0.012, labelZ]}
				rotation={[-Math.PI / 2, 0, 0]}
				fontSize={0.8}
				letterSpacing={0.03}
				color={zone.labelColor}
				anchorX={'center'}
				anchorY={'middle'}
				maxWidth={w - 1}
			>
				{zone.label}
			</MapText>
		</group>
	);
}

function Decor({item, index}: {item: TAgencyDecor; index: number}): ReactNode {
	const pos: [number, number, number] = [item.position[0], 0, item.position[1]];
	switch (item.kind) {
		case 'plant':
			return <PlantModel pos={pos} scale={item.scale ?? 1.25} variant={index % 3 === 1 ? 'small' : 'large'} />;
		case 'floorLamp':
			return <FloorLampModel pos={pos} />;
		case 'bench':
			return <Bench pos={pos} rotationY={item.rotationY} />;
		case 'lowShelf':
			return <LowShelf pos={pos} rotationY={item.rotationY} />;
		case 'deskRows':
			return <DeskRows pos={pos} rotationY={item.rotationY} />;
		case 'workbench':
			return <Workbench pos={pos} rotationY={item.rotationY} />;
		case 'softSeat':
			return <SoftSeatModel pos={pos} rotationY={item.rotationY} />;
	}
}

/**
 * The whole open-plan floor: one slab with a visible edge, two back walls (-x and -z, away from the camera) dressed
 * with windows, pictures and shelves, a coloured patch with a painted name per zone, and plants / benches / low shelving
 * as soft dividers. No interior walls.
 */
export function Floor({
	floor,
	zones,
	decor
}: {
	floor: TAgencyFloor;
	zones: TAgencyZone[];
	decor: TAgencyDecor[];
}): ReactNode {
	const [w, d] = floor.size;
	const t = floor.thickness;
	const h = floor.wallHeight;
	return (
		<group>
			<RoundedBox
				args={[w, t - SLAB_BOTTOM_GAP, d]}
				radius={0.1}
				smoothness={3}
				position={[0, -(t - SLAB_BOTTOM_GAP) / 2 - 0.02, 0]}
				castShadow
				receiveShadow
			>
				<meshStandardMaterial color={floor.edgeColor} roughness={0.9} metalness={0} />
			</RoundedBox>
			<mesh position={[0, -0.03, 0]} receiveShadow>
				<boxGeometry args={[w - 0.5, 0.06, d - 0.5]} />
				<meshStandardMaterial color={floor.floorColor} roughness={0.85} metalness={0} />
			</mesh>
			<Wall size={[w, h, WALL_THICKNESS]} pos={[0, h / 2, -d / 2 + WALL_THICKNESS / 2]} color={floor.wallColor} />
			<Wall
				size={[WALL_THICKNESS, h, d - WALL_THICKNESS]}
				pos={[-w / 2 + WALL_THICKNESS / 2, h / 2, WALL_THICKNESS / 2]}
				color={floor.wallColor}
			/>
			{backWallItems.map((item, index) => (
				<WallItem key={`b${item.at}`} item={item} wall={'back'} index={index} floor={floor} />
			))}
			{leftWallItems.map((item, index) => (
				<WallItem key={`l${item.at}`} item={item} wall={'left'} index={index} floor={floor} />
			))}
			{zones.map((zone) => (
				<ZonePatch key={zone.id} zone={zone} />
			))}
			{decor.map((item, index) => (
				<Decor key={`${item.kind}${index}`} item={item} index={index} />
			))}
		</group>
	);
}
