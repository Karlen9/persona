#!/usr/bin/env node
/**
 * Live-rendering crawler for the OLD site (personamodel.ru): opens every page in a real (headless) Chrome at desktop
 * width, scrolls through it, waits for the runtime scripts (poster / video swaps, late CSS), clicks every tab and steps
 * every slider, and dumps what is actually rendered: computed background images, loaded <img>, <video>/<source>/poster
 * and the Elementor video widgets (with their overlay as rendered).
 *
 * Resumable: one raw JSON per page is written to <out>/<NN>.json; pages that already have a file are skipped
 * (delete the file or pass --force to redo). Read-only GETs only, sequential, with retries.
 *
 * Usage:
 *   node scripts/live_audit.mjs --manifest <crawl>/html/manifest.tsv --out <dir> [--only 25,26] [--force]
 * Needs puppeteer-core (not a project dependency): set PUPPETEER_CORE=/abs/path/to/node_modules/puppeteer-core
 * and CHROME=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome (default).
 * Then `python3 scripts/live_audit_report.py` builds scripts/data/live-video-audit.json + live-image-audit.json.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const arg = (name, def) => {
	const i = args.indexOf(`--${name}`);
	return i >= 0 ? args[i + 1] : def;
};
const manifest = arg('manifest');
const outDir = arg('out');
const only = arg('only') ? arg('only').split(',') : null;
const force = args.includes('--force');
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const puppeteer = (
	await import(path.join(process.env.PUPPETEER_CORE || 'puppeteer-core', 'lib/esm/puppeteer/puppeteer-core.js'))
).default;

fs.mkdirSync(outDir, {recursive: true});
const rows = fs
	.readFileSync(manifest, 'utf8')
	.split('\n')
	.filter(Boolean)
	.map((l) => l.split('\t'))
	.map((c) => ({id: c[0], status: c[1], url: c[5]}));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Runs inside the page. Returns everything rendered in the page body (outside header / footer / menus / popups). */
