// «Предпросмотр» links of the admin edit screens: they open the public page in a new tab.
const serverURL = (process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

export const publicUrl = (path: string): string => `${serverURL}${path}`;

const PAGE_PATHS: Record<string, string> = {
	about: '/o-nas/',
	events: '/sobytiya/',
	festivals: '/festivali/',
	privacy: '/politika-konfidencialnosti/'
};

export const directionPreview = (doc: Record<string, unknown>): string | null =>
	typeof doc.slug === 'string' ? publicUrl(`/napravleniya/${doc.slug}/`) : null;

export const studioPreview = (doc: Record<string, unknown>): string | null =>
	typeof doc.slug === 'string' ? publicUrl(`/studii/${doc.slug}/`) : null;

export const pagePreview = (doc: Record<string, unknown>): string | null =>
	typeof doc.key === 'string' && PAGE_PATHS[doc.key] ? publicUrl(PAGE_PATHS[doc.key]) : null;

export const teacherPreview = (doc: Record<string, unknown>): string | null =>
	typeof doc.slug === 'string' ? publicUrl(`/komanda/#${doc.slug}`) : null;

/** Preview generator for a global that has a fixed public page. */
export const staticPreview = (path: string) => (): string => publicUrl(path);
