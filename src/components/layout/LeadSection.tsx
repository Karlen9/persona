import {LeadForm} from '@/components/integrations/LeadForm';
import {Container} from '@/components/ui/Container';
import {Heading} from '@/components/ui/Heading';
import {Icon} from '@/components/ui/Icon';
import {getSite} from '@/lib/cms';
import {getSiteInfo} from '@/lib/siteInfo';

import type {ReactNode} from 'react';

const perks = [
	'Бесплатная консультация и пробное занятие',
	'Подберём направление и удобную студию',
	'Ответим в течение рабочего дня'
];

/** The single lead-form section of every page. All «Записаться» buttons link to #zapis. */
export async function LeadSection(): Promise<ReactNode> {
	const [site, info] = await Promise.all([getSite(), getSiteInfo()]);
	const phone = info.phones[0];
	return (
		<section id={'zapis'} aria-labelledby={'zapis-title'} className={'py-section md:py-section-lg'}>
			<Container>
				<div className={'grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14'}>
					<div>
						<Heading id={'zapis-title'} level={2} size={'xl'}>
							{'Запишитесь на бесплатную консультацию'}
						</Heading>
						<ul className={'mt-6 flex flex-col gap-3'}>
							{perks.map((perk) => (
								<li key={perk} className={'flex items-start gap-3'}>
									<span
										className={
											'mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-800'
										}
									>
										<Icon name={'check'} size={14} />
									</span>
									{perk}
								</li>
							))}
						</ul>
						<p className={'mt-8'}>
							{'Или позвоните: '}
							<a
								href={phone.href}
								className={'font-extrabold whitespace-nowrap text-ink hover:text-brand-800'}
							>
								{phone.label}
							</a>
						</p>
					</div>
					<div className={'rounded-card border border-line bg-white p-5 shadow-card sm:p-8'}>
						<LeadForm
							widgetId={site.moyklass.lead.widgetId}
							mountId={site.moyklass.lead.mountId}
							contacts={info}
						/>
					</div>
				</div>
			</Container>
		</section>
	);
}
