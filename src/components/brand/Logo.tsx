import horizontal from "@/assets/brand/jb-horizontal.png";
import monogram from "@/assets/brand/jb-monogram.png";
import vertical from "@/assets/brand/jb-vertical.png";
import { cn } from "@/lib/cn";

const artwork = { horizontal, vertical, monogram };

type Props = {
  variant?: keyof typeof artwork;
  className?: string;
  decorative?: boolean;
};

// The official artwork is used as a mask, so the logo takes the current text colour.
export function Logo({ variant = "horizontal", className, decorative }: Props) {
  const image = artwork[variant];
  const mask = `url(${image.src}) center / contain no-repeat`;
  return (
    <span
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "Joshua Black" })}
      className={cn("block bg-current", className)}
      style={{ aspectRatio: `${image.width} / ${image.height}`, mask, WebkitMask: mask }}
    />
  );
}
