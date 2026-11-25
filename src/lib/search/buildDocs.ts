/** Server only: collects plain text from `@/content`. The client never imports this module. */
import {
	aboutPage,
	audienceLabels,
	directionCategoryLabels,
	directions,
	directionsIndexPage,
	eventsPage,
	festivalsPage,
	formatPhone,
	home,
	homeFaq,
	newsPage,
	priceList,
	privacyPage,
	reviewsPage,
	schedulePage,
	site,
	studios,
	tariffsPage,
	teachers,
	teamPage
} from '@/content';
import {mainNav} from '@/content/navigation';
import {formatPrice} from '@/lib/format';

import type {TBlock, TPage, TPageSection, TSeo} from '@/content';
import type {TSearchDoc} from './types';

const MAX_BODY = 1200;

function clean(text: string): string {
	return text.replace(/\s+/g, ' ').trim();
}

function truncate(text: string): string {
	const value = clean(text);
	return value.length > MAX_BODY ? value.slice(0, MAX_BODY) : value;
}

/** `ШКОЛА МОДЕЛЕЙ` -> `Школа моделей`; text that already has lowercase letters is left alone. */
function humanCase(text: string): string {
	const value = clean(text);
	if (value !== value.toUpperCase()) return value;
	const lower = value.toLowerCase();
	return lower.replace(/(^|\/)(\p{L})/gu, (_match, prefix: string, letter: string) => prefix + letter.toUpperCase());
}

function blocksToText(blocks: TBlock[]): string {
	return blocks
		.map((block) => {
			switch (block.type) {
				case 'paragraph':
				case 'heading':
					return block.text;
				case 'list':
					return block.items.map((item) => item.text).join(' ');
				case 'stat':
					return `${block.value} ${block.label}`;
				case 'cards':
					return block.items.map((item) => `${item.title} ${item.text}`).join(' ');
			}
		})
		.join(' ');
}

function sectionsToText(sections: TPageSection[]): string {
	return sections
		.map((section) => {
			switch (section.type) {
				case 'hero':
					return `${section.heading} ${section.subheading ?? ''}`;
				case 'cards':
					return `${section.heading ?? ''} ${section.items.map((item) => `${item.title} ${item.text}`).join(' ')}`;
				case 'article':
					return blocksToText(section.blocks);
				case 'video':
					return `${section.heading ?? ''} ${section.videos.map((video) => video.caption ?? '').join(' ')}`;
				case 'downloads':
					return `${section.heading} ${section.items.map((item) => item.label).join(' ')}`;
			}
		})
		.join(' ');
}

/** Labels the main menu uses for a path (e.g. «Игра на музыкальных инструментах»): good alias keywords. */
function navLabels(href: string): string[] {
	const labels: string[] = [];
	for (const item of mainNav) {
		const links = [item, ...(item.children ?? []), ...(item.columns?.flatMap((column) => column.links) ?? [])];
		for (const link of links) {
			if (link.href === href) labels.push(link.label);
		}
	}
	return labels;
}

function pageDoc(input: {
	id: string;
	title: string;
	href: string;
	seo?: TSeo;
	keywords?: string[];
	subtitle?: string;
	body: string[];
}): TSearchDoc {
	return {
		id: `page:${input.id}`,
		type: 'page',
		title: humanCase(input.title),
		subtitle: input.subtitle ?? 'Страница',
		href: input.href,
		keywords: clean([input.seo?.title ?? '', ...(input.keywords ?? []), ...navLabels(input.href)].join(' ')),
		body: truncate([...input.body, input.seo?.description ?? ''].join(' '))
	};
}

function directionDocs(): TSearchDoc[] {
	return directions.map((direction) => {
		const programmeTitles = direction.sections.flatMap((section) =>
			section.type === 'programme' ? section.items.map((item) => item.title) : []
		);
		const sectionText = direction.sections.map((section) => {
			switch (section.type) {
				case 'intro':
				case 'article':
					return blocksToText(section.blocks);
				case 'programme':
					return `${section.heading ?? ''} ${section.items.map((item) => `${item.title} ${item.text}`).join(' ')}`;
				case 'howClassesGo':
					return `${section.heading} ${section.videos.map((video) => video.caption ?? '').join(' ')}`;
			}
		});
		return {
			id: `direction:${direction.slug}`,
			type: 'direction',
			title: humanCase(direction.shortTitle),
			subtitle: `Направление · ${audienceLabels[direction.audience]}`,
			href: direction.path,
			keywords: clean(
				[
					direction.title,
					direction.shortTitle,
					direction.hero.heading,
					direction.tagline ?? '',
					...(direction.highlightBullets ?? []),
					...programmeTitles,
					directionCategoryLabels[direction.category],
					...navLabels(direction.path)
				].join(' ')
			),
			body: truncate([direction.excerpt, ...sectionText, direction.seo.description].join(' '))
		};
	});
}

