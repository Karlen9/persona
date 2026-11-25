/** Pure text helpers shared by the server (index build, /poisk/) and the client (palette). */

export function normalizeText(input: string): string {
	return input
		.normalize('NFKC')
		.toLowerCase()
		.replace(/ё/g, 'е')
		.replace(/[^\p{L}\p{N}]+/gu, ' ')
		.trim();
}

export function tokenize(input: string): string[] {
	return normalizeText(input)
		.split(' ')
		.filter((token) => token.length > 0);
}

// ---------------------------------------------------------------------------------------------------------------------
// Snowball Russian stemmer (Porter's Russian algorithm). Input is expected to be normalised (lowercase, ё -> е).
// ---------------------------------------------------------------------------------------------------------------------

const VOWELS = 'аеиоуыэюя';
const CYRILLIC_WORD = /^[а-я]+$/;

const PERFECTIVE_GERUND_1 = ['вшись', 'вши', 'в'];
const PERFECTIVE_GERUND_2 = ['ившись', 'ывшись', 'ивши', 'ывши', 'ив', 'ыв'];
const REFLEXIVE = ['ся', 'сь'];
const ADJECTIVE = [
	'ее',
	'ие',
	'ые',
	'ое',
	'ими',
	'ыми',
	'ей',
	'ий',
	'ый',
	'ой',
	'ем',
	'им',
	'ым',
	'ом',
	'его',
	'ого',
	'ему',
	'ому',
	'их',
	'ых',
	'ую',
	'юю',
	'ая',
	'яя',
	'ою',
	'ею'
];
const PARTICIPLE_1 = ['ем', 'нн', 'вш', 'ющ', 'щ'];
const PARTICIPLE_2 = ['ивш', 'ывш', 'ующ'];
const VERB_1 = ['ла', 'на', 'ете', 'йте', 'ли', 'й', 'л', 'ем', 'н', 'ло', 'но', 'ет', 'ют', 'ны', 'ть', 'ешь', 'нно'];
const VERB_2 = [
	'ила',
	'ыла',
	'ена',
	'ейте',
	'уйте',
	'ите',
	'или',
	'ыли',
	'ей',
	'уй',
	'ил',
	'ыл',
	'им',
	'ым',
	'ен',
	'ило',
	'ыло',
	'ено',
	'ят',
	'ует',
	'уют',
	'ит',
	'ыт',
	'ены',
	'ить',
	'ыть',
	'ишь',
	'ую',
	'ю'
];
const NOUN = [
	'а',
	'ев',
	'ов',
	'ие',
	'ье',
	'е',
	'иями',
	'ями',
	'ами',
	'еи',
	'ии',
	'и',
	'ией',
	'ей',
	'ой',
	'ий',
	'й',
	'иям',
	'ям',
	'ием',
	'ем',
	'ам',
	'ом',
	'о',
	'у',
	'ах',
	'иях',
	'ях',
	'ы',
	'ь',
	'ию',
	'ью',
	'ю',
	'ия',
	'ья',
	'я'
];

function isVowel(char: string): boolean {
	return VOWELS.includes(char);
}

/** Index where the region after the first "vowel followed by non-vowel" pair starts (searching from `from`). */
function regionStart(word: string, from: number): number {
	for (let i = from + 1; i < word.length; i += 1) {
		if (!isVowel(word[i]) && isVowel(word[i - 1])) return i + 1;
	}
	return word.length;
}

/**
 * Longest ending from `plain` (any) or `afterAYa` (must be preceded by а/я inside RV) that `word` has.
 * Returns the number of characters to remove (the а/я stays), or 0.
 */
function matchEnding(word: string, rvStart: number, plain: string[], afterAYa: string[] = []): number {
	let best = 0;
	let bestTotal = 0;
	for (const ending of plain) {
		if (ending.length > bestTotal && word.length - ending.length >= rvStart && word.endsWith(ending)) {
			best = ending.length;
			bestTotal = ending.length;
		}
	}
	for (const ending of afterAYa) {
		const total = ending.length + 1;
		if (total <= bestTotal || word.length - total < rvStart || !word.endsWith(ending)) continue;
		const before = word[word.length - ending.length - 1];
		if (before === 'а' || before === 'я') {
			best = ending.length;
			bestTotal = total;
		}
	}
	return best;
}