function collect() {
	const LAZY_ATTRS = [
		'data-thumbnail',
		'data-persona-hold',
		'data-persona-href',
		'data-src',
		'data-lazy-src',
		'data-bg',
		'data-poster'
	];
	const EXC =
		'header, footer, nav, [data-elementor-type="header"], [data-elementor-type="footer"], [data-elementor-type="popup"], ' +
		'.elementor-location-header, .elementor-location-footer, .elementor-popup-modal, .dialog-widget, .dialog-lightbox-widget, ' +
		'[id*="cookie" i], [class*="cookie" i], [class*="cmplz"], .elementor-nav-menu--dropdown, .elementor-menu-toggle, ' +
		'#wpadminbar, .persona-floating, [class*="floating" i]';
	const urlsOf = (v) => (v && v !== 'none' ? [...v.matchAll(/url\((["']?)(.*?)\1\)/g)].map((m) => m[2]) : []);
	const out = {bg: [], img: [], videos: [], widgets: [], lazy: []};
	const heading = (el) => {
		// nearest heading text inside the same widget / container chain
		let p = el;
		for (let i = 0; i < 6 && p; i++, p = p.parentElement) {
			const h = p.querySelector && p.querySelector('h1,h2,h3,h4,h5,h6,.elementor-flip-box__layer__title');
			if (h && h.textContent.trim()) return h.textContent.trim().slice(0, 80);
		}
		return null;
	};
	const sectionHeading = (el) => {
		let best = null;
		const hs = [...document.querySelectorAll('h1,h2,h3')].filter((h) => !h.closest(EXC));
		for (const h of hs) {
			if (h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)
				best = h.textContent.trim().slice(0, 80);
		}
		return best;
	};
	const rectOf = (el) => {
		const r = el.getBoundingClientRect();
		return {
			x: Math.round(r.x + scrollX),
			y: Math.round(r.y + scrollY),
			w: Math.round(r.width),
			h: Math.round(r.height)
		};
	};
	const visibleOf = (el) => {
		const r = el.getBoundingClientRect();
		if (r.width < 2 || r.height < 2) return false;
		for (let p = el; p && p.nodeType === 1; p = p.parentElement) {
			const s = getComputedStyle(p);
			if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0) return false;
		}
		return true;
	};
	const tabOf = (el) => {
		const panel = el.closest('[role="tabpanel"], .elementor-tab-content');
		if (!panel) return null;
		const labelled = panel.getAttribute('aria-labelledby');
		const title = labelled ? document.getElementById(labelled) : null;
		return {
			id: panel.getAttribute('data-id') || panel.id || null,
			label: title ? title.textContent.trim().slice(0, 40) : null
		};
	};
	const widgetOf = (el) => {
		const w = el.closest('[data-widget_type]');
		return w ? {type: w.getAttribute('data-widget_type'), id: w.getAttribute('data-id')} : null;
	};
	const flipOf = (el) => {
		const f = el.closest('.elementor-flip-box');
		if (!f) return null;
		const side = el.closest('.elementor-flip-box__front')
			? 'front'
			: el.closest('.elementor-flip-box__back')
				? 'back'
				: null;
		const t = f.querySelector('.elementor-flip-box__layer__title');
		return {title: t ? t.textContent.trim() : null, side};
	};
	const all = document.querySelectorAll('body *');
	for (const el of all) {
		if (el.closest(EXC)) continue;
		if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'LINK', 'META', 'SVG', 'PATH'].includes(el.tagName.toUpperCase())) continue;
		for (const pseudo of [null, '::before', '::after']) {
			const cs = getComputedStyle(el, pseudo);
			const urls = urlsOf(cs.backgroundImage);
			if (!urls.length) continue;
			if (pseudo && (cs.content === 'none' || cs.content === 'normal')) continue;
			out.bg.push({
				urls,
				pseudo,
				tag: el.tagName.toLowerCase(),
				id: el.getAttribute('data-id'),
				cls: (el.getAttribute('class') || '')
					.split(/\s+/)
					.filter((c) =>
						/elementor-(flip|widget|swiper|slide|carousel|tab|image|custom|background)|swiper|slick|e-con|e-n-/.test(
							c
						)
					)
					.slice(0, 6)
					.join(' '),
				visible: visibleOf(el),
				rect: rectOf(el),
				tab: tabOf(el),
				widget: widgetOf(el),
				flip: flipOf(el),
				heading: heading(el),
				section: sectionHeading(el)
			});
		}
		// images declared by lazy-loading attributes (gallery thumbnails, <img data-persona-hold>, lightbox links): they only
		// get a real src when scrolled to / opened, so they are recorded by URL; `visible` is the visibility of the element
		// or, inside a tab pane / gallery, of the pane (items beyond the first rows are revealed by «Смотреть далее»).
		for (const attr of LAZY_ATTRS) {
			const v = el.getAttribute(attr);
			if (v && /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(v)) {
				const panel = el.closest('[role="tabpanel"], .elementor-tab-content');
				out.lazy.push({
					attr,
					url: v,
					visible: visibleOf(panel || el),
					tab: tabOf(el),
					rect: rectOf(el),
					section: sectionHeading(el)
				});
			}
		}
		if (el.tagName === 'A' && el.hasAttribute('data-elementor-open-lightbox')) {
			const v = el.getAttribute('href') || '';
			if (/\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(v)) {
				const panel = el.closest('[role="tabpanel"], .elementor-tab-content');
				out.lazy.push({
					attr: 'lightbox-href',
					url: v,
					visible: visibleOf(panel || el),
					tab: tabOf(el),
					rect: rectOf(el),
					section: sectionHeading(el)
				});
			}
		}
		if (el.tagName === 'IMG') {
			out.img.push({
				src: el.currentSrc || el.src,
				attrSrc: el.getAttribute('src'),
				dataSrc: el.getAttribute('data-src') || el.getAttribute('data-lazy-src'),
				naturalWidth: el.naturalWidth,
				naturalHeight: el.naturalHeight,
				alt: el.alt,
				visible: visibleOf(el),
				rect: rectOf(el),
				tab: tabOf(el),
				widget: widgetOf(el),
				flip: flipOf(el),
				heading: heading(el),
				section: sectionHeading(el)
			});
		}
		if (el.tagName === 'VIDEO') {
			out.videos.push({
				kind: 'video',
				src: el.currentSrc || el.getAttribute('src'),
				sources: [...el.querySelectorAll('source')].map((s) => s.getAttribute('src')),
				poster: el.getAttribute('poster'),
				visible: visibleOf(el),
				rect: rectOf(el),
				widget: widgetOf(el),
				section: sectionHeading(el)
			});
		}
		if (el.tagName === 'IFRAME') {
			out.videos.push({
				kind: 'iframe',
				src: el.getAttribute('src') || el.getAttribute('data-src'),
				visible: visibleOf(el),
				rect: rectOf(el),
				widget: widgetOf(el),
				section: sectionHeading(el)
			});
		}
	}
	const seenWidgets = new Set();
	for (const w of document.querySelectorAll(
		'.elementor-widget-video, .elementor-widget:has([data-elementor-lightbox])'
	)) {
		if (w.closest(EXC) || seenWidgets.has(w)) continue;
		seenWidgets.add(w);
		let settings = null;
		try {
			settings = JSON.parse(w.getAttribute('data-settings') || 'null');
		} catch {}
		const ov = w.querySelector('.elementor-custom-embed-image-overlay');
		let lightbox = null;
		try {
			lightbox =
				ov && ov.getAttribute('data-elementor-lightbox')
					? JSON.parse(ov.getAttribute('data-elementor-lightbox'))
					: null;
		} catch {}
		const slide = w.closest('.swiper-slide');
		const ovImg = ov ? ov.querySelector('img') : null;
		const vid = w.querySelector('video');
		const ifr = w.querySelector('iframe');
		out.widgets.push({
			id: w.getAttribute('data-id'),
			cls: (w.getAttribute('class') || '')
				.split(/\s+/)
				.filter((c) => /elementor-element-|e-con|video|persona/.test(c))
				.slice(0, 6)
				.join(' '),
			videoType: settings && settings.video_type,
			hostedUrl: settings && settings.hosted_url && settings.hosted_url.url,
			youtubeUrl: settings && settings.youtube_url,
			lightboxUrl: lightbox && lightbox.url,
			lightboxType: lightbox && lightbox.videoType,
			lightboxPoster: lightbox && lightbox.videoParams && lightbox.videoParams.poster,
			slideIndex: slide ? [...slide.parentElement.children].indexOf(slide) : null,
			carousel: slide ? (slide.closest('[data-id]') || {getAttribute: () => null}).getAttribute('data-id') : null,
			caption: (w.querySelector('.persona-hcg-cap') || {}).textContent || null,
			widgetType: w.getAttribute('data-widget_type'),
			tab: tabOf(w),
			overlaySetting: settings && settings.image_overlay && settings.image_overlay.url,
			showOverlay: settings && settings.show_image_overlay,
			overlayBg: ov ? getComputedStyle(ov).backgroundImage : null,
			overlayImg: ovImg ? {src: ovImg.currentSrc || ovImg.src, nw: ovImg.naturalWidth} : null,
			overlayVisible: ov ? visibleOf(ov) : null,
			videoSrc: vid ? vid.currentSrc || vid.getAttribute('src') : null,
			videoSources: vid ? [...vid.querySelectorAll('source')].map((s) => s.getAttribute('src')) : [],
			videoPoster: vid ? vid.getAttribute('poster') : null,
			iframeSrc: ifr ? ifr.getAttribute('src') || ifr.getAttribute('data-src') : null,
			visible: visibleOf(w),
			rect: rectOf(w),
			section: sectionHeading(w),
			heading: heading(w)
		});
	}
	return out;
}

async function autoScroll(page) {
	const h = await page.evaluate(() => document.documentElement.scrollHeight);
	for (let y = 0; y < h + 900; y += 450) {
		await page.evaluate((yy) => window.scrollTo(0, yy), y);
		await sleep(250);
	}
	await sleep(1500);
	await page.evaluate(() => window.scrollTo(0, 0));
}

/** Click every tab and step every slider so that lazily rendered / initially hidden panes get collected too. */
async function exercise(page) {
	const tabs = await page.$$('[role="tab"]:not(header *):not(footer *), .elementor-tab-title, .e-n-tab-title');
	const seen = [];
	for (const t of tabs) {
		try {
			await t.evaluate((el) => el.scrollIntoView({block: 'center'}));
			await t.click({delay: 20});
			await sleep(700);
			await autoScroll(page).catch(() => {});
			seen.push(await page.evaluate(collect));
		} catch {}
	}
	const nexts = await page.$$(
		'.swiper-button-next, .elementor-swiper-button-next, .slick-next, .swiper-pagination-bullet'
	);
	for (const n of nexts.slice(0, 40)) {
		try {
			const inMain = await n.evaluate(
				(el) =>
					!el.closest(
						'header,footer,[data-elementor-type="header"],[data-elementor-type="footer"],[data-elementor-type="popup"]'
					)
			);
			if (!inMain) continue;
			await n.evaluate((el) => el.scrollIntoView({block: 'center'}));
			await n.click({delay: 20});
			await sleep(400);
		} catch {}
	}
	// every slide is in the DOM once it has been stepped through: one snapshot after the last click is enough
	if (nexts.length) seen.push(await page.evaluate(collect));
	return seen;
}

const browser = await puppeteer.launch({
	executablePath: chrome,
	headless: 'new',
	args: ['--no-sandbox', '--window-size=1440,900']
});
try {
	for (const row of rows) {
		if (only && !only.includes(row.id)) continue;
		if (row.status !== '200') continue;
		const file = path.join(outDir, `${row.id}.json`);
		if (fs.existsSync(file) && !force) {
			console.log(row.id, 'skip (exists)');
			continue;
		}
		let ok = false;
		for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
			const page = await browser.newPage();
			try {
				await page.setViewport({width: 1440, height: 900});
				await page.setUserAgent(
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
				);
				await page.goto(row.url, {waitUntil: 'networkidle2', timeout: 90000});
				await sleep(2500);
				await autoScroll(page);
				await sleep(3000);
				const base = await page.evaluate(collect);
				const extra = await exercise(page);
				fs.writeFileSync(
					file,
					JSON.stringify({id: row.id, url: row.url, base, extra, at: new Date().toISOString()})
				);
				console.log(
					row.id,
					'ok',
					base.bg.length,
					'bg',
					base.img.length,
					'img',
					base.widgets.length,
					'videoWidgets',
					extra.length,
					'extra snapshots'
				);
				ok = true;
			} catch (e) {
				console.log(row.id, 'attempt', attempt, 'failed:', String(e).slice(0, 120));
				await sleep(4000 * attempt);
			} finally {
				await page.close().catch(() => {});
			}
		}
		await sleep(1500);
	}
} finally {
	await browser.close();
}
