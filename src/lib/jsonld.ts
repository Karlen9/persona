import {site, studios} from '@/content';

import {absoluteUrl} from './seo';

import type {TDirection, TStudio} from '@/content';

type TJsonLd = Record<string, unknown>;

const ORGANIZATION_ID = `${site.url}/#organization`;

function postalAddress(studio: TStudio): TJsonLd {
	return {
		'@type': 'PostalAddress',
		streetAddress: studio.address.replace(/^г\.\s*Москва,\s*/, ''),
		addressLocality: 'Москва',
		addressCountry: 'RU'
	};
}

function studioNode(studio: TStudio): TJsonLd {
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
		parentOrganization: {'@id': ORGANIZATION_ID}
	};
}

/** Site-wide organisation node (rendered by the root layout). */
export function organizationJsonLd(): TJsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': ORGANIZATION_ID,
		name: site.name,
		legalName: site.legalName,
		url: site.url,
		logo: absoluteUrl(site.logo.src),
		email: site.email,
		telephone: site.phones.map((phone) => phone.tel),
		foundingDate: String(site.foundedYear),
		sameAs: site.socials.map((social) => social.url)
	};
}

/** Home page: the centre as a local business with all four studio addresses. */
export function centreJsonLd(): TJsonLd {
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
		parentOrganization: {'@id': ORGANIZATION_ID}
	};
}

/** Studio page: that studio as a local business. */
export function studioJsonLd(studio: TStudio): TJsonLd {
	return {'@context': 'https://schema.org', ...studioNode(studio)};
}

/** Direction page: a Course offered by the centre. */
export function courseJsonLd(direction: TDirection): TJsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'Course',
		name: direction.title,
		description: direction.seo.description,
		url: absoluteUrl(direction.path),
		inLanguage: 'ru',
		provider: {'@type': 'Organization', '@id': ORGANIZATION_ID, name: site.name, url: site.url},
		...(direction.hero.image ? {image: absoluteUrl(direction.hero.image.src)} : {})
	};
}
