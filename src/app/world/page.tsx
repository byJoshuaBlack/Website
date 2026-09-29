import { HeroBanner } from "@/components/editorial/HeroBanner";
import { SplitBanner } from "@/components/editorial/SplitBanner";
import { Frame } from "@/components/ui/Frame";
import { picture, site } from "@/content";
import { world } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import { sizes } from "@/lib/sizes";

export const metadata = pageMetadata({
  title: "The World of Joshua Black",
  description: `${world.name.together} The name, the founder and the making of Pocket Power.`,
  path: "/world",
});

export default function WorldPage() {
  return (
    <>
      <HeroBanner opening level="h1" kicker={world.hero.kicker} title={world.hero.title} picture={picture(world.hero.image)} />

      <section aria-labelledby="name-title" className="gutter py-16 lg:py-28">
        <h2 id="name-title" className="sr-only">
          The name
        </h2>
        <p className="copy-lg mx-auto max-w-2xl text-center">{world.name.intro}</p>

        <dl className="mx-auto mt-12 grid max-w-5xl gap-px border border-rule bg-rule md:grid-cols-2 lg:mt-16">
          {world.name.parts.map((part) => (
            <div key={part.term} className="bg-paper px-6 py-12 text-center lg:py-20">
              <dt className="display text-[clamp(3.5rem,2rem+6vw,7rem)] leading-none">
                {part.term}
              </dt>
              <dd className="copy mx-auto mt-6 max-w-[30ch]">{part.text}</dd>
            </div>
          ))}
        </dl>

        <p className="quote mx-auto mt-12 max-w-[24ch] text-center text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] lg:mt-16">
          {world.name.together}
        </p>
      </section>

      <section aria-labelledby="founder-title" className="group grid md:grid-cols-2">
        <Frame picture={picture(world.founder.image)} sizes={sizes.half} />
        <div className="flex items-center bg-linen text-ink">
          <div className="w-full max-w-xl p-(--caption-pad) py-16">
            <p className="mb-5 text-tiny uppercase opacity-70">{site.founder.name}</p>
            <h2 id="founder-title" className="heading-lg">
              {world.founder.title}
            </h2>
            <div className="copy-lg mt-6 space-y-4">
              {world.founder.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <figure className="mt-8 border-l border-ink pl-6">
              <blockquote className="quote text-[1.5rem]">{world.founder.quote}</blockquote>
            </figure>
          </div>
        </div>
      </section>

      <section aria-labelledby="timeline-title" className="lg:grid lg:grid-cols-2">
        <div className="gutter py-16 lg:px-16 lg:py-28 xl:px-24">
          <h2 id="timeline-title" className="heading-lg">
            {world.timeline.title}
          </h2>
          <ol className="mt-10 border-t border-rule lg:mt-14">
            {world.timeline.events.map((event) => (
              <li key={event.date} className="grid gap-x-8 gap-y-2 border-b border-rule py-6 sm:grid-cols-[9rem_1fr]">
                <p className="text-tiny uppercase text-bronze-ink sm:pt-1.5">{event.date}</p>
                <p className="copy-lg">{event.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="group lg:sticky lg:top-(--header-h) lg:h-[calc(100svh-var(--header-h))] lg:self-start">
          <Frame picture={picture(world.timeline.image)} sizes={sizes.half} aspect="aspect-portrait lg:aspect-auto lg:h-full" />
        </div>
      </section>

      <SplitBanner
        tone="pine"
        lines={world.closing.lines}
        highlight={world.closing.highlight}
        accent={world.closing.accent}
        picture={picture(world.closing.image)}
        links={world.closing.links}
      />
    </>
  );
}
