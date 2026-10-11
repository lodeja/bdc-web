import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { StickyQuote } from "./StickyQuote";

export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 bg-jdc-fog outline-none">
        {children}
      </main>
      <Footer />
      <StickyQuote />
    </>
  );
}
