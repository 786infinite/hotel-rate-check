import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import CookieConsent from "./components/CookieConsent";
import Analytics from "./components/Analytics";
import { COMPANY } from "@/lib/company";

const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-vf.woff2", style: "normal" },
    { path: "./fonts/fraunces-italic-vf.woff2", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  weight: "100 900",
});
const inter = localFont({
  src: "./fonts/inter-vf.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

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
  legalName: COMPANY.legalName,
  vatID: COMPANY.vatNumber,
  taxID: COMPANY.companyNumber,
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.address.line1,
    addressLocality: COMPANY.address.city,
    postalCode: COMPANY.address.postcode,
    addressCountry: COMPANY.address.country,
  },
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
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:font-semibold">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <SiteHeader />
        <div id="main" className="flex-1">{children}</div>
        <SiteFooter />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
