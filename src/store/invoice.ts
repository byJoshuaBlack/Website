import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, setCharacterSpacing, type PDFFont } from "pdf-lib";
import type { Order } from "@/payload-types";
import { formatPrice } from "@/lib/format";
import { interRegular, logo as logoPng, logoSize, tuskerMedium } from "@/store/invoice-assets";

// The brand palette, with mute and rule as carbon faded onto linen.
const LINEN = rgb(0.961, 0.945, 0.91);
const CARBON = rgb(0.102, 0.102, 0.102);
const PINE = rgb(0, 0.31, 0.286);
const MUTE = rgb(0.36, 0.355, 0.344);
const RULE = rgb(0.84, 0.827, 0.797);

const PAGE = { width: 595.28, height: 841.89 };
const MARGIN = 56;
const RIGHT = PAGE.width - MARGIN;

export type InvoiceDetails = {
  order: Order;
  business: { name: string; registration: string; email?: string; website: string };
  /** What a ₦0 delivery reads as, such as "Included". */
  included: string;
  /** The zone's delivery time, when it has one. */
  estimate?: string;
};

type TextOptions = { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; align?: "left" | "right"; tracking?: number };

const naira = (amount: number) => formatPrice({ amount, currency: "NGN" }).replace(/\s/g, "");

const day = (iso?: string | null) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "Africa/Lagos" }).format(iso ? new Date(iso) : new Date());

// The fonts are set glyph by glyph, so a tone mark that has no joined-up letter of its own is dropped.
const tidy = (value: string) => value.normalize("NFC").replace(/\p{M}/gu, "");

export const invoiceFileName = (order: Order) => `Joshua-Black-invoice-${order.reference}.pdf`;

/**
 * A paid order's invoice as a one-page PDF in the brand's type: the pine logo, Tusker Grotesk headings
 * and Inter text, carbon and pine on linen. Positions are in points from the page's top-left corner.
 */
export async function buildInvoice({ order, business, included, estimate }: InvoiceDetails): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const inter = await pdf.embedFont(interRegular);
  const tusker = await pdf.embedFont(tuskerMedium);
  const logo = await pdf.embedPng(logoPng);
  const page = pdf.addPage([PAGE.width, PAGE.height]);
  pdf.setTitle(`${business.name} invoice ${order.reference}`);
  pdf.setAuthor(business.name);

  const widthOf = (value: string, { size = 10, font = inter, tracking = 0 }: TextOptions) =>
    font.widthOfTextAtSize(tidy(value), size) + tracking * Math.max(tidy(value).length - 1, 0);
  const text = (x: number, y: number, raw: string, options: TextOptions = {}) => {
    const { size = 10, font = inter, color = CARBON, align = "left", tracking = 0 } = options;
    const value = tidy(raw);
    if (tracking) page.pushOperators(setCharacterSpacing(tracking));
    page.drawText(value, { x: align === "right" ? x - widthOf(value, options) : x, y: PAGE.height - y, size, font, color });
    if (tracking) page.pushOperators(setCharacterSpacing(0));
  };
  const box = (x: number, y: number, width: number, height: number, color: ReturnType<typeof rgb>) =>
    page.drawRectangle({ x, y: PAGE.height - y - height, width, height, color });
  const rule = (x1: number, x2: number, y: number, color = RULE, thickness = 0.5) =>
    page.drawLine({ start: { x: x1, y: PAGE.height - y }, end: { x: x2, y: PAGE.height - y }, color, thickness });
  const wrap = (value: string, max: number, options: TextOptions = {}) => {
    const lines: string[] = [];
    let line = "";
    for (const word of value.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (line && widthOf(next, options) > max) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    return line ? [...lines, line] : lines;
  };
  // Headings are Tusker Grotesk in capitals, as on the site.
  const heading = (x: number, y: number, value: string, options: TextOptions = {}) =>
    text(x, y, value.toUpperCase(), { font: tusker, size: 11, tracking: 0.5, ...options });
  const rows = (x: number, y: number, values: string[], step = 15) => {
    values.forEach((value, index) => text(x, y + index * step, value));
    return y + values.length * step;
  };

  box(0, 0, PAGE.width, PAGE.height, LINEN);
  box(0, 0, PAGE.width, 6, PINE);

  const logoHeight = 52;
  const logoWidth = (logoHeight * logoSize.width) / logoSize.height;
  page.drawImage(logo, { x: MARGIN, y: PAGE.height - 46 - logoHeight, width: logoWidth, height: logoHeight });
  heading(RIGHT, 76, "Invoice", { size: 22, tracking: 0.8, align: "right" });
  heading(RIGHT, 94, "Paid", { size: 12, tracking: 1.2, color: PINE, align: "right" });
  rule(MARGIN, RIGHT, 122, CARBON, 0.75);

  const middle = 330;
  heading(MARGIN, 152, "From");
  rows(MARGIN, 171, [business.name, `RC: ${business.registration}`, ...(business.email ? [business.email] : []), business.website]);
  heading(middle, 152, "Invoice number");
  text(middle, 171, order.reference);
  heading(middle, 197, "Date paid");
  text(middle, 216, day(order.payment?.paidAt));

  heading(MARGIN, 264, "Billed to");
  const address = wrap(`${order.address}, ${order.city}, ${order.state}`, middle - MARGIN - 24);
  const billedEnd = rows(MARGIN, 283, [order.customerName, order.email, order.phone, ...address]);

  heading(middle, 264, "Payment");
  const channel = order.payment?.channel ? ` (${order.payment.channel.replaceAll("_", " ")})` : "";
  let detailsEnd = rows(middle, 283, [`Paystack${channel}`]);
  if (estimate) {
    heading(middle, detailsEnd + 11, "Estimated delivery");
    detailsEnd = rows(middle, detailsEnd + 30, wrap(estimate, RIGHT - middle));
  }

  const columns = { quantity: 360, price: 455 };
  let y = Math.max(billedEnd, detailsEnd) + 36;
  heading(MARGIN, y, "Item");
  heading(columns.quantity, y, "Qty", { align: "right" });
  heading(columns.price, y, "Unit price", { align: "right" });
  heading(RIGHT, y, "Amount", { align: "right" });
  y += 10;
  rule(MARGIN, RIGHT, y, CARBON, 0.75);

  for (const item of order.items) {
    y += 23;
    text(MARGIN, y, item.name);
    text(columns.quantity, y, String(item.quantity), { align: "right" });
    text(columns.price, y, naira(item.unitPrice), { align: "right" });
    text(RIGHT, y, naira(item.unitPrice * item.quantity), { align: "right" });
    y += 13;
    rule(MARGIN, RIGHT, y);
  }

  for (const [name, value] of [
    ["Subtotal", naira(order.subtotal)],
    [`Delivery (${order.zone})`, order.deliveryFee === 0 ? included : naira(order.deliveryFee)],
  ]) {
    y += 21;
    text(columns.quantity, y, name!, { color: MUTE });
    text(RIGHT, y, value!, { align: "right" });
  }
  y += 13;
  rule(columns.quantity, RIGHT, y, CARBON, 0.75);
  y += 28;
  text(columns.quantity, y, "Total paid", { size: 14 });
  text(RIGHT, y, naira(order.total), { size: 14, align: "right" });

  rule(MARGIN, RIGHT, PAGE.height - 84);
  text(MARGIN, PAGE.height - 64, `Thank you for your order. Questions? ${business.email ?? business.website}`, { size: 9, color: MUTE });
  text(RIGHT, PAGE.height - 64, `${business.website}/policies/store`, { size: 9, color: MUTE, align: "right" });

  return pdf.save();
}
