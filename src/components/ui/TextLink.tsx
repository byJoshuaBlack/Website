import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: ReactNode;
  external?: boolean;
  /** "out": underlined at rest. "in": underline draws on hover. */
  line?: "out" | "in";
  className?: string;
};

export function TextLink({ href, children, external, line = "out", className }: Props) {
  const classes = cn(line === "out" ? "link-line" : "link-line-in", className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
