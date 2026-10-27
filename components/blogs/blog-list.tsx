"use client";

import Link from "next/link";
import { useState } from "react";
import type { Post } from "@/data/blogs";
import { slot } from "@/lib/motion";
import { CommandBar } from "../command-bar";
import { ScrambleText, useScramble } from "../scramble";

export function BlogList({ posts }: { posts: Post[] }) {
  const [tag, setTag] = useState<string | null>(null);
  const tags = [...new Set(posts.flatMap((p) => p.tags))];
  const shown = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;

  return (
    <>
      <CommandBar className="pb-7" aside={`${shown.length} ${shown.length === 1 ? "post" : "posts"}`}>
        {tag ? `$ ls -t ./blogs | grep "#${tag}"` : "$ ls -t ./blogs"}
      </CommandBar>
      <div className="min-h-0 flex-auto overflow-x-hidden overflow-y-auto">
        <main id="main" className="mx-auto box-border max-w-[1180px] px-4 pb-14 sm:px-8">
          <h1 className="sr-only">Blogs</h1>
          <div role="group" aria-label="Filter by tag" className="rise flex flex-wrap gap-x-[18px] gap-y-1 pb-10" style={slot(1)}>
            {[null, ...tags].map((t) => (
              <button
                key={t ?? "all"}
                type="button"
                aria-pressed={tag === t}
                onClick={() => setTag(t === null || tag === t ? null : t)}
                className="cursor-pointer py-1 whitespace-nowrap hover:text-hi"
                style={{ color: tag === t ? "var(--hi)" : "var(--dim)" }}
              >
                {t === null ? "all" : `#${t}`}
              </button>
            ))}
          </div>
          <ol className="m-0 flex list-none flex-col border-b border-rule p-0">
            {shown.map((p, i) => (
              <PostRow key={p.slug} post={p} index={i} />
            ))}
          </ol>
        </main>
      </div>
    </>
  );
}

function PostRow({ post, index }: { post: Post; index: number }) {
  const [title, play] = useScramble(post.title, { interval: 26, autoplay: true, delay: 120 + index * 120 });
  // Posts with a `url` live elsewhere (e.g. X); the rest have a page here.
  const external = !!post.url;
  const href = post.url ?? `/blogs/${post.slug}`;
  const className =
    "grid grid-cols-[minmax(0,11ch)_minmax(0,1fr)_auto] items-baseline gap-x-7 gap-y-1.5 py-[22px] text-dim hover:text-hi max-[640px]:grid-cols-[minmax(0,1fr)_auto]";
  const content = (
    <>
      <time dateTime={post.date} className="whitespace-nowrap max-[640px]:col-span-2">
        {post.date}
      </time>
      <article className="flex min-w-0 flex-col gap-2">
        <h2 className="m-0 text-[clamp(16px,1.8vw,20px)] leading-[1.35] font-medium text-balance text-fg">
          <ScrambleText label={post.title} text={title} />
        </h2>
        <p className="m-0 text-[13px] leading-[1.6] text-pretty">{post.excerpt}</p>
      </article>
      <span className="whitespace-nowrap">
        {post.read} min {external ? "↗" : "→"}
        {external && <span className="sr-only"> (opens on X)</span>}
      </span>
    </>
  );

  return (
    <li className="rise border-t border-rule" style={slot(index + 2)}>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" onMouseEnter={play} className={className}>
          {content}
        </a>
      ) : (
        <Link href={href} onMouseEnter={play} className={className}>
          {content}
        </Link>
      )}
    </li>
  );
}
