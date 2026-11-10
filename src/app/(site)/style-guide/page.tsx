import { HeroBanner } from "@/components/editorial/HeroBanner";
import { Tile } from "@/components/editorial/Tile";
import { TileGrid } from "@/components/editorial/TileGrid";
import { articles, picture } from "@/content";
import { styleGuide } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import { sizes } from "@/lib/sizes";

export const metadata = pageMetadata({
  title: styleGuide.title,
  description: styleGuide.intro,
  path: "/style-guide",
});

export default function StyleGuidePage() {
  return (
    <>
      <HeroBanner opening level="h1" kicker={styleGuide.intro} title={styleGuide.title} picture={picture(styleGuide.hero)} />
      <TileGrid columns={2} className="mt-px">
        {articles.map((article) => (
          <Tile
            key={article.slug}
            kicker={article.kicker}
            title={article.title}
            href={`/style-guide/${article.slug}`}
            picture={picture(article.cover)}
            links={[{ label: "Read the guide", href: `/style-guide/${article.slug}` }]}
            sizes={sizes.half}
          />
        ))}
      </TileGrid>
    </>
  );
}
