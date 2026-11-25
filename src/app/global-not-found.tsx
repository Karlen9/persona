import './(site)/globals.css';

import {SiteDocument} from '@/components/layout/SiteDocument';

import NotFound from './(site)/not-found';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export const metadata: Metadata = {title: 'Страница не найдена — PersOna'};

export default function GlobalNotFound(): ReactNode {
	return (
		<SiteDocument>
			<NotFound />
		</SiteDocument>
	);
}
