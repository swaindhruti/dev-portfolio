"use client";

import { useEffect, useRef, useState } from "react";
import { RunnerEngine, type RunnerState } from "./runner-engine";

const BEST_KEY = "dn-runner-best";
const JUMP_KEYS = new Set(["Space", "ArrowUp", "KeyW"]);

const pad = (n: number) => String(n).padStart(5, "0");

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(n: number) {
  try {
    localStorage.setItem(BEST_KEY, String(n));
  } catch {
    // Storage blocked (private window etc.): the best score just isn't remembered.
  }
}

function message(state: RunnerState, score: number) {
  if (state === "over") return `crashed at ${pad(score)} · space or tap to retry`;
  if (state === "paused") return "paused · space or tap to resume";
  if (state === "idle") return "space or tap to run · hold to jump higher";
  return "";
}

export function RunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const bestRef = useRef<HTMLSpanElement>(null);
  const engineRef = useRef<RunnerEngine | null>(null);
  const [status, setStatus] = useState<{ state: RunnerState; score: number }>({ state: "idle", score: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // The score ticks every frame, so it's written straight to the DOM rather than through state.
    let best = readBest();
    const showBest = () => {
      if (bestRef.current) bestRef.current.textContent = pad(best);
    };
    showBest();

    const engine = new RunnerEngine(canvas, {
      score: (n) => {
        if (scoreRef.current) scoreRef.current.textContent = pad(n);
      },
      state: (state, score) => {
        if (state === "over" && score > best) {
          best = score;
          saveBest(best);
          showBest();
        }
        setStatus({ state, score });
      },
    });
    engineRef.current = engine;

    const ro = new ResizeObserver(([entry]) => engine.resize(entry.contentRect.width, entry.contentRect.height));
    ro.observe(canvas);
    const mo = new MutationObserver(() => engine.recolor());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const onVisibility = () => {
      if (document.hidden) engine.pause();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const text = message(status.state, status.score);

  return (
    <section aria-labelledby="side-quest" className="flex flex-col gap-3.5">
      <div className="flex items-baseline justify-between gap-4 leading-5 text-dim">
        <h2 id="side-quest" className="m-0 text-xs font-normal">
          {"// side quest"}
        </h2>
        <span aria-hidden className="tabular-nums">
          hi <span ref={bestRef}>00000</span> · <span ref={scoreRef} className="text-fg">00000</span>
        </span>
      </div>
      <div
        role="application"
        tabIndex={0}
        aria-label="Runner game: the Claude Code mascot jumps over bugs"
        aria-describedby="side-quest-status"
        className="relative h-[180px] cursor-pointer touch-manipulation border border-rule bg-bg select-none"
        onKeyDown={(e) => {
          if (!JUMP_KEYS.has(e.code)) return;
          e.preventDefault();
          if (!e.repeat) engineRef.current?.press();
        }}
        onKeyUp={(e) => {
          if (JUMP_KEYS.has(e.code)) engineRef.current?.release();
        }}
        onPointerDown={(e) => {
          if (e.button === 0) engineRef.current?.press();
        }}
        onPointerUp={() => engineRef.current?.release()}
        onPointerCancel={() => engineRef.current?.release()}
        onBlur={() => engineRef.current?.pause()}
      >
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
        <p
          id="side-quest-status"
          aria-live="polite"
          className="pointer-events-none absolute inset-x-4 top-5 m-0 text-center text-dim"
        >
          {text}
        </p>
      </div>
    </section>
  );
}
