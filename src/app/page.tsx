import { Wordmark } from "@/components/brand/Wordmark";
import { HeroBanner } from "@/components/editorial/HeroBanner";
import { InstagramStrip } from "@/components/editorial/InstagramStrip";
import { RiseStrip } from "@/components/editorial/RiseStrip";
import { SplitBanner } from "@/components/editorial/SplitBanner";
import { Tile } from "@/components/editorial/Tile";
import { TileGrid } from "@/components/editorial/TileGrid";
import { TextLink } from "@/components/ui/TextLink";
import { picture, site } from "@/content";
import { home } from "@/content/pages";
import { instagramProfile } from "@/lib/order";
import { sizes } from "@/lib/sizes";

export default function Home() {
  return (
    <>
      <section className="gutter flex justify-center pb-10 pt-6 sm:pb-14 sm:pt-10 lg:pb-20 lg:pt-12">
        <h1 data-giant-wordmark className="w-full text-pine lg:w-[70%]">
          <Wordmark />
        </h1>
      </section>

      <TileGrid columns={4}>
        {home.quartet.map((tile, index) => (
          <Tile
            key={tile.href}
            caption="below"
            title={tile.title}
            href={tile.href}
            picture={picture(tile.image)}
            links={tile.links}
            sizes={sizes.quarter}
            eager={index < 2}
          />
        ))}
      </TileGrid>

      <section className="gutter py-14 text-center lg:py-24">
        <p className="mb-5 text-tiny uppercase text-mute">{site.tagline}</p>
        <h2 className="quote mx-auto max-w-[22ch] text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)]">
          {home.statement.title}
        </h2>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {home.statement.links.map((link) => (
            <li key={link.href} className="text-body">
              <TextLink href={link.href}>{link.label}</TextLink>
            </li>
          ))}
        </ul>
      </section>

      <HeroBanner
        title={home.hero.title}
        picture={picture(home.hero.image)}
        links={home.hero.links}
        href={home.hero.links[0]?.href}
      />

      <div className="mt-px">
        <SplitBanner
          kicker={home.banner.kicker}
          lines={home.banner.lines}
          highlight={home.banner.highlight}
          accent={home.banner.accent}
          body={home.banner.body}
          picture={picture(home.banner.image)}
          links={home.banner.links}
        />
      </div>

      <TileGrid columns={2} className="mt-px">
        {home.duoProduct.map((tile) => (
          <Tile key={tile.title} title={tile.title} href={tile.href} picture={picture(tile.image)} links={tile.links} sizes={sizes.half} />
        ))}
      </TileGrid>

      <div className="mt-px">
        <RiseStrip {...home.rise} />
      </div>

      <TileGrid columns={2} className="mt-px">
        {home.duoGuide.map((tile) => (
          <Tile key={tile.title} title={tile.title} href={tile.href} picture={picture(tile.image)} links={tile.links} sizes={sizes.half} />
        ))}
      </TileGrid>

      <InstagramStrip
        handle={site.contact.instagramHandle}
        profileUrl={instagramProfile}
        pictures={home.follow.map(picture)}
      />
    </>
  );
}
