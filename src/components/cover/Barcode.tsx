import type {ReactNode} from 'react';

type TBarcodeProps = {
	seed: string;
	className?: string;
};

/** Small deterministic PRNG so the same seed always draws the same bars (stable between builds). */
function createRandom(seed: string): () => number {
	let state = 2166136261;
	for (const char of seed) {
		state = Math.imul(state ^ char.charCodeAt(0), 16777619) >>> 0;
	}
	return () => {
		state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
		return state / 4294967296;
	};
}

const BAR_COUNT = 34;

export function Barcode({seed, className}: TBarcodeProps): ReactNode {
	const random = createRandom(seed);
	const bars: {x: number; width: number}[] = [];
	let x = 0;
	for (let index = 0; index < BAR_COUNT; index += 1) {
		const width = 1 + Math.floor(random() * 3);
		bars.push({x, width});
		x += width + 1 + Math.floor(random() * 2);
	}
	const digits = Array.from({length: 13}, () => Math.floor(random() * 10)).join('');
	const printed = `${digits.slice(0, 1)} ${digits.slice(1, 7)} ${digits.slice(7)}`;

	return (
		<div aria-hidden={'true'} className={className}>
			<svg
				viewBox={`0 0 ${x} 40`}
				width={x * 1}
				height={24}
				fill={'currentColor'}
				className={'block h-6 w-auto'}
				focusable={'false'}
			>
				{bars.map((bar) => (
					<rect key={bar.x} x={bar.x} y={0} width={bar.width} height={40} />
				))}
			</svg>
			<span className={'mt-1 block font-mono text-[9px] leading-none tracking-[0.18em]'}>{printed}</span>
		</div>
	);
}
