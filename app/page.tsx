import type { Metadata } from "next";
import { Big_Shoulders } from "next/font/google";
import { HomeScreen } from "@/components/home/home-screen";
import { site } from "@/data/site";
import { mono } from "@/lib/fonts";

// Only the home canvas draws the name, so this face is scoped to this route.
// next/font has no fallback metrics for Big Shoulders, so skip the auto-generated
// size-adjusted fallback (that's what warned) and name a plain fallback stack instead.
const display = Big_Shoulders({
  subsets: ["latin"],
  weight: "900",
  display: "block",
  adjustFontFallback: false,
  fallback: ["Arial Black", "sans-serif"],
});

export const metadata: Metadata = {
  title: { absolute: site.name },
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className={display.className}>
      <HomeScreen monoFamily={mono.style.fontFamily} nameFamily={display.style.fontFamily} />
    </div>
  );
}
