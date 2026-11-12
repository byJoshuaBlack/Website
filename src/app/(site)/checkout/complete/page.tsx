import type { Metadata } from "next";
import config from "@payload-config";
import { getPayload } from "payload";
import { ClearCart } from "@/components/store/ClearCart";
import { ThumbsUp } from "@/components/store/ThumbsUp";
import { Button } from "@/components/ui/Button";
import { getContent } from "@/content";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { finalizeOrder, type Outcome } from "@/store/checkout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function CheckoutCompletePage(props: PageProps<"/checkout/complete">) {
  // Paystack returns with ?trxref=…&reference=…; older links carried a second reference of our own.
  const query = await props.searchParams;
  const reference = [query.reference, query.trxref].flat().find((value) => typeof value === "string" && value);
  const { checkout, shop } = await getContent();
  const payload = await getPayload({ config });

  let outcome: Outcome = { status: "missing" };
  if (reference) {
    try {
      outcome = await finalizeOrder(payload, reference);
    } catch (error) {
      payload.logger.error({ msg: `Could not confirm order ${reference}`, err: error });
      outcome = { status: "pending" };
    }
  }
  const { order } = outcome;
  const paid = outcome.status === "paid" && order;
  const estimate = shop.zones.find((zone) => zone.name === order?.zone)?.estimate;
  const pending = outcome.status === "pending";
  const title = paid ? checkout.complete.paidTitle : pending ? checkout.complete.pendingTitle : checkout.complete.failedTitle;
  const text = paid ? checkout.complete.paidText : pending ? checkout.complete.pendingText : checkout.complete.failedText;

  return (
    <section className="gutter mx-auto max-w-2xl py-16 text-center lg:py-28">
      {paid && <ThumbsUp />}
      <h1 className={cn("heading-lg", paid && "mt-8")}>{title}</h1>
      <p className="copy-lg mt-5">{text}</p>
      {paid && <ClearCart />}
      {paid && (
        <dl className="mx-auto mt-10 max-w-sm border-y border-rule py-5 text-left text-body">
          <div className="flex justify-between py-1">
            <dt className="text-mute">Order</dt>
            <dd>{order.reference}</dd>
          </div>
          {order.items.map((item) => (
            <div key={item.id ?? item.name} className="flex justify-between py-1">
              <dt className="text-mute">
                {item.quantity} × {item.name}
              </dt>
              <dd>{formatPrice({ amount: item.unitPrice * item.quantity, currency: "NGN" })}</dd>
            </div>
          ))}
          <div className="flex justify-between py-1">
            <dt className="text-mute">{order.zone}</dt>
            <dd>
              {order.deliveryFee === 0
                ? checkout.form.deliveryIncluded
                : formatPrice({ amount: order.deliveryFee, currency: "NGN" })}
            </dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-rule pt-3 font-bold">
            <dt>Total</dt>
            <dd>{formatPrice({ amount: order.total, currency: "NGN" })}</dd>
          </div>
          {estimate && checkout.email?.estimateLabel && (
            <div className="mt-3 flex justify-between gap-6 border-t border-rule pt-3">
              <dt className="text-mute">{checkout.email.estimateLabel}</dt>
              <dd className="text-right">{estimate}</dd>
            </div>
          )}
        </dl>
      )}
      {paid && checkout.complete.homeLabel && (
        <div className="mx-auto mt-8 max-w-sm">
          <Button href="/" variant="pine" replace>
            {checkout.complete.homeLabel}
          </Button>
        </div>
      )}
      {!paid && !pending && (
        <div className="mx-auto mt-10 max-w-sm">
          <Button href="/checkout" variant="pine">
            {checkout.complete.retryLabel}
          </Button>
        </div>
      )}
    </section>
  );
}
