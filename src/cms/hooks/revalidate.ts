import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook,
	CollectionConfig,
	GlobalAfterChangeHook,
	GlobalConfig,
	PayloadRequest
} from 'payload';

// Every published page renders CMS content (menu, footer, contacts are on all of them), so any change drops the whole
// static cache; the next request regenerates the pages. The sitemap and the search index are covered by the layout too.
async function revalidateSite(req: PayloadRequest): Promise<void> {
	if (req.context.disableRevalidate) return;
	try {
		const {revalidatePath} = await import('next/cache');
		revalidatePath('/', 'layout');
	} catch (error) {
		// `payload run` scripts (seed, check:cms) execute outside Next, where revalidation is not available.
		req.payload.logger.debug(
			`revalidate skipped: ${error instanceof Error ? error.message : 'next/cache is unavailable'}`
		);
	}
}

const afterChange: CollectionAfterChangeHook & GlobalAfterChangeHook = async ({doc, req}) => {
	await revalidateSite(req);
	return doc;
};

const afterDelete: CollectionAfterDeleteHook = async ({doc, req}) => {
	await revalidateSite(req);
	return doc;
};

export const withCollectionRevalidation = (config: CollectionConfig): CollectionConfig => ({
	...config,
	hooks: {
		...config.hooks,
		afterChange: [...(config.hooks?.afterChange ?? []), afterChange],
		afterDelete: [...(config.hooks?.afterDelete ?? []), afterDelete]
	}
});

export const withGlobalRevalidation = (config: GlobalConfig): GlobalConfig => ({
	...config,
	hooks: {
		...config.hooks,
		afterChange: [...(config.hooks?.afterChange ?? []), afterChange]
	}
});
