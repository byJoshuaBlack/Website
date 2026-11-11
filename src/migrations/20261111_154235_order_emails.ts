import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`shop_settings_zones\` ADD \`estimate\` text;`)
  await db.run(sql`ALTER TABLE \`checkout\` ADD \`email_estimate_label\` text;`)
  await db.run(sql`ALTER TABLE \`checkout\` ADD \`email_invoice_note\` text;`)
  await db.run(sql`ALTER TABLE \`_checkout_v\` ADD \`version_email_estimate_label\` text;`)
  await db.run(sql`ALTER TABLE \`_checkout_v\` ADD \`version_email_invoice_note\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`shop_settings_zones\` DROP COLUMN \`estimate\`;`)
  await db.run(sql`ALTER TABLE \`checkout\` DROP COLUMN \`email_estimate_label\`;`)
  await db.run(sql`ALTER TABLE \`checkout\` DROP COLUMN \`email_invoice_note\`;`)
  await db.run(sql`ALTER TABLE \`_checkout_v\` DROP COLUMN \`version_email_estimate_label\`;`)
  await db.run(sql`ALTER TABLE \`_checkout_v\` DROP COLUMN \`version_email_invoice_note\`;`)
}
