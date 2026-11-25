import {migrations} from '@/migrations';

import type {Payload} from 'payload';

const hint = 'Run `bun run migrate` (fresh clone or after pulling schema changes) and try again.';

type TRow = {name: unknown};

/**
 * Fails fast, with an actionable message, when the database is not fully migrated. Schema is created only by migrations
 * (`push: false`), so an un-migrated database would otherwise surface as an opaque "no such table" error.
 */
export async function assertMigrated(payload: Payload): Promise<void> {
	const client = (payload.db as unknown as {client: {execute: (sql: string) => Promise<{rows: TRow[]}>}}).client;
	let applied: Set<string>;
	try {
		const result = await client.execute('SELECT name FROM payload_migrations');
		applied = new Set(result.rows.map((row) => String(row.name)));
	} catch {
		throw new Error(`The database has no schema. ${hint}`);
	}
	if (applied.has('dev')) {
		throw new Error(
			'The database carries a leftover "dev" migration marker (it was touched by an older dev-mode schema push). ' +
				'See "Recovering a database with a dev marker" in docs/admin-panel.md.'
		);
	}
	const pending = migrations.map((migration) => migration.name).filter((name) => !applied.has(name));
	if (pending.length > 0) {
		throw new Error(`The database has pending migrations: ${pending.join(', ')}. ${hint}`);
	}
}
