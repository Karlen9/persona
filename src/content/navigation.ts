export type TNavLink = {
	label: string;
	href: string;
};

export type TNavColumn = {
	title: string;
	links: TNavLink[];
};

export type TNavItem = {
	label: string;
	href: string;
	/** Simple dropdown. */
	children?: TNavLink[];
	/** Mega dropdown in columns. */
	columns?: TNavColumn[];
	/** Extra link rendered at the bottom of a dropdown. */
	allLink?: TNavLink;
};

export type TFooterColumn = {
	title: string;
	links: TNavLink[];
	/** Legal links: kept on mobile, where the other footer columns are hidden. */
	legal?: boolean;
};

const kids: TNavLink[] = [
	{label: 'Школа моделей', href: '/napravleniya/shkola-modeley/'},
	{label: 'Танцы', href: '/napravleniya/tancy/'},
	{label: 'Вокал', href: '/napravleniya/vokal/'},
	{label: 'Театр', href: '/napravleniya/teatr/'},
	{label: 'Рисование', href: '/napravleniya/risovanie/'},
	{label: 'Арт-мастерская', href: '/napravleniya/art-masterskaya/'},
	{label: 'Шахматы', href: '/napravleniya/shahmaty/'},
	{label: 'Инженерный клуб «Мегавольт»', href: '/napravleniya/megavolt/'},
	{label: 'Робототехника', href: '/napravleniya/robototehnika/'},
	{label: 'Подготовка к школе', href: '/napravleniya/podgotovka-k-shkole/'},
	{label: 'Языковая школа', href: '/napravleniya/yazykovaya-shkola/'},
	{label: 'Логопед', href: '/napravleniya/logoped/'},
	{label: 'Игра на музыкальных инструментах', href: '/napravleniya/muzykalnye-instrumenty/'}
];

const adults: TNavLink[] = [
	{label: 'Для взрослых', href: '/napravleniya/dlya-vzroslyh/'},
	{label: 'Пилатес', href: '/napravleniya/pilates/'},
	{label: 'Йога', href: '/napravleniya/joga/'},
	{label: 'Баррэ-фитнес', href: '/napravleniya/barre-fitnes/'},
	{label: 'Бачата', href: '/napravleniya/bachata/'},
	{label: 'Индивидуальные занятия', href: '/napravleniya/individualnye-zanyatiya-dlya-vzroslyh/'}
];

const family: TNavLink[] = [
	{label: 'Семейная школа', href: '/napravleniya/semejnaya-shkola/'},
	{label: 'Продлёнка', href: '/napravleniya/prodlenka/'}
];

const studios: TNavLink[] = [
	{label: 'Мичуринский проспект, 56', href: '/studii/michurinskiy-prospekt/'},
	{label: 'Богданова, 19 (Солнцево)', href: '/studii/solntsevo/'},
	{label: 'Нежинская, 11 (Славянский бульвар)', href: '/studii/slavyanskiy-bulvar/'},
	{label: 'Профсоюзная, 61', href: '/studii/profsoyuznaya/'}
];

const about: TNavLink[] = [
	{label: 'О нас', href: '/o-nas/'},
	{label: 'Педагоги', href: '/komanda/'},
	{label: 'Отзывы', href: '/otzyvy/'},
	{label: 'Новости', href: '/novosti/'},
	{label: 'Фестивали', href: '/festivali/'},
	{label: 'Праздники и события', href: '/sobytiya/'}
];

const allDirections: TNavLink = {label: 'Все направления', href: '/napravleniya/'};

export const mainNav: TNavItem[] = [
	{
		label: 'Направления',
		href: '/napravleniya/',
		columns: [
			{title: 'Детям', links: kids},
			{title: 'Взрослым', links: adults},
			{title: 'Семья', links: family}
		],
		allLink: allDirections
	},
	{label: 'Студии', href: '/studii/', children: studios},
	{label: 'Расписание', href: '/raspisanie/'},
	{label: 'Цены', href: '/tarify/'},
	{label: 'О центре', href: '/o-nas/', children: about}
];

export const footerNav: TFooterColumn[] = [
	{title: 'Направления', links: [...kids.slice(0, 8), allDirections]},
	{title: 'Студии', links: studios},
	{
		title: 'О центре',
		links: [...about, {label: 'Расписание', href: '/raspisanie/'}, {label: 'Цены', href: '/tarify/'}]
	},
	{
		title: 'Документы',
		legal: true,
		links: [
			{label: 'Абонентский договор', href: '/docs/abonentskij-dogovor.pdf'},
			{label: 'Правила поведения', href: '/docs/pravila-povedeniya.pdf'},
			{label: 'Политика обработки персональных данных', href: '/docs/politika-personalnyh-dannyh.pdf'},
			{label: 'Политика конфиденциальности', href: '/politika-konfidencialnosti/'}
		]
	}
];

/** Top-level sections shown on the 404 page. */
export const sectionLinks: TNavLink[] = [
	allDirections,
	{label: 'Студии', href: '/studii/'},
	{label: 'Расписание', href: '/raspisanie/'},
	{label: 'Цены', href: '/tarify/'},
	{label: 'Педагоги', href: '/komanda/'},
	{label: 'Отзывы', href: '/otzyvy/'},
	{label: 'Новости', href: '/novosti/'}
];
