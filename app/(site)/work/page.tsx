import type { Metadata } from "next";
import { CommandBar } from "@/components/command-bar";
import { JsonLd } from "@/components/json-ld";
import { PageEnter } from "@/components/page-enter";
import { WorkBrowser } from "@/components/work/work-browser";
import { absoluteUrl, site } from "@/data/site";
import { liveLink, projects } from "@/data/work";
import { ogImage } from "@/lib/og";

const description = `Backend, AI and full-stack projects by ${site.name}: ${projects.map((p) => p.name).join(", ")}.`;

export const metadata: Metadata = {
  title: "work",
  description,
  alternates: { canonical: "/work" },
  openGraph: { url: "/work", title: `Work · ${site.name}`, description, images: [ogImage] },
};

export default function WorkPage() {
  return (
    <PageEnter>
      <CommandBar aside={`${projects.length} ${projects.length === 1 ? "project" : "projects"}`}>$ ls ./work</CommandBar>
      {/* Wide screens: the page stays put and only the project list scrolls (see WorkBrowser). */}
      <div className="flex min-h-0 flex-auto flex-col overflow-x-hidden overflow-y-auto min-[960px]:overflow-hidden">
        <main id="main" className="mx-auto box-border flex w-full max-w-[1180px] flex-col px-4 sm:px-8 min-[960px]:h-full min-[960px]:pb-12">
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
            itemListElement: projects.map((p, i) => {
              const live = liveLink(p);
              const repos = p.links.filter((l) => /^https:\/\/(github|gitlab)\.com\//.test(l.href)).map((l) => l.href);
              return {
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "SoftwareSourceCode",
                  name: p.name,
                  description: p.desc,
                  dateCreated: p.year,
                  keywords: p.stack.join(", "),
                  author: { "@id": `${site.url}/#person` },
                  ...(live ? { url: live.href } : {}),
                  ...(repos.length ? { codeRepository: repos.length === 1 ? repos[0] : repos } : {}),
                },
              };
            }),
          },
        }}
      />
    </PageEnter>
  );
}