function studioDocs(): TSearchDoc[] {
	return studios.map((studio) => ({
		id: `studio:${studio.slug}`,
		type: 'studio',
		title: humanCase(studio.shortName),
		subtitle: `Студия · ${studio.metro.join(', ')}`,
		href: studio.path,
		keywords: clean([studio.name, ...studio.metro, studio.address, ...navLabels(studio.path)].join(' ')),
		body: truncate(
			[studio.address, studio.hours, studio.phones.map(formatPhone).join(' '), studio.seo.description].join(' ')
		)
	}));
}

function teacherDocs(): TSearchDoc[] {
	const titles = new Map(directions.map((direction) => [direction.slug, direction.shortTitle]));
	return teachers.map((teacher) => {
		const directionTitles = teacher.directionSlugs.flatMap((slug) => titles.get(slug) ?? []);
		return {
			id: `teacher:${teacher.id}`,
			type: 'teacher',
			title: teacher.name,
			subtitle:
				teacher.role ?? (directionTitles.length > 0 ? `Педагог · ${directionTitles.join(', ')}` : 'Педагог'),
			href: `/komanda/#${teacher.id}`,
			keywords: clean([teacher.role ?? '', ...directionTitles].join(' ')),
			body: truncate(blocksToText(teacher.bio)).slice(0, 500)
		};
	});
}

function faqDocs(): TSearchDoc[] {
	return homeFaq.items.map((item) => ({
		id: `faq:${item.id}`,
		type: 'faq',
		title: item.question,
		subtitle: 'Вопрос и ответ',
		href: `/o-nas/#${item.id}`,
		keywords: '',
		body: truncate(item.answerText)
	}));
}

function priceDocs(): TSearchDoc[] {
	const titles = new Map(directions.map((direction) => [direction.slug, direction.shortTitle]));
	const docs: TSearchDoc[] = [
		{
			id: 'price:trial',
			type: 'price',
			title: humanCase(priceList.trialLesson.label),
			subtitle: `Цены · ${formatPrice(priceList.trialLesson.priceRub)}`,
			href: tariffsPage.path,
			keywords: 'пробное занятие пробный урок',
			body: ''
		}
	];
	type TMerged = {
		title: string;
		slugs: Set<string>;
		from: Map<string, number>;
		columns: Set<string>;
		notes: string[];
	};
	const merged = new Map<string, TMerged>();
	for (const group of priceList.groups) {
		for (const row of group.rows) {
			const title = humanCase(row.label);
			const key = title.toLowerCase();
			const entry = merged.get(key) ?? {
				title,
				slugs: new Set<string>(),
				from: new Map<string, number>(),
				columns: new Set<string>(),
				notes: []
			};
			row.directionSlugs.forEach((slug) => entry.slugs.add(slug));
			group.columns.forEach((column) => entry.columns.add(column.label));
			if (row.note) entry.notes.push(row.note);
			const prices = row.prices.filter((price): price is number => price !== null);
			if (prices.length > 0) {
				const label = group.id === 'group' ? 'группа' : 'индивидуально';
				entry.from.set(label, Math.min(entry.from.get(label) ?? Infinity, ...prices));
			}
			merged.set(key, entry);
		}
	}
	for (const [key, entry] of merged) {
		const parts = [...entry.from].map(([label, price]) => `${label} от ${formatPrice(price)}`);
		docs.push({
			id: `price:${key}`,
			type: 'price',
			title: entry.title,
			subtitle: ['Цены', ...parts].join(' · '),
			href: tariffsPage.path,
			keywords: clean([...[...entry.slugs].flatMap((slug) => titles.get(slug) ?? []), 'абонемент'].join(' ')),
			body: truncate([...entry.columns, ...entry.notes].join(' '))
		});
	}
	return docs;
}

