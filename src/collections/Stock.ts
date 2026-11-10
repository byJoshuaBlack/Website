import type { CollectionConfig } from "payload";
import { isAdmin, signedIn } from "@/payload/access";

// Kept apart from the versioned product, so publishing an old draft never resets it. Paid orders
// lower it in one statement (src/store/checkout.ts).
export const Stock: CollectionConfig = {
  slug: "stock",
  labels: { singular: "Stock", plural: "Stock" },
  admin: {
    group: "Shop",
    useAsTitle: "label",
    defaultColumns: ["label", "quantity", "updatedAt"],
    description: "How many of each product can still be sold. Paid orders lower it on their own.",
  },
  access: { read: signedIn, create: isAdmin, update: signedIn, delete: isAdmin },
  fields: [
    { name: "product", type: "relationship", relationTo: "products", required: true, unique: true, index: true },
    {
      name: "quantity",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: { description: "Below zero means more were sold than were in stock: contact those buyers." },
    },
    {
      name: "label",
      type: "text",
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          async ({ siblingData, req }) => {
            const id = typeof siblingData.product === "object" ? siblingData.product?.id : siblingData.product;
            if (!id) return undefined;
            const product = await req.payload.findByID({ collection: "products", id, depth: 0, req, draft: false }).catch(() => null);
            return product?.name;
          },
        ],
      },
    },
  ],
};
