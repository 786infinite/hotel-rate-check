/**
 * POST /api/tbo/search  (INTERNAL — protected by Basic Auth in middleware)
 *
 * Thin wrapper over TBO Search for the internal rate-search dashboard.
 * Returns net cost AND computed customer sell price per room (internal use only —
 * net rates must never reach a customer-facing page).
 *
 * In TBO_MOCK=1 mode this returns spec fixtures with no credentials/network.
 */

import { NextResponse } from "next/server";
import * as tbo from "@/lib/tbo";

// lib/tbo uses Buffer (Basic Auth) — force the Node.js runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SearchBody {
  CheckIn: string;
  CheckOut: string;
  HotelCodes: string;
  GuestNationality: string;
  PaxRooms: tbo.PaxRoom[];
  Filters?: { MealType?: tbo.MealPlan };
  markupPct?: number;
}

export async function POST(request: Request) {
  let body: SearchBody;
  try {
    body = (await request.json()) as SearchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const fields = body as unknown as Record<string, unknown>;
  const missing = ["CheckIn", "CheckOut", "HotelCodes", "GuestNationality", "PaxRooms"].filter(
    (k) => !fields[k],
  );
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required field(s): ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const res = await tbo.search({
      CheckIn: body.CheckIn,
      CheckOut: body.CheckOut,
      HotelCodes: body.HotelCodes,
      GuestNationality: body.GuestNationality,
      PaxRooms: body.PaxRooms,
      IsDetailedResponse: false,
      Filters: body.Filters?.MealType ? { MealType: body.Filters.MealType } : undefined,
    });

    if (res.Status.Code === tbo.TBO_STATUS.NO_AVAILABILITY) {
      return NextResponse.json({ status: "no_availability", hotels: [] });
    }

    const hotels = (res.HotelResult ?? []).map((hotel) => ({
      hotelCode: hotel.HotelCode,
      currency: hotel.Currency,
      rooms: hotel.Rooms.map((room) => {
        const price = tbo.priceForCustomer(room, hotel.Currency, body.markupPct);
        return {
          name: room.Name,
          bookingCode: room.BookingCode,
          mealType: room.MealType,
          isRefundable: room.IsRefundable,
          netCost: room.TotalFare,
          sellPrice: price.sellPrice,
          recommendedSellingRate: room.RecommendedSellingRate ?? null,
          clampedToFloor: price.clampedToFloor,
          payAtHotel: price.payAtHotel,
        };
      }),
    }));

    return NextResponse.json({ status: "ok", hotels });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed";
    const tboCode = err instanceof tbo.TboApiError ? err.tboCode : undefined;
    return NextResponse.json({ error: message, tboCode }, { status: 502 });
  }
}
