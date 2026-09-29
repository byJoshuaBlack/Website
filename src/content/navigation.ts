import { articles } from "./articles";
import { products } from "./products";
import type { LinkItem, NavNode } from "./types";

const squares = products.filter((p) => p.kind === "piece");

export const navigation: NavNode[] = [
  {
    label: "Pocket Power",
    children: [
      { label: "Discover the box", href: "/collection/pocket-power" },
      { label: "All pieces", href: "/collection" },
      {
        label: "The squares",
        children: squares.map((p) => ({ label: p.name, href: `/collection/${p.slug}` })),
      },
    ],
  },
  {
    label: "Style Guide",
    children: [
      { label: "All guides", href: "/style-guide" },
      ...articles.map((a) => ({ label: a.title, href: `/style-guide/${a.slug}` })),
    ],
  },
  { label: "The World of Joshua Black", href: "/world" },
  { label: "Order and enquiries", href: "/contact" },
];

export const footerColumns: { title: string; links: LinkItem[] }[] = [
  {
    title: "Client service",
    links: [
      { label: "Order and enquiries", href: "/contact" },
      { label: "How ordering works", href: "/contact#how-it-works" },
    ],
  },
  {
    title: "Pocket Power",
    links: [
      { label: "The box", href: "/collection/pocket-power" },
      { label: "All pieces", href: "/collection" },
    ],
  },
  {
    title: "The brand",
    links: [
      { label: "The World of Joshua Black", href: "/world" },
      { label: "Style Guide", href: "/style-guide" },
    ],
  },
];
