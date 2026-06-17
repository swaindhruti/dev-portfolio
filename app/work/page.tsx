"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";

const projects = [
  {
    title: "PharmaStock",
    category: "FULL STACK",
    description: "A robust full-stack inventory management solution built for pharmacy workflows and real-time data processing.",
    timeline: "2023 - PRESENT",
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
    codeLink: "#",
    demoLink: "#",
    image: null,
  },
  {
    title: "CLinqer",
    category: "FULL STACK",
    description: "An innovative full-stack platform designed to streamline automated technical workflows and field data analysis.",
    timeline: "2023",
    techStack: ["React", "Express", "MongoDB", "Python"],
    codeLink: "#",
    demoLink: "#",
    image: null,
  },
  {
    title: "Nutriscan",
    category: "FULL STACK",
    description: "A modern full-stack application focusing on nutritional scanning, user-centric design, and seamless digital experience.",
    timeline: "2022 - 2023",
    techStack: ["React Native", "Firebase", "TensorFlow"],
    codeLink: "#",
    demoLink: "#",
    image: null,
  },
  {
    title: "Plastrack",
    category: "APP",
    description: "A powerful application created to optimize tracking workflows and provide seamless on-the-go accessibility.",
    timeline: "2022",
    techStack: ["Flutter", "Dart", "Firebase"],
    codeLink: "#",
    demoLink: "#",
    image: null,
  },
  {
    title: "D2A Studio",
    category: "PLATFORM",
    description: "A comprehensive studio platform designed for managing digital assets and facilitating creative collaboration.",
    timeline: "2021",
    techStack: ["Vue", "Ruby on Rails", "AWS"],
    codeLink: "#",
    demoLink: "#",
    image: null,
  }
];

