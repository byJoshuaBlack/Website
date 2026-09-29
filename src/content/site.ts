import type { SiteConfig } from "./types";

const deployedUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export const site: SiteConfig = {
  name: "Joshua Black",
  tagline: "The finishing touch for the intentional man.",
  description:
    "Joshua Black is a guide into sophistication, through accessories. Discover Pocket Power: one box, ten silk-wool pocket squares.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? deployedUrl ?? "http://localhost:3000",
  locale: "en-NG",
  country: "Nigeria",

  // Set to true to show prices. Products without a price stay blank.
  showPrices: false,

  contact: {
    // Example: "2348012345678". Leave empty until the brand confirms its number.
    whatsappNumber: "",
    instagramHandle: "byjoshuablack",
  },

  founder: { name: "Opeyemi Okediji", role: "Founder" },

  announcement: {
    text: "Pocket Power. One box. Ten pocket squares.",
    href: "/collection/pocket-power",
  },
};
