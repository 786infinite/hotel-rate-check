import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hotel Rate Check — Check Your Hotel Rate Before You Book",
  description:
    "Already have a hotel price? Send it to us and we check live supplier rates to see if we can improve it before you book. Hotel-only, clear terms, no booking until you approve.",
  keywords: [
    "hotel rate check",
    "check hotel rate",
    "hotel price check",
    "is my hotel rate good",
    "hotel rate checking service",
    "compare hotel rate before booking",
  ],
  alternates: { canonical: "/hotel-rate-check" },
  openGraph: {
    title: "Hotel Rate Check — Check Your Hotel Rate Before You Book",
    description:
      "Send us your hotel price and we check live supplier rates to see if we can improve it. Hotel-only, clear terms, no booking until you approve.",
    url: "https://www.hotelratecheck.com/hotel-rate-check",
    siteName: "Hotel Rate Check",
    type: "website",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "What is a hotel rate check?",
    a: "It is a quick service where you send us a hotel and price you have found, and we check live supplier rates to see whether we can improve on it. If we can, we send you a clear quote. If we cannot, we tell you.",
  },
  {
    q: "Do you book the hotel for me?",
    a: "Only if you approve a quote and pay. We never make a booking without your approval, and a booking is not confirmed until we have completed it with the supplier and received confirmation.",
  },
  {
    q: "Is this cheaper than booking myself?",
    a: "Sometimes we can improve on the price you have, sometimes we cannot. We do not claim to always be cheapest. We show you the price, the cancellation terms and any charges payable at the hotel, so you can decide.",
  },
  {
    q: "Are there extra charges at the hotel?",
    a: "Some hotels charge local taxes, tourism fees or resort fees directly at check-in. Where we are aware of these, we show them to you before you pay so there are no surprises.",
  },
  {
    q: "What does it cost to get a rate check?",
    a: "Getting a rate check and a quote is free. You only pay if you accept a quote and choose to book through us.",
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
    serviceType: "Hotel rate checking and assisted booking",
    areaServed: "GB",
    provider: { "@type": "Organization", name: "HotelRateCheck.com", url: "https://www.hotelratecheck.com" },
    description:
      "Online hotel rate checking and booking. Send a hotel and price, and we check supplier rates to see if we can improve it before you book.",
  };

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      <section className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#b88434]">Hotel Rate Check</p>
        <h1 className="text-3xl font-bold md:text-5xl">Check your hotel rate before you book</h1>
        <p className="mt-5 text-lg leading-8 text-gray-700">
          Found a hotel and a price? Send it to us before you book. We check live
          supplier rates to see whether we can improve on what you have found. If we can, you
          get a clear quote with the full price, cancellation terms and any charges payable at
          the hotel. If we cannot, we tell you plainly. No booking is made unless you approve.
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
          <li>You send the hotel, dates, guests and the price you have found.</li>
          <li>We check live supplier rates for the same stay.</li>
          <li>If we can offer a suitable rate, we send you a clear quote to review.</li>
          <li>You accept the terms and pay only if you are happy.</li>
          <li>We complete the booking and send your confirmation or voucher.</li>
        </ol>

        <h2 className="mt-12 text-2xl font-bold">Who it is for</h2>
        <p className="mt-4 text-gray-800">
          Useful for businesses booking staff travel, contractors and project teams, event and
          training trips, families booking longer stays, and anyone who wants a second look at a
          hotel price before committing. We handle hotel accommodation only — no flights or
          packages.
        </p>

        <h2 className="mt-12 text-2xl font-bold">What we will not do</h2>
        <p className="mt-4 text-gray-800">
          We do not claim to always be the cheapest, and we do not make a booking without your
          approval. We always show the cancellation policy and any charges payable directly at
          the hotel before you pay, and a booking is only confirmed once the supplier confirms it.
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
            Tell us the hotel and dates and we will confirm availability and a secure link to book online — full price and terms shown before you pay.
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
