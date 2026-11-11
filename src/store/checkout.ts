import type { BasePayload } from "payload";
import type { Order, Product, ShopSetting } from "@/payload-types";
import { sendOrderEmails } from "./email";
import { initializePayment, verifyPayment } from "./paystack";
import { isValidEmail, toInternational } from "./phone";
import { isNigerianState } from "./states";

export type CheckoutInput = {
  items: { product: string; quantity: number }[];
  firstName: string;
  lastName: string;
  email: string;
  /** Two-letter country code of the phone's dialling code. */
  phoneCountry: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  agree: boolean;
};

export class CheckoutError extends Error {
  constructor(
    readonly code: "closed" | "unavailable" | "sold-out" | "quantity" | "invalid",
    message: string,
    readonly field?: keyof CheckoutInput,
  ) {
    super(message);
  }
}

export type QuoteLine = { product: Product; unitPrice: number; quantity: number };

export type Quote = {
  lines: QuoteLine[];
  subtotal: number;
  zone: string;
  deliveryFee: number;
  total: number;
};

export async function getShop(payload: BasePayload): Promise<ShopSetting> {
  return payload.findGlobal({ slug: "shopSettings", depth: 0 });
}

export function zoneFor(shop: Pick<ShopSetting, "zones">, state: string) {
  const zones = shop.zones ?? [];
  return zones.find((zone) => zone.states?.includes(state as never)) ?? zones.find((zone) => zone.everywhereElse);
}

export async function stockOf(payload: BasePayload, productId: number): Promise<number> {
  const { docs } = await payload.find({ collection: "stock", where: { product: { equals: productId } }, limit: 1, depth: 0 });
  return docs[0]?.quantity ?? 0;
}

/** Prices an order from the database alone; nothing the browser sends is trusted. */
export async function quote(payload: BasePayload, shop: ShopSetting, input: Pick<CheckoutInput, "items" | "state">): Promise<Quote> {
  // The same product twice counts as one line.
  const wanted = new Map<string, number>();
  for (const item of input.items) wanted.set(item.product, (wanted.get(item.product) ?? 0) + item.quantity);
  if (wanted.size === 0) throw new CheckoutError("invalid", "Your cart is empty.", "items");

  const lines: QuoteLine[] = [];
  for (const [slug, requested] of wanted) {
    const { docs } = await payload.find({
      collection: "products",
      where: { slug: { equals: slug }, _status: { equals: "published" } },
      limit: 1,
      depth: 0,
    });
    const product = docs[0];
    if (!product?.purchasable || typeof product.price !== "number" || product.price <= 0) {
      throw new CheckoutError("unavailable", `${product?.name ?? "This product"} cannot be bought online.`, "items");
    }
    const quantity = Math.trunc(requested);
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > shop.maxPerOrder) {
      throw new CheckoutError("quantity", `Choose between 1 and ${shop.maxPerOrder} of ${product.name}.`, "items");
    }
    if ((await stockOf(payload, product.id)) < quantity) {
      throw new CheckoutError("sold-out", `There are not enough of ${product.name} in stock.`, "items");
    }
    lines.push({ product, unitPrice: product.price, quantity });
  }

  if (!isNigerianState(input.state)) throw new CheckoutError("invalid", "Choose your state.", "state");
  const zone = zoneFor(shop, input.state);
  if (!zone) throw new CheckoutError("unavailable", "We cannot deliver there yet.", "state");

  const subtotal = lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
  return { lines, subtotal, zone: zone.name, deliveryFee: zone.fee, total: subtotal + zone.fee };
}

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "");

export function validate(raw: Record<string, unknown>): CheckoutInput {
  const items = Array.isArray(raw.items) ? (raw.items as unknown[]).slice(0, 10) : [];
  const input: CheckoutInput = {
    items: items.map((item) => {
      const line = (item ?? {}) as Record<string, unknown>;
      return { product: clean(line.product, 80), quantity: Number(line.quantity) };
    }),
    firstName: clean(raw.firstName, 60),
    lastName: clean(raw.lastName, 60),
    email: clean(raw.email, 200).toLowerCase(),
    phoneCountry: clean(raw.phoneCountry, 2).toUpperCase(),
    phone: clean(raw.phone, 30),
    address: typeof raw.address === "string" ? raw.address.trim().slice(0, 300) : "",
    city: clean(raw.city, 80),
    state: clean(raw.state, 60),
    agree: raw.agree === true,
  };
  if (!input.firstName) throw new CheckoutError("invalid", "Enter your first name.", "firstName");
  if (!input.lastName) throw new CheckoutError("invalid", "Enter your last name.", "lastName");
  if (!isValidEmail(input.email)) throw new CheckoutError("invalid", "This email doesn't look right. Please check it.", "email");
  const phone = toInternational(input.phoneCountry, input.phone);
  if (!phone) throw new CheckoutError("invalid", "This phone number doesn't look right for the country chosen.", "phone");
  input.phone = phone;
  if (input.address.length < 5) throw new CheckoutError("invalid", "Enter your delivery address.", "address");
  if (input.city.length < 2) throw new CheckoutError("invalid", "Enter your city or town.", "city");
  if (!input.agree) throw new CheckoutError("invalid", "Please agree to the policies.", "agree");
  return input;
}

