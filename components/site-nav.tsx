"use client";

import { usePathname } from "next/navigation";
import { nav } from "@/data/site";
import { ScrambleLink } from "./scramble";

type Variant = "site" | "home";

export function SiteNav({ variant = "site", static: isStatic = false }: { variant?: Variant; static?: boolean }) {
  return isStatic ? <NavList variant={variant} pathname={null} /> : <ActiveNav variant={variant} />;
}

function ActiveNav({ variant }: { variant: Variant }) {
  const pathname = usePathname();
  return <NavList variant={variant} pathname={pathname} />;
}

function NavList({ variant, pathname }: { variant: Variant; pathname: string | null }) {
  return (
    <nav aria-label="Primary">
      <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-0 p-0 sm:gap-x-7 sm:gap-y-3">
        {nav.map((item) => {
          const active = !!pathname && (pathname === item.href || pathname.startsWith(`${item.href}/`));
          const tone = variant === "home" ? "" : active ? "text-hi" : "text-dim hover:text-hi";
          return (
            <li key={item.href}>
              <ScrambleLink
                href={item.href}
                label={item.label}
                aria-current={active ? "page" : undefined}
                className={`flex gap-2 whitespace-nowrap py-1.5 ${tone}`}
                before={<span className={variant === "home" ? "text-dim" : undefined}>{item.idx}</span>}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
