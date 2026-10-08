import type { LinkItem } from "./types";

/** The header's Shop Now, the dock's middle tab and the menu's closing button. */
export const shopLink: LinkItem = { label: "Shop Now", href: "/collection/pocket-power" };

/** The full-screen menu, in order. Shop Now closes it as a button. */
export const menuLinks: LinkItem[] = [
  { label: "About Us", href: "/world" },
  { label: "Learn RISE", href: "/style-guide/the-rise-framework" },
  { label: "Articles", href: "/style-guide" },
  { label: "Orders and Enquiries", href: "/contact" },
];

/** Beside the logo in the footer. */
export const footerColumns: { title: string; links: LinkItem[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/world" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