function newReference(): string {
  const random = crypto.getRandomValues(new Uint8Array(5));
  return `JB-${Date.now().toString(36).toUpperCase()}-${Array.from(random, (byte) => byte.toString(36).padStart(2, "0")).join("").toUpperCase()}`;
}

/** Records the order as awaiting payment and returns Paystack's payment page for it. */
export async function startCheckout(payload: BasePayload, input: CheckoutInput, origin: string) {
  const shop = await getShop(payload);
  const priced = await quote(payload, shop, input);
  const reference = newReference();
  const order = await payload.create({
    collection: "orders",
    overrideAccess: true,
    data: {
      reference,
      status: "awaiting",
      fulfilment: "to-send",
      items: priced.lines.map((line) => ({
        product: line.product.id,
        name: line.product.name,
        unitPrice: line.unitPrice,
        quantity: line.quantity,
      })),
      subtotal: priced.subtotal,
      deliveryFee: priced.deliveryFee,
      total: priced.total,
      firstName: input.firstName,
      lastName: input.lastName,
      customerName: `${input.firstName} ${input.lastName}`,
      email: input.email,
      phone: input.phone,
      address: input.address,
      city: input.city,
      state: input.state,
      zone: priced.zone,
    },
  });
  const { authorizationUrl } = await initializePayment({
    email: input.email,
    amount: priced.total * 100,
    reference,
    // Paystack adds ?trxref=…&reference=… itself; a reference of our own would arrive twice.
    callbackUrl: `${origin}/checkout/complete`,
    metadata: { orderId: order.id, items: priced.lines.map((line) => ({ product: line.product.slug, quantity: line.quantity })) },
  });
  return { reference, authorizationUrl };
}

export type Outcome = { status: "paid" | "pending" | "failed" | "missing"; order?: Order };

/**
 * Confirms a payment with Paystack and, the first time only, marks the order paid, lowers stock and
 * sends the emails. The return page and the webhook both call it; D1 has no transactions, so the
 * claim is a single conditional UPDATE that only one caller can win.
 */
export async function finalizeOrder(payload: BasePayload, reference: string): Promise<Outcome> {
  const { docs } = await payload.find({
    collection: "orders",
    where: { reference: { equals: reference } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const order = docs[0];
  if (!order) return { status: "missing" };
  if (order.status === "paid") return { status: "paid", order };

  const payment = await verifyPayment(reference);
  const db = (payload.db as unknown as { client: D1Database }).client;
  const now = new Date().toISOString();

  if (payment.status !== "success") {
    if (["failed", "abandoned", "reversed"].includes(payment.status)) {
      await db
        .prepare("UPDATE orders SET status = 'failed', updated_at = ? WHERE reference = ? AND status = 'awaiting'")
        .bind(now, reference)
        .run();
      return { status: "failed", order: { ...order, status: "failed" } };
    }
    return { status: "pending", order };
  }

  if (payment.currency !== "NGN" || payment.amount !== Math.round(order.total * 100)) {
    payload.logger.error({ msg: `Order ${reference}: Paystack amount ${payment.amount} ${payment.currency} does not match ${order.total} NGN` });
    return { status: "pending", order };
  }

  const claim = await db
    .prepare(
      "UPDATE orders SET status = 'paid', payment_channel = ?, payment_paid_at = ?, payment_amount = ?, updated_at = ? " +
        "WHERE reference = ? AND status IN ('awaiting', 'failed')",
    )
    .bind(payment.channel ?? null, payment.paidAt ?? now, payment.amount / 100, now, reference)
    .run();
  const paid: Order = { ...order, status: "paid", payment: { channel: payment.channel, paidAt: payment.paidAt ?? now, amount: payment.amount / 100 } };
  if (claim.meta.changes !== 1) return { status: "paid", order: paid };

  for (const item of order.items) {
    const productId = typeof item.product === "object" ? item.product.id : item.product;
    await db
      .prepare("UPDATE stock SET quantity = quantity - ?, updated_at = ? WHERE product_id = ?")
      .bind(item.quantity, now, productId)
      .run();
  }

  try {
    await sendOrderEmails(payload, paid);
    await db.prepare("UPDATE orders SET emails_sent = 1 WHERE reference = ?").bind(reference).run();
  } catch (error) {
    payload.logger.error({ msg: `Order ${reference}: emails failed`, err: error });
  }
  return { status: "paid", order: paid };
}
