"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleChars = "SAY HELLO".split("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title stagger animation
      gsap.fromTo(
        ".contact-char",
        { yPercent: 100 },
        { yPercent: 0, duration: 1.2, stagger: 0.08, ease: "power4.out" }
      );
      
      // Details fade in
      gsap.fromTo(
        ".contact-detail",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 1, stagger: 0.1, delay: 0.5, ease: "power3.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="w-full min-h-screen flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-24 bg-background text-foreground overflow-hidden">

      <div className="flex flex-col lg:flex-row lg:items-end justify-between mt-24 lg:mt-0">

        {/* Massive Title */}
        <div className="mb-16 lg:mb-4 lg:w-2/3">
          <h1 className="font-display text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[7.5vw] leading-[0.9] uppercase flex items-end flex-wrap">
            <span className="flex overflow-hidden flex-wrap">
              {titleChars.map((char, index) => (
                char === " " ? (
                  <span key={index} className="inline-block w-[3vw] sm:w-[2.5vw] lg:w-[1.5vw]">&nbsp;</span>
                ) : (
                  <span key={index} className="contact-char block origin-bottom">{char}</span>
                )
              ))}
            </span>
          </h1>
        </div>

        {/* Links Column */}
        <div className="flex flex-col gap-10 lg:gap-16 lg:mb-8 lg:w-1/3">

          <div className="contact-detail">
            <h2 className="font-faktum text-[10px] lg:text-xs font-bold tracking-[0.3em] uppercase opacity-50 mb-3 border-b border-black/20 pb-2 inline-block">Email</h2>
            <div>
              <a href="mailto:dhrutinandan.dev@gmail.com" className="font-faktum text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-wide hover:opacity-60 transition-opacity break-all">
                dhrutinandan.dev@gmail.com
              </a>
            </div>
          </div>

          <div className="contact-detail flex gap-16">
            <div className="flex flex-col gap-3">
              <h2 className="font-faktum text-[10px] lg:text-xs font-bold tracking-[0.3em] uppercase opacity-50 mb-1 border-b border-black/20 pb-2 inline-block">Social</h2>
              <a href="https://github.com/swaindhruti" target="_blank" rel="noreferrer" className="font-faktum text-sm lg:text-base font-bold tracking-widest uppercase hover:opacity-60 transition-opacity">GitHub</a>
              <a href="https://twitter.com/D_SwainX" target="_blank" rel="noreferrer" className="font-faktum text-sm lg:text-base font-bold tracking-widest uppercase hover:opacity-60 transition-opacity">Twitter</a>
              <a href="https://linkedin.com/in/dhrutinandan" target="_blank" rel="noreferrer" className="font-faktum text-sm lg:text-base font-bold tracking-widest uppercase hover:opacity-60 transition-opacity">LinkedIn</a>
              <a href="https://youtube.com/@dhrutinandan" target="_blank" rel="noreferrer" className="font-faktum text-sm lg:text-base font-bold tracking-widest uppercase hover:opacity-60 transition-opacity">YouTube</a>
            </div>
            
            <div className="flex flex-col gap-3">
              <h2 className="font-faktum text-[10px] lg:text-xs font-bold tracking-[0.3em] uppercase opacity-50 mb-1 border-b border-black/20 pb-2 inline-block">More</h2>
              <a href="https://dhrutiswain.substack.com/" target="_blank" rel="noreferrer" className="font-faktum text-sm lg:text-base font-bold tracking-widest uppercase hover:opacity-60 transition-opacity">Substack</a>
              <a href="https://linktr.ee/dhrutinandan" target="_blank" rel="noreferrer" className="font-faktum text-sm lg:text-base font-bold tracking-widest uppercase hover:opacity-60 transition-opacity">Linktree</a>
              <a href="https://medium.com/@dhrutinandan" target="_blank" rel="noreferrer" className="font-faktum text-sm lg:text-base font-bold tracking-widest uppercase hover:opacity-60 transition-opacity">Medium</a>
            </div>
          </div>
          
        </div>
      </div>

    </main>
  );
}
