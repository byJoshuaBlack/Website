import type { Metadata, Viewport } from "next";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { SiteNav } from "@/components/layout/SiteNav";
import { JsonLd } from "@/components/ui/JsonLd";
import { getContent, searchIndex } from "@/content";
import { linkedProfiles, socialLinks } from "@/lib/social";
import { inter, signature, tusker } from "./fonts";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return {
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
}

export const viewport: Viewport = {
  themeColor: "#f5f1e8",
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const content = await getContent();
  const { site } = content;
  const { menuLinks, shopLink, suggestions } = content.navigation;
  const { footerColumns } = content.navigation;
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
          searchIndex={searchIndex(content)}
          suggestions={suggestions}
          shop={shopLink}
          cartLabel={content.checkout.cart.title}
        />
        <main id="main" className="page-width flex-1">
          {children}
        </main>
        <Footer columns={footerColumns} social={socialLinks(site.contact)} name={site.name} registration={site.registration} />
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
            sameAs: linkedProfiles(site.contact).map((link) => link.href),
          }}
        />
      </body>
    </html>
  );
}
