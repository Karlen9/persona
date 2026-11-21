'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useId, useRef, useState} from 'react';

import {ButtonLink} from '@/components/ui/ButtonLink';
import {Button} from '@/components/ui/Button';
import {Section} from '@/components/ui/Section';
import {cn} from '@/lib/cn';
import {LEAD_ANCHOR} from '@/lib/site';

import type {ReactNode} from 'react';
import type {TClassPickerData, TClassPickerDirection} from '@/content/classPicker';

type TClassPickerProps = TClassPickerData & {
	/** Anchor of the section. */
	id?: string;
};

const ALL = 'all';

const pillClasses =
	'inline-flex min-h-11 cursor-pointer items-center rounded-pill border border-line bg-white px-5 py-2 font-bold text-ink transition-colors duration-150 motion-reduce:transition-none hover:border-brand-400 has-[:checked]:border-brand has-[:checked]:bg-brand has-[:checked]:text-brand-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-700';

function pluralize(count: number): string {
	const mod10 = count % 10;
	const mod100 = count % 100;
	if (mod10 === 1 && mod100 !== 11) return 'направление';
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'направления';
	return 'направлений';
}

function statusText(count: number): string {
	if (count === 0) return 'Направлений не найдено';
	const verb = count % 10 === 1 && count % 100 !== 11 ? 'Подходит' : 'Подходят';
	return `${verb} ${count} ${pluralize(count)}`;
}

function ResultCard({direction}: {direction: TClassPickerDirection}): ReactNode {
	const {path, shortTitle, excerpt, cardImage} = direction;
	return (
		<Link
			href={path}
			className={
				'group flex h-full items-stretch gap-4 rounded-card border border-line bg-white p-3 shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-pop motion-reduce:transition-none'
			}
		>
			{cardImage ? (
				<div className={'relative h-24 w-[72px] shrink-0 overflow-hidden rounded-btn bg-surface'}>
					<Image src={cardImage.src} alt={''} fill sizes={'72px'} className={'object-cover'} />
				</div>
			) : null}
			<div className={'flex min-w-0 flex-col justify-center gap-1'}>
				<h3 className={'text-lg leading-snug font-extrabold text-ink group-hover:text-brand-800'}>
					{shortTitle}
				</h3>
				<p className={'line-clamp-2 text-[15px]'}>{excerpt}</p>
			</div>
		</Link>
	);
}

export function ClassPicker({audiences, id = 'podobrat'}: TClassPickerProps): ReactNode {
	const uid = useId();
	const [audienceId, setAudienceId] = useState<string | null>(null);
	const [interestId, setInterestId] = useState<string | null>(null);
	const firstRadioRef = useRef<HTMLInputElement>(null);

	const audience = audiences.find((item) => item.id === audienceId) ?? null;
	const results =
		audience && interestId
			? interestId === ALL
				? audience.interests.flatMap((interest) => interest.directions)
				: (audience.interests.find((interest) => interest.id === interestId)?.directions ?? [])
			: null;

	function reset(): void {
		setAudienceId(null);
		setInterestId(null);
		firstRadioRef.current?.focus();
	}

	return (
		<Section id={id} title={'Подберём занятие'} lead={'Ответьте на два вопроса — покажем подходящие направления'}>
			<div className={'flex flex-col gap-8'}>
				<fieldset className={'flex flex-col gap-3'}>
					<legend className={'mb-3 text-xl font-extrabold text-ink'}>{'Для кого?'}</legend>
					<div className={'flex flex-wrap gap-3'}>
						{audiences.map((item, index) => (
							<label key={item.id} className={pillClasses}>
								<input
									ref={index === 0 ? firstRadioRef : undefined}
									type={'radio'}
									name={`${uid}-audience`}
									value={item.id}
									checked={audienceId === item.id}
									onChange={() => {
										setAudienceId(item.id);
										setInterestId(null);
									}}
									className={'sr-only'}
								/>
								{item.label}
							</label>
						))}
					</div>
				</fieldset>

				{audience ? (
					<fieldset key={audience.id} className={'flex flex-col gap-3'}>
						<legend className={'mb-3 text-xl font-extrabold text-ink'}>{'Что интересно?'}</legend>
						<div className={'flex flex-wrap gap-3'}>
							{[...audience.interests, {id: ALL, label: 'Покажите всё'}].map((item) => (
								<label key={item.id} className={pillClasses}>
									<input
										type={'radio'}
										name={`${uid}-interest`}
										value={item.id}
										checked={interestId === item.id}
										onChange={() => setInterestId(item.id)}
										className={'sr-only'}
									/>
									{item.label}
								</label>
							))}
						</div>
					</fieldset>
				) : null}

				<div aria-live={'polite'} className={cn(!results && 'sr-only')}>
					{results ? <p className={'text-lg font-bold text-ink'}>{statusText(results.length)}</p> : null}
				</div>

				{audience && results ? (
					<div className={'flex flex-col gap-6'}>
						<ul className={'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'}>
							{results.map((direction) => (
								<li key={direction.slug}>
									<ResultCard direction={direction} />
								</li>
							))}
						</ul>
						<Link
							href={audience.overview.href}
							className={'self-start font-bold text-brand-800 underline-offset-4 hover:underline'}
						>
							{audience.overview.label}
						</Link>
						<div className={'flex flex-wrap gap-3'}>
							<ButtonLink href={LEAD_ANCHOR}>{'Записаться на бесплатную консультацию'}</ButtonLink>
							<Button type={'button'} variant={'ghost'} onClick={reset}>
								{'Начать заново'}
							</Button>
						</div>
					</div>
				) : null}
			</div>
		</Section>
	);
}
