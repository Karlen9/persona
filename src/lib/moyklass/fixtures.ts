// Deterministic RAW-shaped Moyklass responses for local development (MOYKLASS_MOCK=1).
// Shaped like the real API on purpose, including sensitive manager fields, so normalization is exercised.

import {addDays, weekdayIndex} from './dates';

import type {TLookups} from './client';
import type {TRawLesson} from './types';

type TFixtures = TLookups & {lessons: TRawLesson[]};

const FILIALS = [
	{id: 101, name: 'PersOna Мичуринский', shortName: 'Мичуринский', address: 'Москва, Мичуринский проспект, 56'},
	{id: 102, name: 'PersOna Солнцево', shortName: 'Солнцево', address: 'Москва, улица Богданова, 19'},
	{id: 103, name: 'PersOna Славянский бульвар', shortName: 'Славянский', address: 'Москва, Нежинская улица, 11'},
	{id: 104, name: 'PersOna Профсоюзная', shortName: 'Профсоюзная', address: 'Москва, Профсоюзная улица, 61'}
].map((filial) => ({...filial, city: 'Москва', timezone: 'Europe/Moscow', status: 'active' as const}));

const COURSES = [
	'Актёрское мастерство',
	'Модельная школа',
	'Вокал',
	'Хореография',
	'Рисование',
	'Английский язык',
	'Ораторское искусство',
	'Подготовка к школе'
].map((name, index) => ({id: 201 + index, name, shortDescription: `Описание: ${name}`, siteUrl: ''}));

const MANAGERS = [
	'Анна Петрова',
	'Мария Иванова',
	'Екатерина Смирнова',
	'Ольга Кузнецова',
	'Дарья Соколова',
	'Алексей Новиков'
].map((name, index) => ({
	id: 301 + index,
	name,
	// Fake sensitive fields: must never reach the client.
	phone: `+7900000000${index}`,
	email: `fixture-secret-${index}@example.invalid`,
	passportData: `FIXTURE-PASSPORT-${index}`,
	inn: `0000000000${index}`,
	birthDate: '1990-01-01',
	password: 'fixture-secret-password'
}));

const CLASS_COLORS = ['#3fa08d', '#f7b2c4', '#f4b942', '#6aa6f8', '#b08cf0', null];
const MAX_STUDENTS = [0, 8, 12];
const START_HOURS = [10, 12, 14, 16, 18];

function buildClasses(): TLookups['classes'] {
	const classes: TLookups['classes'] = [];
	for (let i = 0; i < 12; i += 1) {
		const course = COURSES[i % COURSES.length];
		const filial = FILIALS[i % FILIALS.length];
		const suffix = ['пн/ср 5-7 лет', 'вт/чт 8-10 лет', 'сб 11-14 лет'][i % 3];
		classes.push({
			id: 401 + i,
			name: `${course.name}, ${suffix}`,
			courseId: course.id,
			filialId: filial.id,
			status: i === 11 ? 'archive' : i === 10 ? 'closed' : 'opened',
			maxStudents: MAX_STUDENTS[i % MAX_STUDENTS.length],
			color: CLASS_COLORS[i % CLASS_COLORS.length]
		});
	}
	return classes;
}

export function buildFixtures(from: string, to: string): TFixtures {
	const classes = buildClasses();
	const rooms = FILIALS.flatMap((filial) => [
		{id: filial.id * 10 + 1, name: 'Большой зал', filialId: filial.id, status: 'active' as const},
		{id: filial.id * 10 + 2, name: 'Класс 2', filialId: filial.id, status: 'active' as const}
	]);

	const lessons: TRawLesson[] = [];
	let id = 5000;
	let date = from;
	while (date <= to) {
		const weekday = weekdayIndex(date);
		if (weekday <= 5) {
			classes.forEach((cls, index) => {
				if ((index + weekday) % 3 !== 0 && (index * 7 + weekday) % 5 > 1) {
					return;
				}
				const hour = START_HOURS[(index + weekday) % START_HOURS.length];
				const maxStudents = cls.maxStudents ?? 0;
				// Every 9th lesson is full, others are partially booked.
				const booked =
					maxStudents === 0 ? 5 : (id + index) % 9 === 0 ? maxStudents : (id + index) % maxStudents;
				lessons.push({
					id: id++,
					date,
					beginTime: `${String(hour).padStart(2, '0')}:00`,
					endTime: `${String(hour).padStart(2, '0')}:${index % 2 === 0 ? '45' : '55'}`,
					filialId: cls.filialId,
					roomId: cls.filialId * 10 + 1 + (index % 2),
					classId: cls.id,
					status: 0,
					maxStudents,
					topic: '',
					teacherIds: [MANAGERS[index % MANAGERS.length].id],
					// Student bookings: only the count may leave the server.
					records: Array.from({length: booked}, (_, n) => ({
						id: id * 100 + n,
						userId: 90000 + n,
						free: false,
						skip: false
					}))
				});
			});
		}
		date = addDays(date, 1);
	}
	// A past, already held lesson inside the window start to exercise the "held before today" filter.
	lessons.push({
		id: id++,
		date: addDays(from, -1),
		beginTime: '10:00',
		endTime: '11:00',
		filialId: FILIALS[0].id,
		roomId: FILIALS[0].id * 10 + 1,
		classId: classes[0].id,
		status: 1,
		maxStudents: 8,
		teacherIds: [MANAGERS[0].id],
		records: []
	});
	// Capped lesson (8 seats) with 6 records, 2 of them `skip` (not counted): shows 4 free seats.
	lessons.push({
		id: id++,
		date: addDays(from, 1),
		beginTime: '19:00',
		endTime: '19:50',
		filialId: classes[1].filialId,
		roomId: classes[1].filialId * 10 + 1,
		classId: classes[1].id,
		status: 0,
		maxStudents: 8,
		teacherIds: [MANAGERS[1].id],
		records: Array.from({length: 6}, (_, n) => ({id: id * 100 + n, userId: 91000 + n, skip: n < 2}))
	});
	return {classes, courses: COURSES, filials: FILIALS, rooms, managers: MANAGERS, lessons};
}
