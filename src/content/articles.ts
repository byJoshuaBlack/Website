import type { Article } from "./types";

// Adapted from the brand's Instagram posts. Edit the wording freely.
export const articles: Article[] = [
  {
    slug: "the-rise-framework",
    title: "The RISE Framework",
    kicker: "AccessoRISE",
    excerpt: "Rhythm, Interest, Structure, Entirety. Four checks before an outfit leaves the house.",
    cover: { id: "ed-tan-03" },
    body: [
      {
        type: "paragraph",
        text: "Most men do not need more accessories. They need a way to decide. RISE is the check Joshua Black runs before an outfit leaves the house: four questions, asked in order.",
      },
      {
        type: "acronym",
        letters: [
          {
            letter: "R",
            word: "Rhythm",
            text: "Repetition the eye reads as consistency. Choose one thing to repeat, whether a colour, a material or a pattern, and let it appear more than once.",
            example: "Navy in the socks, the tie and the pocket square.",
          },
          {
            letter: "I",
            word: "Interest",
            text: "One focal point. Give the eye a single place to land and let everything else support it.",
            example: "A navy tie against a mauve shirt. The shirt supplies the contrast, the tie takes the attention.",
          },
          {
            letter: "S",
            word: "Structure",
            text: "The discipline behind the creativity. White space is what you leave plain so the accessories can stand out. Balance spreads visual weight so no part of you looks overloaded.",
            example: "A tan suit as the canvas. A black watch to balance the tie.",
          },
          {
            letter: "E",
            word: "Entirety",
            text: "The last look in the mirror. Do the accessories suit the clothes? Do they suit the occasion?",
            example: "A sports watch jars with a business suit. Gold cufflinks belong at a formal event, not a casual weekend.",
          },
        ],
      },
      { type: "quote", text: "Simplicity is the utmost sophistication." },
      {
        type: "paragraph",
        text: "Strip the outfit back to what it needs, then run the four checks. Anyone can learn to dress considerably better this way.",
      },
    ],
    related: ["pocket-power"],
  },
  {
    slug: "style-vs-fashion",
    title: "Style vs Fashion",
    kicker: "Not the same thing",
    excerpt: "The two words are used as if they were one. They are not.",
    cover: { id: "ed-navy-07" },
    body: [
      {
        type: "paragraph",
        text: "The two words are used as if they were one. They are not, and knowing the difference changes how you buy.",
      },
      {
        type: "pair",
        items: [
          {
            term: "Fashion",
            text: "An appearance many people adopt at once, set by whatever is popular now.",
          },
          {
            term: "Style",
            text: "An appearance that is distinctly yours, set by the principles behind how a thing is designed.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "Fashion answers to trends. Style answers to fundamentals that have been tested for generations: proportion, balance, the golden ratio. The human form has not changed, so neither have the rules built around it.",
      },
      {
        type: "paragraph",
        text: "Fashion has no rules, which is why it dates. Style has rules, and the creativity happens inside them.",
      },
      {
        type: "paragraph",
        text: "Think of fashion as a sprint, in one season and out the next. Style is the marathon. It rests on what is universally flattering, so it never ages out of your wardrobe.",
      },
      { type: "quote", text: "Fashion fades. Style sticks." },
    ],
  },
  {
    slug: "five-sock-shocks",
    title: "Five Sock Shocks",
    kicker: "And how to fix them",
    excerpt: "The accessory men think about least is the one noticed first when they sit down.",
    cover: { id: "ed-navy-08" },
    body: [
      {
        type: "paragraph",
        text: "Socks are the accessory men think about least, and the one other people notice first when you sit down. Five mistakes come up again and again.",
      },
      {
        type: "list",
        style: "number",
        items: [
          {
            title: "Too playful",
            text: "Cartoon characters and neon belong to the children in your life. Under a suit they pull every eye to your ankles.",
          },
          {
            title: "Too short",
            text: "An ankle sock leaves skin showing the moment you sit or cross your legs.",
          },
          {
            title: "Worn out",
            text: "A thinning heel or a slack cuff says you stopped paying attention. Retire them.",
          },
          {
            title: "Wrong for the occasion",
            text: "Athletic socks with dress shoes is a combination, just never a good one.",
          },
          {
            title: "Wrong colour",
            text: "A sock that fights the trouser cuts the leg in two and makes you look shorter.",
          },
        ],
      },
      { type: "heading", text: "The fix" },
      {
        type: "paragraph",
        text: "A dress sock has two jobs: to lengthen the line of the leg and to keep the leg covered. Wear them over the calf so they stay up all day. Match the colour of your trousers, or go one shade darker.",
      },
    ],
  },
  {
    slug: "the-pocket-square-and-tie-rule",
    title: "The Pocket Square and Tie Rule",
    kicker: "The rookie mistake",
    excerpt: "A square that matches the tie looks like a gift set. Here is what to do instead.",
    cover: { id: "ed-navy-06" },
    body: [
      {
        type: "paragraph",
        text: "The most common mistake with a pocket square is also the most tempting: buying it as a matching pair with the tie.",
      },
      {
        type: "paragraph",
        text: "A square cut from the same cloth as the tie looks like it came out of a gift box. It shows that someone else made the decision for you.",
      },
      { type: "quote", text: "Training wheels for the unlearned.", cite: "Joshua Black" },
      { type: "heading", text: "What to do instead" },
      {
        type: "list",
        style: "bullet",
        items: [
          { text: "Pull one colour out of the tie and let the square carry it." },
          { text: "Or choose a colour that contrasts with the tie altogether." },
          { text: "Leave the pattern alone. Echo a colour, never the whole design." },
        ],
      },
      {
        type: "paragraph",
        text: "Ten squares in one box make this easy. There is always one that picks up a colour you are already wearing.",
      },
    ],
    related: ["pocket-power", "champagne"],
  },
  {
    slug: "less-is-not-always-more",
    title: "Less Is Not Always More",
    kicker: "Dress from abundance",
    excerpt: "Somewhere along the way menswear shrank. Classic dressing never rationed cloth.",
    cover: { id: "ed-navy-09" },
    body: [
      {
        type: "paragraph",
        text: "Somewhere along the way menswear shrank. Ties narrowed, jackets rose, lapels thinned, socks dropped to the ankle and pocket squares became too small to hold a fold. Trousers tightened and slid from the waist to the hip, as though cloth had to be rationed.",
      },
      { type: "quote", text: "Dress from abundance, not scarcity." },
      { type: "heading", text: "In practice" },
      {
        type: "list",
        style: "bullet",
        items: [
          { text: "Trousers that rise to the natural waist, not the hip." },
          { text: "A jacket long enough to cover the seat." },
          { text: "Lapels wide enough to have presence." },
          { text: "A tie wider than the usual 7.5cm." },
          { text: "Socks over the calf, not the ankle." },
          { text: "Laces long enough to tie properly." },
          { text: "A pocket square large enough to hold its folds instead of sinking into the pocket." },
        ],
      },
      {
        type: "paragraph",
        text: "Less is sometimes more. Sometimes more is simply better.",
      },
    ],
  },
  {
    slug: "you-dont-need-more-clothes",
    title: "You Don't Need More Clothes",
    kicker: "A wardrobe that works",
    excerpt: "Style becomes expensive when you keep buying clothes you rarely wear.",
    cover: { id: "ed-tan-01" },
    body: [
      {
        type: "paragraph",
        text: "Style becomes expensive when you keep buying clothes you rarely wear.",
      },
      {
        type: "paragraph",
        text: "The aim is not a bigger wardrobe. It is a wardrobe that fits the life you lead, looks good, and gets worn.",
      },
      {
        type: "list",
        style: "bullet",
        items: [
          { text: "Choose timeless pieces." },
          { text: "Know your colours." },
          { text: "Accessorise well." },
          { text: "Never compromise on quality." },
        ],
      },
      {
        type: "paragraph",
        text: "Accessories are where this pays off most. Chosen with intention, they change how an outfit reads far more than another jacket would.",
      },
      {
        type: "paragraph",
        text: "Start with one question: which item in your wardrobe do you wear all the time, and why?",
      },
    ],
    related: ["pocket-power"],
  },
];
