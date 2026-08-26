"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import LiveClock from "./LiveClock";
import { VolumeX } from "lucide-react";

interface GuitarString {
  y: number;
  freq: number;
  note: string;
  points: { x: number; y: number; vy: number }[];
  color: string;
  tension: number;
  cooldown: number;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

// Standard 6-String Guitar Tuning Frequencies (Hz) & Notes: E2, A2, D3, G3, B3, E4
const GUITAR_STRINGS = [
  { freq: 82.41, note: "E2", color: "#F4F1EA" },  // Low E
  { freq: 110.00, note: "A2", color: "#ffffff" },  // A
  { freq: 146.83, note: "D3", color: "rgba(255,255,255,0.7)" },  // D
  { freq: 196.00, note: "G3", color: "#F4F1EA" },  // G
  { freq: 246.94, note: "B3", color: "#ffffff" },  // B
  { freq: 329.63, note: "E4", color: "#F4F1EA" },  // High E
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const nameWord1 = "DHRUTI".split("");
  const nameWord2 = ".SWAIN".split("");

  const [soundEnabled, setSoundEnabled] = useState(true);

  const pointerPosRef = useRef({ x: -1000, y: -1000, prevX: -1000, prevY: -1000, isDown: false });
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Left side GSAP animation
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
        rightPanelRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: totalAnimationTime, ease: "power3.out" },
        0
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Create the AudioContext eagerly on mount (it starts "suspended" per browser
  // autoplay policy) so the first pluck doesn't pay for lazy construction.
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtxRef.current = new AudioContextClass();
    }
    return () => {
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
    };
  }, []);

  // Hovering the strings (pointermove) is NOT a browser "user gesture", so resume()
  // calls made from hover alone are silently ignored - that's why sound only ever
  // worked after clicking the sound toggle button first. Unlock on the first real
  // gesture anywhere on the page (pointerdown/touchstart/keydown), same as a click.
  useEffect(() => {
    const unlock = () => {
      audioCtxRef.current?.resume();
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // Web Audio API Acoustic Guitar Synthesizer
  const playGuitarStringSound = (frequency: number, force: number) => {
    if (!soundEnabled) return;

    try {
      const audioCtx = audioCtxRef.current;
      if (!audioCtx) return;

      if (audioCtx.state !== "running") {
        // Context isn't unlocked yet - kick off resume() and skip this pluck
        // rather than scheduling a note against a frozen/suspended clock, which
        // is what produced silent "first hover" attempts.
        audioCtx.resume();
        return;
      }

      const now = audioCtx.currentTime;
      const volume = Math.min(0.28, Math.max(0.06, force * 0.01));

      // Dual Oscillator for rich acoustic guitar resonance
      const osc = audioCtx.createOscillator();
      const oscSub = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      // Triangle wave for warm acoustic tone
      osc.type = "triangle";
      osc.frequency.setValueAtTime(frequency, now);

      oscSub.type = "sine";
      oscSub.frequency.setValueAtTime(frequency * 2, now); // Octave overtone

      // Acoustic Lowpass Filter Envelope
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(frequency * 3.5, now);
      filter.frequency.exponentialRampToValueAtTime(frequency * 0.7, now + 1.6);

      // Volume Envelope (Instant attack, smooth decay)
      gainNode.gain.setValueAtTime(volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(filter);
      oscSub.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(now);
      oscSub.start(now);
      osc.stop(now + 1.8);
      oscSub.stop(now + 1.8);
    } catch (e) {
      console.warn("Guitar note audio play failed", e);
    }
  };

  // Canvas Render Engine: Sleek Minimal Guitar & Precision String Physics
  useEffect(() => {
    const canvas = canvasRef.current;
    const panel = rightPanelRef.current;
    if (!canvas || !panel) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const dpr = window.devicePixelRatio || 1;
    let width = (canvas.width = panel.offsetWidth * dpr);
    let height = (canvas.height = panel.offsetHeight * dpr);

    const handleResize = () => {
      if (!canvas || !panel) return;
      const dpr = window.devicePixelRatio || 1;
      width = canvas.width = panel.offsetWidth * dpr;
      height = canvas.height = panel.offsetHeight * dpr;
      initStrings();
    };
    window.addEventListener("resize", handleResize);

    const updatePointerPos = (clientX: number, clientY: number, isDown = false) => {
      const rect = panel.getBoundingClientRect();
      const x = (clientX - rect.left) * dpr;
      const y = (clientY - rect.top) * dpr;

      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      pointerPosRef.current = {
        prevX: pointerPosRef.current.x,
        prevY: pointerPosRef.current.y,
        x,
        y,
        isDown,
      };
    };

    const handlePointerMove = (e: PointerEvent) => {
      updatePointerPos(e.clientX, e.clientY, pointerPosRef.current.isDown);
    };

    const handlePointerDown = (e: PointerEvent) => {
      updatePointerPos(e.clientX, e.clientY, true);
    };

    const handlePointerUp = () => {
      pointerPosRef.current.isDown = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointerPos(e.touches[0].clientX, e.touches[0].clientY, true);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointerPos(e.touches[0].clientX, e.touches[0].clientY, true);
      }
    };

    panel.addEventListener("pointermove", handlePointerMove);
    panel.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    panel.addEventListener("touchmove", handleTouchMove, { passive: true });
    panel.addEventListener("touchstart", handleTouchStart, { passive: true });

    // Initialize 6 Guitar Strings spanning the soundhole
    let strings: GuitarString[] = [];
    const numStrings = GUITAR_STRINGS.length;
    const numPointsPerString = 32;

    const initStrings = () => {
      strings = [];
      const centerY = height * 0.5;
      const totalSpan = Math.min(height * 0.35, 200 * dpr);
      const spacing = totalSpan / (numStrings - 1);
      const startY = centerY - totalSpan / 2;

      for (let i = 0; i < numStrings; i++) {
        const y = startY + i * spacing;
        const cfg = GUITAR_STRINGS[i];
        const points = [];
        for (let j = 0; j < numPointsPerString; j++) {
          const x = (j / (numPointsPerString - 1)) * width;
          points.push({ x, y, vy: 0 });
        }
        strings.push({
          y,
          freq: cfg.freq,
          note: cfg.note,
          points,
          color: cfg.color,
          tension: 0.085 + (i % 3) * 0.015,
          cooldown: 0,
        });
      }
    };
    initStrings();

    const sparks: SparkParticle[] = [];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const px = pointerPosRef.current.x;
      const py = pointerPosRef.current.y;
      const prevY = pointerPosRef.current.prevY;
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. DRAW MINIMALIST VECTOR GUITAR SILHOUETTE
      const gScale = Math.min(width, height) * 0.35;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Ambient Glow behind the soundhole
      const soundholeGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, gScale * 0.6);
      soundholeGlow.addColorStop(0, "rgba(244, 241, 234, 0.08)");
      soundholeGlow.addColorStop(1, "rgba(244, 241, 234, 0)");
      ctx.fillStyle = soundholeGlow;
      ctx.fillRect(-gScale * 1.4, -gScale * 1.4, gScale * 2.8, gScale * 2.8);

      // Guitar Soundhole Outer Glow Ring
      ctx.beginPath();
      ctx.arc(0, 0, gScale * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(244, 241, 234, 0.06)";
      ctx.fill();
      ctx.strokeStyle = "#F4F1EA";
      ctx.lineWidth = 2 * dpr;
      ctx.stroke();

      // Soundhole Inner Circle
      ctx.beginPath();
      ctx.arc(0, 0, gScale * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = "#030303";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();

      // Minimalist Guitar Body Outline Curve
      ctx.beginPath();
      ctx.moveTo(-gScale * 1.3, -gScale * 0.6);
      ctx.bezierCurveTo(-gScale * 0.7, -gScale * 0.9, gScale * 0.7, -gScale * 0.9, gScale * 1.3, -gScale * 0.6);
      ctx.bezierCurveTo(gScale * 0.9, -gScale * 0.1, gScale * 0.9, gScale * 0.1, gScale * 1.3, gScale * 0.6);
      ctx.bezierCurveTo(gScale * 0.7, gScale * 0.9, -gScale * 0.7, gScale * 0.9, -gScale * 1.3, gScale * 0.6);
      ctx.bezierCurveTo(-gScale * 0.9, gScale * 0.1, -gScale * 0.9, -gScale * 0.1, -gScale * 1.3, -gScale * 0.6);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();

      // Guitar Bridge Plate
      ctx.fillStyle = "#121216";
      ctx.fillRect(-gScale * 0.8, -gScale * 0.25, gScale * 0.08, gScale * 0.5);
      ctx.strokeStyle = "rgba(244, 241, 234, 0.4)";
      ctx.strokeRect(-gScale * 0.8, -gScale * 0.25, gScale * 0.08, gScale * 0.5);

      // Guitar Nut / Fretboard Right Side
      ctx.fillStyle = "#121216";
      ctx.fillRect(gScale * 0.8, -gScale * 0.25, gScale * 0.08, gScale * 0.5);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.strokeRect(gScale * 0.8, -gScale * 0.25, gScale * 0.08, gScale * 0.5);

      ctx.restore();

      // 2. SOLVE PHYSICS & DRAW GUITAR STRINGS WITH PRECISION RADIUS
      strings.forEach((st, stIdx) => {
        if (st.cooldown > 0) st.cooldown--;

        ctx.beginPath();
        ctx.moveTo(st.points[0].x, st.points[0].y);

        // Precision Pluck Distance Radius (Tight radius so strings are plucked individually one by one!)
        const maxDistY = 9 * dpr;
        const maxDistX = 22 * dpr;

        for (let j = 0; j < st.points.length; j++) {
          const pt = st.points[j];

          if (j === 0 || j === st.points.length - 1) {
            pt.y = st.y;
            pt.vy = 0;
            continue;
          }

          // Elastic Spring Physics
          const forceY = (st.y - pt.y) * st.tension;
          pt.vy += forceY;
          pt.vy *= 0.89;
          pt.y += pt.vy;

          // Precision Pointer Pluck Interaction
          const distX = Math.abs(px - pt.x);
          const distY = Math.abs(py - pt.y);

          // Only pluck on actual pointer motion. A stationary cursor resting inside
          // the hit box used to fall back to a distance-based force every frame,
          // which kept re-triggering the string and produced a stuck buzzing noise.
          const deltaY = py - prevY;
          if (distX < maxDistX && distY < maxDistY && Math.abs(deltaY) > 0.9 * dpr) {
            const pluckForce = deltaY * 0.4;
            pt.vy += Math.max(-22 * dpr, Math.min(22 * dpr, pluckForce));

            if (st.cooldown <= 0 && Math.abs(pt.vy) > 7 * dpr) {
              st.cooldown = 20;
              playGuitarStringSound(st.freq, Math.abs(pt.vy));

              for (let k = 0; k < 3; k++) {
                sparks.push({
                  x: pt.x,
                  y: pt.y,
                  vx: (Math.random() - 0.5) * 5 * dpr,
                  vy: (Math.random() - 0.5) * 5 * dpr,
                  alpha: 1,
                  size: (Math.random() * 2.2 + 1.2) * dpr,
                  color: st.color,
                });
              }
            }
          }
        }

        // Render Quadratic Curve for String
        for (let j = 0; j < st.points.length - 1; j++) {
          const p1 = st.points[j];
          const p2 = st.points[j + 1];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
        }
        ctx.lineTo(st.points[st.points.length - 1].x, st.points[st.points.length - 1].y);

        ctx.strokeStyle = st.color;
        ctx.lineWidth = (2.4 - stIdx * 0.25) * dpr;
        ctx.stroke();

        // Note Badge
        ctx.font = `700 ${9 * dpr}px mono`;
        ctx.fillStyle = st.color === "#F4F1EA" ? st.color : "rgba(255, 255, 255, 0.4)";
        ctx.fillText(st.note, 30 * dpr, st.points[2].y - 5 * dpr);
      });

      // 3. RENDER SPARKS
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= 0.035;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = s.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      panel.removeEventListener("pointermove", handlePointerMove);
      panel.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      panel.removeEventListener("touchmove", handleTouchMove);
      panel.removeEventListener("touchstart", handleTouchStart);
    };
  }, [soundEnabled]);

  return (
    <section ref={containerRef} className="relative w-full h-dvh flex flex-col lg:flex-row overflow-hidden bg-background text-foreground">
      {/* Left Content Half */}
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col justify-between pt-24 pb-6 px-10 lg:px-20 lg:border-r-[1.5px] border-black">
        {/* Main Text */}
        <div className="relative flex flex-col justify-center flex-1">
          <h1 className="font-display text-[12vw] lg:text-[18vw] leading-[0.95] tracking-wide uppercase flex flex-col whitespace-nowrap origin-left">
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

      {/* Right Art Half - Minimalist Vector Guitar Synthesizer */}
      <div
        ref={rightPanelRef}
        className="w-full lg:w-1/2 h-1/2 lg:h-full bg-[#050505] relative border-t-[1.5px] lg:border-t-0 border-black overflow-hidden select-none flex items-center justify-center group touch-none"
      >
        {/* Subtle Background Grid */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '50% 50%'
          }}
        />

        {/* Styled Brutalist Sound Mute/Unmute Button (Top Right) */}
        <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-20">
          <button
            onClick={() => {
              // A real click always counts as a browser "user gesture", unlike hover -
              // use it as a guaranteed way to unlock the AudioContext.
              audioCtxRef.current?.resume();
              setSoundEnabled(!soundEnabled);
            }}
            className={`px-3.5 py-2 rounded-full font-faktum text-[10px] font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-2 border shadow-lg hover:scale-105 active:scale-95 cursor-pointer ${
              soundEnabled
                ? "bg-black/90 text-white border-[#F4F1EA]/60 hover:border-[#F4F1EA] shadow-[#F4F1EA]/10"
                : "bg-black/70 text-white/50 border-white/10 hover:border-white/30"
            }`}
            title={soundEnabled ? "Mute Guitar Sound" : "Enable Guitar Sound"}
          >
            {soundEnabled ? (
              <>
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-3 bg-[#F4F1EA] animate-pulse" />
                  <span className="w-0.5 h-2 bg-[#F4F1EA] animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 h-2.5 bg-[#F4F1EA] animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-white">SOUND: <strong className="text-[#F4F1EA]">ON</strong></span>
              </>
            ) : (
              <>
                <VolumeX size={13} className="text-white/40" />
                <span>SOUND: <strong>MUTED</strong></span>
              </>
            )}
          </button>
        </div>

        {/* Interactive Guitar & Precision Strings Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing touch-none"
        />

        {/* Minimal Bottom Prompt */}
        <div className="absolute bottom-6 left-6 right-6 lg:bottom-8 lg:left-8 lg:right-8 z-20 text-center pointer-events-none font-mono text-[9px] text-white/40 uppercase tracking-[0.2em]">
          SWIPE OR TOUCH STRINGS TO PLAY ACOUSTIC GUITAR
        </div>
      </div>
    </section>
  );
}
