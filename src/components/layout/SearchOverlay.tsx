"use client";

import Link from "next/link";
import { useState, type RefObject } from "react";
import { Icon } from "@/components/ui/Icon";
import type { LinkItem, SearchEntry } from "@/content/types";
import { searchEntries } from "@/lib/search";

type Props = {
  ref: RefObject<HTMLDialogElement | null>;
  index: SearchEntry[];
  suggestions: LinkItem[];
};

export function SearchOverlay({ ref, index, suggestions }: Props) {
  const [query, setQuery] = useState("");
  const results = searchEntries(index, query);
  const searching = query.trim().length > 0;
  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      aria-label="Search"
      onClose={() => setQuery("")}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className="fixed inset-0 m-0 h-dvh w-screen bg-transparent p-0 text-ink backdrop:bg-white/70"
    >
      <div className="max-h-dvh animate-sheet-in overflow-y-auto border-b border-rule bg-paper">
        <div className="gutter flex h-(--header-h) items-center gap-4 border-b border-rule">
          <Icon name="search" className="shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Joshua Black"
            aria-label="Search Joshua Black"
            autoFocus
            enterKeyHint="search"
            className="h-full min-w-0 flex-1 appearance-none bg-transparent text-body outline-none placeholder:text-mute [&::-webkit-search-cancel-button]:hidden"
          />
          <button type="button" onClick={close} aria-label="Close search" className="-mr-2 grid h-10 w-10 shrink-0 place-items-center">
            <Icon name="close" />
          </button>
        </div>

        <div className="gutter pb-12 pt-8">
          <p aria-live="polite" className="mb-5 text-tiny uppercase text-mute">
            {searching ? `${results.length} ${results.length === 1 ? "result" : "results"}` : "Suggestions"}
          </p>

          {searching ? (
            results.length > 0 ? (
              <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((entry) => (
                  <li key={entry.href}>
                    <Link href={entry.href} onClick={close} className="group block">
                      <span className="block text-tiny uppercase text-mute">{entry.kind}</span>
                      <span className="link-line-in text-body">{entry.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-body">Nothing matches “{query.trim()}”. Try “pocket square” or “socks”.</p>
            )
          ) : (
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {suggestions.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={close} className="link-line text-body">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </dialog>
  );
}
