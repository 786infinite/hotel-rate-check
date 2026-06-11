import type { Metadata } from "next";
import "./globals.css";

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
