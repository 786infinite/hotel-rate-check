import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Hotel Rate Check",
  description:
    "Terms and conditions for using Hotel Rate Check hotel rate checking services.",
};

export default function TermsPage() {
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
            Terms & Conditions
          </h1>

          <p className="mt-4 text-sm text-gray-600">
            Last updated: 27 May 2026
          </p>

          <div className="mt-8 space-y-8 text-base leading-7 text-gray-800">
            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                1. About Hotel Rate Check
              </h2>
              <p className="mt-3">
                Hotel Rate Check provides an online hotel booking service.
                Customers can book hotel accommodation online, with rates
                sourced through our supply partners and the full price and terms
                shown before payment.
              </p>
              <p className="mt-3">
                We only deal with hotel accommodation. We do not sell flights,
                transfers, car hire, sightseeing, excursions, package holidays
                or linked travel arrangements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                2. Availability and pricing
              </h2>
              <p className="mt-3">
                Rates and availability are live and can change. We do not guarantee
                that a particular price will be available, that a rate will stay
                available, or that every hotel or room type can be supplied.
              </p>
              <p className="mt-3">
                Any quote we provide is subject to live availability, supplier
                terms, pricing changes and final confirmation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                3. Quotes and availability
              </h2>
              <p className="mt-3">
                A quote is not a confirmed booking. A hotel booking is only
                confirmed after you have accepted the quote, paid the required
                amount, and we have received supplier confirmation.
              </p>
              <p className="mt-3">
                Prices can change before payment and confirmation. If a quoted
                rate is no longer available before confirmation, we may offer an
                alternative rate or you may choose not to proceed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                4. Customer responsibility
              </h2>
              <p className="mt-3">
                You are responsible for checking that all booking details are
                correct before payment, including hotel name, destination,
                check-in date, check-out date, number of guests, room type,
                board basis, cancellation terms and total price.
              </p>
              <p className="mt-3">
                You must also make sure that all guests have suitable travel
                documents, visas, permissions, insurance and any other
                requirements needed for the destination or hotel.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                5. Payment and confirmation
              </h2>
              <p className="mt-3">
                If you choose to proceed with a quote, we may send you a secure
                payment link or agreed payment instructions. Payment does not
                automatically guarantee confirmation until the supplier confirms
                the hotel booking.
              </p>
              <p className="mt-3">
                If payment is received but the hotel rate is no longer
                available, we will contact you with the available options. If no
                suitable option is accepted, the payment for that unconfirmed
                booking will be refunded.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                6. Cancellations, changes and refunds
              </h2>
              <p className="mt-3">
                Many of the best available hotel rates may be non-refundable,
                non-changeable and non-transferable.
              </p>
              <p className="mt-3 font-semibold text-[#071526]">
                Once confirmed, hotel bookings cannot be cancelled, changed,
                transferred or refunded unless required by law or unless the
                booked accommodation is not provided as confirmed.
              </p>
              <p className="mt-3">
                Any cancellation or amendment request will be subject to the
                supplier and hotel terms attached to your confirmed booking.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                7. Local taxes and hotel charges
              </h2>
              <p className="mt-3">
                Some hotels or destinations charge local taxes, resort fees,
                security deposits, city taxes or other charges payable directly
                at the hotel. These charges may not always be included in the
                quoted rate.
              </p>
              <p className="mt-3">
                We will try to make important charges clear where available, but
                you remain responsible for checking hotel and destination
                requirements before travel.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                8. Hotel standards and special requests
              </h2>
              <p className="mt-3">
                Hotel star ratings, facilities, images and descriptions may be
                provided by suppliers, hotels or third parties. We cannot
                guarantee that every facility will be available at all times.
              </p>
              <p className="mt-3">
                Special requests such as bed type, room location, connecting
                rooms, early check-in or late check-out are requests only unless
                confirmed in writing by the supplier or hotel.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                9. Our responsibility
              </h2>
              <p className="mt-3">
                We will provide our service with reasonable care and skill. We
                are not responsible for losses caused by incorrect information
                supplied by you, supplier failure outside our control, hotel
                operational decisions, travel disruption, visa issues or events
                outside our reasonable control.
              </p>
              <p className="mt-3">
                Nothing in these terms limits any rights you have under
                applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#071526]">
                10. Contact
              </h2>
              <p className="mt-3">
                For questions about these terms, contact us at{" "}
                <a
                  href="mailto:quotes@hotelratecheck.com"
                  className="font-semibold text-[#b88434] underline"
                >
                  quotes@hotelratecheck.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
