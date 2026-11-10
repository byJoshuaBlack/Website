import type { CollectionConfig } from "payload";
import { isAdmin, isAdminField } from "@/payload/access";

export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email", defaultColumns: ["email", "role"] },
  auth: true,
  access: {
    // Admins manage accounts; everyone else can only read and edit their own.
    read: ({ req }) => (req.user?.role === "admin" ? true : { id: { equals: req.user?.id } }),
    create: isAdmin,
    update: ({ req }) => (req.user?.role === "admin" ? true : { id: { equals: req.user?.id } }),
    delete: isAdmin,
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      saveToJWT: true,
      access: { update: isAdminField },
      options: [
        { label: "Admin: content, accounts and the home photo", value: "admin" },
        { label: "Editor: content", value: "editor" },
      ],
    },
  ],
  hooks: {
    // The very first account is the admin.
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== "create") return data;
        const { totalDocs } = await req.payload.count({ collection: "users", req });
        return totalDocs === 0 ? { ...data, role: "admin" } : data;
      },
    ],
  },
};
