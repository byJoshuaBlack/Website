import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`products_description\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`line\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_description_order_idx\` ON \`products_description\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_description_parent_id_idx\` ON \`products_description\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_details\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`line\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_details_order_idx\` ON \`products_details\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_details_parent_id_idx\` ON \`products_details\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_care\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`line\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_care_order_idx\` ON \`products_care\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_care_parent_id_idx\` ON \`products_care\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	\`crop_x\` numeric,
  	\`crop_y\` numeric,
  	\`crop_zoom\` numeric,
  	\`crop_top\` numeric,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_gallery_order_idx\` ON \`products_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_gallery_parent_id_idx\` ON \`products_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_gallery_image_idx\` ON \`products_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`name\` text,
  	\`slug\` text,
  	\`kind\` text DEFAULT 'piece',
  	\`number\` text,
  	\`descriptor\` text,
  	\`summary\` text,
  	\`tile_image_id\` integer,
  	\`tile_alt\` text,
  	\`tile_crop_x\` numeric,
  	\`tile_crop_y\` numeric,
  	\`tile_crop_zoom\` numeric,
  	\`tile_crop_top\` numeric,
  	\`needs_photo\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`tile_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`products__order_idx\` ON \`products\` (\`_order\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_tile_tile_image_idx\` ON \`products\` (\`tile_image_id\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`products__status_idx\` ON \`products\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_version_description\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`line\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_version_description_order_idx\` ON \`_products_v_version_description\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_description_parent_id_idx\` ON \`_products_v_version_description\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_version_details\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`line\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_version_details_order_idx\` ON \`_products_v_version_details\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_details_parent_id_idx\` ON \`_products_v_version_details\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_version_care\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`line\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_version_care_order_idx\` ON \`_products_v_version_care\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_care_parent_id_idx\` ON \`_products_v_version_care\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_version_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	\`crop_x\` numeric,
  	\`crop_y\` numeric,
  	\`crop_zoom\` numeric,
  	\`crop_top\` numeric,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_version_gallery_order_idx\` ON \`_products_v_version_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_gallery_parent_id_idx\` ON \`_products_v_version_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_gallery_image_idx\` ON \`_products_v_version_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version__order\` text,
  	\`version_name\` text,
  	\`version_slug\` text,
  	\`version_kind\` text DEFAULT 'piece',
  	\`version_number\` text,
  	\`version_descriptor\` text,
  	\`version_summary\` text,
  	\`version_tile_image_id\` integer,
  	\`version_tile_alt\` text,
  	\`version_tile_crop_x\` numeric,
  	\`version_tile_crop_y\` numeric,
  	\`version_tile_crop_zoom\` numeric,
  	\`version_tile_crop_top\` numeric,
  	\`version_needs_photo\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_tile_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_parent_idx\` ON \`_products_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version__order_idx\` ON \`_products_v\` (\`version__order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_slug_idx\` ON \`_products_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_tile_version_tile_image_idx\` ON \`_products_v\` (\`version_tile_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_updated_at_idx\` ON \`_products_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_created_at_idx\` ON \`_products_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version__status_idx\` ON \`_products_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_created_at_idx\` ON \`_products_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_updated_at_idx\` ON \`_products_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_latest_idx\` ON \`_products_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_paragraph_order_idx\` ON \`articles_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_paragraph_parent_id_idx\` ON \`articles_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_paragraph_path_idx\` ON \`articles_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_heading_order_idx\` ON \`articles_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_heading_parent_id_idx\` ON \`articles_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_heading_path_idx\` ON \`articles_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_quote\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`cite\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_quote_order_idx\` ON \`articles_blocks_quote\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_quote_parent_id_idx\` ON \`articles_blocks_quote\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_quote_path_idx\` ON \`articles_blocks_quote\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_list_items_order_idx\` ON \`articles_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_list_items_parent_id_idx\` ON \`articles_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'bullet',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_list_order_idx\` ON \`articles_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_list_parent_id_idx\` ON \`articles_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_list_path_idx\` ON \`articles_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_pair_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`term\` text,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_pair\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_pair_items_order_idx\` ON \`articles_blocks_pair_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_pair_items_parent_id_idx\` ON \`articles_blocks_pair_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_pair\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_pair_order_idx\` ON \`articles_blocks_pair\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_pair_parent_id_idx\` ON \`articles_blocks_pair\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_pair_path_idx\` ON \`articles_blocks_pair\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_acronym_letters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`letter\` text,
  	\`word\` text,
  	\`text\` text,
  	\`example\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_acronym\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_acronym_letters_order_idx\` ON \`articles_blocks_acronym_letters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_acronym_letters_parent_id_idx\` ON \`articles_blocks_acronym_letters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_acronym\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_acronym_order_idx\` ON \`articles_blocks_acronym\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_acronym_parent_id_idx\` ON \`articles_blocks_acronym\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_acronym_path_idx\` ON \`articles_blocks_acronym\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`articles\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`title\` text,
  	\`slug\` text,
  	\`kicker\` text,
  	\`excerpt\` text,
  	\`cover_image_id\` integer,
  	\`cover_alt\` text,
  	\`cover_crop_x\` numeric,
  	\`cover_crop_y\` numeric,
  	\`cover_crop_zoom\` numeric,
  	\`cover_crop_top\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`articles__order_idx\` ON \`articles\` (\`_order\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`articles_slug_idx\` ON \`articles\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`articles_cover_cover_image_idx\` ON \`articles\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_updated_at_idx\` ON \`articles\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`articles_created_at_idx\` ON \`articles\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`articles__status_idx\` ON \`articles\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`articles_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`products_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_rels_order_idx\` ON \`articles_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_parent_idx\` ON \`articles_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_path_idx\` ON \`articles_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_products_id_idx\` ON \`articles_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_paragraph_order_idx\` ON \`_articles_v_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_paragraph_parent_id_idx\` ON \`_articles_v_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_paragraph_path_idx\` ON \`_articles_v_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_heading_order_idx\` ON \`_articles_v_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_heading_parent_id_idx\` ON \`_articles_v_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_heading_path_idx\` ON \`_articles_v_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_quote\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`cite\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_quote_order_idx\` ON \`_articles_v_blocks_quote\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_quote_parent_id_idx\` ON \`_articles_v_blocks_quote\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_quote_path_idx\` ON \`_articles_v_blocks_quote\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_list_items_order_idx\` ON \`_articles_v_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_list_items_parent_id_idx\` ON \`_articles_v_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'bullet',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_list_order_idx\` ON \`_articles_v_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_list_parent_id_idx\` ON \`_articles_v_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_list_path_idx\` ON \`_articles_v_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_pair_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`term\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_pair\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_pair_items_order_idx\` ON \`_articles_v_blocks_pair_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_pair_items_parent_id_idx\` ON \`_articles_v_blocks_pair_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_pair\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_pair_order_idx\` ON \`_articles_v_blocks_pair\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_pair_parent_id_idx\` ON \`_articles_v_blocks_pair\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_pair_path_idx\` ON \`_articles_v_blocks_pair\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_acronym_letters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`letter\` text,
  	\`word\` text,
  	\`text\` text,
  	\`example\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_acronym\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_acronym_letters_order_idx\` ON \`_articles_v_blocks_acronym_letters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_acronym_letters_parent_id_idx\` ON \`_articles_v_blocks_acronym_letters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_acronym\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_acronym_order_idx\` ON \`_articles_v_blocks_acronym\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_acronym_parent_id_idx\` ON \`_articles_v_blocks_acronym\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_acronym_path_idx\` ON \`_articles_v_blocks_acronym\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version__order\` text,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_kicker\` text,
  	\`version_excerpt\` text,
  	\`version_cover_image_id\` integer,
  	\`version_cover_alt\` text,
  	\`version_cover_crop_x\` numeric,
  	\`version_cover_crop_y\` numeric,
  	\`version_cover_crop_zoom\` numeric,
  	\`version_cover_crop_top\` numeric,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_parent_idx\` ON \`_articles_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version__order_idx\` ON \`_articles_v\` (\`version__order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_slug_idx\` ON \`_articles_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_cover_version_cover_image_idx\` ON \`_articles_v\` (\`version_cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_updated_at_idx\` ON \`_articles_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_created_at_idx\` ON \`_articles_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version__status_idx\` ON \`_articles_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_created_at_idx\` ON \`_articles_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_updated_at_idx\` ON \`_articles_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_latest_idx\` ON \`_articles_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`products_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_order_idx\` ON \`_articles_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_parent_idx\` ON \`_articles_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_path_idx\` ON \`_articles_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_products_id_idx\` ON \`_articles_v_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_search_pages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`href\` text,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_search_pages_order_idx\` ON \`site_settings_search_pages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_search_pages_parent_id_idx\` ON \`site_settings_search_pages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`registration\` text,
  	\`tagline\` text,
  	\`description\` text,
  	\`show_prices\` integer,
  	\`contact_instagram_handle\` text,
  	\`contact_email\` text,
  	\`contact_facebook\` text,
  	\`contact_x\` text,
  	\`contact_linkedin\` text,
  	\`founder_name\` text,
  	\`founder_role\` text,
  	\`announcement_text\` text,
  	\`announcement_href\` text,
  	\`tile_hint\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings__status_idx\` ON \`site_settings\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_search_pages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`href\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_search_pages_order_idx\` ON \`_site_settings_v_version_search_pages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_search_pages_parent_id_idx\` ON \`_site_settings_v_version_search_pages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_name\` text,
  	\`version_registration\` text,
  	\`version_tagline\` text,
  	\`version_description\` text,
  	\`version_show_prices\` integer,
  	\`version_contact_instagram_handle\` text,
  	\`version_contact_email\` text,
  	\`version_contact_facebook\` text,
  	\`version_contact_x\` text,
  	\`version_contact_linkedin\` text,
  	\`version_founder_name\` text,
  	\`version_founder_role\` text,
  	\`version_announcement_text\` text,
  	\`version_announcement_href\` text,
  	\`version_tile_hint\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_version__status_idx\` ON \`_site_settings_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_created_at_idx\` ON \`_site_settings_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_updated_at_idx\` ON \`_site_settings_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_latest_idx\` ON \`_site_settings_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`navigation_menu_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_menu_links_order_idx\` ON \`navigation_menu_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_menu_links_parent_id_idx\` ON \`navigation_menu_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_footer_columns_links_order_idx\` ON \`navigation_footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_footer_columns_links_parent_id_idx\` ON \`navigation_footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_footer_columns_order_idx\` ON \`navigation_footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_footer_columns_parent_id_idx\` ON \`navigation_footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_suggestions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_suggestions_order_idx\` ON \`navigation_suggestions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_suggestions_parent_id_idx\` ON \`navigation_suggestions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`shop_link_label\` text,
  	\`shop_link_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation__status_idx\` ON \`navigation\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_menu_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_menu_links_order_idx\` ON \`_navigation_v_version_menu_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_menu_links_parent_id_idx\` ON \`_navigation_v_version_menu_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_columns_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_footer_columns\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_columns_links_order_idx\` ON \`_navigation_v_version_footer_columns_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_columns_links_parent_id_idx\` ON \`_navigation_v_version_footer_columns_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_columns_order_idx\` ON \`_navigation_v_version_footer_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_columns_parent_id_idx\` ON \`_navigation_v_version_footer_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_suggestions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_suggestions_order_idx\` ON \`_navigation_v_version_suggestions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_suggestions_parent_id_idx\` ON \`_navigation_v_version_suggestions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_shop_link_label\` text,
  	\`version_shop_link_href\` text,
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
  await db.run(sql`CREATE TABLE \`home_intro_accents\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`tone\` text DEFAULT 'bronze',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_intro_accents_order_idx\` ON \`home_intro_accents\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_intro_accents_parent_id_idx\` ON \`home_intro_accents\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_intro_body\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`line\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_intro_body_order_idx\` ON \`home_intro_body\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_intro_body_parent_id_idx\` ON \`home_intro_body\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_intro_rise\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`line\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_intro_rise_order_idx\` ON \`home_intro_rise\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_intro_rise_parent_id_idx\` ON \`home_intro_rise\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_pocket_power_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`line\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_pocket_power_lines_order_idx\` ON \`home_pocket_power_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_pocket_power_lines_parent_id_idx\` ON \`home_pocket_power_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_pocket_power_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	\`crop_x\` numeric,
  	\`crop_y\` numeric,
  	\`crop_zoom\` numeric,
  	\`crop_top\` numeric,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_pocket_power_images_order_idx\` ON \`home_pocket_power_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_pocket_power_images_parent_id_idx\` ON \`home_pocket_power_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_pocket_power_images_image_idx\` ON \`home_pocket_power_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`home\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`intro_title\` text,
  	\`intro_link_label\` text,
  	\`intro_link_href\` text,
  	\`intro_image_image_id\` integer,
  	\`intro_image_alt\` text,
  	\`intro_image_crop_x\` numeric,
  	\`intro_image_crop_y\` numeric,
  	\`intro_image_crop_zoom\` numeric,
  	\`intro_image_crop_top\` numeric,
  	\`pocket_power_kicker\` text,
  	\`pocket_power_highlight\` text,
  	\`pocket_power_accent\` text,
  	\`pocket_power_body\` text,
  	\`pocket_power_cta_label\` text,
  	\`pocket_power_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`intro_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`home_intro_image_intro_image_image_idx\` ON \`home\` (\`intro_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`home__status_idx\` ON \`home\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_intro_accents\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`tone\` text DEFAULT 'bronze',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_intro_accents_order_idx\` ON \`_home_v_version_intro_accents\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_intro_accents_parent_id_idx\` ON \`_home_v_version_intro_accents\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_intro_body\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`line\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_intro_body_order_idx\` ON \`_home_v_version_intro_body\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_intro_body_parent_id_idx\` ON \`_home_v_version_intro_body\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_intro_rise\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`line\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_intro_rise_order_idx\` ON \`_home_v_version_intro_rise\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_intro_rise_parent_id_idx\` ON \`_home_v_version_intro_rise\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_pocket_power_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`line\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_pocket_power_lines_order_idx\` ON \`_home_v_version_pocket_power_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_pocket_power_lines_parent_id_idx\` ON \`_home_v_version_pocket_power_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v_version_pocket_power_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	\`crop_x\` numeric,
  	\`crop_y\` numeric,
  	\`crop_zoom\` numeric,
  	\`crop_top\` numeric,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_pocket_power_images_order_idx\` ON \`_home_v_version_pocket_power_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_pocket_power_images_parent_id_idx\` ON \`_home_v_version_pocket_power_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_pocket_power_images_image_idx\` ON \`_home_v_version_pocket_power_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_intro_title\` text,
  	\`version_intro_link_label\` text,
  	\`version_intro_link_href\` text,
  	\`version_intro_image_image_id\` integer,
  	\`version_intro_image_alt\` text,
  	\`version_intro_image_crop_x\` numeric,
  	\`version_intro_image_crop_y\` numeric,
  	\`version_intro_image_crop_zoom\` numeric,
  	\`version_intro_image_crop_top\` numeric,
  	\`version_pocket_power_kicker\` text,
  	\`version_pocket_power_highlight\` text,
  	\`version_pocket_power_accent\` text,
  	\`version_pocket_power_body\` text,
  	\`version_pocket_power_cta_label\` text,
  	\`version_pocket_power_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_intro_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_v_version_intro_image_version_intro_image_image_idx\` ON \`_home_v\` (\`version_intro_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_version_version__status_idx\` ON \`_home_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_created_at_idx\` ON \`_home_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_updated_at_idx\` ON \`_home_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_v_latest_idx\` ON \`_home_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`collection_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`intro\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`collection_page__status_idx\` ON \`collection_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_collection_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_title\` text,
  	\`version_intro\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_collection_page_v_version_version__status_idx\` ON \`_collection_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_collection_page_v_created_at_idx\` ON \`_collection_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_collection_page_v_updated_at_idx\` ON \`_collection_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_collection_page_v_latest_idx\` ON \`_collection_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`traditional_welcome_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`line\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`traditional\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`traditional_welcome_lines_order_idx\` ON \`traditional_welcome_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`traditional_welcome_lines_parent_id_idx\` ON \`traditional_welcome_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`traditional_welcome_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`traditional\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`traditional_welcome_links_order_idx\` ON \`traditional_welcome_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`traditional_welcome_links_parent_id_idx\` ON \`traditional_welcome_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`traditional_colours_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`image_image_id\` integer,
  	\`image_alt\` text,
  	\`image_crop_x\` numeric,
  	\`image_crop_y\` numeric,
  	\`image_crop_zoom\` numeric,
  	\`image_crop_top\` numeric,
  	FOREIGN KEY (\`image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`traditional\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`traditional_colours_items_order_idx\` ON \`traditional_colours_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`traditional_colours_items_parent_id_idx\` ON \`traditional_colours_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`traditional_colours_items_image_image_image_idx\` ON \`traditional_colours_items\` (\`image_image_id\`);`)
  await db.run(sql`CREATE TABLE \`traditional\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`intro\` text,
  	\`card_name\` text,
  	\`card_descriptor\` text,
  	\`card_link\` text,
  	\`card_image_image_id\` integer,
  	\`card_image_alt\` text,
  	\`card_image_crop_x\` numeric,
  	\`card_image_crop_y\` numeric,
  	\`card_image_crop_zoom\` numeric,
  	\`card_image_crop_top\` numeric,
  	\`welcome_kicker\` text,
  	\`welcome_highlight\` text,
  	\`welcome_accent\` text,
  	\`welcome_body\` text,
  	\`welcome_image_image_id\` integer,
  	\`welcome_image_alt\` text,
  	\`welcome_image_crop_x\` numeric,
  	\`welcome_image_crop_y\` numeric,
  	\`welcome_image_crop_zoom\` numeric,
  	\`welcome_image_crop_top\` numeric,
  	\`colours_title\` text,
  	\`colours_intro\` text,
  	\`order_title\` text,
  	\`order_text\` text,
  	\`order_image_image_id\` integer,
  	\`order_image_alt\` text,
  	\`order_image_crop_x\` numeric,
  	\`order_image_crop_y\` numeric,
  	\`order_image_crop_zoom\` numeric,
  	\`order_image_crop_top\` numeric,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`card_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`welcome_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`order_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`traditional_card_image_card_image_image_idx\` ON \`traditional\` (\`card_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`traditional_welcome_image_welcome_image_image_idx\` ON \`traditional\` (\`welcome_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`traditional_order_image_order_image_image_idx\` ON \`traditional\` (\`order_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`traditional__status_idx\` ON \`traditional\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_traditional_v_version_welcome_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`line\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_traditional_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_traditional_v_version_welcome_lines_order_idx\` ON \`_traditional_v_version_welcome_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_traditional_v_version_welcome_lines_parent_id_idx\` ON \`_traditional_v_version_welcome_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_traditional_v_version_welcome_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_traditional_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_traditional_v_version_welcome_links_order_idx\` ON \`_traditional_v_version_welcome_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_traditional_v_version_welcome_links_parent_id_idx\` ON \`_traditional_v_version_welcome_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_traditional_v_version_colours_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`image_image_id\` integer,
  	\`image_alt\` text,
  	\`image_crop_x\` numeric,
  	\`image_crop_y\` numeric,
  	\`image_crop_zoom\` numeric,
  	\`image_crop_top\` numeric,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_traditional_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_traditional_v_version_colours_items_order_idx\` ON \`_traditional_v_version_colours_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_traditional_v_version_colours_items_parent_id_idx\` ON \`_traditional_v_version_colours_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_traditional_v_version_colours_items_image_image_image_idx\` ON \`_traditional_v_version_colours_items\` (\`image_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_traditional_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_title\` text,
  	\`version_intro\` text,
  	\`version_card_name\` text,
  	\`version_card_descriptor\` text,
  	\`version_card_link\` text,
  	\`version_card_image_image_id\` integer,
  	\`version_card_image_alt\` text,
  	\`version_card_image_crop_x\` numeric,
  	\`version_card_image_crop_y\` numeric,
  	\`version_card_image_crop_zoom\` numeric,
  	\`version_card_image_crop_top\` numeric,
  	\`version_welcome_kicker\` text,
  	\`version_welcome_highlight\` text,
  	\`version_welcome_accent\` text,
  	\`version_welcome_body\` text,
  	\`version_welcome_image_image_id\` integer,
  	\`version_welcome_image_alt\` text,
  	\`version_welcome_image_crop_x\` numeric,
  	\`version_welcome_image_crop_y\` numeric,
  	\`version_welcome_image_crop_zoom\` numeric,
  	\`version_welcome_image_crop_top\` numeric,
  	\`version_colours_title\` text,
  	\`version_colours_intro\` text,
  	\`version_order_title\` text,
  	\`version_order_text\` text,
  	\`version_order_image_image_id\` integer,
  	\`version_order_image_alt\` text,
  	\`version_order_image_crop_x\` numeric,
  	\`version_order_image_crop_y\` numeric,
  	\`version_order_image_crop_zoom\` numeric,
  	\`version_order_image_crop_top\` numeric,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_card_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_welcome_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_order_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_traditional_v_version_card_image_version_card_image_ima_idx\` ON \`_traditional_v\` (\`version_card_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_traditional_v_version_welcome_image_version_welcome_ima_idx\` ON \`_traditional_v\` (\`version_welcome_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_traditional_v_version_order_image_version_order_image_i_idx\` ON \`_traditional_v\` (\`version_order_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_traditional_v_version_version__status_idx\` ON \`_traditional_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_traditional_v_created_at_idx\` ON \`_traditional_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_traditional_v_updated_at_idx\` ON \`_traditional_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_traditional_v_latest_idx\` ON \`_traditional_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`style_guide_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`intro\` text,
  	\`hero_image_id\` integer,
  	\`hero_alt\` text,
  	\`hero_crop_x\` numeric,
  	\`hero_crop_y\` numeric,
  	\`hero_crop_zoom\` numeric,
  	\`hero_crop_top\` numeric,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`style_guide_page_hero_hero_image_idx\` ON \`style_guide_page\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`style_guide_page__status_idx\` ON \`style_guide_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_style_guide_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_title\` text,
  	\`version_intro\` text,
  	\`version_hero_image_id\` integer,
  	\`version_hero_alt\` text,
  	\`version_hero_crop_x\` numeric,
  	\`version_hero_crop_y\` numeric,
  	\`version_hero_crop_zoom\` numeric,
  	\`version_hero_crop_top\` numeric,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_style_guide_page_v_version_hero_version_hero_image_idx\` ON \`_style_guide_page_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_style_guide_page_v_version_version__status_idx\` ON \`_style_guide_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_style_guide_page_v_created_at_idx\` ON \`_style_guide_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_style_guide_page_v_updated_at_idx\` ON \`_style_guide_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_style_guide_page_v_latest_idx\` ON \`_style_guide_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`world_name_parts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`term\` text,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`world\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`world_name_parts_order_idx\` ON \`world_name_parts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`world_name_parts_parent_id_idx\` ON \`world_name_parts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`world_founder_paragraphs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`line\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`world\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`world_founder_paragraphs_order_idx\` ON \`world_founder_paragraphs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`world_founder_paragraphs_parent_id_idx\` ON \`world_founder_paragraphs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`world_timeline_events\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`date\` text,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`world\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`world_timeline_events_order_idx\` ON \`world_timeline_events\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`world_timeline_events_parent_id_idx\` ON \`world_timeline_events\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`world_closing_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`line\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`world\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`world_closing_lines_order_idx\` ON \`world_closing_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`world_closing_lines_parent_id_idx\` ON \`world_closing_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`world_closing_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`world\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`world_closing_links_order_idx\` ON \`world_closing_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`world_closing_links_parent_id_idx\` ON \`world_closing_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`world\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_kicker\` text,
  	\`hero_title\` text,
  	\`hero_image_image_id\` integer,
  	\`hero_image_alt\` text,
  	\`hero_image_crop_x\` numeric,
  	\`hero_image_crop_y\` numeric,
  	\`hero_image_crop_zoom\` numeric,
  	\`hero_image_crop_top\` numeric,
  	\`name_intro\` text,
  	\`name_together\` text,
  	\`founder_title\` text,
  	\`founder_quote\` text,
  	\`founder_image_image_id\` integer,
  	\`founder_image_alt\` text,
  	\`founder_image_crop_x\` numeric,
  	\`founder_image_crop_y\` numeric,
  	\`founder_image_crop_zoom\` numeric,
  	\`founder_image_crop_top\` numeric,
  	\`timeline_title\` text,
  	\`timeline_image_image_id\` integer,
  	\`timeline_image_alt\` text,
  	\`timeline_image_crop_x\` numeric,
  	\`timeline_image_crop_y\` numeric,
  	\`timeline_image_crop_zoom\` numeric,
  	\`timeline_image_crop_top\` numeric,
  	\`closing_highlight\` text,
  	\`closing_accent\` text,
  	\`closing_image_image_id\` integer,
  	\`closing_image_alt\` text,
  	\`closing_image_crop_x\` numeric,
  	\`closing_image_crop_y\` numeric,
  	\`closing_image_crop_zoom\` numeric,
  	\`closing_image_crop_top\` numeric,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`founder_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`timeline_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`closing_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`world_hero_image_hero_image_image_idx\` ON \`world\` (\`hero_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`world_founder_image_founder_image_image_idx\` ON \`world\` (\`founder_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`world_timeline_image_timeline_image_image_idx\` ON \`world\` (\`timeline_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`world_closing_image_closing_image_image_idx\` ON \`world\` (\`closing_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`world__status_idx\` ON \`world\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_world_v_version_name_parts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`term\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_world_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_world_v_version_name_parts_order_idx\` ON \`_world_v_version_name_parts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_world_v_version_name_parts_parent_id_idx\` ON \`_world_v_version_name_parts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_world_v_version_founder_paragraphs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`line\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_world_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_world_v_version_founder_paragraphs_order_idx\` ON \`_world_v_version_founder_paragraphs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_world_v_version_founder_paragraphs_parent_id_idx\` ON \`_world_v_version_founder_paragraphs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_world_v_version_timeline_events\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`date\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_world_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_world_v_version_timeline_events_order_idx\` ON \`_world_v_version_timeline_events\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_world_v_version_timeline_events_parent_id_idx\` ON \`_world_v_version_timeline_events\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_world_v_version_closing_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`line\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_world_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_world_v_version_closing_lines_order_idx\` ON \`_world_v_version_closing_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_world_v_version_closing_lines_parent_id_idx\` ON \`_world_v_version_closing_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_world_v_version_closing_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_world_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_world_v_version_closing_links_order_idx\` ON \`_world_v_version_closing_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_world_v_version_closing_links_parent_id_idx\` ON \`_world_v_version_closing_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_world_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_kicker\` text,
  	\`version_hero_title\` text,
  	\`version_hero_image_image_id\` integer,
  	\`version_hero_image_alt\` text,
  	\`version_hero_image_crop_x\` numeric,
  	\`version_hero_image_crop_y\` numeric,
  	\`version_hero_image_crop_zoom\` numeric,
  	\`version_hero_image_crop_top\` numeric,
  	\`version_name_intro\` text,
  	\`version_name_together\` text,
  	\`version_founder_title\` text,
  	\`version_founder_quote\` text,
  	\`version_founder_image_image_id\` integer,
  	\`version_founder_image_alt\` text,
  	\`version_founder_image_crop_x\` numeric,
  	\`version_founder_image_crop_y\` numeric,
  	\`version_founder_image_crop_zoom\` numeric,
  	\`version_founder_image_crop_top\` numeric,
  	\`version_timeline_title\` text,
  	\`version_timeline_image_image_id\` integer,
  	\`version_timeline_image_alt\` text,
  	\`version_timeline_image_crop_x\` numeric,
  	\`version_timeline_image_crop_y\` numeric,
  	\`version_timeline_image_crop_zoom\` numeric,
  	\`version_timeline_image_crop_top\` numeric,
  	\`version_closing_highlight\` text,
  	\`version_closing_accent\` text,
  	\`version_closing_image_image_id\` integer,
  	\`version_closing_image_alt\` text,
  	\`version_closing_image_crop_x\` numeric,
  	\`version_closing_image_crop_y\` numeric,
  	\`version_closing_image_crop_zoom\` numeric,
  	\`version_closing_image_crop_top\` numeric,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_hero_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_founder_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_timeline_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_closing_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_world_v_version_hero_image_version_hero_image_image_idx\` ON \`_world_v\` (\`version_hero_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_world_v_version_founder_image_version_founder_image_ima_idx\` ON \`_world_v\` (\`version_founder_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_world_v_version_timeline_image_version_timeline_image_i_idx\` ON \`_world_v\` (\`version_timeline_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_world_v_version_closing_image_version_closing_image_ima_idx\` ON \`_world_v\` (\`version_closing_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_world_v_version_version__status_idx\` ON \`_world_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_world_v_created_at_idx\` ON \`_world_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_world_v_updated_at_idx\` ON \`_world_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_world_v_latest_idx\` ON \`_world_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`store_notice\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`status\` text,
  	\`note\` text,
  	\`details\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`store_notice__status_idx\` ON \`store_notice\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_store_notice_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_status\` text,
  	\`version_note\` text,
  	\`version_details\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_store_notice_v_version_version__status_idx\` ON \`_store_notice_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_store_notice_v_created_at_idx\` ON \`_store_notice_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_store_notice_v_updated_at_idx\` ON \`_store_notice_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_store_notice_v_latest_idx\` ON \`_store_notice_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`ordering_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ordering\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`ordering_steps_order_idx\` ON \`ordering_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`ordering_steps_parent_id_idx\` ON \`ordering_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`ordering\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`intro\` text,
  	\`steps_title\` text,
  	\`image_image_id\` integer,
  	\`image_alt\` text,
  	\`image_crop_x\` numeric,
  	\`image_crop_y\` numeric,
  	\`image_crop_zoom\` numeric,
  	\`image_crop_top\` numeric,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`ordering_image_image_image_idx\` ON \`ordering\` (\`image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`ordering__status_idx\` ON \`ordering\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_ordering_v_version_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ordering_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_ordering_v_version_steps_order_idx\` ON \`_ordering_v_version_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_ordering_v_version_steps_parent_id_idx\` ON \`_ordering_v_version_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_ordering_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_title\` text,
  	\`version_intro\` text,
  	\`version_steps_title\` text,
  	\`version_image_image_id\` integer,
  	\`version_image_alt\` text,
  	\`version_image_crop_x\` numeric,
  	\`version_image_crop_y\` numeric,
  	\`version_image_crop_zoom\` numeric,
  	\`version_image_crop_top\` numeric,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_ordering_v_version_image_version_image_image_idx\` ON \`_ordering_v\` (\`version_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_ordering_v_version_version__status_idx\` ON \`_ordering_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_ordering_v_created_at_idx\` ON \`_ordering_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_ordering_v_updated_at_idx\` ON \`_ordering_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_ordering_v_latest_idx\` ON \`_ordering_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`contact\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`intro\` text,
  	\`cta\` text,
  	\`email_cta\` text,
  	\`email_hint\` text,
  	\`copied\` text,
  	\`image_image_id\` integer,
  	\`image_alt\` text,
  	\`image_crop_x\` numeric,
  	\`image_crop_y\` numeric,
  	\`image_crop_zoom\` numeric,
  	\`image_crop_top\` numeric,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_image_image_image_idx\` ON \`contact\` (\`image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`contact__status_idx\` ON \`contact\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_contact_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_title\` text,
  	\`version_intro\` text,
  	\`version_cta\` text,
  	\`version_email_cta\` text,
  	\`version_email_hint\` text,
  	\`version_copied\` text,
  	\`version_image_image_id\` integer,
  	\`version_image_alt\` text,
  	\`version_image_crop_x\` numeric,
  	\`version_image_crop_y\` numeric,
  	\`version_image_crop_zoom\` numeric,
  	\`version_image_crop_top\` numeric,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_image_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_v_version_image_version_image_image_idx\` ON \`_contact_v\` (\`version_image_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_contact_v_version_version__status_idx\` ON \`_contact_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_contact_v_created_at_idx\` ON \`_contact_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_contact_v_updated_at_idx\` ON \`_contact_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_contact_v_latest_idx\` ON \`_contact_v\` (\`latest\`);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`role\` text DEFAULT 'editor' NOT NULL;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`key\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`blur_data_u_r_l\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_key_idx\` ON \`media\` (\`key\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`products_id\` integer REFERENCES products(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`articles_id\` integer REFERENCES articles(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`products_description\`;`)
  await db.run(sql`DROP TABLE \`products_details\`;`)
  await db.run(sql`DROP TABLE \`products_care\`;`)
  await db.run(sql`DROP TABLE \`products_gallery\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`DROP TABLE \`_products_v_version_description\`;`)
  await db.run(sql`DROP TABLE \`_products_v_version_details\`;`)
  await db.run(sql`DROP TABLE \`_products_v_version_care\`;`)
  await db.run(sql`DROP TABLE \`_products_v_version_gallery\`;`)
  await db.run(sql`DROP TABLE \`_products_v\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_quote\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_pair_items\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_pair\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_acronym_letters\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_acronym\`;`)
  await db.run(sql`DROP TABLE \`articles\`;`)
  await db.run(sql`DROP TABLE \`articles_rels\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_quote\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_pair_items\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_pair\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_acronym_letters\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_acronym\`;`)
  await db.run(sql`DROP TABLE \`_articles_v\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_rels\`;`)
  await db.run(sql`DROP TABLE \`site_settings_search_pages\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_search_pages\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v\`;`)
  await db.run(sql`DROP TABLE \`navigation_menu_links\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_columns\`;`)
  await db.run(sql`DROP TABLE \`navigation_suggestions\`;`)
  await db.run(sql`DROP TABLE \`navigation\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_menu_links\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_columns_links\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_columns\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_suggestions\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v\`;`)
  await db.run(sql`DROP TABLE \`home_intro_accents\`;`)
  await db.run(sql`DROP TABLE \`home_intro_body\`;`)
  await db.run(sql`DROP TABLE \`home_intro_rise\`;`)
  await db.run(sql`DROP TABLE \`home_pocket_power_lines\`;`)
  await db.run(sql`DROP TABLE \`home_pocket_power_images\`;`)
  await db.run(sql`DROP TABLE \`home\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_intro_accents\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_intro_body\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_intro_rise\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_pocket_power_lines\`;`)
  await db.run(sql`DROP TABLE \`_home_v_version_pocket_power_images\`;`)
  await db.run(sql`DROP TABLE \`_home_v\`;`)
  await db.run(sql`DROP TABLE \`collection_page\`;`)
  await db.run(sql`DROP TABLE \`_collection_page_v\`;`)
  await db.run(sql`DROP TABLE \`traditional_welcome_lines\`;`)
  await db.run(sql`DROP TABLE \`traditional_welcome_links\`;`)
  await db.run(sql`DROP TABLE \`traditional_colours_items\`;`)
  await db.run(sql`DROP TABLE \`traditional\`;`)
  await db.run(sql`DROP TABLE \`_traditional_v_version_welcome_lines\`;`)
  await db.run(sql`DROP TABLE \`_traditional_v_version_welcome_links\`;`)
  await db.run(sql`DROP TABLE \`_traditional_v_version_colours_items\`;`)
  await db.run(sql`DROP TABLE \`_traditional_v\`;`)
  await db.run(sql`DROP TABLE \`style_guide_page\`;`)
  await db.run(sql`DROP TABLE \`_style_guide_page_v\`;`)
  await db.run(sql`DROP TABLE \`world_name_parts\`;`)
  await db.run(sql`DROP TABLE \`world_founder_paragraphs\`;`)
  await db.run(sql`DROP TABLE \`world_timeline_events\`;`)
  await db.run(sql`DROP TABLE \`world_closing_lines\`;`)
  await db.run(sql`DROP TABLE \`world_closing_links\`;`)
  await db.run(sql`DROP TABLE \`world\`;`)
  await db.run(sql`DROP TABLE \`_world_v_version_name_parts\`;`)
  await db.run(sql`DROP TABLE \`_world_v_version_founder_paragraphs\`;`)
  await db.run(sql`DROP TABLE \`_world_v_version_timeline_events\`;`)
  await db.run(sql`DROP TABLE \`_world_v_version_closing_lines\`;`)
  await db.run(sql`DROP TABLE \`_world_v_version_closing_links\`;`)
  await db.run(sql`DROP TABLE \`_world_v\`;`)
  await db.run(sql`DROP TABLE \`store_notice\`;`)
  await db.run(sql`DROP TABLE \`_store_notice_v\`;`)
  await db.run(sql`DROP TABLE \`ordering_steps\`;`)
  await db.run(sql`DROP TABLE \`ordering\`;`)
  await db.run(sql`DROP TABLE \`_ordering_v_version_steps\`;`)
  await db.run(sql`DROP TABLE \`_ordering_v\`;`)
  await db.run(sql`DROP TABLE \`contact\`;`)
  await db.run(sql`DROP TABLE \`_contact_v\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`DROP INDEX \`media_key_idx\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`key\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`blur_data_u_r_l\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`role\`;`)
}
