function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d8a84f]/40 bg-[#d8a84f] shadow-lg">
        <span className="text-sm font-black tracking-tight text-[#071526]">
          HRC
        </span>
      </div>

      <div className="leading-tight">
        <div className="text-2xl font-black tracking-tight text-white">
          Hotel<span className="text-[#d8a84f]">Rate</span>Check
        </div>
        <div className="mt-1 text-[11px] font-semibold tracking-[0.22em] text-white/55">
          HOTEL RATE CHECKING SERVICE
        </div>
      </div>
    </div>
  );
}

const trustItems = [
  "Manual hotel rate checks",
  "No booking made until you approve",
  "Clear terms before payment",
  "Human support before you pay",
];

const steps = [
  {
    title: "Send hotel details",
    text: "Tell us the hotel, destination, dates, guests and the price you found.",
  },
  {
    title: "We manually check",
    text: "We check available rates from our hotel supply partners.",
  },
  {
    title: "You receive a quote",
    text: "If we can improve the rate, we send a clear hotel quote.",
  },
  {
    title: "You confirm and pay",
    text: "You check the details, accept the terms and proceed to payment.",
  },
];

const faqs = [
  {
    question: "Do you guarantee a cheaper rate?",
    answer:
      "No. We manually check available rates and only quote where we believe we can offer a suitable option.",
  },
  {
    question: "Is a booking made when I submit the form?",
    answer:
      "No. The form is only a rate check request. No booking is made until you approve a quote and complete payment.",
  },
  {
    question: "Can I cancel after booking?",
    answer:
      "Our lowest rates usually come with strict terms. Once confirmed, hotel bookings cannot be cancelled, changed, transferred or refunded except where required by law.",
  },
  {
    question: "Do you provide flights or packages?",
    answer:
      "No. We arrange hotel accommodation. Flights, transfers, car hire and sightseeing are not included.",
  },
  {
    question: "How do I pay?",
    answer:
      "If you approve a quote, we send a secure payment link. The booking is only confirmed after payment and supplier confirmation.",
  },
  {
    question: "When do I receive my voucher?",
    answer:
      "After payment and confirmation, we send your hotel voucher by email.",
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
              <a href="#how-it-works" className="hover:text-[#d8a84f]">
                How it works
              </a>
              <a href="#business" className="hover:text-[#d8a84f]">
                Business hotels
              </a>
              <a href="#faq" className="hover:text-[#d8a84f]">
                FAQ
              </a>
              <a
                href="#check-rate"
                className="rounded-full bg-[#d8a84f] px-5 py-2.5 text-[#071526] shadow hover:bg-[#f0c76b]"
              >
                Check rate
              </a>
            </nav>
          </header>

          <div className="grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-[#f0c76b] backdrop-blur">
                Hotel rates checked before you book
              </p>

              <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-7xl">
                Check your hotel rate before you book
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
                Found a hotel online? Send us the details and we’ll manually
                check available rates to see if we can save you money.
              </p>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
                Lower hotel rates. Clear pricing. Human support before you pay.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#check-rate"
                  className="rounded-full bg-[#d8a84f] px-7 py-4 text-center text-base font-bold text-[#071526] shadow-xl hover:bg-[#f0c76b]"
                >
                  Check My Hotel Rate
                </a>

                <a
                  href="#business"
                  className="rounded-full border border-white/25 px-7 py-4 text-center text-base font-bold text-white hover:bg-white/10"
                >
                  Business Hotel Enquiry
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {trustItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white/80"
                  >
                    ✓ {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
              <div className="rounded-[1.5rem] bg-white p-6 text-[#071526]">
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-[#b88434]">
                      Example rate check
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Same hotel. Checked rate option.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#071526] px-4 py-3 text-right text-white">
                    <p className="text-xs text-white/60">Possible saving</p>
                    <p className="text-xl font-black text-[#f0c76b]">£84</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Hotel price found</span>
                    <span className="font-black">£733</span>
                  </div>

                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-600">Checked hotel rate</span>
                    <span className="font-black">£649</span>
                  </div>

                  <div className="rounded-2xl bg-[#f7f2e9] p-4 text-sm leading-6 text-gray-700">
                    Lower rates can come with strict booking terms. Once
                    confirmed, bookings cannot be cancelled, changed,
                    transferred or refunded except where required by law.
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
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#071526]">
              We manually check rates, not just show automatic results
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-700">
              Many online hotel platforms rely on automated pricing and standard
              margin structures. We do it differently: we manually check
              available rates from our supply partners and look for stronger
              hotel options where available.
            </p>

            <p className="mt-4 text-base leading-7 text-gray-600">
              This does not mean every hotel will be cheaper. It means each
              request is checked properly before we quote, including the hotel,
              dates, room type, board basis, total price and booking terms.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <div
                key={item.title}
                className="rounded-3xl border border-gray-200 bg-[#f7f2e9] p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#071526] font-black text-[#d8a84f]">
                  {index + 1}
                </div>
                <h3 className="text-lg font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-700">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f2e9] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[2rem] bg-[#071526] p-8 text-white shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#d8a84f]">
              Why check with us?
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight">
              A proper manual check before you pay
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/75">
              Hotel prices can vary depending on supplier access, rate type,
              availability and margin structure. We manually check available
              rates and only quote where we believe there is a suitable option.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black">No pressure</h3>
              <p className="mt-3 leading-7 text-gray-700">
                If we cannot improve the rate, we will tell you. You only
                proceed if you are happy with the quote.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black">Clear booking terms</h3>
              <p className="mt-3 leading-7 text-gray-700">
                Before payment, you will see the hotel, dates, guest details,
                room type, board basis, total price and booking terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="check-rate" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">
              Rate check
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight">
              Check My Hotel Rate
            </h2>

            <p className="mt-4 text-lg leading-8 text-gray-700">
              Send us your hotel details and we’ll check whether we can save you
              money.
            </p>

            <div className="mt-6 rounded-3xl bg-[#f7f2e9] p-6 shadow-sm">
              <h3 className="font-black">Important before requesting a quote</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-700">
                <li>• No booking is made until you approve the quote.</li>
                <li>• Prices are live and subject to availability.</li>
                <li>• Lower rates cannot be changed once confirmed.</li>
                <li>• Full booking terms are shown before payment.</li>
              </ul>
            </div>
          </div>

          <form
            action="/api/rate-check"
            method="POST"
            className="rounded-3xl bg-[#f7f2e9] p-6 shadow-xl"
          >
            <div className="grid gap-4">
              <input
                type="hidden"
                name="form_name"
                value="Hotel Rate Check Enquiry"
              />

              <input
                required
                name="full_name"
                className="rounded-xl border border-gray-300 px-4 py-3"
                placeholder="Full name"
              />

              <input
                required
                name="email"
                className="rounded-xl border border-gray-300 px-4 py-3"
                placeholder="Email address"
                type="email"
              />

              <input
                required
                name="phone"
                className="rounded-xl border border-gray-300 px-4 py-3"
                placeholder="Mobile number"
              />

              <input
                required
                name="hotel_name"
                className="rounded-xl border border-gray-300 px-4 py-3"
                placeholder="Hotel name"
              />

              <input
                required
                name="destination"
                className="rounded-xl border border-gray-300 px-4 py-3"
                placeholder="Destination / city"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  name="check_in"
                  className="rounded-xl border border-gray-300 px-4 py-3"
                  type="date"
                />

                <input
                  required
                  name="check_out"
                  className="rounded-xl border border-gray-300 px-4 py-3"
                  type="date"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  name="adults"
                  className="rounded-xl border border-gray-300 px-4 py-3"
                  placeholder="Adults"
                  type="number"
                  min="1"
                />

                <input
                  name="children"
                  className="rounded-xl border border-gray-300 px-4 py-3"
                  placeholder="Children"
                  type="number"
                  min="0"
                />
              </div>

              <input
                required
                name="price_found"
                className="rounded-xl border border-gray-300 px-4 py-3"
                placeholder="Price you found"
              />

              <textarea
                name="notes"
                className="min-h-28 rounded-xl border border-gray-300 px-4 py-3"
                placeholder="Room type, board basis, notes or special requests"
              />

              <button
                type="submit"
                className="rounded-full bg-[#d8a84f] px-7 py-4 font-black text-[#071526] hover:bg-[#f0c76b]"
              >
                Submit Rate Check
              </button>

              <p className="text-xs leading-5 text-gray-500">
                No booking is made from this form. We will check availability
                and contact you with a quote if a suitable rate is available.
              </p>
            </div>
          </form>
        </div>
      </section>

      <section id="terms" className="bg-[#071526] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#d8a84f]">
            Booking terms
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight">
            Lower prices can come with strict terms
          </h2>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/75">
            Our best hotel rates come with strict booking terms. This can make
            them cheaper, but once the booking is confirmed it cannot be
            cancelled, changed, transferred or refunded, except where required
            by law or if the booked accommodation is not provided as confirmed.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-6">
              <h3 className="font-black">Accommodation booking</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                We arrange hotel accommodation. Flights, transfers, car hire and
                sightseeing are not included.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6">
              <h3 className="font-black">Strict booking terms</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Once confirmed, hotel bookings cannot be cancelled, changed,
                transferred or refunded.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6">
              <h3 className="font-black">Clear confirmation</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Customers must check and accept the booking details before
                payment and again at payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="business" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">
              Business hotels
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight">
              Hotel savings for small businesses
            </h2>

            <p className="mt-4 text-lg leading-8 text-gray-700">
              If your business regularly books hotels for staff, contractors,
              events or client visits, we can check available rates before you
              book.
            </p>
          </div>

          <div className="rounded-3xl bg-[#f7f2e9] p-6">
            <h3 className="font-black">Suitable for</h3>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-gray-700 sm:grid-cols-2">
              <li>• Contractors working away</li>
              <li>• Event teams</li>
              <li>• Training companies</li>
              <li>• Consultants</li>
              <li>• Sales teams</li>
              <li>• Small business owners</li>
              <li>• Sports groups</li>
              <li>• Group hotel needs</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#f7f2e9] py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">
            FAQ
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight">
            Common questions
          </h2>

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

          <div className="flex flex-col gap-2 md:items-end">
            <a
              href="mailto:quotes@hotelratecheck.com?subject=Hotel%20Rate%20Check%20enquiry"
              className="font-semibold text-[#071526] hover:text-[#b88434]"
            >
              quotes@hotelratecheck.com
            </a>
            <p>Hotel rate checking service.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}