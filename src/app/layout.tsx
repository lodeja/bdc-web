import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { withBasePath } from "@/lib/paths";
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
  title: {
    default: "Belgian Drone Cleaning (BDC) | Professionele drone-reiniging",
    template: "%s | BDC",
  },
  description:
    "BDC reinigt daken, gevels, zonnepanelen en geschikte industriële oppervlakken met professionele drone-technologie in België.",
  applicationName: "Belgian Drone Cleaning",
  keywords: [
    "drone reiniging",
    "gevelreiniging",
    "dakreiniging",
    "zonnepanelen reinigen",
    "industriële reiniging",
    "Belgium",
    "BDC",
  ],
  authors: [{ name: "Belgian Drone Cleaning" }],
  openGraph: {
    type: "website",
    locale: "nl_BE",
    siteName: "Belgian Drone Cleaning",
    title: "Belgian Drone Cleaning (BDC)",
    description:
      "Professionele drone-reiniging voor daken, gevels, zonnepanelen en industriële oppervlakken.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: withBasePath("/brand/favicon.svg"),
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
