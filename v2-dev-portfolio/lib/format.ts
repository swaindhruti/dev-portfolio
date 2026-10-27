/** "2026-08-17" → "17.08.2026" */
export function formatDate(iso: string) {
  const [y, mo, da] = iso.split("-");
  return `${da}.${mo}.${y}`;
}
