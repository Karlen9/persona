import {AdaptiveDpr, MapControls, PerformanceMonitor} from '@react-three/drei';
import {Canvas, useFrame, useThree} from '@react-three/fiber';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Vector3} from 'three';

import {Floor} from './Floor';
import {Hotspot} from './Hotspot';
import {modelUrls} from './models/modelConfig';
import {preloadModels} from './models/GltfModel';
import {
	CAMERA_OFFSET,
	MAX_REL_ZOOM,
	MIN_REL_ZOOM,
	clamp,
	computeHomeView,
	formatMapHash,
	parseMapHash,
	replaceHash
} from './view';

import type {ComponentRef, MutableRefObject, ReactNode, RefObject} from 'react';
import type {DirectionalLight, OrthographicCamera} from 'three';
import type {TAgencyBounds, TAgencyMapData} from '@/content/agencyMap';
import type {THotspotTarget, THover} from './Hotspot';
import type {TMapApi} from './view';

export type TAgencyFocus = {x: number; z: number; nonce: number};

type TAgencySceneProps = TAgencyMapData & {
	selectedId: string | null;
	focus: TAgencyFocus | null;
	animate: boolean;
	reducedMotion: boolean;
	active: boolean;
	apiRef: MutableRefObject<TMapApi | null>;
	/** DOM tooltip element rendered by the parent outside the canvas; positioned from here every frame. */
	tipRef: RefObject<HTMLDivElement | null>;
	onPick: (id: string) => void;
	onClear: () => void;
	/** Fired once, after the first rendered frames. */
	onReady: () => void;
};

const BACKGROUND = '#e9e6e1';
const HASH_DEBOUNCE_MS = 300;
const EASE_RATE = 9;

type TRigProps = {
	bounds: TAgencyBounds;
	focus: TAgencyFocus | null;
	reducedMotion: boolean;
	apiRef: MutableRefObject<TMapApi | null>;
};

