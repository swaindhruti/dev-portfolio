import type { Metadata } from "next";
import { CommandBar } from "@/components/command-bar";
import { JsonLd } from "@/components/json-ld";
import { PageEnter } from "@/components/page-enter";
import { WorkBrowser } from "@/components/work/work-browser";
import { absoluteUrl, site } from "@/data/site";
import { projects } from "@/data/work";

const description = `Selected projects by ${site.name}: ${projects.map((p) => `${p.name} — ${p.summary}`).join(" ")}`;

export const metadata: Metadata = {
  title: "Work",
  description,
  alternates: { canonical: "/work" },
  openGraph: { url: "/work", title: `Work · ${site.name}`, description },
};

export default function WorkPage() {
  return (
    <PageEnter>
      <CommandBar aside={`${projects.length} ${projects.length === 1 ? "project" : "projects"}`}>$ ls ./work</CommandBar>
      <div className="min-h-0 flex-auto overflow-x-hidden overflow-y-auto">
        <main id="main" className="mx-auto box-border max-w-[1180px] px-4 pt-11 pb-14 sm:px-8">
          <h1 className="sr-only">Work</h1>
          <WorkBrowser projects={projects} />
        </main>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          url: absoluteUrl("/work"),
          name: `Work · ${site.name}`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: projects.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "SoftwareSourceCode",
                name: p.name,
                description: p.desc,
                dateCreated: p.year,
                keywords: p.stack.join(", "),
                author: { "@id": `${site.url}/#person` },
                ...(p.live.startsWith("http") ? { url: p.live } : {}),
                ...(p.source.startsWith("http") ? { codeRepository: p.source } : {}),
              },
            })),
          },
        }}
      />
    </PageEnter>
  );
}
