const NBSP = ' ';

/** `12000` -> `12 000 ₽` (non-breaking spaces), `null` -> `—`. */
export function formatPrice(value: number | null): string {
	if (value === null) return '—';
	const digits = String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
	return `${digits}${NBSP}₽`;
}

/** `1733025` -> `1,7 МБ`. Returns an empty string when the size is unknown (0). */
export function formatBytes(bytes: number): string {
	if (!bytes || bytes <= 0) return '';
	if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')}${NBSP}МБ`;
	return `${Math.max(1, Math.round(bytes / 1024))}${NBSP}КБ`;
}
