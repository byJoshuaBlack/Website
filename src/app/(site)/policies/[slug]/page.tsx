import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article/ArticleBody";
import { getContent } from "@/content";
import { pageMetadata } from "@/lib/seo";

// Policies published after a deploy are rendered on their first visit.
export const dynamicParams = true;

export async function generateStaticParams() {
  const { policies } = await getContent();
  return policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata(props: PageProps<"/policies/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { policies, site } = await getContent();
  const policy = policies.find((item) => item.slug === slug);
  if (!policy) return {};
  return pageMetadata({ title: policy.title, description: policy.summary, path: `/policies/${policy.slug}`, siteName: site.name });
}

export default async function PolicyPage(props: PageProps<"/policies/[slug]">) {
  const { slug } = await props.params;
  const { policies } = await getContent();
  const policy = policies.find((item) => item.slug === slug);
  if (!policy) notFound();

  return (
    <article className="gutter mx-auto max-w-[44rem] py-16 lg:py-24">
      <h1 className="heading-xl">{policy.title}</h1>
      <div className="mt-10">
        <ArticleBody blocks={policy.body} />
      </div>
    </article>
  );
}
