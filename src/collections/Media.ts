import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";
import { signedIn } from "@/payload/access";
import { revalidateOnDelete, revalidateOnPublish } from "@/payload/revalidate";

// A tiny WebP of the upload, shown blurred while the photo loads, made by Cloudflare Images.
const blurPlaceholder: CollectionBeforeChangeHook = async ({ data, req }) => {
  const file = req.file;
  if (!file?.data || !file.mimetype?.startsWith("image/")) return data;
  if (typeof navigator === "undefined" || navigator.userAgent !== "Cloudflare-Workers") return data;
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    if (!env.IMAGES) return data;
    const result = await env.IMAGES.input(new Blob([new Uint8Array(file.data)]).stream())
      .transform({ width: 8 })
      .output({ format: "image/webp", quality: 70 });
    const bytes = new Uint8Array(await result.response().arrayBuffer());
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return { ...data, blurDataURL: `data:image/webp;base64,${btoa(binary)}` };
  } catch (error) {
    req.payload.logger.warn({ msg: "Could not make a blur placeholder", err: error });
    return data;
  }
};

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Photo", plural: "Photos" },
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "updatedAt"],
    description:
      "Prepare photos with `npm run photos` first: WebP, at most 1920px wide, so they stay sharp and light.",
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  fields: [
    {
      name: "alt",
      label: "Description",
      type: "text",
      required: true,
      admin: { description: "What the photo shows, for people who cannot see it." },
    },
    {
      name: "key",
      type: "text",
      unique: true,
      index: true,
      admin: { readOnly: true, position: "sidebar", description: "Set for the photos that came with the site." },
    },
    {
      name: "blurDataURL",
      type: "text",
      admin: { hidden: true },
    },
  ],
  upload: {
    mimeTypes: ["image/webp", "image/jpeg", "image/png", "image/avif"],
    // Workers have no sharp, so Payload stores the original and Cloudflare Images resizes it on delivery.
    crop: false,
    focalPoint: false,
  },
  hooks: {
    beforeChange: [blurPlaceholder],
    afterChange: [revalidateOnPublish],
    afterDelete: [revalidateOnDelete],
  },
};
