/**
 * Content model for the PersOna site.
 *
 * Every collection is an array of plain, serialisable objects (no JSX, no functions) so that a CMS can replace
 * the static modules later without changing the shapes. Copy is carried over verbatim (Russian) from personamodel.ru.
 */

// ---------------------------------------------------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------------------------------------------------

export type TImage = {
	/** Path below `public/`, e.g. `/media/directions/pilates-card.webp`. */
	src: string;
	width: number;
	height: number;
	alt: string;
	/** `true` when `alt` was written for the migration (the live site had none or a file-name-like one). */
	altGenerated?: boolean;
};

export type TVideo = {
	/** Absolute URL: videos intentionally stay on the old host until they are transcoded and moved to a CDN. */
	src: string;
	mimeType?: string;
	sizeBytes?: number;
	/** Locally stored poster frame, `null` when the site provides none. */
	poster: TImage | null;
	/** Title the live site prints over the poster (e.g. «Брейк»); also the accessible name of the tile. */
	caption?: string;
};

export type TDocument = {
	id: string;
	title: string;
	/** Path below `public/`, e.g. `/docs/abonentskij-dogovor.pdf`. */
	href: string;
	sizeBytes: number;
	/** Path the file had on the old WordPress site (redirected in `redirects.ts`). */
	oldPath: string;
};

// ---------------------------------------------------------------------------------------------------------------------
// Rich text
// ---------------------------------------------------------------------------------------------------------------------

export type TInline = {text: string; bold?: boolean; italic?: boolean; href?: string};

/** `text` is always the full plain text; `inline` is present only when there is bold/italic/link formatting. */
export type TRichText = {text: string; inline?: TInline[]};

export type TCard = {title: string; text: string; image?: TImage};

export type TBlock =
	| ({type: 'paragraph'; variant?: 'eyebrow'} & TRichText)
	| ({type: 'heading'; level: 2 | 3 | 4; icon?: string} & TRichText)
	| {type: 'list'; ordered: boolean; items: TRichText[]}
	| {type: 'stat'; value: string; label: string}
	| {type: 'cards'; items: TCard[]};

export type TLink = {label: string; href: string; external?: boolean};

// ---------------------------------------------------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------------------------------------------------

export type TSeo = {
	title: string;
	description: string;
	/** Only set when the page has its own share image; otherwise `site.defaultOgImage` applies. */
	ogImage?: TImage;
};

// ---------------------------------------------------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------------------------------------------------

export type TPhone = {display: string; tel: string};

export type TSocialKind = 'telegram' | 'vk' | 'max';

export type TSocial = {kind: TSocialKind; label: string; url: string};

export type TSite = {
	/** Brand as written in the copy and in `og:site_name`. */
	name: string;
	/** WordPress site title / Rank Math default suffix source. */
	cmsSiteName: string;
	legalName: string;
	url: string;
	lang: string;
	foundedYear: number;
	tagline: {title: string; text: string};
	email: string;
	phones: TPhone[];
	logo: TImage;
	favicon: {png: TImage; svg: string};
	defaultOgImage: TImage;
	/** Footer / hero icons. */
	socials: TSocial[];
	/** The fixed floating buttons and the FAQ "ask" buttons use different URLs than the footer icons. */
	messengerButtons: TSocial[];
	moyklass: {
		lead: {widgetId: string; mountId: string};
		schedule: {widgetId: string; mountIds: string[]};
	};
	metrika: {counterId: string; goals: string[]};
	yandex: {
		orgId: string;
		orgUrl: string;
		ratingBadgeUrl: string;
		reviewsWidgetUrl: string;
		reviewLink: string;
	};
	twoGis: {reviewsUrl: string; badge: TImage};
	payment: {sbpUrl: string};
	documents: TDocument[];
	cookieBanner: {title: string; description: string; accept: string; reject: string};
	seo: {titleSuffix: string};
};

// ---------------------------------------------------------------------------------------------------------------------
// Directions
// ---------------------------------------------------------------------------------------------------------------------

/** Menu grouping: «Для детей» / «Для взрослых»; family school and after-school care are shown separately. */
export type TAudience = 'kids' | 'adults' | 'family';

/** Proposed field for catalogue filtering (not present on the live site). */
export type TDirectionCategory =
	| 'creativity'
	| 'dance'
	| 'development'
	| 'languages'
	| 'fitness'
	| 'school'
	| 'individual';

