import {buildSearchDocs} from '@/lib/search/buildDocs';

export const dynamic = 'force-static';

/** Prerendered at build: the plain-text documents the client-side search engine indexes. */
export function GET(): Response {
	return Response.json(buildSearchDocs());
}
