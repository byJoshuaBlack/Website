import Image from "next/image";
import type { Picture } from "@/content/types";
import { cn } from "@/lib/cn";
import { cropLayout } from "@/lib/crop";
import { scaleSizes } from "@/lib/sizes";

type Props = {
  picture: Picture;
  sizes: string;
  /** Load immediately instead of on scroll. */
  eager?: boolean;
  /** Fetch ahead of other images. Reserve for the first image on a page. */
  priority?: boolean;
  /** Must be one of `images.qualities` in next.config.ts. */
  quality?: 80 | 85;
  /** Tailwind aspect class. Pass "" when the parent sets the height. */
  aspect?: string;
  className?: string;
};

export function Frame({ picture, sizes, eager, priority, quality = 80, aspect = "aspect-portrait", className }: Props) {
  const crop = cropLayout(picture.crop, picture.src.height / picture.src.width);
  return (
    <div className={cn("relative overflow-hidden bg-tile", crop.contained && "@container-[size]", aspect, className)}>
      <div className="absolute" style={crop.box}>
        <Image
          src={picture.src}
          alt={picture.alt}
          fill
          sizes={scaleSizes(sizes, crop.zoom)}
          quality={quality}
          placeholder="blur"
          loading={eager || priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          className="object-cover"
          style={crop.image}
        />
      </div>
    </div>
  );
}
