'use client';

import {Button} from '@/components/ui/Button';
import {ButtonLink} from '@/components/ui/ButtonLink';
import {Container} from '@/components/ui/Container';
import {Heading} from '@/components/ui/Heading';

import type {ReactNode} from 'react';

type TErrorProps = {
	error: Error & {digest?: string};
	reset: () => void;
};

export default function ErrorPage({reset}: TErrorProps): ReactNode {
	return (
		<Container className={'py-section-lg text-center'}>
			<Heading level={1}>{'Что-то пошло не так'}</Heading>
			<p className={'mx-auto mt-4 max-w-xl text-lg'}>
				{'Произошла непредвиденная ошибка. Попробуйте обновить страницу или вернитесь на главную.'}
			</p>
			<div className={'mt-8 flex flex-wrap justify-center gap-3'}>
				<Button size={'lg'} onClick={reset}>
					{'Попробовать снова'}
				</Button>
				<ButtonLink href={'/'} variant={'secondary'} size={'lg'}>
					{'На главную'}
				</ButtonLink>
			</div>
		</Container>
	);
}
