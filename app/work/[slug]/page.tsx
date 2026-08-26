import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, getProjectNav } from "@/data/projects";
import ProjectModal from "@/components/ProjectModal";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const nav = getProjectNav(slug);
  if (!nav) return {};
  const { project } = nav;

  return {
    // The nearest ancestor with an active title.template is the root layout,
    // but app/work/layout.tsx sets its own title as a plain string (no
    // template), which breaks template inheritance for this deeper segment -
    // so the site suffix is spelled out explicitly here instead of relying on it.
    title: `${project.title} | Dhrutinandan Swain`,
    description: project.tagline,
    alternates: { canonical: `/work/${project.id}` },
    openGraph: {
      type: "article",
      title: `${project.title} | Dhrutinandan Swain`,
      description: project.tagline,
      url: `/work/${project.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Dhrutinandan Swain`,
      description: project.tagline,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const nav = getProjectNav(slug);
  if (!nav) notFound();
  const { project, index } = nav;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    author: { "@type": "Person", name: "Dhrutinandan Swain", url: "https://dhrutinandan.space" },
    codeRepository: project.codeLink,
    url: `https://dhrutinandan.space/work/${project.id}`,
    keywords: project.techStack.join(", "),
    dateCreated: project.timeline,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectModal
        project={project}
        currentIndex={index}
        total={PROJECTS.length}
        backHref="/work"
      />
    </>
  );
}
