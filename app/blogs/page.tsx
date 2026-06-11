"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const blogs = [
  {
    title: "Blockchain Basics",
    date: "12 OCT 2026",
    category: "ENGINEERING",
  },
  {
    title: "MINIMALISM IN UI DESIGN",
    date: "28 SEP 2026",
    category: "DESIGN",
  },
  {
    title: "HOW I BUILT THIS PORTFOLIO",
    date: "14 AUG 2026",
    category: "TUTORIAL",
  },
  {
    title: "MY JOURNEY IN WEB DEV",
    date: "02 JUL 2026",
    category: "PERSONAL",
  }
];

export default function Blogs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleChars = "NOTES".split("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title stagger animation
      gsap.fromTo(
        ".blog-char",
        { yPercent: 100 },
        { yPercent: 0, duration: 1.2, stagger: 0.08, ease: "power4.out" }
      );
      
      // List stagger animation
      gsap.fromTo(
        ".blog-row",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, delay: 0.4, ease: "power3.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="w-full min-h-screen pt-32 px-6 lg:px-24 bg-background text-foreground overflow-hidden pb-32">
      
      {/* Massive Title */}
      <div className="mb-16">
        <h1 className="font-display text-[20vw] lg:text-[14vw] leading-[0.8] tracking-wide uppercase flex items-end">
          <span className="flex overflow-hidden">
            {titleChars.map((char, index) => (
              char === " " ? (
                <span key={index} className="inline-block w-[3vw] lg:w-[1.5vw]">&nbsp;</span>
              ) : (
                <span key={index} className="blog-char block origin-bottom">{char}</span>
              )
            ))}
          </span>
        </h1>
      </div>

      {/* Blog List */}
      <div className="flex flex-col border-t border-black blog-list">
        {blogs.map((blog, idx) => (
          <div key={idx} className="blog-row group border-b border-black flex flex-col md:flex-row md:items-center justify-between py-8 lg:py-12 cursor-pointer transition-colors duration-500 hover:bg-black hover:text-background px-4 -mx-4 lg:px-8 lg:-mx-8">
            
            <div className="flex items-center w-full md:w-3/4">
              <span className="font-faktum text-sm lg:text-base font-bold tracking-widest opacity-40 group-hover:opacity-100 transition-opacity w-12 lg:w-20 shrink-0">
                0{idx + 1}
              </span>

              <h2 className="font-faktum text-4xl sm:text-5xl lg:text-7xl xl:text-[7rem] tracking-wide leading-none transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                {blog.title}
              </h2>
            </div>
            
            <div className="flex flex-row md:flex-col justify-between md:items-end md:w-1/4 mt-6 md:mt-0 font-faktum font-bold tracking-widest text-[10px] lg:text-xs uppercase">
              <span className="opacity-80 mb-1 border-b border-current pb-1">{blog.category}</span>
              <span className="opacity-50">{blog.date}</span>
            </div>

          </div>
        ))}
      </div>

    </main>
  );
}
