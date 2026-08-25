"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const careerData = [
  {
    role: "Founder",
    company: "D2A Studio",
    date: "JAN 2026 - PRESENT",
    logo: "D2A",
  },
  {
    role: "Backend Engineer",
    company: "N6T Tech",
    date: "FEB 2026 - PRESENT",
    logo: "N6T",
  },
  {
    role: "Software Engineer",
    company: "Scogo AI",
    date: "AUG 2025 - NOV 2025",
    logo: "SCOGO",
  },
  {
    role: "Full Stack Intern",
    company: "GoUnplan",
    date: "MAY 2025 - AUG 2025",
    logo: "GOUNPLAN",
  },
];

const titleChars = "I work dev".split("");

export default function Career() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        ".char-title",
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );

      // Rows stagger animation
      gsap.fromTo(
        ".career-row",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
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
    <section ref={containerRef} className="relative w-full border-y-[1.5px] border-black bg-background text-foreground z-10 flex flex-col lg:flex-row">

      {/* Left Pane - Sticky Title */}
      <div className="w-full lg:w-5/12 px-6 lg:px-24 py-16 lg:border-r-[1.5px] border-black">
        <div className="sticky top-32">
          <h2 className="career-title font-display text-[15vw] lg:text-[8vw] leading-[1.2] flex flex-col">
            <span className="flex overflow-hidden"><span className="char-title block origin-bottom">Debugged at</span></span>

          </h2>
          <p className="mt-4 font-faktum text-[10px] lg:text-xs font-bold tracking-widest uppercase opacity-50 max-w-2xl leading-relaxed">
            A chronological index of professional engineering, design roles, and digital architecture.
          </p>
        </div>
      </div>

      {/* Right Pane - Scrolling Job List */}
      <div className="w-full lg:w-7/12 flex flex-col">
        {careerData.map((job, index) => (
          <div key={index} className="career-row group flex flex-col justify-center px-6 lg:px-24 py-8 lg:py-16 border-b-[1.5px] border-black last:border-b-0 hover:bg-black hover:text-background transition-colors duration-500 cursor-pointer min-h-[35vh]">

            {/* Top Meta Data */}
            <div className="flex justify-between items-start mb-8 lg:mb-12">
              <span className="font-faktum text-[10px] lg:text-xs font-bold tracking-[0.2em] opacity-50 group-hover:opacity-100 transition-opacity">
                {job.date}
              </span>
              <span className="font-faktum text-[10px] lg:text-xs font-bold tracking-[0.2em] opacity-50 group-hover:opacity-100 transition-opacity">
                {job.logo}
              </span>
            </div>

            {/* Company Name */}
            <h3 className="font-display text-6xl lg:text-[7vw] tracking-wide uppercase leading-none group-hover:translate-x-6 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
              {job.company}
            </h3>

            {/* Role Badge */}
            <div className="mt-6 lg:mt-10">
              <span className="font-faktum text-xs lg:text-sm font-bold tracking-widest uppercase opacity-80 inline-block border-[1.5px] border-black group-hover:border-background/30 rounded-full px-5 py-2 group-hover:translate-x-6 transition-all duration-500 delay-75 ease-[cubic-bezier(0.23,1,0.32,1)]">
                {job.role}
              </span>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
