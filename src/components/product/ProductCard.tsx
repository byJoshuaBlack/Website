import Link from "next/link";
import { Frame } from "@/components/ui/Frame";
import type { Picture } from "@/content/types";

export type ProductCardData = {
  slug: string;
  kind: "set" | "piece";
  name: string;
  descriptor: string;
  number?: string;
  price?: string;
  picture: Picture;
};

export function ProductCard({ product, sizes, eager }: { product: ProductCardData; sizes: string; eager?: boolean }) {
  return (
    <article className="group relative h-full bg-paper">
      <Frame picture={product.picture} sizes={sizes} eager={eager} />
      <div className="px-4 pb-6 pt-4 text-center">
        <h3 className="heading-sm truncate">
          <Link href={`/collection/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        <p className="truncate text-label text-mute">
          {product.number ? `No. ${product.number} · ${product.descriptor}` : product.descriptor}
        </p>
        {product.price && <p className="mt-1 text-label">{product.price}</p>}
      </div>
    </article>
  );
}
