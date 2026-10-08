// Slot widths the browser uses to pick an image candidate. The page spans the full window.
// Full-width slots on phones ask for about 2x density, not 3x.
export const sizes = {
  full: "(min-width: 768px) 100vw, 70vw",
  half: "(min-width: 768px) 50vw, 70vw",
  /** The home hero, zoomed in on its subject: 1.8 times a half from md, up to about 2.1 times full width on phones (fetched near 2x density). */
  hero: "(min-width: 768px) 90vw, 140vw",
  third: "(min-width: 768px) 33vw, 50vw",
  quarter: "(min-width: 1024px) 25vw, 50vw",
  productMain: "(min-width: 1024px) 44vw, 70vw",
  strip: "(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 70vw",
  thumb: "96px",
} as const;

/** Multiplies every slot width in a `sizes` value, leaving the media conditions alone. */
export function scaleSizes(value: string, factor: number): string {
  if (factor === 1) return value;
  return value.replace(/([\d.]+)(vw|px)(?=\s*(?:,|$))/g, (_, width: string, unit: string) => {
    return `${Math.round(Number(width) * factor)}${unit}`;
  });
}
