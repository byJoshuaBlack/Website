"use client";

import { useEffect, useRef } from "react";

// A soft shade over a tile's photo on hover, with a label that follows the mouse. It listens on the
// tile itself (the nearest article), since the tile's link covers the photo.
export function HoverHint({ label }: { label: string }) {
  const layer = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = layer.current;
    const host = el?.closest("article");
    if (!el || !host) return;
    const follow = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !tag.current) return;
      const box = el.getBoundingClientRect();
      tag.current.style.transform = `translate(${event.clientX - box.left}px, ${event.clientY - box.top}px)`;
    };
    host.addEventListener("pointerenter", follow);
    host.addEventListener("pointermove", follow);
    return () => {
      host.removeEventListener("pointerenter", follow);
      host.removeEventListener("pointermove", follow);
    };
  }, []);

  return (
    <div
      ref={layer}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-ink/35 opacity-0 backdrop-grayscale-50 transition-opacity duration-300 ease-editorial group-hover:opacity-100"
    >
      <span ref={tag} className="absolute left-0 top-0 block">
        <span className="block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-body uppercase tracking-[0.14em] text-paper">
          {label}
        </span>
      </span>
    </div>
  );
}
