/**
 * Prints `{ "<new path>": [{section, videos: [{src, poster}]}] }` as JSON: every video the rebuilt content presents,
 * per page and section (direction «Как проходят занятия?», page `video` sections, home «Наши выступления» and the
 * gallery tabs). Input for scripts/live_audit_report.py.   bun scripts/content-videos.ts
 */
import {directions, eventsPage, festivalsPage, home} from '../src/content/index';

import type {TVideo} from '../src/content/types';

type TOut = {section: string; videos: {src: string; poster: string | null; caption?: string}[]};

const view = (v: TVideo): TOut['videos'][number] => ({
	src: v.src,
	poster: v.poster?.src ?? null,
	...(v.caption ? {caption: v.caption} : {})
});

const result: Record<string, TOut[]> = {};
for (const d of directions) {
	result[d.path] = d.sections.flatMap((s) =>
		s.type === 'howClassesGo' ? [{section: s.heading, videos: s.videos.map(view)}] : []
	);
}
for (const page of [eventsPage, festivalsPage]) {
	result[page.path] = page.sections.flatMap((s) => {
		if (s.type !== 'video') return [];
		return [{section: s.heading ?? 'video', videos: s.videos.map(view)}];
	});
}
result['/'] = [
	{section: home.performances.heading, videos: home.performances.videos.map(view)},
	...home.gallery.tabs.map((t) => ({section: `gallery: ${t.label}`, videos: t.videos.map(view)}))
];
console.log(JSON.stringify(result, null, 1));
