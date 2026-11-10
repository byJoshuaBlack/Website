import { cache } from "react";
import type { Article, Content, ImageRef, Picture, Product, SearchEntry } from "./types";

export { siteConfig } from "./config";

// `next build` renders from the snapshot taken just before it (scripts/content-snapshot.ts), so its
// parallel workers never open the database. Everywhere else reads Payload directly.
async function load(): Promise<Content> {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    const { readFileSync } = await import(/* webpackIgnore: true */ "node:fs");
    const file = `${process.cwd()}/.content/snapshot.json`;
    try {
      return JSON.parse(readFileSync(file, "utf8")).content as Content;
    } catch {
      throw new Error(`No content snapshot at ${file}. Run \`npm run content:snapshot\` before building.`);
    }
  }
  const [{ getPayload }, { default: config }, { buildContent }] = await Promise.all([
    import("payload"),
    import("@payload-config"),
    import("./build"),
  ]);
  return buildContent(await getPayload({ config }));
}

/** Everything the site shows, read once per request. */
export const getContent = cache(load);

export function picture(ref: ImageRef): Picture {
  return { src: ref.asset.src, alt: ref.alt ?? ref.asset.alt, crop: ref.crop };
}

export function getProduct(content: Content, slug: string): Product | undefined {
  return content.products.find((product) => product.slug === slug);
}

export function getArticle(content: Content, slug: string): Article | undefined {
  return content.articles.find((article) => article.slug === slug);
}

/** The box of ten: the first product of kind "set". */
export function getBox(content: Content): Product {
  const box = content.products.find((product) => product.kind === "set");
  if (!box) throw new Error('Content error: no product of kind "set"');
  return box;
}

export function getSquares(content: Content): Product[] {
  return content.products.filter((product) => product.kind === "piece");
}

export function searchIndex(content: Content): SearchEntry[] {
  return [
    ...content.products.map((p) => ({
      title: p.name,
      kind: "Product" as const,
      href: `/collection/${p.slug}`,
      text: [p.descriptor, p.summary, p.number ? `No. ${p.number}` : "", "pocket square"].join(" "),
    })),
    ...content.articles.map((a) => ({
      title: a.title,
      kind: "Style Guide" as const,
      href: `/style-guide/${a.slug}`,
      text: [a.kicker, a.excerpt].join(" "),
    })),
    ...content.searchPages.map((page) => ({ ...page, kind: "Page" as const })),
  ];
}
