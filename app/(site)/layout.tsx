import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/** Shared terminal chrome for every inner page; the header persists across navigations. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="screen">
      <SiteHeader className="flex-none bg-bg" />
      {children}
      <SiteFooter className="flex-none" />
    </div>
  );
}
