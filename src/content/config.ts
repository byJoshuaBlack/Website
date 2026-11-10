// Fixed facts about where the site lives; everything editable comes from Payload.
export const siteConfig = {
  // Set NEXT_PUBLIC_SITE_URL in the Cloudflare build settings; links in the sitemap and shared previews use it.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en-NG",
  country: "Nigeria",
};
