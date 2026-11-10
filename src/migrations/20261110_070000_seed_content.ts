import { readFile } from "node:fs/promises";
import path from "node:path";
import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

// Copies the content that lived in src/content/*.ts until this phase (frozen in seed/content.json)
// and its photos into Payload. Runs once per database.

type Seed = {
  images: { key: string; file: string; alt: string }[];
  site: Record<string, unknown>;
  navigation: Record<string, unknown>;
  pages: Record<string, Record<string, unknown>>;
  products: Record<string, unknown>[];
  articles: (Record<string, unknown> & { body: Record<string, unknown>[]; related?: string[] })[];
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const seed = JSON.parse(await readFile(path.resolve(process.cwd(), "src/migrations/seed/content.json"), "utf8")) as Seed;
  const context = { skipRevalidate: true };
  const { default: sharp } = await import("sharp");

  // The only account so far is the owner's.
  await db.run(sql`UPDATE \`users\` SET \`role\` = 'admin';`);

  const mediaIds = new Map<string, number>();
  for (const image of seed.images) {
    const data = await readFile(path.resolve(process.cwd(), image.file));
    const blur = await sharp(data).resize({ width: 8 }).webp({ quality: 70 }).toBuffer();
    const doc = await payload.create({
      collection: "media",
      data: { alt: image.alt, key: image.key, blurDataURL: `data:image/webp;base64,${blur.toString("base64")}` },
      file: { data, mimetype: "image/webp", name: path.basename(image.file), size: data.length },
      context,
      req,
    });
    mediaIds.set(image.key, doc.id as number);
  }

  // Plain lines become rows of `line`; image references become upload fields.
  const toPayload = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.length > 0 && value.every((item) => typeof item === "string")
        ? value.map((line) => ({ line }))
        : value.map(toPayload);
    }
    if (!isObject(value)) return value;
    if (typeof value.id === "string" && Object.keys(value).every((key) => ["id", "crop", "alt"].includes(key))) {
      const id = mediaIds.get(value.id);
      if (id === undefined) throw new Error(`Seed: no photo "${value.id}"`);
      return { image: id, alt: value.alt, crop: value.crop };
    }
    return Object.fromEntries(Object.entries(value).map(([key, field]) => [key, toPayload(field)]));
  };

  const productIds = new Map<string, number>();
  for (const product of seed.products) {
    const doc = await payload.create({
      collection: "products",
      data: { ...(toPayload(product) as object), _status: "published" } as never,
      context,
      req,
    });
    productIds.set(product.slug as string, doc.id as number);
  }

  for (const { body, related, ...article } of seed.articles) {
    await payload.create({
      collection: "articles",
      data: {
        ...(toPayload(article) as object),
        body: body.map(({ type, ...block }) => ({ blockType: type, ...block })),
        related: (related ?? []).map((slug) => productIds.get(slug)).filter((id) => id !== undefined),
        _status: "published",
      } as never,
      context,
      req,
    });
  }

  const globals: [string, unknown][] = [
    ["siteSettings", seed.site],
    ["navigation", seed.navigation],
    ["home", seed.pages.home],
    ["collectionPage", seed.pages.collection],
    ["traditional", seed.pages.traditional],
    ["styleGuidePage", seed.pages.styleGuide],
    ["world", seed.pages.world],
    ["storeNotice", seed.pages.store],
    ["ordering", seed.pages.ordering],
    ["contact", seed.pages.contact],
  ];
  for (const [slug, data] of globals) {
    await payload.updateGlobal({
      slug: slug as never,
      data: { ...(toPayload(data) as object), _status: "published" } as never,
      context,
      req,
    });
  }
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Removes what the seed added; edits made since then go with it.
  const context = { skipRevalidate: true };
  for (const collection of ["articles", "products"] as const) {
    await payload.delete({ collection, where: { id: { exists: true } }, context, req });
  }
  await payload.delete({ collection: "media", where: { key: { exists: true } }, context, req });
}
