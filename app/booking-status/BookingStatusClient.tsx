"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface StatusResponse {
  reference: string;
  status: string;
  currency?: string;
  sellPriceMinor?: number | null;
  hotel?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  confirmationNumber?: string | null;
}

function money(minor: number | null | undefined, currency?: string): string {
  if (minor == null || !currency) return "";
  try { return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(minor / 100); }
  catch { return `${currency} ${(minor / 100).toFixed(2)}`; }
}

const COPY: Record<string, { title: string; body: string; tone: "ok" | "wait" | "warn" }> = {
  pending: { title: "Awaiting payment", body: "We haven't received your payment yet. If you've just paid, this can take a moment to update.", tone: "wait" },
  paid: { title: "Payment received", body: "Thank you. Your payment is in and your booking is being processed. We'll email your confirmation or voucher once the supplier confirms.", tone: "wait" },
  awaiting_manual_booking: { title: "Payment received", body: "Thank you. Your payment is in and we're now completing your hotel booking with the supplier. We'll email your confirmation or voucher shortly.", tone: "wait" },
  booked: { title: "Booking confirmed", body: "Your hotel booking is confirmed. Your confirmation/voucher has been emailed to you. Please check your inbox (and spam).", tone: "ok" },
  refund_due: { title: "Booking could not be completed", body: "We received your payment but couldn't complete the booking (the rate or availability changed). We're arranging a refund or an alternative and will email you. You won't be charged for a booking we couldn't make.", tone: "warn" },
  unknown: { title: "Booking not found", body: "We couldn't find a booking for this reference. If you've just paid, please wait a moment and refresh, or contact us.", tone: "warn" },
};

export default function BookingStatusClient() {
  const params = useSearchParams();
  const reference = params.get("reference")?.trim() ?? "";
  const [data, setData] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reference) return;
    try {
      const res = await fetch(`/api/payments/status?reference=${encodeURIComponent(reference)}`, { cache: "no-store" });
      const json = (await res.json()) as StatusResponse;
      setData(json);
    } catch {
      setError("Could not load booking status.");
    }
  }, [reference]);

  useEffect(() => {
    load();
    // Poll a few times in case the webhook is still processing.
    const id = setInterval(load, 5000);
    const stop = setTimeout(() => clearInterval(id), 30000);
    return () => {
      clearInterval(id);
      clearTimeout(stop);
    };
  }, [load]);

  const status = data?.status ?? "pending";
  const copy = COPY[status] ?? COPY.pending;
  const toneClass =
    copy.tone === "ok"
      ? "border-green-300 bg-green-50"
      : copy.tone === "warn"
        ? "border-amber-300 bg-amber-50"
        : "border-[#b88434]/30 bg-[#f7f2e9]";

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
      <section className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <div className="rounded-3xl bg-white p-6 shadow-xl md:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#b88434]">Hotel Rate Check</p>

          {!reference ? (
            <>
              <h1 className="text-3xl font-bold md:text-4xl">No booking reference</h1>
              <p className="mt-4 text-gray-700">This page needs a booking reference. Please use the link we sent you.</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold md:text-4xl">{copy.title}</h1>
              <p className="mt-2 text-sm text-gray-500">Reference: {reference}</p>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <div className={`mt-6 rounded-2xl border p-5 ${toneClass}`}>
                <p className="text-gray-800">{copy.body}</p>
              </div>

              {data && (data.hotel || data.sellPriceMinor != null) && (
                <dl className="mt-6 grid gap-3 rounded-2xl border border-[#e7ddcd] bg-[#fbf8f1] p-5 text-sm">
                  {data.hotel && (
                    <div className="flex justify-between gap-4"><dt className="text-gray-500">Hotel</dt><dd className="text-right font-semibold">{data.hotel}</dd></div>
                  )}
                  {data.checkIn && data.checkOut && (
                    <div className="flex justify-between gap-4"><dt className="text-gray-500">Stay</dt><dd className="text-right font-semibold">{data.checkIn} → {data.checkOut}</dd></div>
                  )}
                  {data.sellPriceMinor != null && (
                    <div className="flex justify-between gap-4"><dt className="text-gray-500">Total paid</dt><dd className="text-right font-semibold tabular-nums">{money(data.sellPriceMinor, data.currency)} <span className="font-normal text-gray-500">· all taxes &amp; fees incl.</span></dd></div>
                  )}
                  {data.confirmationNumber && (
                    <div className="flex justify-between gap-4"><dt className="text-gray-500">Hotel confirmation</dt><dd className="text-right font-semibold">{data.confirmationNumber}</dd></div>
                  )}
                  <div className="flex justify-between gap-4"><dt className="text-gray-500">Reference</dt><dd className="text-right font-semibold">{reference}</dd></div>
                </dl>
              )}

              {status !== "booked" && (
                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
                  <h2 className="text-lg font-bold">Important</h2>
                  <p className="mt-2 text-gray-800">
                    Payment does not confirm your booking until Hotel Rate Check has completed it with the supplier and
                    received confirmation. Please do not make non-refundable travel arrangements until you receive your
                    hotel confirmation or voucher from us.
                  </p>
                </div>
              )}

              <p className="mt-6 text-sm text-gray-600">
                Questions? Email{" "}
                <a href="mailto:quotes@hotelratecheck.com" className="font-semibold underline">
                  quotes@hotelratecheck.com
                </a>{" "}
                quoting your reference.
              </p>

              {["paid", "awaiting_manual_booking", "booked"].includes(status) && (
                <a href={`/receipt?reference=${encodeURIComponent(reference)}`} className="mt-4 inline-block text-sm font-semibold text-[#b88434] underline">
                  Download receipt (PDF)
                </a>
              )}
            </>
          )}

          <Link
            href="/"
            className="mt-8 inline-flex rounded-full border border-[#b88434] px-4 py-2 text-sm font-semibold text-[#071526] hover:bg-[#b88434] hover:text-white"
          >
            ← Back to homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
