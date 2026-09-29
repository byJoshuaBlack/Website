import type { Money } from "@/content/types";

export function formatPrice({ amount, currency }: Money): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}
