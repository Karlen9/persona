import {richTextToString} from '@/cms/richtext';

import type {TCoverEntry, TCoverStory} from '@/content/cover';
import type {TFooterColumn, TNavItem, TNavLink} from '@/content/navigation';
import type {
	TBlock,
	TCard,
	TDirection,
	TDirectionPageTemplate,
	TDirectionsIndexPage,
	TFaqItem,
	TFaqSection,
	THome,
	TImage,
	TLink,
	TNewsPage,
	TPage,
	TPageSection,
	TReviewsPage,
	TSchedulePage,
	TSeo,
	TSite,
	TStudio,
	TTariffsPage,
	TTeacher,
	TTeamPage,
	TVideo
} from '@/content/types';
import type {
	Cover,
	Direction,
	DirectionsIndex,
	DirectionTemplate,
	FaqItem,
	Home,
	HomeFaq,
	Navigation,
	NewsPage,
	Page,
	ReviewsPage,
	SchedulePage,
	SiteSetting,
	Studio,
	Tariff,
	Teacher,
	TeamPage
} from '@/payload-types';
import type {TPayloadBlock} from '@/lib/cms/mappers/common';

/** Resolves a seed image to the id of its media document. */
export type TImg = (image: TImage) => number;

export type TData<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

const PUBLISHED = {_status: 'published'} as const;

const optImg = (img: TImg, image: TImage | null | undefined): number | undefined => (image ? img(image) : undefined);

export const toLink = (link: TLink): {label: string; href: string; external?: boolean} => ({
	label: link.label,
	href: link.href,
	...(link.external ? {external: true} : {})
});

const toNavLink = (link: TNavLink): {label: string; href: string} => ({label: link.label, href: link.href});

const rows = (values: string[]): {text: string}[] => values.map((text) => ({text}));

export function toSeo(seo: TSeo, img: TImg): {title: string; description: string; ogImage?: number} {
	return {title: seo.title, description: seo.description, ogImage: optImg(img, seo.ogImage)};
}

export function toCards(cards: TCard[], img: TImg): {title: string; text: string; image?: number}[] {
	return cards.map((card) => ({title: card.title, text: card.text, image: optImg(img, card.image)}));
}

type TVideoRow = {
	src: string;
	mimeType?: string;
	sizeBytes?: number;
	poster: number | null;
	caption?: string;
};

export function toVideos(videos: TVideo[], img: TImg): TVideoRow[] {
	return videos.map((video) => ({
		src: video.src,
		mimeType: video.mimeType,
		sizeBytes: video.sizeBytes,
		poster: video.poster ? img(video.poster) : null,
		caption: video.caption
	}));
}

export function toBlocks(blocks: TBlock[], img: TImg): TPayloadBlock[] {
	return blocks.map((block): TPayloadBlock => {
		switch (block.type) {
			case 'paragraph':
				return {blockType: 'paragraph', variant: block.variant, text: richTextToString(block)};
			case 'heading':
				return {
					blockType: 'heading',
					level: String(block.level) as '2' | '3' | '4',
					icon: block.icon,
					text: richTextToString(block)
				};
			case 'list':
				return {
					blockType: 'list',
					ordered: block.ordered,
					items: block.items.map((item) => ({text: richTextToString(item)}))
				};
			case 'stat':
				return {blockType: 'stat', value: block.value, label: block.label};
			case 'cards':
				return {blockType: 'cards', items: toCards(block.items, img)};
		}
	});
}

