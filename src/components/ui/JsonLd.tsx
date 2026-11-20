import type {ReactNode} from 'react';

type TJsonLdProps = {
	data: Record<string, unknown>;
};

export function JsonLd({data}: TJsonLdProps): ReactNode {
	return (
		<script
			type={'application/ld+json'}
			dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g, '\\u003c')}}
		/>
	);
}
