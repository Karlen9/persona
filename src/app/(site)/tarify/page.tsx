import {PageHero} from '@/components/blocks/PageHero';
import {PriceGroupTable} from '@/components/blocks/PriceGroupTable';
import {ButtonLink} from '@/components/ui/ButtonLink';
import {Card} from '@/components/ui/Card';
import {Heading} from '@/components/ui/Heading';
import {Icon} from '@/components/ui/Icon';
import {Section} from '@/components/ui/Section';
import {SmartLink} from '@/components/ui/SmartLink';
import {getSite, getTariffsPage} from '@/lib/cms';
import {formatBytes, formatPrice} from '@/lib/format';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export async function generateMetadata(): Promise<Metadata> {
	const tariffsPage = await getTariffsPage();
	return buildMetadata({seo: tariffsPage.seo, path: tariffsPage.path});
}

export default async function TariffsPage(): Promise<ReactNode> {
	const [site, tariffsPage] = await Promise.all([getSite(), getTariffsPage()]);
	const {priceList, discounts, freePayment} = tariffsPage;

	return (
		<>
			<PageHero
				breadcrumbs={[{label: tariffsPage.h1}]}
				eyebrow={priceList.title}
				title={tariffsPage.h1}
				lead={priceList.approvedBy}
			/>

			<Section className={'pt-0 md:pt-0'}>
				<Card
					className={
						'flex flex-col gap-2 border-brand-200 bg-brand-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8'
					}
				>
					<p className={'max-w-2xl text-lg font-extrabold text-ink'}>{priceList.trialLesson.label}</p>
					<p className={'text-3xl font-extrabold whitespace-nowrap text-brand-800'}>
						{formatPrice(priceList.trialLesson.priceRub)}
					</p>
				</Card>

				<div className={'mt-8 flex flex-col gap-8'}>
					{priceList.groups.map((group) => (
						<PriceGroupTable key={group.id} group={group} linkRows />
					))}
				</div>

				{priceList.notes.length > 0 ? (
					<ul className={'mt-6 flex flex-col gap-2 text-[15px]'}>
						{priceList.notes.map((note) => (
							<li key={note}>{note}</li>
						))}
					</ul>
				) : null}

				<p className={'mt-6'}>
					<SmartLink
						href={priceList.image.src}
						className={'inline-flex min-h-11 items-center gap-2 font-bold text-brand-800 hover:underline'}
					>
						{'Открыть прайс-лист изображением'}
						<Icon name={'external'} size={16} />
					</SmartLink>
				</p>
			</Section>

			<Section variant={'tinted'} title={'Скидки'}>
				<ul className={'grid gap-4 md:grid-cols-3'}>
					{discounts.map((discount) => (
						<li key={discount.id}>
							<Card className={'flex h-full flex-col gap-3 p-6'}>
								<span
									className={'text-4xl font-extrabold text-brand-800'}
								>{`${discount.percent}%`}</span>
								<p className={'text-[15px]'}>{discount.text}</p>
							</Card>
						</li>
					))}
				</ul>
			</Section>

			<Section>
				<Card className={'flex flex-col items-start gap-4 p-6 sm:p-8'}>
					<Heading level={2}>{freePayment.heading}</Heading>
					<p className={'max-w-2xl'}>{freePayment.text}</p>
					<ButtonLink href={freePayment.button.href} size={'lg'}>
						{freePayment.button.label}
					</ButtonLink>
				</Card>
			</Section>

			<Section variant={'tinted'} title={'Документы'}>
				<ul className={'flex max-w-3xl flex-col gap-3'}>
					{site.documents.map((document) => {
						const size = formatBytes(document.sizeBytes);
						return (
							<li key={document.id}>
								<SmartLink
									href={document.href}
									className={
										'flex min-h-14 items-center justify-between gap-4 rounded-card border border-line bg-white px-5 py-3 shadow-card transition-colors hover:border-brand-400'
									}
								>
									<span className={'font-bold text-ink'}>{document.title}</span>
									<span
										className={
											'inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-800'
										}
									>
										{`PDF${size ? `, ${size}` : ''}`}
										<Icon name={'external'} size={16} />
									</span>
								</SmartLink>
							</li>
						);
					})}
				</ul>
			</Section>
		</>
	);
}
