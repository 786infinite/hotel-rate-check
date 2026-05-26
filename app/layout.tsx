import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotel Rate Check | Check Your Hotel Rate Before You Book",
  description:
    "Send us your hotel details and we’ll manually check available rates to see if we can save you money before you book.",
  keywords: [
    "hotel rate check",
    "check hotel price",
    "hotel savings",
    "hotel quote",
    "business hotel rates",
    "hotel booking service",
  ],
  openGraph: {
    title: "Hotel Rate Check",
    description:
      "Check your hotel rate before you book. We manually check available rates to see if we can save you money.",
    url: "https://hotelratecheck.com",
    siteName: "Hotel Rate Check",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}