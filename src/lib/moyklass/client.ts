// Server-only Moyklass REST client. Do not import from client components.
// (`server-only` is not installed in this project, so the guard is by convention; the API key is read from env only.)

import type {TRawClass, TRawCourse, TRawFilial, TRawLesson, TRawLessonsResponse, TRawManager, TRawRoom} from './types';

const BASE_URL = 'https://api.moyklass.com';
const TIMEOUT_MS = 10000;
const PAGE_LIMIT = 500;
const MAX_PAGES = 10;
const TOKEN_MARGIN_MS = 60 * 60 * 1000;

type TParams = Record<string, string | number | boolean | (string | number)[] | undefined>;

type TToken = {value: string; expiresAt: number};

let cachedToken: TToken | null = null;

export type TLookups = {
	classes: TRawClass[];
	courses: TRawCourse[];
	filials: TRawFilial[];
	rooms: TRawRoom[];
	managers: TRawManager[];
};

export function hasApiKey(): boolean {
	return Boolean(process.env.MOYKLASS_API_KEY);
}

function buildUrl(path: string, params?: TParams): string {
	const url = new URL(path, BASE_URL);
	for (const [key, value] of Object.entries(params ?? {})) {
		if (value === undefined) {
			continue;
		}
		if (Array.isArray(value)) {
			for (const item of value) {
				url.searchParams.append(key, String(item));
			}
		} else {
			url.searchParams.set(key, String(value));
		}
	}
	return url.toString();
}

async function getToken(): Promise<string> {
	if (cachedToken && cachedToken.expiresAt - TOKEN_MARGIN_MS > Date.now()) {
		return cachedToken.value;
	}
	const apiKey = process.env.MOYKLASS_API_KEY;
	if (!apiKey) {
		throw new Error('MOYKLASS_API_KEY is not set');
	}
	const response = await fetch(buildUrl('/v1/company/auth/getToken'), {
		method: 'POST',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify({apiKey}),
		signal: AbortSignal.timeout(TIMEOUT_MS)
	});
	if (!response.ok) {
		throw new Error(`Moyklass auth failed: ${response.status}`);
	}
	const data = (await response.json()) as {accessToken: string; expiresAt: string};
	const expiresAt = Date.parse(data.expiresAt);
	cachedToken = {
		value: data.accessToken,
		expiresAt: Number.isNaN(expiresAt) ? Date.now() + 6 * 24 * 60 * 60 * 1000 : expiresAt
	};
	return cachedToken.value;
}

async function request<T>(path: string, params?: TParams): Promise<T> {
	const token = await getToken();
	const response = await fetch(buildUrl(path, params), {
		headers: {'x-access-token': token},
		signal: AbortSignal.timeout(TIMEOUT_MS)
	});
	if (!response.ok) {
		if (response.status === 401) {
			cachedToken = null;
		}
		throw new Error(`Moyklass request ${path} failed: ${response.status}`);
	}
	return (await response.json()) as T;
}

export async function fetchLookups(): Promise<TLookups> {
	// Resolve the token once before the parallel burst so it is requested a single time.
	await getToken();
	const [classes, courses, filials, rooms, managers] = await Promise.all([
		request<TRawClass[]>('/v1/company/classes'),
		request<TRawCourse[]>('/v1/company/courses'),
		request<TRawFilial[]>('/v1/company/filials'),
		request<TRawRoom[]>('/v1/company/rooms'),
		request<TRawManager[]>('/v1/company/managers')
	]);
	return {classes, courses, filials, rooms, managers};
}

export async function fetchLessons(from: string, to: string): Promise<TRawLesson[]> {
	const lessons: TRawLesson[] = [];
	for (let page = 0; page < MAX_PAGES; page += 1) {
		const data = await request<TRawLessonsResponse>('/v1/company/lessons', {
			date: [from, to],
			limit: PAGE_LIMIT,
			offset: page * PAGE_LIMIT,
			includeRecords: true,
			sort: 'date'
		});
		lessons.push(...data.lessons);
		if (data.lessons.length === 0 || lessons.length >= data.stats.totalItems) {
			break;
		}
	}
	return lessons;
}
