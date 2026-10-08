@AGENTS.md

# Joshua Black website

Brand site for Joshua Black (@byjoshuablack), a Nigerian men's accessories label.
Visual language follows armani.com: carbon on soft linen, hairline rules, edge-to-edge portrait imagery.
Mobile first: build and check every section at 390px wide before scaling it up.

Instructions from a `CLAUDE.md` in a parent folder belong to other projects and do not apply
here. This site has no dark mode, no backend and no dashboard.

## Decisions already made

- Ordering will happen on this site, through an online store that opens soon. Until then, product
  pages show "Online store opening soon" (`store` in `src/content/pages.ts`) where the order button
  will go. Never send visitors to Instagram, WhatsApp or direct messages to order.
- Prices hidden. `showPrices` in `src/content/site.ts` turns them on.
- Catalogue is Pocket Power (the box and its ten squares) plus the fila, a branded Yoruba cap.
  The fila has its own page at `/traditional`, outside the product catalogue.
- Fully static. No database, no CMS, no runtime dependencies beyond Next and React.

## Conventions

- All copy, products, articles and contact details live in `src/content/`. Components never hard-code them.
- Client components receive data as props and never import `src/content/*`.
- Photos are statically imported through `src/content/images.ts`, never referenced by string path.
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
  button with carbon text, and linen Instagram, Facebook, X and LinkedIn icons at the foot. While it
  is open the page's edges and theme colour turn carbon so the browser's bars match (iOS Safari keeps
  its top strip linen).
- Social profiles live in `site.contact` and `socialLinks` (`src/lib/social.ts`). Facebook, X and
  LinkedIn have no links yet: their icons show in the menu and footer without a link
  (`SocialIcon`), and search-engine data lists only profiles that have one.
- The footer leads with the logo and the RC number under it (`site.registration`), then a Company
  column (About Us, Contact; `footerColumns`) in the next column rather than pushed right, then the
  four social icons (their own row underneath on phones, the third column from `lg`), with no rule
  between them, and the pine copyright bar. The brand removed the Pocket Power, The brand and Country
  columns.
- Pages that open with a photo hero (`data-hero`, including the home page) start with a transparent
  header whose items turn linen, and Shop Now turns to a linen button (`over-hero`, `over-photo`).
  Once the page scrolls, the header returns to linen with dark items. On phones on the home page the
  logo is carbon (the hero photo is bright behind it) and sits left, in line with the hero's
  headline and description (`on-home`); every other page centres it.
- Anything that moves on its own has a static layout under the `still` variant (reduced motion or
  no script).
- The home page is the hero, the Pocket Power banner (text, then photo on phones; text left, photo
  right from md; its pine Buy Pocket Power button goes to the store), nothing more.
- The banner's photo is a carousel (`PhotoCarousel`, used whenever `SplitBanner` gets several
  pictures) of the nine Pocket Power shots in `home.pocketPower.images` (the founder portrait and the
  tile crops are left out). It cross-fades (half a second) every 3.5 seconds in a loop, with small round back and forward
  buttons in clear liquid glass (`glass-clear`) halfway down its sides at every width. It pauses while hovered, focused from the
  keyboard or off screen, does not move on its own under reduced motion, and only loads the photo
  showing and the next one.
- The home hero is a rounded carbon card floating on linen at every width (6px from the screen's
  edges on phones). Its photo dissolves into
  the carbon on the side facing the text, over a blurred stretch of its own edge colours. The text
  is linen and left-aligned at every width (button and RISE panel share its left edge; on phones the button is exactly as wide as the description's
  longest line, the RISE panel spans the card inside its gutters, and the
  headline and description sit further in, three gutters from the card's edge; at every width the
  description runs in four lines, as the brand asked: "If you're here, dressing classy" / "probably feels like guesswork." / "You're not alone. It's hard, but" / "I can guide you."; on phones it scales with the card so its longest line fills about 90% of the text width; it is set at 1.25 leading, tighter than other copy), on phones the headline scales with the card and fills each line before breaking, so it always reads "Dress classy without / guessing. With the RISE / framework." (it is only width-capped from `md`), RISE is underlined (pine would sink into carbon), "Dress classy without guessing." is bronze, and the
  button (Get Started, to the RISE article) is a bronze pill.
  Under it, in a dark liquid-glass panel as wide as the button, with the hero card's corner radius (`glass-dark`), R I S E and their words (Rhythm, Interest, Structure, Entirety) light up letter by letter in
  one continuous wave, capital then word, like synced lyrics (CSS only; static under `still`).
  From `md` the photo is pinned to the card's left half at full height.
- On phones the card fills the screen (the dock is hidden over it) so the button shows without
  scrolling. The photo zooms in until his raised hand is about 10px from the card's right edge, his
  head just under the left-hand logo, as far as the frame's height allows with his hands ending where
  the headline begins (shorter phones stop sooner). It fades into carbon just below his hands (its
  frame has no placeholder colour there), so the headline sits on carbon. The headline sits close
  over the description, and Get Started is 16px below it, like the RISE panel below the button.
  (The brand tried its own 4:5 crop and went back to this one.) From `md` it is zoomed to roughly waist up.
- Borrow Armani's layout, never its assets, fonts or copy.
- Code comments are rare and at most two lines.

## Commands

- `npm run dev` — local server on port 3000
- `npm run check` — type-check, lint and production build
- `npm run photos -- <folder>` — prepare photos
- Judge image sharpness on `npm run build && npm run start`, not on the dev server.
