import { site } from "@/data/site";
import { ScrambleLink } from "./scramble";
import { ThemeToggle } from "./theme-toggle";

export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3.5 text-dim sm:gap-x-6 sm:gap-y-3 sm:px-8 sm:py-[22px] ${className}`}
    >
      <ul aria-label="Elsewhere" className="m-0 flex list-none gap-4 p-0 sm:gap-[22px]">
        {site.socials.map((s) => (
          <li key={s.label}>
            <ScrambleLink
              href={s.href}
              label={s.label}
              className="flex whitespace-nowrap py-1.5 hover:text-hi"
              after={<span aria-hidden="true">&nbsp;↗</span>}
            />
          </li>
        ))}
      </ul>
      <ThemeToggle />
    </footer>
  );
}
