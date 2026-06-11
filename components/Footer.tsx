"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Parallax effect on the massive text
    if (textRef.current && footerRef.current) {
      gsap.fromTo(
        textRef.current,
        { y: 150 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          }
        }
      );

      // Fade out global nav and contact when footer enters
      gsap.to("#global-nav, #global-contact", {
        opacity: 0,
        pointerEvents: "none",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%", // start fading when footer is slightly in view
          end: "top 60%",   // fully hidden when footer is 40% up the screen
          scrub: true,
        }
      });
    }
  }, []);

  const sitemap = [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "Blogs", href: "/blogs" },
    { label: "Community", href: "/community" },
    { label: "Contact", href: "/contact" },
  ];

  const socials = [
    { label: "Twitter", href: "https://twitter.com/D_SwainX" },
    { label: "LinkedIn", href: "https://linkedin.com/in/dhrutinandan" },
    { label: "YouTube", href: "https://youtube.com/@dhrutinandan" },
    { label: "Medium", href: "https://medium.com/@dhrutinandan" },
  ];

  return (
    <footer ref={footerRef} className="bg-black text-background flex flex-col justify-between overflow-hidden rounded-t-[3rem] lg:rounded-t-[5rem] mt-32">
      
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row justify-between px-6 lg:px-24 pt-24 lg:pt-32 pb-16 gap-20 lg:gap-0">
        
        {/* Call to Action */}
        <div className="flex flex-col max-w-lg">
          <h2 className="font-display text-6xl lg:text-8xl tracking-wide uppercase leading-none mb-6">
            Let's build something <br/> exceptional
          </h2>
          <p className="font-faktum text-sm lg:text-base opacity-70 mb-10 max-w-sm">
            I'm always open to discussing product design work or partnership opportunities.
          </p>
          <a href="mailto:dhrutinandan.dev@gmail.com" className="font-faktum font-bold text-xs lg:text-sm tracking-[0.2em] uppercase border border-background rounded-full px-8 py-4 self-start hover:bg-background hover:text-black transition-colors duration-300">
            Send an Email
          </a>
        </div>

        {/* Links Grid */}
        <div className="flex gap-16 lg:gap-32">
          {/* Sitemap */}
          <div className="flex flex-col gap-5">
            <span className="font-faktum font-bold text-[10px] tracking-[0.3em] uppercase opacity-50 mb-2 border-b border-background/20 pb-2">Sitemap</span>
            {sitemap.map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className="font-faktum text-base lg:text-xl font-bold tracking-widest uppercase hover:translate-x-2 hover:opacity-70 transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-5">
            <span className="font-faktum font-bold text-[10px] tracking-[0.3em] uppercase opacity-50 mb-2 border-b border-background/20 pb-2">Socials</span>
            {socials.map((link) => (
              <a 
                key={link.label} 
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="font-faktum text-base lg:text-xl font-bold tracking-widest uppercase hover:translate-x-2 hover:opacity-70 transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Massive Bottom Text */}
      <div className="border-t border-background/20 overflow-hidden relative flex items-end justify-center px-4 pt-12 pb-4 lg:pt-16 lg:pb-6">
        <h1 
          ref={textRef}
          className="font-display text-[16vw] leading-[0.75] tracking-wide uppercase text-center w-full"
        >
          Dhruti.Swain
        </h1>
      </div>

    </footer>
  );
}
