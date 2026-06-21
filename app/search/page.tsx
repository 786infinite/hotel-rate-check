import type { Metadata } from "next";
import { Suspense } from "react";
import { publicSearch, nightsBetween, type PublicSearchResult } from "@/lib/booking/public";
import { parseRoomsParam, toPaxRooms, encodeRooms, occupancySummary } from "@/lib/booking/occupancy";
import OccupancyPicker from "@/app/components/OccupancyPicker";
import ResultsList, { type ResultRow } from "@/app/components/ResultsList";
import ResultsSkeleton from "@/app/components/ResultsSkeleton";

export const metadata: Metadata = {
  title: "Search results | Hotel Rate Check",
  description: "Live hotel rates for your dates.",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

const fieldLabel = "block text-[11px] font-bold uppercase tracking-wide text-gray-500";
const fieldInput =
  "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#b88434] focus:ring-2 focus:ring-[#d8a84f]/30";

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
        {!hasQuery ? (
          <p className="text-gray-700">Enter a hotel or destination and your dates to see live rates.</p>
        ) : (
          <Suspense key={`${destination}|${checkIn}|${checkOut}|${board}|${encodedRooms}`} fallback={<ResultsSkeleton />}>
            <SearchResults
              destination={destination} checkIn={checkIn} checkOut={checkOut}
              rooms={rooms} board={board} nights={nights} summary={summary} encodedRooms={encodedRooms}
            />
          </Suspense>
        )}
      </section>
    </main>
  );
}

async function SearchResults({
  destination, checkIn, checkOut, rooms, board, nights, summary, encodedRooms,
}: {
  destination: string; checkIn: string; checkOut: string;
  rooms: ReturnType<typeof parseRoomsParam>; board: string;
  nights: number; summary: string; encodedRooms: string;
}) {
  let result: PublicSearchResult | null = null;
  let error: string | null = null;
  try {
    result = await publicSearch({
      destination, checkIn, checkOut,
      paxRooms: toPaxRooms(rooms),
      mealPlan: board === "RoomOnly" || board === "WithMeal" ? board : undefined,
    });
  } catch (e) {
    error = e instanceof Error ? e.message : "Search failed";
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-900">
        <p className="font-bold">We couldn’t complete that search.</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }
  if (!result || result.status === "no_availability") {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="font-bold">No rooms available for those dates.</p>
        <p className="mt-1 text-sm text-gray-600">Try different dates or another hotel.</p>
      </div>
    );
  }

  const rows: ResultRow[] = result.hotels.flatMap((h) =>
    h.rooms.map((r) => ({
      hotelCode: h.hotelCode, hotelName: h.hotelName, image: h.image,
      starRating: h.starRating, address: h.address,
      bookingCode: r.bookingCode, roomName: r.name, mealType: r.mealType,
      isRefundable: r.isRefundable, sellPrice: r.sellPrice, currency: r.currency,
      payAtHotel: r.payAtHotel,
    })),
  );

  return <ResultsList rows={rows} nights={nights} summary={summary} checkIn={checkIn} checkOut={checkOut} encodedRooms={encodedRooms} />;
}
