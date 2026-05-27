import type { Metadata } from "next";
import { Suspense } from "react";
import QuoteAcceptanceClient from "./QuoteAcceptanceClient";

export const metadata: Metadata = {
  title: "Review, Accept & Pay | Hotel Rate Check",
  description:
    "Review your Hotel Rate Check quote, accept the booking terms and continue to secure payment.",
};

export default function QuoteAcceptancePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
          <section className="mx-auto max-w-4xl px-6 py-12 md:py-16">
            <div className="rounded-3xl bg-white p-6 shadow-xl md:p-10">
              <p className="text-lg font-semibold">Loading quote...</p>
            </div>
          </section>
        </main>
      }
    >
      <QuoteAcceptanceClient />
    </Suspense>
  );
}