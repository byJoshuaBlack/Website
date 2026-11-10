import type { SiteConfig, SocialLink } from "@/content/types";

export const instagramProfile = (handle: string) => `https://www.instagram.com/${handle}/`;

/** Meta's direct link into a chat with the account, in the app when it is installed. */
export const instagramDm = (handle: string) => `https://ig.me/m/${handle}`;

export function socialLinks(contact: SiteConfig["contact"]): SocialLink[] {
  return [
    { label: "Instagram", icon: "instagram", href: instagramProfile(contact.instagramHandle) },
    { label: "Facebook", icon: "facebook", href: contact.facebook },
    { label: "X", icon: "x", href: contact.x },
    { label: "LinkedIn", icon: "linkedin", href: contact.linkedin },
  ];
}

/** The profiles that have a link, for search engines. */
export function linkedProfiles(contact: SiteConfig["contact"]): (SocialLink & { href: string })[] {
  return socialLinks(contact).filter((link): link is SocialLink & { href: string } => Boolean(link.href));
}
