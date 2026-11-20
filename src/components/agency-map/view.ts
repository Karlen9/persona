import {Vector3} from 'three';

import type {TAgencyBounds} from '@/content/agencyMap';

/** Isometric-ish camera offset from the look-at target. */
export const CAMERA_OFFSET: [number, number, number] = [30, 40, 30];

/** Back walls are ~3.5 high, props up to ~3.2. Used to pad the fit box vertically. */
const FIT_HEIGHT = 3.6;
const FIT_PADDING = 0.94;
/** Height (px) of the title card at the top-left on desktop, plus its margin. */
const OVERLAY_INSET = 120;
/** Portrait phones zoom in by at most this factor relative to the width fit. */
const MAX_HOME_ZOOM_BOOST = 2.4;

/** Zoom limits relative to the "fit whole floor" zoom. */
export const MIN_REL_ZOOM = 0.9;
export const MAX_REL_ZOOM = 8;

const forward = new Vector3(...CAMERA_OFFSET).negate().normalize();
const right = new Vector3().crossVectors(forward, new Vector3(0, 1, 0)).normalize();
const up = new Vector3().crossVectors(right, forward).normalize();
/** Horizontal unit vector pointing away from the camera, and how much of it lies along the screen's up axis. */
const farDir = new Vector3(forward.x, 0, forward.z).normalize();
const farDotUp = farDir.dot(up);

/** Screen-space extent of the floor box (world units of the view plane) and where its centre sits on the up axis. */
function floorExtent(bounds: TAgencyBounds): {width: number; height: number; centreY: number} {
	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;
	const p = new Vector3();
	for (const x of [bounds.minX, bounds.maxX]) {
		for (const z of [bounds.minZ, bounds.maxZ]) {
			for (const y of [0, FIT_HEIGHT]) {
				p.set(x, y, z);
				const sx = p.dot(right);
				const sy = p.dot(up);
				minX = Math.min(minX, sx);
				maxX = Math.max(maxX, sx);
				minY = Math.min(minY, sy);
				maxY = Math.max(maxY, sy);
			}
		}
	}
	return {width: maxX - minX, height: maxY - minY, centreY: (minY + maxY) / 2};
}

/**
 * Pixels at the top of the canvas taken by the overlaid title card (sm and up; on phones the h1 is screen-reader only).
 * The home view fits the floor into the canvas below it.
 */
export function overlayInset(width: number, height: number): number {
	return width >= 640 ? Math.min(OVERLAY_INSET, height * 0.18) : 0;
}

/** Orthographic zoom (pixels per world unit) at which the whole floor fits into the viewport below `topInset`. */
export function computeFitZoom(width: number, height: number, bounds: TAgencyBounds, topInset = 0): number {
	const extent = floorExtent(bounds);
	return Math.min(width / extent.width, Math.max(1, height - topInset) / extent.height) * FIT_PADDING || 1;
}

/**
 * Initial and "reset" camera. Landscape: the full-floor fit, centred in the canvas below the title card. Portrait
 * (width < height): zoomed in so the floor's top and bottom corners roughly touch the canvas edges, centred on the
 * reception. `fit` is always the width/height fit that hash zoom and zoom limits are relative to.
 */
export function computeHomeView(width: number, height: number, bounds: TAgencyBounds): {fit: number; view: TMapView} {
	const inset = overlayInset(width, height);
	const fit = computeFitZoom(width, height, bounds, inset);
	const extent = floorExtent(bounds);
	const portrait = width < height;
	const cover = ((height - inset) / extent.height) * FIT_PADDING;
	const zoom = portrait ? clamp(cover, fit, fit * MAX_HOME_ZOOM_BOOST) : fit;
	// Move the floor's screen centre to the middle of the free area: shift the look-at target along the ground's
	// "far" direction, which moves the picture vertically.
	const shiftPx = inset / 2 + extent.centreY * zoom;
	const delta = shiftPx / (zoom * farDotUp);
	return {fit, view: {x: farDir.x * delta, z: farDir.z * delta, zoom}};
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

export type TMapView = {x: number; z: number; zoom: number};

const HASH_RE = /^#map=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(\d+(?:\.\d+)?)$/;

/** Parses `#map=x,z,zoom` where zoom is relative to the fit zoom. Returns null when absent or out of range. */
export function parseMapHash(hash: string, bounds: TAgencyBounds): TMapView | null {
	const match = HASH_RE.exec(hash);
	if (!match) return null;
	const [x, z, zoom] = [Number(match[1]), Number(match[2]), Number(match[3])];
	if (![x, z, zoom].every(Number.isFinite)) return null;
	if (x < bounds.minX || x > bounds.maxX || z < bounds.minZ || z > bounds.maxZ) return null;
	if (zoom < MIN_REL_ZOOM || zoom > MAX_REL_ZOOM) return null;
	return {x, z, zoom};
}

function round1(value: number): string {
	return (Math.round(value * 10) / 10).toString();
}

export function formatMapHash(view: TMapView): string {
	return `#map=${round1(view.x)},${round1(view.z)},${round1(view.zoom)}`;
}

/** Replaces the hash without creating a history entry. Keeps Next's own history state intact. */
export function replaceHash(hash: string): void {
	const {pathname, search} = window.location;
	window.history.replaceState(window.history.state, '', `${pathname}${search}${hash}`);
}

export type TMapApi = {
	zoomBy: (factor: number) => void;
	reset: () => void;
};
