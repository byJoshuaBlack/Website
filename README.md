# Joshua Black

The website for Joshua Black, a Nigerian men's accessories label. It presents Pocket Power (one
box, ten pocket squares), the fila, a style guide, and the brand's story. Ordering will happen on the site
itself once the online store opens; until then the product pages say it is opening soon. Visitors
reach the brand by Instagram direct message from the Contact page.

Built with Next.js 16, React 19, TypeScript and Tailwind CSS 4. Every page is prerendered. Payload CMS
runs alongside at `/admin`, ready for the content and store to move into it.

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
| `npm run preview` | Build for Cloudflare and serve it locally on the Workers runtime (port 8787) |
| `npm run deploy` | Build for Cloudflare and deploy to the live Worker |

## Hosting

The site runs on Cloudflare Workers through the OpenNext adapter (`@opennextjs/cloudflare`).
`wrangler.jsonc` names the Worker (`website`, as created in the Cloudflare dashboard) and its bindings, and `open-next.config.ts`
serves every prerendered page straight from the Worker's static assets. Photos are resized
and converted to WebP by Cloudflare Images through the `IMAGES` binding.

Payload's database is the D1 database `website`, and uploaded files go to the R2 bucket
`website-media`. Database changes are migrations in `src/migrations`, applied to the live database
before each deploy.

Pushes to `main` deploy through Workers Builds (build command `npm run typecheck && npm run lint`,
deploy command `npm run deploy`, which migrates, snapshots, builds and deploys). Build variables:
`NEXT_PUBLIC_SITE_URL` and `REVALIDATE_SECRET`. Worker secrets (type Secret): `PAYLOAD_SECRET`,
`REVALIDATE_SECRET` (the same value), `CACHE_PURGE_API_TOKEN` (Zone → Cache Purge on byjoshuablack.com).
Generate secrets with `openssl rand -hex 32`.

For local work, copy `.env.example` to `.env` and to `.dev.vars` and fill in `PAYLOAD_SECRET`.

## Edit the site

Everything visitors read and see is edited at **byjoshuablack.com/admin**, behind Cloudflare Access
(an emailed code) and a Payload account. Press **Publish** and the site shows the change on the next
visit; **Save draft** keeps it off the site until you publish.

| To change | In the admin |
|---|---|
| Name, tagline, description, RC number, Instagram and email | Site settings |
| Show or hide prices, the announcement strip, pages in search | Site settings |
| Menu, footer columns, Shop Now button, search suggestions | Navigation |
| Products: names, descriptions, details, photos, order in the store | Products (drag to reorder) |
| Style guide articles | Style guide |
| Home, store, fila, style guide, world, ordering and contact copy | Pages |
| The "Online store opening soon" wording | Pages → Store notice |
| Photos and their descriptions | Photos |

Site settings, Navigation, accounts and the home hero photo are for admins; editors change
everything else. Some fields guard the design: the home description is exactly four lines, an
accent must appear in its headline, every photo needs a description and crops stay in range.

### Add or replace a photo

Prepare photos before uploading them, so they stay sharp and light: WebP, at most 1920px wide.

1. Put the original files in a folder with two subfolders, `product/` and `editorial/`.
2. Run the script on that folder:

   ```bash
   npm run photos -- "/path/to/that/folder"
   ```

   It resizes each photo, sharpens it lightly and saves it to `src/assets/images/` as `.webp`.
   It never invents detail, so the sharper the original, the sharper the result.
3. Upload the file under **Photos** with a description, then choose it wherever it should appear.

Where a photo is used, its optional crop keeps a point in view: `x` and `y` in percent of the
photo's width and height, `zoom` from 1 to 2, or `top` to trim a fixed share above the subject.

### How content reaches the pages

Payload stores content in the D1 database `website` and photos in the R2 bucket `website-media`,
served from `media.byjoshuablack.com`. Each deploy migrates the database, saves a snapshot of the
published content (`npm run content:snapshot:live`), builds every page from it, and afterwards
refreshes pages if anything was published during the build. After that, publishing marks pages
stale in the tag cache and the next visit renders them again from Payload.

To work locally, copy `.env.example` to `.env` and `.dev.vars`, then run `npm run payload -- migrate`
once: it creates a local database with all of today's content and photos.

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
2. In `src/app/(site)/fonts.ts`, add:

   ```ts
   export const tuskerBold = localFont({
     src: "../../assets/fonts/TuskerGrotesk-3700Bold.otf",
     variable: "--font-tusker-bold",
     weight: "700",
     display: "swap",
   });
   ```

3. In `src/app/(site)/layout.tsx`, import `tuskerBold` and add `${tuskerBold.variable}` to the class
   list on `<html>`.

Small headings and numerals switch to the bold weight on their own.

## Run the online store

Only the Pocket Power box is sold online. Everything is managed under **Shop** in the admin.

**Before opening**
1. Open a Paystack business account and save its secret key as the Worker secret
   `PAYSTACK_SECRET_KEY` (type Secret). Start with the test key (`sk_test_…`).
2. Review the starting policy under **Shop → Policies** (at `/policies/store`), especially the
   dispatch, delivery and returns times. Paystack reviews it before it activates payments.
3. In Cloudflare, onboard byjoshuablack.com under **Email Service → Email Sending**, so order
   emails can be sent from orders@byjoshuablack.com.
4. Pocket Power starts at **₦300,000, delivery included** (both delivery zones at ₦0, so pages
   say "Delivery included"). Tick **Can be bought online** on the product, set the quantity under
   **Shop → Stock**, and check the alert address under **Shop → Shop settings**. A delivery fee above
   ₦0 is added at checkout and shown with its zone.
5. Test: signed in to the admin, choose a quantity on the store page, Proceed to Checkout, and pay
   with a Paystack test card.
6. When Paystack approves the account, replace the secret with the live key, add the webhook URL
   `https://byjoshuablack.com/api/paystack/webhook` in Paystack's settings, place one real order,
   then set **Shop settings → status** to Open.

**Emails and invoices:** a paid order emails the buyer their order, the delivery time for their
zone (**Shop → Shop settings → Delivery zones → Delivery time**) and a PDF invoice; the alert email
to the brand carries the same invoice, and goes to the alert address plus any listed under
**Shop → Shop settings → Also send order alerts to**. The site builds the invoice itself; nothing is needed in
Paystack.

**Day to day:** paid orders appear under **Shop → Orders** (and in the alert email). Set each one's
**Delivery** to Dispatched, then Delivered, with a note such as the courier or tracking number. A
negative stock means more were sold than were in stock: contact those buyers.

## Before launch

- Set `NEXT_PUBLIC_SITE_URL` to the live address, for example `https://your-domain.com`, in the
  Worker's build variables. Without it, the sitemap and shared previews point at localhost.
- Open the online store (see "Run the online store" below).
- Replace the working names of the ten squares (Products in the admin).
- Photograph the three squares marked `needsPhoto`.
- Replace the founder portraits with the original camera files. The current ones came from
  Instagram and are soft at large sizes.
- Add care instructions to each product's `care` list. The section stays hidden while it is empty.
