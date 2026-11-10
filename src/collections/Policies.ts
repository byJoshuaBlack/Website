import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "@/payload/access";
import { revalidateOnDelete, revalidateOnPublish } from "@/payload/revalidate";
import { articleBlocks } from "./Articles";

export const Policies: CollectionConfig = {
  slug: "policies",
  labels: { singular: "Policy", plural: "Policies" },
  admin: {
    group: "Shop",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status"],
    description:
      "Delivery, returns and refunds, terms of sale and privacy, at /policies/<slug>. Paystack reviews these before it activates payments.",
  },
  orderable: true,
  versions: { drafts: true },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", type: "text", required: true, maxLength: 60 },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          index: true,
          validate: (value: string | null | undefined) =>
            !value || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value) ? true : "Use lowercase letters, numbers and hyphens.",
        },
      ],
    },
    { name: "summary", type: "textarea", required: true, maxLength: 200, admin: { description: "For search engines." } },
    { name: "body", type: "blocks", required: true, minRows: 1, blocks: articleBlocks },
  ],
  hooks: { afterChange: [revalidateOnPublish], afterDelete: [revalidateOnDelete] },
};
