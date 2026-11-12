import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`shop_settings_alert_emails\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`email\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`shop_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`shop_settings_alert_emails_order_idx\` ON \`shop_settings_alert_emails\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`shop_settings_alert_emails_parent_id_idx\` ON \`shop_settings_alert_emails\` (\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`shop_settings_alert_emails\`;`)
}
