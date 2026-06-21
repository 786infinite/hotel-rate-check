import type { Metadata } from "next";
import Link from "next/link";
import { publicSearch, nightsBetween, type PublicHotel } from "@/lib/booking/public";
import { parseRoomsParam, toPaxRooms, encodeRooms } from "@/lib/booking/occupancy";
import { getHotelIndex } from "@/lib/booking/destination";
import HotelGallery from "@/app/components/HotelGallery";
import HotelMapClient from "@/app/components/HotelMapClient";
import { StarIcon, CheckIcon } from "@/app/components/icons";

export const metadata: Metadata = {
  title: "Hotel details | Hotel Rate Check",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

function first(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}
function money(amount: number, currency: string): string {
  try { return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amount); }
  catch { return `${currency} ${amount.toFixed(2)}`; }
}
function mealLabel(meal: string): string { return meal ? meal.replace(/_/g, " ") : "Room only"; }

export default async function HotelDetailPage({
  params, searchParams,
}: {
  params: Promise<{ hotelCode: string }>;
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const { hotelCode } = await params;
  const sp = await searchParams;
  const checkIn = first(sp.checkIn);
  const checkOut = first(sp.checkOut);
  const rooms = parseRoomsParam(first(sp.rooms) || undefined);
  const encodedRooms = encodeRooms(rooms);
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const hasDates = Boolean(checkIn && checkOut);

  const content = await getHotelIndex().content(hotelCode);

  let hotel: PublicHotel | undefined;
  if (hasDates) {
    try {
      const res = await publicSearch({ destination: hotelCode, checkIn, checkOut, paxRooms: toPaxRooms(rooms) });
      hotel = res.hotels.find((h) => h.hotelCode === hotelCode) ?? res.hotels[0];
    } catch { /* show content without live rooms */ }
  }

  const name = content?.name ?? hotel?.hotelName ?? `Hotel ${hotelCode}`;
  const images = (hotel?.images && hotel.images.length ? hotel.images : content?.images) ?? [];
  const amenities = hotel?.amenities ?? content?.amenities ?? [];
  const description = hotel?.description ?? content?.description;
  const starRating = hotel?.starRating ?? content?.starRating;
  const address = hotel?.address ?? content?.address;
  const lat = hotel?.latitude ?? content?.latitude;
  const lng = hotel?.longitude ?? content?.longitude;

  // Group rooms by room type
  const groups = new Map<string, PublicHotel["rooms"]>();
  for (const r of hotel?.rooms ?? []) {
    const arr = groups.get(r.name) ?? [];
    arr.push(r);
    groups.set(r.name, arr);
  }
  const roomTypes = [...groups.entries()].map(([rn, rates]) => ({
    name: rn,
    rates: rates.slice().sort((a, b) => a.sellPrice - b.sellPrice),
  }));

  return (
    <main className="bg-[#f7f2e9] text-[#071526]">
      <section className="mx-auto max-w-5xl px-6 py-8">
        <Link href="/search" className="text-sm font-semibold text-[#b88434] hover:underline">← Back to results</Link>

        <div className="mt-4">
          {images.length ? (
            <HotelGallery images={images} alt={name} />
          ) : (
            <div className="flex h-[260px] w-full items-center justify-center rounded-3xl bg-gradient-to-br from-[#15324f] to-[#0a1c30] text-white/60">Photos coming soon</div>
          )}
        </div>

        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_320px]">
          <div>
            <h1 className="font-display text-3xl font-semibold md:text-4xl">{name}</h1>
            {starRating ? (
              <div className="mt-1 flex items-center gap-0.5" aria-label={`${starRating}-star hotel`}>
                {Array.from({ length: starRating }).map((_, i) => <StarIcon key={i} className="h-4 w-4 text-[#d8a84f]" />)}
              </div>
            ) : null}
            {address && <p className="mt-2 text-gray-600">{address}</p>}
            {description && <p className="mt-4 leading-7 text-gray-700">{description}</p>}

            {amenities.length > 0 && (
              <div className="mt-6">
                <h2 className="font-display text-xl font-semibold">Amenities</h2>
                <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700 sm:grid-cols-3">
                  {amenities.map((a) => (
                    <li key={a} className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-[#b88434]" /> {a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside>
            {lat != null && lng != null && (
              <HotelMapClient hotels={[{ hotelCode, hotelName: name, lat, lng, priceLabel: roomTypes[0] ? money(roomTypes[0].rates[0].sellPrice, roomTypes[0].rates[0].currency) : name }]} />
            )}
          </aside>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-2xl font-semibold">Rooms</h2>
          {!hasDates ? (
            <p className="mt-3 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
              Add your dates to see live rooms and prices.{" "}
              <Link href={`/search?destination=${encodeURIComponent(name)}`} className="font-semibold text-[#b88434] hover:underline">Search dates →</Link>
            </p>
          ) : roomTypes.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600">No rooms available for these dates. <Link href="/search" className="font-semibold text-[#b88434] hover:underline">Try another search →</Link></p>
          ) : (
            <div className="mt-4 space-y-6">
              {roomTypes.map((rt) => (
                <div key={rt.name} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#ece4d6]">
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
                            {nights > 0 && <p className="text-[11px] text-gray-500 tabular-nums">{money(r.sellPrice / nights, r.currency)} / night · all-in</p>}
                          </div>
                          <Link href={{ pathname: "/book", query: { bookingCode: r.bookingCode, hotel: name, checkIn, checkOut, rooms: encodedRooms } }}
                            className="rounded-full bg-[#d8a84f] px-5 py-2.5 text-sm font-bold text-[#071526] transition hover:bg-[#f0c76b]">Book</Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="text-xs text-gray-500">Prices are live and include all taxes &amp; fees. Cancellation terms and any pay-at-hotel charges are shown before you pay.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
