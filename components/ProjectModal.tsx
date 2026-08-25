"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Project } from "@/data/projects";

interface ProjectModalProps {
  project: Project;
  currentIndex: number;
  total: number;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
}

export default function ProjectModal({ project, currentIndex, total, onClose, onNavigate }: ProjectModalProps) {
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
  // Deliberately has an empty dependency array so it never re-fires on
  // navigation - it used to depend on [project.id] and would run again on
  // every prev/next click, fighting handleNavigate's own tween on the same
  // element/properties. That collision was the source of the janky switch.
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

  const handleClose = () => {
    if (!modalRef.current || !dialogContentRef.current) {
      onClose();
      return;
    }
    gsap.to(dialogContentRef.current, { opacity: 0, y: 16, scale: 0.98, duration: 0.3, ease: "power2.in" });
    gsap.to(modalRef.current, { opacity: 0, duration: 0.35, ease: "power2.in", onComplete: onClose });
  };

  const handleNavigate = (direction: "prev" | "next") => {
    if (!dialogContentRef.current) {
      onNavigate(direction);
      return;
    }
    const exitX = direction === "next" ? -32 : 32;
    gsap.to(dialogContentRef.current, {
      opacity: 0,
      x: exitX,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        onNavigate(direction);
        // Wait a frame so the new project's content has committed before the
        // enter tween starts - it's invisible at that point anyway, but this
        // avoids animating in against layout that's still catching up.
        requestAnimationFrame(() => {
          if (!dialogContentRef.current) return;
          gsap.fromTo(
            dialogContentRef.current,
            { opacity: 0, x: -exitX },
            { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
          );
        });
      },
    });
  };

  return (
    <div ref={modalRef} className="fixed inset-0 z-[200] bg-black text-background">
      <div className="h-screen w-full flex flex-col px-6 lg:px-14 py-6 lg:py-10">
        {/* Header */}
        <div className="grid grid-cols-3 items-center mb-10 lg:mb-14 shrink-0">
          <button
            onClick={handleClose}
            className="justify-self-start font-faktum font-bold uppercase tracking-[0.2em] text-[10px] lg:text-xs border border-background rounded-full px-6 py-3 lg:px-7 lg:py-3.5 hover:bg-background hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
          >
            Close
          </button>

          <span className="justify-self-center font-faktum font-bold text-[10px] lg:text-xs tracking-[0.3em] uppercase opacity-50">
            {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>

          <div className="justify-self-end flex gap-3">
            <button
              onClick={() => handleNavigate("prev")}
              className="w-11 h-11 lg:w-12 lg:h-12 rounded-full border border-background flex items-center justify-center hover:bg-background hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group cursor-pointer"
            >
              <ArrowLeft size={18} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
            </button>
            <button
              onClick={() => handleNavigate("next")}
              className="w-11 h-11 lg:w-12 lg:h-12 rounded-full border border-background flex items-center justify-center hover:bg-background hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group cursor-pointer"
            >
              <ArrowRight size={18} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
            </button>
          </div>
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
