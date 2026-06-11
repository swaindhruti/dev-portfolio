"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  
  const bioLines = [
    "I'm a Mining Engineer turned Full Stack Developer based in",
    "Odisha, India. I've gone from making drones to architecting",
    "high-performance web applications and intelligent AI agents —",
    "I care just as much about robust architecture as I do about",
    "seamless user experience. I'm a total engineering freak:",
    "full-stack by name, backend is my ultimate solution."
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const textLines = gsap.utils.toArray(".about-line");
      
      // Reveal the text line by line
      gsap.fromTo(
        textLines,
        { yPercent: 120, opacity: 0, rotateZ: 2 },
        {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );
      
      // Animate buttons
      gsap.fromTo(
        ".about-btn",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full min-h-dvh flex flex-col justify-center px-6 lg:px-24 py-32 bg-background text-foreground z-10 overflow-hidden">
      
      <div className="max-w-[95%] lg:max-w-[85%] mt-16 lg:mt-0 font-faktum font-medium text-[5.5vw] lg:text-[2.5vw] leading-[1.3] tracking-tight">
        {bioLines.map((line, index) => (
          <span key={index} className="overflow-hidden inline-block pb-1 lg:pb-2 mr-2">
            <span className="about-line inline-block origin-bottom-left">{line}</span>
          </span>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 mt-12 lg:mt-20">
        <button className="about-btn px-10 lg:px-12 py-5 lg:py-6 bg-black text-background rounded-full font-faktum text-xs lg:text-sm font-bold tracking-[0.2em] uppercase hover:scale-105 transition-transform duration-300">
          Projects
        </button>
        <button className="about-btn px-10 lg:px-12 py-5 lg:py-6 bg-black/10 border-2 border-transparent hover:border-black text-foreground rounded-full font-faktum text-xs lg:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300">
          Experience
        </button>
      </div>
    </section>
  );
}
