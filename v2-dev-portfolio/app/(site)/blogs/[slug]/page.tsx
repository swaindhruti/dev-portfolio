import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommandBar } from "@/components/command-bar";
import { JsonLd } from "@/components/json-ld";
import { PageEnter } from "@/components/page-enter";
import { Scramble } from "@/components/scramble";
import { getPost, posts } from "@/data/blogs";
import { absoluteUrl, site } from "@/data/site";
import { slot } from "@/lib/motion";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = getPost(slug);
  if (!found) return {};
  const { post } = found;
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blogs/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [site.url],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function PostPage({ params }: PageProps<"/blogs/[slug]">) {
  const { slug } = await params;
  const found = getPost(slug);
  if (!found) notFound();
  const { post, next } = found;
  const url = absoluteUrl(`/blogs/${post.slug}`);

  return (
    <PageEnter>
      <CommandBar className="pb-7" aside={`$ cat ${post.slug}.md`}>
        <Link href="/blogs" className="whitespace-nowrap hover:text-hi">
          ← cd ..
        </Link>
      </CommandBar>
      <div className="min-h-0 flex-auto overflow-x-hidden overflow-y-auto">
        <main id="main" className="mx-auto box-border max-w-[1180px] px-4 pb-14 sm:px-8">
          <article className="flex max-w-[64ch] flex-col gap-7 pt-2">
            <header className="rise flex flex-col gap-7" style={slot(1)}>
              <h1 className="mt-6 mb-0 text-[clamp(26px,3.4vw,40px)] leading-[1.2] font-medium tracking-[-0.01em] text-balance">
                <Scramble label={post.title} interval={26} autoplay delay={120} />
              </h1>
              <div className="flex flex-wrap gap-x-[18px] gap-y-1.5 leading-5 text-dim">
                <time dateTime={post.date}>{post.date}</time>
                <span>{post.read} min read</span>
                <span>{post.tags.map((t) => `#${t}`).join(" ")}</span>
              </div>
            </header>
            <div className="flex flex-col gap-5 pt-4 text-[15px] leading-[1.85]">
              {post.body.map((para, i) => (
                <p key={i} className="rise m-0 text-pretty" style={slot(i + 2)}>
                  {para}
                </p>
              ))}
            </div>
            <footer
              className="fade-in flex flex-wrap justify-between gap-4 pt-12 leading-5 text-dim"
              style={slot(post.body.length + 2)}
            >
              <span>EOF</span>
              {next && (
                <Link href={`/blogs/${next.slug}`} rel="next" className="whitespace-nowrap hover:text-hi">
                  next: {next.title} →
                </Link>
              )}
            </footer>
          </article>
        </main>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `${url}#post`,
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              dateModified: post.date,
              url,
              mainEntityOfPage: url,
              keywords: post.tags.join(", "),
              timeRequired: `PT${post.read}M`,
              wordCount: post.body.join(" ").split(/\s+/).length,
              inLanguage: "en",
              author: { "@type": "Person", "@id": `${site.url}/#person`, name: site.name, url: site.url },
              publisher: { "@id": `${site.url}/#person` },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: site.url },
                { "@type": "ListItem", position: 2, name: "Blogs", item: absoluteUrl("/blogs") },
                { "@type": "ListItem", position: 3, name: post.title, item: url },
              ],
            },
          ],
        }}
      />
    </PageEnter>
  );
}
