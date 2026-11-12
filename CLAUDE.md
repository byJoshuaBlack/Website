@AGENTS.md

# Joshua Black website

Brand site for Joshua Black (@byjoshuablack), a Nigerian men's accessories label.
Visual language follows armani.com: carbon on soft linen, hairline rules, edge-to-edge portrait imagery.
Mobile first: build and check every section at 390px wide before scaling it up.

Instructions from a `CLAUDE.md` in a parent folder belong to other projects and do not apply
here. This site has no dark mode, no backend and no dashboard.

## Decisions already made

- Ordering happens on this site. Only the Pocket Power box can be bought online (`purchasable` on the
  product, with a `price` in naira and a row in Stock); squares stay "Sold as part of the Pocket Power
  box" and the fila is not sold. While Shop settings → status is Closed, the store and the box's page
  show the Store notice; Open swaps it for `BuyNow`: a pill quantity stepper (−, number, +) beside a
  larger pine Proceed to Checkout pill, which puts that quantity in the cart and opens `/checkout`.
  Signed-in admins can use `/checkout` while the shop is closed, to test. Never send visitors to Instagram, WhatsApp or direct messages to order; `/ordering` (the
  menu's Orders and Enquiries) explains it.
- The cart lives in the browser (`src/lib/cart.ts`, localStorage `jb-cart`). Once it holds
  something, a bag circle with its count joins the dock (before Search) and a Checkout link the
  header, both to `/checkout`. `/checkout` holds the items with quantity steppers, delivery details,
  the total and Pay now, which goes straight to Paystack's payment page. `/cart` redirects there; a
  paid order empties the cart.
- Delivery details ask for first and last name (orders keep both and the full name), an email
  checked as soon as the field is left, and a phone in one field (`PhoneField`): a country code
  picker on its left (Nigeria first), then the number hinted with that country's example. Phones
  are stored in international form (`+2348031234567`, `src/store/phone.ts`) so they can be texted.
- The store is a small custom checkout, not Payload's beta store plugin (`src/store/`): `/checkout`
  posts the cart's items to `POST /api/checkout`, which re-prices everything on the server, records
  an order awaiting payment and returns Paystack's hosted payment page. Paystack sends buyers to
  `/checkout/complete?reference=…` and calls `POST /api/paystack/webhook` (HMAC SHA-512 signed); both
  run `finalizeOrder`, which verifies with Paystack and claims the order with one conditional D1
  UPDATE, so stock falls and emails go out exactly once. Delivery fees come from Shop settings' zones
  (Abuja, then everywhere else). Pocket Power is ₦300,000 with delivery included: both zones are ₦0,
  so prices read "₦300,000 · Delivery included" and checkout, the confirmation and emails say
  "Included" instead of ₦0. Emails go through Cloudflare Email Sending (`EMAIL` binding) from
  orders@byjoshuablack.com; a failed email never blocks an order.
- Each delivery zone carries a delivery time (`estimate`: Abuja within 24 hours, 2 days at most;
  elsewhere 5 to 7 working days), shown on the paid page, in the order email and on the invoice.
  The buyer's and the brand's emails attach a one-page PDF invoice built on the Worker
  (`src/store/invoice.ts`, with `pdf-lib`): the logo in pine, Tusker Grotesk headings in capitals and
  Inter Regular text (the total line included), carbon and pine on linen. Workers cannot read files, so the fonts and logo are
  packed into `src/store/invoice-assets.ts` by `npm run invoice:assets` (rerun it after changing
  them). Inter is embedded whole: pdf-lib's subsetting drops its letters. Paystack has no invoice
  for a checkout payment.
- A paid order's page (`/checkout/complete`) reads Payment completed under an outline thumbs-up in pine
  (`ThumbsUp`, CSS only: it draws itself, then loops a jiggle and a gap running round the line), says the details went to the buyer's email, lists the order, and
  goes home after 8 seconds (`RedirectHome`), with a Go to home page button for anyone not waiting.
  Paystack adds `trxref` and `reference` to the return address, so the site's callback carries none.
- Policies live in Payload at `/policies/[slug]`. One page, Policies (`/policies/store`), covers
  ordering, payment, delivery, cancellations, returns and privacy; it is linked from the footer's
  Company column after Contact (in Navigation) and from "policies" in the checkout's agreement.
  The starting text came from us at the brand's request; the brand edits it. Paystack reviews it.
- Contact is an Instagram direct message: `/contact` (the footer's Contact) is one line and a pine
  Send a DM button to `instagramDm` (`ig.me/m/byjoshuablack`, `src/lib/social.ts`), which opens the
  chat straight away. Instagram cannot pre-write the message. Under it, an outline Send Email button
  opens `mailto:` `site.contact.email` (hi@byjoshuablack.com), with a hint whose address copies itself
  when tapped (`CopyText`). Its copy never mentions ordering.
- Prices show once the shop is Open (or earlier with `showPrices` in Site settings).
- The store at `/collection` shows the Pocket Power box alone, as the brand asked: its card (photo,
  name, price) leads to the box's page, with the tiles' hover (pointer cursor and soft shade) but the
  tile hint held at the photo's centre rather than following the mouse, as the brand asked, and `BuyNow` sits under it. No grid, filters or tile sizes. Every Shop Now (header, dock, menu) goes there; the home page's Buy Pocket Power goes to the
  box's page. The ten squares keep their own pages (from search, articles and the box's family), and
  a square's page keeps "More from Pocket Power". The fila, a branded Yoruba cap, keeps its page at
  `/traditional`, reached from a picture link on the Pocket Power page (`traditional.card`).
- All content lives in Payload CMS 3 on the same Worker (admin at `/admin`, API at `/api`), with D1
  (`website`) and R2 (`website-media`, public at `media.byjoshuablack.com`). Pages are prerendered from
  a snapshot taken just before `next build` (`.content/snapshot.json`, `npm run content:snapshot`), so
  build workers never open the database; at runtime they read Payload's Local API. Publishing calls
  `revalidatePath("/", "layout")` (`src/payload/revalidate.ts`): the D1 tag cache (`website-cache`)
  marks every page stale and the next visit re-renders it into the R2 page cache (`website-cache`).
  Drafts never reach the site. Runtime dependencies are Next, React, Payload, the OpenNext adapter
  and, for the invoice, `pdf-lib` with `@pdf-lib/fontkit`.
- Hosted on Cloudflare Workers through OpenNext (`wrangler.jsonc`, `open-next.config.ts`), not Vercel.
  Cloudflare Images resizes photos through the `IMAGES` binding.
- Cloudflare Access (app "Joshua Black admin", email one-time codes for an allow-list) guards
  `/admin` and `/api/users`; a rate-limiting rule blocks more than 5 POSTs to `/api/users/*` per 10 s
  per IP. The Worker answers only on byjoshuablack.com (`workers_dev` and `preview_urls` off), since
  any other address would bypass Access.
- The site lives in `src/app/(site)` with its own root layout; Payload's admin is `src/app/(payload)`,
  generated by Payload and never edited by hand. Unmatched addresses reach the site's 404 page through
  `(site)/[...missing]`. Icons, the share image, `robots.ts` and `sitemap.ts` stay at the top of
  `src/app`, where Next gives them fixed addresses.
- `src/payload.config.ts` takes bindings from the Worker at runtime and from Wrangler's local copy
  everywhere else; only the deploy's `deploy:database` and `content:snapshot:live` steps (Wrangler's
  `migrate` environment) reach the live D1 and R2. `MEDIA_ORIGIN` (a Worker variable, empty in
  `.dev.vars`) makes photo URLs point at `media.byjoshuablack.com`.
  `next build` loads no bindings. Workers have no sharp, so Payload stores originals uncropped.