export function toDirection(direction: TDirection, img: TImg, teacherIds: number[]): TData<Direction> {
	return {
		...PUBLISHED,
		slug: direction.slug,
		wpId: direction.wpId,
		title: direction.title,
		shortTitle: direction.shortTitle,
		audience: direction.audience,
		category: direction.category,
		excerpt: direction.excerpt,
		tagline: direction.tagline,
		highlightBullets: direction.highlightBullets ? rows(direction.highlightBullets) : [],
		cardImage: direction.cardImage ? img(direction.cardImage) : null,
		hero: {
			heading: direction.hero.heading,
			subheading: direction.hero.subheading,
			image: direction.hero.image ? img(direction.hero.image) : null
		},
		sections: direction.sections.map((section): NonNullable<Direction['sections']>[number] => {
			switch (section.type) {
				case 'intro':
					return {blockType: 'intro', blocks: toBlocks(section.blocks, img)};
				case 'programme':
					return {blockType: 'programme', heading: section.heading, items: toCards(section.items, img)};
				case 'article':
					return {blockType: 'article', blocks: toBlocks(section.blocks, img)};
				case 'howClassesGo':
					return {
						blockType: 'howClassesGo',
						heading: section.heading,
						videos: toVideos(section.videos, img)
					};
			}
		}),
		teachers: teacherIds,
		seo: toSeo(direction.seo, img),
		oldPaths: direction.oldPaths,
		order: direction.order,
		lastModified: direction.lastModified
	};
}

export function toStudio(studio: TStudio, img: TImg): TData<Studio> {
	return {
		...PUBLISHED,
		slug: studio.slug,
		wpId: studio.wpId,
		name: studio.name,
		shortName: studio.shortName,
		address: studio.address,
		metro: studio.metro,
		hours: studio.hours,
		phones: studio.phones,
		email: studio.email,
		photos: studio.photos.map(img),
		mapLink: studio.mapLink,
		mapEmbedUrl: studio.mapEmbedUrl,
		geo: {lat: studio.geo.lat, lon: studio.geo.lon},
		seo: toSeo(studio.seo, img),
		order: studio.order,
		oldPaths: studio.oldPaths,
		lastModified: studio.lastModified
	};
}

export function toTeacher(teacher: TTeacher, img: TImg, directionIds: number[]): TData<Teacher> {
	return {
		...PUBLISHED,
		slug: teacher.id,
		wpPopupId: teacher.wpPopupId,
		name: teacher.name,
		role: teacher.role,
		photo: img(teacher.photo),
		cardPhoto: img(teacher.cardPhoto),
		bio: toBlocks(teacher.bio, img),
		directions: directionIds,
		isManagement: teacher.isManagement,
		order: teacher.order
	};
}

export function toFaqItem(item: TFaqItem, img: TImg): TData<FaqItem> {
	return {
		...PUBLISHED,
		key: item.id,
		question: item.question,
		answer: toBlocks(item.answer, img),
		answerText: item.answerText,
		order: item.order
	};
}

function toPageSection(section: TPageSection, img: TImg): NonNullable<Page['sections']>[number] {
	switch (section.type) {
		case 'hero':
			return {
				blockType: 'hero',
				heading: section.heading,
				subheading: section.subheading,
				cta: section.cta ? toLink(section.cta) : undefined,
				image: optImg(img, section.image)
			};
		case 'cards':
			return {blockType: 'cardSection', heading: section.heading, items: toCards(section.items, img)};
		case 'article':
			return {blockType: 'article', blocks: toBlocks(section.blocks, img)};
		case 'video':
			return {blockType: 'video', heading: section.heading, videos: toVideos(section.videos, img)};
		case 'downloads':
			return {
				blockType: 'downloads',
				heading: section.heading,
				items: section.items.map((item) => ({label: item.label, href: item.href, sizeBytes: item.sizeBytes}))
			};
	}
}

export function toPage(page: TPage, img: TImg): TData<Page> {
	return {
		...PUBLISHED,
		key: page.id,
		h1: page.h1,
		sections: page.sections.map((section) => toPageSection(section, img)),
		seo: toSeo(page.seo, img),
		oldPaths: page.oldPaths,
		lastModified: page.lastModified
	};
}

// ---------------------------------------------------------------------------------------------------------------------
// Globals
// ---------------------------------------------------------------------------------------------------------------------