/** Camera + MapControls: fit-to-viewport, pan clamping, easing, zoom buttons, and the `#map=` URL hash. */
function MapRig({bounds, focus, reducedMotion, apiRef}: TRigProps): ReactNode {
	const camera = useThree((state) => state.camera) as OrthographicCamera;
	const controlsRef = useRef<ComponentRef<typeof MapControls>>(null);
	const st = useRef({
		ready: false,
		interacted: false,
		fit: 1,
		home: {x: 0, z: 0, zoom: 1},
		width: 0,
		height: 0,
		goalTarget: null as Vector3 | null,
		goalZoom: null as number | null,
		timer: 0
	});
	const tmp = useRef({dir: new Vector3(), shift: new Vector3()});

	const shiftBy = useCallback(
		(dx: number, dz: number): void => {
			const controls = controlsRef.current;
			if (!controls) return;
			controls.target.x += dx;
			controls.target.z += dz;
			camera.position.x += dx;
			camera.position.z += dz;
		},
		[camera]
	);

	const setView = useCallback(
		(x: number, z: number, zoom: number): void => {
			const controls = controlsRef.current;
			if (!controls) return;
			controls.target.set(x, 0, z);
			camera.position.set(x + CAMERA_OFFSET[0], CAMERA_OFFSET[1], z + CAMERA_OFFSET[2]);
			camera.zoom = zoom;
			camera.updateProjectionMatrix();
			controls.update();
		},
		[camera]
	);

	const clampZoom = useCallback((zoom: number): number => {
		const {fit} = st.current;
		return clamp(zoom, fit * MIN_REL_ZOOM, fit * MAX_REL_ZOOM);
	}, []);

	const moveTo = useCallback(
		(x: number, z: number, zoom: number | null): void => {
			const controls = controlsRef.current;
			if (!controls) return;
			const s = st.current;
			const tx = clamp(x, bounds.minX, bounds.maxX);
			const tz = clamp(z, bounds.minZ, bounds.maxZ);
			if (reducedMotion) {
				shiftBy(tx - controls.target.x, tz - controls.target.z);
				if (zoom !== null) {
					camera.zoom = clampZoom(zoom);
					camera.updateProjectionMatrix();
				}
				controls.update();
				return;
			}
			s.goalTarget = new Vector3(tx, 0, tz);
			s.goalZoom = zoom === null ? null : clampZoom(zoom);
		},
		[bounds, camera, clampZoom, reducedMotion, shiftBy]
	);

	const writeHash = useCallback((): void => {
		const controls = controlsRef.current;
		const s = st.current;
		if (!controls || !s.interacted) return;
		replaceHash(formatMapHash({x: controls.target.x, z: controls.target.z, zoom: camera.zoom / s.fit}));
	}, [camera]);

	const handleChange = useCallback((): void => {
		const controls = controlsRef.current;
		if (!controls) return;
		const s = st.current;
		const {dir, shift} = tmp.current;
		// Keep the target on the ground plane by sliding it (and the camera) along the view ray: the picture does not change.
		dir.copy(controls.target).sub(camera.position).normalize();
		if (Math.abs(dir.y) > 1e-4) {
			shift.copy(dir).multiplyScalar(-controls.target.y / dir.y);
			controls.target.add(shift);
			camera.position.add(shift);
		}
		const cx = clamp(controls.target.x, bounds.minX, bounds.maxX);
		const cz = clamp(controls.target.z, bounds.minZ, bounds.maxZ);
		if (cx !== controls.target.x || cz !== controls.target.z)
			shiftBy(cx - controls.target.x, cz - controls.target.z);
		if (s.interacted) {
			window.clearTimeout(s.timer);
			s.timer = window.setTimeout(writeHash, HASH_DEBOUNCE_MS);
		}
	}, [bounds, camera, shiftBy, writeHash]);

	const handleStart = useCallback((): void => {
		const s = st.current;
		s.interacted = true;
		s.goalTarget = null;
		s.goalZoom = null;
	}, []);

	useFrame((state, delta) => {
		const controls = controlsRef.current;
		if (!controls) return;
		const s = st.current;
		const {width, height} = state.size;
		if (!s.ready || width !== s.width || height !== s.height) {
			s.width = width;
			s.height = height;
			const {fit, view} = computeHomeView(width, height, bounds);
			s.fit = fit;
			s.home = view;
			controls.minZoom = s.fit * MIN_REL_ZOOM;
			controls.maxZoom = s.fit * MAX_REL_ZOOM;
			if (!s.ready) {
				s.ready = true;
				const restored = parseMapHash(window.location.hash, bounds);
				if (restored) {
					s.interacted = true;
					setView(restored.x, restored.z, clampZoom(restored.zoom * s.fit));
				} else {
					setView(s.home.x, s.home.z, s.home.zoom);
				}
			} else if (!s.interacted) {
				setView(s.home.x, s.home.z, s.home.zoom);
			} else {
				camera.zoom = clampZoom(camera.zoom);
				camera.updateProjectionMatrix();
			}
		}
		if (s.goalTarget || s.goalZoom !== null) {
			const k = 1 - Math.exp(-delta * EASE_RATE);
			if (s.goalTarget) {
				const dx = s.goalTarget.x - controls.target.x;
				const dz = s.goalTarget.z - controls.target.z;
				if (Math.hypot(dx, dz) < 0.02) {
					shiftBy(dx, dz);
					s.goalTarget = null;
				} else {
					shiftBy(dx * k, dz * k);
				}
			}
			if (s.goalZoom !== null) {
				const diff = s.goalZoom - camera.zoom;
				if (Math.abs(diff) < s.goalZoom * 0.002) {
					camera.zoom = s.goalZoom;
					s.goalZoom = null;
				} else {
					camera.zoom += diff * k;
				}
				camera.updateProjectionMatrix();
			}
			controls.update();
		}
	});

	useEffect(() => {
		if (!focus || !st.current.ready) return;
		const s = st.current;
		s.interacted = true;
		const near = Math.max(s.fit * 2, s.home.zoom * 1.25);
		moveTo(focus.x, focus.z, camera.zoom < near ? Math.max(s.fit * 2.5, s.home.zoom * 1.5) : null);
	}, [focus, camera, moveTo]);

	useEffect(() => {
		const s = st.current;
		apiRef.current = {
			zoomBy: (factor) => {
				s.interacted = true;
				const controls = controlsRef.current;
				if (!controls) return;
				moveTo(controls.target.x, controls.target.z, (s.goalZoom ?? camera.zoom) * factor);
			},
			reset: () => {
				window.clearTimeout(s.timer);
				s.interacted = false;
				replaceHash('');
				moveTo(s.home.x, s.home.z, s.home.zoom);
			}
		};
		return () => {
			apiRef.current = null;
			window.clearTimeout(s.timer);
		};
	}, [apiRef, camera, moveTo]);

	return (
		<MapControls
			ref={controlsRef}
			makeDefault
			enableRotate={false}
			enableDamping
			dampingFactor={0.12}
			zoomToCursor
			screenSpacePanning
			onChange={handleChange}
			onStart={handleStart}
		/>
	);
}

