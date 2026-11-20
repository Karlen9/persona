import {YANDEX_METRIKA_ID} from '@/lib/site';

type TYm = (id: number, method: string, ...args: unknown[]) => void;

/** Fires a Yandex Metrika goal if the counter is loaded (i.e. consent was granted). */
export function reachGoal(goal: string): void {
	const ym = (window as unknown as {ym?: TYm}).ym;
	ym?.(YANDEX_METRIKA_ID, 'reachGoal', goal);
}

export function hit(url: string): void {
	const ym = (window as unknown as {ym?: TYm}).ym;
	ym?.(YANDEX_METRIKA_ID, 'hit', url);
}