export function toSite(site: TSite, img: TImg): TData<SiteSetting> {
	return {
		...PUBLISHED,
		name: site.name,
		cmsSiteName: site.cmsSiteName,
		legalName: site.legalName,
		url: site.url,
		lang: site.lang,
		foundedYear: site.foundedYear,
		tagline: site.tagline,
		logo: img(site.logo),
		favicon: {png: img(site.favicon.png), svg: site.favicon.svg},
		defaultOgImage: img(site.defaultOgImage),
		seo: site.seo,
		email: site.email,
		phones: site.phones,
		socials: site.socials,
		messengerButtons: site.messengerButtons,
		moyklass: {
			lead: site.moyklass.lead,
			schedule: site.moyklass.schedule,
			api: {
				filialStudio: Object.entries(site.moyklass.api.filialStudio).map(([filialId, studioSlug]) => ({
					filialId,
					studioSlug
				})),
				classIds: site.moyklass.api.classIds,
				courseIds: site.moyklass.api.courseIds
			}
		},
		metrika: site.metrika,
		yandex: site.yandex,
		twoGis: {reviewsUrl: site.twoGis.reviewsUrl, badge: img(site.twoGis.badge)},
		payment: site.payment,
		documents: site.documents.map((document) => ({
			key: document.id,
			title: document.title,
			href: document.href,
			sizeBytes: document.sizeBytes,
			oldPath: document.oldPath
		})),
		cookieBanner: site.cookieBanner
	};
}

export function toNavigation(nav: {
	mainNav: TNavItem[];
	footerNav: TFooterColumn[];
	sectionLinks: TNavLink[];
}): TData<Navigation> {
	return {
		...PUBLISHED,
		mainNav: nav.mainNav.map((item) => ({
			label: item.label,
			href: item.href,
			children: item.children?.map(toNavLink),
			columns: item.columns?.map((column) => ({title: column.title, links: column.links.map(toNavLink)})),
			allLink: item.allLink ? toNavLink(item.allLink) : undefined
		})),
		footerNav: nav.footerNav.map((column) => ({
			title: column.title,
			legal: Boolean(column.legal),
			links: column.links.map(toNavLink)
		})),
		sectionLinks: nav.sectionLinks.map(toNavLink)
	};
}

export function toDirectionTemplate(
	template: TDirectionPageTemplate,
	directionId: (slug: string) => number
): TData<DirectionTemplate> {
	return {
		...PUBLISHED,
		cta: toLink(template.cta),
		scheduleButton: toLink(template.scheduleButton),
		navLinks: template.navLinks.map(toLink),
		related: {
			heading: template.related.heading,
			subheading: template.related.subheading,
			directions: template.related.slugs.map(directionId)
		}
	};
}

export function toHome(home: THome, img: TImg, directionId: (slug: string) => number): TData<Home> {
	return {
		...PUBLISHED,
		hero: {
			heading: home.hero.heading,
			headingLines: rows(home.hero.headingLines),
			headingAccent: home.hero.headingAccent,
			text: home.hero.text,
			cta: toLink(home.hero.cta),
			socials: home.hero.socials,
			image: optImg(img, home.hero.image)
		},
		directions: {
			heading: home.directions.heading,
			cards: home.directions.cards.map((card) => ({
				direction: directionId(card.slug),
				title: card.title,
				bullets: rows(card.bullets)
			})),
			posterHeading: home.directions.posterHeading,
			posterAccent: home.directions.posterAccent,
			posters: home.directions.posterSlugs.map(directionId)
		},
		learn: {
			heading: home.learn.heading,
			text: home.learn.text,
			list: home.learn.list.map((item) => ({text: richTextToString(item)})),
			cta: toLink(home.learn.cta),
			image: img(home.learn.image)
		},
		advantagesHeading: home.advantagesHeading,
		advantages: toCards(home.advantages, img),
		performances: {
			anchor: home.performances.anchor,
			heading: home.performances.heading,
			subheading: home.performances.subheading,
			moreLabel: home.performances.moreLabel,
			videos: toVideos(home.performances.videos, img)
		},
		studio: {heading: home.studio.heading, photos: home.studio.photos.map(img)},
		gallery: {
			heading: home.gallery.heading,
			subheading: home.gallery.subheading,
			tabs: home.gallery.tabs.map((tab) => ({
				key: tab.id,
				label: tab.label,
				images: tab.images.map(img),
				videos: toVideos(tab.videos, img)
			}))
		},
		cta: {
			anchorId: home.cta.anchorId,
			heading: home.cta.heading,
			button: toLink(home.cta.button),
			image: optImg(img, home.cta.image)
		},
		seo: toSeo(home.seo, img),
		lastModified: home.lastModified
	};
}

