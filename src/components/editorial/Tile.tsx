import Link from "next/link";
import { Frame } from "@/components/ui/Frame";
import { TextLink } from "@/components/ui/TextLink";
import { tileHint } from "@/content/pages";
import type { LinkItem, Picture } from "@/content/types";
import { cn } from "@/lib/cn";
import { HoverHint } from "./HoverHint";

type Props = {
  title: string;
  kicker?: string;
  href: string;
  picture: Picture;
  links: LinkItem[];
  sizes: string;
  caption?: "overlay" | "below";
  eager?: boolean;
  aspect?: string;
  className?: string;
};

export function Tile({ title, kicker, href, picture, links, sizes, caption = "overlay", eager, aspect, className }: Props) {
  const photos = (
    <div className="relative">
      <Frame picture={picture} sizes={sizes} eager={eager} aspect={aspect} />
      <HoverHint label={tileHint} />
    </div>
  );

  if (caption === "below") {
    return (
      <article className={cn("group relative", className)}>
        {photos}
        <div className="flex flex-col items-center gap-2 px-3 pb-8 pt-5 text-center lg:pb-10 lg:pt-6">
          <h2 className="display text-[1.625rem] leading-none tracking-[0.04em] lg:text-[2rem]">
            <Link href={href} className="after:absolute after:inset-0">
              {title}
            </Link>
          </h2>
          <ul className="relative flex flex-wrap justify-center gap-x-4">
            {links.map((link) => (
              <li key={link.label} className="text-label uppercase">
                <TextLink href={link.href} line="in">
                  {link.label}
                </TextLink>
              </li>
            ))}
          </ul>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("group relative text-paper", className)}>
      {photos}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0" />
      {/* Caption rides the viewport's bottom edge while the tile's lower part scrolls past. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-2/3 items-end">
        <div className="sticky bottom-0 w-full bg-linear-to-t from-ink/60 via-ink/25 to-transparent p-(--caption-pad) pt-24">
          {kicker && <p className="mb-2 text-tiny uppercase">{kicker}</p>}
          <h2 className="heading-md">{title}</h2>
          <ul className="pointer-events-auto mt-4 flex flex-wrap gap-x-6 gap-y-2 lg:mt-6">
            {links.map((link) => (
              <li key={link.label} className="text-body">
                <TextLink href={link.href}>{link.label}</TextLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
