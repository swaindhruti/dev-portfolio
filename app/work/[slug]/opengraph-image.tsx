import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getProjectNav } from "@/data/projects";

export const runtime = "nodejs";
export const alt = "Dhrutinandan Swain — Project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const nav = getProjectNav(slug);
  const project = nav?.project;

  const [manuka, faktum] = await Promise.all([
    readFile(join(process.cwd(), "app/fonts/Manuka-TextBlack.otf")),
    readFile(join(process.cwd(), "app/fonts/Faktum-Regular.otf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              "linear-gradient(#F4F1EA 1px, transparent 1px), linear-gradient(90deg, #F4F1EA 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          style={{
            display: "flex",
            fontFamily: "Faktum",
            color: "#F4F1EA",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          Dhrutinandan Swain / Work
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Manuka",
            color: "#F4F1EA",
            fontSize: 96,
            lineHeight: 0.95,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          <span style={{ display: "flex" }}>{project?.title ?? "Project"}</span>
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Faktum",
            color: "#F4F1EA",
            fontSize: 26,
            opacity: 0.8,
            maxWidth: 900,
          }}
        >
          {project?.tagline ?? ""}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Manuka", data: manuka, weight: 900, style: "normal" },
        { name: "Faktum", data: faktum, weight: 400, style: "normal" },
      ],
    }
  );
}
