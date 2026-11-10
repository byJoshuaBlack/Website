import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Describe the photo for people who cannot see it." },
    },
  ],
  // Workers have no sharp, so Payload stores the original and Cloudflare Images resizes it on delivery.
  upload: {
    mimeTypes: ["image/*"],
    crop: false,
    focalPoint: false,
  },
};
