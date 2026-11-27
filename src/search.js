/** Search the catalogue. The legacy path matched whole words only. */
export function search(products, query, flags) {
  if (flags.isFeatureEnabled('legacy_search')) {
    return legacySearch(products, query);
  }
  return fuzzySearch(products, query);
}

function legacySearch(products, query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return products.filter((p) => {
    const nameWords = p.name.toLowerCase().split(/\s+/);
    return words.every((w) => nameWords.includes(w));
  });
}

function fuzzySearch(products, query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products
    .map((p) => ({ p, score: scoreMatch(p.name.toLowerCase(), q) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.p);
}

function scoreMatch(name, q) {
  if (name === q) return 3;
  if (name.startsWith(q)) return 2;
  return name.includes(q) ? 1 : 0;
}
