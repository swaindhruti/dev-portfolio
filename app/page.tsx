import Hero from "@/components/Hero";
import About from "@/components/About";
import Career from "@/components/Career";
import Shows from "@/components/Shows";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen">
      <Hero />
      <About />
      <Career />
      <Shows />
      <Footer />
    </main>
  );
}
