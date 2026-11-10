import type { BasePayload } from "payload";
import type { Order } from "@/payload-types";
import { formatPrice } from "@/lib/format";

const naira = (amount: number) => formatPrice({ amount, currency: "NGN" });

const escape = (text: string) =>
  text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

// Sender addresses must be on the domain onboarded in Cloudflare Email Sending.
const FROM_ADDRESS = "orders@byjoshuablack.com";

async function emailBinding(): Promise<SendEmail | undefined> {
  if (typeof navigator === "undefined" || navigator.userAgent !== "Cloudflare-Workers") return undefined;
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const { env } = await getCloudflareContext({ async: true });
  return (env as { EMAIL?: SendEmail }).EMAIL;
}

function summary(order: Order, included: string): { lines: string[]; rows: string } {
  const lines = [
    ...order.items.map((item) => `${item.quantity} × ${item.name} — ${naira(item.unitPrice * item.quantity)}`),
    `Delivery (${order.zone}) — ${order.deliveryFee === 0 ? included : naira(order.deliveryFee)}`,
    `Total — ${naira(order.total)}`,
    "",
    `Deliver to: ${order.customerName}, ${order.address}, ${order.city}, ${order.state}`,
    `Phone: ${order.phone}`,
  ];
  const rows = lines.map((line) => (line ? `<p style="margin:0 0 6px">${escape(line)}</p>` : "<br>")).join("");
  return { lines, rows };
}

/** Sends the buyer's confirmation and the brand's order alert. Throws if the binding is missing. */
export async function sendOrderEmails(payload: BasePayload, order: Order) {
  const email = await emailBinding();
  if (!email) throw new Error("The EMAIL binding is not available.");
  const [checkout, settings, shop] = await Promise.all([
    payload.findGlobal({ slug: "checkout", depth: 0 }),
    payload.findGlobal({ slug: "siteSettings", depth: 0 }),
    payload.findGlobal({ slug: "shopSettings", depth: 0 }),
  ]);
  const from = { email: FROM_ADDRESS, name: settings.name };
  const replyTo = settings.contact?.email ?? undefined;
  const { lines, rows } = summary(order, checkout.form.deliveryIncluded);
  const heading = `Order ${order.reference}`;

  await email.send({
    from,
    to: order.email,
    replyTo,
    subject: `${checkout.email.subject} (${order.reference})`,
    text: [checkout.email.intro, "", heading, ...lines, "", checkout.email.closing].join("\n"),
    html:
      `<div style="font-family:Arial,sans-serif;color:#1a1a1a;background:#f5f1e8;padding:24px">` +
      `<p>${escape(checkout.email.intro)}</p><h2 style="font-size:18px">${escape(heading)}</h2>${rows}` +
      `<p style="margin-top:16px">${escape(checkout.email.closing)}</p></div>`,
  });

  await email.send({
    from,
    to: shop.alertEmail,
    replyTo: order.email,
    subject: `New order ${order.reference}: ${naira(order.total)}`,
    text: [heading, ...lines, `Email: ${order.email}`, "", "See it in the admin under Shop → Orders."].join("\n"),
  });
}
