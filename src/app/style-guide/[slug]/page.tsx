import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article/ArticleBody";
import { Tile } from "@/components/editorial/Tile";
import { TileGrid } from "@/components/editorial/TileGrid";
import { ProductCard } from "@/components/product/ProductCard";
import { Frame } from "@/components/ui/Frame";
import { JsonLd } from "@/components/ui/JsonLd";
import { articles, getArticle, getProduct, picture, site } from "@/content";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/seo";
import { sizes } from "@/lib/sizes";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(props: PageProps<"/style-guide/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) return {};
  const path = `/style-guide/${article.slug}`;
  const cover = picture(article.cover);
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: `${article.title} | ${site.name}`,
      description: article.excerpt,
      url: path,
      images: [{ url: cover.src.src, width: cover.src.width, height: cover.src.height, alt: cover.alt }],
    },
  };
}

export default async function ArticlePage(props: PageProps<"/style-guide/[slug]">) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) notFound();

  const cover = picture(article.cover);
  const position = articles.findIndex((item) => item.slug === article.slug);
  const next = [1, 2].map((step) => articles[(position + step) % articles.length]).filter((item) => item !== undefined);
  const related = (article.related ?? []).map(getProduct).filter((item) => item !== undefined);

  return (
    <>
      <article className="lg:grid lg:grid-cols-2">
        <div className="lg:sticky lg:top-(--header-h) lg:h-[calc(100svh-var(--header-h))] lg:self-start">
          <Frame picture={cover} sizes={sizes.half} priority hover={false} aspect="aspect-portrait lg:aspect-auto lg:h-full" />
        </div>

        <div className="gutter pb-16 pt-10 lg:px-16 lg:pb-24 lg:pt-16 xl:px-24">
          <nav aria-label="Breadcrumb">
            <Link href="/style-guide" className="link-line-in text-tiny uppercase text-mute">
              Style Guide
            </Link>
          </nav>
          <header className="mb-10 mt-6 lg:mb-14">
            <h1 className="heading-xl">{article.title}</h1>
            <p className="script mt-1 pl-[8%] text-[clamp(2rem,1.4rem+1.8vw,3rem)] text-pine">{article.kicker}</p>
          </header>
          <div className="max-w-[38rem]">
            <ArticleBody blocks={article.body} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="pt-16 lg:pt-24">
          <h2 id="related-title" className="heading-md gutter mb-8">
            Wear it with
          </h2>
          <ul className="grid grid-cols-2 border-t border-rule lg:grid-cols-4">
            {related.map((product) => (
              <li key={product.slug} className="border-b border-r border-rule">
                <ProductCard
                  product={{
                    slug: product.slug,
                    kind: product.kind,
                    name: product.name,
                    descriptor: product.descriptor,
                    number: product.number,
                    price: product.price ? formatPrice(product.price) : undefined,
                    picture: picture(product.tile),
                  }}
                  sizes={sizes.quarter}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="next-title" className="pt-16 lg:pt-24">
        <h2 id="next-title" className="heading-md gutter mb-8">
          Keep reading
        </h2>
        <TileGrid columns={2}>
          {next.map((item) => (
            <Tile
              key={item.slug}
              kicker={item.kicker}
              title={item.title}
              href={`/style-guide/${item.slug}`}
              picture={picture(item.cover)}
              links={[{ label: "Read the guide", href: `/style-guide/${item.slug}` }]}
              sizes={sizes.half}
            />
          ))}
        </TileGrid>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          image: absoluteUrl(cover.src.src),
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name },
          mainEntityOfPage: absoluteUrl(`/style-guide/${article.slug}`),
        }}
      />
    </>
  );
}
