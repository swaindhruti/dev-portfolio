"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const showsData = [
  {
    title: "EVERYTHING EVERYWHERE ALL AT ONCE",
    genre: "ADVENTURE",
    tag: "FILM",
    description: "The first time I watched this film, my jaw dropped to the floor. I'd never seen anything quite like it — yet it felt familiar. It's a multiverse, it's family, it's personal growth, it's action. It makes you laugh and cry. It's quite literally everything.",
    color: "bg-black/10"
  },
  {
    title: "THE DRAMA",
    genre: "DRAMA",
    tag: "FILM",
    description: "Complex themes, impressively executed through the focused story of a wedding planning. What I love most about this film is the art of editing. With glimpses into flashback moments from the past, we understand where the character is coming from.",
    color: "bg-black/10"
  },
  {
    title: "PLURIBUS",
    genre: "DRAMA",
    tag: "TV SERIES",
    description: "Speechlessly bizarre. Intriguing. Must watch.",
    color: "bg-black/10"
  },
  {
    title: "THE STUDIO",
    genre: "COMEDY",
    tag: "TV SERIES",
    description: "Not only does this show give us a fascinating peek behind the scenes of moviemaking, but it's also beautifully shot, brilliantly edited, and utterly entertaining. I'm not even a comedy-show fan, yet I can't stop watching.",
    color: "bg-black/10"
  }
];

const titleChars = "I love shows".split("");

export default function Shows() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        ".shows-char",
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

      // Cards stagger animation
      gsap.fromTo(
        ".show-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
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
    <section ref={containerRef} className="relative w-full min-h-screen px-6 lg:px-24 py-32 bg-background text-foreground z-10 overflow-hidden">
      
      {/* Title */}
      <div className="mb-16 pl-2">
        <h2 className="font-display text-[15vw] lg:text-[8vw] leading-[0.8] tracking-wideer flex items-end">
          <span className="flex overflow-hidden">
            {titleChars.map((char, index) => (
              char === " " ? (
                <span key={index} className="inline-block w-[3vw] lg:w-[1.5vw]">&nbsp;</span>
              ) : (
                <span key={index} className="shows-char block origin-bottom">{char}</span>
              )
            ))}
          </span>
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {showsData.map((show, index) => (
          <div key={index} className="show-card flex flex-col font-faktum">
            {/* Image Placeholder */}
            <div className={`w-full aspect-3/4 ${show.color} rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center`}>
              <span className="text-black/30 font-bold tracking-[0.3em] text-sm uppercase">POSTER</span>
            </div>
            
            {/* Header Info */}
            <div className="flex justify-between items-start mb-4">
              <div className="pr-4">
                <h3 className="font-extrabold text-[11px] lg:text-xs uppercase tracking-widest leading-tight mb-1">{show.title}</h3>
                <p className="text-[9px] lg:text-[10px] uppercase tracking-widest opacity-60">{show.genre}</p>
              </div>
              <div className="border border-black rounded px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-bold opacity-60 shrink-0 mt-0.5">
                {show.tag}
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
