import { Frame } from "@/components/ui/Frame";
import { TextLink } from "@/components/ui/TextLink";
import type { Picture } from "@/content/types";
import { sizes } from "@/lib/sizes";
import { StripControls } from "./StripControls";

type Props = {
  handle: string;
  profileUrl: string;
  pictures: Picture[];
};

export function InstagramStrip({ handle, profileUrl, pictures }: Props) {
  return (
    <section aria-label={`Instagram, @${handle}`} className="py-16 lg:py-24">
      <div className="gutter mb-8 flex items-end justify-between gap-6">
        <p className="text-body">
          Follow{" "}
          <TextLink href={profileUrl} external>
            @{handle}
          </TextLink>
        </p>
        <StripControls targetId="follow-track" />
      </div>
      <ul
        id="follow-track"
        tabIndex={0}
        aria-label="Photos from Instagram"
        className="no-scrollbar flex snap-x snap-mandatory gap-px overflow-x-auto scroll-px-(--gutter) px-(--gutter)"
      >
        {pictures.map((picture, index) => (
          <li key={index} className="group w-[70vw] shrink-0 snap-start sm:w-[40vw] lg:w-[22vw]">
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" aria-label={`${picture.alt}. View on Instagram`}>
              <Frame picture={{ ...picture, alt: "" }} sizes={sizes.strip} />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
