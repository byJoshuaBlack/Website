import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`checkout\` ADD \`complete_redirect_text\` text;`)
  await db.run(sql`ALTER TABLE \`checkout\` ADD \`complete_home_label\` text;`)
  await db.run(sql`ALTER TABLE \`_checkout_v\` ADD \`version_complete_redirect_text\` text;`)
  await db.run(sql`ALTER TABLE \`_checkout_v\` ADD \`version_complete_home_label\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`checkout\` DROP COLUMN \`complete_redirect_text\`;`)
  await db.run(sql`ALTER TABLE \`checkout\` DROP COLUMN \`complete_home_label\`;`)
  await db.run(sql`ALTER TABLE \`_checkout_v\` DROP COLUMN \`version_complete_redirect_text\`;`)
  await db.run(sql`ALTER TABLE \`_checkout_v\` DROP COLUMN \`version_complete_home_label\`;`)
}
