import { notFound } from "next/navigation";

// With a second root layout for Payload's admin, unmatched addresses land here to get the site's own 404 page.
export default function Missing() {
  notFound();
}
