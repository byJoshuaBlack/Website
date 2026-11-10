import type { Endpoint } from "payload";
import { CheckoutError, finalizeOrder, getShop, startCheckout, validate } from "./checkout";
import { isValidSignature } from "./paystack";

/**
 * Where Paystack sends the buyer back: the page's own origin when it is this site or a local run
 * (local Workers report the route's host), otherwise this site over HTTPS.
 */
function returnOrigin(requestUrl: string | undefined, pageOrigin: string | null): string {
  const site = new URL(requestUrl ?? "https://byjoshuablack.com");
  if (pageOrigin) {
    const page = new URL(pageOrigin);
    if (page.host === site.host || ["localhost", "127.0.0.1"].includes(page.hostname)) return page.origin;
  }
  return `https://${site.host}`;
}

/** POST /api/checkout: records the order and answers with Paystack's payment page. */
export const checkoutEndpoint: Endpoint = {
  path: "/checkout",
  method: "post",
  handler: async (req) => {
    try {
      const shop = await getShop(req.payload);
      // While the shop is closed, signed-in admins can still test it end to end.
      if (shop.status !== "open" && req.user?.role !== "admin") {
        throw new CheckoutError("closed", "The online store is not open yet.");
      }
      const input = validate(((await req.json?.().catch(() => null)) ?? {}) as Record<string, unknown>);
      const origin = returnOrigin(req.url, req.headers.get("origin"));
      const { reference, authorizationUrl } = await startCheckout(req.payload, input, origin);
      return Response.json({ reference, authorizationUrl });
    } catch (error) {
      if (error instanceof CheckoutError) {
        return Response.json({ code: error.code, message: error.message, field: error.field }, { status: 400 });
      }
      req.payload.logger.error({ msg: "Checkout failed", err: error });
      return Response.json({ code: "error", message: "Something went wrong. Please try again." }, { status: 500 });
    }
  },
};

/** POST /api/paystack/webhook: Paystack's own notice of a successful charge, in case the buyer never returns. */
export const paystackWebhookEndpoint: Endpoint = {
  path: "/paystack/webhook",
  method: "post",
  handler: async (req) => {
    const raw = (await req.text?.()) ?? "";
    if (!(await isValidSignature(raw, req.headers.get("x-paystack-signature")))) {
      return Response.json({ message: "Invalid signature" }, { status: 401 });
    }
    const event = JSON.parse(raw) as { event?: string; data?: { reference?: string } };
    if (event.event === "charge.success" && event.data?.reference) {
      try {
        const outcome = await finalizeOrder(req.payload, event.data.reference);
        req.payload.logger.info({ msg: `Paystack webhook: order ${event.data.reference} is ${outcome.status}` });
      } catch (error) {
        req.payload.logger.error({ msg: "Paystack webhook failed", err: error });
        return Response.json({ message: "Try again" }, { status: 500 });
      }
    }
    return Response.json({ received: true });
  },
};
