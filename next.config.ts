import {withPayload} from '@payloadcms/next/withPayload';

import {redirects} from './src/content/redirects';

import type {NextConfig} from 'next';

const securityHeaders = [
	{key: 'X-Content-Type-Options', value: 'nosniff'},
	{key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
	{key: 'X-Frame-Options', value: 'SAMEORIGIN'},
	{key: 'Content-Security-Policy', value: "frame-ancestors 'self'"},
	{key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'}
];

const noIndexHeaders = [{key: 'X-Robots-Tag', value: 'noindex, nofollow'}];

const nextConfig: NextConfig = {
	// Lets phones / tunnels (ngrok, LAN IP) load dev resources so the dev site hydrates there.
	allowedDevOrigins: ['*.ngrok-free.app', '*.ngrok-free.dev', '*.ngrok.app', '*.ngrok.io', '192.168.*.*'],
	// `next dev` otherwise generates an untracked AGENTS.md at the repo root when it detects an AI coding agent.
	agentRules: false,
	experimental: {globalNotFound: true},
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
			{source: '/upravlenie/:path*', headers: noIndexHeaders},
			{source: '/api/:path*', headers: noIndexHeaders},
			// Uploaded files. An editor can replace a file (Payload may keep the same URL), so no `immutable`: cache for a
			// day and let shared caches revalidate in the background. Only Cache-Control is set here; the noindex header
			// above still applies, and other /api routes keep Payload's own headers.
			{
				source: '/api/media/file/:path*',
				headers: [{key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800'}]
			},
			{
				source: '/media/:path*',
				headers: [{key: 'Cache-Control', value: 'public, max-age=31536000, immutable'}]
			}
		];
	}
};

const configWithPayload = withPayload(nextConfig);
const headersWithPayload = configWithPayload.headers;

// withPayload adds client-hint headers (Accept-CH / Critical-CH) to every route; they only matter for the admin theme.
configWithPayload.headers = async () => {
	const rules = (await headersWithPayload?.()) ?? [];
	return rules.map((rule) =>
		rule.headers.some((header) => header.key === 'Accept-CH') ? {...rule, source: '/upravlenie/:path*'} : rule
	);
};

export default configWithPayload;
