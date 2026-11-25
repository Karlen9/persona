import type {TBlock, TInline, TRichText} from '@/content/types';

/**
 * Markdown-lite codec for `TRichText`, stored in the CMS as a single string:
 *
 * - `**bold**`, `*italic*`, `***bold italic***`
 * - `[label](href)`; a link may be wrapped in bold / italic: `**[label](href)**`
 * - a backslash escapes a literal `*`, `[`, `]` or `\` (and `(`, `)` inside a link target)
 * - `\|` is an invisible segment separator. It only exists so that data imported from the old site with two adjacent,
 *   identically formatted segments round-trips exactly; editors never need to type it.
 */

type TState = {bold: boolean; italic: boolean};

const escapeText = (value: string): string => value.replace(/[\\*[\]]/g, (char) => `\\${char}`);
const escapeHref = (value: string): string => value.replace(/[\\()]/g, (char) => `\\${char}`);

const markerFor = (state: TState): string => `${state.bold ? '**' : ''}${state.italic ? '*' : ''}`;

export function richTextToString(value: TRichText): string {
	if (!value.inline) {
		return escapeText(value.text);
	}
	return value.inline
		.map((segment, index, all) => {
			const wrap = markerFor({bold: Boolean(segment.bold), italic: Boolean(segment.italic)});
			const body = segment.href
				? `[${escapeText(segment.text)}](${escapeHref(segment.href)})`
				: escapeText(segment.text);
			const previous = all[index - 1];
			const separator =
				previous &&
				!previous.href &&
				!segment.href &&
				Boolean(previous.bold) === Boolean(segment.bold) &&
				Boolean(previous.italic) === Boolean(segment.italic)
					? '\\|'
					: '';
			return `${separator}${wrap}${body}${wrap}`;
		})
		.join('');
}

type TContext = {out: TInline[]; breakNext: boolean};

function pushSegment(ctx: TContext, text: string, state: TState, href: string | undefined): void {
	const {out} = ctx;
	const last = out[out.length - 1];
	const split = ctx.breakNext;
	ctx.breakNext = false;
	// Runs split only by an escape or a no-op marker are one segment (unless `\|` separated them).
	if (
		!split &&
		last &&
		!last.href &&
		!href &&
		Boolean(last.bold) === state.bold &&
		Boolean(last.italic) === state.italic
	) {
		last.text += text;
		return;
	}
	const segment: TInline = {text};
	if (state.bold) segment.bold = true;
	if (state.italic) segment.italic = true;
	if (href) segment.href = href;
	out.push(segment);
}

/** Reads `[label](href)` at `start`; returns the raw label (escapes kept), the unescaped href and the end index. */
function matchLink(input: string, start: number): {label: string; href: string; end: number} | null {
	let i = start + 1;
	let label = '';
	while (i < input.length && input[i] !== ']') {
		if (input[i] === '\\' && i + 1 < input.length) {
			label += input[i] + input[i + 1];
			i += 2;
		} else {
			label += input[i];
			i += 1;
		}
	}
	if (input[i] !== ']' || input[i + 1] !== '(') {
		return null;
	}
	i += 2;
	let href = '';
	while (i < input.length && input[i] !== ')') {
		if (input[i] === '\\' && i + 1 < input.length) {
			href += input[i + 1];
			i += 2;
		} else {
			href += input[i];
			i += 1;
		}
	}
	if (input[i] !== ')') {
		return null;
	}
	return {label, href, end: i + 1};
}

function parseInto(input: string, base: TState, href: string | undefined, ctx: TContext): void {
	const state: TState = {...base};
	let buffer = '';
	let i = 0;
	const flush = (): void => {
		if (buffer !== '') {
			pushSegment(ctx, buffer, state, href);
			buffer = '';
		}
	};
	while (i < input.length) {
		const char = input[i] as string;
		if (char === '\\' && input[i + 1] === '|') {
			flush();
			ctx.breakNext = true;
			i += 2;
		} else if (char === '\\' && i + 1 < input.length) {
			buffer += input[i + 1];
			i += 2;
		} else if (char === '[' && !href) {
			const link = matchLink(input, i);
			if (link) {
				flush();
				parseInto(link.label, state, link.href, ctx);
				i = link.end;
			} else {
				buffer += char;
				i += 1;
			}
		} else if (char === '*') {
			flush();
			const closing = markerFor(state);
			if (closing && input.startsWith(closing, i)) {
				// Closes the run that is currently open.
				state.bold = false;
				state.italic = false;
				i += closing.length;
			} else if (input.startsWith('***', i)) {
				state.bold = !state.bold;
				state.italic = !state.italic;
				i += 3;
			} else if (input.startsWith('**', i)) {
				state.bold = !state.bold;
				i += 2;
			} else {
				state.italic = !state.italic;
				i += 1;
			}
		} else {
			buffer += char;
			i += 1;
		}
	}
	flush();
}

export function stringToRichText(input: string): TRichText {
	const ctx: TContext = {out: [], breakNext: false};
	parseInto(input, {bold: false, italic: false}, undefined, ctx);
	const segments = ctx.out;
	const text = segments.map((segment) => segment.text).join('');
	const formatted = segments.some((segment) => segment.bold || segment.italic || segment.href);
	return formatted ? {text, inline: segments} : {text};
}

/** Plain-text answer for FAQPage JSON-LD: block texts joined by a space, list items prefixed with a bullet. */
export function faqAnswerText(blocks: TBlock[]): string {
	return blocks
		.flatMap((block) => {
			if (block.type === 'list') return block.items.map((item) => `• ${item.text}`);
			if (block.type === 'stat') return [`${block.value} ${block.label}`];
			if (block.type === 'cards') return block.items.map((item) => `${item.title} ${item.text}`);
			return [block.text];
		})
		.join(' ');
}
