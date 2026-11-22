import {MagazineCover} from '@/components/cover/MagazineCover';
import {JsonLd} from '@/components/ui/JsonLd';
import {home} from '@/content';
import {centreJsonLd} from '@/lib/jsonld';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export const metadata: Metadata = buildMetadata({seo: home.seo, path: home.path});

export default function HomePage(): ReactNode {
	return (
		<>
			<MagazineCover />
			<JsonLd data={centreJsonLd()} />
		</>
	);
}