/** Calls `onReady` once the first frames of the scene (after Suspense and the first camera fit) have been rendered. */
function ReadySignal({onReady}: {onReady: () => void}): ReactNode {
	const frames = useRef(0);
	useFrame(() => {
		frames.current += 1;
		if (frames.current === 3) onReady();
	});
	return null;
}

/** Starts fetching every model file once the canvas exists (client only), so props pop in without a waterfall. */
function PreloadModels(): ReactNode {
	useEffect(() => {
		preloadModels(modelUrls);
	}, []);
	return null;
}

/** Shadows are baked: the shadow map only re-renders for the first few frames and when its size changes. */
function ShadowBaker({light, size}: {light: MutableRefObject<DirectionalLight | null>; size: number}): ReactNode {
	const gl = useThree((state) => state.gl);
	const frames = useRef(0);
	useEffect(() => {
		const shadow = light.current?.shadow;
		if (!shadow) return;
		shadow.map?.dispose();
		shadow.map = null;
		shadow.mapSize.set(size, size);
		frames.current = 0;
	}, [light, size]);
	useFrame(() => {
		if (frames.current < 4) {
			gl.shadowMap.needsUpdate = true;
			frames.current += 1;
		}
	});
	return null;
}

/**
 * Positions the DOM hover tooltip: projects the hovered prop's world position to screen pixels every frame and writes
 * it straight to the element (no React state). Replaces drei <Html>, which unmounts a React root inside the render.
 */
function HoverTip({
	hoverRef,
	tipRef
}: {
	hoverRef: MutableRefObject<THover | null>;
	tipRef: RefObject<HTMLDivElement | null>;
}): ReactNode {
	const point = useRef(new Vector3());
	const shown = useRef({visible: false, label: '', transform: ''});
	useFrame((state) => {
		const el = tipRef.current;
		if (!el) return;
		const last = shown.current;
		const hover = hoverRef.current;
		if (!hover) {
			if (last.visible) {
				el.style.opacity = '0';
				last.visible = false;
			}
			return;
		}
		state.camera.updateMatrixWorld();
		point.current.set(...hover.position).project(state.camera);
		const x = Math.round((point.current.x * 0.5 + 0.5) * state.size.width);
		const y = Math.round((-point.current.y * 0.5 + 0.5) * state.size.height);
		if (hover.label !== last.label) {
			el.textContent = hover.label;
			last.label = hover.label;
		}
		const transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
		if (transform !== last.transform) {
			el.style.transform = transform;
			last.transform = transform;
		}
		if (!last.visible) {
			el.style.opacity = '1';
			last.visible = true;
		}
	});
	return null;
}

