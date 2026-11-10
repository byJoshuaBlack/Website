import type { CollectionConfig, Field, FieldAccess } from "payload";
import { isAdmin, signedIn } from "@/payload/access";

// Everything about an order is fixed when it is paid; only its delivery progress is edited by hand.
const fixed: FieldAccess = () => false;

function readOnly(field: Field): Field {
  if (field.type === "row") return { ...field, fields: field.fields.map(readOnly) };
  return { ...field, access: { ...("access" in field ? field.access : {}), update: fixed } } as Field;
}

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    group: "Shop",
    useAsTitle: "reference",
    defaultColumns: ["reference", "status", "fulfilment", "total", "customerName", "createdAt"],
    description: "Orders placed through the online store. Mark them dispatched and delivered as they go out.",
  },
  access: {
    read: signedIn,
    // Only the checkout endpoint creates orders, with overrideAccess.
    create: () => false,
    update: signedIn,
    delete: isAdmin,
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "fulfilment",
          label: "Delivery",
          type: "select",
          required: true,
          defaultValue: "to-send",
          options: [
            { label: "To send", value: "to-send" },
            { label: "Dispatched", value: "dispatched" },
            { label: "Delivered", value: "delivered" },
          ],
        },
        { name: "note", label: "Delivery note", type: "text", admin: { description: "Courier, tracking number or anything worth recording." } },
      ],
    },
    ...[
      { name: "reference", type: "text", required: true, unique: true, index: true },
      {
        name: "status",
        type: "select",
        required: true,
        defaultValue: "awaiting",
        index: true,
        options: [
          { label: "Awaiting payment", value: "awaiting" },
          { label: "Paid", value: "paid" },
          { label: "Payment failed", value: "failed" },
          { label: "Cancelled", value: "cancelled" },
        ],
      },
      {
        name: "items",
        type: "array",
        required: true,
        minRows: 1,
        fields: [
          { name: "product", type: "relationship", relationTo: "products", required: true },
          { name: "name", type: "text", required: true },
          { name: "unitPrice", type: "number", required: true },
          { name: "quantity", type: "number", required: true },
        ],
      },
      {
        type: "row",
        fields: [
          { name: "subtotal", type: "number", required: true },
          { name: "deliveryFee", type: "number", required: true },
          { name: "total", type: "number", required: true, admin: { description: "Naira." } },
        ],
      },
      {
        type: "row",
        fields: [
          { name: "firstName", type: "text", required: true },
          { name: "lastName", type: "text", required: true },
          { name: "customerName", label: "Full name", type: "text", required: true },
        ],
      },
      {
        type: "row",
        fields: [
          { name: "email", type: "email", required: true },
          { name: "phone", type: "text", required: true, admin: { description: "International form, ready for SMS." } },
        ],
      },
      {
        type: "row",
        fields: [
          { name: "address", type: "textarea", required: true },
          { name: "city", type: "text", required: true },
          { name: "state", type: "text", required: true },
        ],
      },
      { name: "zone", label: "Delivery zone", type: "text", required: true },
      {
        name: "payment",
        type: "group",
        fields: [
          {
            type: "row",
            fields: [
              { name: "channel", type: "text" },
              { name: "paidAt", type: "date", admin: { date: { pickerAppearance: "dayAndTime" } } },
              { name: "amount", label: "Amount received (naira)", type: "number" },
            ],
          },
        ],
      },
      {
        name: "emailsSent",
        type: "checkbox",
        admin: { position: "sidebar", description: "Whether the confirmation and alert emails went out." },
      },
    ].map((field) => readOnly(field as Field)),
  ],
};
