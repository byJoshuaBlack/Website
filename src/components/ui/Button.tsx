import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  outline: "border-ink bg-transparent text-ink hover:bg-ink hover:text-paper",
  solid: "border-ink bg-ink text-paper hover:bg-paper hover:text-ink",
  pine: "border-pine bg-pine text-paper hover:bg-transparent hover:text-pine",
  bronze: "border-bronze bg-bronze text-ink hover:bg-transparent hover:text-bronze focus-visible:outline-bronze",
};

type Props = {
  href: string;
  children: ReactNode;
  external?: boolean;
  variant?: keyof typeof variants;
  size?: "default" | "compact";
  className?: string;
  onClick?: () => void;
};

export function Button({ href, children, external, variant = "outline", size = "default", className, onClick }: Props) {
  const classes = cn(
    "flex items-center justify-center gap-3 rounded-full border text-label font-bold transition-colors duration-300 ease-editorial",
    size === "compact" ? "h-9 whitespace-nowrap px-3" : "h-12 w-full px-6 text-base max-md:text-lg",
    variants[variant],
    className,
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={classes}>
      {children}
    </Link>
  );
}
