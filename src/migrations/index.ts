import * as migration_20261109_143000_initial from './20261109_143000_initial';
import * as migration_20261110_060002_content_schema from './20261110_060002_content_schema';
import * as migration_20261110_070000_seed_content from './20261110_070000_seed_content';
import * as migration_20261110_090018_store from './20261110_090018_store';
import * as migration_20261110_090100_store_defaults from './20261110_090100_store_defaults';
import * as migration_20261110_100000_store_policy from './20261110_100000_store_policy';

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
];
