import Link from 'next/link';

import {resolveHref} from '@/lib/links';

import type {AnchorHTMLAttributes, ReactNode} from 'react';

type TSmartLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
	href: string;
	children?: ReactNode;
};

/**
 * One link component for content hrefs: internal paths use next/link; `#`, tel: and mailto: use a plain anchor;
 * external URLs and local files (PDF) open in a new tab with `rel="noopener noreferrer"`.
 * Old-site absolute links are rewritten to their new internal path (see `resolveHref`).
 */
export function SmartLink({href, children, ...rest}: TSmartLinkProps): ReactNode {
	const resolved = resolveHref(href);
	if (resolved.kind === 'internal') {
		return (
			<Link href={resolved.href} {...rest}>
				{children}
			</Link>
		);
	}
	if (resolved.kind === 'external' || resolved.kind === 'file') {
		return (
			<a href={resolved.href} target={'_blank'} rel={'noopener noreferrer'} {...rest}>
				{children}
			</a>
		);
	}
	return (
		<a href={resolved.href} {...rest}>
			{children}
		</a>
	);
}
