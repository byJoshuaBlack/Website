import type { Metadata } from "next";
import { headers } from "next/headers";
import config from "@payload-config";
import { getPayload } from "payload";
import { StoreNotice } from "@/components/product/StoreNotice";
import { CartView, type CatalogItem } from "@/components/store/CartView";
import { getContent, picture } from "@/content";
import { getShop, stockOf } from "@/store/checkout";
import { nigerianStates } from "@/store/states";

// Prices and stock change at any moment, so checkout always renders fresh.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { checkout } = await getContent();
  return { title: checkout.cart.title, robots: { index: false, follow: false } };
}

export default async function CheckoutPage() {
  const content = await getContent();
  const { checkout, policies } = content;
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  const shop = await getShop(payload);
  // Signed-in admins can test checkout before the shop opens.
  const open = shop.status === "open" || user?.role === "admin";

  // Everything that can be bought, with today's price and how many are left.
  const { docs } = await payload.find({
    collection: "products",
    where: { purchasable: { equals: true }, _status: { equals: "published" } },
    depth: 0,
    limit: 50,
    pagination: false,
  });
  const catalog: CatalogItem[] = [];
  for (const product of docs) {
    const display = content.products.find((item) => item.slug === product.slug);
    if (!display || typeof product.price !== "number" || product.price <= 0) continue;
    const max = Math.min(shop.maxPerOrder, await stockOf(payload, product.id));
    if (max < 1) continue;
    catalog.push({ slug: product.slug, name: product.name, unitPrice: product.price, picture: picture(display.tile), max });
  }

  return (
    <div className="gutter pb-16 pt-10 lg:pb-24 lg:pt-16">
      <h1 className="heading-lg">{checkout.cart.title}</h1>
      {checkout.cart.intro && <p className="copy-lg mt-5 max-w-lg">{checkout.cart.intro}</p>}
      <div className="mt-10">
        {!open ? (
          <div className="max-w-sm">
            <StoreNotice status={checkout.cart.closed} />
          </div>
        ) : docs.length > 0 && catalog.length === 0 ? (
          <div className="max-w-sm">
            <StoreNotice status={checkout.cart.soldOut} />
          </div>
        ) : (
          <CartView
            catalog={catalog}
            zones={content.shop.zones}
            states={nigerianStates}
            copy={checkout}
            policies={policies.map((policy) => ({ label: policy.title, href: `/policies/${policy.slug}` }))}
          />
        )}
      </div>
    </div>
  );
}
