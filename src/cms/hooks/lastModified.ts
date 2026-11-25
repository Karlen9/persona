import type {CollectionBeforeChangeHook, GlobalBeforeChangeHook} from 'payload';

const nowIso = (): string => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

// Admin edits stamp the document; the seed script (context.seeding) keeps the imported WordPress date.
export const touchLastModified: CollectionBeforeChangeHook = ({data, req}) =>
	req.context.seeding ? data : {...data, lastModified: nowIso()};

export const touchGlobalLastModified: GlobalBeforeChangeHook = ({data, req}) =>
	req.context.seeding ? data : {...data, lastModified: nowIso()};
