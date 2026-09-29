import { site } from "@/content/site";
import type { Product } from "@/content/types";

export type OrderChannel = {
  kind: "whatsapp" | "instagram";
  label: string;
  href: string;
};

export function orderMessage(product?: Pick<Product, "kind" | "name" | "number" | "slug">): string {
  if (!product) return "Hello Joshua Black, I would like to make an enquiry.";
  const link = `${site.url}/collection/${product.slug}`;
  if (product.kind === "piece") {
    return `Hello Joshua Black, I would like to order Pocket Power. I was looking at ${product.name} (No. ${product.number}). ${link}`;
  }
  return `Hello Joshua Black, I would like to order ${product.name}. ${link}`;
}

export function orderChannels(product?: Pick<Product, "kind" | "name" | "number" | "slug">): OrderChannel[] {
  const { whatsappNumber, instagramHandle } = site.contact;
  const channels: OrderChannel[] = [];
  const verb = product ? "Order" : "Message us";

  if (whatsappNumber) {
    channels.push({
      kind: "whatsapp",
      label: `${verb} on WhatsApp`,
      href: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage(product))}`,
    });
  }
  // ig.me accepts no pre-filled text, so the customer types the request there.
  channels.push({
    kind: "instagram",
    label: whatsappNumber ? "Message on Instagram" : `${verb} on Instagram`,
    href: `https://ig.me/m/${instagramHandle}`,
  });
  return channels;
}

export const instagramProfile = `https://www.instagram.com/${site.contact.instagramHandle}/`;
