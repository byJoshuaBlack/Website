export const sizes = {
  full: "100vw",
  half: "(min-width: 768px) 50vw, 100vw",
  quarter: "(min-width: 1024px) 25vw, 50vw",
  third: "(min-width: 1024px) 33vw, 50vw",
  productMain: "(min-width: 1024px) 45vw, 100vw",
  strip: "(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 70vw",
  thumb: "96px",
} as const;

export const gridSizes = {
  2: "(min-width: 768px) 50vw, 100vw",
  3: "(min-width: 768px) 33vw, 50vw",
  4: "(min-width: 768px) 25vw, 50vw",
} as const;
