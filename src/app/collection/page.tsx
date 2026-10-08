import { SplitBanner } from "@/components/editorial/SplitBanner";
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
  const { welcome } = collection;

  return (
    <>
      <SplitBanner
        level="h1"
        priority
        kicker={welcome.kicker}
        lines={welcome.lines}
        highlight={welcome.highlight}
        accent={welcome.accent}
        body={welcome.body}
        picture={picture(welcome.image)}
        links={welcome.links}
      />
      <div id="pieces" className="scroll-mt-(--header-h)">
        <ProductGrid products={cards} />
      </div>
    </>
  );
}
