import type {TBlock, TInline, TRichText} from '@/content/types';

/**
 * Render-time grouping of content blocks. Runs of level-3 headings that carry an emoji `icon` (plus the paragraphs /
 * lists that follow each of them) become card groups; everything else stays a plain block segment. No copy is
 * changed or reordered: flattening the segments yields the input blocks again.
 */

export type THeadingBlock = Extract<TBlock, {type: 'heading'}>;
export type TListBlock = Extract<TBlock, {type: 'list'}>;

/** Paragraph / list blocks that follow an icon heading. */
export type TBodyBlock = Extract<TBlock, {type: 'paragraph' | 'list'}>;

export type TIconItem = {heading: THeadingBlock; body: TBodyBlock[]};

/** A list item of the form «**Label** — description». */
export type TLeadItem = {lead: string; rest: TRichText | null};

export type TCardShape = 'feature' | 'programme' | 'list' | 'mixed' | 'single';

export type TSegment =
	| {kind: 'blocks'; blocks: TBlock[]}
	| {kind: 'cards'; shape: TCardShape; items: TIconItem[]}
	| {
			kind: 'lead-list';
			item: TIconItem;
			intro: TBodyBlock[];
			outro: TBodyBlock[];
			leads: TLeadItem[];
			ordered: boolean;
	  }
	| {kind: 'closing'; item: TIconItem};

type TItemKind = 'feature' | 'programme' | 'list' | 'lead-list' | 'other';

type TEntry = {type: 'block'; block: TBlock} | {type: 'item'; item: TIconItem; kind: TItemKind};

const CLOSING_TITLE = /результат|итог|что получ|что вы получ/i;

function isIconHeading(block: TBlock): block is THeadingBlock & {icon: string} {
	return block.type === 'heading' && block.level === 3 && Boolean(block.icon);
}

function isBodyBlock(block: TBlock): block is TBodyBlock {
	return (block.type === 'paragraph' && block.variant !== 'eyebrow') || block.type === 'list';
}

function hasBoldLead(list: TListBlock): boolean {
	return list.items.length >= 2 && list.items.every((item) => item.inline?.[0]?.bold === true);
}

function leadListIndex(body: TBodyBlock[]): number {
	const lists = body.filter((b) => b.type === 'list');
	if (body.length > 3 || lists.length !== 1 || body.some((b) => b.type !== 'list' && b.type !== 'paragraph'))
		return -1;
	const index = body.findIndex((b) => b.type === 'list');
	const list = body[index] as TListBlock;
	return hasBoldLead(list) ? index : -1;
}

function classify(body: TBodyBlock[]): TItemKind {
	if (leadListIndex(body) !== -1) return 'lead-list';
	if (body.length >= 1 && body.length <= 3 && body.every((b) => b.type === 'paragraph')) return 'feature';
	if (body.length === 1 && body[0].type === 'list') return 'list';
	if (body.length === 2 && body.filter((b) => b.type === 'list').length === 1) return 'programme';
	return 'other';
}

function toEntries(blocks: readonly TBlock[]): TEntry[] {
	const entries: TEntry[] = [];
	let i = 0;
	while (i < blocks.length) {
		const block = blocks[i];
		if (isIconHeading(block)) {
			const body: TBodyBlock[] = [];
			i += 1;
			while (i < blocks.length && isBodyBlock(blocks[i])) {
				body.push(blocks[i] as TBodyBlock);
				i += 1;
			}
			entries.push({type: 'item', item: {heading: block, body}, kind: classify(body)});
		} else {
			entries.push({type: 'block', block});
			i += 1;
		}
	}
	return entries;
}

const SEPARATOR = /^[\s—–:-]+/;

/** Splits «**Label:** rest» into the label (trailing colon dropped) and the rest (leading dash / colon dropped). */
function toLeadItem(item: TRichText): TLeadItem {
	const runs = item.inline ?? [];
	const lead = runs[0].text.replace(/[\s:]+$/, '');
	const restRuns: TInline[] = runs
		.slice(1)
		.map((run, index) => (index === 0 ? {...run, text: run.text.replace(SEPARATOR, '')} : run))
		.filter((run) => run.text.length > 0);
	if (restRuns.length === 0) return {lead, rest: null};
	const text = restRuns.map((run) => run.text).join('');
	return {lead, rest: restRuns.some((run) => run.bold || run.italic || run.href) ? {text, inline: restRuns} : {text}};
}

export function hasIconHeadings(blocks: readonly TBlock[]): boolean {
	return blocks.some(isIconHeading);
}

export function groupIconBlocks(blocks: readonly TBlock[]): TSegment[] {
	if (!hasIconHeadings(blocks)) return [{kind: 'blocks', blocks: [...blocks]}];

	const entries = toEntries(blocks);
	const lastItemIndex = entries.reduce((acc, entry, index) => (entry.type === 'item' ? index : acc), -1);
	const segments: TSegment[] = [];

	const pushBlock = (block: TBlock): void => {
		const last = segments[segments.length - 1];
		if (last?.kind === 'blocks') last.blocks.push(block);
		else segments.push({kind: 'blocks', blocks: [block]});
	};

	/** Same-kind runs of length 1 that touch each other are merged into one `mixed` group. */
	let lone: TIconItem[] = [];
	const flushLone = (): void => {
		if (lone.length === 1) segments.push({kind: 'cards', shape: 'single', items: lone});
		else if (lone.length > 1) segments.push({kind: 'cards', shape: 'mixed', items: lone});
		lone = [];
	};

	let i = 0;
	while (i < entries.length) {
		const entry = entries[i];
		if (entry.type === 'block') {
			flushLone();
			pushBlock(entry.block);
			i += 1;
			continue;
		}
		if (i === lastItemIndex && CLOSING_TITLE.test(entry.item.heading.text)) {
			flushLone();
			segments.push({kind: 'closing', item: entry.item});
			i += 1;
			continue;
		}
		if (entry.kind === 'lead-list') {
			flushLone();
			const listIndex = leadListIndex(entry.item.body);
			const list = entry.item.body[listIndex] as TListBlock;
			segments.push({
				kind: 'lead-list',
				item: entry.item,
				intro: entry.item.body.slice(0, listIndex),
				outro: entry.item.body.slice(listIndex + 1),
				leads: list.items.map(toLeadItem),
				ordered: list.ordered
			});
			i += 1;
			continue;
		}
		if (entry.kind === 'other') {
			flushLone();
			segments.push({kind: 'cards', shape: 'single', items: [entry.item]});
			i += 1;
			continue;
		}
		// Run of consecutive items of the same shape (stops at closing / lead-list / other / non-item entries).
		const run: TIconItem[] = [entry.item];
		let j = i + 1;
		while (j < entries.length) {
			const next = entries[j];
			if (next.type !== 'item' || next.kind !== entry.kind) break;
			if (j === lastItemIndex && CLOSING_TITLE.test(next.item.heading.text)) break;
			run.push(next.item);
			j += 1;
		}
		if (run.length === 1) {
			lone.push(entry.item);
		} else {
			flushLone();
			segments.push({kind: 'cards', shape: entry.kind, items: run});
		}
		i = j;
	}
	flushLone();
	return segments;
}
