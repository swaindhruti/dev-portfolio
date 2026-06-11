"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";

const projects = [
  {
    title: "N6T ARCHITECTURE",
    category: "BACKEND",
    description: "A robust backend architecture built for high scalability and real-time data processing workflows.",
  },
  {
    title: "SCOGO AI",
    category: "FULL STACK",
    description: "An AI-powered platform designed to streamline automated technical workflows and field data analysis.",
  },
  {
    title: "GOUNPLAN",
    category: "WEB APP",
    description: "A modern web application focusing on user-centric design, fluid animations, and seamless digital experience.",
  },
  {
    title: "D2A STUDIO",
    category: "PLATFORM",
    description: "A comprehensive studio platform designed for managing digital assets and facilitating creative collaboration.",
  }
];

export default function Work() {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const titleChars = "WORKS".split("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title stagger animation
      gsap.fromTo(
        ".work-char",
        { yPercent: 100 },
        { yPercent: 0, duration: 1.2, stagger: 0.08, ease: "power4.out" }
      );
      
      // Carousel stagger animation (Slides in from the right)
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

    return () => ctx.revert();
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

  return (
    <main ref={containerRef} className="w-full min-h-screen pt-32 pb-32 bg-background text-foreground overflow-hidden">
      
      {/* Massive Title */}
      <div className="mb-16 px-6 lg:px-24">
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

      {/* Carousel */}
      <div className="relative w-full mb-12">
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-8 lg:gap-16 px-6 lg:px-24 snap-x snap-mandatory pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
        >
          {projects.map((project, idx) => (
            <div key={idx} className="project-card group cursor-pointer flex flex-col shrink-0 w-[75vw] md:w-[350px] lg:w-[400px] snap-center">
              
              {/* Image Placeholder (Portrait Orientation) */}
              <div className="w-full aspect-3/4 bg-black/5 rounded-4xl overflow-hidden relative mb-8">
                <div className="absolute inset-0 bg-black/10 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105 flex items-center justify-center">
                  <span className="font-faktum font-bold tracking-[0.3em] uppercase text-xs opacity-30">Project</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col border-t border-black/20 pt-6">
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
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-start gap-4 px-6 lg:px-24">
        <button 
          onClick={scrollLeft}
          className="w-14 h-14 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
        >
          <ArrowLeft size={20} strokeWidth={2.5} className="text-background" />
        </button>
        <button 
          onClick={scrollRight}
          className="w-14 h-14 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
        >
          <ArrowRight size={20} strokeWidth={2.5} className="text-background" />
        </button>
      </div>

    </main>
  );
}
