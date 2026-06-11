import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | Hotel Rate Check",
  description:
    "Contact Hotel Rate Check for hotel booking enquiries, quotes and support.",
};

export default function ContactPage() {
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

          <h1 className="text-3xl font-bold md:text-5xl">Contact us</h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-700">
            Send us your hotel and dates and we will confirm available rates and
            a secure link to complete your booking online, with the full price
            and terms shown before you pay.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-[#f7f2e9] p-6">
              <h2 className="text-xl font-bold text-[#071526]">
                Email enquiries
              </h2>
              <p className="mt-3 text-gray-700">
                For booking enquiries, quote questions and support,
                email:
              </p>
              <a
                href="mailto:quotes@hotelratecheck.com?subject=Hotel%20Rate%20Check%20enquiry"
                className="mt-4 inline-flex font-bold text-[#b88434] underline"
              >
                quotes@hotelratecheck.com
              </a>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#f7f2e9] p-6">
              <h2 className="text-xl font-bold text-[#071526]">
                Book a hotel
              </h2>
              <p className="mt-3 text-gray-700">
                The quickest way to start a booking is to use the form on
                our homepage.
              </p>
              <Link
                href="/"
                className="mt-4 inline-flex rounded-full bg-[#071526] px-5 py-3 text-sm font-bold text-white hover:bg-[#b88434]"
              >
                Go to booking form
              </Link>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#b88434]/30 bg-white p-6">
            <h2 className="text-xl font-bold text-[#071526]">
              Before you contact us
            </h2>
            <p className="mt-3 text-gray-700">
              Please include the hotel name, destination, check-in date,
              check-out date, number of guests, room type if known, and the
              total price you found.
            </p>
            <p className="mt-3 font-semibold text-[#071526]">
              We provide hotel accommodation only. We do not sell flights,
              transfers, car hire, sightseeing or package holidays.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-[#f7f2e9] p-6">
            <h2 className="text-xl font-bold text-[#071526]">Company details</h2>
            <p className="mt-3 text-gray-700">
              Hotel Rate Check is a trading name of 786 Infinite Ltd, a company
              registered in England and Wales.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
