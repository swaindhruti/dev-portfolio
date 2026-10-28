"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Memory } from "@/data/memories";
import { formatDate } from "@/lib/format";
import { slot } from "@/lib/motion";
import { Scramble } from "../scramble";

type Layout = {
  W: number; H: number; bw: number;
  /** Orbit centre relative to the stage centre (puts it at the centre of the viewport). */
  ox: number; oy: number;
  rx: number; ry: number;
  selS: number; selX: number; selY: number;
};
type Pose = { x: number; y: number; s: number; o: number; t?: boolean };

const BASE_SPIN = 0.12; // rad/s while idle
const ROUNDNESS = 0.6; // ry / rx — a ring seen at an angle, not a flat capsule
const EDGE = 8; // px kept clear at the stage's top and bottom
const ENTRY_STAGGER = 70; // ms between photos on first reveal
const ENTRY_SETTLE = 1100; // ms each photo takes to glide into its slot
const ENTRY_SWEEP = 1.4; // rad of orbit each photo travels on the way in

const easeOut = (u: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, u)), 3);

/** Drag-to-spin ring of photos. Positions are written straight to the DOM every frame. */
export function MemoryCarousel({ memories }: { memories: Memory[] }) {
  const [sel, setSel] = useState<string | null>(null);
  const [hov, setHov] = useState<string | null>(null);
  const [narrow, setNarrow] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const els = useRef(new Map<string, HTMLElement>());
  const poses = useRef(new Map<string, Pose>());
  const motion = useRef({ ang: 0, vel: BASE_SPIN, hovering: false, moved: false, drag: null as null | { x: number; x0: number; t: number } });
  const layout = useRef<Layout | null>(null);
  const selRef = useRef<string | null>(null);

  useEffect(() => {
    selRef.current = sel;
  }, [sel]);

  const frame = (m: Memory) => String(memories.length - memories.indexOf(m)).padStart(2, "0") + "A";
  const cur = sel ? memories.find((m) => m.id === sel) ?? null : null;

  const open = useCallback(
    (id: string) => {
      if (motion.current.moved) {
        motion.current.moved = false;
        return;
      }
      setSel(id);
      setHov(null);
      motion.current.hovering = false;
    },
    [],
  );
  const close = useCallback(() => setSel(null), []);
  const step = useCallback(
    (d: number) =>
      setSel((s) => {
        const i = memories.findIndex((m) => m.id === s);
        if (i < 0 || !memories.length) return s;
        return memories[(i + d + memories.length) % memories.length].id;
      }),
    [memories],
  );

  // Measure the stage and derive ring radii + where the selected photo parks.
  useEffect(() => {
    const st = stageRef.current;
    if (!st) return;
    const measure = () => {
      const W = st.clientWidth;
      const H = st.clientHeight;
      const isNarrow = W < 820;
      // Phones get smaller cards so the ring still reads as a ring in ~340px.
      const phone = W < 560;
      const bw = Math.round(phone ? Math.max(88, W * 0.28) : Math.max(130, Math.min(220, W * 0.17)));
      // Phones are tall and narrow: tip the ring further towards the viewer so the cards spread out.
      const round = phone ? 0.9 : ROUNDNESS;

      // Centre the orbit on the viewport, not the stage (the stage sits below the header and
      // command line, so its own centre is lower than the screen's).
      const r = st.getBoundingClientRect();
      const cardH = bw * 0.75 + 24; // photo + caption at scale 1
      const minCy = EDGE + (cardH * 0.58) / 2 + 40; // leave room for back (scaled) cards
      const maxCy = H - EDGE - cardH / 2 - 40; // and front cards
      const cy = Math.min(maxCy, Math.max(minCy, window.innerHeight / 2 - r.top));
      const cx = window.innerWidth / 2 - r.left;
      const ox = cx - W / 2;
      const oy = cy - H / 2;

      // As round as the height allows: back cards (scale .58) above, front cards (scale 1) below.
      let rx = Math.min(W / 2 - bw * 0.45 - Math.abs(ox), 540);
      const ryRoom = Math.max(40, Math.min(cy - EDGE - (cardH * 0.58) / 2, H - EDGE - cardH / 2 - cy));
      const ry = Math.min(rx * round, ryRoom);
      // Height-limited: pull the sides in rather than flattening the ring.
      rx = Math.max(Math.min(rx, bw * 1.4), Math.min(rx, ry / round));
      const [selS, selX, selY] = isNarrow
        ? [Math.min(W * 0.92, (H * 0.5) / 0.75) / bw, 0, -H * 0.2]
        : [Math.min(W * 0.44, 560, (H * 0.78) / 0.75) / bw, -W * 0.21, 0];
      layout.current = { W, H, bw, ox, oy, rx, ry, selS, selX, selY };
      const label = labelRef.current;
      if (label) {
        label.style.left = `${W / 2 + ox}px`;
        label.style.top = `${H / 2 + oy}px`;
      }
      setNarrow(isNarrow);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(st);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Animation loop.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let born = 0; // first frame with a layout; the entry sweep is timed from here
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const L = layout.current;
      if (!L) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!born) born = now;
      const age = now - born;
      const M = motion.current;
      const s = selRef.current;
      const N = memories.length || 1;
      const base = M.hovering || s ? 0 : BASE_SPIN;
      if (!M.drag) {
        M.vel += (base - M.vel) * Math.min(1, dt * 2.2);
        M.ang += M.vel * dt;
      }
      memories.forEach((m, i) => {
        const el = els.current.get(m.id);
        if (!el) return;
        // Entry: photos are dealt in one by one, each gliding along the orbit into its slot.
        const local = age - i * ENTRY_STAGGER;
        if (local < 0) return;
        const sweep = ENTRY_SWEEP * (1 - easeOut(local / ENTRY_SETTLE));
        let x: number, y: number, sc: number, o: number, z: number;
        if (s === m.id) {
          x = L.selX;
          y = L.selY;
          sc = L.selS;
          o = 1;
          z = 1000;
        } else {
          const th = M.ang + (i * Math.PI * 2) / N - sweep;
          const sn = Math.sin(th);
          const dp = (sn + 1) / 2;
          x = L.ox + Math.cos(th) * L.rx;
          y = L.oy + sn * L.ry;
          sc = 0.58 + 0.42 * dp;
          o = s ? 0.04 : 0.28 + 0.72 * dp;
          z = Math.round(dp * 100);
        }
        let c = poses.current.get(m.id);
        if (!c) {
          c = { x, y, s: sc * 0.6, o: 0 };
          poses.current.set(m.id, c);
        }
        const k = Math.min(1, dt * (s === m.id || c.t ? 7 : 14));
        c.x += (x - c.x) * k;
        c.y += (y - c.y) * k;
        c.s += (sc - c.s) * k;
        c.o += (o - c.o) * k;
        c.t = s === m.id;
        const w = `${Math.round(L.bw * Math.max(1, c.s))}px`;
        if (el.style.width !== w) el.style.width = w;
        el.style.transform = `translate(-50%, -50%) translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px) scale(${Math.min(1, c.s).toFixed(4)})`;
        el.style.opacity = c.o.toFixed(3);
        el.style.zIndex = String(z);
      });
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [memories]);

  // Drag + keyboard.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const M = motion.current;
      const d = M.drag;
      if (!d) return;
      const dx = e.clientX - d.x;
      const now = performance.now();
      if (Math.abs(e.clientX - d.x0) > 5) M.moved = true;
      const k = 1 / Math.max(300, layout.current?.rx ?? 400);
      M.ang += dx * k;
      M.vel = (dx * k) / Math.max(0.008, (now - d.t) / 1000);
      d.x = e.clientX;
      d.t = now;
    };
    const onUp = () => {
      if (!motion.current.drag) return;
      motion.current.drag = null;
      if (stageRef.current) stageRef.current.style.cursor = "grab";
    };
    const onKey = (e: KeyboardEvent) => {
      if (!selRef.current) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("keydown", onKey);
    };
  }, [close, step]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (selRef.current || e.button > 0) return;
    motion.current.drag = { x: e.clientX, x0: e.clientX, t: performance.now() };
    motion.current.moved = false;
    if (stageRef.current) stageRef.current.style.cursor = "grabbing";
  };

  // Stable for the component's lifetime, so each figure's ref callback never changes identity.
  // (A fresh ref callback per render makes React detach + re-attach every photo on every state
  // change, wiping its pose so the whole ring snaps back — the bug this replaced.)
  const register = useCallback((id: string, el: HTMLElement | null) => {
    if (el) els.current.set(id, el);
    else {
      els.current.delete(id);
      poses.current.delete(id);
    }
  }, []);

  const hoverStart = useCallback((id: string) => {
    if (selRef.current) return;
    motion.current.hovering = true;
    setHov(id);
  }, []);
  const hoverEnd = useCallback((id: string) => {
    motion.current.hovering = false;
    setHov((h) => (h === id ? null : h));
  }, []);

  const labelOpacity = cur ? 0 : 1;
  const controls = (compact: boolean) => (
    <div className={`flex flex-wrap text-dim ${compact ? "gap-x-5 gap-y-2" : "gap-x-[22px] gap-y-2 pt-[18px]"}`}>
      <button type="button" onClick={() => step(-1)} className={`cursor-pointer whitespace-nowrap hover:text-hi ${compact ? "py-2.5" : "py-1.5"}`}>
        {compact ? "[ ← ]" : "[ ← prev ]"}
        <span className="sr-only"> previous memory</span>
      </button>
      <button type="button" onClick={() => step(1)} className={`cursor-pointer whitespace-nowrap hover:text-hi ${compact ? "py-2.5" : "py-1.5"}`}>
        {compact ? "[ → ]" : "[ next → ]"}
        <span className="sr-only"> next memory</span>
      </button>
      <button type="button" onClick={close} className={`cursor-pointer whitespace-nowrap hover:text-hi ${compact ? "py-2.5" : "py-1.5"}`}>
        [ close ]
      </button>
    </div>
  );

  return (
    <div
      ref={stageRef}
      onPointerDown={onPointerDown}
      className="relative min-h-0 flex-auto cursor-grab touch-none select-none"
    >
      <div
        ref={labelRef}
        style={slot(3, { opacity: labelOpacity })}
        className="fade-in pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center leading-5 text-dim transition-opacity duration-[400ms]"
      >
        <span className="text-[13px] text-hi">~/memories</span>
        <span className="whitespace-nowrap">
          drag to spin · <span className="pointer-coarse:hidden">click</span>
          <span className="hidden pointer-coarse:inline">tap</span> to open
        </span>
      </div>

      {cur && <div onClick={close} aria-hidden="true" className="absolute inset-0 z-[900] cursor-default" />}

      {memories.map((m) => (
        <MemoryFigure
          key={m.id}
          memory={m}
          frame={frame(m)}
          on={hov === m.id || sel === m.id}
          selected={sel === m.id}
          dimCaption={!!cur}
          register={register}
          onOpen={open}
          onHoverStart={hoverStart}
          onHoverEnd={hoverEnd}
          onFocusIn={setHov}
        />
      ))}

      {/* Keyed by memory so prev / next replays the entry stagger. */}
      {cur && !narrow && (
        <section
          key={cur.id}
          aria-live="polite"
          className="rise-now absolute top-1/2 right-0 left-[56%] z-[1001] flex max-w-[400px] -translate-y-1/2 flex-col gap-[18px]"
        >
          <div className="rise flex flex-wrap gap-x-3.5 gap-y-1 leading-5 text-dim" style={slot(0)}>
            <span className="whitespace-nowrap">frame {frame(cur)}</span>
            <time dateTime={cur.date} className="whitespace-nowrap">
              {formatDate(cur.date)}
            </time>
          </div>
          <div className="rise flex flex-wrap gap-x-3.5 gap-y-1 leading-5 text-dim" style={slot(1)}>
            <span className="whitespace-nowrap text-hi">[ {cur.type} ]</span>
            <span className="whitespace-nowrap">{cur.place}</span>
          </div>
          <h2
            className="rise m-0 text-[clamp(22px,2.6vw,32px)] leading-[1.2] font-medium tracking-[-0.01em] text-balance"
            style={slot(2)}
          >
            <Scramble label={cur.title} interval={22} autoplay />
          </h2>
          <p className="rise m-0 text-[15px] leading-[1.75] text-pretty text-dim" style={slot(3)}>
            {cur.note}
          </p>
          <div className="rise" style={slot(4)}>
            {controls(false)}
          </div>
        </section>
      )}

      {cur && narrow && (
        <section
          key={cur.id}
          aria-live="polite"
          className="rise-now absolute right-0 bottom-0 left-0 z-[1001] flex flex-col gap-3"
        >
          <div className="rise flex flex-wrap gap-x-3.5 gap-y-1 leading-5 text-dim" style={slot(0)}>
            <span className="whitespace-nowrap text-hi">[ {cur.type} ]</span>
            <span className="whitespace-nowrap">{cur.place}</span>
            <time dateTime={cur.date} className="whitespace-nowrap">
              {formatDate(cur.date)}
            </time>
          </div>
          <h2 className="rise m-0 text-xl leading-[1.25] font-medium text-balance" style={slot(1)}>
            <Scramble label={cur.title} interval={22} autoplay />
          </h2>
          <p className="rise m-0 text-[13px] leading-[1.65] text-pretty text-dim" style={slot(2)}>
            {cur.note}
          </p>
          <div className="rise" style={slot(3)}>
            {controls(true)}
          </div>
        </section>
      )}
    </div>
  );
}

