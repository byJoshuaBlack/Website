import type { Field, GlobalConfig } from "payload";
import { isAdmin, signedIn } from "@/payload/access";
import { accents, highlight, image, images, link, lines, links } from "@/payload/fields";
import { revalidateGlobal } from "@/payload/revalidate";
import { nigerianStates } from "@/store/states";

function page(slug: string, label: string, fields: Field[], description?: string, group = "Pages"): GlobalConfig {
  return {
    slug,
    label,
    admin: { group, description },
    versions: { drafts: true },
    access: { read: () => true, update: signedIn },
    hooks: { afterChange: [revalidateGlobal] },
    fields,
  };
}

const group = (name: string, label: string, fields: Field[], description?: string): Field => ({
  name,
  label,
  type: "group",
  admin: { description },
  fields,
});

const SiteSettings = page(
  "siteSettings",
  "Site settings",
  [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "registration", label: "RC number", type: "text", required: true },
      ],
    },
    { name: "tagline", type: "text", required: true },
    {
      name: "description",
      type: "textarea",
      required: true,
      maxLength: 200,
      admin: { description: "Shown by search engines and when the site is shared." },
    },
    {
      name: "showPrices",
      type: "checkbox",
      admin: { description: "Products without a price stay blank." },
    },
    group("contact", "Contact", [
      {
        type: "row",
        fields: [
          { name: "instagramHandle", type: "text", required: true, admin: { description: "Without the @." } },
          { name: "email", type: "email" },
        ],
      },
      {
        type: "row",
        fields: [
          { name: "facebook", type: "text", admin: { description: "Full profile address." } },
          { name: "x", label: "X", type: "text", admin: { description: "Full profile address." } },
          { name: "linkedin", label: "LinkedIn", type: "text", admin: { description: "Full profile address." } },
        ],
      },
    ]),
    group("founder", "Founder", [
      {
        type: "row",
        fields: [
          { name: "name", type: "text", required: true },
          { name: "role", type: "text", required: true },
        ],
      },
    ]),
    group(
      "announcement",
      "Announcement bar",
      [
        {
          type: "row",
          fields: [
            { name: "text", type: "text" },
            { name: "href", label: "Link", type: "text" },
          ],
        },
      ],
      "Optional bar above the header. Leave empty to hide it.",
    ),
    {
      name: "tileHint",
      label: "Tile hover hint",
      type: "text",
      required: true,
      admin: { description: "Follows the mouse over a tile's photo." },
    },
    {
      name: "searchPages",
      label: "Pages in search",
      type: "array",
      admin: { description: "Pages the search finds, beside every product and article." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "title", type: "text", required: true },
            { name: "href", label: "Link", type: "text", required: true },
          ],
        },
        { name: "text", label: "Words it matches", type: "textarea", required: true },
      ],
    },
  ],
  undefined,
  "Site",
);

const Navigation = page(
  "navigation",
  "Navigation",
  [
    link("shopLink", { label: "Shop Now button", description: "The header's button, the dock's middle tab and the menu's last item." }),
    links("menuLinks", { label: "Menu", minRows: 1, maxRows: 6 }),
    {
      name: "footerColumns",
      label: "Footer columns",
      type: "array",
      maxRows: 3,
      fields: [{ name: "title", type: "text", required: true }, links("links", { minRows: 1 })],
    },
    links("suggestions", { label: "Search suggestions", description: "Shown before anything is typed in search.", maxRows: 6 }),
  ],
  undefined,
  "Site",
);

const Home = page("home", "Home", [
  group("intro", "Hero", [
    {
      name: "title",
      label: "Headline",
      type: "text",
      required: true,
      maxLength: 70,
      admin: { description: "On phones it always fills three lines." },
    },
    accents("title"),
    lines("body", {
      label: "Description",
      minRows: 4,
      maxRows: 4,
      maxLength: 36,
      description: "Exactly four lines, as the brand set them. Keep each line about as long as today's.",
    }),
    link("link", { label: "Button" }),
    lines("rise", { label: "RISE words", minRows: 4, maxRows: 4, maxLength: 12, description: "Rhythm, Interest, Structure, Entirety, in order." }),
    image("image", {
      label: "Photo",
      adminOnly: true,
      description: "Admins only. The hero's layout is tuned to this photo's framing; changing it needs a design check.",
    }),
  ]),
  group("pocketPower", "Pocket Power banner", [
    { name: "kicker", type: "text", required: true },
    lines("lines", { label: "Headline lines", minRows: 1, maxRows: 3 }),
    highlight(),
    { name: "accent", label: "Script line", type: "text", required: true },
    { name: "body", type: "textarea", required: true, maxLength: 240 },
    images("images", { label: "Carousel photos", description: "Shown in turn, in this order." }),
    link("cta", { label: "Button" }),
  ]),
]);

const CollectionPage = page("collectionPage", "Online store", [
  { name: "title", type: "text", required: true, admin: { description: "For screen readers and search engines; the page shows no title." } },
  { name: "intro", type: "textarea", required: true, admin: { description: "For search engines." } },
]);

