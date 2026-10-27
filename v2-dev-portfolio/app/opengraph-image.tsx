import { site } from "@/data/site";
import { ogSize, terminalCard } from "@/lib/og";

export const alt = `${site.name} — ${site.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return terminalCard({
    command: "$ whoami",
    title: `${site.name}`,
    subtitle: `${site.role} — ${site.tagline}`,
  });
}
