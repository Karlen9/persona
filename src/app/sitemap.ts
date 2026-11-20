import {getSitemapRoutes} from '@/lib/routes';
import {SITE_URL} from '@/lib/site';

import type {MetadataRoute} from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	return getSitemapRoutes().map((route) => ({
		url: `${SITE_URL}${route.path}`,
		...(route.lastModified ? {lastModified: route.lastModified} : {})
	}));
}
