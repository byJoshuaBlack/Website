import type { CSSProperties } from "react";
import type { Crop } from "@/content/types";

type CropLayout = {
  /** How much larger than its frame the image is drawn. */
  zoom: number;
  box: CSSProperties;
  image?: CSSProperties;
};

// A zoomed crop enlarges the image box instead of using a CSS transform, so the browser
// draws real pixels and can be told (through `sizes`) to fetch a candidate that large.
export function cropLayout(crop?: Crop): CropLayout {
  const zoom = Math.min(Math.max(crop?.zoom ?? 1, 1), 2);
  if (!crop || zoom === 1) {
    return {
      zoom: 1,
      box: { inset: 0 },
      image: crop ? { objectPosition: `${crop.x}% ${crop.y}%` } : undefined,
    };
  }

  // Centre the focal point as far as the image edges allow, so no blank shows.
  const offset = (focus: number) => {
    const visible = 100 / zoom;
    const start = Math.min(Math.max(focus - visible / 2, 0), 100 - visible);
    return `${-start * zoom}%`;
  };

  return {
    zoom,
    box: {
      width: `${zoom * 100}%`,
      height: `${zoom * 100}%`,
      left: offset(crop.x),
      top: offset(crop.y),
    },
  };
}
