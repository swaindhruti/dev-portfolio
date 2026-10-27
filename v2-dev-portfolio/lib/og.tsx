import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const ogSize = { width: 1200, height: 630 };

/** Shared terminal-style social card. */
export function terminalCard({ command, title, subtitle }: { command: string; title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000",
          color: "#ecebe6",
          padding: "64px 72px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#8b8a85" }}>
          <span style={{ color: "#ecebe6" }}>{site.domain}</span>
          <span>{command}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.01em" }}>{title}</div>
          <div style={{ fontSize: 30, lineHeight: 1.4, color: "#8b8a85", maxWidth: 980 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#8b8a85" }}>
          <span>$</span>
          <span style={{ width: 14, height: 28, background: "#ecebe6" }} />
        </div>
      </div>
    ),
    ogSize,
  );
}
