/**
 * Customer-facing booking helpers (SERVER-ONLY).
 *
 * This is the single source of truth for what a customer is allowed to see.
 * It wraps the TBO client and returns ONLY customer-safe fields — never net /
 * wholesale cost, never RecommendedSellingRate, never the supplier identity.
 *
 * Do not import from a client component (it reads TBO credentials from env).
 */

import * as tbo from "@/lib/tbo";

export interface PublicPayAtHotel {
  description: string;
  price: number;
  currency: string;
}

export interface PublicRoom {
  name: string;
  bookingCode: string;
  mealType: string;
  isRefundable: boolean;
  /** Price the customer pays us, in `currency`. */
  sellPrice: number;
  currency: string;
  payAtHotel: PublicPayAtHotel[];
}

export interface PublicHotel {
  hotelCode: string;
  hotelName: string;
  currency: string;
  rooms: PublicRoom[];
}

export interface PublicSearchParams {
  destination: string;
  /** YYYY-MM-DD */
  checkIn: string;
  /** YYYY-MM-DD */
  checkOut: string;
  adults: number;
  children?: number;
  childrenAges?: number[];
  /** ISO 3166-1 alpha-2; defaults to GB. */
  nationality?: string;
}

export interface PublicSearchResult {
  status: "ok" | "no_availability";
  hotels: PublicHotel[];
}

/**
 * Best-effort hotel display names. TBO Search returns only HotelCode; the real
 * name comes from the static hotel-details API. Until that's wired, we map the
 * known mock fixtures and fall back to a neutral label.
 */
const MOCK_HOTEL_NAMES: Record<string, string> = {
  "1120548": "Golden Sands Hotel Apartments",
  "1435427": "City Centre Hotel",
};

function hotelNameFor(code: string): string {
  return MOCK_HOTEL_NAMES[code] ?? `Hotel ${code}`;
}

/**
 * Resolve a free-text destination / hotel name into TBO hotel codes.
 *
 * Mock mode ignores the input and returns the fixture hotel so the flow is
 * fully clickable offline. Live resolution (CityList → HotelCodeList) is not yet
 * wired — once TBO credentials land, implement it here.
 */
async function resolveHotelCodes(destination: string): Promise<string> {
  if (process.env.TBO_MOCK === "1") {
    return "1120548";
  }
  // Already a code or comma-separated codes? Pass through.
  if (/^[0-9, ]+$/.test(destination.trim())) {
    return destination.replace(/\s+/g, "");
  }
  throw new Error(
    "Live destination lookup is not configured yet. Provide TBO hotel codes, or wire CityList/HotelCodeList resolution.",
  );
}

/** Search live rates and return customer-safe results only. */
export async function publicSearch(params: PublicSearchParams): Promise<PublicSearchResult> {
  const hotelCodes = await resolveHotelCodes(params.destination);

  const paxRoom: tbo.PaxRoom = {
    Adults: Math.max(1, params.adults || 1),
    Children: params.children ?? 0,
    ChildrenAges: params.childrenAges ?? [],
  };

  const res = await tbo.search({
    CheckIn: params.checkIn,
    CheckOut: params.checkOut,
    HotelCodes: hotelCodes,
    GuestNationality: params.nationality ?? "GB",
    PaxRooms: [paxRoom],
    IsDetailedResponse: false,
  });

  if (res.Status.Code === tbo.TBO_STATUS.NO_AVAILABILITY || !res.HotelResult?.length) {
    return { status: "no_availability", hotels: [] };
  }

  const hotels: PublicHotel[] = res.HotelResult.map((hotel) => ({
    hotelCode: hotel.HotelCode,
    hotelName: hotelNameFor(hotel.HotelCode),
    currency: hotel.Currency,
    rooms: hotel.Rooms.map((room): PublicRoom => {
      const price = tbo.priceForCustomer(room, hotel.Currency);
      return {
        name: room.Name?.[0] ?? "Room",
        bookingCode: room.BookingCode,
        mealType: room.MealType ?? "",
        isRefundable: room.IsRefundable,
        sellPrice: price.sellPrice,
        currency: price.currency,
        payAtHotel: price.payAtHotel,
      };
    }),
  }));

  return { status: "ok", hotels };
}

