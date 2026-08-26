import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#F4F1EA" }} />
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#F4F1EA" }} />
        </div>
        <div style={{ display: "flex", color: "#F4F1EA", fontSize: 64, fontWeight: 700, lineHeight: 1 }}>
          U
        </div>
      </div>
    ),
    { ...size }
  );
}
