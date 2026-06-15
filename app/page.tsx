import Link from "next/link";
import { SearchIcon, TagIcon, ShieldIcon, CheckIcon, BedIcon, CardIcon, StarIcon } from "./components/icons";
import SmartImage from "./components/SmartImage";

const trust = ["Clear prices — all charges shown", "Secure online payment", "Hotel accommodation only", "Terms shown before you pay"];

/**
 * PHOTOS — set `img` to a licensed image URL (Unsplash/Pexels, free for
 * commercial use) or a local file you drop in /public, e.g. "/images/london.jpg".
 * Leave blank ("") to keep the brand gradient. If a URL fails to load, the
 * gradient shows automatically — the site never breaks.
 * The example Unsplash URLs below are seeds: verify or replace each one.
 */
const HERO_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=70";

const destinations = [
  { city: "London", big: true, from: "from-[#15324f]", to: "to-[#0a1c30]", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=70" },
  { city: "Paris", from: "from-[#2a4d6e]", to: "to-[#10243a]", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=70" },
  { city: "Istanbul", from: "from-[#5c2b3a]", to: "to-[#26121a]", img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=70" },
  { city: "New York", from: "from-[#34506b]", to: "to-[#141f2c]", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=70" },
  { city: "Dubai", from: "from-[#5a4a22]", to: "to-[#241c0c]", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=70" },
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

const fieldLabel = "block text-[11px] font-bold uppercase tracking-wide text-gray-500";
const fieldInput = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#b88434] focus:ring-2 focus:ring-[#d8a84f]/30";

function Skyline({ className }: { className?: string }) {
  const buildings = [70, 42, 96, 58, 120, 84, 52, 104, 66, 112, 46, 92, 76, 132, 60, 88];
  return (
    <svg viewBox="0 0 1600 160" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <g fill="currentColor">
        {buildings.map((h, i) => (
          <rect key={i} x={i * 100} y={160 - h} width={84} height={h} rx={4} />
        ))}
      </g>
    </svg>
  );
}

export default function Home() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className="bg-[#f7f2e9] text-[#071526]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ===== HERO ===== */}
      <section id="book" className="relative overflow-hidden bg-[#0b1b2e] text-white">
        <SmartImage src={HERO_IMAGE} alt="" priority sizes="100vw" className="object-cover opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-[#0b1b2e]/70" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,#1c3f63,transparent_45%),radial-gradient(circle_at_88%_8%,#7a5320,transparent_42%)]" />
        <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-[#3b6ea5]/30 blur-3xl animate-floaty" />
        <div className="pointer-events-none absolute -right-16 top-44 h-80 w-80 rounded-full bg-[#d8a84f]/20 blur-3xl animate-floaty-slow" />
        <Skyline className="pointer-events-none absolute bottom-0 left-0 h-40 w-full text-white/[0.06]" />

        <div className="relative mx-auto max-w-5xl px-6 pb-28 pt-20 text-center lg:px-8 lg:pt-24">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-[#f0c76b] backdrop-blur rise-in">
            <ShieldIcon className="h-4 w-4" /> Clear prices · clear terms · hotel-only
          </p>
          <h1 className="rise-in text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
            Book your <span className="text-gold-gradient">hotel</span> online
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80">
            Search hotel rates, see the full price and terms up front, and book securely online — with every
            charge, including anything payable at the hotel, shown before you pay.
          </p>

          {/* Search panel */}
          <form action="/api/rate-check" method="POST" className="mx-auto mt-10 max-w-4xl rounded-[1.75rem] bg-white/95 p-4 text-left shadow-2xl ring-1 ring-black/5 backdrop-blur md:p-5">
            <input type="hidden" name="form_name" value="Hotel Booking Enquiry" />
            <input type="hidden" name="destination" value="See hotel/destination field" />
            <div className="grid gap-3 md:grid-cols-4">
              <label className="md:col-span-1">
                <span className={fieldLabel}>Hotel / destination</span>
                <input required name="hotel_name" placeholder="e.g. Hilton London" className={fieldInput} />
              </label>
              <label>
                <span className={fieldLabel}>Check-in</span>
                <input required name="check_in" type="date" className={fieldInput} />
              </label>
              <label>
                <span className={fieldLabel}>Check-out</span>
                <input required name="check_out" type="date" className={fieldInput} />
              </label>
              <label>
                <span className={fieldLabel}>Guests</span>
                <input required name="adults" type="number" min="1" defaultValue={2} className={fieldInput} />
              </label>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <label>
                <span className={fieldLabel}>Your name</span>
                <input required name="full_name" placeholder="Full name" className={fieldInput} />
              </label>
              <label>
                <span className={fieldLabel}>Email</span>
                <input required name="email" type="email" placeholder="you@email.com" className={fieldInput} />
              </label>
              <label>
                <span className={fieldLabel}>Phone</span>
                <input required name="phone" placeholder="Mobile number" className={fieldInput} />
              </label>
            </div>
            <button type="submit" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b1b2e] px-7 py-4 text-base font-bold text-white transition hover:bg-[#b88434]">
              <SearchIcon className="h-5 w-5" /> Find my hotel
            </button>
            <p className="mt-2 text-center text-xs text-gray-500">
              Secure online payment. Full price, cancellation terms and any pay-at-hotel charges shown before you pay.
            </p>
          </form>

          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-2">
            {trust.map((t) => (
              <span key={t} className="flex items-center gap-2 text-sm font-medium text-white/75">
                <CheckIcon className="h-4 w-4 text-[#f0c76b]" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DESTINATIONS (bento) ===== */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">Popular destinations</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Where to next?</h2>
          </div>
          <Link href="#book" className="hidden text-sm font-bold text-[#b88434] hover:underline sm:block">Book any hotel →</Link>
        </div>
        <div className="mt-8 grid auto-rows-[150px] grid-cols-2 gap-4 md:grid-cols-4">
          {destinations.map((d) => (
            <Link
              key={d.city}
              href="#book"
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${d.from} ${d.to} p-5 text-white shadow-lg ${d.big ? "col-span-2 row-span-2" : ""}`}
            >
              <SmartImage
                src={d.img}
                alt={`${d.city} hotels`}
                sizes={d.big ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <Skyline className="absolute bottom-0 left-0 h-16 w-full text-white/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition duration-300 group-hover:from-black/40" />
              <div className="relative flex h-full flex-col justify-end">
                <p className={`font-black ${d.big ? "text-3xl md:text-4xl" : "text-xl"}`}>{d.city}</p>
                <p className="mt-1 text-sm text-white/75 transition group-hover:text-[#f0c76b]">Book a hotel →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">How it works</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Book online in four steps</h2>
          <div className="relative mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="lift relative rounded-3xl border border-gray-100 bg-[#f7f2e9] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0b1b2e] to-[#1c3f63] text-[#f0c76b]">
                    <s.Icon className="h-6 w-6" />
                  </div>
                  <span className="text-4xl font-black text-[#e7dcc6]">{i + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-black">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-700">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">Why book with us</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Clear, fair, no surprises</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="lift rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f0c76b] to-[#b88434] text-[#071526]">
                <f.Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-black">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BUSINESS BAND ===== */}
      <section className="relative overflow-hidden bg-[#0b1b2e] py-16 text-white">
        <div className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full bg-[#d8a84f]/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#d8a84f]">For business</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Hotel bookings for teams &amp; contractors</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-white/75">
              Booking for staff, contractors, events or client visits? Clear pricing, terms shown up front, and
              help with multiple rooms and longer stays.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/business-hotel-rate-check" className="rounded-full bg-[#d8a84f] px-6 py-3 text-sm font-bold text-[#071526] transition hover:bg-[#f0c76b]">Business bookings</Link>
            <Link href="/group-hotel-rate-check" className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">Group bookings</Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">FAQ</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Common questions</h2>
        <div className="mt-8 grid gap-4">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-[#d8a84f]/50">
              <summary className="flex cursor-pointer items-center justify-between text-base font-bold text-[#071526]">
                {f.q}
                <span className="ml-4 text-[#b88434] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-7 text-gray-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#b88434] to-[#8a632a] px-8 py-14 text-center text-white shadow-xl">
          <Skyline className="pointer-events-none absolute bottom-0 left-0 h-24 w-full text-white/10" />
          <div className="relative">
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">Ready to book your hotel?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/90">
              Search your hotel and dates and book online — full price and terms shown before you pay.
            </p>
            <Link href="#book" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0b1b2e] px-8 py-4 text-base font-bold text-white transition hover:bg-black">
              <SearchIcon className="h-5 w-5" /> Book a hotel
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
