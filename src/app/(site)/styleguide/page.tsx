import {ContactsBlock} from '@/components/blocks/ContactsBlock';
import {CtaBand} from '@/components/blocks/CtaBand';
import {DirectionCard} from '@/components/blocks/DirectionCard';
import {HomeHero} from '@/components/blocks/HomeHero';
import {LogoStrip} from '@/components/blocks/LogoStrip';
import {NewsCard} from '@/components/blocks/NewsCard';
import {PageHero} from '@/components/blocks/PageHero';
import {PriceTable} from '@/components/blocks/PriceTable';
import {ReviewCard} from '@/components/blocks/ReviewCard';
import {StudioCard} from '@/components/blocks/StudioCard';
import {TeacherCard} from '@/components/blocks/TeacherCard';
import {GisReviewsLink, YandexRatingBadge} from '@/components/integrations/YandexRatingBadge';
import {YandexMap} from '@/components/integrations/YandexMap';
import {Accordion} from '@/components/ui/Accordion';
import {Badge} from '@/components/ui/Badge';
import {Breadcrumbs} from '@/components/ui/Breadcrumbs';
import {Button} from '@/components/ui/Button';
import {ButtonLink} from '@/components/ui/ButtonLink';
import {Card} from '@/components/ui/Card';
import {Carousel} from '@/components/ui/Carousel';
import {Eyebrow} from '@/components/ui/Eyebrow';
import {Gallery} from '@/components/ui/Gallery';
import {Heading} from '@/components/ui/Heading';
import {Icon} from '@/components/ui/Icon';
import {FeatureGrid, IconFeature} from '@/components/ui/IconFeature';
import {RichText} from '@/components/ui/RichText';
import {Section} from '@/components/ui/Section';
import {Tabs} from '@/components/ui/Tabs';
import {VideoPlayer} from '@/components/ui/VideoPlayer';
import {getSite} from '@/lib/cms';
import {getSiteInfo} from '@/lib/siteInfo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export const metadata: Metadata = {
	title: 'Styleguide',
	robots: {index: false, follow: false}
};

