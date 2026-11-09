import type { SiteConfig } from "./types";

export const site: SiteConfig = {
  name: "Joshua Black",
  tagline: "The finishing touch for the intentional man.",
  description:
    "Joshua Black is a guide into sophistication, through accessories. Discover Pocket Power: one box, ten silk-wool pocket squares.",
  // Set NEXT_PUBLIC_SITE_URL in the Cloudflare build settings; links in the sitemap and shared previews use it.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en-NG",
  country: "Nigeria",
  registration: "9286208",

  // Set to true to show prices. Products without a price stay blank.
  showPrices: false,

  contact: {
    instagramHandle: "byjoshuablack",
    email: "hi@byjoshuablack.com",
    // Full profile links for Facebook, X and LinkedIn are still to come from the brand.
  },

  founder: { name: "Opeyemi Okediji", role: "Founder" },
};
