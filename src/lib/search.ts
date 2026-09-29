import type { SearchEntry } from "@/content/types";

export function searchEntries(index: SearchEntry[], query: string): SearchEntry[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  return index
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const haystack = `${title} ${entry.text.toLowerCase()}`;
      if (!tokens.every((token) => haystack.includes(token))) return null;
      const titleHits = tokens.filter((token) => title.includes(token)).length;
      return { entry, score: titleHits };
    })
    .filter((hit) => hit !== null)
    .sort((a, b) => b.score - a.score)
    .map((hit) => hit.entry);
}
