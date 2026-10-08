"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

// Always lands at the very top of the home page: it scrolls up when home is already open, and
// otherwise opens home at its top rather than where the router would leave it.
export function HomeLink({ label, children, className, onClick }: Props) {
  const pathname = usePathname();
  const arriving = useRef(false);

  useEffect(() => {
    if (arriving.current && pathname === "/") {
      arriving.current = false;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  const go = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0 });
    } else {
      arriving.current = true;
    }
  };

  return (
    <Link href="/" scroll={false} aria-label={label} onClick={go} className={className}>
      {children}
    </Link>
  );
}
