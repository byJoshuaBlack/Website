import type { ImageRef, LinkItem } from "./types";

export type TileContent = {
  title: string;
  href: string;
  image: ImageRef;
  links: LinkItem[];
};

export const home = {
  statement: {
    title: "A guide into sophistication, through accessories.",
    links: [
      { label: "Discover Pocket Power", href: "/collection/pocket-power" },
      { label: "The world of Joshua Black", href: "/world" },
    ] satisfies LinkItem[],
  },

  quartet: [
    {
      title: "Pocket Power",
      href: "/collection/pocket-power",
      image: { id: "pp-box-open" },
      links: [{ label: "Discover the box", href: "/collection/pocket-power" }],
    },
    {
      title: "The Squares",
      href: "/collection",
      image: { id: "pp-fan" },
      links: [{ label: "View all ten", href: "/collection" }],
    },
    {
      title: "Style Guide",
      href: "/style-guide",
      image: { id: "ed-tan-03" },
      links: [{ label: "Read", href: "/style-guide" }],
    },
    {
      title: "The World",
      href: "/world",
      image: { id: "ed-navy-04" },
      links: [{ label: "Discover more", href: "/world" }],
    },
  ] satisfies TileContent[],

  hero: {
    title: "The intentional man",
    image: { id: "ed-tan-02", crop: { x: 45, y: 14, top: 11.5 } } satisfies ImageRef,
    links: [
      { label: "Discover Pocket Power", href: "/collection/pocket-power" },
      { label: "Read the Style Guide", href: "/style-guide" },
    ] satisfies LinkItem[],
  },

  banner: {
    kicker: "New",
    lines: ["One box.", "Ten pocket squares."],
    highlight: "Ten",
    accent: "to make you stand out",
    body: "A silk-wool blend, soft yet structured enough to hold its fold in your pocket. Each square folds up to seven ways.",
    image: { id: "pp-drape" } satisfies ImageRef,
    links: [
      { label: "Discover Pocket Power", href: "/collection/pocket-power" },
      { label: "View all ten", href: "/collection" },
    ] satisfies LinkItem[],
  },

  duoProduct: [
    {
      title: "The squares",
      href: "/collection",
      image: { id: "pp-rail" },
      links: [{ label: "Discover the collection", href: "/collection" }],
    },
    {
      title: "From the founder",
      href: "/world",
      image: { id: "pp-founder-box" },
      links: [{ label: "Read the story", href: "/world" }],
    },
  ] satisfies TileContent[],

  duoGuide: [
    {
      title: "Less is not always more",
      href: "/style-guide/less-is-not-always-more",
      image: { id: "ed-navy-09" },
      links: [{ label: "Read the guide", href: "/style-guide/less-is-not-always-more" }],
    },
    {
      title: "Five sock shocks",
      href: "/style-guide/five-sock-shocks",
      image: { id: "ed-navy-08" },
      links: [{ label: "Read the guide", href: "/style-guide/five-sock-shocks" }],
    },
  ] satisfies TileContent[],

  rise: {
    kicker: "The Style Guide",
    title: "It is time to accessoRISE",
    link: { label: "Read the RISE framework", href: "/style-guide/the-rise-framework" } satisfies LinkItem,
    letters: [
      { letter: "R", word: "Rhythm", text: "Repeat one colour, material or pattern." },
      { letter: "I", word: "Interest", text: "Give the eye a single place to land." },
      { letter: "S", word: "Structure", text: "Leave white space. Balance the weight." },
      { letter: "E", word: "Entirety", text: "Check the clothes, then the occasion." },
    ],
  },

  follow: [
    { id: "ed-navy-04" },
    { id: "pp-fan" },
    { id: "ed-tan-01" },
    { id: "pp-noir" },
    { id: "ed-navy-03" },
    { id: "pp-box-stack" },
    { id: "ed-tan-04" },
    { id: "pp-rust" },
    { id: "ed-navy-06" },
    { id: "pp-closeup" },
  ] satisfies ImageRef[],
};

export const collection = {
  title: "Pocket Power",
  intro: "One box, ten pocket squares in a silk-wool blend. Browse the box and each square inside it.",
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
      { label: "Order and enquiries", href: "/contact" },
    ] satisfies LinkItem[],
  },
};

export const contact = {
  title: "Order and enquiries",
  intro: "Joshua Black takes orders by direct message. Tell us what you are looking for and we will take it from there.",
  image: { id: "pp-box-stack" } satisfies ImageRef,
  steps: [
    { title: "Choose", text: "Browse Pocket Power and note the pieces you like." },
    {
      title: "Message",
      text: "Send a direct message. The order button on every product page starts the conversation for you.",
    },
    {
      title: "Confirm",
      text: "We confirm availability, price, payment and delivery with you directly.",
    },
  ],
};
