"use client";

import Link from "next/link";
import { useEffect, useId, type RefObject } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { HomeLink } from "@/components/ui/HomeLink";
import { Icon } from "@/components/ui/Icon";
import { SocialIcon } from "@/components/ui/SocialIcon";
import type { LinkItem, SocialLink } from "@/content/types";

type Props = {
  ref: RefObject<HTMLDialogElement | null>;
  links: LinkItem[];
  cta: LinkItem;
  social: SocialLink[];
  onSearch: () => void;
};

// A full-screen carbon overlay with the menu centred both ways, wherever the menu opens.
export function MenuOverlay({ ref, links, cta, social, onSearch }: Props) {
  const titleId = useId();
  const close = () => ref.current?.close();

  // The browser's top bar takes the page's theme colour, so it turns carbon while the menu is open.
  useEffect(() => {
    const dialog = ref.current;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!dialog || !meta) return;
    const page = meta.content;
    const ink = getComputedStyle(document.documentElement).getPropertyValue("--color-ink").trim();
    const observer = new MutationObserver(() => {
      meta.content = dialog.open ? ink : page;
    });
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
    return () => {
      observer.disconnect();
      meta.content = page;
    };
  }, [ref]);

  return (
    <dialog
      ref={ref}
      data-menu
      aria-labelledby={titleId}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-ink p-0 text-paper backdrop:bg-transparent"
    >
      <div className="flex h-full animate-sheet-in flex-col">
        <div className="gutter grid h-(--header-h) shrink-0 grid-cols-[1fr_auto_1fr] items-center">
          <button type="button" onClick={onSearch} aria-haspopup="dialog" className="-ml-1 flex h-10 items-center gap-2 justify-self-start text-label">
            <Icon name="search" size={18} />
            Search
          </button>
          <HomeLink label="Joshua Black, home" onClick={close}>
            <Logo decorative className="h-9 lg:h-11" />
          </HomeLink>
          <button type="button" onClick={close} aria-label="Close menu" className="-mr-2 grid h-10 w-10 place-items-center justify-self-end">
            <Icon name="close" />
          </button>
        </div>

        {/* A tap or click starts focus here. It follows the buttons above, so keys still start on them. */}
        <h2 id={titleId} tabIndex={-1} className="sr-only">
          Menu
        </h2>

        <nav aria-label="Main" className="gutter flex flex-1 flex-col items-center justify-center overflow-y-auto py-10 text-center">
          <ul className="space-y-5 lg:space-y-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={close} className="heading-lg link-line-in">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 w-full max-w-xs lg:mt-12">
            <Button href={cta.href} variant="bronze" onClick={close}>
              {cta.label}
            </Button>
          </div>
        </nav>

        <ul className="flex shrink-0 justify-center gap-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {social.map((profile) => (
            <li key={profile.label}>
              <SocialIcon profile={profile} onClick={close} className="grid h-10 w-10 place-items-center" />
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}
