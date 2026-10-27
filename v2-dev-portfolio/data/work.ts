import raw from "@/content/work.json";
import { assertUnique } from "@/lib/content";

// Edit content/work.json to change this data; see content/README.md.

export type ProjectLink = {
  /** Shown as "<label> ↗". Use "live" for the running app; anything else reads as code/docs. */
  label: string;
  href: string;
};

export type Project = {
  id: string;
  name: string;
  year: string;
  kind: string;
  summary: string;
  desc: string;
  stack: string[];
  /** In display order; leave the list empty for no links. */
  links: ProjectLink[];
};

/** In file order: the list on /work follows content/work.json top to bottom. */
export const projects: Project[] = assertUnique(raw.projects satisfies Project[], "id", "content/work.json");

/** The running app, if the project has one. */
export const liveLink = (p: Project) => p.links.find((l) => l.label === "live");
