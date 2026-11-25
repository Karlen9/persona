# PersOna

A rebuild of personamodel.ru: a Russian-language site for a Moscow children's creative centre and model agency (since 2002), with classes for kids and adults, "Mini Miss & Mister" festivals and a family school.

## Theme

- **Mood:** calm, friendly, premium-feeling; clean, airy layouts on light backgrounds.
- **Colours:** soft teal/mint brand (`#effaf7` to `#063f3a`, main `#5dbaa8`) with a gentle pink accent (`#f7b2c4`); dark slate ink (`#101828`) and muted slate body text (`#475569`).
- **Typography:** Manrope.

## Admin panel

Content is edited in an embedded Payload CMS admin at `/upravlenie/` (SQLite in `data/`). Quick start:

```bash
cp .env.example .env     # set PAYLOAD_SECRET (openssl rand -hex 32)
bun install
bun run migrate          # create the database schema (migrations are the only source of schema)
bun run seed             # import src/content + public images into the CMS
bun run dev              # open /upravlenie/create-first-user to create the first admin
```

`src/content/` is the seed source and the canonical type definitions; the site reads published content from the CMS.
Full guide (roles, rich-text syntax, migrations, deployment, backups, security): [docs/admin-panel.md](docs/admin-panel.md).
