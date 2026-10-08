import { IntroHero } from "@/components/editorial/IntroHero";
import { SplitBanner } from "@/components/editorial/SplitBanner";
import { picture } from "@/content";
import { home } from "@/content/pages";

export default function Home() {
  return (
    <>
      <IntroHero
        title={home.intro.title}
        accents={home.intro.accents}
        body={home.intro.body}
        link={home.intro.link}
        rise={home.intro.rise}
        picture={picture(home.intro.image)}
      />

      <div className="page-width">
        <SplitBanner
          kicker={home.pocketPower.kicker}
          lines={home.pocketPower.lines}
          highlight={home.pocketPower.highlight}
          accent={home.pocketPower.accent}
          body={home.pocketPower.body}
          picture={home.pocketPower.images.map(picture)}
          cta={home.pocketPower.cta}
          inset
        />
      </div>
    </>
  );
}
