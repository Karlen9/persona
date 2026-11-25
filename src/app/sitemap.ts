import {getSiteInfo} from '@/lib/siteInfo';
import {getSitemapRoutes} from '@/lib/routes';

import type {MetadataRoute} from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [{url}, routes] = await Promise.all([getSiteInfo(), getSitemapRoutes()]);
	return routes.map((route) => ({
		url: `${url}${route.path}`,
		...(route.lastModified ? {lastModified: route.lastModified} : {})
	}));
}
