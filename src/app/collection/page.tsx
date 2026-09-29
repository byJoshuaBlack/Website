import { ProductGrid } from "@/components/product/ProductGrid";
import type { ProductCardData } from "@/components/product/ProductCard";
import { picture, products } from "@/content";
import { collection } from "@/content/pages";
import { formatPrice } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: collection.title,
  description: collection.intro,
  path: "/collection",
});

export default function CollectionPage() {
  const cards: ProductCardData[] = products.map((product) => ({
    slug: product.slug,
    kind: product.kind,
    name: product.name,
    descriptor: product.descriptor,
    number: product.number,
    price: product.price ? formatPrice(product.price) : undefined,
    picture: picture(product.tile),
  }));

  return (
    <>
      <header className="gutter pb-10 pt-10 lg:pb-14 lg:pt-16">
        <h1 className="heading-lg">{collection.title}</h1>
        <p className="copy mt-4 max-w-xl text-mute">{collection.intro}</p>
      </header>
      <ProductGrid products={cards} />
    </>
  );
}
