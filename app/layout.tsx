import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hotelratecheck.com"),
  title: "Hotel Rate Check | Book Hotels Online — Clear Prices & Terms",
  description:
    "Book hotels online with Hotel Rate Check. See the full price, refundability and cancellation terms up front, with any pay-at-hotel charges shown before you pay.",
  keywords: [
    "book hotel online",
    "hotel booking",
    "hotel rates",
    "business hotel booking",
    "online hotel booking uk",
    "hotel accommodation",
  ],
  openGraph: {
    title: "Hotel Rate Check — Book Hotels Online",
    description:
      "Book hotels online with clear prices and terms. Every charge shown before you pay.",
    url: "https://www.hotelratecheck.com",
    siteName: "Hotel Rate Check",
    type: "website",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hotel Rate Check",
  legalName: "786 Infinite Ltd",
  url: "https://www.hotelratecheck.com",
  email: "quotes@hotelratecheck.com",
  description: "Online hotel booking service. Hotel accommodation only, with clear prices and terms shown before payment.",
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Hotel Rate Check",
  url: "https://www.hotelratecheck.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-[#f7f2e9]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
