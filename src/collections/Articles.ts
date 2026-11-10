import type { Block, CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "@/payload/access";
import { image } from "@/payload/fields";
import { revalidateOnDelete, revalidateOnPublish } from "@/payload/revalidate";

// Block slugs match the `type` of ArticleBlock in src/content/types.ts.
const blocks: Block[] = [
  {
    slug: "paragraph",
    fields: [{ name: "text", type: "textarea", required: true }],
  },
  {
    slug: "heading",
    fields: [{ name: "text", type: "text", required: true, maxLength: 80 }],
  },
  {
    slug: "quote",
    fields: [
      { name: "text", type: "textarea", required: true },
      { name: "cite", type: "text", admin: { description: "Optional: who said it." } },
    ],
  },
  {
    slug: "list",
    fields: [
      {
        name: "style",
        type: "select",
        required: true,
        defaultValue: "bullet",
        options: [
          { label: "Bullets", value: "bullet" },
          { label: "Numbered", value: "number" },
        ],
      },
      {
        name: "items",
        type: "array",
        minRows: 1,
        fields: [
          { name: "title", type: "text", admin: { description: "Optional lead-in." } },
          { name: "text", type: "textarea", required: true },
        ],
      },
    ],
  },
  {
    slug: "pair",
    labels: { singular: "Pair of terms", plural: "Pairs of terms" },
    fields: [
      {
        name: "items",
        type: "array",
        minRows: 1,
        fields: [
          { name: "term", type: "text", required: true },
          { name: "text", type: "textarea", required: true },
        ],
      },
    ],
  },
  {
    slug: "acronym",
    fields: [
      {
        name: "letters",
        type: "array",
        minRows: 1,
        fields: [
          {
            type: "row",
            fields: [
              { name: "letter", type: "text", required: true, maxLength: 1 },
              { name: "word", type: "text", required: true },
            ],
          },
          { name: "text", type: "textarea", required: true },
          { name: "example", type: "textarea" },
        ],
      },
    ],
  },
];

export const Articles: CollectionConfig = {
  slug: "articles",
  labels: { singular: "Article", plural: "Style guide" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "kicker", "_status"],
    description: "The style guide's articles. Drag to set their order.",
  },
  orderable: true,
  versions: { drafts: true },
  access: {
    read: publishedOrSignedIn,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", type: "text", required: true, maxLength: 80 },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          index: true,
          admin: { description: "The page's address: /style-guide/<slug>." },
          validate: (value: string | null | undefined) =>
            !value || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value) ? true : "Use lowercase letters, numbers and hyphens.",
        },
      ],
    },
    { name: "kicker", type: "text", required: true, maxLength: 60, admin: { description: "The script line under the title." } },
    { name: "excerpt", type: "textarea", required: true, maxLength: 240 },
    image("cover"),
    { name: "body", type: "blocks", required: true, minRows: 1, blocks },
    {
      name: "related",
      label: "Wear it with",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
  ],
  hooks: {
    afterChange: [revalidateOnPublish],
    afterDelete: [revalidateOnDelete],
  },
};
