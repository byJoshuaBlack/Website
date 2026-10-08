import { Fragment } from "react";
import { Button } from "@/components/ui/Button";
import { Frame } from "@/components/ui/Frame";
import { Highlight } from "@/components/ui/Highlight";
import type { Accent, LinkItem, Picture } from "@/content/types";
import { cn } from "@/lib/cn";
import { sizes } from "@/lib/sizes";

// Pine would sink into the hero's carbon, so its accent is an underline instead.
const tones = {
  pine: "underline decoration-[0.05em] underline-offset-[0.06em]",
  bronze: "text-bronze",
};

// Each letter of the RISE row glows in turn; a capital and its word share one step of the six-second cycle.
const glyph = "inline-block animate-rise-wave still:animate-none still:opacity-80";
const step = 1.5;

type Props = {
  title: string;
  accents: Accent[];
  /** Lines that each start a new line. */
  body: string[];
  link: LinkItem;
  /** The words behind R, I, S and E, shown under the button. */
  rise: string[];
  picture: Picture;
};

export function IntroHero({ title, accents, body, link, rise, picture }: Props) {
  return (
    // A carbon card floating on linen that slides under the header, transparent over it until the page
    // scrolls. On phones it fills the screen (the dock waits below it); from md the photo takes the left half.
    <section
      data-hero
      data-wide
      className="relative isolate mx-1.5 -mt-[calc(var(--header-h)-0.375rem)] grid min-h-[calc(100svh-0.75rem)] grid-rows-[minmax(10rem,1fr)_auto] overflow-hidden rounded-2xl bg-ink text-paper [clip-path:inset(0_round_1rem)] md:mx-4 md:-mt-[calc(var(--header-h)-1rem)] md:min-h-[min(calc(100svh-2rem),calc(62.5vw+var(--header-h)))] md:grid-cols-2 md:grid-rows-none"
    >
      {/* On phones the photo zooms in until his raised hand nears the card's right edge, his head just under
          the logo, as far as the frame allows with his hands ending where the headline begins. */}
      <Frame
        picture={picture}
        sizes={sizes.hero}
        priority
        quality={85}
        aspect="w-full md:absolute md:inset-y-0 md:left-0 md:w-1/2"
        className="z-10 @container-[size] max-md:bg-transparent max-md:[--h:max(151cqw,min(274cqw_-_27px,429cqh_-_549px))] max-md:[&_img]:h-(--h)! max-md:[&_img]:w-[calc(var(--h)*0.8)]! max-md:[&_img]:max-w-none max-md:[&_img]:object-center! max-md:[&_img]:top-[calc(66px_-_0.237*var(--h))]! max-md:[&_img]:left-[calc(-0.136*var(--h))]! max-md:[&_img]:[mask-image:linear-gradient(to_bottom,#000_47.5%,transparent_53.5%)] md:[&_img]:origin-[34%_26%] md:[&_img]:scale-[1.8] [mask-image:linear-gradient(to_bottom,#000_max(40%,calc(100%-6rem)),transparent_calc(100%-1.5rem))] md:[mask-image:linear-gradient(to_right,#000_72%,transparent)]"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-40 bg-linear-to-b md:block from-ink/45 to-transparent md:right-1/2 md:[mask-image:linear-gradient(to_right,#000_72%,transparent)]" />
      <div className="relative gutter -mt-16 flex flex-col items-start justify-center pb-(--gutter) text-left md:col-start-2 md:mt-0 md:px-(--caption-pad) md:pb-16 md:pt-[calc(4rem+var(--header-h))]">
        {/* The photo's edge colours, stretched and softened, run under its fade and settle into carbon (on
            phones by the headline, so it always sits on carbon). */}
        <div aria-hidden="true" className="absolute inset-x-0 -top-36 bottom-0 -z-10 overflow-hidden md:inset-y-0 md:-left-[28%] md:right-0">
          <div
            className="absolute -inset-10 bg-[length:100%_1000%] bg-bottom bg-no-repeat blur-2xl saturate-150 md:bg-[length:1000%_100%] md:bg-right"
            style={{ backgroundImage: `url(${picture.src.blurDataURL})` }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-ink/0 to-ink to-35% max-md:to-[9rem] md:bg-linear-to-r md:to-60%" />
        </div>
        {/* On phones the words rise over the photo's fade, three gutters in from the card's left edge. */}
        <div className="relative z-20 max-md:-mr-[calc(var(--gutter)/2)] max-md:pl-[calc(var(--gutter)*2)]">
          {/* On phones the headline scales with the card and fills each line before breaking, so it always
              reads "Dress classy without / guessing. With the RISE / framework." */}
          <h1 className="heading-lg md:max-w-[22ch] md:text-balance leading-[1.16] max-md:text-[length:min(calc((100vw-4.25rem)/8.5),4.25rem)]">
            <Highlight text={title} marks={accents.map((accent) => ({ text: accent.text, className: tones[accent.tone] }))} />
          </h1>
        </div>
        {/* On phones the description scales with the card, its longest line filling most of the width, and the
            button takes that line's width (the block shrinks to fit it). */}
        <div className="relative z-20 w-full max-md:ml-[calc(var(--gutter)*2)] max-md:w-fit">
          <p className="copy-lg mt-1 max-w-[40ch] leading-[1.25] md:mt-5 max-md:max-w-none max-md:text-[length:min(calc((100vw-4.25rem)/16),1.5rem)]">
            {body.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && " "}
                <span className="block text-balance">{line}</span>
              </Fragment>
            ))}
          </p>
          <div className="mt-4 w-full md:mt-8 md:max-w-sm">
            <Button href={link.href} variant="bronze">
              {link.label}
            </Button>
          </div>
        </div>
        <ul
          aria-label="What RISE stands for"
          className="glass-dark relative z-20 mt-(--gutter) flex w-full justify-around rounded-2xl md:mt-4 md:max-w-sm px-6 py-4"
        >
          {rise.map((word, index) => (
            <li key={word} className="flex flex-col items-center gap-2.5">
              <span
                aria-hidden="true"
                className={cn(glyph, "heading-md leading-none [text-box:trim-both_cap_alphabetic]")}
                style={{ animationDelay: `${index * step}s` }}
              >
                {word[0]}
              </span>
              <span className="sr-only">{word}</span>
              <span aria-hidden="true" className="text-tiny tracking-normal [text-box:trim-both_cap_alphabetic]">
                {/* The wave leaves the capital and runs through the word before the next capital lights. */}
                {[...word].map((char, at) => (
                  <span
                    key={at}
                    className={glyph}
                    style={{ animationDelay: `${index * step + ((at + 1) / (word.length + 1)) * step}s` }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
