import '@payloadcms/next/css';

import {handleServerFunctions, RootLayout} from '@payloadcms/next/layouts';

import config from '@payload-config';

import {importMap} from './upravlenie/importMap.js';
import './custom.scss';

import type {ReactNode} from 'react';
import type {ServerFunctionClient} from 'payload';

type TLayoutProps = {
	children: ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
	'use server';
	return handleServerFunctions({...args, config, importMap});
};

export default function Layout({children}: TLayoutProps): ReactNode {
	return (
		<RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
			{children}
		</RootLayout>
	);
}
