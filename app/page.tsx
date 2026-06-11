import EmailActions from "./components/EmailActions";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d8a84f]/40 bg-[#d8a84f] shadow-lg">
        <span className="text-sm font-black tracking-tight text-[#071526]">HRC</span>
      </div>
      <div className="leading-tight">
        <div className="text-2xl font-black tracking-tight text-white">
          Hotel<span className="text-[#d8a84f]">Rate</span>Check
        </div>
        <div className="mt-1 text-[11px] font-semibold tracking-[0.22em] text-white/55">
          BOOK HOTELS ONLINE
        </div>
      </div>
    </div>
  );
}

const trustItems = [
  "Live hotel rates online",
  "Transparent pricing — all charges shown",
  "Secure online payment",
  "Clear terms before you pay",
];

const steps = [
  { title: "Search", text: "Enter your hotel or destination, dates and guests to see available rates." },
  { title: "Review", text: "See the full price, what is refundable, the cancellation policy and any charges payable at the hotel." },
  { title: "Book & pay", text: "Accept the terms and pay securely online." },
  { title: "Confirmation", text: "We confirm your booking with the hotel and email your confirmation or voucher." },
];

const faqs = [
  {
    question: "How do I book?",
    answer:
      "Search for your hotel and dates, review the price and terms, then book and pay securely online. We confirm the booking with the hotel and send your confirmation or voucher by email.",
  },
  {
    question: "Are all charges shown before I pay?",
    answer:
      "Yes. We show the total price, whether the rate is refundable, the cancellation policy, and any local taxes or fees payable directly at the hotel, so you see the true cost before paying.",
  },
  {
    question: "Is my booking confirmed as soon as I pay?",
    answer:
      "Your payment is taken securely and we confirm the booking with the hotel. Your booking is confirmed once the hotel confirms it, and we email your confirmation or voucher. Please do not make non-refundable travel arrangements until you receive it.",
  },
  {
    question: "Can I cancel or change a booking?",
    answer:
      "It depends on the rate. Cheaper rates are often non-refundable and non-amendable — this is always shown before you pay. Once a non-refundable booking is confirmed it cannot be cancelled, changed or refunded except where required by law.",
  },
  {
    question: "Do you provide flights or packages?",
    answer: "No. We provide hotel accommodation only — flights, transfers, car hire and packages are not included.",
  },
  {
    question: "What if a booking cannot be completed?",
    answer:
      "If we cannot complete your booking with the hotel after payment, we offer a suitable alternative or refund you in full.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
      <section className="relative overflow-hidden bg-[#071526] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#18375c,transparent_35%),radial-gradient(circle_at_bottom_left,#8a632a,transparent_30%)] opacity-70" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <header className="flex items-center justify-between">
            <Logo />
            <nav className="hidden items-center gap-8 text-sm font-semibold text-white/80 md:flex">
              <a href="#how-it-works" className="hover:text-[#d8a84f]">How it works</a>
              <a href="#business" className="hover:text-[#d8a84f]">Business</a>
              <a href="#faq" className="hover:text-[#d8a84f]">FAQ</a>
              <a href="#book" className="rounded-full bg-[#d8a84f] px-5 py-2.5 text-[#071526] shadow hover:bg-[#f0c76b]">
                Book a hotel
              </a>
            </nav>
          </header>

          <div className="grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-[#f0c76b] backdrop-blur">
                Book hotels online — clear prices, clear terms
              </p>

              <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-7xl">
                Book your hotel online
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
                Search hotel rates, see the full price and terms up front, and book securely online —
                with every charge shown before you pay.
              </p>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
                Clear pricing. Secure payment. Hotel accommodation only.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a href="#book" className="rounded-full bg-[#d8a84f] px-7 py-4 text-center text-base font-bold text-[#071526] shadow-xl hover:bg-[#f0c76b]">
                  Book a Hotel
                </a>
                <a href="#business" className="rounded-full border border-white/25 px-7 py-4 text-center text-base font-bold text-white hover:bg-white/10">
                  Business Bookings
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {trustItems.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white/80">
                    ✓ {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
              <div className="rounded-[1.5rem] bg-white p-6 text-[#071526]">
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-[#b88434]">Example booking</p>
                    <p className="mt-1 text-sm text-gray-500">Everything shown before you pay.</p>
                  </div>
                  <div className="rounded-2xl bg-[#071526] px-4 py-3 text-right text-white">
                    <p className="text-xs text-white/60">Room total</p>
                    <p className="text-xl font-black text-[#f0c76b]">£649</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Room price</span>
                    <span className="font-black">£649</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Pay at hotel (city tax)</span>
                    <span className="font-black">£14</span>
                  </div>
                  <div className="rounded-2xl bg-[#f7f2e9] p-4 text-sm leading-6 text-gray-700">
                    You see the full price, refundability and cancellation policy before you pay. Some charges
                    may be payable directly at the hotel — we always show them.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">How it works</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#071526]">
              Book online in four simple steps
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">
              Search hotel rates, review the full price and terms, and book securely online. Every charge —
              including anything payable at the hotel — is shown before you pay, so there are no surprises.
            </p>
            <p className="mt-4 text-base leading-7 text-gray-600">
              We provide hotel accommodation only. Your booking is confirmed once the hotel confirms it, and
              we email your confirmation or voucher.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <div key={item.title} className="rounded-3xl border border-gray-200 bg-[#f7f2e9] p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#071526] font-black text-[#d8a84f]">
                  {index + 1}
                </div>
                <h3 className="text-lg font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f2e9] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[2rem] bg-[#071526] p-8 text-white shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#d8a84f]">Why book with us?</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">Clear prices, no hidden extras</h2>
            <p className="mt-5 text-lg leading-8 text-white/75">
              We show the full cost of your stay up front — the room price, whether it is refundable, the
              cancellation policy, and any taxes or fees the hotel charges directly. You always know the true
              cost before you pay.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black">Secure online payment</h3>
              <p className="mt-3 leading-7 text-gray-700">
                Pay securely online. Your booking is confirmed once the hotel confirms it, and we email your
                confirmation or voucher.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black">No surprises</h3>
              <p className="mt-3 leading-7 text-gray-700">
                Refundability, cancellation terms and any pay-at-hotel charges are shown before payment — never
                after.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="book" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">Book a hotel</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">Start your hotel booking</h2>
            <p className="mt-4 text-lg leading-8 text-gray-700">
              Tell us the hotel, destination and dates. We will confirm live availability and send you a secure
              link to complete your booking online.
            </p>

            <div className="mt-6 rounded-3xl bg-[#f7f2e9] p-6 shadow-sm">
              <h3 className="font-black">Good to know</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-700">
                <li>• Hotel accommodation only — no flights or packages.</li>
                <li>• Full price, refundability and cancellation terms shown before you pay.</li>
                <li>• Any charges payable at the hotel are shown up front.</li>
                <li>• Your booking is confirmed once the hotel confirms it.</li>
              </ul>
            </div>
          </div>

          <form action="/api/rate-check" method="POST" className="rounded-3xl bg-[#f7f2e9] p-6 shadow-xl">
            <div className="grid gap-4">
              <input type="hidden" name="form_name" value="Hotel Booking Enquiry" />
              <input required name="full_name" className="rounded-xl border border-gray-300 px-4 py-3" placeholder="Full name" />
              <input required name="email" className="rounded-xl border border-gray-300 px-4 py-3" placeholder="Email address" type="email" />
              <input required name="phone" className="rounded-xl border border-gray-300 px-4 py-3" placeholder="Mobile number" />
              <input required name="hotel_name" className="rounded-xl border border-gray-300 px-4 py-3" placeholder="Hotel name" />
              <input required name="destination" className="rounded-xl border border-gray-300 px-4 py-3" placeholder="Destination / city" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input required name="check_in" className="rounded-xl border border-gray-300 px-4 py-3" type="date" />
                <input required name="check_out" className="rounded-xl border border-gray-300 px-4 py-3" type="date" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input required name="adults" className="rounded-xl border border-gray-300 px-4 py-3" placeholder="Adults" type="number" min="1" />
                <input name="children" className="rounded-xl border border-gray-300 px-4 py-3" placeholder="Children" type="number" min="0" />
              </div>
              <textarea name="notes" className="min-h-28 rounded-xl border border-gray-300 px-4 py-3" placeholder="Room type, board basis, notes or special requests" />
              <button type="submit" className="rounded-full bg-[#d8a84f] px-7 py-4 font-black text-[#071526] hover:bg-[#f0c76b]">
                Continue
              </button>
              <p className="text-xs leading-5 text-gray-500">
                We will confirm availability and send a secure link to complete your booking. The full price and
                terms are shown before you pay.
              </p>
            </div>
          </form>
        </div>
      </section>

      <section id="terms" className="bg-[#071526] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#d8a84f]">Booking terms</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight">Clear terms, shown before you pay</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/75">
            Cheaper hotel rates often come with strict booking terms. Where a rate is non-refundable or
            non-amendable, we show this before you pay. Once a non-refundable booking is confirmed it cannot be
            cancelled, changed, transferred or refunded, except where required by law or if the accommodation is
            not provided as confirmed.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-6">
              <h3 className="font-black">Hotel accommodation only</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                We arrange hotel accommodation. Flights, transfers, car hire and packages are not included.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6">
              <h3 className="font-black">Terms shown up front</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Refundability, cancellation charges and any pay-at-hotel fees are shown before payment.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6">
              <h3 className="font-black">Confirmed by the hotel</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Your booking is confirmed once the hotel confirms it. We then email your confirmation or voucher.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="business" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">Business bookings</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">Hotel bookings for business</h2>
            <p className="mt-4 text-lg leading-8 text-gray-700">
              Booking hotels for staff, contractors, events or client visits? Book online with clear pricing and
              terms, or send a request for multiple rooms and longer stays.
            </p>
          </div>
          <div className="rounded-3xl bg-[#f7f2e9] p-6">
            <h3 className="font-black">Ideal for</h3>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-gray-700 sm:grid-cols-2">
              <li>• Contractors working away</li>
              <li>• Event teams</li>
              <li>• Training companies</li>
              <li>• Consultants</li>
              <li>• Sales teams</li>
              <li>• Small business owners</li>
              <li>• Sports groups</li>
              <li>• Group hotel bookings</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#f7f2e9] py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">FAQ</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight">Common questions</h2>
          <div className="mt-10 grid gap-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-3xl bg-white p-6">
                <h3 className="text-lg font-black">{faq.question}</h3>
                <p className="mt-3 leading-7 text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Hotel Rate Check. All rights reserved.</p>
          <EmailActions />
        </div>
      </footer>
    </main>
  );
}
