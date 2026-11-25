import Link from 'next/link';

import {PageHero} from '@/components/blocks/PageHero';
import {ContactFallback} from '@/components/integrations/ContactFallback';
import {ScheduleWidget} from '@/components/integrations/ScheduleWidget';
import {ScheduleCalendar} from '@/components/schedule/ScheduleCalendar';
import {Icon} from '@/components/ui/Icon';
import {Section} from '@/components/ui/Section';
import {schedulePage, studios} from '@/content';
import {getSchedule} from '@/lib/moyklass/schedule';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export const metadata: Metadata = buildMetadata({seo: schedulePage.seo, path: schedulePage.path});

export const revalidate = 600;

export default async function SchedulePage(): Promise<ReactNode> {
	const schedule = await getSchedule();

	return (
		<>
			<PageHero breadcrumbs={[{label: schedulePage.h1}]} title={schedulePage.h1} />

			<Section className={'pt-0 md:pt-0'}>
				{schedule ? <ScheduleCalendar schedule={schedule} /> : <ScheduleWidget />}
			</Section>

			<Section variant={'tinted'} title={'Не нашли подходящее время?'}>
				<div className={'grid gap-8 lg:grid-cols-2'}>
					<ContactFallback message={'Позвоните или напишите нам — подберём группу и удобную студию.'} />
					<div>
						<h3 className={'text-lg font-extrabold text-ink'}>{'Студии'}</h3>
						<ul className={'mt-3 flex flex-col'}>
							{studios.map((studio) => (
								<li key={studio.slug}>
									<Link
										href={studio.path}
										className={
											'flex min-h-11 items-center gap-2 font-semibold text-ink hover:text-brand-800'
										}
									>
										<Icon name={'map-pin'} size={16} className={'shrink-0 text-brand-700'} />
										{studio.shortName}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</Section>
		</>
	);
}
