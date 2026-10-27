import raw from "@/content/memories.json";
import { assertUnique, byDateDesc } from "@/lib/content";

// Edit content/memories.json to change this data; see content/README.md.

export type Memory = {
  id: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  type: string;
  title: string;
  place: string;
  note: string;
  /** Optional photo: an ImageKit URL (ik.imagekit.io/devdsfolio/…) or a file under /public. 4:3 works best. */
  image?: string;
};

/** Newest first, whatever order the file is in. */
export const memories: Memory[] = assertUnique(
  raw.memories satisfies Memory[],
  "id",
  "content/memories.json",
).sort(byDateDesc);
