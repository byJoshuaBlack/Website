// After a deploy, refreshes the site if anything was published while it built, since the new
// build's pages come from the snapshot taken before it.
import { readFile } from "node:fs/promises";

const site = process.env.NEXT_PUBLIC_SITE_URL;
const secret = process.env.REVALIDATE_SECRET;
if (!site || !secret) {
  console.warn("After deploy: NEXT_PUBLIC_SITE_URL or REVALIDATE_SECRET is not set, so the site was not checked for newer content.");
  process.exit(0);
}

const { hash } = JSON.parse(await readFile(".content/snapshot.json", "utf8"));
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    const response = await fetch(new URL("/api/revalidate", site), {
      method: "POST",
      headers: { "content-type": "application/json", "x-revalidate-secret": secret },
      body: JSON.stringify({ hash }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(`${response.status} ${JSON.stringify(result)}`);
    console.log(result.refreshed ? "After deploy: content changed during the deploy; pages refreshed." : "After deploy: content unchanged.");
    process.exit(0);
  } catch (error) {
    console.warn(`After deploy: attempt ${attempt} failed: ${error.message}`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}
// The deploy itself succeeded; an admin can refresh the site from the admin if needed.
process.exit(0);
