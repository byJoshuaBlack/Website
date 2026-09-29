import Link from "next/link";
import { Frame } from "@/components/ui/Frame";
import { TextLink } from "@/components/ui/TextLink";
import type { LinkItem, Picture } from "@/content/types";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  kicker?: string;
  picture: Picture;
  links?: LinkItem[];
  href?: string;
  /** Marks the hero as page-opening, which lets the header sit transparent over it. */
  opening?: boolean;
  level?: "h1" | "h2";
};

export function HeroBanner({ title, kicker, picture, links = [], href, opening, level = "h2" }: Props) {
  const Heading = level;
  return (
    <section
      {...(opening ? { "data-hero": "" } : {})}
      className={cn("group relative text-paper", opening && "-mt-(--header-h)")}
    >
      <Frame
        picture={picture}
        sizes="100vw"
        priority={opening}
        hover={false}
        aspect="aspect-portrait md:aspect-[16/9] md:max-h-[92svh] md:w-full"
      />
      {href && <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0" />}
      {opening && <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/45 to-transparent" />}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 via-black/25 to-transparent p-(--caption-pad) pt-32">
        {kicker && <p className="mb-3 text-tiny uppercase">{kicker}</p>}
        <Heading className="heading-xl">{title}</Heading>
        {links.length > 0 && (
          <ul className="pointer-events-auto mt-4 flex flex-wrap gap-x-6 gap-y-2 lg:mt-6">
            {links.map((link) => (
              <li key={link.label} className="text-body">
                <TextLink href={link.href}>{link.label}</TextLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
