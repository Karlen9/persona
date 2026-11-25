// Static constants only (safe to import from client components). Content-derived values (phones, email, socials,
// site URL, ...) come from the CMS: server components call `getSiteInfo()` (`@/lib/siteInfo`) and pass them down as props.

export const SITE_DESCRIPTION =
	'PersOna — творческий центр для детей и взрослых в Москве: школа моделей, танцы, вокал, театр, рисование, языки и другие направления в 4 студиях.';

export const LEAD_ANCHOR = '#zapis';

export type TPhone = {
	label: string;
	href: string;
};

export type TSocial = {
	id: 'telegram' | 'vk' | 'max';
	label: string;
	href: string;
};

/** Serializable contact block shown in the footer, mobile menu, fallbacks and floating buttons. */
export type TContactInfo = {
	phones: TPhone[];
	email: string;
	socials: TSocial[];
};

/** Site-wide values that come from the CMS site settings. */
export type TSiteInfo = TContactInfo & {
	url: string;
	name: string;
	gisReviewsUrl: string;
	metrikaId: number;
};
