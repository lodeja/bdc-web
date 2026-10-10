import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Belgian Drone Cleaning (BDC) | Professionele drone-reiniging",
  description:
    "BDC reinigt daken, gevels, zonnepanelen en geschikte industriële oppervlakken met professionele drone-technologie.",
  icons: {
    icon: "/brand/favicon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl-BE"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a href="#main" className="bdc-skip-link">
          Ga naar inhoud
        </a>
        {children}
      </body>
    </html>
  );
}
