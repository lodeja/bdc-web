import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Services } from "@/components/sections/Services";
import { Industrial } from "@/components/sections/Industrial";
import { Benefits } from "@/components/sections/Benefits";
import { Process } from "@/components/sections/Process";
import { Results } from "@/components/sections/Results";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      {/* Absolute so hash scroll always lands at document y=0 */}
      <div
        id="top"
        className="pointer-events-none absolute top-0 left-0 h-px w-px"
        aria-hidden="true"
      />
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <Services />
        <Industrial />
        <Benefits />
        <Process />
        <Results />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
