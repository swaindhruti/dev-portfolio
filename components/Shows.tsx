"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

const showsData = [
  {
    title: "SUITS",
    genre: "DRAMA",
    tag: "TV SERIES",
    color: "bg-black/10",
    imageId: "https://res.cloudinary.com/ddtutqyub/image/upload/q_auto/f_auto/v1781144669/suits_avkfxl.jpg"
  },
  {
    title: "House M.D",
    genre: "DRAMA",
    tag: "TV SERIES",
    color: "bg-black/10",
    imageId: "https://res.cloudinary.com/ddtutqyub/image/upload/q_auto/f_auto/v1781144171/housemd_s5wquf.jpg"
  },
  {
    title: "LOKI",
    genre: "SCI-FI",
    tag: "TV SERIES",
    color: "bg-black/10",
    imageId: "https://res.cloudinary.com/ddtutqyub/image/upload/q_auto/f_auto/v1781144099/loki_tgrzcc.jpg"
  },
  {
    title: "Panchayat",
    genre: "COMEDY",
    tag: "TV SERIES",
    color: "bg-black/10",
    imageId: "https://res.cloudinary.com/ddtutqyub/image/upload/q_auto/f_auto/v1781144743/panchayat_mh1e04.jpg"
  },
  {
    title: "Nuremberg",
    genre: "HISTORY",
    tag: "Movie",
    color: "bg-black/10",
    imageId: "https://res.cloudinary.com/ddtutqyub/image/upload/q_auto/f_auto/v1781144243/nuremberg_kldwsj.jpg"
  },
  {
    title: "Shutter Island",
    genre: "MYSTERY",
    tag: "Movie",
    color: "bg-black/10",
    imageId: "https://res.cloudinary.com/ddtutqyub/image/upload/f_auto,q_auto/shutterislandd_fyxyjo"
  },
  {
    title: "Spider-Man: Noir",
    genre: "SCI-FI",
    tag: "TV Series",
    color: "bg-black/10",
    imageId: "https://res.cloudinary.com/ddtutqyub/image/upload/f_auto,q_auto/Spider_Noir_poster_ns6fvn"
  }
];

const titleChars = "I love shows".split("");

export default function Shows() {
  const containerRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -window.innerWidth / 3, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: window.innerWidth / 3, behavior: 'smooth' });
    }
  };

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
      
      {/* Title & Navigation */}
      <div className="mb-16 pl-2 flex justify-between items-end">
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
        
        {/* Navigation Buttons */}
        <div className="flex gap-4 pb-2 lg:pb-4 pr-6 lg:pr-0">
          <button 
            onClick={scrollLeft}
            className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-black flex items-center justify-center hover:scale-105 transition-transform group"
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform w-6 h-6 lg:w-8 lg:h-8">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button 
            onClick={scrollRight}
            className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-black flex items-center justify-center hover:scale-105 transition-transform group"
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform w-6 h-6 lg:w-8 lg:h-8">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div 
        ref={carouselRef}
        className="flex gap-6 lg:gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth shows-scroll-container pr-6 lg:pr-24"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .shows-scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {showsData.map((show, index) => (
          <div key={index} className="show-card flex-none w-[80vw] md:w-[40vw] lg:w-[22vw] flex flex-col font-faktum snap-start">
            {/* Image Placeholder */}
            <div className={`group w-full aspect-3/4 ${show.color} rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center`}>
              {show.imageId ? (
                <Image
                  width={960}
                  height={1280}
                  src={show.imageId}
                  sizes="100vw"
                  alt={`${show.title} poster`}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <span className="text-black/30 font-bold tracking-[0.3em] text-sm uppercase">POSTER</span>
              )}
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
