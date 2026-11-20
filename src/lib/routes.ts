import {getAllRoutes} from '@/content';

export type TSitemapRoute = {path: string; lastModified?: string};

/** Every public route: all content routes plus the studio index (it has no content item of its own). */
export function getSitemapRoutes(): TSitemapRoute[] {
	const routes: TSitemapRoute[] = getAllRoutes();
	if (!routes.some((route) => route.path === '/studii/')) {
		routes.push({path: '/studii/'});
	}
	return routes;
}
