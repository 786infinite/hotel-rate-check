import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accept Your Hotel Quote | Hotel Rate Check",
  description:
    "Confirm your hotel quote details and accept the booking terms before payment.",
};

export default function QuoteAcceptancePage() {
  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
      <section className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex rounded-full border border-[#b88434] px-4 py-2 text-sm font-semibold text-[#071526] hover:bg-[#b88434] hover:text-white"
        >
          ← Back to homepage
        </Link>

        <div className="rounded-3xl bg-white p-6 shadow-xl md:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#b88434]">
            Hotel Rate Check
          </p>

          <h1 className="text-3xl font-bold md:text-5xl">
            Accept your hotel quote
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-700">
            Use this page only after we have emailed you a hotel quote. Please
            check every detail carefully before accepting.
          </p>

          <div className="mt-8 rounded-2xl border border-[#b88434]/30 bg-[#f7f2e9] p-5">
            <h2 className="text-xl font-bold text-[#071526]">
              Important booking notice
            </h2>
            <p className="mt-3 text-gray-800">
              A quote is not a confirmed booking. Your hotel booking is only
              confirmed after you accept the quote, pay the required amount, and
              we receive supplier confirmation.
            </p>
            <p className="mt-3 font-semibold text-[#071526]">
              Once confirmed, hotel bookings cannot be cancelled, changed,
              transferred or refunded unless required by law or unless the
              booked accommodation is not provided as confirmed.
            </p>
          </div>

          <form
            action="/api/quote-acceptance"
            method="POST"
            className="mt-8 space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-[#071526]">
                  Full name
                </span>
                <input
                  required
                  name="full_name"
                  type="text"
                  className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-[#071526]">
                  Email address
                </span>
                <input
                  required
                  name="email"
                  type="email"
                  className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-[#071526]">
                Quote reference
              </span>
              <input
                required
                name="quote_reference"
                type="text"
                placeholder="Example: HRC-001"
                className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-[#071526]">
                Hotel name
              </span>
              <input
                required
                name="hotel_name"
                type="text"
                className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-[#071526]">
                  Check-in date
                </span>
                <input
                  required
                  name="check_in"
                  type="date"
                  className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-[#071526]">
                  Check-out date
                </span>
                <input
                  required
                  name="check_out"
                  type="date"
                  className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-[#071526]">
                Total quoted price
              </span>
              <input
                required
                name="total_price"
                type="text"
                placeholder="Example: £745 total"
                className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-[#071526]">
                Notes or details from the quote
              </span>
              <textarea
                name="quote_notes"
                rows={5}
                placeholder="Room type, board basis, guests, supplier notes or anything shown in your quote email."
                className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
              />
            </label>

            <div className="space-y-4 rounded-2xl border border-gray-200 bg-[#f7f2e9] p-5">
              <label className="flex gap-3">
                <input
                  required
                  name="details_confirmed"
                  value="yes"
                  type="checkbox"
                  className="mt-1 h-5 w-5"
                />
                <span className="text-sm leading-6 text-gray-800">
                  I confirm that I have checked the hotel name, destination,
                  dates, guests, room details, board basis, total price and any
                  supplier terms shown in my quote.
                </span>
              </label>

              <label className="flex gap-3">
                <input
                  required
                  name="terms_accepted"
                  value="yes"
                  type="checkbox"
                  className="mt-1 h-5 w-5"
                />
                <span className="text-sm leading-6 text-gray-800">
                  I accept that once confirmed, this hotel booking cannot be
                  cancelled, changed, transferred or refunded unless required by
                  law or unless the booked accommodation is not provided as
                  confirmed.
                </span>
              </label>

              <label className="flex gap-3">
                <input
                  required
                  name="payment_understood"
                  value="yes"
                  type="checkbox"
                  className="mt-1 h-5 w-5"
                />
                <span className="text-sm leading-6 text-gray-800">
                  I understand that payment does not automatically confirm the
                  booking until Hotel Rate Check receives supplier confirmation.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#071526] px-6 py-4 text-base font-bold text-white hover:bg-[#b88434]"
            >
              Accept quote terms
            </button>

            <p className="text-center text-sm text-gray-600">
              After you submit this form, we will review it and send the secure
              payment link if the quoted rate is still available.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}