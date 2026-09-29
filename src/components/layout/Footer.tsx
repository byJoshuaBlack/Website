import { Wordmark } from "@/components/brand/Wordmark";
import { Icon, type IconName } from "@/components/ui/Icon";
import { TextLink } from "@/components/ui/TextLink";
import type { LinkItem } from "@/content/types";

type Props = {
  columns: { title: string; links: LinkItem[] }[];
  social: (LinkItem & { icon: IconName })[];
  country: string;
  name: string;
};

export function Footer({ columns, social, country, name }: Props) {
  return (
    <footer className="mt-24 lg:mt-36">
      <div className="gutter">
        <Wordmark decorative className="pb-10 md:w-3/4 lg:w-[58%] lg:pb-14" />
      </div>

      <div className="border-t border-ink">
        <div className="gutter grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="heading-sm">{column.title}</h3>
              <ul className="mt-5 space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.href} className="text-label">
                    <TextLink href={link.href} external={link.external} line="in">
                      {link.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="heading-sm">Country</h3>
            <p className="mt-5 text-label">{country}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-ink">
        <ul className="gutter flex items-center gap-6 py-5">
          {social.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="grid h-8 w-8 place-items-center transition-opacity hover:opacity-60"
              >
                <Icon name={item.icon} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-pine pb-[calc(5.5rem+env(safe-area-inset-bottom))] text-linen lg:pb-0">
        <p className="gutter py-5 text-tiny">
          Copyright © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
