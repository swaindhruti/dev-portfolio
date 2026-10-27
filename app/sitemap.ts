import type { MetadataRoute } from "next";
import { localPosts, posts } from "@/data/blogs";
import { absoluteUrl } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPost = posts[0]?.date;
  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" },
    { path: "/career", priority: 0.9, changeFrequency: "monthly" },
    { path: "/work", priority: 0.9, changeFrequency: "monthly" },
    { path: "/blogs", priority: 0.8, changeFrequency: "weekly" },
    { path: "/memories", priority: 0.5, changeFrequency: "monthly" },
  ];

  return [
    ...pages.map((p) => ({
      url: absoluteUrl(p.path),
      changeFrequency: p.changeFrequency,
      priority: p.priority,
      ...(p.path === "/blogs" && latestPost ? { lastModified: latestPost } : {}),
    })),
    // External posts (e.g. on X) aren't pages on this site, so only local ones are listed.
    ...localPosts.map((p) => ({
      url: absoluteUrl(`/blogs/${p.slug}`),
      lastModified: p.date,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
