export type TSearchDocType = 'direction' | 'studio' | 'teacher' | 'faq' | 'price' | 'page' | 'document';

export type TSearchDoc = {
	/** Unique, e.g. `direction:tancy`. */
	id: string;
	type: TSearchDocType;
	/** Shown as the result title (human case, not ALL CAPS). */
	title: string;
	/** Short context line, e.g. `Направление · Детям`. */
	subtitle: string;
	/** Site path, may include `#hash`; PDFs are `/docs/...pdf`. */
	href: string;
	/** Extra high-signal terms (aliases, menu labels, programme titles, metro). */
	keywords: string;
	/** Plain text, max ~3000 chars. */
	body: string;
};
