import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery, ProductThumbs } from "@/components/product/ProductGallery";
import { StoreNotice } from "@/components/product/StoreNotice";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { Frame } from "@/components/ui/Frame";
import { JsonLd } from "@/components/ui/JsonLd";
import { box, getProduct, picture, products, site, squares } from "@/content";
import { collection, store } from "@/content/pages";
import type { Product } from "@/content/types";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/seo";
import { sizes } from "@/lib/sizes";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(props: PageProps<"/collection/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) return {};
  const path = `/collection/${product.slug}`;
  const image = picture(product.gallery[0] ?? product.tile);
  return {
    title: product.kind === "piece" ? `${product.name} Pocket Square` : product.name,
    description: product.summary,
    alternates: { canonical: path },
    openGraph: {
      title: `${product.name} | ${site.name}`,
      description: product.summary,
      url: path,
      images: [{ url: image.src.src, width: image.src.width, height: image.src.height, alt: image.alt }],
    },
  };
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden="true">–</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function related(product: Product): Product[] {
  const others = squares.filter((square) => square.slug !== product.slug);
  const start = others.findIndex((square) => (square.number ?? "") > (product.number ?? ""));
  const rotated = [...others.slice(Math.max(start, 0)), ...others.slice(0, Math.max(start, 0))];
  return [box, ...rotated.slice(0, 3)];
}

export default async function ProductPage(props: PageProps<"/collection/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const pictures = product.gallery.map(picture);
  const isPiece = product.kind === "piece";

  const accordion: AccordionItem[] = [
    { title: "Info & details", content: <Bullets items={product.details} />, open: true },
    ...(product.care.length > 0 ? [{ title: "Product care", content: <Bullets items={product.care} /> }] : []),
    { title: "Ordering", content: <p>{store.details}</p> },
  ];

  return (
    <>
      <div className="bg-tile">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,min(44vw,calc(var(--page-max)*0.44)))_minmax(0,1fr)]">
          <div className="lg:order-2 lg:py-4">
            <ProductGallery pictures={pictures} label={`${product.name} photos`} />
          </div>

          <section
            aria-labelledby="product-name"
            className="gutter flex flex-col pb-8 pt-8 lg:sticky lg:top-(--header-h) lg:order-1 lg:h-[calc(100svh-var(--header-h))] lg:self-start lg:px-8 lg:pb-8 lg:pt-12 xl:px-12"
          >
            {isPiece && <p className="mb-3 text-tiny uppercase text-mute">Pocket Power · No. {product.number}</p>}
            <h1 id="product-name" className="heading-md">
              {product.name}
            </h1>
            <p className="mt-5 text-label text-mute">
              <span className="text-ink">{isPiece ? "Colour" : "Contains"}: </span>
              <span>{isPiece ? product.descriptor : "Ten pocket squares"}</span>
            </p>
            {product.price && <p className="mt-2 text-label">{formatPrice(product.price)}</p>}
            <p className="copy mt-5 max-w-sm text-mute">{product.summary}</p>

            <div className="mt-8 max-w-sm">
              <StoreNotice status={store.status} note={store.note} />
              {isPiece && (
                <p className="mt-4 text-center text-tiny text-mute">Sold as part of the Pocket Power box of ten.</p>
              )}
            </div>

            <nav aria-label="Breadcrumb" className="mt-10 lg:mt-auto">
              <ol className="flex flex-wrap gap-x-2 text-tiny text-mute">
                <li>
                  <Link href="/" className="link-line-in">
                    Home
                  </Link>
                  <span aria-hidden="true"> /</span>
                </li>
                <li>
                  <Link href="/collection" className="link-line-in">
                    {collection.title}
                  </Link>
                  <span aria-hidden="true"> /</span>
                </li>
                <li aria-current="page" className="text-ink">
                  {product.name}
                </li>
              </ol>
            </nav>
          </section>

          <section
            aria-label="Details"
            className="gutter pb-12 lg:sticky lg:top-(--header-h) lg:order-3 lg:h-[calc(100svh-var(--header-h))] lg:self-start lg:overflow-y-auto lg:px-8 lg:pb-8 lg:pt-12 xl:px-12"
          >
            <div className="hidden lg:block">
              <ProductThumbs pictures={pictures} />
            </div>

            <div className="lg:mt-8">
              <Accordion items={accordion} />
            </div>

            <div className="copy mt-6 space-y-4 text-mute">
              {product.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {isPiece && (
              <Link href={`/collection/${box.slug}`} className="group mt-8 flex items-center gap-4 bg-paper p-3">
                <Frame picture={picture(box.tile)} sizes={sizes.thumb} className="w-14 shrink-0" />
                <span>
                  <span className="display block text-[1.125rem] tracking-[0.04em]">{box.name}</span>
                  <span className="link-line-in text-label text-mute">Discover the box of ten</span>
                </span>
              </Link>
            )}
          </section>
        </div>
      </div>

      {isPiece && (
        <section aria-labelledby="more-title" className="pt-16 lg:pt-24">
          <h2 id="more-title" className="heading-md gutter mb-8">
            More from Pocket Power
          </h2>
          <ul className="grid grid-cols-2 border-t border-rule lg:grid-cols-4">
            {related(product).map((item) => (
              <li key={item.slug} className="border-b border-r border-rule">
                <ProductCard
                  product={{
                    slug: item.slug,
                    kind: item.kind,
                    name: item.name,
                    descriptor: item.descriptor,
                    number: item.number,
                    price: item.price ? formatPrice(item.price) : undefined,
                    picture: picture(item.tile),
                  }}
                  sizes={sizes.quarter}
                />
              </li>
            ))}
          </ul>
          <p className="gutter mt-8 text-body">
            <Link href="/collection" className="link-line">
              View all pieces
            </Link>
          </p>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: isPiece ? `${product.name} Pocket Square` : product.name,
          description: product.summary,
          image: pictures.map((item) => absoluteUrl(item.src.src)),
          brand: { "@type": "Brand", name: site.name },
          material: "Silk and wool",
          category: "Pocket squares",
          url: absoluteUrl(`/collection/${product.slug}`),
          ...(product.price
            ? {
                offers: {
                  "@type": "Offer",
                  price: product.price.amount,
                  priceCurrency: product.price.currency,
                  url: absoluteUrl(`/collection/${product.slug}`),
                },
              }
            : {}),
        }}
      />
    </>
  );
}
