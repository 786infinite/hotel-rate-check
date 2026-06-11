/**
 * POST /api/tbo/prebook  (INTERNAL — protected by Basic Auth in middleware)
 *
 * Re-validates a BookingCode immediately before quoting/payment. Returns the
 * customer-facing essentials the operator must confirm: final sell price,
 * cancellation policy, pay-at-hotel charges, rate conditions, and whether the
 * rate is sellable hotel-only (package/airline-only rates are flagged).
 *
 * In TBO_MOCK=1 mode this returns spec fixtures with no credentials/network.
 */

import { NextResponse } from "next/server";
import * as tbo from "@/lib/tbo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PreBookBody {
  BookingCode: string;
  markupPct?: number;
}

export async function POST(request: Request) {
  let body: PreBookBody;
  try {
    body = (await request.json()) as PreBookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.BookingCode) {
    return NextResponse.json({ error: "Missing BookingCode" }, { status: 400 });
  }

  try {
    const res = await tbo.preBook({ BookingCode: body.BookingCode });
    const hotel = res.HotelResult?.[0];
    if (!hotel) {
      return NextResponse.json({ error: "PreBook returned no hotel result" }, { status: 502 });
    }

    const packageOnly = tbo.isPackageOnly(hotel.RateConditions);
    const sellableRooms = tbo.filterSellableRooms(hotel);
    const room = sellableRooms[0] ?? hotel.Rooms[0];
    const price = tbo.priceForCustomer(room, hotel.Currency, body.markupPct);

    return NextResponse.json({
      status: "ok",
      sellable: !packageOnly && sellableRooms.length > 0,
      packageOnly,
      hotelCode: hotel.HotelCode,
      currency: hotel.Currency,
      room: {
        name: room.Name,
        bookingCode: room.BookingCode,
        mealType: room.MealType,
        isRefundable: room.IsRefundable,
        netCost: room.TotalFare, // internal only
        sellPrice: price.sellPrice,
        recommendedSellingRate: room.RecommendedSellingRate ?? null,
        clampedToFloor: price.clampedToFloor,
        grossMargin: Math.round((price.sellPrice - room.TotalFare) * 100) / 100,
        payAtHotel: price.payAtHotel,
        cancelPolicies: room.CancelPolicies ?? [],
      },
      rateConditions: hotel.RateConditions ?? [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PreBook failed";
    const tboCode = err instanceof tbo.TboApiError ? err.tboCode : undefined;
    const freshSearch = typeof tboCode === "number" && tbo.requiresFreshSearch(tboCode);
    return NextResponse.json({ error: message, tboCode, freshSearch }, { status: 502 });
  }
}
