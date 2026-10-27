import type { Metadata } from "next";
import { RunnerGame } from "@/components/about/runner-game";
import { Clock } from "@/components/clock";
import { CommandBar } from "@/components/command-bar";
import { JsonLd } from "@/components/json-ld";
import { PageEnter } from "@/components/page-enter";
import { about, absoluteUrl, site } from "@/data/site";
import { slot } from "@/lib/motion";
import { ogImage } from "@/lib/og";

const description = `${about.lead} ${about.body}`;

export const metadata: Metadata = {
  title: "about",
  description,
  alternates: { canonical: "/about" },
  openGraph: { type: "profile", url: "/about", title: `About · ${site.name}`, description, images: [ogImage] },
};

const label = "leading-5 text-dim";

export default function AboutPage() {
  return (
    <PageEnter>
      <CommandBar aside={<Clock timeZone={site.timeZone} suffix="IST" />}>$ whoami</CommandBar>

      <div className="min-h-0 flex-auto overflow-x-hidden overflow-y-auto">
        <main id="main" className="mx-auto box-border max-w-[1180px] px-4 pt-7 pb-6 sm:px-8">
          <div className="flex flex-wrap items-start gap-x-[72px] gap-y-14">
            <article className="flex min-w-0 flex-[1_1_540px] flex-col gap-11">
              <section className="rise flex flex-col gap-3" style={slot(1)}>
                <div className={label}>{"// name"}</div>
                <h1 className="m-0 text-[clamp(20px,2.4vw,28px)] leading-[1.2] font-medium tracking-normal text-balance">
                  {about.headline}
                </h1>
              </section>

              <section className="rise flex max-w-[72ch] flex-col gap-3.5" style={slot(2)}>
                <div className={label}>{"// description"}</div>
                <p className="m-0 text-[15px] leading-[1.75] text-pretty">{about.lead}</p>
                <p className="m-0 text-[13px] leading-[1.65] text-pretty text-dim">{about.body}</p>
              </section>

              <div className="rise grid grid-cols-1 items-start gap-10 min-[480px]:grid-cols-2" style={slot(3)}>
                <section className="flex flex-col gap-3.5">
                  <h2 className={`m-0 text-xs font-normal ${label}`}>{"// hobbies"}</h2>
                  <ul className="m-0 flex list-none flex-wrap gap-x-[18px] gap-y-1.5 p-0 text-[13px] leading-[1.6]">
                    {about.hobbies.map((h) => (
                      <li key={h} className="whitespace-nowrap">
                        [ {h} ]
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="flex flex-col gap-3.5">
                  <h2 className={`m-0 text-xs font-normal ${label}`}>{"// currently reading"}</h2>
                  <p className="m-0 flex flex-col gap-1.5">
                    <cite className="text-[13px] leading-[1.6] text-balance not-italic">{about.reading.title}</cite>
                    <span className="text-[13px] leading-normal text-dim">{about.reading.author}</span>
                  </p>
                </section>
              </div>
            </article>

            <aside
              aria-label="Environment"
              className="sticky top-7 flex min-w-[240px] flex-[0_1_300px] flex-col gap-7"
            >
              <div className={`fade-in ${label}`} style={slot(2)}>
                $ env
              </div>
              <dl className="m-0 flex flex-col gap-7">
                {about.env.map((row, i) => (
                  <div key={row.label} className="rise flex flex-col gap-2.5" style={slot(i + 3)}>
                    <dt className="text-dim">{`// ${row.label}`}</dt>
                    <dd className="m-0 text-[13px]">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>

          <div className="rise pt-16" style={slot(7)}>
            <RunnerGame />
          </div>
        </main>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: absoluteUrl("/about"),
          name: `About ${site.name}`,
          mainEntity: { "@id": `${site.url}/#person` },
        }}
      />
    </PageEnter>
  );
}
