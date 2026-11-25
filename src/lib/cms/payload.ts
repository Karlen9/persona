import 'server-only';

import {getPayload as getPayloadInstance} from 'payload';

import config from '@payload-config';
import {assertMigrated} from '@/lib/cms/assertMigrated';

import type {Payload} from 'payload';

let instance: Promise<Payload> | undefined;

/** Payload's own `getPayload` caches per config; keeping the promise avoids re-resolving the config on every call. */
export function getPayloadClient(): Promise<Payload> {
	instance ??= getPayloadInstance({config})
		.then(async (payload) => {
			await assertMigrated(payload);
			return payload;
		})
		.catch((error: unknown) => {
			// Do not cache a failure (e.g. pending migrations): once the database is fixed the next call works again.
			instance = undefined;
			throw error;
		});
	return instance;
}