## Conventions

- All copy, products, articles, photos and contact details live in Payload. Components never hard-code
  them. `src/content/index.ts` is the only way pages read them (`getContent()`, cached per request);
  `src/content/build.ts` turns Payload's documents into the shapes in `src/content/types.ts`, so
  string lists are rows of `line` and photo fields are groups of `image`, `alt` and `crop`
  (`src/payload/fields.ts`). Schema changes need a migration and must stay additive.
- Client components receive data as props and never import `src/content/*`.
- Photos are Payload Media (R2), carrying width, height and a blur placeholder; the logo and brand
  assets stay static imports. Today's photos came in through the seed migration
  (`src/migrations/*_seed_content.ts`, from `src/migrations/seed/content.json`) and their files stay in
  `src/assets/images` for it.
- Photos are WebP, at most 1920px wide, produced by `scripts/prepare-photos.mjs`. Never add an
  AI upscaler: the brand wants sharper photos with no feature changed. Sharp camera originals go
  through its `clean/` folder instead: no unsharp mask, no width cap, saved lossless (the home
  hero, `ed-tan-01`, which is shown zoomed in on its subject).
- Content spans the window up to `--page-max` (1600px), then centres on linen (`page-width` on
  `main`, the header row and each footer row). Backgrounds and rules, like the footer's pine bar
  and hairlines, still run edge to edge. The home hero (`data-wide`) spans the full window at every
  width; the home header row spans with it. The brand asked for
  this cap after seeing the site stretched on very wide screens; they had earlier rejected 1920px.
