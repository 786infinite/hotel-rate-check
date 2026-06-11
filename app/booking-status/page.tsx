import type { Metadata } from "next";
import { Suspense } from "react";
import BookingStatusClient from "./BookingStatusClient";

export const metadata: Metadata = {
  title: "Booking Status | Hotel Rate Check",
  description: "Track the status of your Hotel Rate Check booking.",
  robots: { index: false, follow: false, nocache: true },
};

export default function BookingStatusPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
          <section className="mx-auto max-w-3xl px-6 py-12">
            <div className="rounded-3xl bg-white p-6 shadow-xl md:p-10">
              <p className="text-lg font-semibold">Loading booking status…</p>
            </div>
          </section>
        </main>
      }
    >
      <BookingStatusClient />
    </Suspense>
  );
}
