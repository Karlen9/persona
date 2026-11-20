import {cn} from '@/lib/cn';

import type {ButtonHTMLAttributes, ReactNode} from 'react';

export type TButtonVariant = 'primary' | 'secondary' | 'ghost';
export type TButtonSize = 'sm' | 'md' | 'lg';

const base =
	'inline-flex items-center justify-center gap-2 rounded-btn py-2 text-center font-bold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-60';

const variants: Record<TButtonVariant, string> = {
	primary: 'bg-brand text-brand-ink hover:bg-brand-300 active:bg-brand-200 shadow-[0_6px_16px_rgb(93_186_168/0.35)]',
	secondary: 'border border-line bg-white text-ink hover:border-brand-400 hover:text-brand-800',
	ghost: 'text-brand-800 hover:bg-brand-50'
};

const sizes: Record<TButtonSize, string> = {
	sm: 'min-h-11 px-4 text-sm',
	md: 'min-h-12 px-5 text-base',
	lg: 'min-h-14 px-7 text-lg'
};

type TStyleProps = {
	variant?: TButtonVariant;
	size?: TButtonSize;
	className?: string;
};

export function buttonClasses({variant = 'primary', size = 'md', className}: TStyleProps = {}): string {
	return cn(base, variants[variant], sizes[size], className);
}

type TButtonProps = TStyleProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

export function Button({variant, size, className, type = 'button', ...rest}: TButtonProps): ReactNode {
	return <button type={type} className={buttonClasses({variant, size, className})} {...rest} />;
}
