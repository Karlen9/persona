import type {TScheduleLesson} from '@/lib/moyklass/types';

export type TPlacedLesson = {
	lesson: TScheduleLesson;
	/** Minutes from midnight. */
	startMin: number;
	endMin: number;
	/** Zero-based lane inside its overlap cluster. */
	lane: number;
	/** Lane count of the whole cluster this lesson belongs to. */
	lanes: number;
};

export type TCluster = {
	/** Earliest start and latest end of the cluster, in minutes. */
	startMin: number;
	endMin: number;
	lanes: number;
	items: TPlacedLesson[];
};

export type TDayLayout = {
	clusters: TCluster[];
	/** Widest cluster of the day (at least 1), used for the column's minimum width. */
	maxLanes: number;
};

/** Minutes from midnight to `HH:MM`. */
export function formatMinutes(minutes: number): string {
	return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

/** `HH:MM` to minutes from midnight. */
export function toMinutes(time: string): number {
	return Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
}

/** Whole-hour bounds of the axis: floor of the earliest start, ceil of the latest end. */
export function computeHourRange(lessons: TScheduleLesson[]): {startHour: number; endHour: number} {
	if (lessons.length === 0) {
		return {startHour: 9, endHour: 18};
	}
	let first = Infinity;
	let last = 0;
	for (const lesson of lessons) {
		first = Math.min(first, toMinutes(lesson.begin));
		last = Math.max(last, toMinutes(lesson.end));
	}
	const startHour = Math.floor(first / 60);
	return {startHour, endHour: Math.max(Math.ceil(last / 60), startHour + 1)};
}

/**
 * Greedy lane assignment: lessons sorted by start, grouped into clusters of transitively overlapping
 * intervals; inside a cluster each lesson takes the first lane that is already free.
 */
export function layoutDay(lessons: TScheduleLesson[]): TDayLayout {
	const sorted = lessons
		.map((lesson) => ({lesson, startMin: toMinutes(lesson.begin), endMin: toMinutes(lesson.end)}))
		.sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

	const clusters: TCluster[] = [];
	let maxLanes = 1;
	let cluster: TPlacedLesson[] = [];
	let laneEnds: number[] = [];
	let clusterEnd = -1;

	const closeCluster = (): void => {
		for (const item of cluster) {
			item.lanes = laneEnds.length;
		}
		maxLanes = Math.max(maxLanes, laneEnds.length);
		clusters.push({
			startMin: Math.min(...cluster.map((item) => item.startMin)),
			endMin: Math.max(...cluster.map((item) => item.endMin)),
			lanes: laneEnds.length,
			items: cluster
		});
		cluster = [];
		laneEnds = [];
	};

	for (const entry of sorted) {
		if (cluster.length > 0 && entry.startMin >= clusterEnd) {
			closeCluster();
		}
		let lane = laneEnds.findIndex((end) => end <= entry.startMin);
		if (lane === -1) {
			lane = laneEnds.length;
			laneEnds.push(entry.endMin);
		} else {
			laneEnds[lane] = entry.endMin;
		}
		clusterEnd = cluster.length === 0 ? entry.endMin : Math.max(clusterEnd, entry.endMin);
		cluster.push({...entry, lane, lanes: 1});
	}
	if (cluster.length > 0) {
		closeCluster();
	}
	return {clusters, maxLanes};
}

export const GROUP_STRIP_PX = 22;
export const GROUP_ROW_PX = 20;

export type TGroupRowsPlan = {
	/** `all`: every row fits; `more`: some rows plus «+N ещё»; `toggle`: only an «N занятий» row. */
	mode: 'all' | 'more' | 'toggle';
	visible: number;
	hidden: number;
};

/** How many lesson rows a grouped card of `height` px can show for `count` lessons. Never exceeds capacity. */
export function planGroupRows(height: number, count: number): TGroupRowsPlan {
	const capacity = Math.max(0, Math.floor((height - GROUP_STRIP_PX - 4) / GROUP_ROW_PX));
	if (count <= capacity) {
		return {mode: 'all', visible: count, hidden: 0};
	}
	if (capacity >= 2) {
		return {mode: 'more', visible: capacity - 1, hidden: count - capacity + 1};
	}
	return {mode: 'toggle', visible: 0, hidden: count};
}
