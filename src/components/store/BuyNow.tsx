"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { setQuantity, useCart } from "@/lib/cart";

type Props = {
  slug: string;
  name: string;
  label: string;
  quantityLabel: string;
  /** The most one order may hold. */
  max: number;
};

// A quantity stepper beside a Proceed to Checkout pill; the chosen quantity goes straight to checkout.
export function BuyNow({ slug, name, label, quantityLabel, max }: Props) {
  const router = useRouter();
  const inCart = useCart().find((line) => line.slug === slug)?.quantity;
  const [chosen, setChosen] = useState<number | undefined>(undefined);
  const quantity = Math.min(Math.max(chosen ?? inCart ?? 1, 1), max);

  const step = "grid h-full w-11 place-items-center text-lg transition-opacity disabled:opacity-30";

  return (
    <div className="flex items-center gap-3">
      <div
        role="group"
        aria-label={`${quantityLabel}: ${name}`}
        className="flex h-12 shrink-0 items-center rounded-full border border-ink"
      >
        <button type="button" aria-label="One fewer" disabled={quantity <= 1} onClick={() => setChosen(quantity - 1)} className={step}>
          −
        </button>
        <span aria-live="polite" className="w-7 text-center text-base font-bold tabular-nums">
          {quantity}
        </span>
        <button type="button" aria-label="One more" disabled={quantity >= max} onClick={() => setChosen(quantity + 1)} className={step}>
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          setQuantity(slug, quantity);
          router.push("/checkout");
        }}
        className={buttonClasses("pine", "default", "min-w-0 flex-1 whitespace-nowrap px-4")}
      >
        {label}
      </button>
    </div>
  );
}
