import type { ReactNode } from "react";

const glyphs = {
  menu: <path d="M3 7h18M3 12h18M3 17h18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8.5h14l-.9 11.5H5.9L5 8.5Z" />
      <path d="M8.8 8.5V7a3.2 3.2 0 0 1 6.4 0v1.5" />
    </>
  ),
  close: <path d="m5.5 5.5 13 13m0-13-13 13" />,
  "chevron-right": <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />,
  "chevron-left": <path d="M14.5 5.5 8 12l6.5 6.5" />,
  "chevron-down": <path d="m5.5 9.5 6.5 6.5 6.5-6.5" />,
  "arrow-up-right": <path d="M7.5 16.5 16.5 7.5M9 7.5h7.5V15" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.9" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z" />
      <path d="M9.2 8.3c-.3 1 .2 2.7 1.7 4.2s3.2 2.1 4.3 1.8l.7-1.5-1.9-1.1-.9.8c-.8-.4-1.5-1.1-1.9-1.9l.8-.9-1.1-1.9-1.7.5Z" />
    </>
  ),
  "grid-2": (
    <>
      <rect x="4" y="4" width="7" height="16" />
      <rect x="13" y="4" width="7" height="16" />
    </>
  ),
  "grid-3": (
    <>
      <rect x="3.5" y="4" width="4.7" height="16" />
      <rect x="9.65" y="4" width="4.7" height="16" />
      <rect x="15.8" y="4" width="4.7" height="16" />
    </>
  ),
  "grid-4": (
    <>
      <rect x="4" y="4" width="7" height="7" />
      <rect x="13" y="4" width="7" height="7" />
      <rect x="4" y="13" width="7" height="7" />
      <rect x="13" y="13" width="7" height="7" />
    </>
  ),
  share: (
    <>
      <path d="M12 15V4m0 0L8 8m4-4 4 4" />
      <path d="M5.5 12v7.5h13V12" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof glyphs;

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {glyphs[name]}
    </svg>
  );
}