function stemCyrillic(word: string): string {
	const firstVowel = [...word].findIndex(isVowel);
	if (firstVowel === -1) return word;
	const rvStart = firstVowel + 1;
	const r1 = regionStart(word, 0);
	const r2 = regionStart(word, r1);

	let w = word;
	const chop = (count: number): void => {
		w = w.slice(0, w.length - count);
	};

	// Step 1
	let removed = matchEnding(w, rvStart, PERFECTIVE_GERUND_2, PERFECTIVE_GERUND_1);
	if (removed > 0) {
		chop(removed);
	} else {
		removed = matchEnding(w, rvStart, REFLEXIVE);
		if (removed > 0) chop(removed);
		removed = matchEnding(w, rvStart, ADJECTIVE);
		if (removed > 0) {
			chop(removed);
			removed = matchEnding(w, rvStart, PARTICIPLE_2, PARTICIPLE_1);
			if (removed > 0) chop(removed);
		} else {
			removed = matchEnding(w, rvStart, VERB_2, VERB_1);
			if (removed > 0) {
				chop(removed);
			} else {
				removed = matchEnding(w, rvStart, NOUN);
				if (removed > 0) chop(removed);
			}
		}
	}

	// Step 2
	if (w.length > rvStart && w.endsWith('и')) chop(1);

	// Step 3
	if (w.endsWith('ость') && w.length - 4 >= r2) chop(4);
	else if (w.endsWith('ост') && w.length - 3 >= r2) chop(3);

	// Step 4
	if (w.endsWith('ейше') && w.length - 4 >= rvStart) {
		chop(4);
		if (w.endsWith('нн')) chop(1);
	} else if (w.endsWith('ейш') && w.length - 3 >= rvStart) {
		chop(3);
		if (w.endsWith('нн')) chop(1);
	} else if (w.endsWith('нн')) {
		chop(1);
	} else if (w.endsWith('ь') && w.length - 1 >= rvStart) {
		chop(1);
	}

	return w;
}

/** Cyrillic words of 4+ letters are stemmed; everything else (Latin, digits, short words) is returned unchanged. */
export function stemRu(word: string): string {
	if (word.length < 4 || !CYRILLIC_WORD.test(word)) return word;
	const stem = stemCyrillic(word);
	return stem.length > 0 ? stem : word;
}

export const STOP_WORDS: Set<string> = new Set([
	'и',
	'в',
	'во',
	'на',
	'с',
	'со',
	'для',
	'по',
	'к',
	'ко',
	'у',
	'о',
	'об',
	'от',
	'до',
	'из',
	'за',
	'а',
	'но',
	'же',
	'ли',
	'не',
	'ни',
	'то',
	'что',
	'как',
	'это',
	'или',
	'при',
	'про',
	'над',
	'под',
	'мы',
	'вы',
	'я'
]);

/** Used for both indexing and querying. */
export function processTerm(term: string): string | null {
	const normalized = normalizeText(term);
	if (normalized.length === 0 || STOP_WORDS.has(normalized)) return null;
	return stemRu(normalized);
}

const LAYOUT_LOWER = "qwertyuiop[]asdfghjkl;'zxcvbnm,.`";
const LAYOUT_LOWER_RU = 'йцукенгшщзхъфывапролджэячсмитьбюё';
const LAYOUT_MAP: Map<string, string> = (() => {
	const map = new Map<string, string>();
	[...LAYOUT_LOWER].forEach((char, index) => {
		const target = LAYOUT_LOWER_RU[index];
		map.set(char, target);
		map.set(char.toUpperCase(), target.toUpperCase());
	});
	return map;
})();

/** `nfyws` -> `танцы`. Returns `null` unless the input has Latin letters and no Cyrillic. */
export function fixKeyboardLayout(input: string): string | null {
	if (/[Ѐ-ӿ]/.test(input) || !/[a-z]/i.test(input)) return null;
	return [...input].map((char) => LAYOUT_MAP.get(char) ?? char).join('');
}
