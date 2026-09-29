import { Frame } from "@/components/ui/Frame";
import type { Picture } from "@/content/types";
import { sizes } from "@/lib/sizes";

export function ProductGallery({ pictures }: { pictures: Picture[] }) {
  return (
    <ul
      aria-label="Product photos"
      className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto lg:block lg:snap-none lg:space-y-4 lg:overflow-visible"
    >
      {pictures.map((picture, index) => (
        <li
          key={index}
          id={`photo-${index + 1}`}
          className="w-full shrink-0 snap-center scroll-mt-[calc(var(--header-h)+1rem)] lg:w-auto"
        >
          <Frame picture={picture} sizes={sizes.productMain} priority={index === 0} hover={false} />
        </li>
      ))}
    </ul>
  );
}

export function ProductThumbs({ pictures }: { pictures: Picture[] }) {
  if (pictures.length < 2) return null;
  return (
    <ul aria-label="Jump to photo" className="flex flex-wrap gap-2">
      {pictures.map((picture, index) => (
        <li key={index} className="w-11">
          <a href={`#photo-${index + 1}`} aria-label={`Photo ${index + 1}`} className="block border border-transparent transition-colors hover:border-ink focus-visible:border-ink">
            <Frame picture={{ ...picture, alt: "" }} sizes={sizes.thumb} eager hover={false} />
          </a>
        </li>
      ))}
    </ul>
  );
}
