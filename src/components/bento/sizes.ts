export type TBentoSize = 'sm' | 'md' | 'lg' | 'wide';

/** Grid span / height classes for each tile size, applied on the `<li>`. */
export const sizeClasses: Record<TBentoSize, string> = {
	sm: 'min-h-44 md:min-h-0 md:col-span-1 md:row-span-1',
	md: 'min-h-64 md:min-h-0 md:row-span-2',
	lg: 'min-h-96 md:min-h-0 md:col-span-2 md:row-span-2',
	wide: 'min-h-52 md:min-h-0 md:col-span-2 lg:col-span-3'
};

/** On every tile: a trailing odd tile fills the tablet row. */
export const commonItemClasses = 'bento-item md:max-lg:last:col-span-2';
