import type { Metadata } from "next";
import { BlogList } from "@/components/blogs/blog-list";
import { JsonLd } from "@/components/json-ld";
import { PageEnter } from "@/components/page-enter";
import { posts } from "@/data/blogs";
import { absoluteUrl, site } from "@/data/site";

const description = `Writing by ${site.name} on systems, frontend and engineering careers.`;

export const metadata: Metadata = {
  title: "Blogs",
  description,
  alternates: { canonical: "/blogs" },
  openGraph: { url: "/blogs", title: `Blogs · ${site.name}`, description },
};

export default function BlogsPage() {
  return (
    <PageEnter>
      <BlogList posts={posts} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          url: absoluteUrl("/blogs"),
          name: `${site.name} — blog`,
          description,
          author: { "@id": `${site.url}/#person` },
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.excerpt,
            datePublished: p.date,
            url: absoluteUrl(`/blogs/${p.slug}`),
            keywords: p.tags.join(", "),
          })),
        }}
      />
    </PageEnter>
  );
}
