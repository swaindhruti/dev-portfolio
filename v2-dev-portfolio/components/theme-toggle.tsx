"use client";

import { THEME_KEY } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    const apply = () => {
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {}
    };

    // Crossfade the whole page where supported; otherwise switch instantly.
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }
    root.setAttribute("data-theme-switching", "");
    document.startViewTransition(apply).finished.finally(() => root.removeAttribute("data-theme-switching"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`cursor-pointer whitespace-nowrap py-1.5 hover:text-hi ${className}`}
    >
      {/* The visible label is picked by CSS from html[data-theme]. */}
      <span className="theme-label-light">[ light mode ]</span>
      <span className="theme-label-dark">[ dark mode ]</span>
    </button>
  );
}