type FigureProps = {
  memory: Memory;
  frame: string;
  on: boolean;
  selected: boolean;
  dimCaption: boolean;
  register: (id: string, el: HTMLElement | null) => void;
  onOpen: (id: string) => void;
  onHoverStart: (id: string) => void;
  onHoverEnd: (id: string) => void;
  onFocusIn: (id: string | null) => void;
};

/** One photo on the ring. Position, scale and opacity are driven by the parent's rAF loop. */
function MemoryFigure({ memory: m, frame, on, selected, dimCaption, register, onOpen, onHoverStart, onHoverEnd, onFocusIn }: FigureProps) {
  const ref = useCallback((el: HTMLElement | null) => register(m.id, el), [m.id, register]);
  return (
    <figure
      ref={ref}
      onMouseEnter={() => onHoverStart(m.id)}
      onMouseLeave={() => onHoverEnd(m.id)}
      className="absolute top-1/2 left-1/2 m-0 flex w-[200px] flex-col gap-2 opacity-0 will-change-transform"
    >
      <div className="photo relative aspect-[4/3] w-full overflow-hidden bg-well" data-on={on}>
        {m.image ? (
          <Image
            src={m.image}
            alt={m.title}
            fill
            sizes="(max-width: 820px) 92vw, 560px"
            className="pointer-events-none object-cover"
            draggable={false}
          />
        ) : (
          // Empty slot, styled like the design's: soft grey tile, dashed frame, image glyph.
          // These need to read clearly, or the ring's depth and orbit disappear on black.
          <div className="absolute inset-0 bg-[rgba(127,127,127,0.08)] text-fg" aria-hidden="true">
            <div className="absolute inset-0 border-[1.5px] border-dashed border-current opacity-35" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-3 text-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-7 opacity-45"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <span className="opacity-75">{formatDate(m.date)}</span>
            </div>
          </div>
        )}
        {!selected && (
          <button
            type="button"
            onClick={() => onOpen(m.id)}
            onFocus={() => onFocusIn(m.id)}
            onBlur={() => onFocusIn(null)}
            className="absolute inset-0 cursor-pointer"
          >
            <span className="sr-only">Open memory: {m.title}</span>
          </button>
        )}
      </div>
      <figcaption
        className="flex justify-between gap-2 overflow-hidden leading-4 whitespace-nowrap text-dim transition-opacity duration-300"
        style={{ opacity: dimCaption ? 0 : 1 }}
      >
        <span>{frame}</span>
        <span className="text-fg">{m.type}</span>
      </figcaption>
    </figure>
  );
}
