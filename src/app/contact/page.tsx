import { Frame } from "@/components/ui/Frame";
import { picture, site } from "@/content";
import { contact } from "@/content/pages";
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

        <h2 id="how-it-works" className="heading-sm mt-16 scroll-mt-[calc(var(--header-h)+2rem)]">
          {contact.stepsTitle}
        </h2>
        <ol className="mt-6 border-t border-rule">
          {contact.steps.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 border-b border-rule py-6">
              <span aria-hidden="true" className="display-bold text-[2.75rem] leading-none text-bronze">
                {index + 1}
              </span>
              <div>
                <h3 className="heading-sm">{step.title}</h3>
                <p className="copy mt-1">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <dl className="mt-12 grid gap-8 sm:grid-cols-2">
          {site.contact.email && (
            <div>
              <dt className="text-tiny uppercase text-mute">Email</dt>
              <dd className="mt-2 text-label">
                <a href={`mailto:${site.contact.email}`} className="link-line-in">
                  {site.contact.email}
                </a>
              </dd>
            </div>
          )}
          <div>
            <dt className="text-tiny uppercase text-mute">Based in</dt>
            <dd className="mt-2 text-label">{site.country}</dd>
          </div>
        </dl>
      </div>

      <div className="group lg:sticky lg:top-(--header-h) lg:h-[calc(100svh-var(--header-h))] lg:self-start">
        <Frame picture={picture(contact.image)} sizes={sizes.half} priority aspect="aspect-portrait lg:aspect-auto lg:h-full" />
      </div>
    </div>
  );
}
