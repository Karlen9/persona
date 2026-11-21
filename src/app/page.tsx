import {EntranceGate} from '@/components/bento/EntranceGate';
import {BentoGrid} from '@/components/bento/BentoGrid';
import {bentoTiles} from '@/components/bento/tiles';
import {Container} from '@/components/ui/Container';
import {JsonLd} from '@/components/ui/JsonLd';
import {home} from '@/content';
import {centreJsonLd} from '@/lib/jsonld';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export const metadata: Metadata = buildMetadata({seo: home.seo, path: home.path});

function HeroHeading({title, accent}: {title: string; accent?: string | null}): ReactNode {
	const at = accent ? title.indexOf(accent) : -1;
	if (!accent || at === -1) return title;
	return (
		<>
			{title.slice(0, at)}
			<span className={'text-brand-700'}>{accent}</span>
			{title.slice(at + accent.length)}
		</>
	);
}

export default function HomePage(): ReactNode {
	return (
		<>
			<section className={'pt-6 pb-section md:pt-10 md:pb-section-lg'}>
				<Container>
					<div className={'mb-8 max-w-3xl md:mb-10'}>
						<h1
							className={
								'text-3xl leading-tight font-extrabold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl'
							}
						>
							<HeroHeading title={home.hero.heading} accent={home.hero.headingAccent} />
						</h1>
						<p className={'mt-4 max-w-2xl text-base text-body sm:text-lg'}>{home.hero.text}</p>
					</div>
					<EntranceGate>
						<BentoGrid tiles={bentoTiles} />
					</EntranceGate>
				</Container>
			</section>

			<JsonLd data={centreJsonLd()} />
		</>
	);
}
