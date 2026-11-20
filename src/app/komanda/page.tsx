import {PageHero} from '@/components/blocks/PageHero';
import {TeacherCard} from '@/components/blocks/TeacherCard';
import {RichText} from '@/components/ui/RichText';
import {Section} from '@/components/ui/Section';
import {teachers, teamPage} from '@/content';
import {buildMetadata} from '@/lib/seo';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';
import type {TTeacher} from '@/content';

export const metadata: Metadata = buildMetadata({seo: teamPage.seo, path: teamPage.path});

function TeacherGrid({items}: {items: TTeacher[]}): ReactNode {
	return (
		<ul className={'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'}>
			{items.map((teacher) => (
				<li key={teacher.id}>
					<TeacherCard
						name={teacher.name}
						role={teacher.role}
						photo={teacher.cardPhoto}
						dialogPhoto={teacher.photo}
						bio={<RichText blocks={teacher.bio} />}
					/>
				</li>
			))}
		</ul>
	);
}

export default function TeamPage(): ReactNode {
	const sorted = [...teachers].sort((a, b) => a.order - b.order);
	const management = sorted.filter((teacher) => teacher.isManagement);
	const staff = sorted.filter((teacher) => !teacher.isManagement);

	return (
		<>
			<PageHero breadcrumbs={[{label: teamPage.h1}]} title={teamPage.h1} cta={null} />
			{management.length > 0 ? (
				<Section title={'Руководство'} className={'pt-0 md:pt-0'}>
					<TeacherGrid items={management} />
				</Section>
			) : null}
			<Section title={'Педагоги'} variant={'tinted'}>
				<TeacherGrid items={staff} />
			</Section>
		</>
	);
}
