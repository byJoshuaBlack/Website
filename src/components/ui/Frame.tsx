import Image from "next/image";
import type { Picture } from "@/content/types";
import { cn } from "@/lib/cn";
import { cropStyle } from "@/lib/crop";

type Props = {
  picture: Picture;
  sizes: string;
  /** Load immediately instead of on scroll. */
  eager?: boolean;
  /** Fetch ahead of other images. Reserve for the first image on a page. */
  priority?: boolean;
  /** Tailwind aspect class. Pass "" when the parent sets the height. */
  aspect?: string;
  hover?: boolean;
  className?: string;
};

export function Frame({ picture, sizes, eager, priority, aspect = "aspect-portrait", hover = true, className }: Props) {
  return (
    <div className={cn("relative overflow-hidden bg-tile", aspect, className)}>
      <div
        className={cn(
          "absolute inset-0",
          hover && "transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.025]",
        )}
      >
        <Image
          src={picture.src}
          alt={picture.alt}
          fill
          sizes={sizes}
          placeholder="blur"
          loading={eager || priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          className="object-cover"
          style={cropStyle(picture.crop)}
        />
      </div>
    </div>
  );
}
