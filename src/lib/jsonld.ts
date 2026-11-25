import 'server-only';

import {getSite, getStudios} from '@/lib/cms';

import type {TDirection, TSite, TStudio} from '@/content/types';

type TJsonLd = Record<string, unknown>;

const organizationId = (site: TSite): string => `${site.url}/#organization`;

function postalAddress(studio: TStudio): TJsonLd {
	return {
		'@type': 'PostalAddress',
		streetAddress: studio.address.replace(/^г\.\s*Москва,\s*/, ''),
		addressLocality: 'Москва',
		addressCountry: 'RU'
	};
}

function studioNode(site: TSite, studio: TStudio): TJsonLd {
	const absoluteUrl = (path: string): string => `${site.url}${path}`;
	return {
		'@type': ['LocalBusiness', 'EducationalOrganization'],
		'@id': `${absoluteUrl(studio.path)}#localbusiness`,
		name: `${site.legalName}, ${studio.shortName}`,
		url: absoluteUrl(studio.path),
		image: studio.photos.map((photo) => absoluteUrl(photo.src)),
		telephone: studio.phones,
		email: studio.email,
		address: postalAddress(studio),
		geo: {'@type': 'GeoCoordinates', latitude: studio.geo.lat, longitude: studio.geo.lon},
		// `hours` is free text on the live site («пн-сб по расписанию»), so it is not forced into openingHoursSpecification.
		openingHours: studio.hours,
		hasMap: studio.mapLink,
		parentOrganization: {'@id': organizationId(site)}
	};
}

/** Site-wide organisation node (rendered by the root layout). */
export async function organizationJsonLd(): Promise<TJsonLd> {
	const site = await getSite();
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': organizationId(site),
		name: site.name,
		legalName: site.legalName,
		url: site.url,
		logo: `${site.url}${site.logo.src}`,
		email: site.email,
		telephone: site.phones.map((phone) => phone.tel),
		foundingDate: String(site.foundedYear),
		sameAs: site.socials.map((social) => social.url)
	};
}

/** Site-wide WebSite node with a SearchAction pointing at `/poisk/` (rendered by the root layout). */
export async function websiteJsonLd(): Promise<TJsonLd> {
	const site = await getSite();
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${site.url}/#website`,
		name: site.name,
		url: site.url,
		inLanguage: 'ru',
		publisher: {'@id': organizationId(site)},
		potentialAction: {
			'@type': 'SearchAction',
			target: {'@type': 'EntryPoint', urlTemplate: `${site.url}/poisk/?q={search_term_string}`},
			'query-input': 'required name=search_term_string'
		}
	};
}

/** Home page: the centre as a local business with all four studio addresses. */
export async function centreJsonLd(): Promise<TJsonLd> {
	const [site, studios] = await Promise.all([getSite(), getStudios()]);
	const absoluteUrl = (path: string): string => `${site.url}${path}`;
	return {
		'@context': 'https://schema.org',
		'@type': ['LocalBusiness', 'EducationalOrganization'],
		'@id': `${site.url}/#localbusiness`,
		name: site.legalName,
		url: site.url,
		image: absoluteUrl(site.defaultOgImage.src),
		email: site.email,
		telephone: site.phones.map((phone) => phone.tel),
		sameAs: site.socials.map((social) => social.url),
		areaServed: 'Москва',
		address: studios.map(postalAddress),
		location: studios.map((studio) => ({
			'@type': 'Place',
			name: studio.shortName,
			address: postalAddress(studio),
			geo: {'@type': 'GeoCoordinates', latitude: studio.geo.lat, longitude: studio.geo.lon},
			url: absoluteUrl(studio.path)
		})),
		parentOrganization: {'@id': organizationId(site)}
	};
}

/** Studio page: that studio as a local business. */
export async function studioJsonLd(studio: TStudio): Promise<TJsonLd> {
	return {'@context': 'https://schema.org', ...studioNode(await getSite(), studio)};
}

/** Direction page: a Course offered by the centre. */
export async function courseJsonLd(direction: TDirection): Promise<TJsonLd> {
	const site = await getSite();
	const absoluteUrl = (path: string): string => `${site.url}${path}`;
	return {
		'@context': 'https://schema.org',
		'@type': 'Course',
		name: direction.title,
		description: direction.seo.description,
		url: absoluteUrl(direction.path),
		inLanguage: 'ru',
		provider: {'@type': 'Organization', '@id': organizationId(site), name: site.name, url: site.url},
		...(direction.hero.image ? {image: absoluteUrl(direction.hero.image.src)} : {})
	};
}
