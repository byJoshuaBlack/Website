// Saves the published content for `next build`, which renders every page from it without opening the
// database. Run with `npm run content:snapshot` (deploys point it at the live database).
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import config from "@payload-config";
import { getPayload } from "payload";
import { buildContent, contentHash } from "../src/content/build";

const payload = await getPayload({ config });
const content = await buildContent(payload);

const problems: string[] = [];
if (!content.products.some((product) => product.kind === "set")) problems.push('no published product of kind "set"');
if (content.home.intro.body.length !== 4) problems.push("the home description must have exactly four lines");
for (const [slug, list] of [
  ["products", content.products],
  ["articles", content.articles],
] as const) {
  const slugs = list.map((item) => item.slug);
  const duplicate = slugs.find((slug, index) => slugs.indexOf(slug) !== index);
  if (duplicate) problems.push(`two ${slug} use the slug "${duplicate}"`);
}
if (problems.length > 0) {
  console.error(`Content snapshot failed:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}

const hash = await contentHash(content);
const file = path.resolve(process.cwd(), ".content/snapshot.json");
await mkdir(path.dirname(file), { recursive: true });
await writeFile(file, JSON.stringify({ hash, content }));
console.log(`Content snapshot ${hash}: ${content.products.length} products, ${content.articles.length} articles.`);
process.exit(0);
