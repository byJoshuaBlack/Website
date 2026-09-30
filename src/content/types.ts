import type { StaticImageData } from "next/image";
import type { images } from "./images";

export type ImageId = keyof typeof images;

export type ImageAsset = {
  src: StaticImageData;
  alt: string;
};

/** Focal point in percent of the source, and how far to zoom in on it (1 to 2). */
export type Crop = {
  x: number;
  y: number;
  zoom?: number;
  /** Percent of the photo's height trimmed above the subject when the frame is wider than the photo. Replaces `y`. */
  top?: number;
};

export type ImageRef = {
  id: ImageId;
  crop?: Crop;
  alt?: string;
};

/** An ImageRef resolved against the manifest, safe to pass to client components. */
export type Picture = {
  src: StaticImageData;
  alt: string;
  crop?: Crop;
};

export type Money = {
  amount: number;
  currency: "NGN";
};

export type Product = {
  slug: string;
  kind: "set" | "piece";
  number?: string;
  name: string;
  descriptor: string;
  summary: string;
  description: string[];
  details: string[];
  care: string[];
  tile: ImageRef;
  gallery: ImageRef[];
  price?: Money;
  needsPhoto?: boolean;
};

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; style: "bullet" | "number"; items: { title?: string; text: string }[] }
  | { type: "pair"; items: { term: string; text: string }[] }
  | { type: "acronym"; letters: { letter: string; word: string; text: string; example?: string }[] };

export type Article = {
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  cover: ImageRef;
  body: ArticleBlock[];
  related?: string[];
};

export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type NavNode = {
  label: string;
  href?: string;
  children?: NavNode[];
};

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  country: string;
  showPrices: boolean;
  contact: {
    /** Digits only with country code, no plus sign or leading zero. Empty hides WhatsApp. */
    whatsappNumber: string;
    instagramHandle: string;
    email?: string;
  };
  founder: { name: string; role: string };
  announcement?: { text: string; href: string };
};

export type SearchEntry = {
  title: string;
  kind: "Product" | "Style Guide" | "Page";
  href: string;
  text: string;
};
