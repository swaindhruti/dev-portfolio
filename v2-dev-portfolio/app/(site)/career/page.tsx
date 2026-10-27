import type { Metadata } from "next";
import { CareerLog } from "@/components/career/career-log";
import { CommandBar } from "@/components/command-bar";
import { JsonLd } from "@/components/json-ld";
import { PageEnter } from "@/components/page-enter";
import { roles, stack } from "@/data/career";
import { absoluteUrl, site } from "@/data/site";

const current = roles[0];
const description = `${site.name}'s career: ${roles
  .map((r) => `${r.title} at ${r.company} (${r.from}–${r.to})`)
  .join(", ")}. Stack: ${Object.values(stack).flat().slice(0, 12).join(", ")}.`;

export const metadata: Metadata = {
  title: "Career",
  description,
  alternates: { canonical: "/career" },
  openGraph: { url: "/career", title: `Career · ${site.name}`, description },
};

export default function CareerPage() {
  const oldest = roles[roles.length - 1];
  return (
    <PageEnter>
      <h1 className="sr-only">Career</h1>
      <CommandBar aside={oldest ? `${roles.length} roles · ${oldest.from} → now` : null}>
        $ git log --career --graph
      </CommandBar>
      <CareerLog roles={roles} stack={stack} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: absoluteUrl("/career"),
          mainEntity: {
            "@id": `${site.url}/#person`,
            "@type": "Person",
            name: site.name,
            jobTitle: current?.title,
            worksFor: current ? { "@type": "Organization", name: current.company } : undefined,
            knowsAbout: Object.values(stack).flat(),
          },
        }}
      />
    </PageEnter>
  );
}