export default function Work() {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  
  const titleChars = "WORKS".split("");

  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);
  const isNavigating = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title stagger animation
      gsap.fromTo(
        ".work-char",
        { yPercent: 100 },
        { yPercent: 0, duration: 1.2, stagger: 0.08, ease: "power4.out" }
      );
      
      // Carousel stagger animation
      gsap.fromTo(
        ".project-card",
        { opacity: 0, x: 100 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 1.2, 
          stagger: 0.15, 
          delay: 0.4,
          ease: "power3.out"
        }
      );
    }, containerRef);

    // Custom Cursor logic
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.15,
          ease: "power2.out"
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth = window.innerWidth > 1024 ? 464 : window.innerWidth > 768 ? 382 : window.innerWidth * 0.75 + 32;
      carouselRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth = window.innerWidth > 1024 ? 464 : window.innerWidth > 768 ? 382 : window.innerWidth * 0.75 + 32;
      carouselRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  // Prevent background scrolling when dialog is open
  useEffect(() => {
    if (isDialogOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isDialogOpen]);

  const openDialog = (index: number) => {
    setActiveProjectIndex(index);
    setIsDialogOpen(true);
    
    // Initial fade in for dialog content
    if (dialogContentRef.current) {
      gsap.fromTo(dialogContentRef.current, 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.3, ease: "power3.out" }
      );
    }
  };

  const navigateDialog = (newIndex: number) => {
    if (isNavigating.current || newIndex === activeProjectIndex) return;
    isNavigating.current = true;

    if (dialogContentRef.current) {
      gsap.to(dialogContentRef.current, {
        opacity: 0,
        y: 15,
        scale: 0.98,
        duration: 0.25,
        ease: "power2.inOut",
        onComplete: () => {
          setActiveProjectIndex(newIndex);
          
          // Slight delay to allow React to render the new state before fading in
          setTimeout(() => {
            if (dialogContentRef.current) {
              gsap.fromTo(dialogContentRef.current,
                { opacity: 0, y: -15, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out", onComplete: () => {
                  isNavigating.current = false;
                }}
              );
            } else {
              isNavigating.current = false;
            }
          }, 30);
        }
      });
    } else {
      setActiveProjectIndex(newIndex);
      isNavigating.current = false;
    }
  };

  const activeProject = projects[activeProjectIndex];

  return (
    <>
      {/* Custom Cursor Wrapper (Isolates GSAP transforms from Tailwind transforms) */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 pointer-events-none z-[150]"
      >
        <div 
          className={`w-24 h-24 bg-black text-background rounded-full flex items-center justify-center font-faktum font-bold text-[10px] tracking-widest uppercase -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${isHoveringCard ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
        >
          View
        </div>
      </div>

      <main ref={containerRef} className="w-full min-h-screen pt-32 pb-32 bg-background text-foreground overflow-hidden relative">
        
        {/* Massive Title & Navigation */}
        <div className="mb-8 lg:mb-16 px-6 lg:px-24 flex flex-col md:flex-row md:justify-between md:items-end gap-6 md:gap-0">
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

          {/* Controls */}
          <div className="flex justify-end gap-4 pb-2 lg:pb-4">
            <button 
              onClick={scrollLeft}
              className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-transform duration-300 group z-10"
              aria-label="Previous"
            >
              <ArrowLeft size={24} strokeWidth={2} className="text-background group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={scrollRight}
              className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-transform duration-300 group z-10"
              aria-label="Next"
            >
              <ArrowRight size={24} strokeWidth={2} className="text-background group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative w-full mb-12">
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto gap-6 lg:gap-24 px-6 lg:px-24 snap-x snap-mandatory pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
          >
            {projects.map((project, idx) => (
              <div 
                key={idx} 
                className="project-card group cursor-none flex flex-col shrink-0 w-[75vw] md:w-[350px] lg:w-[400px] snap-center"
                onMouseEnter={() => setIsHoveringCard(true)}
                onMouseLeave={() => setIsHoveringCard(false)}
                onClick={() => openDialog(idx)}
              >
                
                {/* Image Placeholder (Portrait Orientation) */}
                <div className="w-full aspect-3/4 bg-black/5 rounded-[2rem] lg:rounded-[3rem] overflow-hidden relative mb-8">
                  <div className="absolute inset-0 bg-black/10 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105 flex items-center justify-center">
                    <span className="font-faktum font-bold tracking-[0.3em] uppercase text-xs opacity-30">Project</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col border-t border-black/20 pt-6 pointer-events-none">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="font-faktum text-2xl lg:text-3xl font-bold uppercase tracking-wide leading-none group-hover:opacity-60 transition-opacity">
                      {project.title}
                    </h2>
                    <span className="font-faktum text-[10px] lg:text-xs font-bold tracking-[0.2em] uppercase border border-black rounded px-2 py-1 shrink-0 mt-1 ml-4">
                      {project.category}
                    </span>
                  </div>
                  <p className="font-faktum text-xs lg:text-sm leading-relaxed opacity-80 max-w-sm">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
            {/* Spacer to fix browser right padding collapse in flex containers */}
            <div className="shrink-0 w-[1px]" aria-hidden="true"></div>
          </div>
        </div>

      </main>

      {/* Project Details Full Screen Dialog */}
      <div 
        className={`fixed inset-0 z-200 bg-black text-background transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isDialogOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="h-screen w-full flex flex-col px-6 lg:px-16 py-8 lg:py-12">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8 shrink-0">
            <button 
              onClick={() => setIsDialogOpen(false)}
              className="font-faktum font-bold uppercase tracking-[0.2em] text-[10px] lg:text-xs border border-background rounded-full px-6 py-3 lg:px-8 lg:py-4 hover:bg-background hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
            >
              Close
            </button>
            <div className="flex gap-4">
              <button 
                onClick={() => navigateDialog(activeProjectIndex > 0 ? activeProjectIndex - 1 : projects.length - 1)}
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-background flex items-center justify-center hover:bg-background hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group"
              >
                <ArrowLeft size={20} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
              </button>
              <button 
                onClick={() => navigateDialog(activeProjectIndex < projects.length - 1 ? activeProjectIndex + 1 : 0)}
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-background flex items-center justify-center hover:bg-background hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group"
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
                {activeProject.title}
              </h1>
            </div>

            {/* Bottom Content Grid */}
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 flex-1 min-h-0">
              
              {/* Left Col: Main Info */}
              <div className="lg:w-8/12 flex flex-col h-full lg:overflow-y-auto pr-2 lg:pr-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                
                <h3 className="font-faktum text-xl sm:text-2xl lg:text-4xl leading-relaxed opacity-90 mb-12 lg:mb-20 max-w-4xl">
                  {activeProject.description}
                </h3>

                <div className="mb-12">
                  <h3 className="font-faktum font-bold text-[10px] tracking-[0.3em] uppercase opacity-60 mb-6">Technologies Used</h3>
                  <div className="flex flex-wrap gap-3">
                    {activeProject.techStack.map((tech, i) => (
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
                    <p className="font-faktum font-bold text-sm lg:text-base tracking-widest uppercase">{activeProject.timeline}</p>
                  </div>
                  <div>
                    <h3 className="font-faktum font-bold text-[10px] tracking-[0.3em] uppercase opacity-60 mb-3">Role</h3>
                    <p className="font-faktum font-bold text-sm lg:text-base tracking-widest uppercase">{activeProject.category}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-4 mt-auto lg:mt-0">
                  <a href={activeProject.demoLink} target="_blank" rel="noreferrer" className="font-faktum font-bold text-[10px] lg:text-xs tracking-[0.2em] uppercase bg-background text-black border border-background rounded-full px-10 py-5 hover:bg-transparent hover:text-background transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] text-center flex-1 lg:flex-none">
                    Launch Project
                  </a>
                  <a href={activeProject.codeLink} target="_blank" rel="noreferrer" className="font-faktum font-bold text-[10px] lg:text-xs tracking-[0.2em] uppercase border border-background rounded-full px-10 py-5 hover:bg-background hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] text-center flex-1 lg:flex-none">
                    View Repository
                  </a>
                </div>
              </div>
              
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
