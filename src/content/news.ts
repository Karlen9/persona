// Generated from the personamodel.ru crawl of 2026-11-20 by scripts/generate_ts.py.
// Copy is verbatim; fix it here (or in the CMS that replaces this module).

import type {TNewsPage, TNewsPost} from './types';

/**
 * The live /news/ page contains no posts (WordPress has 0 posts): it only points visitors to the
 * VK / Telegram / MAX channels. `newsPosts` stays empty until the site gets its own news feed.
 */
export const newsPosts: TNewsPost[] = [];

export const newsPage: TNewsPage = {
	path: '/novosti/',
	h1: 'Новости творческой студии',
	intro: [
		{
			type: 'paragraph',
			text: 'Актуальные новости, пресс-релизы наших и партнерских проектов, фото и видео с выступлений студийцев мы выкладываем в социальных сетях Vk и Telegram Переходите по ссылке Подписывайтесь и будьте в курсе самых интересных событий'
		}
	],
	links: [
		{
			label: 'https://vk.com/personamodelmoscow',
			href: 'https://vk.com/personamodelmoscow'
		},
		{
			label: 'https://t.me/personamp56',
			href: 'https://t.me/personamp56'
		},
		{
			label: 'https://max.ru/id615422777189_biz',
			href: 'https://max.ru/id615422777189_biz'
		}
	],
	seo: {
		title: 'Новости творческой студии в Москве - PersonaModel',
		description: 'Следите за новостями творческой студии в Москве на официальном сайте PersonaModel'
	},
	oldPaths: ['/news/'],
	lastModified: '2026-03-02T21:53:30Z'
};
