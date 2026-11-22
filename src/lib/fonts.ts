import {Playfair_Display} from 'next/font/google';

export const displayFont = Playfair_Display({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-playfair',
	display: 'swap'
});
