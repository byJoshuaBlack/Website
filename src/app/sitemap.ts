import type { MetadataRoute } from "next";
import { getContent } from "@/content";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { articles, products } = await getContent();
  const paths = [
    "/",
    "/collection",
    "/traditional",
    "/style-guide",
    "/world",
    "/ordering",
    "/contact",
    ...products.map((product) => `/collection/${product.slug}`),
    ...articles.map((article) => `/style-guide/${article.slug}`),
  ];
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
