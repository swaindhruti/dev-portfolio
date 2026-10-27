import type { Metadata } from "next";
import { CommandBar } from "@/components/command-bar";
import { PageEnter } from "@/components/page-enter";
import { MemoryCarousel } from "@/components/memories/memory-carousel";
import { memories } from "@/data/memories";
import { site } from "@/data/site";
import { formatDate } from "@/lib/format";

const description = `Hackathons, conferences, meetups and milestones — ${memories.length} days ${site.name} thinks are worth keeping.`;

export const metadata: Metadata = {
  title: "Memories",
  description,
  alternates: { canonical: "/memories" },
  openGraph: { url: "/memories", title: `Memories · ${site.name}`, description },
};

export default function MemoriesPage() {
  return (
    <PageEnter>
      <CommandBar aside={`${memories.length} ${memories.length === 1 ? "day" : "days"} worth keeping`}>
        $ ls ~/memories
      </CommandBar>
      <div className="flex min-h-0 flex-auto flex-col overflow-hidden">
        <main
          id="main"
          className="mx-auto box-border flex min-h-0 w-full max-w-[1180px] flex-auto flex-col px-4 pb-2 sm:px-8"
        >
          <h1 className="sr-only">Memories</h1>
          <MemoryCarousel memories={memories} />

          {/* The ring is pointer-driven; this list gives screen readers and crawlers the same content. */}
          <ol className="sr-only">
            {memories.map((m) => (
              <li key={m.id}>
                <article>
                  <h2>{m.title}</h2>
                  <p>
                    <time dateTime={m.date}>{formatDate(m.date)}</time> · {m.type} · {m.place}
                  </p>
                  <p>{m.note}</p>
                </article>
              </li>
            ))}
          </ol>
        </main>
      </div>
    </PageEnter>
  );
}
