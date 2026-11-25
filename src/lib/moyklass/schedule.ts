// Builds the public schedule from the Moyklass API. Everything leaving this module is normalized and minimal:
// raw lessons (with student records), staff records and ids never reach client components.

import {site} from '@/content/site';
import {studios} from '@/content/studios';

import {fetchLessons, fetchLookups, hasApiKey} from './client';
import {addDays, moscowDate} from './dates';
import {buildFixtures} from './fixtures';

import type {TLookups} from './client';
import type {TRawFilial, TRawLesson, TSchedule, TScheduleLesson} from './types';

const WINDOW_DAYS = 20;
const RU = 'ru';

const {filialStudio, classIds, courseIds} = site.moyklass.api;

const orderedStudios = [...studios].sort((a, b) => a.order - b.order);

function normalize(value: string | undefined): string {
	return (value ?? '').toLowerCase().replaceAll('ё', 'е');
}

/** First word of the studio short name longer than 3 letters, e.g. «Мичуринский» for «Мичуринский проспект 56». */
const studioKeywords = orderedStudios.map((studio) => ({
	slug: studio.slug,
	keyword: normalize(studio.shortName.split(/\s+/).find((word) => /^\p{L}{4,}$/u.test(word)))
}));

function matchStudio(filial: TRawFilial): string | null {
	const mapped = filialStudio[String(filial.id)];
	if (mapped) {
		return mapped;
	}
	const haystack = normalize(`${filial.address ?? ''} ${filial.name} ${filial.shortName ?? ''}`);
	const found = studioKeywords.find(({keyword}) => keyword.length > 0 && haystack.includes(keyword));
	return found?.slug ?? null;
}

function buildSchedule(
	lookups: TLookups,
	rawLessons: TRawLesson[],
	today: string,
	from: string,
	to: string
): TSchedule {
	const classes = new Map(lookups.classes.map((item) => [item.id, item]));
	const courses = new Map(lookups.courses.map((item) => [item.id, item.name]));
	const filials = new Map(lookups.filials.map((item) => [item.id, item]));
	const rooms = new Map(lookups.rooms.map((item) => [item.id, item]));
	// Only id and name are ever read from staff records.
	const managers = new Map(lookups.managers.map((item) => [item.id, item.name]));
	const studioLabels = new Map(orderedStudios.map((studio) => [studio.slug, studio.shortName]));

	const lessons: TScheduleLesson[] = [];
	for (const lesson of rawLessons) {
		const cls = classes.get(lesson.classId);
		if (!cls || cls.status === 'archive') {
			continue;
		}
		if (classIds.length > 0 && !classIds.includes(cls.id)) {
			continue;
		}
		if (courseIds.length > 0 && !courseIds.includes(cls.courseId)) {
			continue;
		}
		const filial = filials.get(lesson.filialId);
		if (!filial || filial.status === 'archive') {
			continue;
		}
		const room = rooms.get(lesson.roomId);
		if (room?.status === 'archive') {
			continue;
		}
		if (lesson.status === 1 && lesson.date < today) {
			continue;
		}

		const max = lesson.maxStudents ?? cls.maxStudents ?? 0;
		const booked = (lesson.records ?? []).filter((record) => !record.skip).length;
		const studioSlug = matchStudio(filial);
		const courseName = courses.get(cls.courseId);
		const teachers = (lesson.teacherIds ?? [])
			.map((teacherId) => managers.get(teacherId))
			.filter((name): name is string => Boolean(name));

		lessons.push({
			id: lesson.id,
			date: lesson.date,
			begin: lesson.beginTime.slice(0, 5),
			end: lesson.endTime.slice(0, 5),
			title: courseName || cls.name,
			group: cls.name,
			directionKey: cls.courseId ? String(cls.courseId) : `class-${cls.id}`,
			studioSlug,
			studioLabel: (studioSlug && studioLabels.get(studioSlug)) || filial.shortName || filial.name,
			room: room?.name ?? null,
			teachers,
			freeSeats: max === 0 ? null : Math.max(0, max - booked),
			color: cls.color || null
		});
	}

	lessons.sort(
		(a, b) => a.date.localeCompare(b.date) || a.begin.localeCompare(b.begin) || a.title.localeCompare(b.title, RU)
	);

	const presentStudios = new Set(lessons.map((lesson) => lesson.studioSlug).filter(Boolean));
	const directions = new Map<string, string>();
	for (const lesson of lessons) {
		if (!directions.has(lesson.directionKey)) {
			directions.set(lesson.directionKey, lesson.title);
		}
	}

	return {
		lessons,
		studios: orderedStudios
			.filter((studio) => presentStudios.has(studio.slug))
			.map((studio) => ({slug: studio.slug, label: studio.shortName})),
		directions: [...directions.entries()]
			.map(([key, label]) => ({key, label}))
			.sort((a, b) => a.label.localeCompare(b.label, RU)),
		from,
		to,
		generatedAt: new Date().toISOString()
	};
}

/** Returns `null` when the schedule can't be built, so the page falls back to the embedded widget. */
export async function getSchedule(): Promise<TSchedule | null> {
	const useMock = !hasApiKey() && process.env.MOYKLASS_MOCK === '1';
	if (!hasApiKey() && !useMock) {
		return null;
	}

	const today = moscowDate();
	const from = today;
	const to = addDays(today, WINDOW_DAYS);

	try {
		let lookups: TLookups;
		let rawLessons: TRawLesson[];
		if (useMock) {
			console.warn('[moyklass] MOYKLASS_MOCK=1: using fixture data instead of the API');
			const fixtures = buildFixtures(from, to);
			lookups = fixtures;
			rawLessons = fixtures.lessons;
		} else {
			lookups = await fetchLookups();
			rawLessons = await fetchLessons(from, to);
		}
		const schedule = buildSchedule(lookups, rawLessons, today, from, to);
		return schedule.lessons.length > 0 ? schedule : null;
	} catch (error) {
		console.error('[moyklass] schedule failed:', error instanceof Error ? error.message : 'unknown error');
		return null;
	}
}