export function toHomeFaq(section: TFaqSection): TData<HomeFaq> {
	return {
		...PUBLISHED,
		heading: section.heading,
		subheading: section.subheading,
		askButtons: section.askButtons.map(toLink)
	};
}

export function toTariffs(page: TTariffsPage, img: TImg, directionId: (slug: string) => number): TData<Tariff> {
	return {
		...PUBLISHED,
		h1: page.h1,
		priceList: {
			title: page.priceList.title,
			season: page.priceList.season,
			approvedBy: page.priceList.approvedBy,
			trialLesson: page.priceList.trialLesson,
			groups: page.priceList.groups.map((group) => ({
				groupId: group.id,
				title: group.title,
				currencyPrinted: group.currencyPrinted,
				columns: group.columns,
				rows: group.rows.map((row) => ({
					key: row.id,
					label: row.label,
					directions: row.directionSlugs.map(directionId),
					prices: row.prices.map((value) => ({value})),
					note: row.note
				}))
			})),
			notes: rows(page.priceList.notes),
			image: img(page.priceList.image)
		},
		discounts: page.discounts.map((item) => ({key: item.id, percent: item.percent, text: item.text})),
		freePayment: {
			heading: page.freePayment.heading,
			text: page.freePayment.text,
			button: toLink(page.freePayment.button)
		},
		seo: toSeo(page.seo, img),
		oldPaths: page.oldPaths,
		lastModified: page.lastModified
	};
}

export function toDirectionsIndex(
	page: TDirectionsIndexPage,
	img: TImg,
	directionId: (slug: string) => number
): TData<DirectionsIndex> {
	return {
		...PUBLISHED,
		h1: page.h1,
		cta: toLink(page.cta),
		listed: page.listedSlugs.map(directionId),
		seo: toSeo(page.seo, img),
		oldPaths: page.oldPaths,
		lastModified: page.lastModified
	};
}

export function toTeamPage(page: TTeamPage, img: TImg): TData<TeamPage> {
	return {
		...PUBLISHED,
		h1: page.h1,
		seo: toSeo(page.seo, img),
		oldPaths: page.oldPaths,
		lastModified: page.lastModified
	};
}

export function toReviewsPage(page: TReviewsPage, img: TImg): TData<ReviewsPage> {
	return {
		...PUBLISHED,
		h1: page.h1,
		intro: toBlocks(page.intro, img),
		reviewLink: page.reviewLink,
		widgetUrl: page.widgetUrl,
		seo: toSeo(page.seo, img),
		oldPaths: page.oldPaths,
		lastModified: page.lastModified
	};
}

export function toNewsPage(page: TNewsPage, img: TImg): TData<NewsPage> {
	return {
		...PUBLISHED,
		h1: page.h1,
		intro: toBlocks(page.intro, img),
		links: page.links.map(toLink),
		seo: toSeo(page.seo, img),
		oldPaths: page.oldPaths,
		lastModified: page.lastModified
	};
}

export function toSchedulePage(page: TSchedulePage, img: TImg): TData<SchedulePage> {
	return {
		...PUBLISHED,
		h1: page.h1,
		widgetMountIds: page.widgetMountIds,
		seo: toSeo(page.seo, img),
		oldPaths: page.oldPaths,
		lastModified: page.lastModified
	};
}

export function toCover(entries: TCoverEntry[], story: TCoverStory): TData<Cover> {
	return {
		...PUBLISHED,
		entries: entries.map((entry) => ({
			entryId: entry.id,
			slot: entry.slot,
			number: entry.number,
			label: entry.label,
			// The «Цены» headline is computed from the price list in the read layer; it is never stored.
			headline: entry.id === 'tarify' ? null : entry.headline,
			teaser: entry.teaser,
			href: entry.href,
			page: entry.page
		})),
		story: {
			kicker: story.kicker,
			titleLine1: story.titleLines[0],
			titleLine2: story.titleLines[1],
			teaser: story.teaser,
			href: story.href,
			page: story.page
		}
	};
}
