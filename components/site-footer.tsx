import { site } from "@/data/site";
import { ScrambleLink } from "./scramble";
import { ThemeToggle } from "./theme-toggle";

export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-5 text-dim sm:px-8 sm:py-[22px] ${className}`}
    >
      <ul aria-label="Elsewhere" className="m-0 flex list-none gap-[22px] p-0">
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
