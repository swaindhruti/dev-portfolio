import type { CSSProperties } from "react";

/** Stagger slot for a `.rise` / `.fade-in` block: slot n starts n × 70ms after the page appears. */
export function slot(i: number, style?: CSSProperties): CSSProperties {
  return { ...style, ["--i" as string]: i };
}
