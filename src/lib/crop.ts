import type { CSSProperties } from "react";
import type { Crop } from "@/content/types";

export function cropStyle(crop?: Crop): CSSProperties | undefined {
  if (!crop) return undefined;
  const zoom = Math.min(Math.max(crop.zoom ?? 1, 1), 2);
  if (zoom === 1) return { objectPosition: `${crop.x}% ${crop.y}%` };

  // Centre the focal point as far as the image edges allow, so no blank shows.
  const origin = (p: number) => {
    const window = 100 / zoom;
    const start = Math.min(Math.max(p - window / 2, 0), 100 - window);
    return (start * zoom) / (zoom - 1);
  };
  return {
    transform: `scale(${zoom})`,
    transformOrigin: `${origin(crop.x)}% ${origin(crop.y)}%`,
  };
}
