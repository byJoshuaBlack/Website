import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-d1-sqlite";

// The paid order page's wording: Payment completed, the email note and the way back home.
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.updateGlobal({
    slug: "checkout",
    data: {
      _status: "published",
      complete: {
        paidTitle: "Payment completed",
        paidText:
          "Your order details have been sent to your email. We will keep you updated at every step until your order reaches you.",
        redirectText: "Taking you back to the home page.",
        homeLabel: "Go to home page",
      },
    },
    context: { skipRevalidate: true },
    req,
  });
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.updateGlobal({
    slug: "checkout",
    data: {
      _status: "published",
      complete: { paidTitle: "Thank you", paidText: "Your order is confirmed. We will email you when it is on its way." },
    },
    context: { skipRevalidate: true },
    req,
  });
}
