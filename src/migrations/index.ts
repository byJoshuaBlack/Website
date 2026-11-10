import * as migration_20261109_143000_initial from './20261109_143000_initial';
import * as migration_20261110_060002_content_schema from './20261110_060002_content_schema';
import * as migration_20261110_070000_seed_content from './20261110_070000_seed_content';

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
];
