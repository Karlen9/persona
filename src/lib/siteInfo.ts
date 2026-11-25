import 'server-only';

import {cache} from 'react';

import {getSite} from '@/lib/cms';

import type {TSiteInfo} from '@/lib/site';

/** Flat, serializable site values (URL, name, contacts, counters) derived from the CMS site settings. */
export const getSiteInfo = cache(async (): Promise<TSiteInfo> => {
	const site = await getSite();
	return {
		url: site.url,
		name: site.name,
		email: site.email,
		phones: site.phones.map((phone) => ({label: phone.display, href: `tel:${phone.tel}`})),
		socials: site.socials.map((social) => ({id: social.kind, label: social.label, href: social.url})),
		gisReviewsUrl: site.twoGis.reviewsUrl,
		metrikaId: Number(site.metrika.counterId)
	};
});
