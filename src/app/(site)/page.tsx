import {MagazineCover} from '@/components/cover/MagazineCover';
import {JsonLd} from '@/components/ui/JsonLd';
import {getHome} from '@/lib/cms';
import {centreJsonLd} from '@/lib/jsonld';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export async function generateMetadata(): Promise<Metadata> {
	const home = await getHome();
	return buildMetadata({seo: home.seo, path: home.path});
}

export default async function HomePage(): Promise<ReactNode> {
	return (
		<>
			<MagazineCover />
			<JsonLd data={await centreJsonLd()} />
		</>
	);
}
