'use client';

import {useState} from 'react';

import {VideoGrid} from '@/components/blocks/VideoGrid';
import {Button} from '@/components/ui/Button';
import {Gallery} from '@/components/ui/Gallery';
import {Tabs} from '@/components/ui/Tabs';

import type {ReactNode} from 'react';
import type {TGalleryTab} from '@/content/types';

type TGalleryTabsProps = {
	tabs: TGalleryTab[];
	/** How many items a tab shows before «Показать ещё»; the same number is added on every click. */
	batch?: number;
};

function GalleryPanel({tab, batch}: {tab: TGalleryTab; batch: number}): ReactNode {
	const [count, setCount] = useState(batch);
	const total = tab.images.length + tab.videos.length;

	return (
		<div>
			{tab.images.length > 0 ? <Gallery images={tab.images.slice(0, count)} columns={4} /> : null}
			{tab.videos.length > 0 ? <VideoGrid videos={tab.videos.slice(0, count)} label={tab.label} /> : null}
			{count < total ? (
				<div className={'mt-6 flex justify-center'}>
					<Button variant={'secondary'} onClick={() => setCount((value) => value + batch)}>
						{'Показать ещё'}
					</Button>
				</div>
			) : null}
		</div>
	);
}

/** Gallery tabs: only the active tab is mounted, and only its first batch of items is rendered. */
export function GalleryTabs({tabs, batch = 8}: TGalleryTabsProps): ReactNode {
	return (
		<Tabs
			lazy
			tabs={tabs.map((tab) => ({
				id: tab.id,
				label: tab.label,
				content: <GalleryPanel tab={tab} batch={batch} />
			}))}
		/>
	);
}
