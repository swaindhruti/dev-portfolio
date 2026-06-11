"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import LiveClock from "./LiveClock";
import { Mail } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameWord1 = "DHRUTI".split("");
  const nameWord2 = ".SWAIN".split("");
  const imageRef = useRef<HTMLDivElement>(null);
  
  const [isMounted, setIsMounted] = useState(false);
  const [celestial, setCelestial] = useState({
    moonPhase: "CALCULATING...",
    moonAngle: 0,
    illumination: 0,
    sunAngle: 0,
    satAngle: 0,
    cy3Angle: 0,
    hstAngle: 0,
    timeString: "00:00:00"
  });

  useEffect(() => {
    setIsMounted(true);

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });

    // Live celestial calculations (Locked to Indian Standard Time)
    const updateCelestial = () => {
      const now = new Date();
      const timeString = timeFormatter.format(now);
      
      const [h, m, s] = timeString.split(':').map(Number);
      const timeInHours = (h === 24 ? 0 : h) + m / 60 + s / 3600;
      
      // Sun Angle: 0 degrees is bottom (Midnight), 180 degrees is top (Noon).
      const sunAngle = (timeInHours / 24) * 360 + 180;

      const newMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
      const diffMs = now.getTime() - newMoon.getTime();
      const days = diffMs / (1000 * 60 * 60 * 24);
      const cycle = 29.53058867;
      const lunarAge = days % cycle;
      const moonAngle = (lunarAge / cycle) * 360;
      const illumination = Math.round((0.5 * (1 - Math.cos((moonAngle * Math.PI) / 180))) * 100);
      
      // Satellite Angles
      const satAngle = ((now.getTime() % 5400000) / 5400000) * 360; // ISS
      const cy3Angle = ((now.getTime() % 7200000) / 7200000) * 360; // CY-3
      const hstAngle = ((now.getTime() % 5700000) / 5700000) * 360 + 120; // HST
      
      let moonPhase = "";
      if (lunarAge < 1) moonPhase = "NEW MOON";
      else if (lunarAge < 7.4) moonPhase = "WAXING CRESCENT";
      else if (lunarAge < 8.4) moonPhase = "FIRST QUARTER";
      else if (lunarAge < 14.8) moonPhase = "WAXING GIBBOUS";
      else if (lunarAge < 15.8) moonPhase = "FULL MOON";
      else if (lunarAge < 22.1) moonPhase = "WANING GIBBOUS";
      else if (lunarAge < 23.1) moonPhase = "LAST QUARTER";
      else moonPhase = "WANING CRESCENT";

      setCelestial({ moonPhase, moonAngle, illumination, sunAngle, satAngle, cy3Angle, hstAngle, timeString });
    };

    updateCelestial();
    const interval = setInterval(updateCelestial, 1000);

    // Initial page load animations
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      const duration = 1.2;
      const stagger = 0.08;
      const totalChars = nameWord1.length + nameWord2.length;
      const totalAnimationTime = duration + (totalChars - 1) * stagger;

      tl.fromTo(
        ".char",
        { yPercent: 100 },
        { yPercent: 0, duration: duration, stagger: stagger, ease: "power4.out" },
        0
      );
      
      tl.fromTo(
        imageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: totalAnimationTime, ease: "power3.inOut" },
        0
      );

    }, containerRef);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-dvh flex flex-col lg:flex-row overflow-hidden bg-background text-foreground">
      {/* Left Content Half */}
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col justify-between pt-24 pb-2 px-6 lg:px-24 lg:border-r-[1.5px] border-black">
        {/* Main Text */}
        <div className="relative flex flex-col justify-center flex-1">
          <h1 className="font-display text-[22vw] lg:text-[19vw] leading-[0.95] tracking-wide uppercase flex flex-col whitespace-nowrap origin-left ml-2">
            <span className="flex overflow-hidden">
              {nameWord1.map((char, index) => (
                <span key={`w1-${index}`} className="char block origin-bottom">{char}</span>
              ))}
            </span>
            <span className="flex overflow-hidden">
              {nameWord2.map((char, index) => (
                <span key={`w2-${index}`} className="char block origin-bottom">{char}</span>
              ))}
            </span>
          </h1>
        </div>

        {/* Bottom Footer Info */}
        <div className="flex justify-between items-end w-full pb-0 mt-auto pr-2 pl-2">
          <div className="text-[10px] sm:text-xs font-bold tracking-widest uppercase">ODISHA, INDIA</div>
          <LiveClock />
        </div>
      </div>

      {/* Right Art Half */}
      <div ref={imageRef} className="w-full lg:w-1/2 h-1/2 lg:h-full bg-black relative group border-t-[1.5px] lg:border-t-0 border-black overflow-hidden">
        
        {/* Abstract Grid Background */}
        <div className="absolute inset-0 opacity-10 transition-transform duration-1000 group-hover:scale-110" 
             style={{ 
               backgroundImage: 'linear-gradient(#ff5e00 1px, transparent 1px), linear-gradient(90deg, #ff5e00 1px, transparent 1px)', 
               backgroundSize: '40px 40px',
               backgroundPosition: '50% 50%'
             }}>
        </div>
        
        {/* Massive Live Geocentric Astrolabe */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6 lg:p-12">
          <div className="relative w-full h-full max-w-[85vw] max-h-[85vw] lg:max-w-full lg:max-h-full flex items-center justify-center text-background opacity-90 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[0.95]">
            {isMounted && (
              <svg viewBox="0 0 1000 1000" className="w-full h-full max-w-full max-h-full object-contain overflow-visible">
                {/* Outer Grid / Compass */}
                <circle cx="500" cy="500" r="450" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 20" opacity="0.3" />
                <line x1="500" y1="0" x2="500" y2="1000" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                <line x1="0" y1="500" x2="1000" y2="500" stroke="currentColor" strokeWidth="1" opacity="0.2" />

                {/* Sun Orbit */}
                <circle cx="500" cy="500" r="350" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                
                {/* Moon Orbit */}
                <circle cx="500" cy="500" r="200" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" strokeDasharray="5 10" />

                {/* Center Earth */}
                <circle cx="500" cy="500" r="40" fill="currentColor" />
                <line x1="440" y1="500" x2="560" y2="500" stroke="#000" strokeWidth="4" />
                <line x1="500" y1="440" x2="500" y2="560" stroke="#000" strokeWidth="4" />
                <text x="500" y="570" textAnchor="middle" fontSize="28" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 fill-current font-faktum font-bold tracking-widest uppercase">EARTH</text>

                {/* Orbital Rings for Satellites */}
                <circle cx="500" cy="500" r="100" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeDasharray="4 8" />
                <circle cx="500" cy="500" r="130" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeDasharray="2 4" />
                <circle cx="500" cy="500" r="160" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeDasharray="6 6" />

                {/* Satellite 1: ISS */}
                <g style={{ transform: `rotate(${celestial.satAngle}deg)`, transformOrigin: '500px 500px' }} className="transition-transform duration-1000 ease-linear">
                  <rect x="495" y="395" width="10" height="10" fill="none" stroke="#ff5e00" strokeWidth="2" />
                  <line x1="485" y1="400" x2="495" y2="400" stroke="#ff5e00" strokeWidth="2" />
                  <line x1="505" y1="400" x2="515" y2="400" stroke="#ff5e00" strokeWidth="2" />
                  <g style={{ transform: `rotate(${-celestial.satAngle}deg)`, transformOrigin: '500px 400px' }}>
                    <text x="525" y="405" textAnchor="start" fontSize="14" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 fill-[#ff5e00] font-faktum font-bold tracking-[0.2em] uppercase">ISS</text>
                  </g>
                </g>

                {/* Satellite 2: CY-3 */}
                <g style={{ transform: `rotate(${celestial.cy3Angle}deg)`, transformOrigin: '500px 500px' }} className="transition-transform duration-1000 ease-linear">
                  <circle cx="500" cy="370" r="4" fill="#ff5e00" />
                  <circle cx="500" cy="370" r="8" fill="none" stroke="#ff5e00" strokeWidth="1.5" />
                  <g style={{ transform: `rotate(${-celestial.cy3Angle}deg)`, transformOrigin: '500px 370px' }}>
                    <text x="475" y="375" textAnchor="end" fontSize="14" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 fill-[#ff5e00] font-faktum font-bold tracking-[0.2em] uppercase">CY-3</text>
                  </g>
                </g>

                {/* Satellite 3: HST (Hubble) */}
                <g style={{ transform: `rotate(${celestial.hstAngle}deg)`, transformOrigin: '500px 500px' }} className="transition-transform duration-1000 ease-linear">
                  <rect x="496" y="336" width="8" height="8" fill="currentColor" opacity="0.8" />
                  <g style={{ transform: `rotate(${-celestial.hstAngle}deg)`, transformOrigin: '500px 340px' }}>
                    <text x="520" y="345" textAnchor="start" fontSize="14" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 fill-current font-faktum font-bold tracking-[0.2em] uppercase">HST</text>
                  </g>
                </g>

                {/* The Sun (Rotates 360deg/24hrs) */}
                <g style={{ transform: `rotate(${celestial.sunAngle}deg)`, transformOrigin: '500px 500px' }} className="transition-transform duration-1000 ease-linear">
                  <circle cx="500" cy="150" r="30" fill="none" stroke="currentColor" strokeWidth="4" />
                  <circle cx="500" cy="150" r="10" fill="currentColor" />
                  <line x1="500" y1="100" x2="500" y2="200" stroke="currentColor" strokeWidth="2" />
                  <line x1="450" y1="150" x2="550" y2="150" stroke="currentColor" strokeWidth="2" />
                  {/* Counter-rotated label so it always stays upright */}
                  <g style={{ transform: `rotate(${-celestial.sunAngle}deg)`, transformOrigin: '500px 150px' }}>
                    <text x="500" y="100" textAnchor="middle" fontSize="36" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 fill-current font-faktum font-bold tracking-widest uppercase">SUN</text>
                  </g>
                </g>

                {/* The Moon (Rotates 360deg/29.53days) */}
                <g style={{ transform: `rotate(${celestial.moonAngle}deg)`, transformOrigin: '500px 500px' }} className="transition-transform duration-1000 ease-linear">
                  <circle cx="500" cy="300" r="15" fill="currentColor" />
                  <circle cx="500" cy="300" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
                  {/* Counter-rotated label so it always stays upright */}
                  <g style={{ transform: `rotate(${-celestial.moonAngle}deg)`, transformOrigin: '500px 300px' }}>
                    <text x="500" y="250" textAnchor="middle" fontSize="28" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 fill-current font-faktum font-bold tracking-widest uppercase">MOON</text>
                  </g>
                </g>
              </svg>
            )}
          </div>
        </div>

        {/* Floating Live Celestial Data */}
        <div className="absolute top-6 right-6 lg:top-8 lg:right-8 font-faktum text-[10px] lg:text-xs text-background font-bold tracking-[0.2em] uppercase text-right leading-relaxed opacity-60 z-10">
          <p className="mb-1">T: {isMounted ? celestial.timeString : "00:00:00"} IST</p>
          <p className="mb-1">LUNAR: {isMounted ? celestial.moonPhase : "CALCULATING..."}</p>
          <p>ILLUM: {isMounted ? `${celestial.illumination}%` : "0%"}</p>
        </div>

      </div>
    </section>
  );
}
