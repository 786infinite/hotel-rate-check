import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: "Quote Acceptance Received | Hotel Rate Check",
  description:
    "Your Hotel Rate Check quote acceptance has been received.",
};

export default function QuoteAcceptedPage() {
  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
      <section className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-12">
        <div className="w-full rounded-3xl bg-white p-6 text-center shadow-xl md:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#b88434]">
            Hotel Rate Check
          </p>

          <h1 className="text-3xl font-bold md:text-5xl">
            Quote acceptance received
          </h1>

          <p className="mt-5 text-lg leading-8 text-gray-700">
            Thank you. We have received your quote acceptance.
          </p>

          <div className="mt-8 rounded-2xl border border-[#b88434]/30 bg-[#f7f2e9] p-5 text-left">
            <h2 className="text-xl font-bold text-[#071526]">
              What happens next?
            </h2>
            <p className="mt-3 text-gray-800">
              We will check that the quoted hotel rate is still available. If it
              is available, we will send you the secure payment link.
            </p>
            <p className="mt-3 font-semibold text-[#071526]">
              Your booking is not confirmed until payment has been completed and
              supplier confirmation has been received.
            </p>
          </div>

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
