import {stringToRichText} from '@/cms/richtext';

import type {TBlock, TCard, TImage, TLink, TSeo, TVideo} from '@/content/types';
import type {
	ArticleSectionBlock,
	CardsBlock,
	HeadingBlock,
	ListBlock,
	Media,
	ParagraphBlock,
	StatBlock
} from '@/payload-types';

export type TRel<T> = number | T | null | undefined;
export type TPayloadBlock = ParagraphBlock | HeadingBlock | ListBlock | StatBlock | CardsBlock;

/** Populated media doc, or `undefined` for an empty relationship. Throws when the query was too shallow. */
export function populated<T extends object>(value: TRel<T>, what: string): T | undefined {
	if (value === null || value === undefined) {
		return undefined;
	}
	if (typeof value === 'number') {
		throw new Error(`CMS read layer: ${what} is not populated (increase the query depth)`);
	}
	return value;
}

export function mapImage(value: TRel<Media>, what = 'media'): TImage | undefined {
	const media = populated(value, what);
	if (!media) {
		return undefined;
	}
	const image: TImage = {
		src: media.url ?? '',
		width: media.width ?? 0,
		height: media.height ?? 0,
		alt: media.alt
	};
	if (media.altGenerated) {
		image.altGenerated = true;
	}
	return image;
}

export function requireImage(value: TRel<Media>, what: string): TImage {
	const image = mapImage(value, what);
	if (!image) {
		throw new Error(`CMS read layer: ${what} has no image`);
	}
	return image;
}

export function mapLink(link: {label?: string | null; href?: string | null; external?: boolean | null}): TLink {
	const result: TLink = {label: link.label ?? '', href: link.href ?? ''};
	if (link.external) {
		result.external = true;
	}
	return result;
}

/** A link group whose fields may all be empty (optional link). */
export function mapOptionalLink(link: Parameters<typeof mapLink>[0] | null | undefined): TLink | undefined {
	return link && link.label && link.href ? mapLink(link) : undefined;
}

export function mapSeo(seo: {title: string; description: string; ogImage?: TRel<Media>}): TSeo {
	const result: TSeo = {title: seo.title, description: seo.description};
	const ogImage = mapImage(seo.ogImage, 'seo.ogImage');
	if (ogImage) {
		result.ogImage = ogImage;
	}
	return result;
}

type TCardRow = {title: string; text: string; image?: TRel<Media>};

export function mapCards(items: TCardRow[] | null | undefined): TCard[] {
	return (items ?? []).map((item) => {
		const card: TCard = {title: item.title, text: item.text};
		const image = mapImage(item.image, 'card image');
		if (image) {
			card.image = image;
		}
		return card;
	});
}

export function mapBlocks(blocks: TPayloadBlock[] | ArticleSectionBlock['blocks']): TBlock[] {
	return (blocks ?? []).map((block): TBlock => {
		switch (block.blockType) {
			case 'paragraph':
				return {
					type: 'paragraph',
					...(block.variant ? {variant: block.variant} : {}),
					...stringToRichText(block.text)
				};
			case 'heading':
				return {
					type: 'heading',
					level: Number(block.level) as 2 | 3 | 4,
					...(block.icon ? {icon: block.icon} : {}),
					...stringToRichText(block.text)
				};
			case 'list':
				return {
					type: 'list',
					ordered: Boolean(block.ordered),
					items: (block.items ?? []).map((item) => stringToRichText(item.text))
				};
			case 'stat':
				return {type: 'stat', value: block.value, label: block.label};
			case 'cards':
				return {type: 'cards', items: mapCards(block.items)};
		}
	});
}

type TVideoRow = {
	src: string;
	mimeType?: string | null;
	sizeBytes?: number | null;
	poster?: TRel<Media>;
	caption?: string | null;
};

export function mapVideos(videos: TVideoRow[] | null | undefined): TVideo[] {
	return (videos ?? []).map((video) => {
		const result: TVideo = {src: video.src, poster: mapImage(video.poster, 'video poster') ?? null};
		if (video.mimeType) result.mimeType = video.mimeType;
		if (video.sizeBytes !== null && video.sizeBytes !== undefined) result.sizeBytes = video.sizeBytes;
		if (video.caption) result.caption = video.caption;
		return result;
	});
}

export function mapImages(values: TRel<Media>[] | null | undefined, what: string): TImage[] {
	return (values ?? []).map((value) => requireImage(value, what));
}

/** Slugs of populated related docs. */
export function slugsOf(values: TRel<{slug: string}>[] | null | undefined, what: string): string[] {
	return (values ?? []).map((value) => {
		const doc = populated(value, what);
		if (!doc) {
			throw new Error(`CMS read layer: empty ${what} relationship`);
		}
		return doc.slug;
	});
}

export function slugOf(value: TRel<{slug: string}>, what: string): string {
	const slug = slugsOf([value], what)[0];
	return slug as string;
}

export const texts = (rows: {text: string}[] | null | undefined): string[] => (rows ?? []).map((row) => row.text);
