import 'server-only';

import {getAllRoutes} from '@/lib/cms';

export type TSitemapRoute = {path: string; lastModified?: string};

/** Every public route: all content routes plus the studio index (it has no content item of its own). */
export async function getSitemapRoutes(): Promise<TSitemapRoute[]> {
	const routes: TSitemapRoute[] = [...(await getAllRoutes())];
	if (!routes.some((route) => route.path === '/studii/')) {
		routes.push({path: '/studii/'});
	}
	return routes;
}
