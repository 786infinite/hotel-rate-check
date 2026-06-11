import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Received | Hotel Rate Check",
  description:
    "Your Hotel Rate Check payment has been received and your hotel booking is being processed.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentReceivedPage() {
  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
      <section className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-12">
        <div className="w-full rounded-3xl bg-white p-6 text-center shadow-xl md:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#b88434]">
            Hotel Rate Check
          </p>

          <h1 className="text-3xl font-bold md:text-5xl">
            Payment received
          </h1>

          <p className="mt-5 text-lg leading-8 text-gray-700">
            Thank you. Your payment has been received and your hotel booking is
            now being processed.
          </p>

          <div className="mt-8 rounded-2xl border border-[#b88434]/30 bg-[#f7f2e9] p-5 text-left">
            <h2 className="text-xl font-bold text-[#071526]">
              Important confirmation notice
            </h2>

            <p className="mt-3 text-gray-800">
              Your hotel booking is not confirmed until Hotel Rate Check has
              completed the booking with the supplier and received confirmation.
            </p>

            <p className="mt-3 font-semibold text-[#071526]">
              Please do not make non-refundable travel arrangements until you
              receive your hotel confirmation or voucher from us.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 text-left">
            <h2 className="text-xl font-bold text-[#071526]">
              What happens next?
            </h2>

            <ol className="mt-3 list-decimal space-y-2 pl-5 text-gray-800">
              <li>We verify the payment.</li>
              <li>We check the quoted rate is still available.</li>
              <li>We complete the hotel booking with the supplier.</li>
              <li>We email your confirmation or voucher.</li>
            </ol>
          </div>

          <p className="mt-6 text-sm leading-6 text-gray-600">
            If you need to contact us, email{" "}
            <a
              href="mailto:quotes@hotelratecheck.com"
              className="font-semibold text-[#b88434] underline"
            >
              quotes@hotelratecheck.com
            </a>
            .
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-[#071526] px-6 py-3 text-sm font-bold text-white hover:bg-[#b88434]"
          >
            Back to homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
