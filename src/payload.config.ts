import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {sqliteAdapter} from '@payloadcms/db-sqlite';
import {en} from '@payloadcms/translations/languages/en';
import {ru} from '@payloadcms/translations/languages/ru';
import {buildConfig} from 'payload';
import sharp from 'sharp';

import {Directions} from '@/cms/collections/Directions';
import {FaqItems} from '@/cms/collections/FaqItems';
import {Media} from '@/cms/collections/Media';
import {News} from '@/cms/collections/News';
import {Pages} from '@/cms/collections/Pages';
import {Reviews} from '@/cms/collections/Reviews';
import {Studios} from '@/cms/collections/Studios';
import {Teachers} from '@/cms/collections/Teachers';
import {Users} from '@/cms/collections/Users';
import {Cover} from '@/cms/globals/Cover';
import {DirectionsIndex} from '@/cms/globals/DirectionsIndex';
import {DirectionTemplate} from '@/cms/globals/DirectionTemplate';
import {Home} from '@/cms/globals/Home';
import {HomeFaq} from '@/cms/globals/HomeFaq';
import {Navigation} from '@/cms/globals/Navigation';
import {NewsPage} from '@/cms/globals/NewsPage';
import {ReviewsPage} from '@/cms/globals/ReviewsPage';
import {SchedulePage} from '@/cms/globals/SchedulePage';
import {SiteSettings} from '@/cms/globals/SiteSettings';
import {Tariffs} from '@/cms/globals/Tariffs';
import {TeamPage} from '@/cms/globals/TeamPage';
import {withCollectionRevalidation, withGlobalRevalidation} from '@/cms/hooks/revalidate';
import {migrations} from '@/migrations';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const secret = process.env.PAYLOAD_SECRET;
if (!secret) {
	throw new Error('PAYLOAD_SECRET is not set. Copy .env.example to .env and set a long random value.');
}

const databaseURI = process.env.DATABASE_URI ?? 'file:./data/payload.db';

// SQLite does not create missing parent directories.
if (databaseURI.startsWith('file:')) {
	fs.mkdirSync(path.dirname(path.resolve(process.cwd(), databaseURI.slice('file:'.length))), {recursive: true});
}

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';

export default buildConfig({
	secret,
	serverURL,
	csrf: [serverURL],
	cors: [serverURL],
	routes: {admin: '/upravlenie'},
	graphQL: {disable: true},
	admin: {
		user: Users.slug,
		meta: {titleSuffix: ' — PersOna'},
		importMap: {baseDir: dirname}
	},
	i18n: {supportedLanguages: {ru, en}, fallbackLanguage: 'ru'},
	collections: [
		...[Directions, Studios, Teachers, FaqItems, Reviews, News, Pages, Media].map(withCollectionRevalidation),
		Users
	],
	globals: [
		SiteSettings,
		Navigation,
		DirectionTemplate,
		Home,
		HomeFaq,
		Tariffs,
		DirectionsIndex,
		TeamPage,
		ReviewsPage,
		NewsPage,
		SchedulePage,
		Cover
	].map(withGlobalRevalidation),
	db: sqliteAdapter({
		client: {url: databaseURI},
		// Migrations are the only source of schema in every environment (`bun run migrate`); never push in dev, since
		// a dev push marks the database and makes `build`/`start` ask an interactive question.
		push: false,
		prodMigrations: migrations
	}),
	sharp,
	typescript: {outputFile: path.resolve(dirname, 'payload-types.ts')}
});
