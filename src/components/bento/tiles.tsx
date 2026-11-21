import {ClockPreview} from '@/components/bento/previews/ClockPreview';
import {ContactPreview} from '@/components/bento/previews/ContactPreview';
import {CyclingListPreview} from '@/components/bento/previews/CyclingListPreview';
import {ImageCarouselPreview} from '@/components/bento/previews/ImageCarouselPreview';
import {RotatingSetPreview} from '@/components/bento/previews/RotatingSetPreview';
import {directions, site, studios, teachers} from '@/content';
import {PHONES} from '@/lib/site';

import type {ReactNode} from 'react';
import type {TBentoSize} from '@/components/bento/sizes';
import type {TIconName} from '@/components/ui/Icon';

export type {TBentoSize};

export type TBentoTone = 'photo' | 'deep' | 'light' | 'brand' | 'accent';

export type TBentoTile = {
	id: string;
	title: string;
	eyebrow?: string;
	description: string;
	href: string;
	size: TBentoSize;
	/** Background / text treatment. Defaults to `light`. */
	tone?: TBentoTone;
	/** A server-built element with serialisable props, rendered inside the (client) tile. */
	preview: ReactNode;
};

const festivalPhotos = [1, 2, 3, 4, 5, 6].map((n) => `/media/festivals/festivali-photo-${n}.png`);

const directionTitles = directions
	.filter((direction) => direction.audience === 'kids')
	.sort((a, b) => a.order - b.order)
	.slice(0, 6)
	.map((direction) => direction.shortTitle);

const teacherAvatars = [...teachers]
	.sort((a, b) => a.order - b.order)
	.slice(0, 3)
	.map((teacher) => ({src: teacher.photo.src}));

type TReviewPlatform = {title: string; text: string; icon: TIconName};

const reviewInvite = 'Читайте отзывы родителей и делитесь своим';

// `reviews` content is empty and there are no client logos, so the tile only names real platforms.
const reviewPlatforms: TReviewPlatform[] = [
	...(site.yandex.orgUrl ? [{title: 'Отзывы на Яндекс Картах', text: reviewInvite, icon: 'star' as const}] : []),
	...(site.twoGis.reviewsUrl ? [{title: 'Отзывы в 2ГИС', text: reviewInvite, icon: 'map-pin' as const}] : []),
	...site.socials
		.filter((social) => social.kind === 'vk' || social.kind === 'telegram')
		.map((social) => ({
			title: social.kind === 'vk' ? 'Мы ВКонтакте' : 'Мы в Telegram',
			text: 'Новости и жизнь центра',
			icon: social.kind
		}))
];

/** Order = DOM order = tab order = importance. Adding or changing a section means editing this array only. */
export const bentoTiles: TBentoTile[] = [
	{
		id: 'work',
		title: 'Фестивали',
		eyebrow: 'Наши события',
		description: 'Яркие фестивали и показы, где дети выходят на настоящую сцену.',
		href: '/festivali/',
		size: 'lg',
		tone: 'photo',
		preview: (
			<ImageCarouselPreview
				images={festivalPhotos}
				sizes={'(min-width: 1024px) 600px, (min-width: 768px) 90vw, 100vw'}
			/>
		)
	},
	{
		id: 'services',
		title: 'Направления',
		eyebrow: 'Чему учим',
		description: 'Более 20 направлений для детей и взрослых.',
		href: '/napravleniya/',
		size: 'md',
		tone: 'brand',
		preview: <CyclingListPreview items={directionTitles} />
	},
	{
		id: 'about',
		title: 'О нас и команда',
		eyebrow: `С ${site.foundedYear} года`,
		description: 'Центр, педагоги и традиции PersOna.',
		href: '/o-nas/',
		size: 'md',
		tone: 'light',
		preview: <ClockPreview avatars={teacherAvatars} hours={studios[0]?.hours} />
	},
	{
		id: 'clients',
		title: 'Отзывы',
		eyebrow: 'Нам доверяют',
		description: 'Что говорят родители и ученики о занятиях в центре.',
		href: '/otzyvy/',
		size: 'wide',
		tone: 'accent',
		preview: <RotatingSetPreview items={reviewPlatforms} />
	},
	{
		id: 'contact',
		title: 'Контакты',
		eyebrow: 'Приходите',
		description: 'Адреса студий, телефоны и запись.',
		href: '/studii/',
		size: 'sm',
		tone: 'deep',
		preview: <ContactPreview cta={'Записаться на пробное'} phone={PHONES[0].label} />
	}
];
