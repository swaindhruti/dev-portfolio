import type { Role } from "@/data/career";
import { formatMonth } from "@/lib/format";
import { slot } from "@/lib/motion";
import { Scramble } from "../scramble";

/** `git log` style timeline of roles, with a static tech stack list alongside. */
export function CareerLog({ roles, stack }: { roles: Role[]; stack: Record<string, string[]> }) {
  return (
    <div className="flex min-h-0 flex-auto flex-col overflow-y-auto min-[820px]:overflow-hidden">
      <main
        id="main"
        className="mx-auto box-border flex w-full max-w-[1180px] flex-col px-4 sm:px-8 min-[820px]:h-full min-[820px]:flex-row min-[820px]:pb-12 min-[820px]:gap-12"
      >
        <ol
          aria-label="Roles, newest first"
          className="m-0 box-border flex min-w-0 flex-[1_1_0] list-none flex-col p-0 pt-6 pb-12 min-[820px]:pt-11 min-[820px]:overflow-y-auto min-[820px]:pb-24"
        >
          {roles.map((r, i) => {
            const head = i === 0 && /present|now/i.test(r.to);
            return (
              <li key={r.id}>
                <article className="rise grid grid-cols-[20px_minmax(0,1fr)] gap-x-5" style={slot(i + 1)}>
                  <div className="flex flex-col items-center" aria-hidden="true">
                    <span className="text-[15px] leading-5 text-hi">{i === 0 ? "@" : "*"}</span>
                    <div className="graph-line mt-2 w-px flex-1" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-2.5 pb-14">
                    <div className="flex flex-wrap gap-x-3.5 gap-y-1 leading-5 text-dim">
                      {head && <span className="text-fg">(HEAD → now)</span>}
                      <span>
                        <time dateTime={r.from}>{formatMonth(r.from)}</time> —{" "}
                        {head ? r.to : <time dateTime={r.to}>{formatMonth(r.to)}</time>}
                      </span>
                    </div>
                    <h2 className="m-0 text-[clamp(20px,2.4vw,28px)] leading-[1.2] font-medium tracking-normal text-balance">
                      <Scramble label={r.title} autoplay delay={150 + i * 160} />
                    </h2>
                    <div className="text-[13px] leading-normal text-dim">
                      @ <span className="text-fg">{r.company}</span> · {r.place} · {r.type}
                    </div>
                    <ul className="mt-1.5 mb-0 flex max-w-[64ch] list-none flex-col gap-2 p-0 text-[13px] leading-[1.65]">
                      {r.points.map((pt) => (
                        <li key={pt} className="grid grid-cols-[20px_minmax(0,1fr)]">
                          <span className="text-dim" aria-hidden="true">
                            +
                          </span>
                          <span className="text-pretty">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            );
          })}
          <li
            className="fade-in grid grid-cols-[20px_minmax(0,1fr)] gap-x-5 leading-5 text-dim"
            style={slot(roles.length + 1)}
          >
            <span className="text-center" aria-hidden="true">
              ~
            </span>
            <span>end of log</span>
          </li>
        </ol>

        <aside
          aria-label="Tech stack"
          className="box-border flex min-w-[240px] flex-[0_1_420px] flex-col gap-7 pt-4 pb-6 min-[820px]:overflow-y-auto min-[820px]:pt-11"
        >
          <div className="fade-in leading-5 text-dim" style={slot(1)}>
            $ ls ./stack
          </div>
          {Object.entries(stack).map(([group, items], gi) => (
            <section key={group} className="rise flex flex-col gap-2.5" style={slot(gi + 2)}>
              <h2 className="m-0 text-xs font-normal text-dim">{`// ${group}`}</h2>
              <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-[13px]">
                {items.map((name) => (
                  <li key={name} className="py-1 whitespace-nowrap text-fg">
                    {name}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </aside>
      </main>
    </div>
  );
}
