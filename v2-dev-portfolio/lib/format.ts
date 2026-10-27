/** "2026-08-17" → "17.08.2026" */
export function formatDate(iso: string) {
  const [y, mo, da] = iso.split("-");
  return `${da}.${mo}.${y}`;
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "2025-01" → "jan 2025"; "2025" and "present" pass through unchanged. */
export function formatMonth(value: string) {
  const m = /^(\d{4})-(\d{2})$/.exec(value);
  if (!m) return value;
  const name = MONTHS[Number(m[2]) - 1];
  return name ? `${name} ${m[1]}` : value;
}