function placeholder(color: string, label: string): string {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="#FDE5EC"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><text x="400" y="310" font-family="sans-serif" font-size="40" font-weight="700" fill="#063F3A" text-anchor="middle">${label}</text></svg>`;
	return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const photo = (n: number): {src: string; alt: string; width: number; height: number} => ({
	src: placeholder(n % 2 ? '#B0E6DA' : '#86D5C5', `Фото ${n}`),
	alt: `Пример фотографии ${n}`,
	width: 800,
	height: 600
});

const img = (color: string, label: string, alt: string): {src: string; alt: string; width: number; height: number} => ({
	src: placeholder(color, label),
	alt,
	width: 800,
	height: 600
});

const swatches = [
	['brand-50', 'bg-brand-50'],
	['brand-100', 'bg-brand-100'],
	['brand-200', 'bg-brand-200'],
	['brand-300', 'bg-brand-300'],
	['brand-400', 'bg-brand-400'],
	['brand-500', 'bg-brand-500'],
	['brand-600', 'bg-brand-600'],
	['brand-700', 'bg-brand-700'],
	['brand-800', 'bg-brand-800'],
	['brand-900', 'bg-brand-900'],
	['accent-100', 'bg-accent-100'],
	['accent-300', 'bg-accent-300'],
	['ink', 'bg-ink'],
	['body', 'bg-body'],
	['muted', 'bg-muted'],
	['line', 'bg-line'],
	['surface', 'bg-surface']
];

const faq = [
	{question: 'С какого возраста можно заниматься?', answer: 'С 3 лет, в зависимости от направления.'},
	{question: 'Есть ли пробное занятие?', answer: 'Да, первое занятие бесплатное.'}
];

export default async function StyleguidePage(): Promise<ReactNode> {
	const [site, info] = await Promise.all([getSite(), getSiteInfo()]);
	return (
		<>
			<PageHero
				breadcrumbs={[{label: 'Styleguide'}]}
				eyebrow={'Компоненты'}
				title={'Дизайн-система PersOna'}
				lead={'Все компоненты с тестовыми данными. Страница закрыта от индексации.'}
				image={img('#86D5C5', 'PageHero', 'Пример изображения')}
				secondaryCta={{label: 'Ссылка', href: '/napravleniya/'}}
			/>

			<Section variant={'tinted'} eyebrow={'Цвета'} title={'Палитра'}>
				<ul className={'grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-9'}>
					{swatches.map(([name, cls]) => (
						<li key={name} className={'text-center text-xs'}>
							<div className={`${cls} h-14 rounded-2xl border border-line`} />
							{name}
						</li>
					))}
				</ul>
			</Section>

			<Section
				eyebrow={'Типографика и кнопки'}
				title={'Заголовок секции'}
				lead={'Лид-абзац под заголовком секции.'}
			>
				<div className={'flex flex-col gap-6'}>
					<div className={'flex flex-wrap items-center gap-3'}>
						<Eyebrow>{'Eyebrow'}</Eyebrow>
						<Badge>{'Бейдж'}</Badge>
						<Badge tone={'accent'}>{'5–12 лет'}</Badge>
						<Badge tone={'neutral'}>{'Нейтральный'}</Badge>
					</div>
					<Heading level={1} size={'hero'}>
						{'Hero heading'}
					</Heading>
					<Heading level={3}>{'Заголовок уровня 3'}</Heading>
					<div className={'flex flex-wrap items-center gap-3'}>
						<Button>{'Primary'}</Button>
						<Button variant={'secondary'}>{'Secondary'}</Button>
						<Button variant={'ghost'}>{'Ghost'}</Button>
						<Button size={'sm'}>{'Small'}</Button>
						<Button size={'lg'}>{'Large'}</Button>
						<Button disabled>{'Disabled'}</Button>
						<ButtonLink href={'#zapis'}>
							{'Записаться'}
							<Icon name={'arrow-right'} />
						</ButtonLink>
					</div>
					<Breadcrumbs items={[{label: 'Направления', href: '/napravleniya/'}, {label: 'Танцы'}]} />
				</div>
			</Section>

			<Section variant={'card'} eyebrow={'Карточки'} title={'Card, IconFeature, FeatureGrid'}>
				<div className={'mb-8 grid gap-4 sm:grid-cols-2'}>
					<Card className={'p-6'}>{'Обычная карточка'}</Card>
					<Card interactive className={'p-6'}>
						{'Интерактивная карточка (hover)'}
					</Card>
				</div>
				<IconFeature icon={'heart'} title={'Одиночная строка'} text={'Иконка, заголовок и текст.'} />
				<FeatureGrid
					className={'mt-8'}
					columns={4}
					items={[
						{icon: 'music', title: 'Вокал', text: 'Пение и сцена'},
						{icon: 'palette', title: 'Рисование', text: 'Живопись и графика'},
						{icon: 'languages', title: 'Языки', text: 'Английский для детей'},
						{icon: 'brain', title: 'Шахматы', text: 'Логика и стратегия'}
					]}
				/>
			</Section>

			<Section variant={'tinted'} eyebrow={'Карточки контента'} title={'Направления, студии, новости'}>
				<div className={'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'}>
					<DirectionCard
						title={'Школа моделей'}
						href={'/napravleniya/shkola-modeley/'}
						age={'от 4 лет'}
						text={'Подиум, фото, уверенность.'}
						image={img('#86D5C5', 'Направление', 'Занятие в школе моделей')}
					/>
					<StudioCard
						name={'Мичуринский проспект'}
						href={'/studii/michurinskiy-prospekt/'}
						address={'Мичуринский проспект, 56'}
						metro={'Раменки'}
						image={img('#B0E6DA', 'Студия', 'Студия на Мичуринском')}
					/>
					<NewsCard
						title={'Весенний фестиваль талантов'}
						href={'/novosti/'}
						date={'12 марта 2026'}
						dateTime={'2026-03-12'}
						excerpt={'Рассказываем, как прошёл фестиваль и кто стал победителем.'}
						image={img('#D6F3EC', 'Новость', 'Фестиваль')}
					/>
				</div>
			</Section>

			<Section eyebrow={'Педагоги и отзывы'} title={'Карусель'}>
				<Carousel id={'sg-carousel'} label={'Отзывы'}>
					{[1, 2, 3, 4].map((n) => (
						<ReviewCard
							key={n}
							author={`Мария ${n}`}
							rating={5}
							meta={'Яндекс Карты'}
							text={
								'Дочка с удовольствием ходит на занятия, педагоги внимательные и добрые. Рекомендуем!'
							}
						/>
					))}
				</Carousel>
				<div className={'mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4'}>
					{[1, 2, 3, 4].map((n) => (
						<TeacherCard
							key={n}
							name={`Анна Иванова ${n}`}
							role={'Педагог по вокалу'}
							photo={img('#B0E6DA', 'Педагог', 'Анна Иванова')}
							bio={<p>{'Опыт работы более 10 лет, ученики — победители городских конкурсов.'}</p>}
						/>
					))}
				</div>
			</Section>

			<Section variant={'tinted'} eyebrow={'Интерактив'} title={'Tabs, Accordion, Gallery, Video'}>
				<Tabs
					tabs={[
						{id: 'a', label: 'Дети', content: <p>{'Содержимое вкладки «Дети».'}</p>},
						{id: 'b', label: 'Взрослые', content: <p>{'Содержимое вкладки «Взрослые».'}</p>}
					]}
				/>
				<div className={'mt-10 grid gap-8 lg:grid-cols-2'}>
					<Accordion items={faq} openFirst jsonLd />
					<VideoPlayer
						src={'/media/video/sample.mp4'}
						poster={placeholder('#86D5C5', 'Видео')}
						title={'Пример видео'}
					/>
				</div>
				<Gallery className={'mt-10'} images={[1, 2, 3, 4, 5, 6].map(photo)} />
			</Section>

			<Section eyebrow={'Цены'} title={'PriceTable'}>
				<PriceTable
					caption={'Абонементы'}
					rows={[
						{name: 'Пробное занятие', details: '1 занятие', price: 'Бесплатно'},
						{name: 'Абонемент 8 занятий', details: '2 раза в неделю', price: '9 600 ₽'},
						{name: 'Абонемент 16 занятий', details: 'на 2 месяца', price: '17 600 ₽'}
					]}
				/>
			</Section>

			<Section variant={'tinted'} eyebrow={'Тексты'} title={'RichText'}>
				<RichText
					blocks={[
						{type: 'heading', level: 3, text: 'Подзаголовок'},
						{type: 'paragraph', text: 'Абзац обычного текста для проверки типографики и длины строки.'},
						{type: 'list', ordered: false, items: [{text: 'Первый пункт'}, {text: 'Второй пункт'}]},
						{type: 'list', ordered: true, items: [{text: 'Шаг один'}, {text: 'Шаг два'}]},
						{type: 'stat', value: '20+', label: 'лет на сцене'},
						{type: 'stat', value: '4', label: 'студии в Москве'}
					]}
				/>
			</Section>

			<Section eyebrow={'Контакты и карта'} title={'ContactsBlock, YandexMap, рейтинг'}>
				<div className={'grid gap-8 lg:grid-cols-2'}>
					<ContactsBlock
						address={'Москва, Профсоюзная, 61'}
						metro={'Академическая'}
						hours={'ежедневно 9:00–21:00'}
					/>
					<YandexMap
						title={'Профсоюзная, 61'}
						address={'Москва, Профсоюзная, 61'}
						metro={'Академическая'}
						embedUrl={'https://yandex.ru/map-widget/v1/?um=constructor%3A&source=constructor'}
					/>
				</div>
				<div className={'mt-8 flex flex-wrap items-center gap-4'}>
					<YandexRatingBadge badgeUrl={site.yandex.ratingBadgeUrl} orgUrl={site.yandex.orgUrl} />
					<GisReviewsLink url={info.gisReviewsUrl} />
				</div>
				<div className={'mt-10'}>
					<LogoStrip
						title={'Нам доверяют'}
						items={[{name: 'Партнёр 1'}, {name: 'Партнёр 2'}, {name: 'Партнёр 3'}]}
					/>
				</div>
			</Section>

			<div className={'h-px'} />
			<HomeHero title={'HomeHero без фото'} text={'Мягкое свечение, пока нет изображения.'} />
			<CtaBand
				title={'CtaBand: запишитесь на занятие'}
				text={'Большая скруглённая полоса перед формой.'}
				secondaryCta={{label: 'Расписание', href: '/raspisanie/'}}
			/>
		</>
	);
}