const Traditional = page("traditional", "Traditional (fila)", [
  { name: "title", type: "text", required: true },
  { name: "intro", type: "textarea", required: true, admin: { description: "For search engines." } },
  group("card", "Card in the store", [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "descriptor", type: "text", required: true },
      ],
    },
    { name: "link", label: "Link text on the Pocket Power page", type: "text", required: true },
    image("image"),
  ]),
  group("welcome", "Opening", [
    { name: "kicker", type: "text", required: true },
    lines("lines", { label: "Headline lines", minRows: 1, maxRows: 3 }),
    highlight(),
    { name: "accent", label: "Script line", type: "text", required: true },
    { name: "body", type: "textarea", required: true },
    image("image"),
    links("links", { maxRows: 3 }),
  ]),
  group("colours", "Colours", [
    { name: "title", type: "text", required: true },
    { name: "intro", type: "text", required: true },
    {
      name: "items",
      type: "array",
      minRows: 1,
      fields: [{ name: "name", type: "text", required: true }, image("image")],
    },
  ]),
  group("order", "Ordering section", [
    { name: "title", type: "text", required: true },
    { name: "text", type: "textarea", required: true },
    image("image"),
  ]),
]);

const StyleGuidePage = page("styleGuidePage", "Style guide", [
  { name: "title", type: "text", required: true },
  { name: "intro", type: "textarea", required: true },
  image("hero", { label: "Photo" }),
]);

const World = page("world", "World (About Us)", [
  group("hero", "Opening", [
    { name: "kicker", type: "text", required: true },
    { name: "title", type: "text", required: true },
    image("image"),
  ]),
  group("name", "The name", [
    { name: "intro", type: "textarea", required: true },
    {
      name: "parts",
      type: "array",
      minRows: 1,
      fields: [
        { name: "term", type: "text", required: true },
        { name: "text", type: "text", required: true },
      ],
    },
    { name: "together", type: "text", required: true },
  ]),
  group("founder", "The founder", [
    { name: "title", type: "text", required: true },
    lines("paragraphs", { long: true, minRows: 1 }),
    { name: "quote", type: "text", required: true },
    image("image"),
  ]),
  group("timeline", "Timeline", [
    { name: "title", type: "text", required: true },
    {
      name: "events",
      type: "array",
      minRows: 1,
      fields: [
        { name: "date", type: "text", required: true },
        { name: "text", type: "textarea", required: true },
      ],
    },
    image("image"),
  ]),
  group("closing", "Closing", [
    lines("lines", { label: "Headline lines", minRows: 1, maxRows: 3 }),
    highlight(),
    { name: "accent", label: "Script line", type: "text", required: true },
    image("image"),
    links("links", { maxRows: 3 }),
  ]),
]);

const StoreNotice = page(
  "storeNotice",
  "Store notice",
  [
    { name: "status", type: "text", required: true, admin: { description: "Shown where the order button will go." } },
    { name: "note", type: "text", required: true },
    { name: "details", label: "Ordering details on product pages", type: "textarea", required: true },
  ],
  "Shown until the online store opens.",
);

const Ordering = page("ordering", "Ordering", [
  { name: "title", type: "text", required: true },
  { name: "intro", type: "textarea", required: true },
  { name: "stepsTitle", type: "text", required: true },
  {
    name: "steps",
    type: "array",
    minRows: 1,
    fields: [
      { name: "title", type: "text", required: true },
      { name: "text", type: "textarea", required: true },
    ],
  },
  image("image"),
]);

const Contact = page("contact", "Contact", [
  { name: "title", type: "text", required: true },
  { name: "intro", type: "textarea", required: true },
  {
    type: "row",
    fields: [
      { name: "cta", label: "DM button", type: "text", required: true },
      { name: "emailCta", label: "Email button", type: "text", required: true },
    ],
  },
  {
    type: "row",
    fields: [
      { name: "emailHint", label: "Text before the address", type: "text", required: true },
      { name: "copied", label: "Shown after copying", type: "text", required: true },
    ],
  },
  image("image"),
]);

const ShopSettings: GlobalConfig = {
  slug: "shopSettings",
  label: "Shop settings",
  admin: {
    group: "Shop",
    description: "Opening the shop shows the Buy button on products that can be bought online.",
  },
  access: { read: () => true, update: isAdmin },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "status",
          type: "select",
          required: true,
          defaultValue: "closed",
          options: [
            { label: "Closed: product pages show the store notice", value: "closed" },
            { label: "Open: products can be bought", value: "open" },
          ],
          admin: { description: "Admins can test checkout at /checkout while the shop is closed." },
        },
        { name: "maxPerOrder", label: "Most of one product per order", type: "number", required: true, min: 1, defaultValue: 5 },
      ],
    },
    {
      name: "alertEmail",
      label: "Send order alerts to",
      type: "email",
      required: true,
      defaultValue: "hi@byjoshuablack.com",
      access: { read: ({ req }) => Boolean(req.user) },
    },
    {
      name: "zones",
      label: "Delivery zones",
      type: "array",
      minRows: 1,
      admin: { description: "Each state belongs to one zone. The zone marked as everywhere else covers the rest." },
      validate: (rows: unknown) => {
        const list = (rows ?? []) as { everywhereElse?: boolean; states?: string[] }[];
        if (list.filter((zone) => zone.everywhereElse).length !== 1) return "Mark exactly one zone as everywhere else.";
        const states = list.flatMap((zone) => zone.states ?? []);
        const repeated = states.find((state, index) => states.indexOf(state) !== index);
        return repeated ? `${repeated} is in more than one zone.` : true;
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: "name", type: "text", required: true },
            { name: "fee", label: "Delivery fee (naira)", type: "number", required: true, min: 0 },
            { name: "everywhereElse", label: "Everywhere else", type: "checkbox" },
          ],
        },
        {
          name: "estimate",
          label: "Delivery time",
          type: "text",
          admin: { description: "Shown after payment, in the order email and on the invoice, such as \"5 to 7 working days\"." },
        },
        {
          name: "states",
          type: "select",
          hasMany: true,
          options: nigerianStates.map((state) => ({ label: state, value: state })),
          admin: { description: "Leave empty for the everywhere-else zone." },
        },
      ],
    },
  ],
};

