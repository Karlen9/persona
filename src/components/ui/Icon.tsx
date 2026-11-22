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
	sparkles: Sparkles,
	star: Star,
	metro: TrainFront,
	users: Users,
	close: X
};

type TBrandIcon = {
	viewBox: string;
	path: string;
	evenodd?: boolean;
};

const brandIcons = {
	telegram: {
		viewBox: '0 0 100 100',
		path: 'M88.723,12.142C76.419,17.238,23.661,39.091,9.084,45.047c-9.776,3.815-4.053,7.392-4.053,7.392 s8.345,2.861,15.499,5.007c7.153,2.146,10.968-0.238,10.968-0.238l33.62-22.652c11.922-8.107,9.061-1.431,6.199,1.431 c-6.199,6.2-16.452,15.975-25.036,23.844c-3.815,3.338-1.908,6.199-0.238,7.63c6.199,5.246,23.129,15.976,24.082,16.691 c5.037,3.566,14.945,8.699,16.452-2.146c0,0,5.961-37.435,5.961-37.435c1.908-12.637,3.815-24.321,4.053-27.659 C97.307,8.804,88.723,12.142,88.723,12.142z'
	},
	vk: {
		viewBox: '0 0 24 24',
		path: 'M23.4493 5.94799C23.6161 5.40154 23.4493 5 22.6553 5H20.0297C19.3621 5 19.0543 5.34687 18.8874 5.72936C18.8874 5.72936 17.5521 8.92607 15.6606 11.0025C15.0487 11.6036 14.7705 11.7949 14.4367 11.7949C14.2698 11.7949 14.0194 11.6036 14.0194 11.0572V5.94799C14.0194 5.29225 13.8345 5 13.2781 5H9.15213C8.73494 5 8.48403 5.30434 8.48403 5.59278C8.48403 6.21441 9.42974 6.35777 9.52722 8.10641V11.9042C9.52722 12.7368 9.37413 12.8878 9.04032 12.8878C8.15023 12.8878 5.98507 9.67682 4.70093 6.00261C4.44927 5.28847 4.19686 5 3.52583 5H0.900218C0.150044 5 0 5.34687 0 5.72936C0 6.41244 0.890141 9.80039 4.14464 14.2812C6.31429 17.3412 9.37118 19 12.1528 19C13.8218 19 14.0283 18.6316 14.0283 17.997V15.6842C14.0283 14.9474 14.1864 14.8003 14.7149 14.8003C15.1043 14.8003 15.7719 14.9916 17.3296 16.467C19.1099 18.2156 19.4034 19 20.4047 19H23.0304C23.7805 19 24.1556 18.6316 23.9392 17.9045C23.7024 17.1799 22.8525 16.1286 21.7247 14.8823C21.1127 14.1719 20.1947 13.4069 19.9165 13.0243C19.5271 12.5326 19.6384 12.314 19.9165 11.8769C19.9165 11.8769 23.1155 7.45067 23.4493 5.94799Z',
		evenodd: true
	},
	max: {
		viewBox: '0 0 720 720',
		path: 'M350.4,9.6C141.8,20.5,4.1,184.1,12.8,390.4c3.8,90.3,40.1,168,48.7,253.7,2.2,22.2-4.2,49.6,21.4,59.3,31.5,11.9,79.8-8.1,106.2-26.4,9-6.1,17.6-13.2,24.2-22,27.3,18.1,53.2,35.6,85.7,43.4,143.1,34.3,299.9-44.2,369.6-170.3C799.6,291.2,622.5-4.6,350.4,9.6h0ZM269.4,504c-11.3,8.8-22.2,20.8-34.7,27.7-18.1,9.7-23.7-.4-30.5-16.4-21.4-50.9-24-137.6-11.5-190.9,16.8-72.5,72.9-136.3,150-143.1,78-6.9,150.4,32.7,183.1,104.2,72.4,159.1-112.9,316.2-256.4,218.6h0Z',
		evenodd: true
	}
} satisfies Record<string, TBrandIcon>;

export type TIconName = keyof typeof lucideIcons | keyof typeof brandIcons;

type TIconProps = {
	name: TIconName;
	size?: number;
	className?: string;
};

export function Icon({name, size = 20, className}: TIconProps): ReactNode {
	if (name in brandIcons) {
		const {viewBox, path, evenodd}: TBrandIcon = brandIcons[name as keyof typeof brandIcons];
		return (
			<svg width={size} height={size} viewBox={viewBox} fill={'currentColor'} aria-hidden className={className}>
				<path d={path} fillRule={evenodd ? 'evenodd' : undefined} clipRule={evenodd ? 'evenodd' : undefined} />
			</svg>
		);
	}
	const Component = lucideIcons[name as keyof typeof lucideIcons];
	return <Component size={size} className={className} aria-hidden strokeWidth={2} />;
}
