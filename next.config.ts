import {redirects} from './src/content/redirects';

import type {NextConfig} from 'next';

const securityHeaders = [
	{key: 'X-Content-Type-Options', value: 'nosniff'},
	{key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
	{key: 'X-Frame-Options', value: 'SAMEORIGIN'},
	{key: 'Content-Security-Policy', value: "frame-ancestors 'self'"},
	{key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'}
];

const nextConfig: NextConfig = {
	trailingSlash: true,
	poweredByHeader: false,
	reactStrictMode: true,
	images: {
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
		imageSizes: [64, 128, 256, 384],
		minimumCacheTTL: 60 * 60 * 24 * 30,
		remotePatterns: [
			{protocol: 'https', hostname: 'personamodel.ru'},
			{protocol: 'https', hostname: 'www.personamodel.ru'}
		]
	},
	async redirects() {
		// Static import on purpose: if src/content/redirects.ts cannot be loaded, the build/dev server must fail loudly
		// instead of silently shipping a site without the old-URL redirects.
		if (redirects.length === 0) {
			throw new Error('src/content/redirects.ts exported no redirects; refusing to start without them.');
		}
		return redirects.map(({source, destination, permanent}) => ({source, destination, permanent}));
	},
	async headers() {
		return [
			{source: '/:path*', headers: securityHeaders},
			{
				source: '/media/:path*',
				headers: [{key: 'Cache-Control', value: 'public, max-age=31536000, immutable'}]
			}
		];
	}
};

export default nextConfig;
