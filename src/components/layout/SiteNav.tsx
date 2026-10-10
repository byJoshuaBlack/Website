"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type MouseEvent } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { HomeLink } from "@/components/ui/HomeLink";
import { Icon } from "@/components/ui/Icon";
import type { LinkItem, SearchEntry } from "@/content/types";
import { cn } from "@/lib/cn";
import { MenuOverlay } from "./MenuOverlay";
import { SearchOverlay } from "./SearchOverlay";

const tab = "flex h-10 flex-1 items-center justify-center gap-2 rounded-full px-4 text-label transition-colors duration-300";
const tabActive = "bg-ink text-paper";

type Overlay = "menu" | "search";

type Props = {
  menuLinks: LinkItem[];
  searchIndex: SearchEntry[];
  suggestions: LinkItem[];
  shop: LinkItem;
};

export function SiteNav({ menuLinks, searchIndex, suggestions, shop }: Props) {
  const pathname = usePathname();
  const onShop = pathname === shop.href;
  const header = useRef<HTMLElement>(null);
  const dock = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLDialogElement>(null);
  // The overlay standing on its own history entry, so Back closes it instead of leaving the page.
  const entry = useRef<Overlay | null>(null);
  const afterBack = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = header.current;
    if (!el) return;

    // The header turns linen, and over a full-screen hero the dock slides in, as soon as the page moves
    // and the next section starts to show. The few pixels absorb jitter at the top.
    const onScroll = () => {
      const moved = window.scrollY > 4;
      el.dataset.scrolled = String(moved);
      dock.current?.toggleAttribute("data-past-hero", moved);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    menu.current?.close();
    search.current?.close();

    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    const onPop = () => {
      entry.current = null;
      menu.current?.close();
      search.current?.close();
      const then = afterBack.current;
      afterBack.current = null;
      // The browser puts the page's scroll back just after popstate, so this runs a task later.
      if (then) window.setTimeout(then);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Spreading the state keeps the router's own markers on the new entry.
  const show = (name: Overlay) => {
    (name === "menu" ? menu : search).current?.showModal();
    if (!entry.current) window.history.pushState({ ...window.history.state }, "");
    entry.current = name;
  };

  // Closed by hand (×, Escape, backdrop): step back off the overlay's entry. Safe to call twice.
  const closed = (name: Overlay) => () => {
    if (entry.current !== name) return;
    entry.current = null;
    window.history.back();
  };

  // Links out replace the overlay's entry; one to the page already open just closes the overlay.
  const leave = (event: MouseEvent, href: string) => {
    if (href === pathname) event.preventDefault();
    else entry.current = null;
    if (entry.current) closed(entry.current)();
    menu.current?.close();
    search.current?.close();
  };

  const homeFromMenu = () => {
    if (pathname === "/" && entry.current) {
      entry.current = null;
      afterBack.current = () => window.scrollTo({ top: 0 });
      window.history.back();
      return;
    }
    entry.current = null;
    menu.current?.close();
  };

  // A tap or click starts on the menu's hidden title, so no focus ring lands on a button. Keys keep the default.
  const openMenu = (event: MouseEvent) => {
    show("menu");
    if (event.detail > 0) menu.current?.querySelector<HTMLElement>("h2")?.focus();
  };
  const openSearch = () => show("search");
  // The search takes over the menu's history entry, so one Back still closes it.
  const searchFromMenu = () => {
    menu.current?.close();
    show("search");
  };

  return (
    <>
      <header
        ref={header}
        data-scrolled="false"
        className="sticky top-0 z-40 h-(--header-h) bg-paper text-ink transition-colors duration-300 ease-editorial over-hero:bg-transparent over-hero:text-paper"
      >
        {/* Over the floating hero card the contents clear its top edge; on desktop they sit an even
            1.5rem in from its top and sides (the card itself is inset 1rem). */}
        <div className="page-width gutter grid h-full grid-cols-[1fr_auto_1fr] items-center gap-3 transition-[translate,padding] duration-300 ease-editorial over-photo:translate-y-5 lg:over-photo:translate-y-0 lg:over-photo:items-start lg:over-photo:px-10 lg:over-photo:pt-10">
          {/* From xl the menu's links sit in the header itself; narrower screens open them as an overlay. */}
          <div className="hidden items-center gap-7 lg:flex lg:h-9">
            <button type="button" onClick={openMenu} aria-haspopup="dialog" className="flex items-center gap-2 text-body xl:hidden">
              <Icon name="menu" />
              Menu
            </button>
            <nav aria-label="Main" className="hidden xl:block">
              <ul className="flex items-center gap-7">
                {menuLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={pathname === link.href ? "page" : undefined}
                      className="link-line-in whitespace-nowrap text-body"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* On phones over the home hero it turns carbon against the bright photo and moves left, in line
              with the button and RISE panel (the card's 6px inset plus one gutter). */}
          <HomeLink
            label="Joshua Black, home"
            className="col-start-2 max-md:on-home:col-start-1 max-md:on-home:ml-1.5 max-md:on-home:justify-self-start max-md:on-home:text-ink"
          >
            <Logo decorative className="h-9 lg:h-11" />
          </HomeLink>

          <div className="col-start-3 hidden items-center justify-end gap-7 lg:flex lg:h-9">
            <button type="button" onClick={openSearch} aria-haspopup="dialog" className="flex items-center gap-2 text-body">
              <Icon name="search" />
              Search
            </button>
            <Button
              href={shop.href}
              variant="solid"
              size="compact"
              className="over-photo:border-paper over-photo:bg-paper over-photo:text-ink over-photo:hover:bg-transparent over-photo:hover:text-paper"
            >
              {shop.label}
            </Button>
          </div>
        </div>
      </header>

      {/* Below lg, navigation lives in a floating dock at the bottom of the screen. */}
      <nav
        ref={dock}
        aria-label="Quick links"
        className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 flex gap-2 text-ink transition-[translate,opacity,visibility] duration-500 ease-editorial still:transition-none hero-in-view:invisible hero-in-view:translate-y-[calc(100%+2rem)] hero-in-view:opacity-0 lg:hidden"
      >
        <div className="glass flex h-14 flex-1 items-center rounded-full px-2">
          <button type="button" onClick={openMenu} aria-haspopup="dialog" className={cn(tab, !onShop && tabActive)}>
            <Icon name="menu" size={18} />
            Menu
          </button>
          <Link href={shop.href} aria-current={onShop ? "page" : undefined} className={cn(tab, onShop && tabActive)}>
            <Icon name="bag" size={18} />
            {shop.label}
          </Link>
        </div>
        <button
          type="button"
          onClick={openSearch}
          aria-haspopup="dialog"
          aria-label="Search"
          className="glass grid size-14 shrink-0 place-items-center rounded-full"
        >
          <Icon name="search" />
        </button>
      </nav>

      <MenuOverlay
        ref={menu}
        links={menuLinks}
        cta={shop}
        onSearch={searchFromMenu}
        onLeave={leave}
        onHome={homeFromMenu}
        onClose={closed("menu")}
      />
      <SearchOverlay ref={search} index={searchIndex} suggestions={suggestions} onLeave={leave} onClose={closed("search")} />
    </>
  );
}
