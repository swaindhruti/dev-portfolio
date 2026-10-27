/**
 * Wraps a page's content. Navigation swaps pages instantly; the new page then fades in while its
 * blocks rise in sequence (`.rise` + `slot()`). One page on screen at a time, so nothing overlaps.
 */
export function PageEnter({ children }: { children: React.ReactNode }) {
  return <div className="page-enter flex min-h-0 flex-auto flex-col">{children}</div>;
}
