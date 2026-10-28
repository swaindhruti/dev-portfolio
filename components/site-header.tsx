import { Suspense } from "react";
import { site } from "@/data/site";
import { ScrambleLink } from "./scramble";
import { SiteNav } from "./site-nav";

export function SiteHeader({ variant = "site", className = "" }: { variant?: "site" | "home"; className?: string }) {
  // Deliberately no view-transition-name: unnamed, the header keeps rendering live during page
  // transitions instead of being swapped for a (slightly dimmer) bitmap snapshot.
  return (
    <header
      className={`z-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-4 sm:gap-y-3 sm:px-8 sm:py-[26px] ${className}`}
    >
      <ScrambleLink
        href="/#home"
        label={site.domain}
        aria-label={`${site.domain} — home`}
        className="whitespace-nowrap py-1.5 text-[13px] font-medium tracking-[0.04em]"
      />
      {/* usePathname can suspend under Cache Components; keep the shell prerendered. */}
      <Suspense fallback={<SiteNav variant={variant} static />}>
        <SiteNav variant={variant} />
      </Suspense>
    </header>
  );
}
