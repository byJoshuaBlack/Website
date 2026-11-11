import type { BasePayload } from "payload";
import type { Order } from "@/payload-types";
import { formatPrice } from "@/lib/format";
import { buildInvoice, invoiceFileName } from "@/store/invoice";

const naira = (amount: number) => formatPrice({ amount, currency: "NGN" });

const escape = (text: string) =>
  text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

// Sender addresses must be on the domain onboarded in Cloudflare Email Sending, which is the site's.
const DOMAIN = "byjoshuablack.com";
const FROM_ADDRESS = `orders@${DOMAIN}`;

async function emailBinding(): Promise<SendEmail | undefined> {
  if (typeof navigator === "undefined" || navigator.userAgent !== "Cloudflare-Workers") return undefined;
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const { env } = await getCloudflareContext({ async: true });
  return (env as { EMAIL?: SendEmail }).EMAIL;
}

type Row = [label: string, value: string];

function summary(order: Order, included: string): { rows: Row[]; address: string } {
  return {
    rows: [
      ...order.items.map((item): Row => [`${item.quantity} × ${item.name}`, naira(item.unitPrice * item.quantity)]),
      [`Delivery (${order.zone})`, order.deliveryFee === 0 ? included : naira(order.deliveryFee)],
      ["Total", naira(order.total)],
    ],
    address: `${order.customerName}, ${order.address}, ${order.city}, ${order.state}`,
  };
}

const cell = "padding:10px 0;border-bottom:1px solid #d6d3cb;font-size:15px;line-height:1.4";
const small = "margin:0 0 4px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5c5b58";

function buyerHtml(parts: { intro: string; heading: string; rows: Row[]; address: string; phone: string; estimate?: Row; note?: string; closing: string }) {
  const rows = parts.rows
    .map(([label, value], index) => {
      const weight = index === parts.rows.length - 1 ? "font-weight:bold;" : "";
      return `<tr><td style="${cell};${weight}">${escape(label)}</td><td align="right" style="${cell};${weight}">${escape(value)}</td></tr>`;
    })
    .join("");
  const block = (label: string, value: string) => `<p style="${small}">${escape(label)}</p><p style="margin:0 0 20px;font-size:15px;line-height:1.4">${escape(value)}</p>`;
  return (
    `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0">` +
    `<div style="margin:0;padding:24px 12px;background:#f5f1e8;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;border-top:4px solid #004f49">` +
    `<tr><td style="padding:28px 0 0">` +
    `<p style="margin:0 0 24px;font-size:16px;line-height:1.4">${escape(parts.intro)}</p>` +
    `<p style="${small}">${escape(parts.heading)}</p>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-top:1px solid #1a1a1a">${rows}</table>` +
    (parts.estimate ? block(parts.estimate[0], parts.estimate[1]) : "") +
    block("Delivering to", `${parts.address} · ${parts.phone}`) +
    (parts.note ? `<p style="margin:0 0 12px;font-size:15px;line-height:1.4">${escape(parts.note)}</p>` : "") +
    `<p style="margin:0;font-size:15px;line-height:1.4">${escape(parts.closing)}</p>` +
    `</td></tr></table></div></body></html>`
  );
}

/** Sends the buyer's confirmation and the brand's order alert, each with the invoice. Throws if the binding is missing. */
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
  const included = checkout.form.deliveryIncluded;
  const { rows, address } = summary(order, included);
  const heading = `Order ${order.reference}`;
  const time = shop.zones?.find((zone) => zone.name === order.zone)?.estimate ?? undefined;
  const estimate: Row | undefined = time ? [checkout.email.estimateLabel || "Estimated delivery", time] : undefined;
  const lines = [...rows.map(([label, value]) => `${label}: ${value}`), ...(estimate ? [`${estimate[0]}: ${estimate[1]}`] : []), "", `Deliver to: ${address}`, `Phone: ${order.phone}`];

  // The invoice is a courtesy: if it cannot be built, the emails still go.
  let attachments: EmailAttachment[] | undefined;
  try {
    const invoice = await buildInvoice({
      order,
      business: {
        name: settings.name,
        registration: settings.registration,
        email: replyTo,
        website: DOMAIN,
      },
      included,
      estimate: time,
    });
    attachments = [{ disposition: "attachment", filename: invoiceFileName(order), type: "application/pdf", content: invoice }];
  } catch (error) {
    payload.logger.error({ msg: `Order ${order.reference}: invoice failed`, err: error });
  }
  const note = attachments ? (checkout.email.invoiceNote ?? undefined) : undefined;

  await email.send({
    from,
    to: order.email,
    replyTo,
    subject: `${checkout.email.subject} (${order.reference})`,
    text: [checkout.email.intro, "", heading, ...lines, "", ...(note ? [note] : []), checkout.email.closing].join("\n"),
    html: buyerHtml({ intro: checkout.email.intro, heading, rows, address, phone: order.phone, estimate, note, closing: checkout.email.closing }),
    attachments,
  });

  await email.send({
    from,
    to: shop.alertEmail,
    replyTo: order.email,
    subject: `New order ${order.reference}: ${naira(order.total)}`,
    text: [heading, ...lines, `Email: ${order.email}`, "", "See it in the admin under Shop → Orders."].join("\n"),
    attachments,
  });
}
