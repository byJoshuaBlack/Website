import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`orders_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`product_id\` integer NOT NULL,
  	\`name\` text NOT NULL,
  	\`unit_price\` numeric NOT NULL,
  	\`quantity\` numeric NOT NULL,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`orders_items_order_idx\` ON \`orders_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`orders_items_parent_id_idx\` ON \`orders_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_items_product_idx\` ON \`orders_items\` (\`product_id\`);`)
  await db.run(sql`CREATE TABLE \`orders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`fulfilment\` text DEFAULT 'to-send' NOT NULL,
  	\`note\` text,
  	\`reference\` text NOT NULL,
  	\`status\` text DEFAULT 'awaiting' NOT NULL,
  	\`subtotal\` numeric NOT NULL,
  	\`delivery_fee\` numeric NOT NULL,
  	\`total\` numeric NOT NULL,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`customer_name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`phone\` text NOT NULL,
  	\`address\` text NOT NULL,
  	\`city\` text NOT NULL,
  	\`state\` text NOT NULL,
  	\`zone\` text NOT NULL,
  	\`payment_channel\` text,
  	\`payment_paid_at\` text,
  	\`payment_amount\` numeric,
  	\`emails_sent\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`orders_reference_idx\` ON \`orders\` (\`reference\`);`)
  await db.run(sql`CREATE INDEX \`orders_status_idx\` ON \`orders\` (\`status\`);`)
  await db.run(sql`CREATE INDEX \`orders_updated_at_idx\` ON \`orders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`orders_created_at_idx\` ON \`orders\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`stock\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`product_id\` integer NOT NULL,
  	\`quantity\` numeric DEFAULT 0 NOT NULL,
  	\`label\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`stock_product_idx\` ON \`stock\` (\`product_id\`);`)
  await db.run(sql`CREATE INDEX \`stock_updated_at_idx\` ON \`stock\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`stock_created_at_idx\` ON \`stock\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`policies_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`policies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`policies_blocks_paragraph_order_idx\` ON \`policies_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`policies_blocks_paragraph_parent_id_idx\` ON \`policies_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`policies_blocks_paragraph_path_idx\` ON \`policies_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`policies_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`policies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`policies_blocks_heading_order_idx\` ON \`policies_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`policies_blocks_heading_parent_id_idx\` ON \`policies_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`policies_blocks_heading_path_idx\` ON \`policies_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`policies_blocks_quote\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`cite\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`policies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`policies_blocks_quote_order_idx\` ON \`policies_blocks_quote\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`policies_blocks_quote_parent_id_idx\` ON \`policies_blocks_quote\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`policies_blocks_quote_path_idx\` ON \`policies_blocks_quote\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`policies_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`policies_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`policies_blocks_list_items_order_idx\` ON \`policies_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`policies_blocks_list_items_parent_id_idx\` ON \`policies_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`policies_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'bullet',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`policies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`policies_blocks_list_order_idx\` ON \`policies_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`policies_blocks_list_parent_id_idx\` ON \`policies_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`policies_blocks_list_path_idx\` ON \`policies_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`policies_blocks_pair_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`term\` text,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`policies_blocks_pair\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`policies_blocks_pair_items_order_idx\` ON \`policies_blocks_pair_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`policies_blocks_pair_items_parent_id_idx\` ON \`policies_blocks_pair_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`policies_blocks_pair\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`policies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`policies_blocks_pair_order_idx\` ON \`policies_blocks_pair\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`policies_blocks_pair_parent_id_idx\` ON \`policies_blocks_pair\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`policies_blocks_pair_path_idx\` ON \`policies_blocks_pair\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`policies_blocks_acronym_letters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`letter\` text,
  	\`word\` text,
  	\`text\` text,
  	\`example\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`policies_blocks_acronym\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`policies_blocks_acronym_letters_order_idx\` ON \`policies_blocks_acronym_letters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`policies_blocks_acronym_letters_parent_id_idx\` ON \`policies_blocks_acronym_letters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`policies_blocks_acronym\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`policies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`policies_blocks_acronym_order_idx\` ON \`policies_blocks_acronym\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`policies_blocks_acronym_parent_id_idx\` ON \`policies_blocks_acronym\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`policies_blocks_acronym_path_idx\` ON \`policies_blocks_acronym\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`policies\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`title\` text,
  	\`slug\` text,
  	\`summary\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE INDEX \`policies__order_idx\` ON \`policies\` (\`_order\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`policies_slug_idx\` ON \`policies\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`policies_updated_at_idx\` ON \`policies\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`policies_created_at_idx\` ON \`policies\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`policies__status_idx\` ON \`policies\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_policies_v_blocks_paragraph\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_policies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_paragraph_order_idx\` ON \`_policies_v_blocks_paragraph\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_paragraph_parent_id_idx\` ON \`_policies_v_blocks_paragraph\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_paragraph_path_idx\` ON \`_policies_v_blocks_paragraph\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_policies_v_blocks_heading\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_policies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_heading_order_idx\` ON \`_policies_v_blocks_heading\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_heading_parent_id_idx\` ON \`_policies_v_blocks_heading\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_heading_path_idx\` ON \`_policies_v_blocks_heading\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_policies_v_blocks_quote\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`cite\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_policies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_quote_order_idx\` ON \`_policies_v_blocks_quote\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_quote_parent_id_idx\` ON \`_policies_v_blocks_quote\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_quote_path_idx\` ON \`_policies_v_blocks_quote\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_policies_v_blocks_list_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_policies_v_blocks_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_list_items_order_idx\` ON \`_policies_v_blocks_list_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_list_items_parent_id_idx\` ON \`_policies_v_blocks_list_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_policies_v_blocks_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'bullet',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_policies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_list_order_idx\` ON \`_policies_v_blocks_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_list_parent_id_idx\` ON \`_policies_v_blocks_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_list_path_idx\` ON \`_policies_v_blocks_list\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_policies_v_blocks_pair_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`term\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_policies_v_blocks_pair\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_pair_items_order_idx\` ON \`_policies_v_blocks_pair_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_pair_items_parent_id_idx\` ON \`_policies_v_blocks_pair_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_policies_v_blocks_pair\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_policies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_pair_order_idx\` ON \`_policies_v_blocks_pair\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_pair_parent_id_idx\` ON \`_policies_v_blocks_pair\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_pair_path_idx\` ON \`_policies_v_blocks_pair\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_policies_v_blocks_acronym_letters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`letter\` text,
  	\`word\` text,
  	\`text\` text,
  	\`example\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_policies_v_blocks_acronym\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_acronym_letters_order_idx\` ON \`_policies_v_blocks_acronym_letters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_acronym_letters_parent_id_idx\` ON \`_policies_v_blocks_acronym_letters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_policies_v_blocks_acronym\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_policies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_acronym_order_idx\` ON \`_policies_v_blocks_acronym\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_acronym_parent_id_idx\` ON \`_policies_v_blocks_acronym\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_blocks_acronym_path_idx\` ON \`_policies_v_blocks_acronym\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_policies_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version__order\` text,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_summary\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`policies\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_policies_v_parent_idx\` ON \`_policies_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_version_version__order_idx\` ON \`_policies_v\` (\`version__order\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_version_version_slug_idx\` ON \`_policies_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_version_version_updated_at_idx\` ON \`_policies_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_version_version_created_at_idx\` ON \`_policies_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_version_version__status_idx\` ON \`_policies_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_created_at_idx\` ON \`_policies_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_updated_at_idx\` ON \`_policies_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_policies_v_latest_idx\` ON \`_policies_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`shop_settings_zones_states\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`shop_settings_zones\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`shop_settings_zones_states_order_idx\` ON \`shop_settings_zones_states\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`shop_settings_zones_states_parent_idx\` ON \`shop_settings_zones_states\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`shop_settings_zones\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`fee\` numeric NOT NULL,
  	\`everywhere_else\` integer,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`shop_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`shop_settings_zones_order_idx\` ON \`shop_settings_zones\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`shop_settings_zones_parent_id_idx\` ON \`shop_settings_zones\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`shop_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`status\` text DEFAULT 'closed' NOT NULL,
  	\`max_per_order\` numeric DEFAULT 5 NOT NULL,
  	\`alert_email\` text DEFAULT 'hi@byjoshuablack.com' NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`checkout\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`cart_proceed\` text,
  	\`cart_title\` text,
  	\`cart_pay_label\` text,
  	\`cart_intro\` text,
  	\`cart_empty\` text,
  	\`cart_continue_shopping\` text,
  	\`cart_remove\` text,
  	\`cart_quantity_label\` text,
  	\`cart_details_title\` text,
  	\`cart_price_note\` text,
  	\`cart_sold_out\` text,
  	\`cart_closed\` text,
  	\`form_first_name_label\` text,
  	\`form_last_name_label\` text,
  	\`form_email_label\` text,
  	\`form_country_code_label\` text,
  	\`form_email_invalid\` text,
  	\`form_phone_invalid\` text,
  	\`form_phone_label\` text,
  	\`form_address_label\` text,
  	\`form_city_label\` text,
  	\`form_state_label\` text,
  	\`form_subtotal_label\` text,
  	\`form_delivery_label\` text,
  	\`form_delivery_included\` text,
  	\`form_total_label\` text,
  	\`form_agreement\` text,
  	\`complete_paid_title\` text,
  	\`complete_paid_text\` text,
  	\`complete_failed_title\` text,
  	\`complete_failed_text\` text,
  	\`complete_pending_title\` text,
  	\`complete_pending_text\` text,
  	\`complete_retry_label\` text,
  	\`email_subject\` text,
  	\`email_intro\` text,
  	\`email_closing\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`checkout__status_idx\` ON \`checkout\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_checkout_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_cart_proceed\` text,
  	\`version_cart_title\` text,
  	\`version_cart_pay_label\` text,
  	\`version_cart_intro\` text,
  	\`version_cart_empty\` text,
  	\`version_cart_continue_shopping\` text,
  	\`version_cart_remove\` text,
  	\`version_cart_quantity_label\` text,
  	\`version_cart_details_title\` text,
  	\`version_cart_price_note\` text,
  	\`version_cart_sold_out\` text,
  	\`version_cart_closed\` text,
  	\`version_form_first_name_label\` text,
  	\`version_form_last_name_label\` text,
  	\`version_form_email_label\` text,
  	\`version_form_country_code_label\` text,
  	\`version_form_email_invalid\` text,
  	\`version_form_phone_invalid\` text,
  	\`version_form_phone_label\` text,
  	\`version_form_address_label\` text,
  	\`version_form_city_label\` text,
  	\`version_form_state_label\` text,
  	\`version_form_subtotal_label\` text,
  	\`version_form_delivery_label\` text,
  	\`version_form_delivery_included\` text,
  	\`version_form_total_label\` text,
  	\`version_form_agreement\` text,
  	\`version_complete_paid_title\` text,
  	\`version_complete_paid_text\` text,
  	\`version_complete_failed_title\` text,
  	\`version_complete_failed_text\` text,
  	\`version_complete_pending_title\` text,
  	\`version_complete_pending_text\` text,
  	\`version_complete_retry_label\` text,
  	\`version_email_subject\` text,
  	\`version_email_intro\` text,
  	\`version_email_closing\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_checkout_v_version_version__status_idx\` ON \`_checkout_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_checkout_v_created_at_idx\` ON \`_checkout_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_checkout_v_updated_at_idx\` ON \`_checkout_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_checkout_v_latest_idx\` ON \`_checkout_v\` (\`latest\`);`)
  await db.run(sql`ALTER TABLE \`products\` ADD \`price\` numeric;`)
  await db.run(sql`ALTER TABLE \`products\` ADD \`purchasable\` integer;`)
  await db.run(sql`ALTER TABLE \`_products_v\` ADD \`version_price\` numeric;`)
  await db.run(sql`ALTER TABLE \`_products_v\` ADD \`version_purchasable\` integer;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`orders_id\` integer REFERENCES orders(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`stock_id\` integer REFERENCES stock(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`policies_id\` integer REFERENCES policies(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_stock_id_idx\` ON \`payload_locked_documents_rels\` (\`stock_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_policies_id_idx\` ON \`payload_locked_documents_rels\` (\`policies_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`orders_items\`;`)
  await db.run(sql`DROP TABLE \`orders\`;`)
  await db.run(sql`DROP TABLE \`stock\`;`)
  await db.run(sql`DROP TABLE \`policies_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`policies_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`policies_blocks_quote\`;`)
  await db.run(sql`DROP TABLE \`policies_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`policies_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`policies_blocks_pair_items\`;`)
  await db.run(sql`DROP TABLE \`policies_blocks_pair\`;`)
  await db.run(sql`DROP TABLE \`policies_blocks_acronym_letters\`;`)
  await db.run(sql`DROP TABLE \`policies_blocks_acronym\`;`)
  await db.run(sql`DROP TABLE \`policies\`;`)
  await db.run(sql`DROP TABLE \`_policies_v_blocks_paragraph\`;`)
  await db.run(sql`DROP TABLE \`_policies_v_blocks_heading\`;`)
  await db.run(sql`DROP TABLE \`_policies_v_blocks_quote\`;`)
  await db.run(sql`DROP TABLE \`_policies_v_blocks_list_items\`;`)
  await db.run(sql`DROP TABLE \`_policies_v_blocks_list\`;`)
  await db.run(sql`DROP TABLE \`_policies_v_blocks_pair_items\`;`)
  await db.run(sql`DROP TABLE \`_policies_v_blocks_pair\`;`)
  await db.run(sql`DROP TABLE \`_policies_v_blocks_acronym_letters\`;`)
  await db.run(sql`DROP TABLE \`_policies_v_blocks_acronym\`;`)
  await db.run(sql`DROP TABLE \`_policies_v\`;`)
  await db.run(sql`DROP TABLE \`shop_settings_zones_states\`;`)
  await db.run(sql`DROP TABLE \`shop_settings_zones\`;`)
  await db.run(sql`DROP TABLE \`shop_settings\`;`)
  await db.run(sql`DROP TABLE \`checkout\`;`)
  await db.run(sql`DROP TABLE \`_checkout_v\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`products_id\` integer,
  	\`articles_id\` integer,
  	\`media_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "products_id", "articles_id", "media_id", "users_id") SELECT "id", "order", "parent_id", "path", "products_id", "articles_id", "media_id", "users_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`price\`;`)
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`purchasable\`;`)
  await db.run(sql`ALTER TABLE \`_products_v\` DROP COLUMN \`version_price\`;`)
  await db.run(sql`ALTER TABLE \`_products_v\` DROP COLUMN \`version_purchasable\`;`)
}
