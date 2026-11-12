import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-d1-sqlite";

// Shorter buttons, as the brand asked: Checkout beside the quantity stepper, and Pay Now with no amount.
async function setLabels({ payload, req }: MigrateUpArgs, proceed: string, payLabel: string) {
  const checkout = await payload.findGlobal({ slug: "checkout", depth: 0, req });
  await payload.updateGlobal({
    slug: "checkout",
    data: { _status: "published", cart: { ...checkout.cart, proceed, payLabel } },
    context: { skipRevalidate: true },
    req,
  });
}

export async function up(args: MigrateUpArgs): Promise<void> {
  await setLabels(args, "Checkout", "Pay Now");
}

export async function down(args: MigrateDownArgs): Promise<void> {
  await setLabels(args, "Proceed to Checkout", "Pay now");
}
