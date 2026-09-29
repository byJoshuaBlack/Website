import Link from "next/link";

export function AnnouncementBar({ text, href }: { text: string; href: string }) {
  return (
    <div className="flex h-(--strip-h) items-center justify-center bg-ink px-4 text-paper">
      <Link href={href} className="link-line-in truncate text-tiny uppercase">
        {text}
      </Link>
    </div>
  );
}
