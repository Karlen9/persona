import {stringToRichText} from '@/cms/richtext';
import {
	mapBlocks,
	mapCards,
	mapImage,
	mapImages,
	mapLink,
	mapSeo,
	mapVideos,
	requireImage,
	slugOf,
	slugsOf,
	texts
} from '@/lib/cms/mappers/common';
import {formatPrice} from '@/lib/format';

import type {TCoverEntry, TCoverStory} from '@/content/cover';
import type {TFooterColumn, TNavColumn, TNavItem, TNavLink} from '@/content/navigation';
import type {
	TDirectionPageTemplate,
	TDirectionsIndexPage,
	TFaqSection,
	THome,
	TNewsPage,
	TPriceGroup,
	TPriceList,
	TReviewsPage,
	TSchedulePage,
	TSite,
	TTariffsPage,
	TTeamPage
} from '@/content/types';
import type {
	Cover,
	DirectionsIndex,
	DirectionTemplate,
	Home,
	HomeFaq,
	Navigation,
	NewsPage,
	ReviewsPage,
	SchedulePage,
	SiteSetting,
	Tariff,
	TeamPage
} from '@/payload-types';

export const pagePathsOfGlobals = {
	home: '/',
	directionsIndex: '/napravleniya/',
	team: '/komanda/',
	tariffs: '/tarify/',
	reviews: '/otzyvy/',
	news: '/novosti/',
	schedule: '/raspisanie/'
} as const;

export function mapSite(doc: SiteSetting): TSite {
	const api = doc.moyklass.api;
	return {
		name: doc.name,
		cmsSiteName: doc.cmsSiteName,
		legalName: doc.legalName,
		url: doc.url,
		lang: doc.lang,
		foundedYear: doc.foundedYear,
		tagline: {title: doc.tagline.title, text: doc.tagline.text},
		email: doc.email,
		phones: (doc.phones ?? []).map((phone) => ({display: phone.display, tel: phone.tel})),
		logo: requireImage(doc.logo, 'site.logo'),
		favicon: {png: requireImage(doc.favicon.png, 'site.favicon.png'), svg: doc.favicon.svg},
		defaultOgImage: requireImage(doc.defaultOgImage, 'site.defaultOgImage'),
		socials: (doc.socials ?? []).map(({kind, label, url}) => ({kind, label, url})),
		messengerButtons: (doc.messengerButtons ?? []).map(({kind, label, url}) => ({kind, label, url})),
		moyklass: {
			lead: {widgetId: doc.moyklass.lead.widgetId, mountId: doc.moyklass.lead.mountId},
			schedule: {widgetId: doc.moyklass.schedule.widgetId, mountIds: doc.moyklass.schedule.mountIds ?? []},
			api: {
				filialStudio: Object.fromEntries(
					(api?.filialStudio ?? []).map((row) => [row.filialId, row.studioSlug])
				),
				classIds: api?.classIds ?? [],
				courseIds: api?.courseIds ?? []
			}
		},
		metrika: {counterId: doc.metrika.counterId, goals: doc.metrika.goals ?? []},
		yandex: {
			orgId: doc.yandex.orgId,
			orgUrl: doc.yandex.orgUrl,
			ratingBadgeUrl: doc.yandex.ratingBadgeUrl,
			reviewsWidgetUrl: doc.yandex.reviewsWidgetUrl,
			reviewLink: doc.yandex.reviewLink
		},
		twoGis: {reviewsUrl: doc.twoGis.reviewsUrl, badge: requireImage(doc.twoGis.badge, 'site.twoGis.badge')},
		payment: {sbpUrl: doc.payment.sbpUrl},
		documents: (doc.documents ?? []).map((item) => ({
			id: item.key,
			title: item.title,
			href: item.href,
			sizeBytes: item.sizeBytes,
			oldPath: item.oldPath
		})),
		cookieBanner: {
			title: doc.cookieBanner.title,
			description: doc.cookieBanner.description,
			accept: doc.cookieBanner.accept,
			reject: doc.cookieBanner.reject
		},
		seo: {titleSuffix: doc.seo.titleSuffix}
	};
}

const navLink = (link: {label: string; href: string}): TNavLink => ({label: link.label, href: link.href});

