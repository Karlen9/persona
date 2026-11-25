/**
 * Search quality + performance check. Run from the repo root:  bun run check:search (needs a seeded CMS)
 *
 * Builds the search docs (from the seeded CMS via the Local API) and engine directly (no server) and asserts expected top results for realistic queries,
 * the highlight helpers and the engine build / query timings. Exits with code 1 on any failure.
 *
 * Tooling only: not imported by the app.
 */
import {buildSearchDocs} from '../src/lib/search/buildDocs';
import {createSearchEngine} from '../src/lib/search/engine';
import {highlightSegments, makeSnippet} from '../src/lib/search/highlight';

import type {TSearchResult} from '../src/lib/search/engine';

const docs = await buildSearchDocs();
let failures = 0;

function fail(message: string): void {
	failures += 1;
	console.log(`  FAIL ${message}`);
}

function pass(message: string): void {
	console.log(`  ok   ${message}`);
}

const buildStart = performance.now();
const engine = createSearchEngine(docs);
const coldBuildMs = performance.now() - buildStart;

const hrefs = (result: TSearchResult, count: number): string[] =>
	result.hits.slice(0, count).map((hit) => hit.doc.href);

type TCase = {
	query: string;
	/** Top hit must be this href. */
	top?: string;
	/** This href must be within the first `within` hits (default 3). */
	inTop?: string;
	within?: number;
	/** Predicate on the first `within` hits (default 5). */
	anyDoc?: (id: string, href: string) => boolean;
	anyLabel?: string;
	corrected?: boolean;
};

const cases: TCase[] = [
	{query: 'танцы', top: '/napravleniya/tancy/'},
	{query: 'танцев', top: '/napravleniya/tancy/'},
	{query: 'танц', top: '/napravleniya/tancy/'},
	{query: 'nfyws', top: '/napravleniya/tancy/', corrected: true},
	{query: 'пилатес', top: '/napravleniya/pilates/'},
	{query: 'пилатис', top: '/napravleniya/pilates/'},
	{query: 'йога', top: '/napravleniya/joga/'},
	{query: 'робот', top: '/napravleniya/robototehnika/'},
	{query: 'робототехника', top: '/napravleniya/robototehnika/'},
	{query: 'шахмат', top: '/napravleniya/shahmaty/'},
	{query: 'логопед', top: '/napravleniya/logoped/'},
	{query: 'продленка', top: '/napravleniya/prodlenka/'},
	{query: 'продлёнка', top: '/napravleniya/prodlenka/'},
	{query: 'солнцево', top: '/studii/solntsevo/'},
	{query: 'профсоюзная', top: '/studii/profsoyuznaya/'},
	{query: 'комарова', top: '/komanda/#nataliya-yurevna-komarova'},
	{query: 'договор', inTop: '/docs/abonentskij-dogovor.pdf', within: 3},
	{
		query: 'скидка',
		within: 5,
		anyDoc: (id, href) => id.startsWith('faq:') || href === '/tarify/',
		anyLabel: 'an FAQ hit or /tarify/'
	},
	{
		query: 'пробное занятие',
		within: 3,
		anyDoc: (id, href) => id === 'price:trial' || href === '/tarify/',
		anyLabel: 'the trial-lesson price doc or /tarify/'
	},
	// Realistic extras from the actual content.
	{query: 'k-pop', top: '/napravleniya/tancy/'},
	{query: 'брейк', top: '/napravleniya/tancy/'},
	{query: 'хип хоп', top: '/napravleniya/tancy/'},
	{query: 'английский', top: '/napravleniya/yazykovaya-shkola/'},
	{query: 'славянский бульвар', top: '/studii/slavyanskiy-bulvar/'},
	{query: 'раменки', top: '/studii/michurinskiy-prospekt/'},
	{query: 'вокал', top: '/napravleniya/vokal/'},
	{query: 'бокс', top: '/tarify/'},
	{query: 'отбор педагогов', top: '/o-nas/#faq-1'},
	{query: 'правила поведения', inTop: '/docs/pravila-povedeniya.pdf', within: 3},
	{query: 'сколько стоит', top: '/tarify/'},
	{query: 'цена', top: '/tarify/'},
	{query: 'стоимость', top: '/tarify/'},
	{
		query: 'записаться',
		within: 3,
		anyDoc: (_id, href) => href === '/raspisanie/' || href === '/',
		anyLabel: '/raspisanie/ or home'
	},
	{
		query: 'как записаться',
		within: 3,
		anyDoc: (_id, href) => href === '/raspisanie/' || href === '/',
		anyLabel: '/raspisanie/ or home'
	},
	{
		query: 'запись',
		within: 3,
		anyDoc: (_id, href) => href === '/raspisanie/' || href === '/',
		anyLabel: '/raspisanie/ or home'
	},
	{query: 'телефон', within: 3, anyDoc: (_id, href) => href.startsWith('/studii/'), anyLabel: 'a studio or /studii/'},
	{query: 'адрес', within: 3, anyDoc: (_id, href) => href.startsWith('/studii/'), anyLabel: 'a studio or /studii/'},
	{
		query: 'контакты',
		within: 3,
		anyDoc: (_id, href) => href.startsWith('/studii/'),
		anyLabel: 'a studio or /studii/'
	},
	{query: 'контакты', top: '/studii/'},
	{query: 'контакт', top: '/studii/'},
	{query: 'как связаться', top: '/studii/'},
	{query: 'школа моделей', top: '/napravleniya/shkola-modeley/'}
];

