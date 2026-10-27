"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/data/work";
import { slot } from "@/lib/motion";
import { Scramble } from "../scramble";

/** Show a URL the way you'd type it: no scheme, no "www.", no trailing slash. */
const prettyUrl = (href: string) => href.replace(/^[a-z]+:\/\//i, "").replace(/^www\./, "").replace(/\/$/, "");

/**
 * `tree`-style project list with a detail pane; ↑ / ↓ browse. On wide screens the list scrolls on
 * its own and the detail pane stays fixed beside it.
 */
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

  // Keep the selected row in view when browsing with the keyboard.
  const curId = cur?.id;
  useEffect(() => {
    if (curId) document.getElementById(`work-${curId}`)?.scrollIntoView({ block: "nearest" });
  }, [curId]);

  return (
    <div className="flex flex-col gap-14 min-[960px]:min-h-0 min-[960px]:flex-auto min-[960px]:flex-row min-[960px]:gap-[72px]">
      <div className="flex min-w-0 flex-col pt-11 min-[960px]:flex-[1_1_0] min-[960px]:overflow-y-auto min-[960px]:pb-24">
        <ul className="m-0 list-none p-0">
          {projects.map((p, i) => {
            const active = i === sel;
            return (
              <li key={p.id} id={`work-${p.id}`} className="rise" style={slot(i + 2)}>
                <button
                  type="button"
                  onClick={() => setSel(i)}
                  aria-pressed={active}
                  aria-controls="work-detail"
                  className="grid w-full cursor-pointer grid-cols-[4ch_3ch_minmax(0,1fr)_auto] items-baseline gap-x-3.5 py-2 text-left transition-colors duration-150 max-[480px]:grid-cols-[3ch_minmax(0,1fr)_auto]"
                  style={{ color: active ? "var(--fg)" : "var(--dim)" }}
                >
                  <span className="whitespace-pre text-faint max-[480px]:hidden" aria-hidden="true">
                    {i === n - 1 ? "└──" : "├──"}
                  </span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span
                      className="text-[clamp(16px,1.9vw,22px)] leading-[1.25] font-medium transition-colors duration-150"
                      style={{ color: active ? "var(--hi)" : "var(--fg)" }}
                    >
                      {p.name}
                    </span>
                    <span className="text-[13px] leading-[1.55] text-pretty">{p.summary}</span>
                  </span>
                  <span className="flex flex-col items-end gap-1 whitespace-nowrap">
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
          className="rise flex min-w-0 flex-col gap-5 pb-14 min-[960px]:flex-[1_1_0] min-[960px]:overflow-y-auto min-[960px]:pt-11 min-[960px]:pb-24"
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
          {cur.links.length > 0 && (
            <ul key={`${cur.id}-links`} aria-label="Links" className="swap m-0 flex list-none flex-col gap-1 p-0 pt-2">
              {cur.links.map((l) => (
                <li key={l.href} className="grid grid-cols-[11ch_minmax(0,1fr)] items-baseline gap-x-3.5">
                  <span className="text-dim">{l.label}</span>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1 text-[13px] text-fg [overflow-wrap:anywhere]"
                  >
                    {prettyUrl(l.href)} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