export function mapNavigation(doc: Navigation): {
	mainNav: TNavItem[];
	footerNav: TFooterColumn[];
	sectionLinks: TNavLink[];
} {
	return {
		mainNav: (doc.mainNav ?? []).map((item): TNavItem => {
			const result: TNavItem = {label: item.label, href: item.href};
			if (item.children && item.children.length > 0) {
				result.children = item.children.map(navLink);
			}
			if (item.columns && item.columns.length > 0) {
				result.columns = item.columns.map(
					(column): TNavColumn => ({
						title: column.title,
						links: (column.links ?? []).map(navLink)
					})
				);
			}
			if (item.allLink?.label && item.allLink.href) {
				result.allLink = navLink({label: item.allLink.label, href: item.allLink.href});
			}
			return result;
		}),
		footerNav: (doc.footerNav ?? []).map((column): TFooterColumn => {
			const result: TFooterColumn = {title: column.title, links: (column.links ?? []).map(navLink)};
			if (column.legal) {
				result.legal = true;
			}
			return result;
		}),
		sectionLinks: (doc.sectionLinks ?? []).map(navLink)
	};
}

export function mapDirectionTemplate(doc: DirectionTemplate): TDirectionPageTemplate {
	return {
		cta: mapLink(doc.cta),
		scheduleButton: mapLink(doc.scheduleButton),
		navLinks: (doc.navLinks ?? []).map(mapLink),
		related: {
			heading: doc.related.heading,
			subheading: doc.related.subheading,
			slugs: slugsOf(doc.related.directions, 'direction-template.related.directions')
		}
	};
}

export function mapHome(doc: Home): THome {
	const hero: THome['hero'] = {
		heading: doc.hero.heading,
		headingLines: texts(doc.hero.headingLines),
		headingAccent: doc.hero.headingAccent ?? null,
		text: doc.hero.text,
		cta: mapLink(doc.hero.cta),
		socials: (doc.hero.socials ?? []).map(({kind, label, url}) => ({kind, label, url}))
	};
	const heroImage = mapImage(doc.hero.image, 'home.hero.image');
	if (heroImage) hero.image = heroImage;

	const cta: THome['cta'] = {
		anchorId: doc.cta.anchorId,
		heading: doc.cta.heading,
		button: mapLink(doc.cta.button)
	};
	const ctaImage = mapImage(doc.cta.image, 'home.cta.image');
	if (ctaImage) cta.image = ctaImage;

	return {
		path: pagePathsOfGlobals.home,
		hero,
		directions: {
			heading: doc.directions.heading,
			cards: (doc.directions.cards ?? []).map((card) => ({
				slug: slugOf(card.direction, 'home.directions.cards.direction'),
				title: card.title,
				bullets: texts(card.bullets)
			})),
			posterHeading: doc.directions.posterHeading,
			posterAccent: doc.directions.posterAccent,
			posterSlugs: slugsOf(doc.directions.posters, 'home.directions.posters')
		},
		learn: {
			heading: doc.learn.heading,
			text: doc.learn.text,
			list: (doc.learn.list ?? []).map((item) => stringToRichText(item.text)),
			cta: mapLink(doc.learn.cta),
			image: requireImage(doc.learn.image, 'home.learn.image')
		},
		advantagesHeading: doc.advantagesHeading,
		advantages: mapCards(doc.advantages),
		performances: {
			anchor: doc.performances.anchor,
			heading: doc.performances.heading,
			subheading: doc.performances.subheading,
			moreLabel: doc.performances.moreLabel,
			videos: mapVideos(doc.performances.videos)
		},
		studio: {heading: doc.studio.heading, photos: mapImages(doc.studio.photos, 'home.studio.photos')},
		gallery: {
			heading: doc.gallery.heading,
			subheading: doc.gallery.subheading,
			tabs: (doc.gallery.tabs ?? []).map((tab) => ({
				id: tab.key,
				label: tab.label,
				images: mapImages(tab.images, 'home.gallery.tabs.images'),
				videos: mapVideos(tab.videos)
			}))
		},
		cta,
		seo: mapSeo(doc.seo),
		lastModified: doc.lastModified ?? ''
	};
}

export function mapHomeFaqSection(doc: HomeFaq, items: TFaqSection['items']): TFaqSection {
	return {
		heading: doc.heading,
		subheading: doc.subheading,
		items,
		askButtons: (doc.askButtons ?? []).map(mapLink)
	};
}

