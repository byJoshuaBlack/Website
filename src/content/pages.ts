import type { Accent, ImageRef, LinkItem } from "./types";

/** Follows the mouse over a tile's photo. */
export const tileHint = "Learn more";

export const home = {
  intro: {
    title: "Dress classy without guessing. With the RISE framework.",
    accents: [
      { text: "RISE", tone: "pine" },
      { text: "Dress classy without guessing.", tone: "bronze" },
    ] satisfies Accent[],
    // Each line starts on its own line at every width.
    body: ["If you're here, dressing classy", "probably feels like guesswork.", "You're not alone. It's hard, but", "I can guide you."],
    link: { label: "Get Started", href: "/style-guide/the-rise-framework" } satisfies LinkItem,
    rise: ["Rhythm", "Interest", "Structure", "Entirety"],
    image: { id: "ed-tan-01", crop: { x: 40, y: 30, top: 16 } } satisfies ImageRef,
  },

  pocketPower: {
    lines: ["One box.", "Ten pocket squares."],
    highlight: "Ten",
    accent: "to make you stand out",
    body: "A silk-wool blend, soft yet structured enough to hold its fold in your pocket. Each square folds up to seven ways.",
    kicker: "New",
    // Shown in turn, in this order.
    images: [
      { id: "pp-rust" },
      { id: "pp-box-open" },
      { id: "pp-fan" },
      { id: "pp-drape" },
      { id: "pp-rail" },
      { id: "pp-box-stack" },
      { id: "pp-closeup" },
      { id: "pp-noir" },
      { id: "pp-box-engraved" },
    ] satisfies ImageRef[],
    cta: { label: "Buy Pocket Power", href: "/collection/pocket-power" } satisfies LinkItem,
  },
};

export const collection = {
  title: "Online Store",
  // Search engines only; the page shows the title alone.
  intro: "Pocket Power: the box, and each of the ten silk-wool pocket squares inside it.",
};

export const traditional = {
  title: "Traditional: the Fila",
  // Its card in the online store and its picture link on the Pocket Power page.
  card: {
    name: "The Fila",
    descriptor: "Traditional cap",
    link: "Discover the fila",
    image: { id: "trad-red-portrait" } satisfies ImageRef,
  },
  intro: "The fila, the Yoruba cap that completes a traditional outfit, with the Joshua Black monogram in its band.",
  welcome: {
    kicker: "Traditional",
    lines: ["The fila.", "Worn like a crown."],
    highlight: "crown",
    accent: "for the royal bloodline",
    body: "The fila is the Yoruba cap that completes a traditional outfit. Ours carries the Joshua Black monogram in its band, made to finish your kaftan or agbada.",
    image: { id: "trad-rose-profile" } satisfies ImageRef,
    links: [
      { label: "See the colours", href: "#colours" },
      { label: "Ordering", href: "#order" },
    ] satisfies LinkItem[],
  },
  colours: {
    title: "The colours",
    intro: "Each fila carries the monogram in its band.",
    items: [
      { name: "Green", image: { id: "trad-green-band", crop: { x: 50, y: 30 } } },
      { name: "Rose", image: { id: "trad-rose-band" } },
      { name: "Red and navy", image: { id: "trad-red-band" } },
      { name: "Tan", image: { id: "trad-tan-band" } },
    ] satisfies { name: string; image: ImageRef }[],
  },
  order: {
    title: "Order your fila",
    text: "Our online store opens soon. When it does, you will choose your colour and order your fila right here.",
    image: { id: "trad-green-seated" } satisfies ImageRef,
  },
};

export const styleGuide = {
  title: "Style Guide",
  intro: "Notes on dressing with intention. Fewer rules than you think, and better ones.",
  hero: { id: "ed-tan-04", crop: { x: 50, y: 12 } } satisfies ImageRef,
};

export const world = {
  hero: {
    kicker: "The World of Joshua Black",
    title: "2 words. 1 idea.",
    image: { id: "ed-navy-03", crop: { x: 55, y: 10 } } satisfies ImageRef,
  },
  name: {
    intro: "Joshua Black is more than a name. It is the idea behind everything the brand makes.",
    parts: [
      { term: "Joshua", text: "Hebrew for salvation. A guide to something better." },
      { term: "Black", text: "Sophistication. Class." },
    ],
    together: "A guide into sophistication, through accessories.",
  },
  founder: {
    image: { id: "pp-founder-box" } satisfies ImageRef,
    title: "The founder",
    paragraphs: [
      "Joshua Black was founded by Opeyemi Okediji. Joshua is his middle name.",
      "He treats dressing as stewardship: taking what has been given and caring for it with intention, beauty and purpose. Accessories are where that care shows first.",
    ],
    quote: "Dress like you're of the royal bloodline.",
  },
  timeline: {
    title: "The making of Pocket Power",
    image: { id: "pp-box-engraved" } satisfies ImageRef,
    events: [
      {
        date: "January 2026",
        text: "The idea: give customers something that makes them feel truly special. The plan allowed two months.",
      },
      {
        date: "First quarter",
        text: "The plan did not survive. Hurdles arrived one after another, and the quarter closed with nothing to show.",
      },
      {
        date: "30 April",
        text: "The first squares arrive. After months of sleepless nights, the collection is real.",
      },
      {
        date: "May",
        text: "The squares are ready, but the launch waits. A collection like this needs a box worthy of it.",
      },
      { date: "23 May", text: "The box arrives. Love at first sight." },
      { date: "1 July 2026", text: "Pocket Power launches." },
    ],
  },
  closing: {
    lines: ["The finishing", "touch"],
    highlight: "touch",
    accent: "for the intentional man",
    image: { id: "pp-box-open" } satisfies ImageRef,
    links: [
      { label: "Discover Pocket Power", href: "/collection/pocket-power" },
      { label: "Ordering", href: "/ordering" },
    ] satisfies LinkItem[],
  },
};

/** Shown where the order button will sit once the online store opens. */
export const store = {
  status: "Online store opening soon",
  note: "You will be able to order right here on our website.",
  details: "Our online store opens soon. You will be able to order and pay for every piece right here on our website.",
};

export const ordering = {
  title: "Ordering",
  intro: "Our online store opens soon. When it does, you will choose, order and pay for every piece right here on our website.",
  image: { id: "pp-box-stack" } satisfies ImageRef,
  stepsTitle: "How ordering will work",
  steps: [
    { title: "Choose", text: "Browse Pocket Power and the fila and pick the pieces you want." },
    { title: "Order", text: "Place your order and pay on our website. There is nothing to arrange by message." },
    { title: "Receive", text: "We prepare your order and send it to you." },
  ],
};

/** Contact runs through Instagram direct messages; ordering stays on the website. */
export const contact = {
  title: "Contact",
  intro: "The quickest way to reach Joshua Black is a direct message on Instagram. Tap below and the chat opens, ready for your message.",
  cta: "Send a DM",
  emailCta: "Send Email",
  // Followed by the address, which copies itself when tapped.
  emailHint: "Send mail to",
  copied: "Copied",
  image: { id: "ed-tan-02", crop: { x: 50, y: 20 } } satisfies ImageRef,
};
