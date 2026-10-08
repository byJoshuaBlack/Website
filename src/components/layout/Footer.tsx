import { Logo } from "@/components/brand/Logo";
import { HomeLink } from "@/components/ui/HomeLink";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { TextLink } from "@/components/ui/TextLink";
import type { LinkItem, SocialLink } from "@/content/types";

type Props = {
  columns: { title: string; links: LinkItem[] }[];
  social: SocialLink[];
  name: string;
  registration: string;
};

export function Footer({ columns, social, name, registration }: Props) {
  return (
    <footer className="mt-24">
      <div className="border-t border-ink">
        {/* The logo and registration number lead, then the link columns and the social icons, never pushed
            right. On phones the icons take their own row underneath. */}
        <div className="page-width gutter grid grid-cols-2 gap-x-10 gap-y-8 pb-5 pt-12 lg:grid-cols-4 lg:py-16">
          <div>
            <HomeLink label={`${name}, home`} className="inline-block">
              <Logo decorative className="h-12" />
            </HomeLink>
            <p className="mt-4 text-label">RC: {registration}</p>
          </div>
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
          <ul aria-label="Social media" className="col-span-2 flex items-center gap-6 lg:col-span-1 lg:items-start">
            {social.map((profile) => (
              <li key={profile.label}>
                <SocialIcon profile={profile} className="grid h-8 w-8 place-items-center transition-opacity [a&]:hover:opacity-60" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-pine pb-[calc(var(--dock-space)+env(safe-area-inset-bottom))] text-linen">
        <p className="page-width gutter py-5 text-tiny">
          Copyright © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
