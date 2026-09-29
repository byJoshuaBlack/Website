# Joshua Black

The website for Joshua Black, a Nigerian men's accessories label. It presents Pocket Power (one
box, ten pocket squares), a style guide, and the brand's story. Orders are taken by direct message.

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

## Edit the site

All words, products and settings live in `src/content/`. No component needs to change.

| To change | Edit |
|---|---|
| WhatsApp number, Instagram handle, tagline | `src/content/site.ts` |
| Show or hide prices | `showPrices` in `src/content/site.ts` |
| Products, names, descriptions, prices | `src/content/products.ts` |
| Style guide articles | `src/content/articles.ts` |
| Home, world and contact page copy | `src/content/pages.ts` |
| Menu and footer links | `src/content/navigation.ts` |
| Photos and their descriptions | `src/content/images.ts` |

### Turn on WhatsApp ordering

In `src/content/site.ts`, set `whatsappNumber` to the number with its country code, digits only:

```ts
whatsappNumber: "2348012345678",
```

"Order on WhatsApp" then becomes the main button on every product, with the product name already
written into the message. While the field is empty, the button opens Instagram instead.

### Show prices

Set `showPrices: true` in `src/content/site.ts`, then give each product a price in
`src/content/products.ts`:

```ts
price: { amount: 150000, currency: "NGN" },
```

Products without a price show none. While `showPrices` is off, prices never reach the page source.

### Add a photo

1. Put the file in `src/assets/images/product/` or `src/assets/images/editorial/`.
2. Import it in `src/content/images.ts` and add an entry with a description.
3. Refer to it by its id: `{ id: "pp-new-photo" }`.

To frame one part of a photo, add a crop. `x` and `y` are the focal point in percent, `zoom` runs
from 1 to 2:

```ts
{ id: "pp-fan", crop: { x: 26, y: 70, zoom: 2 } }
```

## Brand

| | |
|---|---|
| Carbon black | `#1A1A1A` |
| Bronze | `#CD7F32` |
| Pine teal | `#004F49` |
| Soft linen | `#F5F1E8` |
| Headings | Tusker Grotesk 3500 Medium (main) and 3700 Bold, uppercase only |
| Body copy | Libre Baskerville, set with generous leading |
| Interface text | Inter Regular |
| Accent | Brilliant Signature |

Logo files are in `src/assets/brand/` and the brand typefaces in `src/assets/fonts/`. Inter and
Libre Baskerville are open source and are fetched from Google Fonts when the site is built.

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
- Add the WhatsApp number.
- Replace the working names of the ten squares in `src/content/products.ts`.
- Photograph the three squares marked `needsPhoto`.
- Add care instructions to each product's `care` list. The section stays hidden while it is empty.
