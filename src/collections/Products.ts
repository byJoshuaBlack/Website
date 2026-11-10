import type { CollectionConfig, Field } from "payload";
import { publishedOrSignedIn, signedIn } from "@/payload/access";
import { image, images, lines } from "@/payload/fields";
import { revalidateOnDelete, revalidateOnPublish } from "@/payload/revalidate";

// Exported so the store plugin can take this collection over in Phase 4 and add prices, variants
// and stock beside these fields.
export const productFields: Field[] = [
  {
    type: "row",
    fields: [
      { name: "name", type: "text", required: true, maxLength: 60 },
      {
        name: "slug",
        type: "text",
        required: true,
        unique: true,
        index: true,
        admin: { description: "The page's address: /collection/<slug>. Lowercase words joined by hyphens." },
        validate: (value: string | null | undefined) =>
          !value || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value) ? true : "Use lowercase letters, numbers and hyphens.",
      },
    ],
  },
  {
    type: "row",
    fields: [
      {
        name: "kind",
        type: "select",
        required: true,
        defaultValue: "piece",
        options: [
          { label: "The box (set)", value: "set" },
          { label: "A square (piece)", value: "piece" },
        ],
      },
      { name: "number", type: "text", admin: { description: "A square's number in the box, like 01." } },
      { name: "descriptor", type: "text", required: true, maxLength: 60, admin: { description: "Its colour, or what the box holds." } },
    ],
  },
  { name: "summary", type: "textarea", required: true, maxLength: 200 },
  lines("description", { long: true, minRows: 1, label: "Description paragraphs" }),
  lines("details", { label: "Info & details" }),
  lines("care", { label: "Product care", description: "Hidden on the page while empty." }),
  image("tile", { label: "Card photo", description: "Shown in the store's grid." }),
  images("gallery", { label: "Gallery" }),
  {
    name: "needsPhoto",
    type: "checkbox",
    admin: { position: "sidebar", description: "Marks squares still waiting for their own photo." },
  },
];

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "kind", "number", "_status"],
    description: "Drag to set the order of the store's grid. The box comes first.",
  },
  orderable: true,
  versions: { drafts: true },
  access: {
    read: publishedOrSignedIn,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  fields: productFields,
  hooks: {
    afterChange: [revalidateOnPublish],
    afterDelete: [revalidateOnDelete],
  },
};
