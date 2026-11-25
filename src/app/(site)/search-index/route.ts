import {buildSearchDocs} from '@/lib/search/buildDocs';

export const dynamic = 'force-static';

/** Prerendered at build (and again on every CMS change): the plain-text documents the client-side search engine indexes. */
export async function GET(): Promise<Response> {
	return Response.json(await buildSearchDocs());
}
