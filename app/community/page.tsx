"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const communities = [
  "OPENCODE NIT ROURKELA", "GOOGLE DEVELOPER GROUPS", "AWS CLOUD CLUBS", "HACKNITR"
];

const events = [
  { title: "HACKNITR 7.0", date: "2026", location: "PAN INDIA" },
  { title: "HACKNITR 6.0", date: "2025", location: "PAN INDIA" },
  { title: 'HACKINNOVISION', date: "2025", location: "NIT ROURKELA" },
  { title: "BLOCK TALKS: DIVE INTO WEB3", date: "2025", location: "ONLINE" },
  { title: "HACK4BENGAL", date: "2025", location: "KOLKATA" },
  { title: "HACKNITR 5.0", date: "2024", location: "PAN INDIA" },
  { title: "HACKTOBER FEST", date: "2023", location: "GLOBAL" },
];

export default function Community() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleChars = "COMMUNITY".split("");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Title stagger animation
      gsap.fromTo(
        ".comm-char",
        { yPercent: 100 },
        { yPercent: 0, duration: 1.2, stagger: 0.08, ease: "power4.out" }
      );

      // Pills stagger animation
      gsap.fromTo(
        ".comm-pill",
        { opacity: 0, scale: 0.8, y: 20 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          duration: 0.8, 
          stagger: 0.05,
          delay: 0.3,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".pills-container",
            start: "top 85%",
          }
        }
      );

      // Events grid animation
      gsap.fromTo(
        ".event-card",
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".events-container",
            start: "top 85%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="w-full min-h-screen pt-32 pb-32 px-6 lg:px-24 bg-background text-foreground overflow-hidden">
      
      {/* Massive Title */}
      <div className="mb-20">
        <h1 className="font-display text-[16vw] lg:text-[10vw] leading-[0.8] tracking-wide uppercase flex items-end">
          <span className="flex overflow-hidden">
            {titleChars.map((char, index) => (
              char === " " ? (
                <span key={index} className="inline-block w-[3vw] lg:w-[1.5vw]">&nbsp;</span>
              ) : (
                <span key={index} className="comm-char block origin-bottom">{char}</span>
              )
            ))}
          </span>
        </h1>
      </div>

      {/* Communities Tag Cloud */}
      <div className="mb-32">
        <div className="border-b border-black pb-4 mb-10">
          <h2 className="font-faktum text-sm lg:text-base font-bold tracking-[0.3em] uppercase opacity-60">Active Communities</h2>
        </div>
        
        <div className="pills-container flex flex-wrap gap-3 lg:gap-4">
          {communities.map((comm, idx) => (
            <div key={idx} className="comm-pill border border-black rounded-full px-5 py-2.5 lg:px-6 lg:py-3 hover:bg-black hover:text-background transition-colors duration-300 cursor-pointer">
              <span className="font-faktum text-[10px] lg:text-xs font-bold tracking-widest uppercase whitespace-nowrap">{comm}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Events Dense Grid */}
      <div className="events-container">
        <div className="border-b border-black pb-4  flex justify-between items-end">
          <h2 className="font-faktum text-sm lg:text-base font-bold tracking-[0.3em] uppercase opacity-60">Past Engagements</h2>
          <span className="font-faktum text-[10px] font-bold tracking-widest opacity-40">{events.length} ARCHIVED</span>
        </div>

        <div className="flex flex-col">
          {events.map((event, idx) => (
            <div key={idx} className="event-card group grid grid-cols-1 md:grid-cols-12 gap-4 py-8 lg:py-10 border-b border-black/20 hover:bg-black hover:text-background transition-colors duration-500 px-4 lg:px-6 cursor-pointer items-center">
              
              {/* Date Column */}
              <div className="md:col-span-3 lg:col-span-2">
                <span className="font-faktum text-[10px] lg:text-xs font-bold tracking-[0.2em] opacity-50 group-hover:opacity-100 transition-opacity">{event.date}</span>
              </div>
              
              {/* Title Column */}
              <div className="md:col-span-6 lg:col-span-7">
                <h3 className="font-display text-4xl lg:text-6xl tracking-wide uppercase leading-none group-hover:translate-x-4 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                  {event.title}
                </h3>
              </div>
              
              {/* Location Column */}
              <div className="md:col-span-3 lg:col-span-3 flex md:justify-end mt-2 md:mt-0">
                <span className="font-faktum text-[10px] font-bold tracking-widest uppercase opacity-80 border border-black group-hover:border-background rounded-full px-4 py-2 transition-colors duration-500">
                  {event.location}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
