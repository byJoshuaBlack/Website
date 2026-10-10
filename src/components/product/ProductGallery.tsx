import { PhotoCarousel } from "@/components/editorial/PhotoCarousel";
import { Frame } from "@/components/ui/Frame";
import type { Picture } from "@/content/types";
import { sizes } from "@/lib/sizes";

// Below lg the photos play as a slideshow; from lg they stack beside the details. Both views ask for
// the same first photo, so it downloads once.
export function ProductGallery({ pictures, label }: { pictures: Picture[]; label: string }) {
  return (
    <>
      {pictures.length > 1 ? (
        <PhotoCarousel pictures={pictures} sizes={sizes.productMain} label={label} priority quality={85} className="lg:hidden" />
      ) : (
        <Frame picture={pictures[0]} sizes={sizes.productMain} priority quality={85} className="lg:hidden" />
      )}
      <ul aria-label="Product photos" className="hidden space-y-4 lg:block">
        {pictures.map((picture, index) => (
          <li key={index} id={`photo-${index + 1}`} className="scroll-mt-[calc(var(--header-h)+1rem)]">
            <Frame picture={picture} sizes={sizes.productMain} priority={index === 0} quality={85} />
          </li>
        ))}
      </ul>
    </>
  );
}

export function ProductThumbs({ pictures }: { pictures: Picture[] }) {
  if (pictures.length < 2) return null;
  return (
    <ul aria-label="Jump to photo" className="flex flex-wrap gap-2">
      {pictures.map((picture, index) => (
        <li key={index} className="w-11">
          <a href={`#photo-${index + 1}`} aria-label={`Photo ${index + 1}`} className="block border border-transparent transition-colors hover:border-ink focus-visible:border-ink">
            <Frame picture={{ ...picture, alt: "" }} sizes={sizes.thumb} eager />
          </a>
        </li>
      ))}
    </ul>
  );
}
