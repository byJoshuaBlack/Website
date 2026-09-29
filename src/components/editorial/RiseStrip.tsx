import { TextLink } from "@/components/ui/TextLink";
import type { LinkItem } from "@/content/types";

type Props = {
  kicker: string;
  title: string;
  link: LinkItem;
  letters: { letter: string; word: string; text: string }[];
};

export function RiseStrip({ kicker, title, link, letters }: Props) {
  return (
    <section className="bg-pine text-linen">
      <div className="gutter py-16 lg:py-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-tiny uppercase opacity-70">{kicker}</p>
            <h2 className="heading-lg">{title}</h2>
          </div>
          <p className="text-body">
            <TextLink href={link.href}>{link.label}</TextLink>
          </p>
        </div>

        <ol className="mt-12 grid gap-px bg-linen/25 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {letters.map((item) => (
            <li key={item.letter} className="bg-pine py-8 sm:px-8 sm:first:pl-0 lg:py-2">
              <span aria-hidden="true" className="display-bold block text-[5.5rem] leading-none text-bronze lg:text-[7rem]">
                {item.letter}
              </span>
              <h3 className="heading-sm mt-4">{item.word}</h3>
              <p className="copy mt-2 max-w-[30ch] opacity-85">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