function pageDocs(): TSearchDoc[] {
	const simple = (page: TPage, keywords: string[] = []): TSearchDoc =>
		pageDoc({
			id: page.id,
			title: page.h1,
			href: page.path,
			seo: page.seo,
			keywords,
			body: [sectionsToText(page.sections)]
		});

	return [
		pageDoc({
			id: 'home',
			title: 'Главная',
			href: home.path,
			seo: home.seo,
			keywords: [home.hero.heading, 'главная страница'],
			body: [
				home.hero.text,
				home.directions.heading,
				...home.directions.cards.map((card) => `${card.title} ${card.bullets.join(' ')}`),
				home.learn.heading,
				home.learn.text,
				...home.learn.list.map((item) => item.text),
				home.performances.heading,
				home.studio.heading,
				home.gallery.heading
			]
		}),
		pageDoc({
			id: 'directions',
			title: directionsIndexPage.h1,
			href: directionsIndexPage.path,
			keywords: ['каталог направлений занятия кружки секции'],
			body: [directions.map((direction) => direction.shortTitle).join(' ')]
		}),
		pageDoc({
			id: 'about',
			title: aboutPage.h1,
			href: aboutPage.path,
			seo: aboutPage.seo,
			keywords: ['о центре'],
			body: [
				sectionsToText(aboutPage.sections),
				home.learn.heading,
				home.learn.text,
				...home.learn.list.map((item) => item.text),
				home.advantagesHeading,
				...home.advantages.map((item) => `${item.title} ${item.text}`),
				home.gallery.heading,
				...home.gallery.tabs.map((tab) => tab.label)
			]
		}),
		simple(eventsPage, ['праздники события']),
		simple(festivalsPage, ['фестивали конкурсы выступления']),
		simple(privacyPage, ['конфиденциальность персональные данные']),
		pageDoc({
			id: 'studios',
			title: 'Студии',
			href: '/studii/',
			subtitle: 'Адреса, телефоны и контакты',
			keywords: ['адрес адреса телефон контакты контакт как связаться связь позвонить добраться метро студии'],
			body: [studios.map((studio) => `${studio.address} ${studio.metro.join(' ')}`).join(' ')]
		}),
		pageDoc({
			id: 'schedule',
			title: schedulePage.h1,
			subtitle: 'Расписание занятий и запись',
			href: schedulePage.path,
			seo: schedulePage.seo,
			keywords: ['расписание занятий время записаться запись записаться на занятие как записаться'],
			body: []
		}),
		pageDoc({
			id: 'tariffs',
			title: tariffsPage.h1,
			subtitle: 'Цены и скидки',
			href: tariffsPage.path,
			seo: tariffsPage.seo,
			keywords: [
				'сколько стоит цена цены стоимость тарифы абонемент прейскурант скидки сколько стоят занятия оплата'
			],
			body: [
				priceList.title,
				priceList.approvedBy,
				priceList.trialLesson.label,
				...tariffsPage.discounts.map((discount) => discount.text),
				...priceList.notes,
				tariffsPage.freePayment.heading,
				tariffsPage.freePayment.text
			]
		}),
		pageDoc({
			id: 'reviews',
			title: reviewsPage.h1,
			href: reviewsPage.path,
			seo: reviewsPage.seo,
			body: [blocksToText(reviewsPage.intro)]
		}),
		pageDoc({
			id: 'news',
			title: newsPage.h1,
			href: newsPage.path,
			seo: newsPage.seo,
			body: [blocksToText(newsPage.intro), newsPage.links.map((link) => link.label).join(' ')]
		}),
		pageDoc({
			id: 'team',
			title: teamPage.h1,
			href: teamPage.path,
			seo: teamPage.seo,
			keywords: ['педагоги преподаватели учителя команда'],
			body: []
		})
	];
}

function documentDocs(): TSearchDoc[] {
	return site.documents.map((document) => ({
		id: `document:${document.id}`,
		type: 'document',
		title: document.title,
		subtitle: 'Документ · PDF',
		href: document.href,
		keywords: 'документ pdf',
		body: ''
	}));
}

export function buildSearchDocs(): TSearchDoc[] {
	const seen = new Set<string>();
	const docs: TSearchDoc[] = [];
	for (const doc of [
		...directionDocs(),
		...studioDocs(),
		...teacherDocs(),
		...faqDocs(),
		...priceDocs(),
		...pageDocs(),
		...documentDocs()
	]) {
		if (doc.title.trim().length === 0 || seen.has(doc.id)) continue;
		seen.add(doc.id);
		docs.push(doc);
	}
	return docs;
}
