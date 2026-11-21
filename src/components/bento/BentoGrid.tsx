import {BentoTile} from '@/components/bento/BentoTile';
import {commonItemClasses, sizeClasses} from '@/components/bento/sizes';
import {cn} from '@/lib/cn';

import type {CSSProperties, ReactNode} from 'react';
import type {TBentoTile} from '@/components/bento/tiles';

type TBentoGridProps = {
	tiles: TBentoTile[];
};

export function BentoGrid({tiles}: TBentoGridProps): ReactNode {
	return (
		<nav aria-label={'Разделы сайта'}>
			<ul className={'grid grid-cols-1 gap-4 md:auto-rows-[13rem] md:grid-cols-2 lg:grid-cols-4'}>
				{tiles.map((tile, index) => (
					<li
						key={tile.id}
						className={cn(commonItemClasses, sizeClasses[tile.size])}
						style={{'--i': index} as CSSProperties}
					>
						<BentoTile
							id={tile.id}
							title={tile.title}
							eyebrow={tile.eyebrow}
							description={tile.description}
							href={tile.href}
							size={tile.size}
							tone={tile.tone}
						>
							{tile.preview}
						</BentoTile>
					</li>
				))}
			</ul>
		</nav>
	);
}
