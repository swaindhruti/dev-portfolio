"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Project } from "@/data/projects";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
}

export default function ProjectModal({ project, onClose, onNavigate }: ProjectModalProps) {
  const dialogContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (dialogContentRef.current) {
      gsap.fromTo(
        dialogContentRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: "power3.out" }
      );
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project.id]);

  const handleNavigate = (direction: "prev" | "next") => {
    if (dialogContentRef.current) {
      gsap.to(dialogContentRef.current, {
        opacity: 0,
        y: 15,
        scale: 0.98,
        duration: 0.25,
        ease: "power2.inOut",
        onComplete: () => {
          onNavigate(direction);
          if (dialogContentRef.current) {
            gsap.fromTo(
              dialogContentRef.current,
              { opacity: 0, y: -15, scale: 0.98 },
              { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }
            );
          }
        },
      });
    } else {
      onNavigate(direction);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black text-background transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
      <div className="h-screen w-full flex flex-col px-6 lg:px-16 py-8 lg:py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 shrink-0">
          <button 
            onClick={onClose}
            className="font-faktum font-bold uppercase tracking-[0.2em] text-[10px] lg:text-xs border border-background rounded-full px-6 py-3 lg:px-8 lg:py-4 hover:bg-background hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
          >
            Close
          </button>
          <div className="flex gap-4">
            <button 
              onClick={() => handleNavigate("prev")}
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-background flex items-center justify-center hover:bg-background hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group cursor-pointer"
            >
              <ArrowLeft size={20} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
            </button>
            <button 
              onClick={() => handleNavigate("next")}
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-background flex items-center justify-center hover:bg-background hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group cursor-pointer"
            >
              <ArrowRight size={20} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
            </button>
          </div>
        </div>

        {/* Animated Content Wrapper */}
        <div ref={dialogContentRef} className="flex-1 flex flex-col min-h-0 overflow-y-auto lg:overflow-hidden pb-8 lg:pb-0">
          
          {/* Top massive title */}
          <div className="mb-8 lg:mb-12 shrink-0 border-b border-background/60 pb-6 lg:pb-8">
            <h1 className="font-display text-5xl sm:text-7xl lg:text-[9rem] tracking-wide uppercase leading-[0.85] mb-4">
              {project.title}
            </h1>
          </div>

          {/* Bottom Content Grid */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 flex-1 min-h-0">
            
            {/* Left Col: Main Info */}
            <div className="lg:w-8/12 flex flex-col h-full lg:overflow-y-auto pr-2 lg:pr-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
              <h3 className="font-faktum text-xl sm:text-2xl lg:text-4xl leading-relaxed opacity-90 mb-12 lg:mb-20 max-w-4xl">
                {project.description}
              </h3>

              <div className="mb-12">
                <h3 className="font-faktum font-bold text-[10px] tracking-[0.3em] uppercase opacity-60 mb-6">Technologies Used</h3>
                <div className="flex flex-wrap gap-3">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="font-faktum text-[10px] lg:text-xs font-bold tracking-[0.2em] uppercase border border-background/80 rounded-full px-6 py-3 hover:bg-background hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Meta & Actions */}
            <div className="lg:w-4/12 flex flex-col justify-start shrink-0 lg:border-l border-background/30 lg:pl-12 pt-4 lg:pt-0">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-8 lg:gap-12 mb-12">
                <div>
                  <h3 className="font-faktum font-bold text-[10px] tracking-[0.3em] uppercase opacity-60 mb-3">Timeline</h3>
                  <p className="font-faktum font-bold text-sm lg:text-base tracking-widest uppercase">{project.timeline}</p>
                </div>
                <div>
                  <h3 className="font-faktum font-bold text-[10px] tracking-[0.3em] uppercase opacity-60 mb-3">Role</h3>
                  <p className="font-faktum font-bold text-sm lg:text-base tracking-widest uppercase">{project.category}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 mt-auto lg:mt-0">
                <a href={project.demoLink} target="_blank" rel="noreferrer" className="font-faktum font-bold text-[10px] lg:text-xs tracking-[0.2em] uppercase bg-background text-black border border-background rounded-full px-10 py-5 hover:bg-transparent hover:text-background transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] text-center flex-1 lg:flex-none">
                  Launch Project
                </a>
                <a href={project.codeLink} target="_blank" rel="noreferrer" className="font-faktum font-bold text-[10px] lg:text-xs tracking-[0.2em] uppercase border border-background rounded-full px-10 py-5 hover:bg-background hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] text-center flex-1 lg:flex-none">
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
