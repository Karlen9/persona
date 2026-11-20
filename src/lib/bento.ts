/**
 * Bento layouts for the icon-card grids (6-column track from `lg` up).
 *
 * A pattern is a list of `{col, row}` spans in reading order. Every pattern fills a complete 6-column rectangle, so
 * the grid never has holes and the browser's sparse auto-placement keeps DOM order = visual order (no `dense`).
 * Rows in a pattern (column spans, `*` = also spans 2 rows):
 *
 *   n=2   4 2
 *   n=3   3* | 3 / 3         (one tall card on the left, two stacked on the right)
 *   n=4   4 2 | 2 4
 *   n=5   4 2 | 2 2 2
 *   n=6   4 2 | 2 4 | 3 3
 *   n=7   2 2 2 | 3 3 | 4 2
 *   n=8   2 2 2 | 4 2 | 2 2 2
 *   n=9   4 2 | 2 2 2 | 2 4 | 3 3
 *   n=10  3 3 | 2 2 2 | 4 2 | 2 2 2
 *   n=11  2 2 2 | 4 2 | 2 2 2 | 2 2 2
 *   n>11  the patterns for 6 are repeated while more than 11 cards remain, then the remainder uses its own pattern
 *
 * Lead-list groups (smaller cards, 3-up) use `leadListPattern`.
 */

export type TSpan = {col: 2 | 3 | 4 | 6; row: 1 | 2};

const s = (col: TSpan['col'], row: TSpan['row'] = 1): TSpan => ({col, row});

const BENTO: Record<number, TSpan[]> = {
	1: [s(6)],
	2: [s(4), s(2)],
	3: [s(3, 2), s(3), s(3)],
	4: [s(4), s(2), s(2), s(4)],
	5: [s(4), s(2), s(2), s(2), s(2)],
	6: [s(4), s(2), s(2), s(4), s(3), s(3)],
	7: [s(2), s(2), s(2), s(3), s(3), s(4), s(2)],
	8: [s(2), s(2), s(2), s(4), s(2), s(2), s(2), s(2)],
	9: [s(4), s(2), s(2), s(2), s(2), s(2), s(4), s(3), s(3)],
	10: [s(3), s(3), s(2), s(2), s(2), s(4), s(2), s(2), s(2), s(2)],
	11: [s(2), s(2), s(2), s(4), s(2), s(2), s(2), s(2), s(2), s(2), s(2)]
};

const LEAD_LIST: Record<number, TSpan[]> = {
	1: [s(6)],
	2: [s(3), s(3)],
	3: [s(2), s(2), s(2)],
	4: [s(3), s(3), s(3), s(3)],
	5: [s(2), s(2), s(2), s(3), s(3)],
	6: [s(2), s(2), s(2), s(2), s(2), s(2)]
};

export function bentoPattern(count: number): TSpan[] {
	if (count <= 0) return [];
	const spans: TSpan[] = [];
	let left = count;
	while (left > 11) {
		spans.push(...BENTO[6]);
		left -= 6;
	}
	spans.push(...BENTO[left]);
	return spans;
}

export function leadListPattern(count: number): TSpan[] {
	return LEAD_LIST[count] ?? bentoPattern(count);
}

/** Pattern name for reports, e.g. `6: 4/2 | 2/4 | 3/3`. */
export function describePattern(spans: TSpan[]): string {
	const rows: string[][] = [[]];
	let width = 0;
	for (const span of spans) {
		if (width >= 6) {
			rows.push([]);
			width = 0;
		}
		rows[rows.length - 1].push(`${span.col}${span.row === 2 ? '*' : ''}`);
		width += span.col;
	}
	return rows.map((row) => row.join('/')).join(' | ');
}
