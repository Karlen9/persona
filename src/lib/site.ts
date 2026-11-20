import {site} from '@/content/site';

// Single source of truth is `@/content` (site settings). This module keeps the short, flat names used by the UI.
// It imports `@/content/site` directly (not the whole content index) because client components read it too.

export const SITE_URL = site.url;
export const SITE_NAME = site.name;
export const SITE_DESCRIPTION =
	'PersOna — творческий центр для детей и взрослых в Москве: школа моделей, танцы, вокал, театр, рисование, языки и другие направления в 4 студиях.';

export const LEAD_ANCHOR = '#zapis';

export type TPhone = {
	label: string;
	href: string;
};

export const PHONES: TPhone[] = site.phones.map((phone) => ({label: phone.display, href: `tel:${phone.tel}`}));

export const EMAIL = site.email;

export type TSocial = {
	id: 'telegram' | 'vk' | 'max';
	label: string;
	href: string;
};

export const SOCIALS: TSocial[] = site.socials.map((social) => ({
	id: social.kind,
	label: social.label,
	href: social.url
}));

export const GIS_REVIEWS_URL = site.twoGis.reviewsUrl;
export const YANDEX_METRIKA_ID = Number(site.metrika.counterId);
