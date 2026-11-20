import {
	ArrowRight,
	Baby,
	Brain,
	Calendar,
	Camera,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Clock,
	Cpu,
	Drama,
	ExternalLink,
	Heart,
	Languages,
	Mail,
	MapPin,
	Menu,
	MessageCircle,
	Mic,
	Music,
	Palette,
	Phone,
	Play,
	Quote,
	Shirt,
	Send,
	Sparkles,
	Star,
	TrainFront,
	Users,
	X
} from 'lucide-react';

import type {ReactNode} from 'react';

const lucideIcons = {
	'arrow-right': ArrowRight,
	baby: Baby,
	brain: Brain,
	calendar: Calendar,
	camera: Camera,
	check: Check,
	'chevron-down': ChevronDown,
	'chevron-left': ChevronLeft,
	'chevron-right': ChevronRight,
	clock: Clock,
	cpu: Cpu,
	drama: Drama,
	external: ExternalLink,
	heart: Heart,
	languages: Languages,
	mail: Mail,
	'map-pin': MapPin,
	menu: Menu,
	message: MessageCircle,
	mic: Mic,
	music: Music,
	palette: Palette,
	phone: Phone,
	play: Play,
	quote: Quote,
	shirt: Shirt,
	telegram: Send,
	sparkles: Sparkles,
	star: Star,
	metro: TrainFront,
	users: Users,
	close: X
};

const brandIcons = ['vk', 'max'] as const;

export type TIconName = keyof typeof lucideIcons | (typeof brandIcons)[number];

type TIconProps = {
	name: TIconName;
	size?: number;
	className?: string;
};

export function Icon({name, size = 20, className}: TIconProps): ReactNode {
	if (name === 'vk' || name === 'max') {
		return (
			<svg width={size} height={size} viewBox={'0 0 24 24'} aria-hidden className={className}>
				<text
					x={'12'}
					y={'16'}
					textAnchor={'middle'}
					fontSize={name === 'vk' ? '11' : '8.5'}
					fontWeight={'800'}
					fill={'currentColor'}
					fontFamily={'inherit'}
				>
					{name === 'vk' ? 'VK' : 'MAX'}
				</text>
			</svg>
		);
	}
	const Component = lucideIcons[name];
	return <Component size={size} className={className} aria-hidden strokeWidth={2} />;
}
