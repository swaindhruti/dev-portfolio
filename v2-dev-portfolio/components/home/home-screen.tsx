"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { quietScramble } from "../scramble";
import { SiteFooter } from "../site-footer";
import { SiteHeader } from "../site-header";
import { HandshakeEngine } from "./handshake-engine";

export function HomeScreen({ monoFamily, nameFamily }: { monoFamily: string; nameFamily: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HandshakeEngine | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [ui, setUi] = useState(false);
  const [tagTop, setTagTop] = useState(600);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Coming back via the logo (/#home) or asking for less motion skips straight to the name.
    const fromNav = window.location.hash === "#home";
    if (fromNav) window.history.replaceState(null, "", window.location.pathname + window.location.search);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const engine = new HandshakeEngine(canvas, {
      monoFamily,
      nameFamily,
      nameHeight: 0.3,
      skipIntro: fromNav || reduced,
      cursorFx: !reduced,
      onLog: setLog,
      onUi: setUi,
      onTagTop: setTagTop,
    });
    engineRef.current = engine;
    engine.start().catch(() => setUi(true));
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [monoFamily, nameFamily]);

  // The chrome becomes interactive under a resting cursor (e.g. right after clicking the logo);
  // don't let that count as a hover.
  useEffect(() => {
    if (ui) quietScramble(900);
  }, [ui]);

  useEffect(() => {
    if (ui) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") engineRef.current?.skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ui]);

  // Tagline and buttons rise into place just after the chrome starts fading in.
  const arrive = (delay: number): React.CSSProperties => ({
    opacity: ui ? 1 : 0,
    translate: ui ? "0 0" : "0 14px",
    filter: ui ? "blur(0)" : "blur(3px)",
    transition: `opacity 900ms ease ${delay}ms, translate 900ms var(--ease-out) ${delay}ms, filter 900ms ease ${delay}ms`,
  });

  return (
    <div className="screen select-none">
      {/* Stage: name canvas + tagline. Fades in on arrival like every other page. */}
      <div className="page-enter absolute inset-0">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          onClick={() => engineRef.current?.skip()}
          className="ascii-canvas absolute inset-0 block h-full w-full"
        />

        {/* Intro: boot log in the corner. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-[600ms]"
          style={{ opacity: ui ? 0 : 1 }}
        >
          <div className="absolute bottom-7 left-4 flex flex-col gap-1.5 whitespace-pre text-dim sm:left-8">
            {log.map((line) => (
              <div key={line}>{line}</div>
            ))}
            <div className="h-[13px] w-[7px] bg-fg [animation:dncaret_1s_steps(1)_infinite]" />
          </div>
        </div>

        <main
          id="main"
          inert={!ui}
          className="pointer-events-none absolute right-0 left-0 flex flex-col items-center gap-6 px-6"
          style={{ top: tagTop }}
        >
          <h1 className="sr-only">
            {site.name} — {site.role}
          </h1>
          <p className="m-0 text-center text-sm leading-[1.6] text-pretty text-dim" style={arrive(250)}>
            <span className="text-fg">{site.role}</span> — {site.tagline}
          </p>
          <div
            className="flex flex-wrap justify-center gap-3"
            style={{ ...arrive(420), pointerEvents: ui ? "auto" : "none" }}
          >
            <Link
              href="/work"
              className="flex-none border border-fg px-[18px] py-[11px] whitespace-nowrap text-fg hover:bg-fg hover:text-bg"
            >
              [ view work ]
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="flex-none border border-dim px-[18px] py-[11px] whitespace-nowrap text-dim hover:border-fg hover:text-hi"
            >
              [ say hello ]
            </a>
          </div>
        </main>
      </div>

      {/* Chrome fades in once the name has formed. */}
      <div
        inert={!ui}
        className="pointer-events-none absolute inset-0 transition-opacity duration-[1100ms]"
        style={{ opacity: ui ? 1 : 0 }}
      >
        <SiteHeader
          variant="home"
          className={`absolute top-0 right-0 left-0 ${ui ? "pointer-events-auto" : ""}`}
        />
        <SiteFooter className={`absolute right-0 bottom-0 left-0 ${ui ? "pointer-events-auto" : ""}`} />
      </div>
    </div>
  );
}
