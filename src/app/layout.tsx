import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { business } from "@/config/business";
import { withBasePath } from "@/lib/paths";
import { absoluteUrl, siteOrigin } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const origin = siteOrigin();
const canonical = absoluteUrl("/");

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  alternates: {
    canonical,
  },
  title: {
    default: "Janssens Drone Cleaning | Daken, gevels en zonnepanelen",
    template: "%s | JDC",
  },
  description:
    "Janssens Drone Cleaning wast daken, gevels, ramen, zonnepanelen en bedrijfsgebouwen met een drone. Zo weinig mogelijk mensen op hoogte.",
  applicationName: "Janssens Drone Cleaning",
  keywords: [
    "dak ontmossen",
    "groene aanslag",
    "gevelreiniging",
    "dakreiniging",
    "zonnepanelen reinigen",
    "ramen wassen",
    "hoogtewerker",
    "VME",
    "België",
    "JDC",
    "Janssens Drone Cleaning",
  ],
  authors: [{ name: business.brandName }],
  openGraph: {
    type: "website",
    locale: "nl_BE",
    url: canonical,
    siteName: "Janssens Drone Cleaning",
    title: "Janssens Drone Cleaning",
    description:
      "Daken, gevels, ramen, zonnepanelen en bedrijfsgebouwen wassen met een drone. Zo weinig mogelijk mensen op hoogte.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Janssens Drone Cleaning",
    description:
      "Daken, gevels, ramen, zonnepanelen en bedrijfsgebouwen wassen met een drone. Zo weinig mogelijk mensen op hoogte.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: withBasePath("/brand/favicon.png"), type: "image/png", sizes: "512x512" },
      { url: withBasePath("/brand/favicon-32.png"), type: "image/png", sizes: "32x32" },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl-BE"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a href="#main" className="jdc-skip-link">
          Ga naar inhoud
        </a>
        {children}
      </body>
    </html>
  );
}