export interface PublicCancelPolicy {
  fromDate: string;
  chargeType: string;
  charge: number;
}

export interface PublicPreBook {
  /** False when the rate is gone or can't be sold hotel-only (package/flight-only). */
  sellable: boolean;
  reason?: string;
  hotelCode: string;
  currency: string;
  room?: PublicRoom;
  cancellationPolicies: PublicCancelPolicy[];
  /** Hotel norms / conditions text (customer-safe). */
  rateConditions: string[];
}

/** PreBook a room and return a customer-safe confirmation view (no net cost). */
export async function publicPreBook(bookingCode: string): Promise<PublicPreBook> {
  const res = await tbo.preBook({ BookingCode: bookingCode });
  const hotel = res.HotelResult?.[0];
  if (!hotel) {
    return {
      sellable: false,
      reason: "This rate is no longer available. Please search again.",
      hotelCode: "",
      currency: "",
      cancellationPolicies: [],
      rateConditions: [],
    };
  }
  const rooms = tbo.filterSellableRooms(hotel);
  if (!rooms.length) {
    return {
      sellable: false,
      reason: "This rate can't be booked on its own. Please choose another room.",
      hotelCode: hotel.HotelCode,
      currency: hotel.Currency,
      cancellationPolicies: [],
      rateConditions: hotel.RateConditions ?? [],
    };
  }
  const room = rooms[0];
  const price = tbo.priceForCustomer(room, hotel.Currency);
  return {
    sellable: true,
    hotelCode: hotel.HotelCode,
    currency: hotel.Currency,
    room: {
      name: room.Name?.[0] ?? "Room",
      bookingCode: room.BookingCode,
      mealType: room.MealType ?? "",
      isRefundable: room.IsRefundable,
      sellPrice: price.sellPrice,
      currency: price.currency,
      payAtHotel: price.payAtHotel,
    },
    cancellationPolicies: (room.CancelPolicies ?? []).map((c) => ({
      fromDate: c.FromDate,
      chargeType: c.ChargeType,
      charge: c.CancellationCharge,
    })),
    rateConditions: hotel.RateConditions ?? [],
  };
}

export interface BookingQuote {
  sellable: boolean;
  reason?: string;
  bookingCode: string;
  roomName: string;
  currency: string;
  /** Customer charge in minor units (pence). */
  sellPriceMinor: number;
  /** TBO net fare for the Book call — SERVER-ONLY, never send to the client. */
  netTotalFare: number;
}

/**
 * Re-PreBook server-side at payment time to derive the authoritative sell price
 * AND the net fare needed for the TBO Book call. Keeps net cost off the client
 * and re-validates the live price before charging.
 */
export async function quoteForBooking(bookingCode: string): Promise<BookingQuote> {
  const res = await tbo.preBook({ BookingCode: bookingCode });
  const hotel = res.HotelResult?.[0];
  if (!hotel) {
    return { sellable: false, reason: "This rate is no longer available.", bookingCode, roomName: "", currency: "", sellPriceMinor: 0, netTotalFare: 0 };
  }
  const rooms = tbo.filterSellableRooms(hotel);
  if (!rooms.length) {
    return { sellable: false, reason: "This rate can't be booked on its own.", bookingCode, roomName: "", currency: hotel.Currency, sellPriceMinor: 0, netTotalFare: 0 };
  }
  const room = rooms[0];
  const price = tbo.priceForCustomer(room, hotel.Currency);
  return {
    sellable: true,
    bookingCode: room.BookingCode,
    roomName: room.Name?.[0] ?? "Room",
    currency: hotel.Currency,
    sellPriceMinor: Math.round(price.sellPrice * 100),
    netTotalFare: room.TotalFare,
  };
}
