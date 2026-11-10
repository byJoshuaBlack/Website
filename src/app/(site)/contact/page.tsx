import { Button } from "@/components/ui/Button";
import { CopyText } from "@/components/ui/CopyText";
import { Frame } from "@/components/ui/Frame";
import { picture, site } from "@/content";
import { contact } from "@/content/pages";
import { instagramDm } from "@/lib/social";
import { pageMetadata } from "@/lib/seo";
import { sizes } from "@/lib/sizes";

export const metadata = pageMetadata({
  title: contact.title,
  description: contact.intro,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="lg:grid lg:grid-cols-2">
      <div className="gutter pb-16 pt-10 lg:px-16 lg:pb-24 lg:pt-16 xl:px-24">
        <h1 className="heading-lg">{contact.title}</h1>
        <p className="copy-lg mt-5 max-w-lg">{contact.intro}</p>
        <div className="mt-8 max-w-sm space-y-3">
          <Button href={instagramDm} external variant="pine">
            {contact.cta}
          </Button>
          {site.contact.email && (
            <>
              <Button href={`mailto:${site.contact.email}`} variant="outline">
                {contact.emailCta}
              </Button>
              <p className="text-center text-tiny text-mute">
                {contact.emailHint} <CopyText text={site.contact.email} copied={contact.copied} />
              </p>
            </>
          )}
        </div>
      </div>

      <div className="group lg:sticky lg:top-(--header-h) lg:h-[calc(100svh-var(--header-h))] lg:self-start">
        <Frame picture={picture(contact.image)} sizes={sizes.half} priority aspect="aspect-portrait lg:aspect-auto lg:h-full" />
      </div>
    </div>
  );
}
