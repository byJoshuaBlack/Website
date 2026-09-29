import { articles as allArticles } from "./articles";
import { images } from "./images";
import { products as allProducts } from "./products";
import { site } from "./site";
import type { Article, ImageRef, Picture, Product, SearchEntry } from "./types";

function fail(message: string): never {
  throw new Error(`Content error: ${message}`);
}

function validate() {
  const { whatsappNumber } = site.contact;
  if (whatsappNumber && !/^[1-9]\d{9,14}$/.test(whatsappNumber)) {
    fail(`whatsappNumber "${whatsappNumber}" must be digits only with country code, e.g. 2348012345678`);
  }

  const slugs = new Set<string>();
  for (const { slug } of [...allProducts, ...allArticles]) {
    if (slugs.has(slug)) fail(`duplicate slug "${slug}"`);
    slugs.add(slug);
  }

  const refs = [
    ...allProducts.flatMap((p) => [p.tile, ...p.gallery]),
    ...allArticles.map((a) => a.cover),
  ];
  for (const { id, crop } of refs) {
    if (!crop) continue;
    const inRange = crop.x >= 0 && crop.x <= 100 && crop.y >= 0 && crop.y <= 100;
    const zoomOk = crop.zoom === undefined || (crop.zoom >= 1 && crop.zoom <= 2);
    if (!inRange || !zoomOk) fail(`crop on "${id}" is out of range (x, y 0-100; zoom 1-2)`);
  }

  for (const article of allArticles) {
    for (const slug of article.related ?? []) {
      if (!allProducts.some((p) => p.slug === slug)) {
        fail(`article "${article.slug}" relates to unknown product "${slug}"`);
      }
    }
  }
}

validate();

// Hidden prices are removed here so they never reach the page source.
export const products: Product[] = site.showPrices
  ? allProducts
  : allProducts.map((product) => ({ ...product, price: undefined }));

export const articles: Article[] = allArticles;

export const box = products.find((p) => p.kind === "set") ?? fail("no product of kind \"set\"");
export const squares = products.filter((p) => p.kind === "piece");

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function picture(ref: ImageRef): Picture {
  const asset = images[ref.id];
  return { src: asset.src, alt: ref.alt ?? asset.alt, crop: ref.crop };
}

export const searchIndex: SearchEntry[] = [
  ...products.map((p) => ({
    title: p.name,
    kind: "Product" as const,
    href: `/collection/${p.slug}`,
    text: [p.descriptor, p.summary, p.number ? `No. ${p.number}` : "", "pocket square"].join(" "),
  })),
  ...articles.map((a) => ({
    title: a.title,
    kind: "Style Guide" as const,
    href: `/style-guide/${a.slug}`,
    text: [a.kicker, a.excerpt].join(" "),
  })),
  {
    title: "The World of Joshua Black",
    kind: "Page",
    href: "/world",
    text: "about story founder Opeyemi Okediji name meaning",
  },
  {
    title: "Order and enquiries",
    kind: "Page",
    href: "/contact",
    text: "contact order buy WhatsApp Instagram delivery",
  },
];

export { site };
