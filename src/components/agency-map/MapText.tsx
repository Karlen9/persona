import {Text} from '@react-three/drei';
import {Suspense} from 'react';

import type {ComponentProps, ReactNode} from 'react';

/** Self-hosted Manrope 700 (troika reads .woff/.ttf/.otf, not .woff2); without it troika fetches a font from a CDN. */
const FONTS = {
	cyrillic: '/fonts/manrope-cyrillic-700.woff',
	latin: '/fonts/manrope-latin-700.woff'
} as const;

type TMapTextProps = Omit<ComponentProps<typeof Text>, 'font'> & {script: keyof typeof FONTS};

/** troika <Text> in its own Suspense boundary: while the font loads the label is absent but the scene still renders. */
export function MapText({script, ...props}: TMapTextProps): ReactNode {
	return (
		<Suspense fallback={null}>
			<Text font={FONTS[script]} {...props} />
		</Suspense>
	);
}
