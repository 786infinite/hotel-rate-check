import type { Metadata } from "next";
import Link from "next/link";
import { publicPreBook } from "@/lib/booking/public";
import { parseRoomsParam, occupancySummary } from "@/lib/booking/occupancy";
import BookingForm from "./BookingForm";

export const metadata: Metadata = {
  title: "Review & book | Hotel Rate Check",
  description: "Review your room, price and terms, then book securely.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function money(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function mealLabel(meal: string): string {
  return meal ? meal.replace(/_/g, " ") : "Room only";
}

function first(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const bookingCode = first(sp.bookingCode);
  const hotel = first(sp.hotel) || "Your hotel";
  const checkIn = first(sp.checkIn);
  const checkOut = first(sp.checkOut);
  const occupancy = occupancySummary(parseRoomsParam(first(sp.rooms)));

  const backToSearch = (
    <Link href="/#book" className="inline-flex rounded-full border border-[#b88434] px-4 py-2 text-sm font-semibold text-[#071526] hover:bg-[#b88434] hover:text-white">
      ← Search again
    </Link>
  );

  if (!bookingCode) {
    return (
      <main className="min-h-screen bg-[#f7f2e9] px-6 py-16 text-[#071526]">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-700">No room selected. Start a search to choose a room.</p>
          <div className="mt-6">{backToSearch}</div>
        </div>
      </main>
    );
  }

  let pb;
  let error: string | null = null;
  try {
    pb = await publicPreBook(bookingCode);
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not load this rate.";
  }

  if (error || !pb || !pb.sellable || !pb.room) {
    return (
      <main className="min-h-screen bg-[#f7f2e9] px-6 py-16 text-[#071526]">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-900">
            <p className="font-bold">This room isn’t available to book.</p>
            <p className="mt-1 text-sm">{error || pb?.reason || "Please choose another room."}</p>
          </div>
          <div className="mt-6">{backToSearch}</div>
        </div>
      </main>
    );
  }

  const { room } = pb;
  const priceLabel = money(room.sellPrice, room.currency);

  return (
    <main className="min-h-screen bg-[#f7f2e9] px-6 py-12 text-[#071526] md:py-16">
      <div className="mx-auto max-w-3xl">
        {backToSearch}

        <h1 className="mt-6 text-3xl font-black tracking-tight md:text-4xl">Review &amp; book</h1>

        {/* Summary */}
        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b88434]">{hotel}</p>
          <h2 className="mt-1 text-xl font-black">{room.name}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {mealLabel(room.mealType)} ·{" "}
            <span className={room.isRefundable ? "text-green-700" : "text-gray-500"}>
              {room.isRefundable ? "Refundable" : "Non-refundable"}
            </span>
            {checkIn && checkOut ? ` · ${checkIn} → ${checkOut}` : ""}
            {` · ${occupancy}`}
          </p>

          <div className="mt-4 flex items-baseline justify-between border-t border-gray-100 pt-4">
            <span className="text-sm text-gray-600">Total to pay now</span>
            <span className="text-2xl font-black">{priceLabel}</span>
          </div>

          {room.payAtHotel.length > 0 && (
            <div className="mt-4 rounded-xl bg-[#f7f2e9] p-4 text-sm">
              <p className="font-bold">Payable directly at the hotel</p>
              <ul className="mt-1 list-disc pl-5 text-gray-700">
                {room.payAtHotel.map((c, i) => (
                  <li key={i}>
                    {c.description} — {money(c.price, c.currency)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pb.cancellationPolicies.length > 0 && (
            <div className="mt-4 text-sm">
              <p className="font-bold">Cancellation</p>
              <ul className="mt-1 list-disc pl-5 text-gray-700">
                {pb.cancellationPolicies.map((c, i) => (
                  <li key={i}>
                    From {c.fromDate}: {c.chargeType === "Percentage" ? `${c.charge}%` : money(c.charge, room.currency)} charge
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pb.rateConditions.length > 0 && (
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer font-bold">Hotel conditions</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
                {pb.rateConditions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </details>
          )}
        </div>

        {/* Guest details + pay */}
        <div className="mt-6">
          <BookingForm
            bookingCode={room.bookingCode}
            hotel={hotel}
            checkIn={checkIn}
            checkOut={checkOut}
            priceLabel={priceLabel}
          />
        </div>
      </div>
    </main>
  );
}