export function AgencyScene({
	floor,
	zones,
	hotspots,
	specialHotspots,
	decor,
	bounds,
	selectedId,
	focus,
	animate,
	reducedMotion,
	active,
	apiRef,
	tipRef,
	onPick,
	onClear,
	onReady
}: TAgencySceneProps): ReactNode {
	const [slow, setSlow] = useState(false);
	const keyLight = useRef<DirectionalLight>(null);
	const shadowSize = slow ? 1024 : 2048;
	const hoverRef = useRef<THover | null>(null);
	const handleHover = useCallback((hover: THover | null): void => {
		hoverRef.current = hover;
	}, []);
	const targets = useMemo<THotspotTarget[]>(
		() => [
			...hotspots.map(
				(item): THotspotTarget => ({
					id: item.slug,
					kind: item.kind,
					position: item.position,
					rotationY: item.rotationY,
					scale: item.scale,
					label: item.direction.shortTitle
				})
			),
			...specialHotspots.map(
				(item): THotspotTarget => ({
					id: item.id,
					kind: item.kind,
					position: item.position,
					rotationY: item.rotationY,
					scale: item.scale,
					hitRadius: item.hitRadius,
					label: item.hoverLabel
				})
			)
		],
		[hotspots, specialHotspots]
	);
	// The shadow camera must cover the whole floor whatever the light angle: use its half-diagonal plus a margin.
	const shadowExtent = Math.hypot(bounds.maxX - bounds.minX, bounds.maxZ - bounds.minZ) / 2 + 3;

	return (
		<Canvas
			aria-hidden
			orthographic
			shadows={'percentage'}
			dpr={[1, slow ? 1 : 1.75]}
			frameloop={active ? 'always' : 'never'}
			camera={{position: CAMERA_OFFSET, zoom: 10, near: 0.1, far: 300}}
			gl={{antialias: true, powerPreference: 'high-performance'}}
			style={{touchAction: 'none'}}
			onCreated={({gl}) => {
				gl.shadowMap.autoUpdate = false;
			}}
		>
			<color attach={'background'} args={[BACKGROUND]} />
			<hemisphereLight args={['#fff4e6', '#c9b8a6', 0.9]} />
			<directionalLight
				ref={keyLight}
				position={[8, 45, 38]}
				intensity={1.6}
				color={'#fff0dc'}
				castShadow
				shadow-mapSize={[shadowSize, shadowSize]}
				shadow-camera-left={-shadowExtent}
				shadow-camera-right={shadowExtent}
				shadow-camera-top={shadowExtent}
				shadow-camera-bottom={-shadowExtent}
				shadow-camera-near={1}
				shadow-camera-far={140}
				shadow-bias={-0.0004}
				shadow-normalBias={0.04}
			/>
			<directionalLight position={[-20, 12, -10]} intensity={0.25} color={'#dfe8ff'} />
			<ShadowBaker light={keyLight} size={shadowSize} />
			<PerformanceMonitor onDecline={() => setSlow(true)} onIncline={() => setSlow(false)} />
			<AdaptiveDpr />
			<MapRig bounds={bounds} focus={focus} reducedMotion={reducedMotion} apiRef={apiRef} />
			<HoverTip hoverRef={hoverRef} tipRef={tipRef} />
			<PreloadModels />

			<mesh
				rotation={[-Math.PI / 2, 0, 0]}
				position={[0, -0.6, 0]}
				onClick={(event) => {
					if (event.delta > 6) return;
					onClear();
				}}
			>
				<planeGeometry args={[400, 400]} />
				<meshBasicMaterial visible={false} />
			</mesh>
			<Floor floor={floor} zones={zones} decor={decor} />
			{targets.map((target) => (
				<Hotspot
					key={target.id}
					target={target}
					selected={target.id === selectedId}
					animate={animate}
					onPick={onPick}
					onHover={handleHover}
				/>
			))}
			<ReadySignal onReady={onReady} />
		</Canvas>
	);
}
