import { notFound } from "next/navigation";
import { PROJECTS, getProjectNav } from "@/data/projects";
import ProjectModal from "@/components/ProjectModal";

export default async function InterceptedProjectModal({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const nav = getProjectNav(slug);
  if (!nav) notFound();
  const { project, index } = nav;

  return (
    <ProjectModal
      project={project}
      currentIndex={index}
      total={PROJECTS.length}
      backHref="/work"
      closeWithBack
    />
  );
}
