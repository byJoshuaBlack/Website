import path from "node:path";
import { fileURLToPath } from "node:url";
import { getCloudflareContext, type CloudflareContext } from "@opennextjs/cloudflare";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { r2Storage } from "@payloadcms/storage-r2";
import { buildConfig, type PayloadLogger } from "payload";
import type { GetPlatformProxyOptions } from "wrangler";
import { Media } from "./collections/Media";
import { Users } from "./collections/Users";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

// Outside the Worker (the payload CLI, next dev and next build), bindings come from Wrangler instead.
const inWorker = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

// Only the deploy's migration step reaches the live D1 database; everything else runs on a local copy.
async function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  const { getPlatformProxy } = await import(/* webpackIgnore: true */ `${"__wrangler".replaceAll("_", "")}`);
  return getPlatformProxy({
    environment: process.env.CLOUDFLARE_ENV,
    remoteBindings: process.env.CLOUDFLARE_REMOTE_BINDINGS === "true",
  } satisfies GetPlatformProxyOptions);
}

// `next build` only collects the admin routes, which render on request, so it needs no bindings.
const isNextBuild = process.env.NEXT_PHASE === "phase-production-build";

const cloudflare = inWorker
  ? await getCloudflareContext({ async: true })
  : isNextBuild
    ? ({ env: {} } as CloudflareContext)
    : await getCloudflareContextFromWrangler();

// Payload's default pretty logger relies on Node APIs that Workers lack.
const log = (level: string, write: (line: string) => void) => (objOrMsg: object | string, msg?: string) =>
  write(JSON.stringify(typeof objOrMsg === "string" ? { level, msg: objOrMsg } : { level, ...objOrMsg, msg }));

const workerLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || "info",
  trace: log("trace", console.debug),
  debug: log("debug", console.debug),
  info: log("info", console.log),
  warn: log("warn", console.warn),
  error: log("error", console.error),
  fatal: log("fatal", console.error),
  silent: () => {},
} as unknown as PayloadLogger;

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " | Joshua Black" },
  },
  collections: [Users, Media],
  secret: process.env.PAYLOAD_SECRET || "",
  graphQL: { disable: true },
  telemetry: false,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  logger: isProduction ? workerLogger : undefined,
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
});
