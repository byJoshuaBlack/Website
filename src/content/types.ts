import type { StaticImageData } from "next/image";

/** A photo in the media library: its address and size, plus a tiny blurred preview when one exists. */
export type ImageSource = StaticImageData;

export type ImageAsset = {
  src: ImageSource;
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

/** A photo as used in one place, with an optional crop and alt override. */
export type ImageRef = {
  asset: ImageAsset;
  crop?: Crop;
  alt?: string;
};

/** An ImageRef ready for the frame, safe to pass to client components. */
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
  /** Shows the Buy button while the shop is open. */
  purchasable?: boolean;
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

/** A phrase in a headline picked out in a brand colour. */
export type Accent = {
  text: string;
  tone: "pine" | "bronze";
};

export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

/** A social profile. Without a link yet, its icon shows in the menu but leads nowhere. */
export type SocialLink = {
  label: string;
  icon: "instagram" | "facebook" | "x" | "linkedin";
  href?: string;
};

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  country: string;
  /** Company registration (RC) number, shown under the logo in the footer. */
  registration: string;
  showPrices: boolean;
  contact: {
    instagramHandle: string;
    facebook?: string;
    x?: string;
    linkedin?: string;
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

export type NavigationContent = {
  shopLink: LinkItem;
  menuLinks: LinkItem[];
  footerColumns: { title: string; links: LinkItem[] }[];
  suggestions: LinkItem[];
};

/** Headline lines with one word drawn larger and a line in the script face, as in banners. */
type Banner = { lines: string[]; highlight: string; accent: string };

export type HomeContent = {
  intro: {
    title: string;
    accents: Accent[];
    body: string[];
    link: LinkItem;
    rise: string[];
    image: ImageRef;
  };
  pocketPower: Banner & { kicker: string; body: string; images: ImageRef[]; cta: LinkItem };
};

export type CollectionContent = { title: string; intro: string };

export type TraditionalContent = {
  title: string;
  intro: string;
  card: { name: string; descriptor: string; link: string; image: ImageRef };
  welcome: Banner & { kicker: string; body: string; image: ImageRef; links: LinkItem[] };
  colours: { title: string; intro: string; items: { name: string; image: ImageRef }[] };
  order: { title: string; text: string; image: ImageRef };
};

export type StyleGuideContent = { title: string; intro: string; hero: ImageRef };

export type WorldContent = {
  hero: { kicker: string; title: string; image: ImageRef };
  name: { intro: string; parts: { term: string; text: string }[]; together: string };
  founder: { image: ImageRef; title: string; paragraphs: string[]; quote: string };
  timeline: { title: string; image: ImageRef; events: { date: string; text: string }[] };
  closing: Banner & { image: ImageRef; links: LinkItem[] };
};

export type StoreContent = { status: string; note: string; details: string };

export type OrderingContent = {
  title: string;
  intro: string;
  image: ImageRef;
  stepsTitle: string;
  steps: { title: string; text: string }[];
};

export type ContactContent = {
  title: string;
  intro: string;
  cta: string;
  emailCta: string;
  emailHint: string;
  copied: string;
  image: ImageRef;
};

export type ShopContent = {
  open: boolean;
  maxPerOrder: number;
  zones: { name: string; fee: number; states: string[]; everywhereElse: boolean; estimate?: string }[];
};

export type CheckoutContent = {
  cart: {
    proceed: string;
    title: string;
    payLabel: string;
    intro?: string;
    empty: string;
    continueShopping: string;
    remove: string;
    quantityLabel: string;
    detailsTitle: string;
    priceNote: string;
    soldOut: string;
    closed: string;
  };
  form: {
    firstNameLabel: string;
    lastNameLabel: string;
    countryCodeLabel: string;
    emailInvalid: string;
    phoneInvalid: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    cityLabel: string;
    stateLabel: string;
    subtotalLabel: string;
    deliveryLabel: string;
    deliveryIncluded: string;
    totalLabel: string;
    agreement: string;
  };
  complete: {
    paidTitle: string;
    paidText: string;
    homeLabel?: string;
    failedTitle: string;
    failedText: string;
    pendingTitle: string;
    pendingText: string;
    retryLabel: string;
  };
  email?: { estimateLabel?: string };
};

export type Policy = { slug: string; title: string; summary: string; body: ArticleBlock[] };

/** Everything the site shows, read from Payload in one go. */
export type Content = {
  site: SiteConfig;
  tileHint: string;
  searchPages: { title: string; href: string; text: string }[];
  navigation: NavigationContent;
  home: HomeContent;
  collection: CollectionContent;
  traditional: TraditionalContent;
  styleGuide: StyleGuideContent;
  world: WorldContent;
  store: StoreContent;
  ordering: OrderingContent;
  contact: ContactContent;
  products: Product[];
  articles: Article[];
  shop: ShopContent;
  checkout: CheckoutContent;
  policies: Policy[];
};