/** `image`: photo shown at the top of the card (the old site used it as the flip-box background). */
export type TProgrammeItem = {title: string; text: string; image?: TImage};

export type TDirectionSection =
	| {type: 'intro'; blocks: TBlock[]}
	| {type: 'programme'; heading?: string; items: TProgrammeItem[]}
	| {type: 'article'; blocks: TBlock[]}
	| {type: 'howClassesGo'; heading: string; videos: TVideo[]};

export type TDirection = {
	/** Same as `slug`. */
	id: string;
	/** WordPress post id (migration key). */
	wpId: number;
	slug: string;
	/** `/napravleniya/<slug>/` */
	path: string;
	/** WordPress post title. */
	title: string;
	/** Menu / card label. */
	shortTitle: string;
	audience: TAudience;
	category: TDirectionCategory;
	/** Short text for cards: the tagline, or the meta description when the page has no tagline. */
	excerpt: string;
	tagline: string | null;
	/** Bullet list shown on the home / page-tail card, only for the seven directions that have one. */
	highlightBullets: string[] | null;
	/** Portrait poster (720x1280 on the live site) used by the catalogue and home carousel. */
	cardImage: TImage | null;
	hero: {heading: string; subheading: string | null; image: TImage | null};
	sections: TDirectionSection[];
	/** Teachers whose bio names this discipline. */
	teacherIds: string[];
	seo: TSeo;
	oldPaths: string[];
	order: number;
	/** ISO date from the WordPress `modified_gmt`. */
	lastModified: string;
};

/** Page chrome that is identical on every direction page of the live site. */
export type TDirectionPageTemplate = {
	cta: TLink;
	scheduleButton: TLink;
	navLinks: TLink[];
	related: {heading: string; subheading: string; slugs: string[]};
};

export type TDirectionsIndexPage = {
	path: string;
	h1: string;
	cta: TLink;
	/** Directions listed as cards on the old `/brunches/` page (the family/adult ones added later are not). */
	listedSlugs: string[];
	seo: TSeo;
	oldPaths: string[];
	lastModified: string;
};

// ---------------------------------------------------------------------------------------------------------------------
// Studios
// ---------------------------------------------------------------------------------------------------------------------

export type TStudio = {
	id: string;
	slug: string;
	wpId: number;
	/** `/studii/<slug>/` */
	path: string;
	/** Page heading, e.g. `СТУДИЯ М. СОЛНЦЕВО`. */
	name: string;
	/** Short address label used in header, footer and cards. */
	shortName: string;
	address: string;
	metro: string[];
	hours: string;
	/** E.164, as printed on the studio page. */
	phones: string[];
	email: string;
	/** Link target of the address on the studio page. */
	mapLink: string;
	/** Exact `src` of the Yandex map iframe used in the site footer. */
	mapEmbedUrl: string;
	/** Derived from the `ll=` parameter of the map embed (map centre, not a surveyed point for the host-venue studio). */
	geo: {lat: number; lon: number};
	photos: TImage[];
	seo: TSeo;
	order: number;
	oldPaths: string[];
	lastModified: string;
};

// ---------------------------------------------------------------------------------------------------------------------
// Teachers
// ---------------------------------------------------------------------------------------------------------------------

export type TTeacher = {
	/** Transliterated name, stable. */
	id: string;
	/** WordPress popup id (migration key). */
	wpPopupId: number;
	name: string;
	/** Only when the bio states it. */
	role: string | null;
	/** Portrait from the popup. */
	photo: TImage;
	/** Photo shown in the team grid (differs from `photo`). */
	cardPhoto: TImage;
	bio: TBlock[];
	/** Directions whose name appears in the bio as the taught discipline. */
	directionSlugs: string[];
	isManagement: boolean;
	order: number;
};

export type TTeamPage = {path: string; h1: string; seo: TSeo; oldPaths: string[]; lastModified: string};

// ---------------------------------------------------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------------------------------------------------

export type TPriceColumn = {label: string; lessons: number};

export type TPriceRow = {
	id: string;
	/** Label exactly as printed on the price list (typos included). */
	label: string;
	/** Directions this row prices (empty when the row has no direction page, e.g. boxing). */
	directionSlugs: string[];
	/** RUB, aligned with `columns`; `null` where the list prints a dash. */
	prices: (number | null)[];
	note?: string;
};

