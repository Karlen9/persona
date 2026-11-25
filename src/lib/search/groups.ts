import type {TSearchHit} from './engine';
import type {TSearchDocType} from './types';

export const GROUP_LABELS: Record<TSearchDocType, string> = {
	direction: 'Направления',
	studio: 'Студии',
	teacher: 'Педагоги',
	price: 'Цены',
	faq: 'Вопросы',
	page: 'Страницы',
	document: 'Документы'
};

export type TSearchGroup = {type: TSearchDocType; label: string; hits: TSearchHit[]};

/** Groups hits by type, groups ordered by the rank of their best hit; hit order inside a group is kept. */
export function groupHits(hits: TSearchHit[]): TSearchGroup[] {
	const groups = new Map<TSearchDocType, TSearchGroup>();
	for (const hit of hits) {
		const group = groups.get(hit.doc.type);
		if (group) group.hits.push(hit);
		else groups.set(hit.doc.type, {type: hit.doc.type, label: GROUP_LABELS[hit.doc.type], hits: [hit]});
	}
	return [...groups.values()];
}
