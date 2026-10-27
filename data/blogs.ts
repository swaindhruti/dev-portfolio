import raw from "@/content/blogs.json";
import { assertUnique, byDateDesc } from "@/lib/content";

// Edit content/blogs.json to change this data; see content/README.md.

export type Post = {
  slug: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  /** Minutes */
  read: number;
  title: string;
  /** Categories; a post can have several. They drive the tag filters. */
  tags: string[];
  excerpt: string;
  /** Where the article lives (e.g. an X article). The list links straight out to it. */
  url?: string;
  /** Write the article on this site instead: one string per paragraph, served at /blogs/<slug>. */
  body?: string[];
};

/** A post written on this site, with its own page. */
export type LocalPost = Post & { body: string[] };

const FILE = "content/blogs.json";

const checked: Post[] = assertUnique(raw.posts satisfies Post[], "slug", FILE);
for (const p of checked) {
  if (!p.url && !p.body?.length) throw new Error(`${FILE}: post "${p.slug}" needs a "url" or a "body"`);
}

/** Newest first, whatever order the file is in. */
export const posts: Post[] = checked.sort(byDateDesc);

export const isLocal = (p: Post): p is LocalPost => !p.url && !!p.body?.length;

/** Posts that get a page on this site (no external `url`), newest first. */
export const localPosts: LocalPost[] = posts.filter(isLocal);

export function getPost(slug: string) {
  const i = localPosts.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  return { post: localPosts[i], next: localPosts[i + 1] ?? null };
}
