"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { LinkItem, NavNode, SearchEntry } from "@/content/types";
import { MenuDrawer } from "./MenuDrawer";
import { SearchOverlay } from "./SearchOverlay";

type Props = {
  nav: NavNode[];
  searchIndex: SearchEntry[];
  suggestions: LinkItem[];
  order: LinkItem;
  extras: (LinkItem & { icon: IconName })[];
};

export function SiteNav({ nav, searchIndex, suggestions, order, extras }: Props) {
  const pathname = usePathname();
  const onOrder = pathname === order.href;
  const tab = "flex h-10 flex-1 items-center justify-center gap-2 rounded-full px-4 text-label transition-colors duration-300";
  const tabActive = "bg-ink/85 text-paper";
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = header.current;
    if (!el) return;

    const onScroll = () => {
      el.dataset.scrolled = String(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // On the home page the giant wordmark stands in for the header logo.
    const giant = document.querySelector("[data-giant-wordmark]");
    let observer: IntersectionObserver | undefined;
    if (giant) {
      observer = new IntersectionObserver(
        ([entry]) => {
          el.dataset.logo = entry?.isIntersecting ? "hidden" : "shown";
        },
        { rootMargin: "-72px 0px 0px 0px" },
      );
      observer.observe(giant);
    } else {
      el.dataset.logo = "shown";
    }

    menu.current?.close();
    search.current?.close();

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, [pathname]);

  const openMenu = () => menu.current?.showModal();
  const openSearch = () => search.current?.showModal();

  return (
    <>
      <header
        ref={header}
        data-scrolled="false"
        data-logo={pathname === "/" ? "hidden" : "shown"}
        className="group/header sticky top-0 z-40 h-(--header-h) bg-paper text-ink transition-colors duration-300 ease-editorial over-hero:bg-transparent over-hero:text-paper"
      >
        <div className="gutter relative flex h-full items-center justify-between">
          <div className="hidden items-center gap-7 lg:flex">
            <button type="button" onClick={openMenu} aria-haspopup="dialog" className="flex items-center gap-2 text-body">
              <Icon name="menu" />
              Menu
            </button>
            <button type="button" onClick={openSearch} aria-haspopup="dialog" className="flex items-center gap-2 text-body">
              <Icon name="search" />
              Search
            </button>
          </div>

          <Link
            href="/"
            aria-label="Joshua Black, home"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 group-data-[logo=hidden]/header:pointer-events-none group-data-[logo=hidden]/header:opacity-0"
          >
            <Logo decorative className="h-9 lg:h-11" />
          </Link>

          <Link href={order.href} className="link-line-in ml-auto hidden text-body lg:block">
            {order.label}
          </Link>
        </div>
      </header>

      <div className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <div className="flex h-14 flex-1 items-center rounded-full glass px-2">
            <button
              type="button"
              onClick={openMenu}
              aria-haspopup="dialog"
              className={`${tab} ${onOrder ? "" : tabActive}`}
            >
              <Icon name="menu" size={18} />
              Menu
            </button>
            <Link
              href={order.href}
              aria-current={onOrder ? "page" : undefined}
              className={`${tab} uppercase ${onOrder ? tabActive : ""}`}
            >
              <Icon name="bag" size={18} />
              {order.label}
            </Link>
          </div>
          <button
            type="button"
            onClick={openSearch}
            aria-haspopup="dialog"
            aria-label="Search"
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full glass"
          >
            <Icon name="search" />
          </button>
        </div>
      </div>

      <MenuDrawer ref={menu} nav={nav} extras={extras} />
      <SearchOverlay ref={search} index={searchIndex} suggestions={suggestions} />
    </>
  );
}
