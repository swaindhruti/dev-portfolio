"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navigation() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div id="global-nav" className="fixed top-4 left-4 lg:top-6 lg:left-6 z-100">
      <div 
        className={`bg-black overflow-hidden transition-[max-width,height] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-2xl inline-flex items-center ${
          isHovered ? "max-w-[600px] lg:max-w-[800px] h-14 lg:h-16" : "max-w-[56px] lg:max-w-[64px] h-14 lg:h-16"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* The Logo Container */}
        <div className="w-14 h-14 lg:w-16 lg:h-16 shrink-0 flex items-center justify-center">
          {/* The Face */}
          <div className={`flex flex-col items-center justify-center gap-0.5 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-center ${isHovered ? "-rotate-90" : "rotate-0"}`}>
            <div className="flex gap-1.5 lg:gap-2">
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-background"></div>
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-background"></div>
            </div>
            <div className="text-background font-faktum font-bold text-xs lg:text-sm leading-none translate-y-px">
              U
            </div>
          </div>
        </div>

        {/* Links */}
        <div 
          className={`flex items-center gap-6 lg:gap-8 pl-2 lg:pl-4 pr-6 lg:pr-8 transition-all duration-300 whitespace-nowrap ${
            isHovered ? "opacity-100 translate-x-0 delay-150" : "opacity-0 -translate-x-4 pointer-events-none"
          }`}
        >
          <Link href="/" className="text-background font-faktum font-bold text-[10px] lg:text-xs tracking-widest uppercase hover:opacity-70 transition-opacity">Home</Link>
          <Link href="/work" className="text-background font-faktum font-bold text-[10px] lg:text-xs tracking-widest uppercase hover:opacity-70 transition-opacity">Work</Link>
          <Link href="/blogs" className="text-background font-faktum font-bold text-[10px] lg:text-xs tracking-widest uppercase hover:opacity-70 transition-opacity">Blogs</Link>
          <Link href="/community" className="text-background font-faktum font-bold text-[10px] lg:text-xs tracking-widest uppercase hover:opacity-70 transition-opacity">Community</Link>
          <Link href="/contact" className="text-background font-faktum font-bold text-[10px] lg:text-xs tracking-widest uppercase hover:opacity-70 transition-opacity">Contact</Link>
        </div>
      </div>
    </div>
  );
}
