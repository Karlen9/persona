import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`directions_highlight_bullets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_highlight_bullets_order_idx\` ON \`directions_highlight_bullets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`directions_highlight_bullets_parent_id_idx\` ON \`directions_highlight_bullets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`directions_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_blocks_paragraph_order_idx\` ON \`directions_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_paragraph_parent_id_idx\` ON \`directions_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_paragraph_path_idx\` ON \`directions_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`directions_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`level\` text DEFAULT '3',
  	\`icon\` text,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_blocks_heading_order_idx\` ON \`directions_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_heading_parent_id_idx\` ON \`directions_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_heading_path_idx\` ON \`directions_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`directions_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`directions_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_blocks_list_items_order_idx\` ON \`directions_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_list_items_parent_id_idx\` ON \`directions_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`directions_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`ordered\` integer DEFAULT false,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_blocks_list_order_idx\` ON \`directions_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_list_parent_id_idx\` ON \`directions_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_list_path_idx\` ON \`directions_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`directions_blocks_stat\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_blocks_stat_order_idx\` ON \`directions_blocks_stat\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_stat_parent_id_idx\` ON \`directions_blocks_stat\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_stat_path_idx\` ON \`directions_blocks_stat\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`directions_blocks_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`directions_blocks_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_blocks_cards_items_order_idx\` ON \`directions_blocks_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_cards_items_parent_id_idx\` ON \`directions_blocks_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_cards_items_image_idx\` ON \`directions_blocks_cards_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`directions_blocks_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_blocks_cards_order_idx\` ON \`directions_blocks_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_cards_parent_id_idx\` ON \`directions_blocks_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_cards_path_idx\` ON \`directions_blocks_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`directions_blocks_intro\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_blocks_intro_order_idx\` ON \`directions_blocks_intro\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_intro_parent_id_idx\` ON \`directions_blocks_intro\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_intro_path_idx\` ON \`directions_blocks_intro\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`directions_blocks_programme_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`directions_blocks_programme\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_blocks_programme_items_order_idx\` ON \`directions_blocks_programme_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_programme_items_parent_id_idx\` ON \`directions_blocks_programme_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_programme_items_image_idx\` ON \`directions_blocks_programme_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`directions_blocks_programme\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_blocks_programme_order_idx\` ON \`directions_blocks_programme\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_programme_parent_id_idx\` ON \`directions_blocks_programme\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_programme_path_idx\` ON \`directions_blocks_programme\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`directions_blocks_article\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_blocks_article_order_idx\` ON \`directions_blocks_article\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_article_parent_id_idx\` ON \`directions_blocks_article\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_article_path_idx\` ON \`directions_blocks_article\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`directions_blocks_how_classes_go_videos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`src\` text,
  	\`mime_type\` text,
  	\`size_bytes\` numeric,
  	\`poster_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`directions_blocks_how_classes_go\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_blocks_how_classes_go_videos_order_idx\` ON \`directions_blocks_how_classes_go_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_how_classes_go_videos_parent_id_idx\` ON \`directions_blocks_how_classes_go_videos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_how_classes_go_videos_poster_idx\` ON \`directions_blocks_how_classes_go_videos\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`directions_blocks_how_classes_go\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_blocks_how_classes_go_order_idx\` ON \`directions_blocks_how_classes_go\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_how_classes_go_parent_id_idx\` ON \`directions_blocks_how_classes_go\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_blocks_how_classes_go_path_idx\` ON \`directions_blocks_how_classes_go\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`directions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`short_title\` text,
  	\`audience\` text,
  	\`category\` text,
  	\`excerpt\` text,
  	\`tagline\` text,
  	\`card_image_id\` integer,
  	\`hero_heading\` text,
  	\`hero_subheading\` text,
  	\`hero_image_id\` integer,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_og_image_id\` integer,
  	\`slug\` text,
  	\`order\` numeric DEFAULT 1,
  	\`wp_id\` numeric,
  	\`last_modified\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`card_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_card_image_idx\` ON \`directions\` (\`card_image_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_hero_hero_image_idx\` ON \`directions\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_seo_seo_og_image_idx\` ON \`directions\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`directions_slug_idx\` ON \`directions\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`directions_updated_at_idx\` ON \`directions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`directions_created_at_idx\` ON \`directions\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`directions__status_idx\` ON \`directions\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`directions_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_texts_order_parent\` ON \`directions_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`directions_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`teachers_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`teachers_id\`) REFERENCES \`teachers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_rels_order_idx\` ON \`directions_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`directions_rels_parent_idx\` ON \`directions_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_rels_path_idx\` ON \`directions_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`directions_rels_teachers_id_idx\` ON \`directions_rels\` (\`teachers_id\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_version_highlight_bullets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_directions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_version_highlight_bullets_order_idx\` ON \`_directions_v_version_highlight_bullets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_version_highlight_bullets_parent_id_idx\` ON \`_directions_v_version_highlight_bullets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_directions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_paragraph_order_idx\` ON \`_directions_v_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_paragraph_parent_id_idx\` ON \`_directions_v_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_paragraph_path_idx\` ON \`_directions_v_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`level\` text DEFAULT '3',
  	\`icon\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_directions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_heading_order_idx\` ON \`_directions_v_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_heading_parent_id_idx\` ON \`_directions_v_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_heading_path_idx\` ON \`_directions_v_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_directions_v_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_list_items_order_idx\` ON \`_directions_v_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_list_items_parent_id_idx\` ON \`_directions_v_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`ordered\` integer DEFAULT false,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_directions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_list_order_idx\` ON \`_directions_v_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_list_parent_id_idx\` ON \`_directions_v_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_list_path_idx\` ON \`_directions_v_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_blocks_stat\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_directions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_stat_order_idx\` ON \`_directions_v_blocks_stat\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_stat_parent_id_idx\` ON \`_directions_v_blocks_stat\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_stat_path_idx\` ON \`_directions_v_blocks_stat\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_blocks_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_directions_v_blocks_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_cards_items_order_idx\` ON \`_directions_v_blocks_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_cards_items_parent_id_idx\` ON \`_directions_v_blocks_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_cards_items_image_idx\` ON \`_directions_v_blocks_cards_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_blocks_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_directions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_cards_order_idx\` ON \`_directions_v_blocks_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_cards_parent_id_idx\` ON \`_directions_v_blocks_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_cards_path_idx\` ON \`_directions_v_blocks_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_blocks_intro\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_directions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_intro_order_idx\` ON \`_directions_v_blocks_intro\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_intro_parent_id_idx\` ON \`_directions_v_blocks_intro\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_intro_path_idx\` ON \`_directions_v_blocks_intro\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_blocks_programme_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_directions_v_blocks_programme\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_programme_items_order_idx\` ON \`_directions_v_blocks_programme_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_programme_items_parent_id_idx\` ON \`_directions_v_blocks_programme_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_programme_items_image_idx\` ON \`_directions_v_blocks_programme_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_blocks_programme\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_directions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_programme_order_idx\` ON \`_directions_v_blocks_programme\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_programme_parent_id_idx\` ON \`_directions_v_blocks_programme\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_programme_path_idx\` ON \`_directions_v_blocks_programme\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_blocks_article\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_directions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_article_order_idx\` ON \`_directions_v_blocks_article\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_article_parent_id_idx\` ON \`_directions_v_blocks_article\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_article_path_idx\` ON \`_directions_v_blocks_article\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_blocks_how_classes_go_videos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`src\` text,
  	\`mime_type\` text,
  	\`size_bytes\` numeric,
  	\`poster_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_directions_v_blocks_how_classes_go\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_how_classes_go_videos_order_idx\` ON \`_directions_v_blocks_how_classes_go_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_how_classes_go_videos_parent_id_idx\` ON \`_directions_v_blocks_how_classes_go_videos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_how_classes_go_videos_poster_idx\` ON \`_directions_v_blocks_how_classes_go_videos\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_blocks_how_classes_go\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_directions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_how_classes_go_order_idx\` ON \`_directions_v_blocks_how_classes_go\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_how_classes_go_parent_id_idx\` ON \`_directions_v_blocks_how_classes_go\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_blocks_how_classes_go_path_idx\` ON \`_directions_v_blocks_how_classes_go\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_short_title\` text,
  	\`version_audience\` text,
  	\`version_category\` text,
  	\`version_excerpt\` text,
  	\`version_tagline\` text,
  	\`version_card_image_id\` integer,
  	\`version_hero_heading\` text,
  	\`version_hero_subheading\` text,
  	\`version_hero_image_id\` integer,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_og_image_id\` integer,
  	\`version_slug\` text,
  	\`version_order\` numeric DEFAULT 1,
  	\`version_wp_id\` numeric,
  	\`version_last_modified\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_card_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_parent_idx\` ON \`_directions_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_version_version_card_image_idx\` ON \`_directions_v\` (\`version_card_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_version_hero_version_hero_image_idx\` ON \`_directions_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_version_seo_version_seo_og_image_idx\` ON \`_directions_v\` (\`version_seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_version_version_slug_idx\` ON \`_directions_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_version_version_updated_at_idx\` ON \`_directions_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_version_version_created_at_idx\` ON \`_directions_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_version_version__status_idx\` ON \`_directions_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_created_at_idx\` ON \`_directions_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_updated_at_idx\` ON \`_directions_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_latest_idx\` ON \`_directions_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_directions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_texts_order_parent\` ON \`_directions_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_directions_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`teachers_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_directions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`teachers_id\`) REFERENCES \`teachers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_v_rels_order_idx\` ON \`_directions_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_rels_parent_idx\` ON \`_directions_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_rels_path_idx\` ON \`_directions_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_directions_v_rels_teachers_id_idx\` ON \`_directions_v_rels\` (\`teachers_id\`);`)
  await db.run(sql`CREATE TABLE \`studios\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`short_name\` text,
  	\`address\` text,
  	\`hours\` text,
  	\`email\` text,
  	\`map_link\` text,
  	\`map_embed_url\` text,
  	\`geo_lat\` numeric,
  	\`geo_lon\` numeric,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_og_image_id\` integer,
  	\`slug\` text,
  	\`order\` numeric DEFAULT 1,
  	\`wp_id\` numeric,
  	\`last_modified\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`studios_seo_seo_og_image_idx\` ON \`studios\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`studios_slug_idx\` ON \`studios\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`studios_updated_at_idx\` ON \`studios\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`studios_created_at_idx\` ON \`studios\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`studios__status_idx\` ON \`studios\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`studios_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`studios\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`studios_texts_order_parent\` ON \`studios_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`studios_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`studios\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`studios_rels_order_idx\` ON \`studios_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`studios_rels_parent_idx\` ON \`studios_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`studios_rels_path_idx\` ON \`studios_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`studios_rels_media_id_idx\` ON \`studios_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_studios_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_name\` text,
  	\`version_short_name\` text,
  	\`version_address\` text,
  	\`version_hours\` text,
  	\`version_email\` text,
  	\`version_map_link\` text,
  	\`version_map_embed_url\` text,
  	\`version_geo_lat\` numeric,
  	\`version_geo_lon\` numeric,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_og_image_id\` integer,
  	\`version_slug\` text,
  	\`version_order\` numeric DEFAULT 1,
  	\`version_wp_id\` numeric,
  	\`version_last_modified\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`studios\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_studios_v_parent_idx\` ON \`_studios_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_studios_v_version_seo_version_seo_og_image_idx\` ON \`_studios_v\` (\`version_seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_studios_v_version_version_slug_idx\` ON \`_studios_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_studios_v_version_version_updated_at_idx\` ON \`_studios_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_studios_v_version_version_created_at_idx\` ON \`_studios_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_studios_v_version_version__status_idx\` ON \`_studios_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_studios_v_created_at_idx\` ON \`_studios_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_studios_v_updated_at_idx\` ON \`_studios_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_studios_v_latest_idx\` ON \`_studios_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_studios_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_studios_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_studios_v_texts_order_parent\` ON \`_studios_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_studios_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_studios_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_studios_v_rels_order_idx\` ON \`_studios_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_studios_v_rels_parent_idx\` ON \`_studios_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_studios_v_rels_path_idx\` ON \`_studios_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_studios_v_rels_media_id_idx\` ON \`_studios_v_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`teachers_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`teachers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`teachers_blocks_paragraph_order_idx\` ON \`teachers_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`teachers_blocks_paragraph_parent_id_idx\` ON \`teachers_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`teachers_blocks_paragraph_path_idx\` ON \`teachers_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`teachers_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`level\` text DEFAULT '3',
  	\`icon\` text,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`teachers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`teachers_blocks_heading_order_idx\` ON \`teachers_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`teachers_blocks_heading_parent_id_idx\` ON \`teachers_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`teachers_blocks_heading_path_idx\` ON \`teachers_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`teachers_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`teachers_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`teachers_blocks_list_items_order_idx\` ON \`teachers_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`teachers_blocks_list_items_parent_id_idx\` ON \`teachers_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`teachers_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`ordered\` integer DEFAULT false,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`teachers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`teachers_blocks_list_order_idx\` ON \`teachers_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`teachers_blocks_list_parent_id_idx\` ON \`teachers_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`teachers_blocks_list_path_idx\` ON \`teachers_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`teachers_blocks_stat\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`teachers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`teachers_blocks_stat_order_idx\` ON \`teachers_blocks_stat\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`teachers_blocks_stat_parent_id_idx\` ON \`teachers_blocks_stat\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`teachers_blocks_stat_path_idx\` ON \`teachers_blocks_stat\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`teachers_blocks_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`teachers_blocks_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`teachers_blocks_cards_items_order_idx\` ON \`teachers_blocks_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`teachers_blocks_cards_items_parent_id_idx\` ON \`teachers_blocks_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`teachers_blocks_cards_items_image_idx\` ON \`teachers_blocks_cards_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`teachers_blocks_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`teachers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`teachers_blocks_cards_order_idx\` ON \`teachers_blocks_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`teachers_blocks_cards_parent_id_idx\` ON \`teachers_blocks_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`teachers_blocks_cards_path_idx\` ON \`teachers_blocks_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`teachers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`role\` text,
  	\`photo_id\` integer,
  	\`card_photo_id\` integer,
  	\`is_management\` integer DEFAULT false,
  	\`slug\` text,
  	\`order\` numeric DEFAULT 1,
  	\`wp_popup_id\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`card_photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`teachers_photo_idx\` ON \`teachers\` (\`photo_id\`);`)
  await db.run(sql`CREATE INDEX \`teachers_card_photo_idx\` ON \`teachers\` (\`card_photo_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`teachers_slug_idx\` ON \`teachers\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`teachers_updated_at_idx\` ON \`teachers\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`teachers_created_at_idx\` ON \`teachers\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`teachers__status_idx\` ON \`teachers\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`teachers_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`directions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`teachers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`directions_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`teachers_rels_order_idx\` ON \`teachers_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`teachers_rels_parent_idx\` ON \`teachers_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`teachers_rels_path_idx\` ON \`teachers_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`teachers_rels_directions_id_idx\` ON \`teachers_rels\` (\`directions_id\`);`)
  await db.run(sql`CREATE TABLE \`_teachers_v_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_teachers_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_paragraph_order_idx\` ON \`_teachers_v_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_paragraph_parent_id_idx\` ON \`_teachers_v_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_paragraph_path_idx\` ON \`_teachers_v_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_teachers_v_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`level\` text DEFAULT '3',
  	\`icon\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_teachers_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_heading_order_idx\` ON \`_teachers_v_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_heading_parent_id_idx\` ON \`_teachers_v_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_heading_path_idx\` ON \`_teachers_v_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_teachers_v_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_teachers_v_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_list_items_order_idx\` ON \`_teachers_v_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_list_items_parent_id_idx\` ON \`_teachers_v_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_teachers_v_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`ordered\` integer DEFAULT false,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_teachers_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_list_order_idx\` ON \`_teachers_v_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_list_parent_id_idx\` ON \`_teachers_v_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_list_path_idx\` ON \`_teachers_v_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_teachers_v_blocks_stat\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_teachers_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_stat_order_idx\` ON \`_teachers_v_blocks_stat\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_stat_parent_id_idx\` ON \`_teachers_v_blocks_stat\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_stat_path_idx\` ON \`_teachers_v_blocks_stat\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_teachers_v_blocks_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_teachers_v_blocks_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_cards_items_order_idx\` ON \`_teachers_v_blocks_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_cards_items_parent_id_idx\` ON \`_teachers_v_blocks_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_cards_items_image_idx\` ON \`_teachers_v_blocks_cards_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_teachers_v_blocks_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_teachers_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_cards_order_idx\` ON \`_teachers_v_blocks_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_cards_parent_id_idx\` ON \`_teachers_v_blocks_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_blocks_cards_path_idx\` ON \`_teachers_v_blocks_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_teachers_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_name\` text,
  	\`version_role\` text,
  	\`version_photo_id\` integer,
  	\`version_card_photo_id\` integer,
  	\`version_is_management\` integer DEFAULT false,
  	\`version_slug\` text,
  	\`version_order\` numeric DEFAULT 1,
  	\`version_wp_popup_id\` numeric,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`teachers\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_card_photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_teachers_v_parent_idx\` ON \`_teachers_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_version_version_photo_idx\` ON \`_teachers_v\` (\`version_photo_id\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_version_version_card_photo_idx\` ON \`_teachers_v\` (\`version_card_photo_id\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_version_version_slug_idx\` ON \`_teachers_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_version_version_updated_at_idx\` ON \`_teachers_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_version_version_created_at_idx\` ON \`_teachers_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_version_version__status_idx\` ON \`_teachers_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_created_at_idx\` ON \`_teachers_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_updated_at_idx\` ON \`_teachers_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_latest_idx\` ON \`_teachers_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_teachers_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`directions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_teachers_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`directions_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_teachers_v_rels_order_idx\` ON \`_teachers_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_rels_parent_idx\` ON \`_teachers_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_rels_path_idx\` ON \`_teachers_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_teachers_v_rels_directions_id_idx\` ON \`_teachers_v_rels\` (\`directions_id\`);`)
  await db.run(sql`CREATE TABLE \`faq_items_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`faq_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_paragraph_order_idx\` ON \`faq_items_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_paragraph_parent_id_idx\` ON \`faq_items_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_paragraph_path_idx\` ON \`faq_items_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`faq_items_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`level\` text DEFAULT '3',
  	\`icon\` text,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`faq_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_heading_order_idx\` ON \`faq_items_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_heading_parent_id_idx\` ON \`faq_items_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_heading_path_idx\` ON \`faq_items_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`faq_items_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`faq_items_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_list_items_order_idx\` ON \`faq_items_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_list_items_parent_id_idx\` ON \`faq_items_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`faq_items_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`ordered\` integer DEFAULT false,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`faq_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_list_order_idx\` ON \`faq_items_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_list_parent_id_idx\` ON \`faq_items_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_list_path_idx\` ON \`faq_items_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`faq_items_blocks_stat\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`faq_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_stat_order_idx\` ON \`faq_items_blocks_stat\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_stat_parent_id_idx\` ON \`faq_items_blocks_stat\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_stat_path_idx\` ON \`faq_items_blocks_stat\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`faq_items_blocks_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`faq_items_blocks_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_cards_items_order_idx\` ON \`faq_items_blocks_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_cards_items_parent_id_idx\` ON \`faq_items_blocks_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_cards_items_image_idx\` ON \`faq_items_blocks_cards_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`faq_items_blocks_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`faq_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_cards_order_idx\` ON \`faq_items_blocks_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_cards_parent_id_idx\` ON \`faq_items_blocks_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_blocks_cards_path_idx\` ON \`faq_items_blocks_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`faq_items\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer_text\` text,
  	\`key\` text,
  	\`order\` numeric DEFAULT 1,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`faq_items_key_idx\` ON \`faq_items\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_updated_at_idx\` ON \`faq_items\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`faq_items_created_at_idx\` ON \`faq_items\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`faq_items__status_idx\` ON \`faq_items\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_faq_items_v_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_faq_items_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_paragraph_order_idx\` ON \`_faq_items_v_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_paragraph_parent_id_idx\` ON \`_faq_items_v_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_paragraph_path_idx\` ON \`_faq_items_v_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_faq_items_v_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`level\` text DEFAULT '3',
  	\`icon\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_faq_items_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_heading_order_idx\` ON \`_faq_items_v_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_heading_parent_id_idx\` ON \`_faq_items_v_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_heading_path_idx\` ON \`_faq_items_v_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_faq_items_v_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_faq_items_v_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_list_items_order_idx\` ON \`_faq_items_v_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_list_items_parent_id_idx\` ON \`_faq_items_v_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_faq_items_v_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`ordered\` integer DEFAULT false,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_faq_items_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_list_order_idx\` ON \`_faq_items_v_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_list_parent_id_idx\` ON \`_faq_items_v_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_list_path_idx\` ON \`_faq_items_v_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_faq_items_v_blocks_stat\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_faq_items_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_stat_order_idx\` ON \`_faq_items_v_blocks_stat\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_stat_parent_id_idx\` ON \`_faq_items_v_blocks_stat\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_stat_path_idx\` ON \`_faq_items_v_blocks_stat\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_faq_items_v_blocks_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_faq_items_v_blocks_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_cards_items_order_idx\` ON \`_faq_items_v_blocks_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_cards_items_parent_id_idx\` ON \`_faq_items_v_blocks_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_cards_items_image_idx\` ON \`_faq_items_v_blocks_cards_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_faq_items_v_blocks_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_faq_items_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_cards_order_idx\` ON \`_faq_items_v_blocks_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_cards_parent_id_idx\` ON \`_faq_items_v_blocks_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_blocks_cards_path_idx\` ON \`_faq_items_v_blocks_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_faq_items_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_question\` text,
  	\`version_answer_text\` text,
  	\`version_key\` text,
  	\`version_order\` numeric DEFAULT 1,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`faq_items\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_faq_items_v_parent_idx\` ON \`_faq_items_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_version_version_key_idx\` ON \`_faq_items_v\` (\`version_key\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_version_version_updated_at_idx\` ON \`_faq_items_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_version_version_created_at_idx\` ON \`_faq_items_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_version_version__status_idx\` ON \`_faq_items_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_created_at_idx\` ON \`_faq_items_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_updated_at_idx\` ON \`_faq_items_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_faq_items_v_latest_idx\` ON \`_faq_items_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`reviews\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`author\` text,
  	\`source\` text DEFAULT 'manual',
  	\`rating\` numeric,
  	\`text\` text,
  	\`date\` text,
  	\`url\` text,
  	\`key\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`reviews_key_idx\` ON \`reviews\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`reviews_updated_at_idx\` ON \`reviews\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`reviews_created_at_idx\` ON \`reviews\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`reviews__status_idx\` ON \`reviews\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_reviews_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_author\` text,
  	\`version_source\` text DEFAULT 'manual',
  	\`version_rating\` numeric,
  	\`version_text\` text,
  	\`version_date\` text,
  	\`version_url\` text,
  	\`version_key\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`reviews\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_reviews_v_parent_idx\` ON \`_reviews_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_v_version_version_key_idx\` ON \`_reviews_v\` (\`version_key\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_v_version_version_updated_at_idx\` ON \`_reviews_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_v_version_version_created_at_idx\` ON \`_reviews_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_v_version_version__status_idx\` ON \`_reviews_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_v_created_at_idx\` ON \`_reviews_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_v_updated_at_idx\` ON \`_reviews_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_v_latest_idx\` ON \`_reviews_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_paragraph_order_idx\` ON \`news_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_paragraph_parent_id_idx\` ON \`news_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_paragraph_path_idx\` ON \`news_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`level\` text DEFAULT '3',
  	\`icon\` text,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_heading_order_idx\` ON \`news_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_heading_parent_id_idx\` ON \`news_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_heading_path_idx\` ON \`news_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_list_items_order_idx\` ON \`news_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_list_items_parent_id_idx\` ON \`news_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`ordered\` integer DEFAULT false,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_list_order_idx\` ON \`news_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_list_parent_id_idx\` ON \`news_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_list_path_idx\` ON \`news_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_stat\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_stat_order_idx\` ON \`news_blocks_stat\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_stat_parent_id_idx\` ON \`news_blocks_stat\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_stat_path_idx\` ON \`news_blocks_stat\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news_blocks_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_cards_items_order_idx\` ON \`news_blocks_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_cards_items_parent_id_idx\` ON \`news_blocks_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_cards_items_image_idx\` ON \`news_blocks_cards_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_cards_order_idx\` ON \`news_blocks_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_cards_parent_id_idx\` ON \`news_blocks_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_cards_path_idx\` ON \`news_blocks_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`excerpt\` text,
  	\`cover_id\` integer,
  	\`published_at\` text,
  	\`slug\` text,
  	\`key\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`news_cover_idx\` ON \`news\` (\`cover_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`news_slug_idx\` ON \`news\` (\`slug\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`news_key_idx\` ON \`news\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`news_updated_at_idx\` ON \`news\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`news_created_at_idx\` ON \`news\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`news__status_idx\` ON \`news\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_paragraph_order_idx\` ON \`_news_v_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_paragraph_parent_id_idx\` ON \`_news_v_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_paragraph_path_idx\` ON \`_news_v_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`level\` text DEFAULT '3',
  	\`icon\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_heading_order_idx\` ON \`_news_v_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_heading_parent_id_idx\` ON \`_news_v_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_heading_path_idx\` ON \`_news_v_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_list_items_order_idx\` ON \`_news_v_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_list_items_parent_id_idx\` ON \`_news_v_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`ordered\` integer DEFAULT false,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_list_order_idx\` ON \`_news_v_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_list_parent_id_idx\` ON \`_news_v_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_list_path_idx\` ON \`_news_v_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_stat\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_stat_order_idx\` ON \`_news_v_blocks_stat\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_stat_parent_id_idx\` ON \`_news_v_blocks_stat\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_stat_path_idx\` ON \`_news_v_blocks_stat\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v_blocks_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_cards_items_order_idx\` ON \`_news_v_blocks_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_cards_items_parent_id_idx\` ON \`_news_v_blocks_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_cards_items_image_idx\` ON \`_news_v_blocks_cards_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_cards_order_idx\` ON \`_news_v_blocks_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_cards_parent_id_idx\` ON \`_news_v_blocks_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_cards_path_idx\` ON \`_news_v_blocks_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_excerpt\` text,
  	\`version_cover_id\` integer,
  	\`version_published_at\` text,
  	\`version_slug\` text,
  	\`version_key\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_parent_idx\` ON \`_news_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version_cover_idx\` ON \`_news_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version_slug_idx\` ON \`_news_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version_key_idx\` ON \`_news_v\` (\`version_key\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version_updated_at_idx\` ON \`_news_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version_created_at_idx\` ON \`_news_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version__status_idx\` ON \`_news_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_created_at_idx\` ON \`_news_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_updated_at_idx\` ON \`_news_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_latest_idx\` ON \`_news_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`subheading\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`cta_external\` integer DEFAULT false,
  	\`image_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_order_idx\` ON \`pages_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_parent_id_idx\` ON \`pages_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_path_idx\` ON \`pages_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_image_idx\` ON \`pages_blocks_hero\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_card_section_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_card_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_section_items_order_idx\` ON \`pages_blocks_card_section_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_section_items_parent_id_idx\` ON \`pages_blocks_card_section_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_section_items_image_idx\` ON \`pages_blocks_card_section_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_card_section\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_section_order_idx\` ON \`pages_blocks_card_section\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_section_parent_id_idx\` ON \`pages_blocks_card_section\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_card_section_path_idx\` ON \`pages_blocks_card_section\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_paragraph_order_idx\` ON \`pages_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_paragraph_parent_id_idx\` ON \`pages_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_paragraph_path_idx\` ON \`pages_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`level\` text DEFAULT '3',
  	\`icon\` text,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_heading_order_idx\` ON \`pages_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_heading_parent_id_idx\` ON \`pages_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_heading_path_idx\` ON \`pages_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_list_items_order_idx\` ON \`pages_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_list_items_parent_id_idx\` ON \`pages_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`ordered\` integer DEFAULT false,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_list_order_idx\` ON \`pages_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_list_parent_id_idx\` ON \`pages_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_list_path_idx\` ON \`pages_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_stat\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_stat_order_idx\` ON \`pages_blocks_stat\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_stat_parent_id_idx\` ON \`pages_blocks_stat\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_stat_path_idx\` ON \`pages_blocks_stat\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cards_items_order_idx\` ON \`pages_blocks_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cards_items_parent_id_idx\` ON \`pages_blocks_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cards_items_image_idx\` ON \`pages_blocks_cards_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cards_order_idx\` ON \`pages_blocks_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cards_parent_id_idx\` ON \`pages_blocks_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cards_path_idx\` ON \`pages_blocks_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_article\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_article_order_idx\` ON \`pages_blocks_article\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_article_parent_id_idx\` ON \`pages_blocks_article\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_article_path_idx\` ON \`pages_blocks_article\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_video_videos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`src\` text,
  	\`mime_type\` text,
  	\`size_bytes\` numeric,
  	\`poster_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_video\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_videos_order_idx\` ON \`pages_blocks_video_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_videos_parent_id_idx\` ON \`pages_blocks_video_videos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_videos_poster_idx\` ON \`pages_blocks_video_videos\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_order_idx\` ON \`pages_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_parent_id_idx\` ON \`pages_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_path_idx\` ON \`pages_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_downloads_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`size_bytes\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_downloads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_downloads_items_order_idx\` ON \`pages_blocks_downloads_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_downloads_items_parent_id_idx\` ON \`pages_blocks_downloads_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_downloads\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_downloads_order_idx\` ON \`pages_blocks_downloads\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_downloads_parent_id_idx\` ON \`pages_blocks_downloads\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_downloads_path_idx\` ON \`pages_blocks_downloads\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`h1\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_og_image_id\` integer,
  	\`key\` text,
  	\`last_modified\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_seo_seo_og_image_idx\` ON \`pages\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_key_idx\` ON \`pages\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`pages_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_texts_order_parent\` ON \`pages_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`subheading\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`cta_external\` integer DEFAULT false,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_order_idx\` ON \`_pages_v_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_parent_id_idx\` ON \`_pages_v_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_path_idx\` ON \`_pages_v_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_image_idx\` ON \`_pages_v_blocks_hero\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_card_section_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_card_section\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_section_items_order_idx\` ON \`_pages_v_blocks_card_section_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_section_items_parent_id_idx\` ON \`_pages_v_blocks_card_section_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_section_items_image_idx\` ON \`_pages_v_blocks_card_section_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_card_section\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_section_order_idx\` ON \`_pages_v_blocks_card_section\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_section_parent_id_idx\` ON \`_pages_v_blocks_card_section\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_card_section_path_idx\` ON \`_pages_v_blocks_card_section\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_paragraph_order_idx\` ON \`_pages_v_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_paragraph_parent_id_idx\` ON \`_pages_v_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_paragraph_path_idx\` ON \`_pages_v_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`level\` text DEFAULT '3',
  	\`icon\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_heading_order_idx\` ON \`_pages_v_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_heading_parent_id_idx\` ON \`_pages_v_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_heading_path_idx\` ON \`_pages_v_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_list_items_order_idx\` ON \`_pages_v_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_list_items_parent_id_idx\` ON \`_pages_v_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`ordered\` integer DEFAULT false,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_list_order_idx\` ON \`_pages_v_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_list_parent_id_idx\` ON \`_pages_v_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_list_path_idx\` ON \`_pages_v_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_stat\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stat_order_idx\` ON \`_pages_v_blocks_stat\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stat_parent_id_idx\` ON \`_pages_v_blocks_stat\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_stat_path_idx\` ON \`_pages_v_blocks_stat\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cards_items_order_idx\` ON \`_pages_v_blocks_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cards_items_parent_id_idx\` ON \`_pages_v_blocks_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cards_items_image_idx\` ON \`_pages_v_blocks_cards_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cards_order_idx\` ON \`_pages_v_blocks_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cards_parent_id_idx\` ON \`_pages_v_blocks_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cards_path_idx\` ON \`_pages_v_blocks_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_article\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_article_order_idx\` ON \`_pages_v_blocks_article\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_article_parent_id_idx\` ON \`_pages_v_blocks_article\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_article_path_idx\` ON \`_pages_v_blocks_article\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_video_videos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`src\` text,
  	\`mime_type\` text,
  	\`size_bytes\` numeric,
  	\`poster_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_video\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_videos_order_idx\` ON \`_pages_v_blocks_video_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_videos_parent_id_idx\` ON \`_pages_v_blocks_video_videos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_videos_poster_idx\` ON \`_pages_v_blocks_video_videos\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_order_idx\` ON \`_pages_v_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_parent_id_idx\` ON \`_pages_v_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_path_idx\` ON \`_pages_v_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_downloads_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`size_bytes\` numeric,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_downloads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_downloads_items_order_idx\` ON \`_pages_v_blocks_downloads_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_downloads_items_parent_id_idx\` ON \`_pages_v_blocks_downloads_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_downloads\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_downloads_order_idx\` ON \`_pages_v_blocks_downloads\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_downloads_parent_id_idx\` ON \`_pages_v_blocks_downloads\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_downloads_path_idx\` ON \`_pages_v_blocks_downloads\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_h1\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_og_image_id\` integer,
  	\`version_key\` text,
  	\`version_last_modified\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_seo_version_seo_og_image_idx\` ON \`_pages_v\` (\`version_seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_key_idx\` ON \`_pages_v\` (\`version_key\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_texts_order_parent\` ON \`_pages_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`legacy_src\` text,
  	\`alt_generated\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`role\` text DEFAULT 'editor' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`directions_id\` integer,
  	\`studios_id\` integer,
  	\`teachers_id\` integer,
  	\`faq_items_id\` integer,
  	\`reviews_id\` integer,
  	\`news_id\` integer,
  	\`pages_id\` integer,
  	\`media_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`directions_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`studios_id\`) REFERENCES \`studios\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`teachers_id\`) REFERENCES \`teachers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faq_items_id\`) REFERENCES \`faq_items\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`reviews_id\`) REFERENCES \`reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_directions_id_idx\` ON \`payload_locked_documents_rels\` (\`directions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_studios_id_idx\` ON \`payload_locked_documents_rels\` (\`studios_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_teachers_id_idx\` ON \`payload_locked_documents_rels\` (\`teachers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faq_items_id_idx\` ON \`payload_locked_documents_rels\` (\`faq_items_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`reviews_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_news_id_idx\` ON \`payload_locked_documents_rels\` (\`news_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_phones\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`display\` text,
  	\`tel\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_phones_order_idx\` ON \`site_settings_phones\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_phones_parent_id_idx\` ON \`site_settings_phones\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_socials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kind\` text,
  	\`label\` text,
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_socials_order_idx\` ON \`site_settings_socials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_socials_parent_id_idx\` ON \`site_settings_socials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_messenger_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kind\` text,
  	\`label\` text,
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_messenger_buttons_order_idx\` ON \`site_settings_messenger_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_messenger_buttons_parent_id_idx\` ON \`site_settings_messenger_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_moyklass_api_filial_studio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`filial_id\` text,
  	\`studio_slug\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_moyklass_api_filial_studio_order_idx\` ON \`site_settings_moyklass_api_filial_studio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_moyklass_api_filial_studio_parent_id_idx\` ON \`site_settings_moyklass_api_filial_studio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_documents\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`title\` text,
  	\`href\` text,
  	\`size_bytes\` numeric,
  	\`old_path\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_documents_order_idx\` ON \`site_settings_documents\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_documents_parent_id_idx\` ON \`site_settings_documents\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`cms_site_name\` text,
  	\`legal_name\` text,
  	\`url\` text,
  	\`lang\` text DEFAULT 'ru-RU',
  	\`founded_year\` numeric,
  	\`tagline_title\` text,
  	\`tagline_text\` text,
  	\`logo_id\` integer,
  	\`favicon_png_id\` integer,
  	\`favicon_svg\` text,
  	\`default_og_image_id\` integer,
  	\`seo_title_suffix\` text,
  	\`email\` text,
  	\`moyklass_lead_widget_id\` text,
  	\`moyklass_lead_mount_id\` text,
  	\`moyklass_schedule_widget_id\` text,
  	\`metrika_counter_id\` text,
  	\`yandex_org_id\` text,
  	\`yandex_org_url\` text,
  	\`yandex_rating_badge_url\` text,
  	\`yandex_reviews_widget_url\` text,
  	\`yandex_review_link\` text,
  	\`two_gis_reviews_url\` text,
  	\`two_gis_badge_id\` integer,
  	\`payment_sbp_url\` text,
  	\`cookie_banner_title\` text,
  	\`cookie_banner_description\` text,
  	\`cookie_banner_accept\` text,
  	\`cookie_banner_reject\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`favicon_png_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`default_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`two_gis_badge_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_logo_idx\` ON \`site_settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_favicon_favicon_png_idx\` ON \`site_settings\` (\`favicon_png_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_default_og_image_idx\` ON \`site_settings\` (\`default_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_two_gis_two_gis_badge_idx\` ON \`site_settings\` (\`two_gis_badge_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings__status_idx\` ON \`site_settings\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_texts_order_parent\` ON \`site_settings_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_numbers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`number\` numeric,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_numbers_order_parent_idx\` ON \`site_settings_numbers\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_phones\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`display\` text,
  	\`tel\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_phones_order_idx\` ON \`_site_settings_v_version_phones\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_phones_parent_id_idx\` ON \`_site_settings_v_version_phones\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_socials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kind\` text,
  	\`label\` text,
  	\`url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_socials_order_idx\` ON \`_site_settings_v_version_socials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_socials_parent_id_idx\` ON \`_site_settings_v_version_socials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_messenger_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kind\` text,
  	\`label\` text,
  	\`url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_messenger_buttons_order_idx\` ON \`_site_settings_v_version_messenger_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_messenger_buttons_parent_id_idx\` ON \`_site_settings_v_version_messenger_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_moyklass_api_filial_studio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`filial_id\` text,
  	\`studio_slug\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_moyklass_api_filial_studio_order_idx\` ON \`_site_settings_v_version_moyklass_api_filial_studio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_moyklass_api_filial_studio_parent_id_idx\` ON \`_site_settings_v_version_moyklass_api_filial_studio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_documents\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`title\` text,
  	\`href\` text,
  	\`size_bytes\` numeric,
  	\`old_path\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_documents_order_idx\` ON \`_site_settings_v_version_documents\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_documents_parent_id_idx\` ON \`_site_settings_v_version_documents\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_name\` text,
  	\`version_cms_site_name\` text,
  	\`version_legal_name\` text,
  	\`version_url\` text,
  	\`version_lang\` text DEFAULT 'ru-RU',
  	\`version_founded_year\` numeric,
  	\`version_tagline_title\` text,
  	\`version_tagline_text\` text,
  	\`version_logo_id\` integer,
  	\`version_favicon_png_id\` integer,
  	\`version_favicon_svg\` text,
  	\`version_default_og_image_id\` integer,
  	\`version_seo_title_suffix\` text,
  	\`version_email\` text,
  	\`version_moyklass_lead_widget_id\` text,
  	\`version_moyklass_lead_mount_id\` text,
  	\`version_moyklass_schedule_widget_id\` text,
  	\`version_metrika_counter_id\` text,
  	\`version_yandex_org_id\` text,
  	\`version_yandex_org_url\` text,
  	\`version_yandex_rating_badge_url\` text,
  	\`version_yandex_reviews_widget_url\` text,
  	\`version_yandex_review_link\` text,
  	\`version_two_gis_reviews_url\` text,
  	\`version_two_gis_badge_id\` integer,
  	\`version_payment_sbp_url\` text,
  	\`version_cookie_banner_title\` text,
  	\`version_cookie_banner_description\` text,
  	\`version_cookie_banner_accept\` text,
  	\`version_cookie_banner_reject\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_favicon_png_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_default_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_two_gis_badge_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_version_logo_idx\` ON \`_site_settings_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_favicon_version_favicon_png_idx\` ON \`_site_settings_v\` (\`version_favicon_png_id\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_version_default_og_image_idx\` ON \`_site_settings_v\` (\`version_default_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_two_gis_version_two_gis_badge_idx\` ON \`_site_settings_v\` (\`version_two_gis_badge_id\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_version__status_idx\` ON \`_site_settings_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_created_at_idx\` ON \`_site_settings_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_updated_at_idx\` ON \`_site_settings_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_latest_idx\` ON \`_site_settings_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_texts_order_parent\` ON \`_site_settings_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_numbers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`number\` numeric,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_numbers_order_parent_idx\` ON \`_site_settings_v_numbers\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_main_nav_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_main_nav\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_main_nav_children_order_idx\` ON \`navigation_main_nav_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_main_nav_children_parent_id_idx\` ON \`navigation_main_nav_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_main_nav_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_main_nav_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_main_nav_columns_links_order_idx\` ON \`navigation_main_nav_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_main_nav_columns_links_parent_id_idx\` ON \`navigation_main_nav_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_main_nav_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_main_nav\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_main_nav_columns_order_idx\` ON \`navigation_main_nav_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_main_nav_columns_parent_id_idx\` ON \`navigation_main_nav_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_main_nav\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`all_link_label\` text,
  	\`all_link_href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_main_nav_order_idx\` ON \`navigation_main_nav\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_main_nav_parent_id_idx\` ON \`navigation_main_nav\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_nav_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_nav\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_footer_nav_links_order_idx\` ON \`navigation_footer_nav_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_footer_nav_links_parent_id_idx\` ON \`navigation_footer_nav_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_nav\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`legal\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_footer_nav_order_idx\` ON \`navigation_footer_nav\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_footer_nav_parent_id_idx\` ON \`navigation_footer_nav\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_section_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_section_links_order_idx\` ON \`navigation_section_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_section_links_parent_id_idx\` ON \`navigation_section_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation__status_idx\` ON \`navigation\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_main_nav_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_main_nav\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_main_nav_children_order_idx\` ON \`_navigation_v_version_main_nav_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_main_nav_children_parent_id_idx\` ON \`_navigation_v_version_main_nav_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_main_nav_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_main_nav_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_main_nav_columns_links_order_idx\` ON \`_navigation_v_version_main_nav_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_main_nav_columns_links_parent_id_idx\` ON \`_navigation_v_version_main_nav_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_main_nav_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_main_nav\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_main_nav_columns_order_idx\` ON \`_navigation_v_version_main_nav_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_main_nav_columns_parent_id_idx\` ON \`_navigation_v_version_main_nav_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_main_nav\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`all_link_label\` text,
  	\`all_link_href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_main_nav_order_idx\` ON \`_navigation_v_version_main_nav\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_main_nav_parent_id_idx\` ON \`_navigation_v_version_main_nav\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_nav_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_footer_nav\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_nav_links_order_idx\` ON \`_navigation_v_version_footer_nav_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_nav_links_parent_id_idx\` ON \`_navigation_v_version_footer_nav_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_nav\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`legal\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_nav_order_idx\` ON \`_navigation_v_version_footer_nav\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_nav_parent_id_idx\` ON \`_navigation_v_version_footer_nav\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_section_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_section_links_order_idx\` ON \`_navigation_v_version_section_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_section_links_parent_id_idx\` ON \`_navigation_v_version_section_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_version__status_idx\` ON \`_navigation_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_created_at_idx\` ON \`_navigation_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_updated_at_idx\` ON \`_navigation_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_latest_idx\` ON \`_navigation_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`direction_template_nav_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`external\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`direction_template\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`direction_template_nav_links_order_idx\` ON \`direction_template_nav_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`direction_template_nav_links_parent_id_idx\` ON \`direction_template_nav_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`direction_template\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`cta_external\` integer DEFAULT false,
  	\`schedule_button_label\` text,
  	\`schedule_button_href\` text,
  	\`schedule_button_external\` integer DEFAULT false,
  	\`related_heading\` text,
  	\`related_subheading\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`direction_template__status_idx\` ON \`direction_template\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`direction_template_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`directions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`direction_template\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`directions_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`direction_template_rels_order_idx\` ON \`direction_template_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`direction_template_rels_parent_idx\` ON \`direction_template_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`direction_template_rels_path_idx\` ON \`direction_template_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`direction_template_rels_directions_id_idx\` ON \`direction_template_rels\` (\`directions_id\`);`)
  await db.run(sql`CREATE TABLE \`_direction_template_v_version_nav_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`external\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_direction_template_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_direction_template_v_version_nav_links_order_idx\` ON \`_direction_template_v_version_nav_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_direction_template_v_version_nav_links_parent_id_idx\` ON \`_direction_template_v_version_nav_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_direction_template_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_cta_label\` text,
  	\`version_cta_href\` text,
  	\`version_cta_external\` integer DEFAULT false,
  	\`version_schedule_button_label\` text,
  	\`version_schedule_button_href\` text,
  	\`version_schedule_button_external\` integer DEFAULT false,
  	\`version_related_heading\` text,
  	\`version_related_subheading\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_direction_template_v_version_version__status_idx\` ON \`_direction_template_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_direction_template_v_created_at_idx\` ON \`_direction_template_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_direction_template_v_updated_at_idx\` ON \`_direction_template_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_direction_template_v_latest_idx\` ON \`_direction_template_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_direction_template_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`directions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_direction_template_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`directions_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_direction_template_v_rels_order_idx\` ON \`_direction_template_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_direction_template_v_rels_parent_idx\` ON \`_direction_template_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_direction_template_v_rels_path_idx\` ON \`_direction_template_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_direction_template_v_rels_directions_id_idx\` ON \`_direction_template_v_rels\` (\`directions_id\`);`)
  await db.run(sql`CREATE TABLE \`home_hero_heading_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_hero_heading_lines_order_idx\` ON \`home_hero_heading_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_hero_heading_lines_parent_id_idx\` ON \`home_hero_heading_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_hero_socials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kind\` text,
  	\`label\` text,
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_hero_socials_order_idx\` ON \`home_hero_socials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_hero_socials_parent_id_idx\` ON \`home_hero_socials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_directions_cards_bullets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_directions_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_directions_cards_bullets_order_idx\` ON \`home_directions_cards_bullets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_directions_cards_bullets_parent_id_idx\` ON \`home_directions_cards_bullets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_directions_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`direction_id\` integer,
  	\`title\` text,
  	FOREIGN KEY (\`direction_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_directions_cards_order_idx\` ON \`home_directions_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_directions_cards_parent_id_idx\` ON \`home_directions_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_directions_cards_direction_idx\` ON \`home_directions_cards\` (\`direction_id\`);`)
  await db.run(sql`CREATE TABLE \`home_learn_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_learn_list_order_idx\` ON \`home_learn_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_learn_list_parent_id_idx\` ON \`home_learn_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_advantages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_advantages_order_idx\` ON \`home_advantages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_advantages_parent_id_idx\` ON \`home_advantages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_advantages_image_idx\` ON \`home_advantages\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`home_performances_videos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`src\` text,
  	\`mime_type\` text,
  	\`size_bytes\` numeric,
  	\`poster_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_performances_videos_order_idx\` ON \`home_performances_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_performances_videos_parent_id_idx\` ON \`home_performances_videos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_performances_videos_poster_idx\` ON \`home_performances_videos\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`home_gallery_tabs_videos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`src\` text,
  	\`mime_type\` text,
  	\`size_bytes\` numeric,
  	\`poster_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_gallery_tabs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_gallery_tabs_videos_order_idx\` ON \`home_gallery_tabs_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_gallery_tabs_videos_parent_id_idx\` ON \`home_gallery_tabs_videos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_gallery_tabs_videos_poster_idx\` ON \`home_gallery_tabs_videos\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`home_gallery_tabs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_gallery_tabs_order_idx\` ON \`home_gallery_tabs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_gallery_tabs_parent_id_idx\` ON \`home_gallery_tabs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_heading\` text,
  	\`hero_heading_accent\` text,
  	\`hero_text\` text,
  	\`hero_cta_label\` text,
  	\`hero_cta_href\` text,
  	\`hero_cta_external\` integer DEFAULT false,
  	\`hero_image_id\` integer,
  	\`directions_heading\` text,
  	\`directions_poster_heading\` text,
  	\`directions_poster_accent\` text,
  	\`learn_heading\` text,
  	\`learn_text\` text,
  	\`learn_cta_label\` text,
  	\`learn_cta_href\` text,
  	\`learn_cta_external\` integer DEFAULT false,
  	\`learn_image_id\` integer,
  	\`advantages_heading\` text,
  	\`performances_anchor\` text,
  	\`performances_heading\` text,
  	\`performances_subheading\` text,
  	\`performances_more_label\` text,
  	\`studio_heading\` text,
  	\`gallery_heading\` text,
  	\`gallery_subheading\` text,
  	\`cta_anchor_id\` text,
  	\`cta_heading\` text,
  	\`cta_button_label\` text,
  	\`cta_button_href\` text,
  	\`cta_button_external\` integer DEFAULT false,
  	\`cta_image_id\` integer,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_og_image_id\` integer,
  	\`last_modified\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`learn_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`home_hero_hero_image_idx\` ON \`home\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`home_learn_learn_image_idx\` ON \`home\` (\`learn_image_id\`);`)
  await db.run(sql`CREATE INDEX \`home_cta_cta_image_idx\` ON \`home\` (\`cta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`home_seo_seo_og_image_idx\` ON \`home\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`home__status_idx\` ON \`home\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`home_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`directions_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`directions_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_rels_order_idx\` ON \`home_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_parent_idx\` ON \`home_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_path_idx\` ON \`home_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_directions_id_idx\` ON \`home_rels\` (\`directions_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_media_id_idx\` ON \`home_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_hero_heading_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_hero_heading_lines_order_idx\` ON \`_home_v_version_hero_heading_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_hero_heading_lines_parent_id_idx\` ON \`_home_v_version_hero_heading_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_hero_socials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kind\` text,
  	\`label\` text,
  	\`url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_hero_socials_order_idx\` ON \`_home_v_version_hero_socials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_hero_socials_parent_id_idx\` ON \`_home_v_version_hero_socials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_directions_cards_bullets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v_version_directions_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_directions_cards_bullets_order_idx\` ON \`_home_v_version_directions_cards_bullets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_directions_cards_bullets_parent_id_idx\` ON \`_home_v_version_directions_cards_bullets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_directions_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`direction_id\` integer,
  	\`title\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`direction_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_directions_cards_order_idx\` ON \`_home_v_version_directions_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_directions_cards_parent_id_idx\` ON \`_home_v_version_directions_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_directions_cards_direction_idx\` ON \`_home_v_version_directions_cards\` (\`direction_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_learn_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_learn_list_order_idx\` ON \`_home_v_version_learn_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_learn_list_parent_id_idx\` ON \`_home_v_version_learn_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_advantages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_advantages_order_idx\` ON \`_home_v_version_advantages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_advantages_parent_id_idx\` ON \`_home_v_version_advantages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_advantages_image_idx\` ON \`_home_v_version_advantages\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_performances_videos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`src\` text,
  	\`mime_type\` text,
  	\`size_bytes\` numeric,
  	\`poster_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_performances_videos_order_idx\` ON \`_home_v_version_performances_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_performances_videos_parent_id_idx\` ON \`_home_v_version_performances_videos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_performances_videos_poster_idx\` ON \`_home_v_version_performances_videos\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_gallery_tabs_videos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`src\` text,
  	\`mime_type\` text,
  	\`size_bytes\` numeric,
  	\`poster_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v_version_gallery_tabs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_gallery_tabs_videos_order_idx\` ON \`_home_v_version_gallery_tabs_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_gallery_tabs_videos_parent_id_idx\` ON \`_home_v_version_gallery_tabs_videos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_gallery_tabs_videos_poster_idx\` ON \`_home_v_version_gallery_tabs_videos\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_gallery_tabs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_gallery_tabs_order_idx\` ON \`_home_v_version_gallery_tabs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_gallery_tabs_parent_id_idx\` ON \`_home_v_version_gallery_tabs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_heading\` text,
  	\`version_hero_heading_accent\` text,
  	\`version_hero_text\` text,
  	\`version_hero_cta_label\` text,
  	\`version_hero_cta_href\` text,
  	\`version_hero_cta_external\` integer DEFAULT false,
  	\`version_hero_image_id\` integer,
  	\`version_directions_heading\` text,
  	\`version_directions_poster_heading\` text,
  	\`version_directions_poster_accent\` text,
  	\`version_learn_heading\` text,
  	\`version_learn_text\` text,
  	\`version_learn_cta_label\` text,
  	\`version_learn_cta_href\` text,
  	\`version_learn_cta_external\` integer DEFAULT false,
  	\`version_learn_image_id\` integer,
  	\`version_advantages_heading\` text,
  	\`version_performances_anchor\` text,
  	\`version_performances_heading\` text,
  	\`version_performances_subheading\` text,
  	\`version_performances_more_label\` text,
  	\`version_studio_heading\` text,
  	\`version_gallery_heading\` text,
  	\`version_gallery_subheading\` text,
  	\`version_cta_anchor_id\` text,
  	\`version_cta_heading\` text,
  	\`version_cta_button_label\` text,
  	\`version_cta_button_href\` text,
  	\`version_cta_button_external\` integer DEFAULT false,
  	\`version_cta_image_id\` integer,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_og_image_id\` integer,
  	\`version_last_modified\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_learn_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_hero_version_hero_image_idx\` ON \`_home_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_learn_version_learn_image_idx\` ON \`_home_v\` (\`version_learn_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_cta_version_cta_image_idx\` ON \`_home_v\` (\`version_cta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_seo_version_seo_og_image_idx\` ON \`_home_v\` (\`version_seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_version__status_idx\` ON \`_home_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_created_at_idx\` ON \`_home_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_updated_at_idx\` ON \`_home_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_latest_idx\` ON \`_home_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`directions_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`directions_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_rels_order_idx\` ON \`_home_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_rels_parent_idx\` ON \`_home_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_rels_path_idx\` ON \`_home_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_rels_directions_id_idx\` ON \`_home_v_rels\` (\`directions_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_rels_media_id_idx\` ON \`_home_v_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`home_faq_ask_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`external\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_faq_ask_buttons_order_idx\` ON \`home_faq_ask_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_faq_ask_buttons_parent_id_idx\` ON \`home_faq_ask_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_faq\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`subheading\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`home_faq__status_idx\` ON \`home_faq\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_home_faq_v_version_ask_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`external\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_faq_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_faq_v_version_ask_buttons_order_idx\` ON \`_home_faq_v_version_ask_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_faq_v_version_ask_buttons_parent_id_idx\` ON \`_home_faq_v_version_ask_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_faq_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_heading\` text,
  	\`version_subheading\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_faq_v_version_version__status_idx\` ON \`_home_faq_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_home_faq_v_created_at_idx\` ON \`_home_faq_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_faq_v_updated_at_idx\` ON \`_home_faq_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_faq_v_latest_idx\` ON \`_home_faq_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`tariffs_price_list_groups_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`lessons\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tariffs_price_list_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tariffs_price_list_groups_columns_order_idx\` ON \`tariffs_price_list_groups_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tariffs_price_list_groups_columns_parent_id_idx\` ON \`tariffs_price_list_groups_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tariffs_price_list_groups_rows_prices\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tariffs_price_list_groups_rows\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tariffs_price_list_groups_rows_prices_order_idx\` ON \`tariffs_price_list_groups_rows_prices\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tariffs_price_list_groups_rows_prices_parent_id_idx\` ON \`tariffs_price_list_groups_rows_prices\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tariffs_price_list_groups_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`label\` text,
  	\`note\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tariffs_price_list_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tariffs_price_list_groups_rows_order_idx\` ON \`tariffs_price_list_groups_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tariffs_price_list_groups_rows_parent_id_idx\` ON \`tariffs_price_list_groups_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tariffs_price_list_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`group_id\` text,
  	\`title\` text,
  	\`currency_printed\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tariffs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tariffs_price_list_groups_order_idx\` ON \`tariffs_price_list_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tariffs_price_list_groups_parent_id_idx\` ON \`tariffs_price_list_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tariffs_price_list_notes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tariffs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tariffs_price_list_notes_order_idx\` ON \`tariffs_price_list_notes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tariffs_price_list_notes_parent_id_idx\` ON \`tariffs_price_list_notes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tariffs_discounts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`percent\` numeric,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tariffs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tariffs_discounts_order_idx\` ON \`tariffs_discounts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tariffs_discounts_parent_id_idx\` ON \`tariffs_discounts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tariffs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`h1\` text,
  	\`price_list_title\` text,
  	\`price_list_season\` text,
  	\`price_list_approved_by\` text,
  	\`price_list_trial_lesson_label\` text,
  	\`price_list_trial_lesson_price_rub\` numeric,
  	\`price_list_image_id\` integer,
  	\`free_payment_heading\` text,
  	\`free_payment_text\` text,
  	\`free_payment_button_label\` text,
  	\`free_payment_button_href\` text,
  	\`free_payment_button_external\` integer DEFAULT false,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_og_image_id\` integer,
  	\`last_modified\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`price_list_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`tariffs_price_list_price_list_image_idx\` ON \`tariffs\` (\`price_list_image_id\`);`)
  await db.run(sql`CREATE INDEX \`tariffs_seo_seo_og_image_idx\` ON \`tariffs\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`tariffs__status_idx\` ON \`tariffs\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`tariffs_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`tariffs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tariffs_texts_order_parent\` ON \`tariffs_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tariffs_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`directions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`tariffs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`directions_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tariffs_rels_order_idx\` ON \`tariffs_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`tariffs_rels_parent_idx\` ON \`tariffs_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tariffs_rels_path_idx\` ON \`tariffs_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`tariffs_rels_directions_id_idx\` ON \`tariffs_rels\` (\`directions_id\`);`)
  await db.run(sql`CREATE TABLE \`_tariffs_v_version_price_list_groups_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`lessons\` numeric,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tariffs_v_version_price_list_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tariffs_v_version_price_list_groups_columns_order_idx\` ON \`_tariffs_v_version_price_list_groups_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tariffs_v_version_price_list_groups_columns_parent_id_idx\` ON \`_tariffs_v_version_price_list_groups_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_tariffs_v_version_price_list_groups_rows_prices\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` numeric,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tariffs_v_version_price_list_groups_rows\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tariffs_v_version_price_list_groups_rows_prices_order_idx\` ON \`_tariffs_v_version_price_list_groups_rows_prices\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tariffs_v_version_price_list_groups_rows_prices_parent_id_idx\` ON \`_tariffs_v_version_price_list_groups_rows_prices\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_tariffs_v_version_price_list_groups_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`label\` text,
  	\`note\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tariffs_v_version_price_list_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tariffs_v_version_price_list_groups_rows_order_idx\` ON \`_tariffs_v_version_price_list_groups_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tariffs_v_version_price_list_groups_rows_parent_id_idx\` ON \`_tariffs_v_version_price_list_groups_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_tariffs_v_version_price_list_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`group_id\` text,
  	\`title\` text,
  	\`currency_printed\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tariffs_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tariffs_v_version_price_list_groups_order_idx\` ON \`_tariffs_v_version_price_list_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tariffs_v_version_price_list_groups_parent_id_idx\` ON \`_tariffs_v_version_price_list_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_tariffs_v_version_price_list_notes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tariffs_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tariffs_v_version_price_list_notes_order_idx\` ON \`_tariffs_v_version_price_list_notes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tariffs_v_version_price_list_notes_parent_id_idx\` ON \`_tariffs_v_version_price_list_notes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_tariffs_v_version_discounts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`percent\` numeric,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tariffs_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tariffs_v_version_discounts_order_idx\` ON \`_tariffs_v_version_discounts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tariffs_v_version_discounts_parent_id_idx\` ON \`_tariffs_v_version_discounts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_tariffs_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_h1\` text,
  	\`version_price_list_title\` text,
  	\`version_price_list_season\` text,
  	\`version_price_list_approved_by\` text,
  	\`version_price_list_trial_lesson_label\` text,
  	\`version_price_list_trial_lesson_price_rub\` numeric,
  	\`version_price_list_image_id\` integer,
  	\`version_free_payment_heading\` text,
  	\`version_free_payment_text\` text,
  	\`version_free_payment_button_label\` text,
  	\`version_free_payment_button_href\` text,
  	\`version_free_payment_button_external\` integer DEFAULT false,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_og_image_id\` integer,
  	\`version_last_modified\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_price_list_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_tariffs_v_version_price_list_version_price_list_image_idx\` ON \`_tariffs_v\` (\`version_price_list_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_tariffs_v_version_seo_version_seo_og_image_idx\` ON \`_tariffs_v\` (\`version_seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_tariffs_v_version_version__status_idx\` ON \`_tariffs_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_tariffs_v_created_at_idx\` ON \`_tariffs_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_tariffs_v_updated_at_idx\` ON \`_tariffs_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_tariffs_v_latest_idx\` ON \`_tariffs_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_tariffs_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_tariffs_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tariffs_v_texts_order_parent\` ON \`_tariffs_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_tariffs_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`directions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_tariffs_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`directions_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tariffs_v_rels_order_idx\` ON \`_tariffs_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_tariffs_v_rels_parent_idx\` ON \`_tariffs_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tariffs_v_rels_path_idx\` ON \`_tariffs_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_tariffs_v_rels_directions_id_idx\` ON \`_tariffs_v_rels\` (\`directions_id\`);`)
  await db.run(sql`CREATE TABLE \`directions_index\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`h1\` text,
  	\`cta_label\` text,
  	\`cta_href\` text,
  	\`cta_external\` integer DEFAULT false,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_og_image_id\` integer,
  	\`last_modified\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_index_seo_seo_og_image_idx\` ON \`directions_index\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_index__status_idx\` ON \`directions_index\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`directions_index_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`directions_index\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_index_texts_order_parent\` ON \`directions_index_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`directions_index_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`directions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`directions_index\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`directions_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`directions_index_rels_order_idx\` ON \`directions_index_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`directions_index_rels_parent_idx\` ON \`directions_index_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`directions_index_rels_path_idx\` ON \`directions_index_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`directions_index_rels_directions_id_idx\` ON \`directions_index_rels\` (\`directions_id\`);`)
  await db.run(sql`CREATE TABLE \`_directions_index_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_h1\` text,
  	\`version_cta_label\` text,
  	\`version_cta_href\` text,
  	\`version_cta_external\` integer DEFAULT false,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_og_image_id\` integer,
  	\`version_last_modified\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_index_v_version_seo_version_seo_og_image_idx\` ON \`_directions_index_v\` (\`version_seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_index_v_version_version__status_idx\` ON \`_directions_index_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_directions_index_v_created_at_idx\` ON \`_directions_index_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_directions_index_v_updated_at_idx\` ON \`_directions_index_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_directions_index_v_latest_idx\` ON \`_directions_index_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_directions_index_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_directions_index_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_index_v_texts_order_parent\` ON \`_directions_index_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_directions_index_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`directions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_directions_index_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`directions_id\`) REFERENCES \`directions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_directions_index_v_rels_order_idx\` ON \`_directions_index_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_directions_index_v_rels_parent_idx\` ON \`_directions_index_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_directions_index_v_rels_path_idx\` ON \`_directions_index_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_directions_index_v_rels_directions_id_idx\` ON \`_directions_index_v_rels\` (\`directions_id\`);`)
  await db.run(sql`CREATE TABLE \`team_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`h1\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_og_image_id\` integer,
  	\`last_modified\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`team_page_seo_seo_og_image_idx\` ON \`team_page\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`team_page__status_idx\` ON \`team_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`team_page_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`team_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`team_page_texts_order_parent\` ON \`team_page_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_team_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_h1\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_og_image_id\` integer,
  	\`version_last_modified\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_team_page_v_version_seo_version_seo_og_image_idx\` ON \`_team_page_v\` (\`version_seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_team_page_v_version_version__status_idx\` ON \`_team_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_team_page_v_created_at_idx\` ON \`_team_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_team_page_v_updated_at_idx\` ON \`_team_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_team_page_v_latest_idx\` ON \`_team_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_team_page_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_team_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_team_page_v_texts_order_parent\` ON \`_team_page_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`reviews_page_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`reviews_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_paragraph_order_idx\` ON \`reviews_page_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_paragraph_parent_id_idx\` ON \`reviews_page_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_paragraph_path_idx\` ON \`reviews_page_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`reviews_page_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`level\` text DEFAULT '3',
  	\`icon\` text,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`reviews_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_heading_order_idx\` ON \`reviews_page_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_heading_parent_id_idx\` ON \`reviews_page_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_heading_path_idx\` ON \`reviews_page_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`reviews_page_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`reviews_page_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_list_items_order_idx\` ON \`reviews_page_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_list_items_parent_id_idx\` ON \`reviews_page_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`reviews_page_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`ordered\` integer DEFAULT false,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`reviews_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_list_order_idx\` ON \`reviews_page_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_list_parent_id_idx\` ON \`reviews_page_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_list_path_idx\` ON \`reviews_page_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`reviews_page_blocks_stat\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`reviews_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_stat_order_idx\` ON \`reviews_page_blocks_stat\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_stat_parent_id_idx\` ON \`reviews_page_blocks_stat\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_stat_path_idx\` ON \`reviews_page_blocks_stat\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`reviews_page_blocks_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`reviews_page_blocks_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_cards_items_order_idx\` ON \`reviews_page_blocks_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_cards_items_parent_id_idx\` ON \`reviews_page_blocks_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_cards_items_image_idx\` ON \`reviews_page_blocks_cards_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`reviews_page_blocks_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`reviews_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_cards_order_idx\` ON \`reviews_page_blocks_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_cards_parent_id_idx\` ON \`reviews_page_blocks_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_page_blocks_cards_path_idx\` ON \`reviews_page_blocks_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`reviews_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`h1\` text,
  	\`review_link\` text,
  	\`widget_url\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_og_image_id\` integer,
  	\`last_modified\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_page_seo_seo_og_image_idx\` ON \`reviews_page\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_page__status_idx\` ON \`reviews_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`reviews_page_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`reviews_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_page_texts_order_parent\` ON \`reviews_page_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_reviews_page_v_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_reviews_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_paragraph_order_idx\` ON \`_reviews_page_v_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_paragraph_parent_id_idx\` ON \`_reviews_page_v_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_paragraph_path_idx\` ON \`_reviews_page_v_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_reviews_page_v_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`level\` text DEFAULT '3',
  	\`icon\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_reviews_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_heading_order_idx\` ON \`_reviews_page_v_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_heading_parent_id_idx\` ON \`_reviews_page_v_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_heading_path_idx\` ON \`_reviews_page_v_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_reviews_page_v_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_reviews_page_v_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_list_items_order_idx\` ON \`_reviews_page_v_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_list_items_parent_id_idx\` ON \`_reviews_page_v_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_reviews_page_v_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`ordered\` integer DEFAULT false,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_reviews_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_list_order_idx\` ON \`_reviews_page_v_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_list_parent_id_idx\` ON \`_reviews_page_v_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_list_path_idx\` ON \`_reviews_page_v_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_reviews_page_v_blocks_stat\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_reviews_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_stat_order_idx\` ON \`_reviews_page_v_blocks_stat\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_stat_parent_id_idx\` ON \`_reviews_page_v_blocks_stat\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_stat_path_idx\` ON \`_reviews_page_v_blocks_stat\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_reviews_page_v_blocks_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_reviews_page_v_blocks_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_cards_items_order_idx\` ON \`_reviews_page_v_blocks_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_cards_items_parent_id_idx\` ON \`_reviews_page_v_blocks_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_cards_items_image_idx\` ON \`_reviews_page_v_blocks_cards_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_reviews_page_v_blocks_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_reviews_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_cards_order_idx\` ON \`_reviews_page_v_blocks_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_cards_parent_id_idx\` ON \`_reviews_page_v_blocks_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_blocks_cards_path_idx\` ON \`_reviews_page_v_blocks_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_reviews_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_h1\` text,
  	\`version_review_link\` text,
  	\`version_widget_url\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_og_image_id\` integer,
  	\`version_last_modified\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_version_seo_version_seo_og_image_idx\` ON \`_reviews_page_v\` (\`version_seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_version_version__status_idx\` ON \`_reviews_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_created_at_idx\` ON \`_reviews_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_updated_at_idx\` ON \`_reviews_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_latest_idx\` ON \`_reviews_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_reviews_page_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_reviews_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_reviews_page_v_texts_order_parent\` ON \`_reviews_page_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`news_page_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_page_blocks_paragraph_order_idx\` ON \`news_page_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_page_blocks_paragraph_parent_id_idx\` ON \`news_page_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_page_blocks_paragraph_path_idx\` ON \`news_page_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news_page_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`level\` text DEFAULT '3',
  	\`icon\` text,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_page_blocks_heading_order_idx\` ON \`news_page_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_page_blocks_heading_parent_id_idx\` ON \`news_page_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_page_blocks_heading_path_idx\` ON \`news_page_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news_page_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news_page_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_page_blocks_list_items_order_idx\` ON \`news_page_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_page_blocks_list_items_parent_id_idx\` ON \`news_page_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`news_page_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`ordered\` integer DEFAULT false,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_page_blocks_list_order_idx\` ON \`news_page_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_page_blocks_list_parent_id_idx\` ON \`news_page_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_page_blocks_list_path_idx\` ON \`news_page_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news_page_blocks_stat\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_page_blocks_stat_order_idx\` ON \`news_page_blocks_stat\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_page_blocks_stat_parent_id_idx\` ON \`news_page_blocks_stat\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_page_blocks_stat_path_idx\` ON \`news_page_blocks_stat\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news_page_blocks_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news_page_blocks_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_page_blocks_cards_items_order_idx\` ON \`news_page_blocks_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_page_blocks_cards_items_parent_id_idx\` ON \`news_page_blocks_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_page_blocks_cards_items_image_idx\` ON \`news_page_blocks_cards_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`news_page_blocks_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_page_blocks_cards_order_idx\` ON \`news_page_blocks_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_page_blocks_cards_parent_id_idx\` ON \`news_page_blocks_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_page_blocks_cards_path_idx\` ON \`news_page_blocks_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news_page_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_page_links_order_idx\` ON \`news_page_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_page_links_parent_id_idx\` ON \`news_page_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`news_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`h1\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_og_image_id\` integer,
  	\`last_modified\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`news_page_seo_seo_og_image_idx\` ON \`news_page\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`news_page__status_idx\` ON \`news_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`news_page_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`news_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_page_texts_order_parent\` ON \`news_page_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_news_page_v_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_paragraph_order_idx\` ON \`_news_page_v_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_paragraph_parent_id_idx\` ON \`_news_page_v_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_paragraph_path_idx\` ON \`_news_page_v_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_page_v_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`level\` text DEFAULT '3',
  	\`icon\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_heading_order_idx\` ON \`_news_page_v_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_heading_parent_id_idx\` ON \`_news_page_v_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_heading_path_idx\` ON \`_news_page_v_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_page_v_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_page_v_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_list_items_order_idx\` ON \`_news_page_v_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_list_items_parent_id_idx\` ON \`_news_page_v_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_news_page_v_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`ordered\` integer DEFAULT false,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_list_order_idx\` ON \`_news_page_v_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_list_parent_id_idx\` ON \`_news_page_v_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_list_path_idx\` ON \`_news_page_v_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_page_v_blocks_stat\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_stat_order_idx\` ON \`_news_page_v_blocks_stat\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_stat_parent_id_idx\` ON \`_news_page_v_blocks_stat\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_stat_path_idx\` ON \`_news_page_v_blocks_stat\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_page_v_blocks_cards_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_page_v_blocks_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_cards_items_order_idx\` ON \`_news_page_v_blocks_cards_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_cards_items_parent_id_idx\` ON \`_news_page_v_blocks_cards_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_cards_items_image_idx\` ON \`_news_page_v_blocks_cards_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_news_page_v_blocks_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_cards_order_idx\` ON \`_news_page_v_blocks_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_cards_parent_id_idx\` ON \`_news_page_v_blocks_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_blocks_cards_path_idx\` ON \`_news_page_v_blocks_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_page_v_version_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_page_v_version_links_order_idx\` ON \`_news_page_v_version_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_version_links_parent_id_idx\` ON \`_news_page_v_version_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_news_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_h1\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_og_image_id\` integer,
  	\`version_last_modified\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_page_v_version_seo_version_seo_og_image_idx\` ON \`_news_page_v\` (\`version_seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_version_version__status_idx\` ON \`_news_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_created_at_idx\` ON \`_news_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_updated_at_idx\` ON \`_news_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_page_v_latest_idx\` ON \`_news_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_news_page_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_news_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_page_v_texts_order_parent\` ON \`_news_page_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`schedule_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`h1\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_og_image_id\` integer,
  	\`last_modified\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`schedule_page_seo_seo_og_image_idx\` ON \`schedule_page\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`schedule_page__status_idx\` ON \`schedule_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`schedule_page_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`schedule_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`schedule_page_texts_order_parent\` ON \`schedule_page_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_schedule_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_h1\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_og_image_id\` integer,
  	\`version_last_modified\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_schedule_page_v_version_seo_version_seo_og_image_idx\` ON \`_schedule_page_v\` (\`version_seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_schedule_page_v_version_version__status_idx\` ON \`_schedule_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_schedule_page_v_created_at_idx\` ON \`_schedule_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_schedule_page_v_updated_at_idx\` ON \`_schedule_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_schedule_page_v_latest_idx\` ON \`_schedule_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_schedule_page_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_schedule_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_schedule_page_v_texts_order_parent\` ON \`_schedule_page_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cover_entries\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`entry_id\` text,
  	\`slot\` text,
  	\`number\` text,
  	\`label\` text,
  	\`headline\` text,
  	\`teaser\` text,
  	\`href\` text,
  	\`page\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cover\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cover_entries_order_idx\` ON \`cover_entries\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cover_entries_parent_id_idx\` ON \`cover_entries\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cover\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`story_kicker\` text,
  	\`story_title_line1\` text,
  	\`story_title_line2\` text,
  	\`story_teaser\` text,
  	\`story_href\` text,
  	\`story_page\` numeric,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`cover__status_idx\` ON \`cover\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_cover_v_version_entries\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`entry_id\` text,
  	\`slot\` text,
  	\`number\` text,
  	\`label\` text,
  	\`headline\` text,
  	\`teaser\` text,
  	\`href\` text,
  	\`page\` numeric,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_cover_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_cover_v_version_entries_order_idx\` ON \`_cover_v_version_entries\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_cover_v_version_entries_parent_id_idx\` ON \`_cover_v_version_entries\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_cover_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_story_kicker\` text,
  	\`version_story_title_line1\` text,
  	\`version_story_title_line2\` text,
  	\`version_story_teaser\` text,
  	\`version_story_href\` text,
  	\`version_story_page\` numeric,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_cover_v_version_version__status_idx\` ON \`_cover_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_cover_v_created_at_idx\` ON \`_cover_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_cover_v_updated_at_idx\` ON \`_cover_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_cover_v_latest_idx\` ON \`_cover_v\` (\`latest\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`directions_highlight_bullets\`;`)
  await db.run(sql`DROP TABLE \`directions_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`directions_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`directions_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`directions_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`directions_blocks_stat\`;`)
  await db.run(sql`DROP TABLE \`directions_blocks_cards_items\`;`)
  await db.run(sql`DROP TABLE \`directions_blocks_cards\`;`)
  await db.run(sql`DROP TABLE \`directions_blocks_intro\`;`)
  await db.run(sql`DROP TABLE \`directions_blocks_programme_items\`;`)
  await db.run(sql`DROP TABLE \`directions_blocks_programme\`;`)
  await db.run(sql`DROP TABLE \`directions_blocks_article\`;`)
  await db.run(sql`DROP TABLE \`directions_blocks_how_classes_go_videos\`;`)
  await db.run(sql`DROP TABLE \`directions_blocks_how_classes_go\`;`)
  await db.run(sql`DROP TABLE \`directions\`;`)
  await db.run(sql`DROP TABLE \`directions_texts\`;`)
  await db.run(sql`DROP TABLE \`directions_rels\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_version_highlight_bullets\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_blocks_stat\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_blocks_cards_items\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_blocks_cards\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_blocks_intro\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_blocks_programme_items\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_blocks_programme\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_blocks_article\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_blocks_how_classes_go_videos\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_blocks_how_classes_go\`;`)
  await db.run(sql`DROP TABLE \`_directions_v\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_texts\`;`)
  await db.run(sql`DROP TABLE \`_directions_v_rels\`;`)
  await db.run(sql`DROP TABLE \`studios\`;`)
  await db.run(sql`DROP TABLE \`studios_texts\`;`)
  await db.run(sql`DROP TABLE \`studios_rels\`;`)
  await db.run(sql`DROP TABLE \`_studios_v\`;`)
  await db.run(sql`DROP TABLE \`_studios_v_texts\`;`)
  await db.run(sql`DROP TABLE \`_studios_v_rels\`;`)
  await db.run(sql`DROP TABLE \`teachers_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`teachers_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`teachers_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`teachers_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`teachers_blocks_stat\`;`)
  await db.run(sql`DROP TABLE \`teachers_blocks_cards_items\`;`)
  await db.run(sql`DROP TABLE \`teachers_blocks_cards\`;`)
  await db.run(sql`DROP TABLE \`teachers\`;`)
  await db.run(sql`DROP TABLE \`teachers_rels\`;`)
  await db.run(sql`DROP TABLE \`_teachers_v_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`_teachers_v_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`_teachers_v_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`_teachers_v_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`_teachers_v_blocks_stat\`;`)
  await db.run(sql`DROP TABLE \`_teachers_v_blocks_cards_items\`;`)
  await db.run(sql`DROP TABLE \`_teachers_v_blocks_cards\`;`)
  await db.run(sql`DROP TABLE \`_teachers_v\`;`)
  await db.run(sql`DROP TABLE \`_teachers_v_rels\`;`)
  await db.run(sql`DROP TABLE \`faq_items_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`faq_items_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`faq_items_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`faq_items_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`faq_items_blocks_stat\`;`)
  await db.run(sql`DROP TABLE \`faq_items_blocks_cards_items\`;`)
  await db.run(sql`DROP TABLE \`faq_items_blocks_cards\`;`)
  await db.run(sql`DROP TABLE \`faq_items\`;`)
  await db.run(sql`DROP TABLE \`_faq_items_v_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`_faq_items_v_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`_faq_items_v_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`_faq_items_v_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`_faq_items_v_blocks_stat\`;`)
  await db.run(sql`DROP TABLE \`_faq_items_v_blocks_cards_items\`;`)
  await db.run(sql`DROP TABLE \`_faq_items_v_blocks_cards\`;`)
  await db.run(sql`DROP TABLE \`_faq_items_v\`;`)
  await db.run(sql`DROP TABLE \`reviews\`;`)
  await db.run(sql`DROP TABLE \`_reviews_v\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_stat\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_cards_items\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_cards\`;`)
  await db.run(sql`DROP TABLE \`news\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_stat\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_cards_items\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_cards\`;`)
  await db.run(sql`DROP TABLE \`_news_v\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_card_section_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_card_section\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_stat\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cards_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cards\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_article\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_video_videos\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_downloads_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_downloads\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages_texts\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_card_section_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_card_section\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_stat\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cards_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cards\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_article\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_video_videos\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_downloads_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_downloads\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_texts\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`site_settings_phones\`;`)
  await db.run(sql`DROP TABLE \`site_settings_socials\`;`)
  await db.run(sql`DROP TABLE \`site_settings_messenger_buttons\`;`)
  await db.run(sql`DROP TABLE \`site_settings_moyklass_api_filial_studio\`;`)
  await db.run(sql`DROP TABLE \`site_settings_documents\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`site_settings_texts\`;`)
  await db.run(sql`DROP TABLE \`site_settings_numbers\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_phones\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_socials\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_messenger_buttons\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_moyklass_api_filial_studio\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_documents\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_texts\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_numbers\`;`)
  await db.run(sql`DROP TABLE \`navigation_main_nav_children\`;`)
  await db.run(sql`DROP TABLE \`navigation_main_nav_columns_links\`;`)
  await db.run(sql`DROP TABLE \`navigation_main_nav_columns\`;`)
  await db.run(sql`DROP TABLE \`navigation_main_nav\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_nav_links\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_nav\`;`)
  await db.run(sql`DROP TABLE \`navigation_section_links\`;`)
  await db.run(sql`DROP TABLE \`navigation\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_main_nav_children\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_main_nav_columns_links\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_main_nav_columns\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_main_nav\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_nav_links\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_nav\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_section_links\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v\`;`)
  await db.run(sql`DROP TABLE \`direction_template_nav_links\`;`)
  await db.run(sql`DROP TABLE \`direction_template\`;`)
  await db.run(sql`DROP TABLE \`direction_template_rels\`;`)
  await db.run(sql`DROP TABLE \`_direction_template_v_version_nav_links\`;`)
  await db.run(sql`DROP TABLE \`_direction_template_v\`;`)
  await db.run(sql`DROP TABLE \`_direction_template_v_rels\`;`)
  await db.run(sql`DROP TABLE \`home_hero_heading_lines\`;`)
  await db.run(sql`DROP TABLE \`home_hero_socials\`;`)
  await db.run(sql`DROP TABLE \`home_directions_cards_bullets\`;`)
  await db.run(sql`DROP TABLE \`home_directions_cards\`;`)
  await db.run(sql`DROP TABLE \`home_learn_list\`;`)
  await db.run(sql`DROP TABLE \`home_advantages\`;`)
  await db.run(sql`DROP TABLE \`home_performances_videos\`;`)
  await db.run(sql`DROP TABLE \`home_gallery_tabs_videos\`;`)
  await db.run(sql`DROP TABLE \`home_gallery_tabs\`;`)
  await db.run(sql`DROP TABLE \`home\`;`)
  await db.run(sql`DROP TABLE \`home_rels\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_hero_heading_lines\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_hero_socials\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_directions_cards_bullets\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_directions_cards\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_learn_list\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_advantages\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_performances_videos\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_gallery_tabs_videos\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_gallery_tabs\`;`)
  await db.run(sql`DROP TABLE \`_home_v\`;`)
  await db.run(sql`DROP TABLE \`_home_v_rels\`;`)
  await db.run(sql`DROP TABLE \`home_faq_ask_buttons\`;`)
  await db.run(sql`DROP TABLE \`home_faq\`;`)
  await db.run(sql`DROP TABLE \`_home_faq_v_version_ask_buttons\`;`)
  await db.run(sql`DROP TABLE \`_home_faq_v\`;`)
  await db.run(sql`DROP TABLE \`tariffs_price_list_groups_columns\`;`)
  await db.run(sql`DROP TABLE \`tariffs_price_list_groups_rows_prices\`;`)
  await db.run(sql`DROP TABLE \`tariffs_price_list_groups_rows\`;`)
  await db.run(sql`DROP TABLE \`tariffs_price_list_groups\`;`)
  await db.run(sql`DROP TABLE \`tariffs_price_list_notes\`;`)
  await db.run(sql`DROP TABLE \`tariffs_discounts\`;`)
  await db.run(sql`DROP TABLE \`tariffs\`;`)
  await db.run(sql`DROP TABLE \`tariffs_texts\`;`)
  await db.run(sql`DROP TABLE \`tariffs_rels\`;`)
  await db.run(sql`DROP TABLE \`_tariffs_v_version_price_list_groups_columns\`;`)
  await db.run(sql`DROP TABLE \`_tariffs_v_version_price_list_groups_rows_prices\`;`)
  await db.run(sql`DROP TABLE \`_tariffs_v_version_price_list_groups_rows\`;`)
  await db.run(sql`DROP TABLE \`_tariffs_v_version_price_list_groups\`;`)
  await db.run(sql`DROP TABLE \`_tariffs_v_version_price_list_notes\`;`)
  await db.run(sql`DROP TABLE \`_tariffs_v_version_discounts\`;`)
  await db.run(sql`DROP TABLE \`_tariffs_v\`;`)
  await db.run(sql`DROP TABLE \`_tariffs_v_texts\`;`)
  await db.run(sql`DROP TABLE \`_tariffs_v_rels\`;`)
  await db.run(sql`DROP TABLE \`directions_index\`;`)
  await db.run(sql`DROP TABLE \`directions_index_texts\`;`)
  await db.run(sql`DROP TABLE \`directions_index_rels\`;`)
  await db.run(sql`DROP TABLE \`_directions_index_v\`;`)
  await db.run(sql`DROP TABLE \`_directions_index_v_texts\`;`)
  await db.run(sql`DROP TABLE \`_directions_index_v_rels\`;`)
  await db.run(sql`DROP TABLE \`team_page\`;`)
  await db.run(sql`DROP TABLE \`team_page_texts\`;`)
  await db.run(sql`DROP TABLE \`_team_page_v\`;`)
  await db.run(sql`DROP TABLE \`_team_page_v_texts\`;`)
  await db.run(sql`DROP TABLE \`reviews_page_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`reviews_page_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`reviews_page_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`reviews_page_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`reviews_page_blocks_stat\`;`)
  await db.run(sql`DROP TABLE \`reviews_page_blocks_cards_items\`;`)
  await db.run(sql`DROP TABLE \`reviews_page_blocks_cards\`;`)
  await db.run(sql`DROP TABLE \`reviews_page\`;`)
  await db.run(sql`DROP TABLE \`reviews_page_texts\`;`)
  await db.run(sql`DROP TABLE \`_reviews_page_v_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`_reviews_page_v_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`_reviews_page_v_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`_reviews_page_v_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`_reviews_page_v_blocks_stat\`;`)
  await db.run(sql`DROP TABLE \`_reviews_page_v_blocks_cards_items\`;`)
  await db.run(sql`DROP TABLE \`_reviews_page_v_blocks_cards\`;`)
  await db.run(sql`DROP TABLE \`_reviews_page_v\`;`)
  await db.run(sql`DROP TABLE \`_reviews_page_v_texts\`;`)
  await db.run(sql`DROP TABLE \`news_page_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`news_page_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`news_page_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`news_page_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`news_page_blocks_stat\`;`)
  await db.run(sql`DROP TABLE \`news_page_blocks_cards_items\`;`)
  await db.run(sql`DROP TABLE \`news_page_blocks_cards\`;`)
  await db.run(sql`DROP TABLE \`news_page_links\`;`)
  await db.run(sql`DROP TABLE \`news_page\`;`)
  await db.run(sql`DROP TABLE \`news_page_texts\`;`)
  await db.run(sql`DROP TABLE \`_news_page_v_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`_news_page_v_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`_news_page_v_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`_news_page_v_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`_news_page_v_blocks_stat\`;`)
  await db.run(sql`DROP TABLE \`_news_page_v_blocks_cards_items\`;`)
  await db.run(sql`DROP TABLE \`_news_page_v_blocks_cards\`;`)
  await db.run(sql`DROP TABLE \`_news_page_v_version_links\`;`)
  await db.run(sql`DROP TABLE \`_news_page_v\`;`)
  await db.run(sql`DROP TABLE \`_news_page_v_texts\`;`)
  await db.run(sql`DROP TABLE \`schedule_page\`;`)
  await db.run(sql`DROP TABLE \`schedule_page_texts\`;`)
  await db.run(sql`DROP TABLE \`_schedule_page_v\`;`)
  await db.run(sql`DROP TABLE \`_schedule_page_v_texts\`;`)
  await db.run(sql`DROP TABLE \`cover_entries\`;`)
  await db.run(sql`DROP TABLE \`cover\`;`)
  await db.run(sql`DROP TABLE \`_cover_v_version_entries\`;`)
  await db.run(sql`DROP TABLE \`_cover_v\`;`)
}
