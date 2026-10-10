import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SectionAnchors } from "@/components/SectionAnchors";

export default function Home() {
  return (
    <>
      <div id="top" />
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <SectionAnchors />
      </main>
    </>
  );
}
