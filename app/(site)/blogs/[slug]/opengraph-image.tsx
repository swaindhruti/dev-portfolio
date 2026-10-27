import { getPost } from "@/data/blogs";
import { site } from "@/data/site";
import { ogSize, terminalCard } from "@/lib/og";

export const alt = `Blog post by ${site.name}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function PostOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug)?.post;
  return terminalCard({
    command: post ? `$ cat ${post.slug}.md` : "$ cat ./blogs",
    title: post?.title ?? "Blogs",
    subtitle: post ? `${post.excerpt}  ·  ${post.read} min read` : site.description,
  });
}
