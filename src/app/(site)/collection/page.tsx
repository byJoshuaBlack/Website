import { ProductGrid } from "@/components/product/ProductGrid";
import type { ProductCardData } from "@/components/product/ProductCard";
import { getContent, picture } from "@/content";
import { formatPrice } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const { collection, site } = await getContent();
  return pageMetadata({ title: collection.title, description: collection.intro, path: "/collection", siteName: site.name });
}

export default async function CollectionPage() {
  const { collection, products, traditional } = await getContent();
  const cards: ProductCardData[] = products.map((product) => ({
    slug: product.slug,
    kind: product.kind,
    name: product.name,
    descriptor: product.descriptor,
    number: product.number,
    price: product.price ? formatPrice(product.price) : undefined,
    picture: picture(product.tile),
  }));
  // The fila has its own page outside the catalogue; its card sits after the box.
  cards.splice(1, 0, {
    slug: "fila",
    kind: "fila",
    href: "/traditional",
    name: traditional.card.name,
    descriptor: traditional.card.descriptor,
    picture: picture(traditional.card.image),
  });

  return (
    <>
      {/* The brand asked for no visible title; screen readers and search engines still get one. */}
      <h1 className="sr-only">{collection.title}</h1>
      <ProductGrid products={cards} />
    </>
  );
}
