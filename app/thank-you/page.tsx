import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You | Hotel Rate Check",
  description: "Your hotel rate check request has been received.",
  robots: { index: false, follow: false, nocache: true },
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#071526] px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 text-[#071526] shadow-2xl">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b88434]">
          Request received
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight">
          Thank you — your hotel rate check has been sent
        </h1>

        <p className="mt-5 text-lg leading-8 text-gray-700">
          We’ll check the hotel details you submitted and contact you if a
          suitable rate is available.
        </p>

        <p className="mt-4 text-base leading-7 text-gray-600">
          No booking has been made. Prices are live and subject to availability
          until confirmed.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-[#d8a84f] px-7 py-4 font-black text-[#071526] hover:bg-[#f0c76b]"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
