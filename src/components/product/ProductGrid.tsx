"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { sizes } from "@/lib/sizes";
import { ProductCard, type ProductCardData } from "./ProductCard";

type Density = "large" | "medium" | "small";
type Filter = "all" | "set" | "piece" | "fila";

const densities: { id: Density; icon: IconName; label: string; grid: string; sizes: string; mobile: boolean }[] = [
  {
    id: "large",
    icon: "grid-2",
    label: "Large tiles",
    grid: "grid-cols-1 md:grid-cols-2",
    sizes: sizes.half,
    mobile: true,
  },
  {
    id: "medium",
    icon: "grid-3",
    label: "Medium tiles",
    grid: "grid-cols-2 md:grid-cols-3",
    sizes: sizes.third,
    mobile: true,
  },
  {
    id: "small",
    icon: "grid-4",
    label: "Small tiles",
    grid: "grid-cols-2 md:grid-cols-4",
    sizes: "(min-width: 768px) 25vw, 50vw",
    mobile: false,
  },
];

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "set", label: "The box" },
  { id: "piece", label: "Squares" },
  { id: "fila", label: "Fila" },
];

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  const [density, setDensity] = useState<Density>("medium");
  const [filter, setFilter] = useState<Filter>("all");

  const layout = densities.find((option) => option.id === density) ?? densities[1]!;
  const visible = filter === "all" ? products : products.filter((product) => product.kind === filter);

  return (
    <>
      <div className="sticky top-(--header-h) z-30 border-y border-rule bg-paper">
        <div className="gutter grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
          <p aria-live="polite" className="whitespace-nowrap text-label">
            {visible.length} {visible.length === 1 ? "piece" : "pieces"}
          </p>

          <div role="group" aria-label="Tile size" className="flex items-center gap-1">
            {densities.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-label={option.label}
                aria-pressed={density === option.id}
                onClick={() => setDensity(option.id)}
                className={cn(
                  "h-9 w-8 place-items-center transition-colors sm:w-9",
                  option.mobile ? "grid" : "hidden md:grid",
                  density === option.id ? "text-ink" : "text-mute/50 hover:text-ink",
                )}
              >
                <Icon name={option.icon} />
              </button>
            ))}
          </div>

          <div role="group" aria-label="Filter" className="flex items-center justify-end gap-2.5 sm:gap-6">
            {filters.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={filter === option.id}
                onClick={() => setFilter(option.id)}
                className="whitespace-nowrap text-label"
              >
                <span data-active={filter === option.id} className="link-line-in">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul className={cn("grid", layout.grid)}>
        {visible.map((product, index) => (
          <li key={product.slug} className="border-b border-r border-rule">
            <ProductCard product={product} sizes={layout.sizes} eager={index < 3} />
          </li>
        ))}
      </ul>
    </>
  );
}
