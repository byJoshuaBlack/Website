import type { Metadata, Viewport } from "next";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { SiteNav } from "@/components/layout/SiteNav";
import type { IconName } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { searchIndex, site } from "@/content";
import { footerColumns, navigation } from "@/content/navigation";
import type { LinkItem } from "@/content/types";
import { instagramProfile, orderChannels } from "@/lib/order";
import { baskerville, inter, signature, tusker } from "./fonts";
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
  themeColor: "#ffffff",
  viewportFit: "cover",
};

type IconLink = LinkItem & { icon: IconName };

const channels = orderChannels();
const social: IconLink[] = [
  { label: "Instagram", href: instagramProfile, icon: "instagram", external: true },
  ...channels
    .filter((channel) => channel.kind === "whatsapp")
    .map((channel): IconLink => ({ label: "WhatsApp", href: channel.href, icon: "whatsapp", external: true })),
];

const suggestions: LinkItem[] = [
  { label: "Pocket Power", href: "/collection/pocket-power" },
  { label: "The RISE framework", href: "/style-guide/the-rise-framework" },
  { label: "The World of Joshua Black", href: "/world" },
  { label: "Order and enquiries", href: "/contact" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${tusker.variable} ${baskerville.variable} ${signature.variable} antialiased`}
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
          nav={navigation}
          searchIndex={searchIndex}
          suggestions={suggestions}
          order={{ label: "Order", href: "/contact" }}
          extras={social}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer columns={footerColumns} social={social} country={site.country} name={site.name} />
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
            sameAs: [instagramProfile],
          }}
        />
      </body>
    </html>
  );
}
