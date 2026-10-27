/** Newest first by ISO `date` (YYYY-MM-DD sorts correctly as a string). */
export const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date);

/**
 * Returns a copy of `items`, failing the build with a readable message if two entries share `key`
 * (duplicate blog slugs or memory ids would otherwise collide silently).
 */
export function assertUnique<T, K extends keyof T>(items: readonly T[], key: K, file: string): T[] {
  const seen = new Set<unknown>();
  for (const item of items) {
    if (seen.has(item[key])) throw new Error(`${file}: duplicate ${String(key)} "${String(item[key])}"`);
    seen.add(item[key]);
  }
  return [...items];
}
