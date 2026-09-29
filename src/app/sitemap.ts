import type { MetadataRoute } from "next";
import { articles, products } from "@/content";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/collection",
    "/style-guide",
    "/world",
    "/contact",
    ...products.map((product) => `/collection/${product.slug}`),
    ...articles.map((article) => `/style-guide/${article.slug}`),
  ];
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
