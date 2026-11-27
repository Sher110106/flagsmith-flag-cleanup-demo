/** Search the catalogue by partial name match, best match first. */
export function search(products, query) {
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
