"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ComponentProps } from "react";

const CHARS = "!<>-_/\\[]{}=+*^?#%@&$;:~01";

type Options = {
  /** ms between frames */
  interval?: number;
  /** Play when mounted and whenever `label` changes. */
  autoplay?: boolean;
  /** Delay before an autoplay run, in ms. */
  delay?: number;
};

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Decode-style text effect: characters resolve left to right out of random glyphs.
 * Returns the text to display and a `play` trigger.
 */
export function useScramble(label: string, { interval = 30, autoplay = false, delay = 0 }: Options = {}) {
  const [frame, setFrame] = useState<{ label: string; text: string } | null>(null);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  const play = useCallback(() => {
    clearInterval(timer.current);
    if (prefersReducedMotion()) return;
    let k = 0;
    timer.current = setInterval(() => {
      k++;
      if (k / 2 >= label.length) {
        clearInterval(timer.current);
        setFrame(null);
        return;
      }
      const text = label
        .split("")
        .map((c, j) => (j < k / 2 || c === " " || c === "." ? c : CHARS[(Math.random() * CHARS.length) | 0]))
        .join("");
      setFrame({ label, text });
    }, interval);
  }, [label, interval]);

  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(play, delay);
    return () => clearTimeout(t);
  }, [autoplay, delay, play]);

  useEffect(() => () => clearInterval(timer.current), []);

  return [frame && frame.label === label ? frame.text : label, play] as const;
}

/** Screen readers and crawlers get the real label; sighted users see the scramble. */
export function ScrambleText({ label, text }: { label: string; text: string }) {
  return (
    <>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">{text}</span>
    </>
  );
}

export function Scramble({ label, ...options }: { label: string } & Options) {
  const [text] = useScramble(label, options);
  return <ScrambleText label={label} text={text} />;
}

type ScrambleLinkProps = Omit<ComponentProps<"a">, "href" | "children"> & {
  href: string;
  label: string;
  interval?: number;
  before?: React.ReactNode;
  after?: React.ReactNode;
};

/**
 * Navigations swap DOM under a still cursor, and browsers then fire synthetic "enter" events at
 * whatever is now underneath. Hover scrambles are muted for a moment after a navigation so links
 * (notably the logo) don't scramble on their own mid-transition.
 */
let quietUntil = 0;
export function quietScramble(ms: number) {
  quietUntil = Math.max(quietUntil, performance.now() + ms);
}

/**
 * A link whose label scrambles when the pointer actually moves onto it, or on keyboard focus.
 * External and mailto hrefs render a plain anchor.
 */
export function ScrambleLink({
  href,
  label,
  interval,
  before,
  after,
  onPointerMove,
  onPointerLeave,
  onFocus,
  onClick,
  ...rest
}: ScrambleLinkProps) {
  const [text, play] = useScramble(label, { interval });
  // True once this hover has been "spent"; reset when the pointer leaves.
  const hovered = useRef(false);
  const props = {
    ...rest,
    // Triggered by pointermove rather than mouseenter: layout changes can fire enter events at a
    // still cursor, but a move needs the pointer to actually move.
    onPointerMove: (e: React.PointerEvent<HTMLAnchorElement>) => {
      if (!hovered.current) {
        hovered.current = true;
        if (performance.now() >= quietUntil) play();
      }
      onPointerMove?.(e);
    },
    onPointerLeave: (e: React.PointerEvent<HTMLAnchorElement>) => {
      hovered.current = false;
      onPointerLeave?.(e);
    },
    // Mouse clicks focus links in some browsers; only keyboard focus should scramble.
    onFocus: (e: React.FocusEvent<HTMLAnchorElement>) => {
      if (e.currentTarget.matches(":focus-visible")) play();
      onFocus?.(e);
    },
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      hovered.current = true;
      quietScramble(1200);
      onClick?.(e);
    },
    children: (
      <>
        {before}
        <span>
          <ScrambleText label={label} text={text} />
        </span>
        {after}
      </>
    ),
  };

  if (href.startsWith("mailto:")) return <a href={href} {...props} />;
  if (/^https?:/.test(href)) return <a href={href} target="_blank" rel="noopener noreferrer me" {...props} />;
  return <Link href={href} {...props} />;
}