export function mapTariffs(doc: Tariff): TTariffsPage {
	const list = doc.priceList;
	const priceList: TPriceList = {
		title: list.title,
		season: list.season,
		approvedBy: list.approvedBy,
		trialLesson: {label: list.trialLesson.label, priceRub: list.trialLesson.priceRub},
		groups: (list.groups ?? []).map(
			(group): TPriceGroup => ({
				id: group.groupId,
				title: group.title,
				currencyPrinted: Boolean(group.currencyPrinted),
				columns: (group.columns ?? []).map((column) => ({label: column.label, lessons: column.lessons})),
				rows: (group.rows ?? []).map((row) => {
					const result: TPriceGroup['rows'][number] = {
						id: row.key,
						label: row.label,
						directionSlugs: slugsOf(row.directions, 'tariffs.rows.directions'),
						prices: (row.prices ?? []).map((price) => price.value ?? null)
					};
					if (row.note) result.note = row.note;
					return result;
				})
			})
		),
		notes: texts(list.notes),
		image: requireImage(list.image, 'tariffs.priceList.image')
	};
	return {
		path: pagePathsOfGlobals.tariffs,
		h1: doc.h1,
		priceList,
		discounts: (doc.discounts ?? []).map((item) => ({id: item.key, percent: item.percent, text: item.text})),
		freePayment: {
			heading: doc.freePayment.heading,
			text: doc.freePayment.text,
			button: mapLink(doc.freePayment.button)
		},
		seo: mapSeo(doc.seo),
		oldPaths: doc.oldPaths ?? [],
		lastModified: doc.lastModified ?? ''
	};
}

export function mapDirectionsIndex(doc: DirectionsIndex): TDirectionsIndexPage {
	return {
		path: pagePathsOfGlobals.directionsIndex,
		h1: doc.h1,
		cta: mapLink(doc.cta),
		listedSlugs: slugsOf(doc.listed, 'directions-index.listed'),
		seo: mapSeo(doc.seo),
		oldPaths: doc.oldPaths ?? [],
		lastModified: doc.lastModified ?? ''
	};
}

export function mapTeamPage(doc: TeamPage): TTeamPage {
	return {
		path: pagePathsOfGlobals.team,
		h1: doc.h1,
		seo: mapSeo(doc.seo),
		oldPaths: doc.oldPaths ?? [],
		lastModified: doc.lastModified ?? ''
	};
}

export function mapReviewsPage(doc: ReviewsPage): TReviewsPage {
	return {
		path: pagePathsOfGlobals.reviews,
		h1: doc.h1,
		intro: mapBlocks(doc.intro),
		reviewLink: doc.reviewLink,
		widgetUrl: doc.widgetUrl,
		seo: mapSeo(doc.seo),
		oldPaths: doc.oldPaths ?? [],
		lastModified: doc.lastModified ?? ''
	};
}

export function mapNewsPage(doc: NewsPage): TNewsPage {
	return {
		path: pagePathsOfGlobals.news,
		h1: doc.h1,
		intro: mapBlocks(doc.intro),
		links: (doc.links ?? []).map(mapLink),
		seo: mapSeo(doc.seo),
		oldPaths: doc.oldPaths ?? [],
		lastModified: doc.lastModified ?? ''
	};
}

export function mapSchedulePage(doc: SchedulePage): TSchedulePage {
	return {
		path: pagePathsOfGlobals.schedule,
		h1: doc.h1,
		widgetMountIds: doc.widgetMountIds ?? [],
		seo: mapSeo(doc.seo),
		oldPaths: doc.oldPaths ?? [],
		lastModified: doc.lastModified ?? ''
	};
}

/** The trial-lesson price in the «Цены» cover headline comes from the price list, never from the cover itself. */
export function mapCover(doc: Cover, trialLessonPriceRub: number): {entries: TCoverEntry[]; story: TCoverStory} {
	return {
		entries: (doc.entries ?? []).map(
			(entry): TCoverEntry => ({
				id: entry.entryId,
				slot: entry.slot,
				number: entry.number,
				label: entry.label,
				headline:
					entry.entryId === 'tarify'
						? `Пробное занятие — ${formatPrice(trialLessonPriceRub)}`
						: (entry.headline ?? ''),
				teaser: entry.teaser,
				href: entry.href,
				page: entry.page
			})
		),
		story: {
			kicker: doc.story.kicker,
			titleLines: [doc.story.titleLine1, doc.story.titleLine2],
			teaser: doc.story.teaser,
			href: doc.story.href,
			page: doc.story.page
		}
	};
}
