# Admin panel

The site content is edited in a [Payload CMS 3](https://payloadcms.com) admin panel embedded in this Next.js app. Data lives in a
SQLite file; uploads live in a directory on disk. There is no separate backend service.

## Access

- Admin UI: `/upravlenie/` (Russian by default, English available in the profile settings).
- REST API: `/api/...` (GraphQL is disabled). Both are served with `X-Robots-Tag: noindex, nofollow` and listed in `robots.txt`.
- Sessions use an HTTP-only cookie (`SameSite=Lax`, `Secure` in production) that expires after 8 hours.

### First user

On a fresh database open `/upravlenie/create-first-user`. The first account is always created with the `admin` role.
Alternatively set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` and run `bun run seed`; the admin is created only if no
user exists yet. Never commit credentials.

### Roles

| Role     | Can do                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------- |
| `admin`  | Everything, including creating/deleting users and changing roles.                               |
| `editor` | Edit all content, upload media, edit their own profile. Cannot see the Users list or change roles. |

Five failed logins lock an account for 15 minutes.

## What is editable where

Group «Контент» (collections):

| Section               | Controls                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------- |
| Направления           | Direction pages (`/napravleniya/<slug>/`): hero, sections, programme, videos, SEO, card image |
| Студии                | Studio pages (`/studii/<slug>/`): address, phones, metro, map, photos, SEO                   |
| Педагоги              | Team page cards and bios; each teacher is linked to directions                               |
| Частые вопросы        | FAQ items shown on the About page (order = display order)                                    |
| Отзывы / Новости      | Reviews and news posts (empty at launch; the pages hide empty lists)                         |
| Медиа                 | Uploaded images and PDFs. `alt` is required                                                  |

Group «Страницы»: the text pages (About, Events, Festivals, Privacy) and the globals with the copy of the Home/cover,
Tariffs (the full price list), Directions index, Team, Reviews, News and Schedule pages.

Group «Настройки»: site settings (name, contacts, phones, socials, documents, Moyklass and Metrika ids, cookie banner),
navigation (main menu, footer columns, section links) and the shared direction-page template.

Collections and globals have drafts and versions (50 per document): «Сохранить черновик» keeps the public page unchanged,
«Опубликовать» makes the change live. Edit screens of public pages have a «Предпросмотр» button that opens the public page
in a new tab (it always shows the **published** content).

## Rich text

Text fields that allow formatting store a small markdown subset:

| Write                    | Result                |
| ------------------------ | --------------------- |
| `**bold**`               | bold                  |
| `*italic*`               | italic                |
| `***both***`             | bold italic           |
| `[label](/tarify/)`      | link (internal or full URL) |

To show a literal `* [ ] ( ) \` put a backslash before it (`\*`). Links may be wrapped in bold or italic.
Everything else (paragraph, heading, list, card) is a block type chosen in the editor.

## How the site reads content

`src/lib/cms/` exposes async getters (`getDirections()`, `getSite()`, ...) that read **published** documents through the
Payload Local API and map them to the shapes in `src/content/types.ts`. Server components call them directly; client
components (menus, search, lead form, widgets) receive the data as props from their server parents.
`src/content/` is kept as the **seed source** and the canonical type definitions.

Pages are statically generated. Every create/update/delete in the admin (collections, globals, media) calls
`revalidatePath('/', 'layout')`, so the next request regenerates the pages. Scripts that run outside Next (`bun run seed`,
`bun run check:cms`) skip revalidation. New direction/studio slugs are rendered on demand (`dynamicParams`).

## Environment variables

See `.env.example`.

| Variable                 | Purpose                                                                          |
| ------------------------ | -------------------------------------------------------------------------------- |
| `PAYLOAD_SECRET`         | **Required.** Long random string (`openssl rand -hex 32`). Changing it logs everyone out. |
| `DATABASE_URI`           | SQLite URL, default `file:./data/payload.db`.                                    |
| `PAYLOAD_MEDIA_DIR`      | Upload directory, default `./data/media`.                                        |
| `NEXT_PUBLIC_SERVER_URL` | Public origin (CSRF/CORS allow-list, preview links). Must match the real domain. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Optional first admin created by `bun run seed`.              |

## Commands

| Command                       | What it does                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| `bun run seed`                | Idempotent import of `src/content/` and `public/` images into the CMS.                |
| `bun run seed:reset`          | Deletes all content documents and media first, then seeds again. **Destroys edits.**  |
| `bun run check:cms`           | Compares every CMS getter with the static modules (expects 0 differences on a freshly seeded DB). |
| `bun run check:search`        | Search quality checks against the seeded CMS.                                         |
| `bun run generate:types`      | Regenerates `src/payload-types.ts` after a schema change.                             |
| `bun run generate:importmap`  | Regenerates `src/app/(payload)/upravlenie/importMap.js`.                              |
| `bun run payload migrate:create <name>` | Creates a migration after a schema change.                                  |
| `bun run migrate`             | Applies pending migrations (run it first on a fresh clone, and after pulling new migrations). |

## Migrations

Migrations in `src/migrations/` are the **only** source of database schema, in development and in production (the SQLite
adapter has `push: false`, so nothing is ever pushed to the database behind your back). Flow on a fresh clone:

```bash
bun run migrate     # create / update the schema
bun run seed        # import content
bun run dev         # or: bun run build && bun run start
```

`bun run seed`, `bun run check:cms`, `bun run check:search` and the app itself check the migration state when they open
the database and fail with a message (`Run bun run migrate`) if the schema is missing or migrations are pending. In
production (`NODE_ENV=production`, i.e. `next start`/`next build`) pending migrations are also applied automatically on
start (`prodMigrations`). Everything is non-interactive.

After changing a collection/global:

1. `bun run generate:types`
2. `bun run payload migrate:create <name>`, commit the generated files in `src/migrations/`.
3. `bun run migrate` to apply them locally. Pull a branch with new migrations? Run `bun run migrate` again.

### Recovering a database with a `dev` marker

Older versions of this project let `bun run dev` push the schema straight into the database. That writes a row
`name = dev, batch = -1` into the `payload_migrations` table, which makes Payload ask "data loss will occur... proceed? (y/N)"
on `bun run build` / `bun run start` (and hang in non-interactive environments). If your database has that row
(`sqlite3 data/payload.db "select * from payload_migrations"`):

1. Back it up: `sqlite3 data/payload.db ".backup data/payload.db.bak"`.
2. Make sure the schema equals the one produced by migrations: create a throwaway database with
   `DATABASE_URI=file:/tmp/fresh.db bun run migrate` and compare `sqlite3 <db> .schema` of both (normalise whitespace).
3. If they are equal, replace the marker with the row the initial migration writes:
   `sqlite3 data/payload.db "update payload_migrations set name='20261125_125408_initial', batch=1 where name='dev'"`
   (use the name of the first file in `src/migrations/`). Content and users are untouched.
4. If they differ, do not edit the table; export what you need and recreate the database with `bun run migrate` + `bun run seed`.

## Security notes

- Account lockout (5 attempts, 15 minutes), 8-hour tokens, `Secure`/`SameSite=Lax` cookies, CSRF allow-list.
- Files uploaded through the admin are served from `/api/media/file/*` with `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` (a day; an editor can replace a file). Static `/media/*` is `immutable` for a year.
- `/upravlenie/*` and `/api/*` send `X-Robots-Tag: noindex, nofollow`; robots.txt disallows them.
- Anonymous REST access: only published-media file reads are public. Collection/global reads, and the Users list, need a login.
- Recommended in front of the app: a reverse-proxy rate limit on `/api/users/login` and an IP allow-list (or VPN/basic auth)
  for `/upravlenie/`.
- Use strong, unique passwords; remove accounts of people who left.

## Limitations

- Redirects (including every `oldPaths` value shown in the admin) stay in code: `src/content/redirects.ts`. `oldPaths`,
  `wpId` and `path` fields are read-only migration data.
- Videos are still served from the old host (`src` URLs in the content); only their captions/posters are editable.
- `public/media` and `src/content/` are kept as the seed source. Re-running `bun run seed` overwrites CMS edits of the same documents
  with the static values; use it only on a fresh database or when you really want to reset.
- Code constants (audience/category labels, the lead anchor `#zapis`) are not editable in the admin.
- Editing the price list changes the trial-lesson price shown on the cover automatically (it is computed from the list).
