import type { Metadata, Viewport } from "next";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { SiteNav } from "@/components/layout/SiteNav";
import { JsonLd } from "@/components/ui/JsonLd";
import { searchIndex, site } from "@/content";
import { footerColumns, menuLinks, shopLink } from "@/content/navigation";
import type { LinkItem } from "@/content/types";
import { linkedProfiles, socialLinks } from "@/lib/social";
import { inter, signature, tusker } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Men's Accessories`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale.replace("-", "_"),
    title: site.name,
    description: site.description,
    url: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f1e8",
  viewportFit: "cover",
};

const suggestions: LinkItem[] = [
  { label: "Pocket Power", href: "/collection/pocket-power" },
  { label: "The RISE framework", href: "/style-guide/the-rise-framework" },
  { label: "The World of Joshua Black", href: "/world" },
  { label: "Ordering", href: "/ordering" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${tusker.variable} ${signature.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="fixed left-3 top-3 z-50 -translate-y-20 bg-ink px-4 py-2 text-label text-paper focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        {site.announcement && <AnnouncementBar {...site.announcement} />}
        <SiteNav
          menuLinks={menuLinks}
          searchIndex={searchIndex}
          suggestions={suggestions}
          shop={shopLink}
        />
        <main id="main" className="page-width flex-1">
          {children}
        </main>
        <Footer columns={footerColumns} social={socialLinks} name={site.name} registration={site.registration} />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            url: site.url,
            slogan: site.tagline,
            description: site.description,
            founder: { "@type": "Person", name: site.founder.name },
            address: { "@type": "PostalAddress", addressCountry: "NG" },
            sameAs: linkedProfiles.map((link) => link.href),
          }}
        />
      </body>
    </html>
  );
}
