"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Project } from "@/data/projects";

interface ProjectModalProps {
  project: Project;
  currentIndex: number;
  total: number;
  backHref: string;
  // True only when rendered via the intercepted (.)work/[slug] route (opened
  // by clicking a project from /work while already in the app). Closing there
  // must use router.back() - the Next.js-documented way to dismiss an
  // intercepted route - because it returns to the *exact* history entry that
  // existed before the modal opened, which is what correctly collapses the
  // @modal slot back to its default (empty) state. router.push/replace to the
  // same URL instead leave that slot stuck, making the page underneath
  // unresponsive until a real back navigation happens.
  // The standalone page (direct visit / hard reload / crawler) has no such
  // prior history entry, so it falls back to a normal push to backHref.
  closeWithBack?: boolean;
}

export default function ProjectModal({ project, currentIndex, total, backHref, closeWithBack }: ProjectModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const hasEnteredRef = useRef(false);

  // Lock page scroll for the lifetime of the modal
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // One-time entrance animation when the modal mounts (opening a project).
  useEffect(() => {
    if (hasEnteredRef.current) return;
    hasEnteredRef.current = true;

    if (modalRef.current) {
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    }
    if (dialogContentRef.current) {
      gsap.fromTo(
        dialogContentRef.current,
        { opacity: 0, y: 32, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 0.1, ease: "power4.out" }
      );
    }
  }, []);

  const close = () => (closeWithBack ? router.back() : router.push(backHref));

  const handleClose = () => {
    if (!modalRef.current || !dialogContentRef.current) {
      close();
      return;
    }
    gsap.to(dialogContentRef.current, { opacity: 0, y: 16, scale: 0.98, duration: 0.3, ease: "power2.in" });
    gsap.to(modalRef.current, { opacity: 0, duration: 0.35, ease: "power2.in", onComplete: close });
  };

  return (
    <div ref={modalRef} className="fixed inset-0 z-[200] bg-black text-background">
      <div className="h-screen w-full flex flex-col px-6 lg:px-14 py-6 lg:py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 lg:mb-14 shrink-0">
          <span className="font-faktum font-bold text-[10px] lg:text-xs tracking-[0.3em] uppercase opacity-50">
            {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>

          <button
            onClick={handleClose}
            className="font-faktum font-bold uppercase tracking-[0.2em] text-[10px] lg:text-xs border border-background rounded-full px-6 py-3 lg:px-7 lg:py-3.5 hover:bg-background hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Animated Content Wrapper */}
        <div
          ref={dialogContentRef}
          className="flex-1 flex flex-col min-h-0 overflow-y-auto lg:overflow-hidden pb-8 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
        >

          {/* Title */}
          <div className="mb-8 lg:mb-10 shrink-0 border-b border-background/30 pb-6 lg:pb-8">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-wide uppercase leading-[0.9]">
              {project.title}
            </h1>
          </div>

          {/* Content Grid */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 flex-1 min-h-0">

            {/* Left Col: Main Info */}
            <div className="lg:w-8/12 flex flex-col h-full lg:overflow-y-auto pr-2 lg:pr-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
              <p className="font-faktum text-base sm:text-lg lg:text-xl leading-relaxed opacity-80 mb-10 lg:mb-14 max-w-3xl">
                {project.description}
              </p>

              <div className="mb-10">
                <h3 className="font-faktum font-bold text-[10px] tracking-[0.3em] uppercase opacity-50 mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2.5">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="font-faktum text-[10px] lg:text-xs font-bold tracking-[0.2em] uppercase border border-background/70 rounded-full px-5 py-2.5 hover:bg-background hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Meta & Actions */}
            <div className="lg:w-4/12 flex flex-col justify-start shrink-0 lg:border-l border-background/20 lg:pl-10 pt-2 lg:pt-0">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-6 lg:gap-10 mb-10">
                <div>
                  <h3 className="font-faktum font-bold text-[10px] tracking-[0.3em] uppercase opacity-50 mb-2">Timeline</h3>
                  <p className="font-faktum font-bold text-sm lg:text-base tracking-widest uppercase">{project.timeline}</p>
                </div>
                <div>
                  <h3 className="font-faktum font-bold text-[10px] tracking-[0.3em] uppercase opacity-50 mb-2">Role</h3>
                  <p className="font-faktum font-bold text-sm lg:text-base tracking-widest uppercase">{project.category}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-auto lg:mt-0">
                <a href={project.demoLink} target="_blank" rel="noreferrer" className="font-faktum font-bold text-[10px] lg:text-xs tracking-[0.2em] uppercase bg-background text-black border border-background rounded-full px-8 py-4 hover:bg-transparent hover:text-background transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] text-center flex-1 lg:flex-none">
                  Launch Project
                </a>
                <a href={project.codeLink} target="_blank" rel="noreferrer" className="font-faktum font-bold text-[10px] lg:text-xs tracking-[0.2em] uppercase border border-background rounded-full px-8 py-4 hover:bg-background hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] text-center flex-1 lg:flex-none">
                  View Repository
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