- Images are delivered as WebP at quality 80, or 85 for heroes and the product gallery.
- The logo lives in `src/components/brand/`: `Logo` masks the official artwork. The footer carries the
  logo at its normal size; the brand removed an earlier large JOSHUA BLACK wordmark there.
  Every logo (header, menu, footer) goes home through `HomeLink`, which always lands at the very top
  of the hero: it scrolls up when home is already open, and otherwise opens home at its top.
- Brand palette: carbon `#1A1A1A`, bronze `#CD7F32`, pine `#004F49`, linen `#F5F1E8`, and nothing
  else. Anything light is linen, anything dark is carbon, every warm accent is that exact bronze (no
  darker bronze, no black, no white). Softer tones are carbon faded onto linen: `mute` text (70%),
  `tile` placeholders (5%) and `rule` hairlines (14%).
- Brand type: headings in Tusker Grotesk, uppercase only (`heading-*`, `display`); body copy in
  Inter Regular at 1.4 leading, tightened twice at the brand's request (from 1.85, then 1.6) (`copy`, `copy-lg`; `quote` in Inter italic), the same as
  interface text; accents in Brilliant Signature (`script`). The brand dropped Libre Baskerville.
- Inter is used at weight 400, except that buttons (`Button`) are bold (700); the dock's tabs stay
  regular. Buttons, the dock's tabs and the store notice are in sentence case as written in content
  ("Shop Now", "Get Started", "Buy Pocket Power", each set as the brand writes it), never forced to capitals; menu links stay in capitals. Full-width buttons set their text at 18px on phones and 16px from `md`, larger than the 13px label size. Do not add `font-medium` or any other weight.
- Every dropdown uses `Select` (`src/components/ui/Select.tsx`), never the browser's own `<select>`:
  a square list with a carbon hairline on linen, the chosen item in pine with a pine dot. It opens
  upward near the bottom of the screen, and keeps arrows, Enter, Escape and type-to-jump.
- Design rules: radius 0 and no shadows, except that every button (and the store notice in a
  button's place) is a fully rounded pill. The page ground is linen (the `paper` token); white is never
  used. Pine is the primary accent: bands, headline accents, the footer bar and the `pine` button
  (Buy Pocket Power on the home page). Bronze on linen reads at only 2.8:1, so it suits large headline
  accents; the brand chose it for small text too (the dates on the World page) over a darker bronze.
- Header: on phones and tablets it holds only the logo (centred, except on the home page); navigation lives in a floating
  glass dock at the bottom (Menu, Shop Now, and Search in its own circle), which keeps
  `--dock-space` clear. Over the home hero the dock waits below the screen and slides in the moment the
  page scrolls and the next section starts to show, hiding again back at the top (`hero-in-view`;
  always shown without script). From `lg`, Menu sits left, the logo centred, and Search then Shop Now right,
  with no dock; from `xl` the menu's links replace the Menu button (there is no room before that). Beyond the pill buttons, only the dock (soft shadow) and the home hero card (rounded
  corners) break the square, shadow-free rule.
- The menu (phones up to `xl`) is a full-screen carbon overlay with linen logo and items, centred both
  ways: About Us, Learn RISE, Articles, Orders and Enquiries (`menuLinks`), then a bronze Shop Now
  button with carbon text, and nothing under it (the brand removed the social icons). While it
  is open the page's edges and theme colour turn carbon so the browser's bars match (iOS Safari keeps
  its top strip linen).
- The menu and search overlays each stand on their own history entry (`SiteNav`), so the browser's
  Back closes them and stays on the page underneath. Closing by hand steps back off that entry, and
  links inside them replace it, so no stray entries are left.
- Social profiles live in `site.contact` and `socialLinks` (`src/lib/social.ts`). Facebook, X and
  LinkedIn have no links yet: their icons show in the footer without a link
  (`SocialIcon`), and search-engine data lists only profiles that have one.
- The footer leads with the logo and the RC number under it (`site.registration`), then a Company
  column (About Us, Contact; `footerColumns`) in the next column rather than pushed right, then the
  four social icons (their own row underneath on phones, the third column from `lg`), with no rule
  between them, and the pine copyright bar. The brand removed the Pocket Power, The brand and Country
  columns.
- Pages that open with a photo hero (`data-hero`, including the home page) start with a transparent
  header whose items turn linen, and Shop Now turns to a linen button (`over-hero`, `over-photo`).
  Once the page scrolls, the header returns to linen with dark items. On phones on the home page the
  logo is carbon (the hero photo is bright behind it) and sits left, in line with Get Started and
  the RISE panel (`on-home`); every other page centres it.
- Anything that moves on its own has a static layout under the `still` variant (reduced motion or
  no script).
- The home page is the hero, the Pocket Power banner (text, then photo on phones; text left, photo
  right from md; its pine Buy Pocket Power button goes to the store), nothing more.
