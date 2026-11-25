type TYm = (id: number, method: string, ...args: unknown[]) => void;

let counterId: number | null = null;

/** Called once by `YandexMetrika` with the counter id from the CMS site settings. */
export function setMetrikaCounter(id: number): void {
	counterId = id;
}

/** Fires a Yandex Metrika goal if the counter is loaded (i.e. consent was granted). */
export function reachGoal(goal: string): void {
	const ym = (window as unknown as {ym?: TYm}).ym;
	if (counterId !== null) ym?.(counterId, 'reachGoal', goal);
}

export function hit(url: string): void {
	const ym = (window as unknown as {ym?: TYm}).ym;
	if (counterId !== null) ym?.(counterId, 'hit', url);
}
