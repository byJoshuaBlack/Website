"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Logo } from "@/components/brand/Logo";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { LinkItem, NavNode } from "@/content/types";
import { cn } from "@/lib/cn";

type Extra = LinkItem & { icon: IconName };

type Props = {
  ref: RefObject<HTMLDialogElement | null>;
  nav: NavNode[];
  extras: Extra[];
};

export function MenuDrawer({ ref, nav, extras }: Props) {
  const [path, setPath] = useState<number[]>([]);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);

  const columns: { title?: string; items: NavNode[] }[] = [{ items: nav }];
  let level = nav;
  for (const index of path) {
    const node = level[index];
    if (!node?.children) break;
    columns.push({ title: node.label, items: node.children });
    level = node.children;
  }

  useEffect(() => {
    if (path.length === 0) return;
    columnRefs.current[path.length]?.querySelector<HTMLElement>("[data-item]")?.focus();
  }, [path]);

  const close = () => ref.current?.close();

  const back = () => {
    const depth = path.length;
    setPath(path.slice(0, -1));
    requestAnimationFrame(() => {
      columnRefs.current[depth - 1]?.querySelector<HTMLElement>('[aria-expanded="true"], [data-item]')?.focus();
    });
  };

  return (
    <dialog
      ref={ref}
      aria-label="Menu"
      onClose={() => setPath([])}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className="fixed inset-0 m-0 h-dvh w-screen bg-transparent p-0 text-ink backdrop:bg-white/70"
    >
      <div className="flex h-full w-full sm:w-fit">
        {columns.map((column, depth) => {
          const isLast = depth === columns.length - 1;
          const selected = path[depth];
          return (
            <div
              key={depth === 0 ? "root" : `${depth}-${column.title}`}
              ref={(node) => {
                columnRefs.current[depth] = node;
              }}
              className={cn(
                "h-full w-full shrink-0 animate-drawer-in flex-col border-r border-rule bg-paper sm:w-[360px] lg:w-(--drawer-col)",
                isLast ? "flex" : "hidden lg:flex",
              )}
            >
              <div className="flex h-(--header-h) shrink-0 items-center justify-between border-b border-rule px-5 lg:border-b-0">
                {depth === 0 ? (
                  <button type="button" onClick={close} aria-label="Close menu" className="-ml-2 grid h-10 w-10 place-items-center">
                    <Icon name="close" />
                  </button>
                ) : (
                  <button type="button" onClick={back} className="-ml-1 flex h-10 items-center gap-2 text-label lg:hidden">
                    <Icon name="chevron-left" size={16} />
                    Back
                  </button>
                )}
                {depth > 0 && isLast && (
                  <button type="button" onClick={close} aria-label="Close menu" className="-mr-2 grid h-10 w-10 place-items-center lg:hidden">
                    <Icon name="close" />
                  </button>
                )}
              </div>

              <nav aria-label={column.title ?? "Main"} className="flex-1 overflow-y-auto px-5 pb-8">
                {depth === 0 ? (
                  <Link href="/" onClick={close} aria-label="Joshua Black, home" className="mb-8 mt-6 block w-fit">
                    <Logo decorative className="h-12" />
                  </Link>
                ) : (
                  <p className="mb-8 mt-6 flex h-12 items-end text-tiny uppercase text-mute">{column.title}</p>
                )}
                <ul className="space-y-1">
                  {column.items.map((item, index) => {
                    if (item.children) {
                      const expanded = selected === index;
                      return (
                        <li key={item.label}>
                          <button
                            type="button"
                            data-item
                            aria-expanded={expanded}
                            onClick={() => setPath([...path.slice(0, depth), index])}
                            className="flex w-full items-center justify-between gap-4 py-2 text-left"
                          >
                            <span data-active={expanded} className="link-line-in text-body">
                              {item.label}
                            </span>
                            <Icon name="chevron-right" size={16} />
                          </button>
                        </li>
                      );
                    }
                    return (
                      <li key={item.label}>
                        <Link href={item.href ?? "/"} data-item onClick={close} className="flex py-2">
                          <span className="link-line-in text-body">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {depth === 0 && (
                <ul className="shrink-0 space-y-1 border-t border-rule px-5 py-5">
                  {extras.map((extra) => (
                    <li key={extra.label}>
                      <a
                        href={extra.href}
                        onClick={close}
                        {...(extra.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="flex items-center gap-3 py-1.5 text-label"
                      >
                        <Icon name={extra.icon} size={18} />
                        {extra.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </dialog>
  );
}
