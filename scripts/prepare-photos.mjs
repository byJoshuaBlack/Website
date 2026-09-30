// Prepares photos for the site: node scripts/prepare-photos.mjs <folder with product/ and editorial/>
// Nothing here invents detail. It resamples, applies an unsharp mask and saves WebP.
import { mkdir, readdir } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const OUT = "src/assets/images";
// Keeps stored files small. Raise it only for photos that hold real detail beyond this width.
const MAX_WIDTH = 1920;
const TILE_WIDTH = 1200;
const webp = { quality: 85, effort: 6, smartSubsample: true };

const presets = {
  // Studio shots arrive at 1080px with real detail: enlarge them so they stay clean on dense screens.
  product: { upscaleBelow: 1900, scale: 2, sharpen: { sigma: 1.4, m1: 0.3, m2: 2.2, x1: 2, y2: 9, y3: 11 } },
  // Portraits arrive large but soft, so they get a stronger mask and no upscale.
  editorial: { upscaleBelow: 0, scale: 1, sharpen: { sigma: 1.4, m1: 0.3, m2: 2.6, x1: 2, y2: 10, y3: 14 } },
};

// Squares that have no photo of their own are cut from a group shot. Cutting here, not in the
// browser, means visitors download only the part they see. x and y are the focal point in percent.
const tiles = [
  { name: "tile-emerald", from: "pp-box-open-01", x: 36, y: 72, zoom: 1.5 },
  { name: "tile-midnight", from: "pp-closeup-01", x: 58, y: 54, zoom: 1.6 },
  { name: "tile-black-paisley", from: "pp-fan-01", x: 26, y: 70, zoom: 1.6 },
  { name: "tile-champagne", from: "pp-fan-01", x: 63, y: 76, zoom: 1.6 },
  { name: "tile-aubergine", from: "pp-drape-01", x: 22, y: 40, zoom: 1.5 },
  { name: "tile-slate", from: "pp-drape-01", x: 52, y: 60, zoom: 1.5 },
  { name: "tile-tenth", from: "pp-box-open-01", x: 57, y: 36, zoom: 1.5 },
];

const source = process.argv[2];
if (!source) {
  console.error("Usage: node scripts/prepare-photos.mjs <folder containing product/ and editorial/>");
  process.exit(1);
}

const isPhoto = (file) => /\.(jpe?g|png|webp)$/i.test(file);
const report = (output, info) => console.log(`${output}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);

for (const [group, preset] of Object.entries(presets)) {
  const dir = join(source, group);
  const files = (await readdir(dir).catch(() => [])).filter(isPhoto);
  await mkdir(join(OUT, group), { recursive: true });

  for (const file of files.sort()) {
    const input = join(dir, file);
    const { width } = await sharp(input).metadata();
    const target = Math.min(width < preset.upscaleBelow ? width * preset.scale : width, MAX_WIDTH);
    const output = join(OUT, group, `${basename(file, extname(file))}.webp`);

    const info = await sharp(input)
      .rotate()
      .resize({ width: target, kernel: "lanczos3" })
      .sharpen(preset.sharpen)
      .webp(webp)
      .toFile(output);
    report(output, info);
  }
}

const productDir = join(source, "product");
const productFiles = (await readdir(productDir).catch(() => [])).filter(isPhoto);

for (const tile of tiles) {
  const file = productFiles.find((f) => basename(f, extname(f)) === tile.from);
  if (!file) {
    console.warn(`skipped ${tile.name}: ${tile.from} not found in ${productDir}`);
    continue;
  }
  const input = join(productDir, file);
  const { width, height } = await sharp(input).metadata();
  const w = Math.round(width / tile.zoom);
  const h = Math.round(height / tile.zoom);
  // Centre the focal point as far as the photo's edges allow.
  const left = Math.round(Math.min(Math.max((tile.x / 100) * width - w / 2, 0), width - w));
  const top = Math.round(Math.min(Math.max((tile.y / 100) * height - h / 2, 0), height - h));
  const output = join(OUT, "product", `${tile.name}.webp`);

  const info = await sharp(input)
    .rotate()
    .extract({ left, top, width: w, height: h })
    .resize({ width: TILE_WIDTH, kernel: "lanczos3" })
    .sharpen(presets.product.sharpen)
    .webp(webp)
    .toFile(output);
  report(output, info);
}
