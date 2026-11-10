import type { Metadata } from "next";
import { siteConfig } from "@/content/config";

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  siteName,
}: {
  title: string;
  description: string;
  path: string;
  siteName: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${siteName}`, description, url: path },
  };
}