- The banner's photo is a carousel (`PhotoCarousel`, used whenever `SplitBanner` gets several
  pictures) of the nine Pocket Power shots in the Home page's carousel photos (the founder portrait and the
  tile crops are left out). It cross-fades (half a second) every 3.5 seconds in a loop, with small round back and forward
  buttons in clear liquid glass (`glass-clear`) halfway down its sides at every width. It pauses while hovered, focused from the
  keyboard or off screen, does not move on its own under reduced motion, and only loads the photo
  showing and the next one. It also steps on a sideways swipe on touch screens.
- Product pages show their photos in the same `PhotoCarousel` below `lg` (`ProductGallery`); from
  `lg` they stack beside the details with thumbnails, as before.
- The home hero is a rounded carbon card floating on linen at every width (6px from the screen's
  edges on phones). Its photo dissolves into
  the carbon on the side facing the text, over a blurred stretch of its own edge colours. The text
  is linen and left-aligned at every width (button and RISE panel share its left edge; on phones the button and RISE panel span the card inside its gutters (the brand tried the button
  at the description's width and went back), and the
  headline and description sit further in, three gutters from the card's edge; at every width the
  description runs in four lines, as the brand asked: "If you're here, dressing classy" / "probably feels like guesswork." / "You're not alone. It's hard, but" / "I can guide you."; on phones it scales with the card, about 11% smaller than before at the brand's request, so its longest line never runs past the headline's right edge; it is set at 1.25 leading, tighter than other copy), on phones the headline scales with the card and fills each line before breaking, so it always reads "Dress classy without / guessing. With the RISE / framework." (it is only width-capped from `md`), RISE is underlined (pine would sink into carbon), "Dress classy without guessing." is bronze, and the
  button (Get Started, to the RISE article) is a bronze pill.
  Under it, in a dark liquid-glass panel as wide as the button, with the hero card's corner radius (`glass-dark`), R I S E and their words (Rhythm, Interest, Structure, Entirety) light up letter by letter in
  one continuous wave, capital then word, like synced lyrics (CSS only; static under `still`).
  From `md` the photo is pinned to the card's left half at full height.
- On phones the card fills the screen (the dock is hidden over it) so the button shows without
  scrolling. The photo zooms in until his raised hand is about 10px from the card's right edge, his
  head just under the left-hand logo, as far as the frame's height allows with his hands ending where
  the headline begins (shorter phones stop sooner). It fades into carbon just below his hands (its
  frame has no placeholder colour there), so the headline sits on carbon. The description sits 16px
  under the headline (the brand asked for more room than the earlier 4px), and Get Started is 16px
  below it, like the RISE panel below the button.
  (The brand tried its own 4:5 crop and went back to this one.) From `md` it is zoomed to roughly waist up.
- Borrow Armani's layout, never its assets, fonts or copy.
- Code comments are rare and at most two lines.

## Commands

- `npm run dev` — local server on port 3000
- `npm run check` — type-check, lint and production build
- `npm run photos -- <folder>` — prepare photos
- `npm run invoice:assets` — repack the invoice's fonts and logo after changing them
- `npm run preview` — snapshot, Cloudflare build and local Workers runtime on port 8787, with a local database
- `npm run deploy` — migrate the live database, snapshot its content, build for Cloudflare, deploy, then
  refresh pages if anything was published meanwhile (`scripts/after-deploy.mjs`, `POST /api/revalidate`).
  Workers Builds runs it as the deploy command.
- `npm run content:snapshot` — save the local database's published content for `next build`
  (`npm run check` and `npm run preview` run it first)
- `npm run payload -- migrate:create <name>` — after changing collections; commit the migration.
  `npm run payload -- migrate` applies it to the local database
- `npm run generate:types` — after changing `wrangler.jsonc` or collections
- Builds use webpack (`next build --webpack`), as Payload on Cloudflare requires.
- Local runs need `PAYLOAD_SECRET` in `.env` and `.dev.vars` (see `.env.example`); the live one is a
  Worker secret set in the Cloudflare dashboard (type Secret, never in `wrangler.jsonc`). `keep_vars`
  stops deploys deleting dashboard variables; without it a Text `PAYLOAD_SECRET` vanished on deploy.
- Payload hashes passwords with 100,000 PBKDF2 iterations (`auth.passwordHashIterations`): Workers
  reject Payload's default of 600,000.
- Cloudflare installs with npm 10 (`npm clean-install`). After changing dependencies, refresh the lock
  file with `npx npm@10 install`: one written by npm 11 alone fails there (missing `@emnapi/*`).
- Judge image sharpness on a deployed Cloudflare version, where Cloudflare Images resizes photos;
  locally, `npm run build && npm run start` is the closest, never the dev server.
