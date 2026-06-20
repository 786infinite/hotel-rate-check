import Link from "next/link";
import { SearchIcon, TagIcon, ShieldIcon, CheckIcon, BedIcon, CardIcon, StarIcon } from "./components/icons";
import SmartImage from "./components/SmartImage";
import OccupancyPicker from "./components/OccupancyPicker";

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
  { city: "Paris", country: "France", price: "from £128", big: true, from: "from-[#2a4d6e]", to: "to-[#10243a]", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=72" },
  { city: "Barcelona", country: "Spain", price: "from £114", from: "from-[#1f4a4a]", to: "to-[#0c2222]", img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=72" },
  { city: "Rome", country: "Italy", price: "from £98", from: "from-[#5c4327]", to: "to-[#251a0f]", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=72" },
  { city: "London", country: "UK", price: "from £140", from: "from-[#15324f]", to: "to-[#0a1c30]", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=72" },
  { city: "Amsterdam", country: "Netherlands", price: "from £121", from: "from-[#34506b]", to: "to-[#141f2c]", img: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&q=72" },
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
      <section id="book" className="relative overflow-hidden bg-[#071526] text-white">
        <SmartImage src={HERO_IMAGE} alt="" priority sizes="100vw" className="object-cover object-right opacity-95" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#071526_0%,rgba(7,21,38,0.92)_32%,rgba(7,21,38,0.5)_68%,rgba(7,21,38,0.12)_100%)]" />
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#d8a84f]/15 blur-3xl animate-floaty-slow" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-8 lg:pb-24 lg:pt-24">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f0c76b] backdrop-blur rise-in">
            <ShieldIcon className="h-4 w-4" /> Clear prices · clear terms · hotel-only
          </p>
          <h1 className="font-display-italic rise-in max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-[5.25rem]">
            Transparent prices.<br />Exceptional stays.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
            Boutique hotel rooms, booked with confidence — every charge shown before you pay.
          </p>

          {/* Glass search bar — live rates via the TBO API */}
          <form action="/search" method="GET" className="mt-10 max-w-5xl rounded-[1.5rem] border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-xl">
            <div className="grid items-stretch gap-1 md:grid-cols-[1.5fr_1fr_1fr_1.1fr_auto]">
              <label className="rounded-2xl px-4 py-3 transition hover:bg-white/5">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">Destination</span>
                <input required name="destination" placeholder="Where are you going?" className="mt-1.5 w-full bg-transparent text-[15px] font-medium text-white placeholder-white/40 outline-none" />
              </label>
              <label className="rounded-2xl px-4 py-3 transition hover:bg-white/5 md:border-l md:border-white/10">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">Check-in</span>
                <input required name="checkIn" type="date" className="mt-1.5 w-full bg-transparent text-[15px] font-medium text-white outline-none [color-scheme:dark]" />
              </label>
              <label className="rounded-2xl px-4 py-3 transition hover:bg-white/5 md:border-l md:border-white/10">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">Check-out</span>
                <input required name="checkOut" type="date" className="mt-1.5 w-full bg-transparent text-[15px] font-medium text-white outline-none [color-scheme:dark]" />
              </label>
              <div className="px-4 py-3 md:border-l md:border-white/10">
                <OccupancyPicker tone="dark" />
              </div>
              <div className="p-1">
                <button type="submit" className="flex h-full w-full items-center justify-center gap-2 rounded-2xl bg-[#d8a84f] px-7 py-4 text-base font-bold text-[#071526] transition hover:bg-[#f0c76b]">
                  Search <SearchIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>

          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-2">
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
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b88434]">Popular destinations</p>
            <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Where to next?</h2>
          </div>
          <Link href="#book" className="hidden text-sm font-semibold text-[#b88434] hover:underline sm:block">Explore all destinations →</Link>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent transition duration-300 group-hover:from-black/55" />
              <span className="absolute right-4 top-4 rounded-full bg-[#d8a84f] px-3 py-1 text-xs font-bold text-[#071526]">{d.price}/night</span>
              <div className="relative flex h-full flex-col justify-end">
                <p className={`font-display font-semibold leading-none ${d.big ? "text-4xl md:text-5xl" : "text-2xl"}`}>{d.city}</p>
                <p className="mt-1 text-sm font-medium text-white/70">{d.country}</p>
                <p className="mt-2 text-sm font-semibold text-[#f0c76b]">View hotels →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">Book online in four steps</h2>
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
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">Clear, fair, no surprises</h2>
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
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">Hotel bookings for teams &amp; contractors</h2>
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
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">Common questions</h2>
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
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Ready to book your hotel?</h2>
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