console.log('Query assertions');
for (const testCase of cases) {
	const result = engine.search(testCase.query);
	const label = `${testCase.query}`;
	const top = hrefs(result, 5);
	let ok = true;
	if (testCase.top !== undefined && result.hits[0]?.doc.href !== testCase.top) {
		ok = false;
		fail(`${label}: expected top ${testCase.top}, got ${top.join(', ') || '(none)'}`);
	}
	if (testCase.inTop !== undefined && !hrefs(result, testCase.within ?? 3).includes(testCase.inTop)) {
		ok = false;
		fail(`${label}: expected ${testCase.inTop} in top ${testCase.within ?? 3}, got ${top.join(', ') || '(none)'}`);
	}
	if (
		testCase.anyDoc !== undefined &&
		!result.hits.slice(0, testCase.within ?? 5).some((hit) => testCase.anyDoc?.(hit.doc.id, hit.doc.href))
	) {
		ok = false;
		fail(
			`${label}: expected ${testCase.anyLabel} in top ${testCase.within ?? 5}, got ${top.join(', ') || '(none)'}`
		);
	}
	if (testCase.corrected && result.correctedQuery === null) {
		ok = false;
		fail(`${label}: expected correctedQuery to be set`);
	}
	if (ok) {
		const extra = result.correctedQuery ? ` (corrected: ${result.correctedQuery})` : '';
		pass(`${label} -> ${result.hits[0]?.doc.href ?? '(none)'}${extra}`);
	}
}

console.log('Negative / edge cases');
if (engine.search('   ').hits.length === 0) pass('blank query -> no hits');
else fail('blank query should have no hits');
if (engine.search('и в на').hits.length === 0) pass('only stop words -> no hits');
else fail('only stop words should have no hits');
if (engine.search('qqqqzzzz').hits.length === 0) pass('gibberish -> no hits');
else fail('gibberish should have no hits');

console.log('Highlight helpers');
{
	const text = 'Занятия танцами для детей: хип-хоп, брейк-данс и K-pop.';
	const segments = highlightSegments(text, ['танц']);
	if (segments.map((segment) => segment.text).join('') !== text) fail('highlightSegments must preserve the text');
	else if (!segments.some((segment) => segment.match && segment.text === 'танцами')) fail('танцами not highlighted');
	else pass('highlightSegments preserves text and marks stems');
	const long = `${'слово '.repeat(60)}танцы ${'слово '.repeat(60)}`;
	const snippet = makeSnippet(long, ['танц']);
	if (!snippet.includes('танцы') || !snippet.startsWith('…') || !snippet.endsWith('…') || snippet.length > 200) {
		fail(`makeSnippet window is wrong: ${snippet}`);
	} else pass('makeSnippet centres on the first match with ellipses');
	if (makeSnippet(long, ['нетакого']).length > 145) fail('makeSnippet fallback should be ~140 chars');
	else pass('makeSnippet fallback is short');
}

console.log('Performance');
const jsonBytes = Buffer.byteLength(JSON.stringify(docs));
console.log(`  docs: ${docs.length}, JSON size: ${(jsonBytes / 1024).toFixed(1)} KB`);
if (jsonBytes < 150 * 1024) pass('index JSON < 150 KB');
else fail(`index JSON is ${(jsonBytes / 1024).toFixed(1)} KB (target < 150 KB)`);

const builds: number[] = [];
for (let i = 0; i < 7; i += 1) {
	const start = performance.now();
	createSearchEngine(docs);
	builds.push(performance.now() - start);
}
builds.sort((a, b) => a - b);
const medianBuild = builds[Math.floor(builds.length / 2)];
console.log(`  engine build: first (cold) ${coldBuildMs.toFixed(1)} ms, median of 7 warm ${medianBuild.toFixed(1)} ms`);
if (medianBuild < 50) pass('engine build < 50 ms (warm median)');
else fail(`engine build median ${medianBuild.toFixed(1)} ms >= 50 ms`);

const mixed = [
	...cases.map((testCase) => testCase.query),
	'танцы для детей',
	'расписание',
	'цены',
	'как записаться',
	'сол',
	'пилат',
	'нежинская',
	'ghbdtn',
	'вокалл',
	'театральная студия',
	'логопед для ребенка',
	'мичуринский'
];
const RUNS = 2000;
const queryStart = performance.now();
for (let i = 0; i < RUNS; i += 1) engine.search(mixed[i % mixed.length]);
const avgMs = (performance.now() - queryStart) / RUNS;
console.log(`  ${RUNS} searches: avg ${avgMs.toFixed(3)} ms each`);
if (avgMs < 1) pass('average search < 1 ms');
else fail(`average search ${avgMs.toFixed(3)} ms >= 1 ms`);

if (failures > 0) {
	console.log(`\n${failures} check(s) failed`);
	process.exit(1);
}
console.log('\nAll search checks passed');
