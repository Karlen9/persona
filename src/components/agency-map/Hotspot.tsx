import {useFrame} from '@react-three/fiber';
import {memo, useEffect, useRef, useState} from 'react';

import {agencyProps} from './props';

import type {ReactNode} from 'react';
import type {Group} from 'three';
import type {ThreeEvent} from '@react-three/fiber';
import type {TAgencyPropKind} from '@/content/agencyMap';

/** Anything the map can place and tap: a direction prop or a special prop (reception). */
export type THotspotTarget = {
	id: string;
	kind: TAgencyPropKind;
	position: [number, number, number];
	rotationY?: number;
	scale?: number;
	/** Radius of the invisible hit cylinder and highlight ring (before `scale`). */
	hitRadius?: number;
	/** Text of the hover tooltip. */
	label: string;
};

export type THover = {id: string; label: string; position: [number, number, number]};

type THotspotProps = {
	target: THotspotTarget;
	selected: boolean;
	animate: boolean;
	onPick: (id: string) => void;
	/** Reports the hovered target (and null when it is left). The tooltip itself is a DOM overlay outside the canvas. */
	onHover: (hover: THover | null) => void;
};

/** Click movement (px) above which a pointer gesture is a drag, not a click. */
const DRAG_THRESHOLD = 6;

const noRaycast = (): void => undefined;

/** Wraps a prop from `agencyProps` with placement, hover/selection feedback and click handling. */
export const Hotspot = memo(function Hotspot({target, selected, animate, onPick, onHover}: THotspotProps): ReactNode {
	const Prop = agencyProps[target.kind];
	const baseScale = target.scale ?? 1;
	const hitRadius = target.hitRadius ?? 1.6;
	const [hovered, setHovered] = useState(false);
	const inner = useRef<Group>(null);
	const highlighted = hovered || selected;
	const [px, py, pz] = target.position;

	useFrame((_, delta) => {
		const group = inner.current;
		if (!group) return;
		const goal = baseScale * (highlighted ? 1.06 : 1);
		if (!animate) {
			// Reduced motion: no easing, snap straight to the goal.
			if (group.scale.x !== goal) group.scale.setScalar(goal);
			return;
		}
		group.scale.setScalar(group.scale.x + (goal - group.scale.x) * (1 - Math.exp(-delta * 14)));
	});

	useEffect(() => {
		if (!hovered) return;
		document.body.style.cursor = 'pointer';
		onHover({id: target.id, label: target.label, position: [px, py + 3.4 * baseScale, pz]});
		return () => {
			document.body.style.cursor = '';
			onHover(null);
		};
	}, [hovered, onHover, target.id, target.label, px, py, pz, baseScale]);

	const handleOver = (event: ThreeEvent<PointerEvent>): void => {
		event.stopPropagation();
		if (event.nativeEvent.pointerType === 'touch') return;
		setHovered(true);
	};
	const handleOut = (): void => setHovered(false);
	const handleClick = (event: ThreeEvent<MouseEvent>): void => {
		event.stopPropagation();
		if (event.delta > DRAG_THRESHOLD) return;
		onPick(target.id);
	};

	return (
		<group
			position={target.position}
			rotation={[0, target.rotationY ?? 0, 0]}
			onPointerOver={handleOver}
			onPointerOut={handleOut}
			onClick={handleClick}
		>
			{highlighted ? (
				<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} raycast={noRaycast}>
					<ringGeometry args={[(hitRadius + 0.15) * baseScale, (hitRadius + 0.4) * baseScale, 48]} />
					<meshBasicMaterial color={'#fff1d6'} transparent opacity={0.85} depthWrite={false} />
				</mesh>
			) : null}
			<group ref={inner} scale={baseScale}>
				<Prop highlighted={highlighted} animate={animate} />
			</group>
			{/* Generous invisible hit area so small props are easy to hit with a finger. */}
			<mesh position={[0, 1.2 * baseScale, 0]}>
				<cylinderGeometry args={[hitRadius * baseScale, hitRadius * baseScale, 2.4 * baseScale, 12]} />
				<meshBasicMaterial transparent opacity={0} depthWrite={false} />
			</mesh>
		</group>
	);
});
