"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PROJECTS } from "@/data/projects";
import ProjectModal from "@/components/ProjectModal";

export default function Work() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleChars = "WORKS".split("");

  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title stagger animation
      gsap.fromTo(
        ".work-char",
        { yPercent: 100 },
        { yPercent: 0, duration: 1.2, stagger: 0.08, ease: "power4.out" }
      );

      // List stagger animation
      gsap.fromTo(
        ".work-row",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, delay: 0.4, ease: "power3.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const openProjectModal = (idx: number) => {
    setActiveIdx(idx);
  };

  const closeModal = () => {
    setActiveIdx(null);
  };

  const navigateModal = (direction: "prev" | "next") => {
    if (activeIdx === null) return;
    let nextIdx = direction === "next" ? activeIdx + 1 : activeIdx - 1;
    if (nextIdx >= PROJECTS.length) nextIdx = 0;
    if (nextIdx < 0) nextIdx = PROJECTS.length - 1;
    setActiveIdx(nextIdx);
  };

  const activeProject = activeIdx !== null ? PROJECTS[activeIdx] : null;

  return (
    <main ref={containerRef} className="w-full min-h-screen pt-32 px-6 lg:px-24 bg-background text-foreground overflow-hidden pb-32">
      
      {/* Massive Title */}
      <div className="mb-16">
        <h1 className="font-display text-[20vw] lg:text-[14vw] leading-[0.8] tracking-wide uppercase flex items-end">
          <span className="flex overflow-hidden">
            {titleChars.map((char, index) => (
              char === " " ? (
                <span key={index} className="inline-block w-[3vw] lg:w-[1.5vw]">&nbsp;</span>
              ) : (
                <span key={index} className="work-char block origin-bottom">{char}</span>
              )
            ))}
          </span>
        </h1>
      </div>

      {/* Work List (Identical layout to Blogs page, preserving original title casing) */}
      <div className="flex flex-col border-t border-black work-list">
        {PROJECTS.map((project, idx) => (
          <div
            key={project.id} 
            onClick={() => openProjectModal(idx)}
            className="work-row group border-b border-black flex flex-col md:flex-row md:items-center justify-between py-8 lg:py-12 cursor-pointer transition-colors duration-500 hover:bg-black hover:text-background px-4 lg:px-6"
          >
            <div className="flex items-center w-full md:w-3/4">
              <span className="font-faktum text-sm lg:text-base font-bold tracking-widest opacity-40 group-hover:opacity-100 transition-opacity w-12 lg:w-20 shrink-0">
                0{idx + 1}
              </span>

              {/* Title with original, authentic casing (No forced ALL CAPS) */}
              <h2 className="font-faktum text-4xl sm:text-5xl lg:text-7xl xl:text-[7rem] leading-none transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] tracking-tight group-hover:translate-x-2">
                {project.title}
              </h2>
            </div>
            
            <div className="flex flex-row md:flex-col justify-between md:items-end md:w-1/4 mt-6 md:mt-0 font-faktum font-bold tracking-widest text-[10px] lg:text-xs uppercase">
              <span className="opacity-80 mb-1 border-b border-current pb-1">{project.category}</span>
              <span className="opacity-50">{project.timeline}</span>
            </div>

          </div>
        ))}
      </div>

      {/* FULL-SCREEN PROJECT CASE STUDY MODAL */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={closeModal}
          onNavigate={navigateModal}
        />
      )}

    </main>
  );
}
