import { SplitBanner } from "@/components/editorial/SplitBanner";
import { StoreNotice } from "@/components/product/StoreNotice";
import { Frame } from "@/components/ui/Frame";
import { picture } from "@/content";
import { store, traditional } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import { sizes } from "@/lib/sizes";

export const metadata = pageMetadata({
  title: traditional.title,
  description: traditional.intro,
  path: "/traditional",
});

export default function TraditionalPage() {
  const { welcome, colours, order } = traditional;

  return (
    <>
      <SplitBanner
        level="h1"
        priority
        kicker={welcome.kicker}
        lines={welcome.lines}
        highlight={welcome.highlight}
        accent={welcome.accent}
        body={welcome.body}
        picture={picture(welcome.image)}
        links={welcome.links}
      />

      <section id="colours" aria-labelledby="colours-title" className="scroll-mt-(--header-h) pt-16 lg:pt-28">
        <div className="gutter text-center">
          <h2 id="colours-title" className="heading-lg">
            {colours.title}
          </h2>
          <p className="copy-lg mx-auto mt-4 max-w-[34ch]">{colours.intro}</p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-px lg:mt-14 lg:grid-cols-4">
          {colours.items.map((item) => (
            <li key={item.name}>
              <figure>
                <Frame picture={picture(item.image)} sizes={sizes.quarter} />
                <figcaption className="pb-8 pt-4 text-center text-label uppercase lg:pb-10">{item.name}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section id="order" aria-labelledby="order-title" className="grid scroll-mt-(--header-h) md:grid-cols-2">
        <Frame picture={picture(order.image)} sizes={sizes.half} />
        <div className="flex items-center bg-linen text-ink">
          <div className="w-full max-w-xl p-(--caption-pad) py-16">
            <h2 id="order-title" className="heading-lg">
              {order.title}
            </h2>
            <p className="copy-lg mt-5">{order.text}</p>
            <div className="mt-8 max-w-sm">
              <StoreNotice status={store.status} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
