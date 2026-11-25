import {VideoPlayer} from '@/components/ui/VideoPlayer';

import type {ReactNode} from 'react';
import type {TVideo} from '@/content/types';

type TVideoGridProps = {
	videos: TVideo[];
	/** Used to build per-video accessible names («<label>: видео 1»). */
	label: string;
	/** Poster `sizes` for the grid; must match `columnsClassName`. */
	sizes?: string;
	columnsClassName?: string;
	/** Uniform tile aspect (Tailwind class) applied when the grid has several videos; default is portrait 9/16. */
	aspectClassName?: string;
};

/** Grid of click-to-play videos; tiles share one aspect ratio (a lone video keeps its poster's ratio). */
export function VideoGrid({
	videos,
	label,
	sizes = '(min-width: 1200px) 288px, (min-width: 768px) 33vw, 50vw',
	columnsClassName = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
	aspectClassName = 'aspect-[9/16]'
}: TVideoGridProps): ReactNode {
	const uniform = videos.length > 1;
	return (
		<ul className={`grid gap-3 sm:gap-4 ${columnsClassName}`}>
			{videos.map((video, index) => (
				<li key={`${video.src}-${index}`}>
					{video.poster ? (
						<VideoPlayer
							src={video.src}
							mimeType={video.mimeType}
							poster={video.poster.src}
							{...(uniform ? {aspectClassName} : {ratio: video.poster.width / video.poster.height})}
							modalRatio={video.poster.width / video.poster.height}
							title={video.caption ? `${label}: ${video.caption}` : `${label}: видео ${index + 1}`}
							caption={video.caption}
							sizes={sizes}
						/>
					) : (
						<a
							href={video.src}
							target={'_blank'}
							rel={'noopener noreferrer'}
							className={'font-bold text-brand-800 underline'}
						>
							{`${label}: видео ${index + 1}`}
						</a>
					)}
				</li>
			))}
		</ul>
	);
}
