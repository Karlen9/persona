import {SmartLink} from './SmartLink';
import {buttonClasses} from './Button';

import type {AnchorHTMLAttributes, ReactNode} from 'react';
import type {TButtonSize, TButtonVariant} from './Button';

type TStyleProps = {
	variant?: TButtonVariant;
	size?: TButtonSize;
	className?: string;
};

type TButtonLinkProps = TStyleProps &
	Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'href'> & {href: string};

/** Internal paths use next/link; hash, tel:, mailto: use a plain anchor; external URLs and files open in a new tab. */
export function ButtonLink({variant, size, className, href, ...rest}: TButtonLinkProps): ReactNode {
	return <SmartLink href={href} className={buttonClasses({variant, size, className})} {...rest} />;
}
