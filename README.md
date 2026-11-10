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

## Before launch

- Set `NEXT_PUBLIC_SITE_URL` to the live address, for example `https://your-domain.com`, in the
  Worker's build variables. Without it, the sitemap and shared previews point at localhost.
- Connect the online store, and replace the "Online store opening soon" notice on the product
  and fila pages with its order buttons.
- Replace the working names of the ten squares (Products in the admin).
- Photograph the three squares marked `needsPhoto`.
- Replace the founder portraits with the original camera files. The current ones came from
  Instagram and are soft at large sizes.
- Add care instructions to each product's `care` list. The section stays hidden while it is empty.
