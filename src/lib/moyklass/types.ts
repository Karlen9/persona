// Raw Moyklass API shapes (only the fields we read) and the normalized, client-safe schedule shapes.

export type TRawLesson = {
	id: number;
	date: string;
	beginTime: string;
	endTime: string;
	filialId: number;
	roomId: number;
	classId: number;
	status: number;
	maxStudents?: number;
	topic?: string;
	teacherIds?: number[];
	/** Student bookings: only `skip` is typed and read, to count occupied seats. */
	records?: {skip?: boolean}[];
};

export type TRawLessonsResponse = {
	lessons: TRawLesson[];
	stats: {totalItems: number};
};

export type TRawClass = {
	id: number;
	name: string;
	courseId: number;
	filialId: number;
	status: 'opened' | 'closed' | 'archive';
	maxStudents?: number;
	color?: string | null;
};

export type TRawCourse = {
	id: number;
	name: string;
};

export type TRawFilial = {
	id: number;
	name: string;
	shortName?: string;
	address?: string;
	status?: 'active' | 'archive';
};

export type TRawRoom = {
	id: number;
	name: string;
	filialId: number;
	status?: 'active' | 'archive';
};

/** Staff records carry sensitive fields; only `id` and `name` are ever typed (and read). */
export type TRawManager = {
	id: number;
	name: string;
};

export type TScheduleLesson = {
	id: number;
	/** YYYY-MM-DD */
	date: string;
	begin: string;
	end: string;
	/** Course name, else class name. */
	title: string;
	/** Class name. */
	group: string;
	/** Stable key for filtering: course id as string, class id as fallback. */
	directionKey: string;
	studioSlug: string | null;
	studioLabel: string;
	room: string | null;
	teachers: string[];
	/** `null` means unlimited. */
	freeSeats: number | null;
	color: string | null;
};

export type TSchedule = {
	lessons: TScheduleLesson[];
	studios: {slug: string; label: string}[];
	directions: {key: string; label: string}[];
	from: string;
	to: string;
	generatedAt: string;
};
