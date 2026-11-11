import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-d1-sqlite";

// Delivery times as the brand set them: Abuja within 24 hours (2 days at most), elsewhere 5 to 7
// working days. They go on each zone, in the order email's wording and in the policy's delivery text.
const ABUJA = "Federal Capital Territory (Abuja)";
const ABUJA_TIME = "Within 24 hours, 2 days at most";
const ELSEWHERE_TIME = "5 to 7 working days";

const OLD_DELIVERY =
  "Orders are usually dispatched within 2 working days of payment. Delivery usually takes 1 to 3 working days in Abuja and 3 to 7 working days elsewhere in Nigeria.";
const NEW_DELIVERY =
  "Within Abuja, orders are usually delivered within 24 hours of payment, and within 2 days at most. Elsewhere in Nigeria, delivery usually takes 5 to 7 working days.";

type Zone = { name: string; estimate?: string | null; everywhereElse?: boolean | null; states?: string[] | null };
type Block = { blockType: string; text?: string | null };

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const context = { skipRevalidate: true };

  const shop = await payload.findGlobal({ slug: "shopSettings", depth: 0, req });
  const zones = ((shop.zones ?? []) as Zone[]).map((zone) => ({
    ...zone,
    estimate: zone.estimate || (zone.states?.includes(ABUJA) ? ABUJA_TIME : zone.everywhereElse ? ELSEWHERE_TIME : zone.estimate),
  }));
  await payload.updateGlobal({ slug: "shopSettings", data: { zones } as never, context, req });

  await payload.updateGlobal({
    slug: "checkout",
    data: {
      _status: "published",
      email: { estimateLabel: "Estimated delivery", invoiceNote: "Your invoice is attached to this email." },
    },
    context,
    req,
  });

  const { docs } = await payload.find({ collection: "policies", where: { slug: { equals: "store" } }, limit: 1, depth: 0, req });
  const policy = docs[0];
  const body = (policy?.body ?? []) as Block[];
  if (policy && body.some((block) => block.text?.includes(OLD_DELIVERY))) {
    await payload.update({
      collection: "policies",
      id: policy.id,
      data: {
        body: body.map((block) => (block.text?.includes(OLD_DELIVERY) ? { ...block, text: block.text.replace(OLD_DELIVERY, NEW_DELIVERY) } : block)),
        _status: "published",
      } as never,
      context,
      req,
    });
  }
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  const { docs } = await payload.find({ collection: "policies", where: { slug: { equals: "store" } }, limit: 1, depth: 0, req });
  const policy = docs[0];
  const body = (policy?.body ?? []) as Block[];
  if (policy && body.some((block) => block.text?.includes(NEW_DELIVERY))) {
    await payload.update({
      collection: "policies",
      id: policy.id,
      data: {
        body: body.map((block) => (block.text?.includes(NEW_DELIVERY) ? { ...block, text: block.text.replace(NEW_DELIVERY, OLD_DELIVERY) } : block)),
        _status: "published",
      } as never,
      context: { skipRevalidate: true },
      req,
    });
  }
}