const Checkout = page(
  "checkout",
  "Checkout",
  [
    group("cart", "Buying", [
      {
        type: "row",
        fields: [
          { name: "proceed", label: "Button beside the quantity", type: "text", required: true },
          { name: "title", label: "Checkout page title", type: "text", required: true },
          { name: "payLabel", label: "Pay button", type: "text", required: true },
        ],
      },
      { name: "intro", type: "textarea" },
      {
        type: "row",
        fields: [
          { name: "empty", label: "When the cart is empty", type: "text", required: true },
          { name: "continueShopping", type: "text", required: true },
          { name: "remove", label: "Remove link", type: "text", required: true },
        ],
      },
      {
        type: "row",
        fields: [
          { name: "quantityLabel", type: "text", required: true },
          { name: "detailsTitle", label: "Delivery details title", type: "text", required: true },
          {
            name: "priceNote",
            label: "Beside the price when delivery is free",
            type: "text",
            required: true,
            admin: { description: "Shown while every delivery zone's fee is ₦0." },
          },
        ],
      },
      {
        type: "row",
        fields: [
          { name: "soldOut", label: "When sold out", type: "text", required: true },
          { name: "closed", label: "When the shop is closed", type: "text", required: true },
        ],
      },
    ]),
    group("form", "Delivery details", [
      {
        type: "row",
        fields: [
          { name: "firstNameLabel", type: "text", required: true },
          { name: "lastNameLabel", type: "text", required: true },
          { name: "emailLabel", type: "text", required: true },
        ],
      },
      {
        type: "row",
        fields: [
          { name: "countryCodeLabel", label: "Country code (for screen readers)", type: "text", required: true },
          { name: "emailInvalid", label: "When the email looks wrong", type: "text", required: true },
          { name: "phoneInvalid", label: "When the phone number looks wrong", type: "text", required: true },
        ],
      },
      {
        type: "row",
        fields: [
          { name: "phoneLabel", type: "text", required: true },
          { name: "addressLabel", type: "text", required: true },
          { name: "cityLabel", type: "text", required: true },
          { name: "stateLabel", type: "text", required: true },
        ],
      },
      {
        type: "row",
        fields: [
          { name: "subtotalLabel", type: "text", required: true },
          { name: "deliveryLabel", type: "text", required: true },
          { name: "deliveryIncluded", label: "Delivery when its fee is ₦0", type: "text", required: true },
          { name: "totalLabel", type: "text", required: true },
        ],
      },
      { name: "agreement", type: "text", required: true, admin: { description: "Shown beside the box buyers tick; the policies are linked after it." } },
    ]),
    group("complete", "After payment", [
      { name: "paidTitle", type: "text", required: true },
      { name: "paidText", type: "textarea", required: true },
      { name: "redirectText", type: "text", admin: { description: "Under the order, while the page waits to go back to the home page." } },
      { name: "homeLabel", label: "Home button", type: "text" },
      { name: "failedTitle", type: "text", required: true },
      { name: "failedText", type: "textarea", required: true },
      { name: "pendingTitle", type: "text", required: true, admin: { description: "When Paystack has not confirmed the payment yet." } },
      { name: "pendingText", type: "textarea", required: true },
      { name: "retryLabel", type: "text", required: true },
    ]),
    group("email", "Order confirmation email", [
      { name: "subject", type: "text", required: true },
      { name: "intro", type: "textarea", required: true },
      { name: "closing", type: "textarea", required: true },
      { name: "estimateLabel", label: "Label before the delivery time", type: "text" },
      { name: "invoiceNote", label: "Note about the attached invoice", type: "text" },
    ]),
  ],
  undefined,
  "Shop",
);

export const globals: GlobalConfig[] = [
  SiteSettings,
  Navigation,
  Home,
  CollectionPage,
  Traditional,
  StyleGuidePage,
  World,
  StoreNotice,
  Ordering,
  Contact,
  ShopSettings,
  Checkout,
];

// Settings and navigation shape every page, so only admins change them.
for (const global of [SiteSettings, Navigation]) global.access = { read: () => true, update: isAdmin };
