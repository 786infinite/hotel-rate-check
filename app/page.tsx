import Link from "next/link";
import { SearchIcon, TagIcon, ShieldIcon, CheckIcon, BedIcon, CardIcon, StarIcon } from "./components/icons";

const trust = [
  "Clear prices — all charges shown",
  "Secure online payment",
  "Hotel accommodation only",
  "Terms shown before you pay",
];

const destinations = [
  { city: "London", from: "from-[#1b3a5c]", to: "to-[#0a1c30]" },
  { city: "Paris", from: "from-[#2a4d6e]", to: "to-[#10243a]" },
  { city: "Istanbul", from: "from-[#5c2b3a]", to: "to-[#26121a]" },
  { city: "New York", from: "from-[#34506b]", to: "to-[#141f2c]" },
  { city: "Manchester", from: "from-[#3a4a2e]", to: "to-[#172012]" },
];

const steps = [
  { Icon: SearchIcon, title: "Search", text: "Tell us the hotel or destination, dates and guests." },
  { Icon: TagIcon, title: "Review", text: "See the full price, refundability, cancellation terms and any pay-at-hotel charges." },
  { Icon: CardIcon, title: "Book & pay", text: "Accept the terms and pay securely online." },
  { Icon: CheckIcon, title: "Confirmation", text: "We confirm with the hotel and email your confirmation or voucher." },
];

const features = [
  { Icon: TagIcon, title: "Clear pricing", text: "The full cost — including any taxes or fees the hotel charges directly — shown before you pay." },
  { Icon: ShieldIcon, title: "Secure payment", text: "Pay securely online. Your booking is confirmed once the hotel confirms it." },
  { Icon: BedIcon, title: "Hotel-only focus", text: "We do one thing well: hotel accommodation. No flights, packages or upsells." },
  { Icon: StarIcon, title: "Real support", text: "A real person to help before you pay — not a chatbot or a ticket queue." },
];

const faqs = [
  { q: "How do I book?", a: "Tell us your hotel and dates, review the price and terms, then book and pay securely online. We confirm the booking with the hotel and email your confirmation or voucher." },
  { q: "Are all charges shown before I pay?", a: "Yes. We show the total price, whether the rate is refundable, the cancellation policy, and any local taxes or fees payable directly at the hotel." },
  { q: "Is my booking confirmed as soon as I pay?", a: "Your payment is taken securely and we confirm with the hotel. The booking is confirmed once the hotel confirms it, and we email your confirmation or voucher. Please don't make non-refundable travel arrangements until you receive it." },
  { q: "Can I cancel or change a booking?", a: "It depends on the rate. Cheaper rates are often non-refundable and non-amendable — this is always shown before you pay. Once a non-refundable booking is confirmed it cannot be cancelled or refunded except where required by law." },
  { q: "Do you provide flights or packages?", a: "No. We provide hotel accommodation only — flights, transfers, car hire and packages are not included." },
  { q: "What if a booking can't be completed?", a: "If we cannot complete your booking with the hotel after payment, we offer a suitable alternative or refund you in full." },
];

export default function Home() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className="bg-[#f7f2e9] text-[#071526]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section id="book" className="relative overflow-hidden bg-[#071526] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#18375c,transparent_40%),radial-gradient(circle_at_bottom_left,#8a632a,transparent_35%)] opacity-70" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-[#f0c76b] backdrop-blur">
              Book hotels online — clear prices, clear terms
            </p>
            <h1 className="text-5xl font-black tracking-tight md:text-6xl">Book your hotel online</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
              See the full price and terms up front and book securely online — with every charge,
              including anything payable at the hotel, shown before you pay.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {trust.map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm font-semibold text-white/80">
                  <CheckIcon className="h-5 w-5 shrink-0 text-[#f0c76b]" /> {t}
                </div>
              ))}
            </div>
          </div>

          {/* Booking card */}
          <div className="rounded-[1.75rem] border border-white/10 bg-white p-6 text-[#071526] shadow-2xl">
            <h2 className="text-lg font-black">Start your booking</h2>
            <p className="mt-1 text-sm text-gray-500">
              We will confirm availability and a secure link to pay. Full price and terms shown before payment.
            </p>
            <form action="/api/rate-check" method="POST" className="mt-5 grid gap-3">
              <input type="hidden" name="form_name" value="Hotel Booking Enquiry" />
              <label className="block">
                <span className="text-xs font-bold text-gray-600">Hotel or destination</span>
                <input required name="hotel_name" placeholder="e.g. Hilton London" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" />
              </label>
              <input type="hidden" name="destination" value="See hotel/destination field" />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold text-gray-600">Check-in</span>
                  <input required name="check_in" type="date" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-gray-600">Check-out</span>
                  <input required name="check_out" type="date" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold text-gray-600">Guests</span>
                  <input required name="adults" type="number" min="1" defaultValue={2} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-gray-600">Your name</span>
                  <input required name="full_name" placeholder="Full name" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold text-gray-600">Email</span>
                  <input required name="email" type="email" placeholder="Email address" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-gray-600">Phone</span>
                  <input required name="phone" placeholder="Mobile number" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" />
                </label>
              </div>
              <button type="submit" className="mt-1 rounded-full bg-[#071526] px-7 py-4 text-base font-bold text-white hover:bg-[#b88434]">
                Find my hotel
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">Popular destinations</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Where to next?</h2>
          </div>
          <Link href="/#book" className="hidden text-sm font-bold text-[#b88434] hover:underline sm:block">
            Book any hotel →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {destinations.map((d) => (
            <Link
              key={d.city}
              href="/#book"
              className={`group relative flex h-40 items-end overflow-hidden rounded-2xl bg-gradient-to-br ${d.from} ${d.to} p-5 text-white shadow-lg`}
            >
              <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/0" />
              <div className="relative">
                <p className="text-xl font-black">{d.city}</p>
                <p className="text-sm text-white/75">Book a hotel →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">How it works</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Book online in four steps</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-3xl border border-gray-200 bg-[#f7f2e9] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071526] text-[#d8a84f]">
                  <s.Icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-xs font-black text-[#b88434]">STEP {i + 1}</p>
                <h3 className="mt-1 text-lg font-black">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-700">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">Why book with us</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Clear, fair, no surprises</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7f2e9] text-[#b88434]">
                <f.Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-black">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Business band */}
      <section className="bg-[#071526] py-16 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#d8a84f]">For business</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Hotel bookings for teams &amp; contractors</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-white/75">
              Booking for staff, contractors, events or client visits? Clear pricing, terms shown up front,
              and help with multiple rooms and longer stays.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/business-hotel-rate-check" className="rounded-full bg-[#d8a84f] px-6 py-3 text-sm font-bold text-[#071526] hover:bg-[#f0c76b]">
              Business bookings
            </Link>
            <Link href="/group-hotel-rate-check" className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
              Group bookings
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">FAQ</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Common questions</h2>
        <div className="mt-8 grid gap-4">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-gray-200 bg-white p-5">
              <summary className="cursor-pointer text-base font-bold text-[#071526]">{f.q}</summary>
              <p className="mt-3 leading-7 text-gray-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#b88434] to-[#8a632a] px-8 py-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">Ready to book your hotel?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Tell us your hotel and dates and we will get you a secure booking link — full price and terms shown before you pay.
          </p>
          <Link href="/#book" className="mt-6 inline-flex rounded-full bg-[#071526] px-8 py-4 text-base font-bold text-white hover:bg-black">
            Book a hotel
          </Link>
        </div>
      </section>
    </main>
  );
}
