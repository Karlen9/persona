import {generatePageMetadata, RootPage} from '@payloadcms/next/views';

import config from '@payload-config';

import {importMap} from '../importMap.js';

import type {ReactNode} from 'react';
import type {Metadata} from 'next';

type TArgs = {
	params: Promise<{segments: string[]}>;
	searchParams: Promise<{[key: string]: string | string[]}>;
};

export const generateMetadata = ({params, searchParams}: TArgs): Promise<Metadata> =>
	generatePageMetadata({config, params, searchParams});

export default function Page({params, searchParams}: TArgs): Promise<ReactNode> {
	return RootPage({config, params, searchParams, importMap});
}
