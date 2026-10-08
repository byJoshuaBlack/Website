import { Fragment } from "react";
import { PhotoCarousel } from "@/components/editorial/PhotoCarousel";
import { Button } from "@/components/ui/Button";
import { Frame } from "@/components/ui/Frame";
import { TextLink } from "@/components/ui/TextLink";
import type { LinkItem, Picture } from "@/content/types";
import { cn } from "@/lib/cn";
import { sizes } from "@/lib/sizes";

const tones = {
  linen: { panel: "bg-linen text-ink", highlight: "text-bronze", accent: "text-pine" },
  pine: { panel: "bg-pine text-linen", highlight: "text-bronze", accent: "text-linen" },
  ink: { panel: "bg-ink text-linen", highlight: "text-bronze", accent: "text-linen" },
  paper: { panel: "bg-paper text-ink", highlight: "text-bronze", accent: "text-pine" },
};

type Props = {
  /** One entry per line of the headline. */
  lines: string[];
  /** A word in the headline to set in bronze. */
  highlight?: string;
  /** A short phrase in the brand's script, set under the headline. */
  accent?: string;
  kicker?: string;
  body?: string;
  /** One photo, or several shown in turn as a carousel. */
  picture: Picture | Picture[];
  links?: LinkItem[];
  /** A pine button under the text. */
  cta?: LinkItem;
  tone?: keyof typeof tones;
  reverse?: boolean;
  /** From md, sets the banner in from the window edges like the home hero card, its photo rounded. */
  inset?: boolean;
  level?: "h1" | "h2";
  /** Marks the banner as the page's opening, so its photo loads first. */
  priority?: boolean;
};

export function SplitBanner({
  lines,
  highlight,
  accent,
  kicker,
  body,
  picture,
  links = [],
  cta,
  tone = "linen",
  reverse,
  inset,
  level = "h2",
  priority,
}: Props) {
  const colours = tones[tone];
  const Heading = level;
  const photos = Array.isArray(picture) ? picture : [picture];
  const rounded = inset && "md:rounded-2xl md:[clip-path:inset(0_round_1rem)]";

  const paint = (line: string) => {
    if (!highlight || !line.includes(highlight)) return line;
    const [before, ...rest] = line.split(highlight);
    return (
      <>
        {before}
        <span className={colours.highlight}>{highlight}</span>
        {rest.join(highlight)}
      </>
    );
  };

  return (
    <section className={cn("group grid md:grid-cols-2", inset && "mt-8 md:mx-4 md:mt-4 lg:mt-24")}>
      <div className={cn("flex items-center", colours.panel, reverse && "md:order-2")}>
        <div className="w-full max-w-2xl p-(--caption-pad) py-16 md:py-(--caption-pad)">
          {kicker && <p className="mb-5 text-tiny uppercase opacity-70">{kicker}</p>}
          <Heading className="heading-xl">
            {lines.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && " "}
                <span className="block">{paint(line)}</span>
              </Fragment>
            ))}
          </Heading>
          {accent && (
            <p className={cn("script -mt-1 pl-[12%] text-[clamp(2rem,1.2rem+2.6vw,3.5rem)]", colours.accent)}>{accent}</p>
          )}
          {body && <p className="copy-lg mt-7 max-w-md">{body}</p>}
          {links.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {links.map((link) => (
                <li key={link.label} className="text-body">
                  <TextLink href={link.href}>{link.label}</TextLink>
                </li>
              ))}
            </ul>
          )}
          {cta && (
            <div className="mt-8 max-w-sm">
              <Button href={cta.href} variant="pine">
                {cta.label}
              </Button>
            </div>
          )}
        </div>
      </div>
      {photos.length > 1 ? (
        <PhotoCarousel pictures={photos} sizes={sizes.half} label={`${lines.join(" ")} photos`} className={cn(rounded)} />
      ) : (
        <Frame picture={photos[0]} sizes={sizes.half} priority={priority} quality={priority ? 85 : 80} className={cn(rounded)} />
      )}
    </section>
  );
}
