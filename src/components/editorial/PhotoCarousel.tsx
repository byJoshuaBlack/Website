"use client";

import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import { Frame } from "@/components/ui/Frame";
import { Icon } from "@/components/ui/Icon";
import type { Picture } from "@/content/types";
import { cn } from "@/lib/cn";

const interval = 3500;
const control =
  "glass-clear absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full text-ink/75 transition-colors duration-300 hover:text-ink [@media(scripting:none)]:hidden";

type Props = {
  pictures: Picture[];
  sizes: string;
  label: string;
  /** Loads the first photo before anything else on the page. */
  priority?: boolean;
  quality?: 80 | 85;
  className?: string;
};

// Photos cross-fade in a loop every 3.5 seconds, with back and forward buttons and a sideways swipe on touch.
// It holds still while hovered, focused from the keyboard or off screen, and never moves on its own for reduced motion.
export function PhotoCarousel({ pictures, sizes, label, priority, quality, className }: Props) {
  const count = pictures.length;
  // Only the photos already seen and the one coming next are mounted, so the rest never load early.
  const [{ index, mounted }, setState] = useState(() => ({ index: 0, mounted: new Set([0, 1 % count]) }));
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [calm, setCalm] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const step = (by: number) =>
    setState((current) => {
      const at = (current.index + by + count) % count;
      return { index: at, mounted: new Set(current.mounted).add(at).add((at + 1) % count) };
    });

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCalm(motion.matches);
    update();
    motion.addEventListener("change", update);

    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    if (root.current) observer.observe(root.current);
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      motion.removeEventListener("change", update);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // A new timer starts with every photo, so stepping by hand gives the chosen one its full turn.
  useEffect(() => {
    if (calm || hovered || focused || !onScreen || hidden) return;
    const timer = window.setTimeout(() => step(1), interval);
    return () => window.clearTimeout(timer);
  });

  const hover = (value: boolean) => (event: PointerEvent) => {
    if (event.pointerType === "mouse") setHovered(value);
  };
  const leaveFocus = (event: FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };
  const startSwipe = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") swipe.current = { x: event.clientX, y: event.clientY };
  };
  const endSwipe = (event: PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(event.clientY - start.y)) step(dx < 0 ? 1 : -1);
  };

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={hover(true)}
      onPointerLeave={hover(false)}
      onPointerDown={startSwipe}
      onPointerUp={endSwipe}
      onPointerCancel={() => (swipe.current = null)}
      onFocus={(event) => setFocused(event.target.matches(":focus-visible"))}
      onBlur={leaveFocus}
      className={cn("relative aspect-portrait touch-pan-y touch-pinch-zoom overflow-hidden bg-tile", className)}
    >
      {pictures.map((picture, at) => (
        <div
          key={at}
          role="group"
          aria-roledescription="slide"
          aria-label={`${at + 1} of ${count}`}
          aria-hidden={at !== index}
          inert={at !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-500 ease-editorial still:transition-none",
            at === index ? "opacity-100" : "opacity-0",
          )}
        >
          {mounted.has(at) && (
            <Frame picture={picture} sizes={sizes} priority={priority && at === 0} quality={quality} aspect="h-full" />
          )}
        </div>
      ))}
      <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className={cn(control, "left-4")}>
        <Icon name="chevron-left" size={18} />
      </button>
      <button type="button" aria-label="Next photo" onClick={() => step(1)} className={cn(control, "right-4")}>
        <Icon name="chevron-right" size={18} />
      </button>
    </div>
  );
}
