import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <div style={{ display: "flex", gap: 3 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#F4F1EA" }} />
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#F4F1EA" }} />
        </div>
        <div style={{ display: "flex", color: "#F4F1EA", fontSize: 14, fontWeight: 700, lineHeight: 1 }}>
          U
        </div>
      </div>
    ),
    { ...size }
  );
}
