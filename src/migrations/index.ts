import * as migration_20261109_143000_initial from './20261109_143000_initial';
import * as migration_20261110_060002_content_schema from './20261110_060002_content_schema';
import * as migration_20261110_070000_seed_content from './20261110_070000_seed_content';
import * as migration_20261110_090018_store from './20261110_090018_store';
import * as migration_20261110_090100_store_defaults from './20261110_090100_store_defaults';
import * as migration_20261110_100000_store_policy from './20261110_100000_store_policy';
import * as migration_20261111_145134_payment_completed from './20261111_145134_payment_completed';
import * as migration_20261111_145200_payment_completed_copy from './20261111_145200_payment_completed_copy';
import * as migration_20261111_154235_order_emails from './20261111_154235_order_emails';
import * as migration_20261111_154300_order_emails_copy from './20261111_154300_order_emails_copy';
import * as migration_20261112_090000_order_email_wording from './20261112_090000_order_email_wording';
import * as migration_20261112_101454_order_alert_addresses from './20261112_101454_order_alert_addresses';
import * as migration_20261112_120000_checkout_labels from './20261112_120000_checkout_labels';

export const migrations = [
  {
    up: migration_20261109_143000_initial.up,
    down: migration_20261109_143000_initial.down,
    name: '20261109_143000_initial',
  },
  {
    up: migration_20261110_060002_content_schema.up,
    down: migration_20261110_060002_content_schema.down,
    name: '20261110_060002_content_schema',
  },
  {
    up: migration_20261110_070000_seed_content.up,
    down: migration_20261110_070000_seed_content.down,
    name: '20261110_070000_seed_content',
  },
  {
    up: migration_20261110_090018_store.up,
    down: migration_20261110_090018_store.down,
    name: '20261110_090018_store',
  },
  {
    up: migration_20261110_090100_store_defaults.up,
    down: migration_20261110_090100_store_defaults.down,
    name: '20261110_090100_store_defaults',
  },
  {
    up: migration_20261110_100000_store_policy.up,
    down: migration_20261110_100000_store_policy.down,
    name: '20261110_100000_store_policy',
  },
  {
    up: migration_20261111_145134_payment_completed.up,
    down: migration_20261111_145134_payment_completed.down,
    name: '20261111_145134_payment_completed',
  },
  {
    up: migration_20261111_145200_payment_completed_copy.up,
    down: migration_20261111_145200_payment_completed_copy.down,
    name: '20261111_145200_payment_completed_copy',
  },
  {
    up: migration_20261111_154235_order_emails.up,
    down: migration_20261111_154235_order_emails.down,
    name: '20261111_154235_order_emails',
  },
  {
    up: migration_20261111_154300_order_emails_copy.up,
    down: migration_20261111_154300_order_emails_copy.down,
    name: '20261111_154300_order_emails_copy',
  },
  {
    up: migration_20261112_090000_order_email_wording.up,
    down: migration_20261112_090000_order_email_wording.down,
    name: '20261112_090000_order_email_wording',
  },
  {
    up: migration_20261112_101454_order_alert_addresses.up,
    down: migration_20261112_101454_order_alert_addresses.down,
    name: '20261112_101454_order_alert_addresses'
  },
  {
    up: migration_20261112_120000_checkout_labels.up,
    down: migration_20261112_120000_checkout_labels.down,
    name: '20261112_120000_checkout_labels',
  },
];
