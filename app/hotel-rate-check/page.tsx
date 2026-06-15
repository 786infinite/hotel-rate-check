import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hotel Rate Check — Book Your Hotel Online",
  description:
    "Search the live rate, see the full price and terms up front, and book your hotel online. Hotel accommodation only — clear pricing, cancellation terms and any pay-at-hotel charges shown before you pay.",
  keywords: [
    "hotel rate check",
    "book hotel online",
    "hotel booking",
    "check hotel rate",
    "live hotel rates",
    "hotel price before booking",
  ],
  alternates: { canonical: "/hotel-rate-check" },
  openGraph: {
    title: "Hotel Rate Check — Book Your Hotel Online",
    description:
      "Search the live rate, see the full price and terms, and book your hotel online. Hotel accommodation only.",
    url: "https://www.hotelratecheck.com/hotel-rate-check",
    siteName: "Hotel Rate Check",
    type: "website",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "What is Hotel Rate Check?",
    a: "An online hotel booking service. You search the hotel and dates, we check the live rate, and you book it online — with the full price, cancellation terms and any pay-at-hotel charges shown before you pay.",
  },
  {
    q: "When is my booking confirmed?",
    a: "Your payment is taken securely and the booking is confirmed once the hotel confirms it. We then email your confirmation or voucher. Please don't make non-refundable travel arrangements until you receive it.",
  },
  {
    q: "Are you always the cheapest?",
    a: "No, and we don't claim to be. We show the live rate, the cancellation terms and any charges payable at the hotel clearly, so you can see exactly what you are paying before you book.",
  },
  {
    q: "Are there extra charges at the hotel?",
    a: "Some hotels charge local taxes, tourism fees or resort fees directly at check-in. Where we are aware of these, we show them before you pay so there are no surprises.",
  },
  {
    q: "What does it cost to search?",
    a: "Searching a rate is free. You only pay when you choose to book — and the full price and terms are shown before you pay.",
  },
];

export default function HotelRateCheckPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hotel Rate Check",
    serviceType: "Online hotel booking",
    areaServed: "GB",
    provider: { "@type": "Organization", name: "HotelRateCheck.com", url: "https://www.hotelratecheck.com" },
    description:
      "Online hotel booking. Search the live rate, see the full price and terms, and book your hotel online.",
  };

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      <section className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#b88434]">Hotel Rate Check</p>
        <h1 className="text-3xl font-bold md:text-5xl">Book your hotel online</h1>
        <p className="mt-5 text-lg leading-8 text-gray-700">
          Search the hotel and dates, see the live rate with the full price and terms, and book
          online in one place. Every booking shows whether the rate is refundable, the cancellation
          policy and any charges payable directly at the hotel — before you pay. We handle hotel
          accommodation only.
        </p>

        <div className="mt-8">
          <Link
            href="/#book"
            className="inline-flex rounded-full bg-[#071526] px-7 py-4 text-base font-bold text-white hover:bg-[#b88434]"
          >
            Book a hotel
          </Link>
        </div>

        <h2 className="mt-12 text-2xl font-bold">How it works</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-gray-800">
          <li>Tell us the hotel or destination, your dates and guests.</li>
          <li>See the live rate, the full price and the cancellation terms.</li>
          <li>Accept the terms and pay securely online.</li>
          <li>We confirm the booking with the hotel.</li>
          <li>We email your confirmation or voucher.</li>
        </ol>

        <h2 className="mt-12 text-2xl font-bold">Who it is for</h2>
        <p className="mt-4 text-gray-800">
          Useful for businesses booking staff travel, contractors and project teams, event and
          training trips, families booking longer stays, and anyone who wants a clear price and a
          clean booking. We handle hotel accommodation only — no flights or packages.
        </p>

        <h2 className="mt-12 text-2xl font-bold">What we will not do</h2>
        <p className="mt-4 text-gray-800">
          We do not claim to always be the cheapest, and we do not hide costs. We always show the
          cancellation policy and any charges payable directly at the hotel before you pay, and a
          booking is only confirmed once the hotel confirms it.
        </p>

        <h2 className="mt-12 text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-4 space-y-5">
          {FAQ.map((f) => (
            <div key={f.q}>
              <h3 className="text-lg font-bold text-[#071526]">{f.q}</h3>
              <p className="mt-2 text-gray-800">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[#b88434]/30 bg-white p-6">
          <h2 className="text-xl font-bold">Ready to book?</h2>
          <p className="mt-3 text-gray-800">
            Search your hotel and dates and book online — the full price and terms are shown before you pay.
          </p>
          <Link
            href="/#book"
            className="mt-5 inline-flex rounded-full bg-[#071526] px-6 py-3 text-sm font-bold text-white hover:bg-[#b88434]"
          >
            Book a hotel online
          </Link>
        </div>
      </section>
    </main>
  );
}
