import type { Metadata } from "next";
import Link from "next/link";
import { publicSearch, nightsBetween, type PublicSearchResult } from "@/lib/booking/public";
import { parseRoomsParam, toPaxRooms, encodeRooms, occupancySummary } from "@/lib/booking/occupancy";
import OccupancyPicker from "@/app/components/OccupancyPicker";
import SmartImage from "@/app/components/SmartImage";

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
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const board = first(sp.board);

  const hasQuery = Boolean(destination && checkIn && checkOut);

  let result: PublicSearchResult | null = null;
  let error: string | null = null;
  if (hasQuery) {
    try {
      result = await publicSearch({
        destination,
        checkIn,
        checkOut,
        paxRooms: toPaxRooms(rooms),
        mealPlan: board === "RoomOnly" || board === "WithMeal" ? board : undefined,
      });
    } catch (e) {
      error = e instanceof Error ? e.message : "Search failed";
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
      {/* Search bar */}
      <section className="bg-[#0b1b2e] px-6 py-8 text-white">
        <form action="/search" method="GET" className="mx-auto grid max-w-6xl gap-3 md:grid-cols-6">
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
          <label>
            <span className={fieldLabel + " text-white/60"}>Board</span>
            <select name="board" defaultValue={board || "All"} className={fieldInput}>
              <option value="All">Any board</option>
              <option value="RoomOnly">Room only</option>
              <option value="WithMeal">With meals</option>
            </select>
          </label>
          <OccupancyPicker initial={rooms} />
          <div className="md:col-span-6">
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
            {result.hotels.flatMap((hotel) =>
              hotel.rooms.map((room) => (
                <article
                  key={room.bookingCode}
                  className="grid overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#ece4d6] md:grid-cols-[240px_1fr_230px]"
                >
                  <div className="relative min-h-[200px] overflow-hidden bg-gradient-to-br from-[#15324f] to-[#0a1c30]">
                    <SmartImage src={hotel.image} alt={hotel.hotelName} sizes="240px" className="object-cover" />
                    {room.isRefundable && (
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#1d6b3f]">
                        Free cancellation
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-2xl font-semibold leading-tight">{hotel.hotelName}</h3>
                    <p className="mt-1 text-sm text-gray-600">{room.name}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-lg bg-[#f1ece1] px-2.5 py-1 text-xs font-semibold text-[#6a5326]">{mealLabel(room.mealType)}</span>
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${room.isRefundable ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {room.isRefundable ? "Refundable" : "Non-refundable"}
                      </span>
                      {room.payAtHotel.length > 0 && (
                        <span className="rounded-lg bg-[#f1ece1] px-2.5 py-1 text-xs font-semibold text-[#6a5326]">Taxes at hotel</span>
                      )}
                    </div>
                    {room.payAtHotel.length > 0 && (
                      <p className="mt-3 text-xs text-gray-500">
                        Payable at the hotel:{" "}
                        {room.payAtHotel.map((c) => `${c.description} (${money(c.price, c.currency)})`).join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end justify-center gap-1 border-t border-[#efe6d6] bg-[#fbf7ef] p-6 md:border-l md:border-t-0">
                    <p className="text-xs font-semibold text-gray-500">
                      {nights > 0 ? `Total (${nights} night${nights === 1 ? "" : "s"})` : "Total"}
                    </p>
                    <p className="font-display text-3xl font-semibold">{money(room.sellPrice, room.currency)}</p>
                    {nights > 0 && (
                      <p className="text-[11px] text-gray-500">{money(room.sellPrice / nights, room.currency)} / night · taxes incl.</p>
                    )}
                    <Link
                      href={{
                        pathname: "/book",
                        query: { bookingCode: room.bookingCode, hotel: hotel.hotelName, checkIn, checkOut, rooms: encodedRooms },
                      }}
                      className="mt-3 w-full rounded-full bg-[#d8a84f] px-6 py-3 text-center text-sm font-bold text-[#071526] transition hover:bg-[#f0c76b]"
                    >
                      Book now →
                    </Link>
                  </div>
                </article>
              )),
            )}
            <p className="text-xs text-gray-500">
              Prices are live and can change until your booking is confirmed. The full price and cancellation terms are shown before you pay.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
