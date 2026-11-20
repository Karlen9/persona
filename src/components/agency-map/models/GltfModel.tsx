import {useAnimations, useGLTF} from '@react-three/drei';
import {useThree} from '@react-three/fiber';
import {useEffect, useLayoutEffect, useMemo} from 'react';
import {Box3, Color, Vector3} from 'three';
import {clone as cloneWithSkeleton} from 'three/examples/jsm/utils/SkeletonUtils.js';

import {modelConfig} from './modelConfig';

import type {ReactNode} from 'react';
import type {AnimationClip, Material, Object3D} from 'three';
import type {TModelConfig, TModelKey} from './modelConfig';

type TVec3 = [number, number, number];

type TGltfModelProps = {
	model: TModelKey;
	highlighted?: boolean;
	animate?: boolean;
	position?: TVec3;
	rotationY?: number;
	/** Extra uniform scale on top of the normalised size. */
	scale?: number;
};

type TTrackedMaterial = {
	material: Material & {emissive: Color; emissiveIntensity: number};
	color: Color;
	intensity: number;
};

type TPrepared = {root: Object3D; scale: number; position: TVec3; materials: TTrackedMaterial[]};

const HIGHLIGHT_COLOR = '#ffd9a0';
const HIGHLIGHT_INTENSITY = 0.25;

const size = new Vector3();
const centre = new Vector3();

function hasEmissive(material: Material): material is TTrackedMaterial['material'] {
	return 'emissive' in material && material.emissive instanceof Color;
}

/** Clones the source, applies the pre-rotation and normalises its box. Materials are cloned so highlights stay local. */
function prepare(source: Object3D, config: TModelConfig): TPrepared {
	const root = cloneWithSkeleton(source);
	if (config.rotation) root.rotation.set(...config.rotation);
	root.updateMatrixWorld(true);
	const box = new Box3().setFromObject(root);
	box.getSize(size);
	box.getCenter(centre);
	const fit = config.fit;
	const reference = 'height' in fit ? size.y : 'width' in fit ? size.x : Math.max(size.x, size.y, size.z);
	const target = 'height' in fit ? fit.height : 'width' in fit ? fit.width : fit.maxSide;
	const scale = reference > 0 ? target / reference : 1;

	const materials: TTrackedMaterial[] = [];
	root.traverse((object) => {
		const mesh = object as Object3D & {isMesh?: boolean; material?: Material | Material[]};
		if (!mesh.isMesh || !mesh.material) return;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		const own = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map((material) => {
			const copy = material.clone();
			if (hasEmissive(copy))
				materials.push({material: copy, color: copy.emissive.clone(), intensity: copy.emissiveIntensity});
			return copy;
		});
		mesh.material = Array.isArray(mesh.material) ? own : own[0];
	});

	return {
		root,
		scale,
		position: [-centre.x * scale, -box.min.y * scale, -centre.z * scale],
		materials
	};
}

function ModelAnimation({
	root,
	clips,
	name,
	animate
}: {
	root: Object3D;
	clips: AnimationClip[];
	name: string;
	animate: boolean;
}): ReactNode {
	const {actions} = useAnimations(clips, root);
	useEffect(() => {
		if (!animate) return;
		const action = actions[name];
		action?.reset().play();
		return () => {
			action?.stop();
		};
	}, [actions, name, animate]);
	return null;
}

/**
 * A glTF model placed on the ground (bottom at y = 0, centred on x/z) at a size set by `modelConfig`. The scene is
 * cloned per instance, with its own materials; suspends while the file loads, so wrap it in <Suspense>.
 */
export function GltfModel({
	model,
	highlighted = false,
	animate = false,
	position,
	rotationY,
	scale = 1
}: TGltfModelProps): ReactNode {
	const config: TModelConfig = modelConfig[model];
	const gltf = useGLTF(config.url, false, false);
	const prepared = useMemo(() => prepare(gltf.scene, config), [gltf.scene, config]);
	const gl = useThree((state) => state.gl);

	// Shadows are baked for the first few frames only; a model that pops in later asks for one more update.
	useLayoutEffect(() => {
		gl.shadowMap.needsUpdate = true;
	}, [gl, prepared]);

	useEffect(() => {
		for (const item of prepared.materials) {
			if (highlighted) {
				item.material.emissive.set(HIGHLIGHT_COLOR);
				item.material.emissiveIntensity = HIGHLIGHT_INTENSITY;
			} else {
				item.material.emissive.copy(item.color);
				item.material.emissiveIntensity = item.intensity;
			}
		}
	}, [highlighted, prepared]);

	return (
		<group
			position={[
				(position?.[0] ?? 0) + (config.offset?.[0] ?? 0),
				(position?.[1] ?? 0) + (config.offset?.[1] ?? 0),
				(position?.[2] ?? 0) + (config.offset?.[2] ?? 0)
			]}
			rotation={[0, rotationY ?? 0, 0]}
			scale={scale}
		>
			<group position={prepared.position} scale={prepared.scale}>
				<primitive object={prepared.root} />
			</group>
			{config.animation ? (
				<ModelAnimation
					root={prepared.root}
					clips={gltf.animations}
					name={config.animation}
					animate={animate}
				/>
			) : null}
		</group>
	);
}

/** Preloads every model file. Call from inside the canvas (client only), not at module import. */
export function preloadModels(urls: readonly string[]): void {
	for (const url of urls) useGLTF.preload(url, false, false);
}
