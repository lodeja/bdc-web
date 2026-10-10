import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SectionAnchors } from "@/components/SectionAnchors";

export default function Home() {
  return (
    <>
      {/* Absolute so hash scroll always lands at document y=0 */}
      <div id="top" className="pointer-events-none absolute top-0 left-0 h-px w-px" aria-hidden="true" />
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <SectionAnchors />
      </main>
    </>
  );
}
