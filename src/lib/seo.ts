import 'server-only';

import {getSite} from '@/lib/cms';

import type {Metadata} from 'next';
import type {TSeo} from '@/content/types';

type TMetadataInput = {
	seo: TSeo;
	/** Canonical path, e.g. `/napravleniya/vokal/`. */
	path: string;
	noindex?: boolean;
};

/** Metadata for a content item: title/description from `seo`, canonical = its path, OG image falls back to the site default. */
export async function buildMetadata({seo, path, noindex}: TMetadataInput): Promise<Metadata> {
	const site = await getSite();
	const image = seo.ogImage ?? site.defaultOgImage;
	return {
		title: {absolute: seo.title},
		description: seo.description,
		alternates: {canonical: path},
		...(noindex ? {robots: {index: false, follow: false}} : {}),
		openGraph: {
			type: 'website',
			locale: 'ru_RU',
			siteName: site.name,
			title: seo.title,
			description: seo.description,
			url: path,
			images: [{url: image.src, width: image.width, height: image.height, alt: image.alt}]
		},
		twitter: {card: 'summary_large_image', title: seo.title, description: seo.description, images: [image.src]}
	};
}
