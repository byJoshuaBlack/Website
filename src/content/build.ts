import type { BasePayload } from "payload";
import { siteConfig } from "./config";
import type { Article, Content, Crop, ImageRef, Product, SiteConfig } from "./types";

type Doc = Record<string, unknown>;

const isObject = (value: unknown): value is Doc => typeof value === "object" && value !== null && !Array.isArray(value);

// Bookkeeping Payload adds that the site never shows.
const skipped = new Set(["id", "createdAt", "updatedAt", "globalType", "_status", "_order", "blockName", "prefix"]);

const isMedia = (value: unknown): value is Doc => isObject(value) && typeof value.url === "string" && "mimeType" in value;

// Rows made by `lines()` hold a single `line`; the site keeps them as plain strings.
const isLineRow = (value: unknown) =>
  isObject(value) && Object.keys(value).filter((key) => key !== "id").join() === "line";

function toCrop(value: unknown): Crop | undefined {
  if (!isObject(value) || typeof value.x !== "number" || typeof value.y !== "number") return undefined;
  return {
    x: value.x,
    y: value.y,
    ...(typeof value.zoom === "number" ? { zoom: value.zoom } : {}),
    ...(typeof value.top === "number" ? { top: value.top } : {}),
  };
}

function toImageRef(usage: Doc): ImageRef {
  const media = usage.image as Doc;
  return {
    asset: {
      src: {
        src: media.url as string,
        width: media.width as number,
        height: media.height as number,
        ...(typeof media.blurDataURL === "string" && media.blurDataURL ? { blurDataURL: media.blurDataURL } : {}),
      },
      alt: media.alt as string,
    },
    ...(typeof usage.alt === "string" && usage.alt ? { alt: usage.alt } : {}),
    ...(toCrop(usage.crop) ? { crop: toCrop(usage.crop) } : {}),
  };
}

/** Turns Payload's documents into the plain shapes in ./types: no ids or nulls, rows of lines as strings. */
export function normalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    if (value.length > 0 && value.every(isLineRow)) return value.map((row) => (row as Doc).line);
    return value.map(normalize).filter((item) => item !== undefined);
  }
  if (!isObject(value)) return value;
  if ("image" in value && !isObject(value.image) && ("crop" in value || "alt" in value)) return undefined;
  if (isMedia(value.image)) return toImageRef(value);
  const out: Doc = {};
  for (const [key, field] of Object.entries(value)) {
    if (skipped.has(key) || field === null || field === undefined) continue;
    const normalized = normalize(field);
    if (normalized !== undefined) out[key === "blockType" ? "type" : key] = normalized;
  }
  return out;
}

const globalSlugs = [
  "siteSettings",
  "navigation",
  "home",
  "collectionPage",
  "traditional",
  "styleGuidePage",
  "world",
  "storeNotice",
  "ordering",
  "contact",
] as const;

/** Reads every published global, product and article, ready for the pages. */
export async function buildContent(payload: BasePayload): Promise<Content> {
  const [globals, products, articles] = await Promise.all([
    Promise.all(globalSlugs.map((slug) => payload.findGlobal({ slug, depth: 1, draft: false }))),
    payload.find({ collection: "products", where: { _status: { equals: "published" } }, sort: "_order", depth: 1, limit: 200, pagination: false }),
    payload.find({ collection: "articles", where: { _status: { equals: "published" } }, sort: "_order", depth: 1, limit: 200, pagination: false }),
  ]);
  const [settings, navigation, home, collection, traditional, styleGuide, world, store, ordering, contact] = globals.map(
    (doc) => normalize(doc) as Doc,
  );

  const { tileHint, searchPages, announcement, showPrices, ...siteFields } = settings;
  const banner = announcement as { text?: string; href?: string } | undefined;
  const site: SiteConfig = {
    ...(siteFields as Omit<SiteConfig, "url" | "locale" | "country" | "showPrices" | "announcement">),
    ...siteConfig,
    showPrices: showPrices === true,
    ...(banner?.text && banner.href ? { announcement: { text: banner.text, href: banner.href } } : {}),
  };

  return {
    site,
    tileHint: tileHint as string,
    searchPages: (searchPages ?? []) as Content["searchPages"],
    navigation: { footerColumns: [], suggestions: [], ...navigation } as unknown as Content["navigation"],
    home: home as unknown as Content["home"],
    collection: collection as unknown as Content["collection"],
    traditional: traditional as unknown as Content["traditional"],
    styleGuide: styleGuide as unknown as Content["styleGuide"],
    world: world as unknown as Content["world"],
    store: store as unknown as Content["store"],
    ordering: ordering as unknown as Content["ordering"],
    contact: contact as unknown as Content["contact"],
    products: products.docs.map((doc) => ({ care: [], details: [], ...(normalize(doc) as object) }) as unknown as Product),
    articles: articles.docs.map((doc) => {
      const article = normalize(doc) as Doc;
      const related = (doc.related ?? [])
        .map((product) => (typeof product === "object" && product ? product.slug : undefined))
        .filter((slug): slug is string => Boolean(slug));
      return { ...article, related } as unknown as Article;
    }),
  };
}

/** A short fingerprint of the content, to tell whether anything changed since a deploy. */
export async function contentHash(content: Content): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(content));
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return Array.from(digest.slice(0, 12), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
