import type { Metadata } from "next";
import Link from "next/link";
import { publicSearch, type PublicSearchResult } from "@/lib/booking/public";
import { parseRoomsParam, toPaxRooms, encodeRooms, occupancySummary } from "@/lib/booking/occupancy";
import OccupancyPicker from "@/app/components/OccupancyPicker";

export const metadata: Metadata = {
  title: "Search results | Hotel Rate Check",
  description: "Live hotel rates for your dates.",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

const fieldLabel = "block text-[11px] font-bold uppercase tracking-wide text-gray-500";
const fieldInput =
  "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#b88434] focus:ring-2 focus:ring-[#d8a84f]/30";

function money(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function mealLabel(meal: string): string {
  if (!meal) return "Room only";
  return meal.replace(/_/g, " ");
}

function first(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const destination = first(sp.destination);
  const checkIn = first(sp.checkIn);
  const checkOut = first(sp.checkOut);
  const roomsParam = first(sp.rooms) || first(sp.adults); // accept legacy ?adults=
  const rooms = parseRoomsParam(roomsParam || undefined);
  const encodedRooms = encodeRooms(rooms);
  const summary = occupancySummary(rooms);

  const hasQuery = Boolean(destination && checkIn && checkOut);

  let result: PublicSearchResult | null = null;
  let error: string | null = null;
  if (hasQuery) {
    try {
      result = await publicSearch({ destination, checkIn, checkOut, paxRooms: toPaxRooms(rooms) });
    } catch (e) {
      error = e instanceof Error ? e.message : "Search failed";
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
      {/* Search bar */}
      <section className="bg-[#0b1b2e] px-6 py-8 text-white">
        <form action="/search" method="GET" className="mx-auto grid max-w-5xl gap-3 md:grid-cols-5">
          <label className="md:col-span-2">
            <span className={fieldLabel + " text-white/60"}>Hotel / destination</span>
            <input name="destination" defaultValue={destination} placeholder="e.g. Hilton London" required className={fieldInput} />
          </label>
          <label>
            <span className={fieldLabel + " text-white/60"}>Check-in</span>
            <input name="checkIn" type="date" defaultValue={checkIn} required className={fieldInput} />
          </label>
          <label>
            <span className={fieldLabel + " text-white/60"}>Check-out</span>
            <input name="checkOut" type="date" defaultValue={checkOut} required className={fieldInput} />
          </label>
          <OccupancyPicker initial={rooms} />
          <div className="md:col-span-5">
            <button className="rounded-xl bg-[#d8a84f] px-6 py-3 text-sm font-bold text-[#071526] transition hover:bg-[#f0c76b]">
              Search
            </button>
          </div>
        </form>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        {!hasQuery && (
          <p className="text-gray-700">Enter a hotel or destination and your dates to see live rates.</p>
        )}

        {hasQuery && error && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-900">
            <p className="font-bold">We couldn’t complete that search.</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {hasQuery && !error && result?.status === "no_availability" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="font-bold">No rooms available for those dates.</p>
            <p className="mt-1 text-sm text-gray-600">Try different dates or another hotel.</p>
          </div>
        )}

        {hasQuery && !error && result?.status === "ok" && (
          <div className="space-y-8">
            <p className="text-sm text-gray-600">
              Showing live rates for {checkIn} → {checkOut} · {summary}.
            </p>
            {result.hotels.map((hotel) => (
              <div key={hotel.hotelCode} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
                <div className="border-b border-gray-100 px-6 py-4">
                  <h2 className="text-xl font-black">{hotel.hotelName}</h2>
                </div>
                <ul className="divide-y divide-gray-100">
                  {hotel.rooms.map((room) => (
                    <li key={room.bookingCode} className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-bold">{room.name}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          {mealLabel(room.mealType)} ·{" "}
                          <span className={room.isRefundable ? "text-green-700" : "text-gray-500"}>
                            {room.isRefundable ? "Refundable" : "Non-refundable"}
                          </span>
                        </p>
                        {room.payAtHotel.length > 0 && (
                          <p className="mt-1 text-xs text-gray-500">
                            Plus payable at the hotel:{" "}
                            {room.payAtHotel.map((c) => `${c.description} (${money(c.price, c.currency)})`).join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 md:flex-col md:items-end">
                        <div className="text-right">
                          <p className="text-2xl font-black">{money(room.sellPrice, room.currency)}</p>
                          <p className="text-[11px] text-gray-500">total · taxes included</p>
                        </div>
                        <Link
                          href={{
                            pathname: "/book",
                            query: {
                              bookingCode: room.bookingCode,
                              hotel: hotel.hotelName,
                              checkIn,
                              checkOut,
                              rooms: encodedRooms,
                            },
                          }}
                          className="rounded-full bg-[#071526] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#b88434]"
                        >
                          Book
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-xs text-gray-500">
              Prices are live and can change until your booking is confirmed. The full price and cancellation terms are shown before you pay.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
