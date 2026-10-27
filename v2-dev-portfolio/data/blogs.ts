export type Post = {
  slug: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  /** Minutes */
  read: number;
  title: string;
  tags: string[];
  excerpt: string;
  body: string[];
};

/** Newest first. */
export const posts: Post[] = [
  {
    slug: "kafka-at-2am",
    date: "2026-10-12",
    read: 6,
    title: "What Kafka taught me at 2am",
    tags: ["systems"],
    excerpt: "Consumer lag, a pager, and the three settings I now check first.",
    body: [
      "The pager went off at 2:07. Consumer lag on the billing topic had climbed past two million messages and was still rising.",
      "The fix turned out to be one line in a config file. Finding that line took four hours, and taught me more about Kafka than the docs ever did.",
      "These are the three settings I now check before anything else — and why their defaults are rarely what you want.",
    ],
  },
  {
    slug: "ascii-hands",
    date: "2026-09-03",
    read: 4,
    title: "Drawing hands with 9 characters",
    tags: ["frontend", "nerdy"],
    excerpt: "How the intro on this site turns a photo of hands into a canvas of text.",
    body: [
      "The intro on this site is two hands, a handshake, and a name — all drawn with nine characters.",
      "Under the hood it's a density map: every cell of the grid samples a source image and picks a glyph by how much ink it needs.",
      "The hard part wasn't the drawing. It was making fingers move without the whole thing turning into soup.",
    ],
  },
  {
    slug: "boring-apis",
    date: "2026-07-21",
    read: 5,
    title: "In defence of boring APIs",
    tags: ["systems", "career"],
    excerpt: "The best API I've shipped is the one nobody has asked a question about.",
    body: [
      "The best API I've shipped is the one nobody has ever messaged me about.",
      "Boring means predictable names, consistent errors, and pagination that works the same way everywhere.",
      "None of it is clever. All of it saves someone an afternoon.",
    ],
  },
  {
    slug: "first-year",
    date: "2026-05-02",
    read: 3,
    title: "Notes from my first year as an engineer",
    tags: ["career"],
    excerpt: "Ask early, write things down, and read other people's code.",
    body: [
      "A year in, the lessons that stuck are smaller than I expected.",
      "Ask early. Write things down. Read other people's code, especially the parts nobody wants to touch.",
      "And ship the small version first — it's almost always enough.",
    ],
  },
];

export function getPost(slug: string) {
  const i = posts.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  return { post: posts[i], next: posts[i + 1] ?? null };
}
