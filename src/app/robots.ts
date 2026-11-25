import {getSiteInfo} from '@/lib/siteInfo';

import type {MetadataRoute} from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
	const {url} = await getSiteInfo();
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/styleguide/', '/search-index/', '/poisk/', '/upravlenie/', '/api/']
		},
		sitemap: `${url}/sitemap.xml`,
		host: url
	};
}
