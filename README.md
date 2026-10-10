# Joshua Black

The website for Joshua Black, a Nigerian men's accessories label. It presents Pocket Power (one
box, ten pocket squares), the fila, a style guide, and the brand's story. Ordering will happen on the site
itself once the online store opens; until then the product pages say it is opening soon. Visitors
reach the brand by Instagram direct message from the Contact page.

Built with Next.js 16, React 19, TypeScript and Tailwind CSS 4. Every page is static.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Command | What it does |
|---|---|
| `npm run dev` | Local server with live reload |
| `npm run check` | Type-check, lint and production build |
| `npm run build` | Production build only |
| `npm run start` | Serve the production build (run `build` first) |
| `npm run photos -- <folder>` | Prepare photos as WebP (see below) |

## Edit the site

All words, products and settings live in `src/content/`. No component needs to change.

| To change | Edit |
|---|---|
| Instagram handle, tagline | `src/content/site.ts` |
| The "Online store opening soon" wording | `store` in `src/content/pages.ts` |
| Show or hide prices | `showPrices` in `src/content/site.ts` |
| Products, names, descriptions, prices | `src/content/products.ts` |
| Style guide articles | `src/content/articles.ts` |
| Home, shop, fila, world, ordering and contact page copy | `src/content/pages.ts` |
| Menu and footer links, and the header's Shop now button | `src/content/navigation.ts` |
| Photos and their descriptions | `src/content/images.ts` |

### Show an announcement strip

A thin carbon strip can sit above the header on every page. It is off. To turn it on, add this to
`site` in `src/content/site.ts`:

```ts
announcement: { text: "Pocket Power. One box. Ten pocket squares.", href: "/collection/pocket-power" },
```

### Show prices

Set `showPrices: true` in `src/content/site.ts`, then give each product a price in
`src/content/products.ts`:

```ts
price: { amount: 150000, currency: "NGN" },
```

Products without a price show none. While `showPrices` is off, prices never reach the page source.

### Add or replace a photo

Photos are stored as WebP, at most 1920px wide, and are prepared by a script rather than by hand.

1. Put the original files in a folder with two subfolders, `product/` and `editorial/`.
2. Run the script on that folder:

   ```bash
   npm run photos -- "/path/to/that/folder"
   ```

   It resizes each photo, sharpens it lightly and saves it to `src/assets/images/` as `.webp`.
   It never invents detail, so the sharper the original, the sharper the result.
3. Import the new file in `src/content/images.ts` and add an entry with a description.
4. Refer to it by its id: `{ id: "pp-new-photo" }`.

A file with the same name replaces the existing photo, so better originals can be dropped in
without touching any other file.

Squares without a photo of their own use a tile cut from a group shot. The cuts are listed at the
top of `scripts/prepare-photos.mjs`; `x` and `y` are the focal point in percent.

To shift which part of a photo shows inside its frame, add a focal point where the photo is used:

```ts
{ id: "ed-tan-02", crop: { x: 45, y: 34 } }
```

### How images are delivered

Visitors never download the stored files. Each image is resized to the width their screen needs
and sent as WebP, and images below the first screen load only when scrolled to.

Pages span the full window. On very wide screens a full-width photo is stretched beyond the
1920px that is stored, so sharper originals matter most there.

## Brand

| | |
|---|---|
| Carbon black | `#1A1A1A` |
| Bronze | `#CD7F32` |
| Pine teal | `#004F49`, the primary accent |
| Soft linen | `#F5F1E8`, the page ground. The site uses no white. |
| Headings | Tusker Grotesk 3500 Medium (main) and 3700 Bold, uppercase only |
| Body copy | Inter Regular, set with generous leading (italic for quotes) |
| Interface text | Inter Regular |
| Accent | Brilliant Signature |

Logo files are in `src/assets/brand/` and the brand typefaces in `src/assets/fonts/`. Inter is
open source and is fetched from Google Fonts when the site is built.

Tusker Grotesk and Brilliant Signature are licensed fonts: confirm the brand's licences cover use
on a website.

### Add Tusker Grotesk 3700 Bold

This weight is paid for and was not in the supplied files, so small headings and numerals use
3500 Medium for now. Once you have the file:

1. Save it as `src/assets/fonts/TuskerGrotesk-3700Bold.otf`.
2. In `src/app/fonts.ts`, add:

   ```ts
   export const tuskerBold = localFont({
     src: "../assets/fonts/TuskerGrotesk-3700Bold.otf",
     variable: "--font-tusker-bold",
     weight: "700",
     display: "swap",
   });
   ```

3. In `src/app/layout.tsx`, import `tuskerBold` and add `${tuskerBold.variable}` to the class
   list on `<html>`.

Small headings and numerals switch to the bold weight on their own.

## Before launch

- Set `NEXT_PUBLIC_SITE_URL` to the live address, for example `https://your-domain.com`.
- Connect the online store, and replace the "Online store opening soon" notice on the product
  and fila pages with its order buttons.
- Replace the working names of the ten squares in `src/content/products.ts`.
- Photograph the three squares marked `needsPhoto`.
- Replace the founder portraits with the original camera files. The current ones came from
  Instagram and are soft at large sizes.
- Add care instructions to each product's `care` list. The section stays hidden while it is empty.
