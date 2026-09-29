import { Logo } from "@/components/brand/Logo";
import { TextLink } from "@/components/ui/TextLink";

export default function NotFound() {
  return (
    <section className="gutter flex min-h-[60svh] flex-col items-center justify-center py-24 text-center">
      <Logo variant="monogram" decorative className="mb-8 h-20 text-pine" />
      <p className="text-tiny uppercase text-mute">Page not found</p>
      <h1 className="display mt-4 text-[clamp(4rem,2rem+10vw,9rem)]">
        404
      </h1>
      <p className="copy-lg mt-6 max-w-md">
        This page has moved or never existed. The collection is still where you left it.
      </p>
      <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-body">
        <li>
          <TextLink href="/">Home</TextLink>
        </li>
        <li>
          <TextLink href="/collection">Pocket Power</TextLink>
        </li>
        <li>
          <TextLink href="/style-guide">Style Guide</TextLink>
        </li>
      </ul>
    </section>
  );
}
