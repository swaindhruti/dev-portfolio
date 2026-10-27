import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { slot } from "@/lib/motion";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="screen">
      <SiteHeader className="flex-none bg-bg" />
      <main id="main" className="mx-auto box-border flex w-full max-w-[1180px] flex-auto flex-col justify-center gap-6 px-4 sm:px-8">
        <p className="rise m-0 leading-5 text-dim">$ cd ./this-page</p>
        <h1 className="rise m-0 text-[clamp(22px,2.6vw,32px)] leading-[1.2] font-medium" style={slot(1)}>
          no such file or directory
        </h1>
        <p className="rise m-0 text-[13px] leading-[1.65] text-dim" style={slot(2)}>
          exit code 404 — the page moved, or never existed.</p>
        <Link
          href="/#home"
          style={slot(3)}
          className="rise w-fit border border-fg px-[18px] py-[11px] text-fg hover:bg-fg hover:text-bg">
          [ cd ~ ]
        </Link>
      </main>
      <SiteFooter className="flex-none" />
    </div>
  );
}
