import type {TImage} from '@/content/types';

export type TDiff = {path: string; expected: unknown; actual: unknown};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

const isImage = (value: unknown): value is TImage =>
	isPlainObject(value) &&
	typeof value.src === 'string' &&
	typeof value.width === 'number' &&
	typeof value.height === 'number' &&
	typeof value.alt === 'string';

const baseName = (src: string): string => {
	const last = src.split('/').pop() ?? src;
	try {
		return decodeURIComponent(last);
	} catch {
		return last;
	}
};

/** The seed stores a second alt-text variant of the same file as `name--2.ext`. */
export const sameFile = (expectedSrc: string, actualSrc: string): boolean => {
	const expected = baseName(expectedSrc);
	const actual = baseName(actualSrc);
	return actual === expected || actual.replace(/--\d+(\.[^.]+)$/, '$1') === expected;
};

/**
 * Strict deep comparison of CMS output (`actual`) against the static module value (`expected`).
 * `undefined` equals a missing key; `null` and `[]` are different; `TImage.src` only has to point at the same file.
 */
export function diff(expected: unknown, actual: unknown, path = '$', out: TDiff[] = []): TDiff[] {
	if (isImage(expected) && isImage(actual)) {
		if (!sameFile(expected.src, actual.src))
			out.push({path: `${path}.src`, expected: expected.src, actual: actual.src});
		for (const key of ['width', 'height', 'alt', 'altGenerated'] as const) {
			if (expected[key] !== actual[key])
				out.push({path: `${path}.${key}`, expected: expected[key], actual: actual[key]});
		}
		return out;
	}
	if (Array.isArray(expected) || Array.isArray(actual)) {
		if (!Array.isArray(expected) || !Array.isArray(actual)) {
			out.push({path, expected, actual});
			return out;
		}
		if (expected.length !== actual.length) {
			out.push({path: `${path}.length`, expected: expected.length, actual: actual.length});
		}
		for (let i = 0; i < Math.min(expected.length, actual.length); i++) {
			diff(expected[i], actual[i], `${path}[${i}]`, out);
		}
		return out;
	}
	if (isPlainObject(expected) && isPlainObject(actual)) {
		for (const key of new Set([...Object.keys(expected), ...Object.keys(actual)])) {
			diff(expected[key], actual[key], `${path}.${key}`, out);
		}
		return out;
	}
	if (expected !== actual) {
		out.push({path, expected, actual});
	}
	return out;
}

export function formatDiffs(diffs: TDiff[], limit = 20): string {
	const show = (value: unknown): string => {
		const text = JSON.stringify(value);
		return text === undefined ? 'undefined' : text.length > 160 ? `${text.slice(0, 160)}…` : text;
	};
	const lines = diffs
		.slice(0, limit)
		.map((item) => `    ${item.path}\n      static: ${show(item.expected)}\n      cms:    ${show(item.actual)}`);
	if (diffs.length > limit) lines.push(`    … and ${diffs.length - limit} more`);
	return lines.join('\n');
}
