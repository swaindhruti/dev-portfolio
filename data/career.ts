import raw from "@/content/career.json";
import { assertUnique } from "@/lib/content";

// Edit content/career.json to change this data; see content/README.md.

export type Role = {
  id: string;
  from: string;
  to: string;
  title: string;
  company: string;
  place: string;
  type: string;
  points: string[];
};

const isCurrent = (r: Role) => /present|now/i.test(r.to);

/** Current role(s) first, then by end year, then start year — newest first. */
export const roles: Role[] = assertUnique(raw.roles satisfies Role[], "id", "content/career.json").sort(
  (a, b) => Number(isCurrent(b)) - Number(isCurrent(a)) || b.to.localeCompare(a.to) || b.from.localeCompare(a.from),
);

/** Tech stack list shown beside the timeline, grouped, in file order. */
export const stack: Record<string, string[]> = raw.stack;
