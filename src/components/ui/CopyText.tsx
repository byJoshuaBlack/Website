"use client";

import { useEffect, useState } from "react";

// Copies its text when tapped and briefly says so in its place.
export function CopyText({ text, copied }: { text: string; copied: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => setDone(false), 2000);
    return () => window.clearTimeout(timer);
  }, [done]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
    } catch {
      window.location.href = `mailto:${text}`;
    }
  };

  return (
    <button type="button" onClick={copy} className="link-line text-ink" aria-live="polite">
      {done ? copied : text}
    </button>
  );
}
