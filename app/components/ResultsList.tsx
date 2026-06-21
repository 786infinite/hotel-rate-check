"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import SmartImage from "@/app/components/SmartImage";
import { CheckIcon, StarIcon } from "@/app/components/icons";

const ResultsMap = dynamic(() => import("./ResultsMap"), {
  ssr: false,
  loading: () => <div className="h-[520px] w-full animate-pulse rounded-3xl bg-[#e9e1d2]" />,
});

export interface ResultRow {
  hotelCode: string;
  hotelName: string;
  image: string;
  starRating?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  bookingCode: string;
  roomName: string;
  mealType: string;
  isRefundable: boolean;
  sellPrice: number;
  currency: string;
  payAtHotel: { description: string; price: number; currency: string }[];
}

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

type Sort = "priceAsc" | "priceDesc";
interface RoomType { name: string; rates: ResultRow[]; lead: ResultRow }
interface HotelGroup {
  hotelCode: string; hotelName: string; image: string;
  starRating?: number; address?: string;
  latitude?: number; longitude?: number;
  lead: ResultRow; rateCount: number; anyRefundable: boolean; roomTypes: RoomType[];
}

export default function ResultsList({
  rows, nights, summary, checkIn, checkOut, encodedRooms,
}: {
  rows: ResultRow[]; nights: number; summary: string;
  checkIn: string; checkOut: string; encodedRooms: string;
}) {
  const [sort, setSort] = useState<Sort>("priceAsc");
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<"list" | "map">("list");

  const groups = useMemo<HotelGroup[]>(() => {
    const filtered = refundableOnly ? rows.filter((r) => r.isRefundable) : rows;
    const byHotel = new Map<string, ResultRow[]>();
    for (const r of filtered) {
      const arr = byHotel.get(r.hotelCode) ?? [];
      arr.push(r);
      byHotel.set(r.hotelCode, arr);
    }
    const out: HotelGroup[] = [];
    for (const [code, opts] of byHotel) {
      const byRoom = new Map<string, ResultRow[]>();
      for (const o of opts) {
        const arr = byRoom.get(o.roomName) ?? [];
        arr.push(o);
        byRoom.set(o.roomName, arr);
      }
      const roomTypes: RoomType[] = [...byRoom.entries()].map(([name, rates]) => {
        rates.sort((a, b) => a.sellPrice - b.sellPrice);
        return { name, rates, lead: rates[0] };
      });
      roomTypes.sort((a, b) => a.lead.sellPrice - b.lead.sellPrice);
      const lead = roomTypes[0].lead;
      out.push({
        hotelCode: code, hotelName: opts[0].hotelName, image: opts[0].image,
        starRating: opts[0].starRating, address: opts[0].address,
        latitude: opts[0].latitude, longitude: opts[0].longitude,
        lead, rateCount: opts.length, anyRefundable: opts.some((o) => o.isRefundable), roomTypes,
      });
    }
    out.sort((a, b) => (sort === "priceAsc" ? a.lead.sellPrice - b.lead.sellPrice : b.lead.sellPrice - a.lead.sellPrice));
    return out;
  }, [rows, refundableOnly, sort]);

  const isFiltered = refundableOnly || sort !== "priceAsc";
  const perNight = (r: ResultRow) => (nights > 0 ? money(r.sellPrice / nights, r.currency) : money(r.sellPrice, r.currency));

  function bookHref(row: ResultRow) {
    return { pathname: "/book", query: { bookingCode: row.bookingCode, hotel: row.hotelName, checkIn, checkOut, rooms: encodedRooms } };
  }

  const mapHotels = groups
    .filter((g) => g.latitude != null && g.longitude != null)
    .map((g) => ({ hotelCode: g.hotelCode, hotelName: g.hotelName, lat: g.latitude as number, lng: g.longitude as number, priceLabel: money(g.lead.sellPrice, g.lead.currency) }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-600">Showing live rates for {checkIn} → {checkOut} · {summary}.</p>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-[#1d6b3f]">
          <CheckIcon className="h-4 w-4" /> Every price includes all taxes &amp; fees. Anything payable at the hotel is shown on the rate.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-y border-[#ece4d6] py-3">
        <span aria-live="polite" className="text-sm font-bold text-[#071526]">
          {groups.length} hotel{groups.length === 1 ? "" : "s"}
        </span>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-[#071526] outline-none focus:border-[#b88434]">
            <option value="priceAsc">Price (low to high)</option>
            <option value="priceDesc">Price (high to low)</option>
          </select>
        </label>
        <button type="button" aria-pressed={refundableOnly} onClick={() => setRefundableOnly((v) => !v)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${refundableOnly ? "bg-[#1d6b3f] text-white" : "border border-gray-300 text-gray-700 hover:border-[#b88434]"}`}>
          Free cancellation only
        </button>
        {isFiltered && (
          <button type="button" onClick={() => { setRefundableOnly(false); setSort("priceAsc"); }} className="text-sm font-semibold text-[#b88434] hover:underline">Clear</button>
        )}
        <div className="ml-auto inline-flex overflow-hidden rounded-full border border-gray-300">
          <button type="button" onClick={() => setView("list")} aria-pressed={view === "list"}
            className={`px-4 py-1.5 text-sm font-semibold ${view === "list" ? "bg-[#0b1b2e] text-white" : "text-gray-700"}`}>List</button>
          <button type="button" onClick={() => setView("map")} aria-pressed={view === "map"}
            className={`px-4 py-1.5 text-sm font-semibold ${view === "map" ? "bg-[#0b1b2e] text-white" : "text-gray-700"}`}>Map</button>
        </div>
      </div>

      {view === "map" ? (
        mapHotels.length ? (
          <ResultsMap hotels={mapHotels} />
        ) : (
          <p className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">Map view needs hotel location data, which arrives with live content. Showing the list for now.</p>
        )
      ) : groups.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
          No rooms match these filters. <button type="button" onClick={() => setRefundableOnly(false)} className="font-semibold text-[#b88434] hover:underline">Clear filters</button>.
        </p>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => {
            const open = !!expanded[g.hotelCode];
            return (
              <article key={g.hotelCode} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#ece4d6]">
                <div className="grid md:grid-cols-[240px_1fr_230px]">
                  <div className="relative min-h-[180px] overflow-hidden bg-gradient-to-br from-[#15324f] to-[#0a1c30]">
                    <SmartImage src={g.image} alt={g.hotelName} sizes="240px" className="object-cover" />
                    {g.anyRefundable && (
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#1d6b3f]">Free cancellation available</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-semibold leading-tight">{g.hotelName}</h3>
                    {g.starRating ? (
                      <div className="mt-1 flex items-center gap-0.5" aria-label={`${g.starRating}-star hotel`}>
                        {Array.from({ length: g.starRating }).map((_, i) => <StarIcon key={i} className="h-4 w-4 text-[#d8a84f]" />)}
                      </div>
                    ) : null}
                    {g.address && <p className="mt-1 text-sm text-gray-500">{g.address}</p>}
                    <p className="mt-2 text-sm text-gray-600">{g.roomTypes.length} room type{g.roomTypes.length === 1 ? "" : "s"} · {g.rateCount} rate{g.rateCount === 1 ? "" : "s"}</p>
                    <p className="mt-2 text-sm text-gray-600">Cheapest: {g.roomTypes[0].name} — {mealLabel(g.lead.mealType)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-center gap-1 border-t border-[#efe6d6] bg-[#fbf7ef] p-6 md:border-l md:border-t-0">
                    <p className="text-xs font-semibold text-gray-500">from</p>
                    <p className="font-display text-3xl font-semibold tabular-nums">{money(g.lead.sellPrice, g.lead.currency)}</p>
                    <p className="text-[11px] text-gray-500 tabular-nums">{perNight(g.lead)} / night · all-in</p>
                    <button type="button" onClick={() => setExpanded((s) => ({ ...s, [g.hotelCode]: !open }))}
                      aria-expanded={open}
                      className="mt-3 w-full rounded-full bg-[#d8a84f] px-6 py-3 text-center text-sm font-bold text-[#071526] transition hover:bg-[#f0c76b]">
                      {open ? "Hide rooms" : `View rooms (${g.rateCount})`}
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="border-t border-[#ece4d6] bg-[#fbf8f1] px-6 py-5">
                    {g.roomTypes.map((rt) => (
                      <div key={rt.name} className="mb-5 last:mb-0">
                        <p className="font-display text-lg font-semibold">{rt.name}</p>
                        <ul className="mt-2 divide-y divide-[#efe6d6]">
                          {rt.rates.map((r) => (
                            <li key={r.bookingCode} className="flex flex-wrap items-center justify-between gap-3 py-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-lg bg-[#f1ece1] px-2.5 py-1 text-xs font-semibold text-[#6a5326]">{mealLabel(r.mealType)}</span>
                                <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${r.isRefundable ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{r.isRefundable ? "Refundable" : "Non-refundable"}</span>
                                {r.payAtHotel.length > 0 && <span className="rounded-lg bg-[#f1ece1] px-2.5 py-1 text-xs font-semibold text-[#6a5326]">Taxes at hotel</span>}
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="font-semibold tabular-nums">{money(r.sellPrice, r.currency)}</p>
                                  <p className="text-[11px] text-gray-500 tabular-nums">{perNight(r)} / night</p>
                                </div>
                                <Link href={bookHref(r)} className="rounded-full bg-[#0b1b2e] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#b88434]">Book</Link>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
