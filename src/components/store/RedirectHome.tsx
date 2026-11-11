"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const SECONDS = 8;

/** Takes a buyer home a few seconds after their paid order shows, counting from when the tab is seen. */
export function RedirectHome({ text }: { text?: string }) {
  const router = useRouter();
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: number | undefined;
    const start = () => {
      if (timer || document.visibilityState !== "visible") return;
      if (bar.current) bar.current.style.animationPlayState = "running";
      timer = window.setTimeout(() => router.replace("/"), SECONDS * 1000);
    };
    start();
    document.addEventListener("visibilitychange", start);
    return () => {
      document.removeEventListener("visibilitychange", start);
      window.clearTimeout(timer);
    };
  }, [router]);

  return (
    <div role="status" className="mx-auto mt-8 max-w-sm">
      {text && <p className="text-label text-mute">{text}</p>}
      <div aria-hidden="true" className="mt-3 h-px bg-rule still:hidden">
        <div
          ref={bar}
          style={{ animationDuration: `${SECONDS}s` }}
          className="h-px origin-left animate-home-timer bg-pine [animation-play-state:paused]"
        />
      </div>
    </div>
  );
}
