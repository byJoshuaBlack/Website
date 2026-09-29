import type { ArticleBlock } from "@/content/types";

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="space-y-7">
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="copy-lg">{block.text}</p>;

    case "heading":
      return <h2 className="heading-md pt-6">{block.text}</h2>;

    case "quote":
      return (
        <figure className="border-l border-ink py-1 pl-6 lg:pl-8">
          <blockquote className="quote text-[clamp(1.5rem,1.2rem+1.2vw,2.125rem)]">
            {block.text}
          </blockquote>
          {block.cite && <figcaption className="mt-3 text-tiny uppercase text-mute">{block.cite}</figcaption>}
        </figure>
      );

    case "list":
      if (block.style === "number") {
        return (
          <ol className="border-t border-rule">
            {block.items.map((item, index) => (
              <li key={index} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-x-4 border-b border-rule py-6">
                <span aria-hidden="true" className="display-bold text-[3.25rem] leading-none text-bronze-ink">
                  {index + 1}
                </span>
                <div>
                  {item.title && <h3 className="heading-sm text-pine">{item.title}</h3>}
                  <p className="copy-lg mt-1">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="space-y-3">
          {block.items.map((item, index) => (
            <li key={index} className="copy-lg flex gap-3">
              <span aria-hidden="true">–</span>
              <span>
                {item.title && <strong className="font-normal italic">{item.title}. </strong>}
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      );

    case "pair":
      return (
        <dl className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
          {block.items.map((item) => (
            <div key={item.term} className="bg-paper p-6 lg:p-8">
              <dt className="display text-[2.5rem] leading-none tracking-[0.02em]">{item.term}</dt>
              <dd className="copy mt-4">{item.text}</dd>
            </div>
          ))}
        </dl>
      );

    case "acronym":
      return (
        <ol className="border-t border-rule">
          {block.letters.map((item) => (
            <li key={item.letter} className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-b border-rule py-7 lg:grid-cols-[5rem_1fr]">
              <span aria-hidden="true" className="display-bold text-[4rem] leading-[0.9] text-bronze-ink lg:text-[5rem]">
                {item.letter}
              </span>
              <div>
                <h3 className="heading-sm text-pine">{item.word}</h3>
                <p className="copy-lg mt-2">{item.text}</p>
                {item.example && <p className="quote mt-3 text-[0.9375rem] text-mute">{item.example}</p>}
              </div>
            </li>
          ))}
        </ol>
      );
  }
}
