"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/data/work";
import { slot } from "@/lib/motion";
import { Scramble } from "../scramble";

/** `tree`-style project list with a detail pane; ↑ / ↓ browse. */
export function WorkBrowser({ projects }: { projects: Project[] }) {
  const [sel, setSel] = useState(0);
  const n = projects.length;
  const cur = projects[sel];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!n || e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSel((s) => (s + 1) % n);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSel((s) => (s - 1 + n) % n);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n]);

  return (
    <div className="flex flex-wrap items-start gap-x-[72px] gap-y-14">
      <div className="flex min-w-0 flex-[1_1_420px] flex-col">
        <div className="fade-in pb-2.5 leading-5 text-hi" style={slot(1)}>
          ~/work
        </div>
        <ul className="m-0 list-none p-0">
          {projects.map((p, i) => {
            const active = i === sel;
            return (
              <li key={p.id} className="rise" style={slot(i + 2)}>
                <button
                  type="button"
                  onClick={() => setSel(i)}
                  aria-pressed={active}
                  aria-controls="work-detail"
                  className="grid w-full cursor-pointer grid-cols-[4ch_3ch_minmax(0,1fr)_auto] items-baseline gap-x-3.5 py-3.5 text-left transition-colors duration-150 max-[480px]:grid-cols-[3ch_minmax(0,1fr)_auto]"
                  style={{ color: active ? "var(--fg)" : "var(--dim)" }}
                >
                  <span className="whitespace-pre text-faint max-[480px]:hidden" aria-hidden="true">
                    {i === n - 1 ? "└──" : "├──"}
                  </span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex min-w-0 flex-col gap-1.5">
                    <span
                      className="text-[clamp(16px,1.9vw,22px)] leading-[1.25] font-medium transition-colors duration-150"
                      style={{ color: active ? "var(--hi)" : "var(--fg)" }}
                    >
                      {p.name}
                    </span>
                    <span className="text-[13px] leading-[1.55] text-pretty">{p.summary}</span>
                  </span>
                  <span className="flex flex-col items-end gap-1.5 whitespace-nowrap">
                    <span>{p.year}</span>
                    <span>{p.kind}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {cur && (
        <section
          id="work-detail"
          aria-live="polite"
          className="rise sticky top-7 flex min-w-0 flex-[1_1_440px] flex-col gap-5"
          style={slot(2)}
        >
          <div className="flex justify-between gap-4 leading-5 text-dim">
            <span>$ open ./{cur.name.replace(/\s+/g, "-")}</span>
            <span className="max-[640px]:hidden">↑ ↓ to browse</span>
          </div>
          <h2 className="m-0 text-[clamp(22px,2.6vw,32px)] leading-[1.2] font-medium tracking-[-0.01em] text-balance">
            <Scramble label={cur.name} interval={24} autoplay />
          </h2>
          {/* Keyed so the copy re-enters each time the selection changes. */}
          <p key={cur.id} className="swap m-0 max-w-[60ch] text-[15px] leading-[1.75] text-pretty text-dim">
            {cur.desc}
          </p>
          <ul key={`${cur.id}-stack`} aria-label="Stack" className="swap m-0 flex list-none flex-wrap gap-x-3.5 gap-y-1 p-0">
            {cur.stack.map((t) => (
              <li key={t} className="py-1 whitespace-nowrap text-fg">
                [ {t} ]
              </li>
            ))}
          </ul>
          {(cur.live || cur.source) && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-dim">
              {cur.live && (
                <a href={cur.live} target="_blank" rel="noopener noreferrer" className="py-1.5 whitespace-nowrap text-fg">
                  live ↗<span className="sr-only"> — {cur.name}</span>
                </a>
              )}
              {cur.source && (
                <a href={cur.source} target="_blank" rel="noopener noreferrer" className="py-1.5 whitespace-nowrap text-fg">
                  source ↗<span className="sr-only"> — {cur.name}</span>
                </a>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
