import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
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
  /** Takes the current history entry's place instead of adding one. */
  replace?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

/** The pill's classes, for a `<button>` that must look like the links below. */
export function buttonClasses(variant: keyof typeof variants = "outline", size: Props["size"] = "default", className?: string) {
  return cn(
    "flex items-center justify-center gap-3 rounded-full border text-label font-bold transition-colors duration-300 ease-editorial",
    size === "compact" ? "h-9 whitespace-nowrap px-3" : "h-12 w-full px-6 text-base max-md:text-lg",
    variants[variant],
    className,
  );
}

export function Button({ href, children, external, variant = "outline", size = "default", className, replace, onClick }: Props) {
  const classes = buttonClasses(variant, size, className);
  if (external || href.startsWith("mailto:")) {
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} onClick={onClick} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} replace={replace} onClick={onClick} className={classes}>
      {children}
    </Link>
  );
}
