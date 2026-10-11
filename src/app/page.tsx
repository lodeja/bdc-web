import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import { Services } from "@/components/sections/Services";
import { Benefits } from "@/components/sections/Benefits";
import { Process } from "@/components/sections/Process";
import { Comparison } from "@/components/sections/Comparison";
import { Results } from "@/components/sections/Results";
import { FAQ } from "@/components/sections/FAQ";
import { Pioneers } from "@/components/sections/Pioneers";
import { Contact } from "@/components/sections/Contact";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";

export default function Home() {
  return (
    <>
      {/* Absolute so hash scroll always lands at document y=0 */}
      <div
        id="top"
        className="pointer-events-none absolute top-0 left-0 h-px w-px"
        aria-hidden="true"
      />
      <LocalBusinessJsonLd />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Hero />
        <Services />
        <Benefits />
        <Process />
        <Comparison />
        <Results />
        <FAQ />
        <Pioneers />
        <Contact />
      </main>
      <Footer />
      <StickyQuote />
    </>
  );
}