export type TPriceGroup = {
	id: 'group' | 'individual';
	title: string;
	/** `true` when the printed list shows the ruble sign (group table) and `false` when it does not. */
	currencyPrinted: boolean;
	columns: TPriceColumn[];
	rows: TPriceRow[];
};

export type TPriceList = {
	title: string;
	season: string;
	approvedBy: string;
	trialLesson: {label: string; priceRub: number};
	groups: TPriceGroup[];
	notes: string[];
	/** The original price list as an image. */
	image: TImage;
};

export type TDiscount = {id: string; percent: number; text: string};

export type TTariffsPage = {
	path: string;
	h1: string;
	priceList: TPriceList;
	discounts: TDiscount[];
	freePayment: {heading: string; text: string; button: TLink};
	seo: TSeo;
	oldPaths: string[];
	lastModified: string;
};

// ---------------------------------------------------------------------------------------------------------------------
// FAQ / reviews / news
// ---------------------------------------------------------------------------------------------------------------------

export type TFaqItem = {
	id: string;
	question: string;
	answer: TBlock[];
	/** Plain-text answer (for FAQPage JSON-LD). */
	answerText: string;
	order: number;
};

export type TFaqSection = {heading: string; subheading: string; items: TFaqItem[]; askButtons: TLink[]};

export type TReview = {
	id: string;
	source: 'yandex' | '2gis' | 'manual';
	author: string;
	rating?: number;
	text: string;
	date?: string;
	url?: string;
};

export type TReviewsPage = {
	path: string;
	h1: string;
	intro: TBlock[];
	reviewLink: string;
	widgetUrl: string;
	seo: TSeo;
	oldPaths: string[];
	lastModified: string;
};

export type TNewsPost = {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	body: TBlock[];
	cover?: TImage;
	publishedAt: string;
};

export type TNewsPage = {
	path: string;
	h1: string;
	intro: TBlock[];
	links: TLink[];
	seo: TSeo;
	oldPaths: string[];
	lastModified: string;
};

// ---------------------------------------------------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------------------------------------------------

export type TGalleryTab = {
	id: string;
	label: string;
	images: TImage[];
	videos: TVideo[];
};

export type THome = {
	path: string;
	hero: {
		heading: string;
		headingLines: string[];
		headingAccent: string | null;
		text: string;
		cta: TLink;
		socials: TSocial[];
		image?: TImage;
	};
	directions: {
		heading: string;
		cards: {slug: string; title: string; bullets: string[]}[];
		posterHeading: string;
		posterAccent: string;
		/** Order of the poster carousel («Наши направления» + «PersOna»). */
		posterSlugs: string[];
	};
	learn: {heading: string; text: string; list: TRichText[]; cta: TLink; image: TImage};
	advantagesHeading: string;
	advantages: TProgrammeItem[];
	performances: {anchor: string; heading: string; subheading: string; moreLabel: string; videos: TVideo[]};
	studio: {heading: string; photos: TImage[]};
	gallery: {heading: string; subheading: string; tabs: TGalleryTab[]};
	cta: {anchorId: string; heading: string; button: TLink; image?: TImage};
	seo: TSeo;
	lastModified: string;
};

// ---------------------------------------------------------------------------------------------------------------------
// Simple pages
// ---------------------------------------------------------------------------------------------------------------------

export type TDownload = {label: string; href: string; sizeBytes: number};

export type TPageSection =
	| {type: 'hero'; heading: string; subheading?: string; cta?: TLink; image?: TImage}
	| {type: 'cards'; heading?: string; items: TProgrammeItem[]}
	| {type: 'article'; blocks: TBlock[]}
	| {type: 'video'; heading?: string; videos: TVideo[]}
	| {type: 'downloads'; heading: string; items: TDownload[]};

export type TPage = {
	id: 'about' | 'events' | 'festivals' | 'privacy';
	path: string;
	h1: string;
	sections: TPageSection[];
	seo: TSeo;
	oldPaths: string[];
	lastModified: string;
};

export type TSchedulePage = {
	path: string;
	h1: string;
	/** Mount points of the Moyklass schedule widgets (ids in `site.moyklass.schedule`). */
	widgetMountIds: string[];
	seo: TSeo;
	oldPaths: string[];
	lastModified: string;
};

// ---------------------------------------------------------------------------------------------------------------------
// Routing helpers
// ---------------------------------------------------------------------------------------------------------------------

export type TRedirect = {source: string; destination: string; permanent: true};

export type TRoute = {path: string; lastModified: string};
