import { site } from "@/content/site";
import type { SocialLink } from "@/content/types";

export const instagramProfile = `https://www.instagram.com/${site.contact.instagramHandle}/`;

export const socialLinks: SocialLink[] = [
  { label: "Instagram", icon: "instagram", href: instagramProfile },
  { label: "Facebook", icon: "facebook", href: site.contact.facebook },
  { label: "X", icon: "x", href: site.contact.x },
  { label: "LinkedIn", icon: "linkedin", href: site.contact.linkedin },
];

/** The profiles that have a link, for search engines. */
export const linkedProfiles = socialLinks.filter((link): link is SocialLink & { href: string } => Boolean(link.href));
