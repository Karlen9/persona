import {SectionFrame} from '@/components/cover/SectionFrame';

import type {ReactNode} from 'react';

type TSectionLayoutProps = {
	children: ReactNode;
};

export default function SectionLayout({children}: TSectionLayoutProps): ReactNode {
	return <SectionFrame entryId={'studii'}>{children}</SectionFrame>;
}
