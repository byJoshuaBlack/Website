"use client";

import { Icon } from "@/components/ui/Icon";

export function StripControls({ targetId }: { targetId: string }) {
  const scroll = (direction: 1 | -1) => {
    const track = document.getElementById(targetId);
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="flex gap-2">
      <button type="button" onClick={() => scroll(-1)} aria-label="Previous photos" className="grid h-10 w-10 place-items-center border border-rule transition-colors hover:border-ink">
        <Icon name="chevron-left" size={18} />
      </button>
      <button type="button" onClick={() => scroll(1)} aria-label="Next photos" className="grid h-10 w-10 place-items-center border border-rule transition-colors hover:border-ink">
        <Icon name="chevron-right" size={18} />
      </button>
    </div>
  );
}
