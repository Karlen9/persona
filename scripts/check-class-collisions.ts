// Moyklass widget CSS defines these class names globally (e.g. `.hidden { display: none !important }`), so they must never be used as classes in our markup.
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join} from 'node:path';

const BANNED = [
	'hidden',
	'popup',
	'mini-loader',
	'no-grid-selector',
	'oneClassItem',
	'ql-align-center',
	'ql-align-right'
];
const STRING_RE = /(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g;
const SKIP_DIRS = new Set(['content', 'node_modules']);

function walk(dir: string, out: string[]): string[] {
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) {
			if (!SKIP_DIRS.has(name)) walk(full, out);
		} else if (/\.(ts|tsx)$/.test(name)) {
			out.push(full);
		}
	}
	return out;
}

const problems: string[] = [];
for (const file of walk('src', [])) {
	const lines = readFileSync(file, 'utf8').split('\n');
	lines.forEach((line, i) => {
		for (const match of line.matchAll(STRING_RE)) {
			const content = match[2];
			// Only strings that look like class lists (contain a tailwind-ish token) or are plain single tokens passed as classes.
			for (const token of content.split(/\s+/)) {
				if (BANNED.includes(token) && isClassContext(line, content)) {
					problems.push(`${file}:${i + 1}  bare class "${token}"`);
				}
			}
		}
	});
}

function isClassContext(line: string, content: string): boolean {
	if (
		/overflow\s*=|\.overflow|aria-|key=|type=|role=|id=|name=|slug|from\s|import\s/.test(line) &&
		!/className|cn\(|class=/.test(line)
	) {
		return false;
	}
	// Multi-token strings or strings on className/cn/clsx lines count as class strings.
	return /className|cn\(|clsx|class=|classes|Class/.test(line) || content.trim().split(/\s+/).length > 1;
}

if (problems.length > 0) {
	console.error('Colliding class names found (see Moyklass widget CSS):\n' + problems.join('\n'));
	process.exit(1);
}
console.log('check-class-collisions: ok');
