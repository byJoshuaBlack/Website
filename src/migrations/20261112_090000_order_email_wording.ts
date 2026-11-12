import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-d1-sqlite";

// The brand's rewording of the buyer's email: its opening line and Abuja's delivery time.
// Each is only replaced while it still reads as we first wrote it.
const OLD_INTRO = "Thank you for your order. Here is what you bought and where it is going.";
const NEW_INTRO = "Thank you for your order. Here is your purchase and the delivery details:";
const OLD_TIME = "Within 24 hours, 2 days at most";
const NEW_TIME = "Within 24 hours, or 48 hours at the latest";

type Swap = { intro: [string, string]; time: [string, string] };
type Zone = { name: string; estimate?: string | null };
type Run = Pick<MigrateUpArgs, "payload" | "req">;

async function reword({ payload, req }: Run, { intro, time }: Swap) {
  const context = { skipRevalidate: true };

  const checkout = await payload.findGlobal({ slug: "checkout", depth: 0, req });
  if (checkout.email.intro === intro[0]) {
    await payload.updateGlobal({ slug: "checkout", data: { _status: "published", email: { intro: intro[1] } }, context, req });
  }

  const shop = await payload.findGlobal({ slug: "shopSettings", depth: 0, req });
  const zones = (shop.zones ?? []) as Zone[];
  if (zones.some((zone) => zone.estimate === time[0])) {
    const data = { zones: zones.map((zone) => (zone.estimate === time[0] ? { ...zone, estimate: time[1] } : zone)) };
    await payload.updateGlobal({ slug: "shopSettings", data: data as never, context, req });
  }
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await reword({ payload, req }, { intro: [OLD_INTRO, NEW_INTRO], time: [OLD_TIME, NEW_TIME] });
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await reword({ payload, req }, { intro: [NEW_INTRO, OLD_INTRO], time: [NEW_TIME, OLD_TIME] });
}
