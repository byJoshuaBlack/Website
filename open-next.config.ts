import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import { purgeCache } from "@opennextjs/cloudflare/overrides/cache-purge/index";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

// Pages live in R2 and each data centre's cache. Publishing in Payload marks them stale in the D1 tag
// cache, which every visit checks (skipping that check serves stale pages on Next 16).
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: "long-lived",
    defaultLongLivedTtlSec: 86400,
  }),
  tagCache: d1NextTagCache,
  queue: memoryQueue,
  cachePurge: purgeCache({ type: "direct" }),
  enableCacheInterception: true,
});
