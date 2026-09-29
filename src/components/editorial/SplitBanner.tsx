import { Frame } from "@/components/ui/Frame";
import { TextLink } from "@/components/ui/TextLink";
import type { LinkItem, Picture } from "@/content/types";
import { cn } from "@/lib/cn";
import { sizes } from "@/lib/sizes";

const tones = {
  linen: { panel: "bg-linen text-ink", highlight: "text-bronze-ink", accent: "text-pine" },
  pine: { panel: "bg-pine text-linen", highlight: "text-bronze", accent: "text-linen" },
  ink: { panel: "bg-ink text-linen", highlight: "text-bronze", accent: "text-linen" },
  paper: { panel: "bg-paper text-ink", highlight: "text-bronze-ink", accent: "text-pine" },
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
  picture: Picture;
  links?: LinkItem[];
  tone?: keyof typeof tones;
  reverse?: boolean;
};

export function SplitBanner({ lines, highlight, accent, kicker, body, picture, links = [], tone = "linen", reverse }: Props) {
  const colours = tones[tone];

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
    <section className="group grid md:grid-cols-2">
      <div className={cn("flex items-center", colours.panel, reverse && "md:order-2")}>
        <div className="w-full max-w-2xl p-(--caption-pad) py-16 md:py-(--caption-pad)">
          {kicker && <p className="mb-5 text-tiny uppercase opacity-70">{kicker}</p>}
          <h2 className="heading-xl">
            {lines.map((line) => (
              <span key={line} className="block">
                {paint(line)}
              </span>
            ))}
          </h2>
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
        </div>
      </div>
      <Frame picture={picture} sizes={sizes.half} />
    </section>
  );
}
