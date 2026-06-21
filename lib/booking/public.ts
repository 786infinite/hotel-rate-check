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
import { getHotelIndex } from "./destination";

/** Whole nights between two YYYY-MM-DD dates (min 1). */
export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = Date.parse(checkIn);
  const b = Date.parse(checkOut);
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a) return 1;
  return Math.max(1, Math.round((b - a) / 86_400_000));
}

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
  /** Hotel image: TBO static content when live, else an open-source fallback. */
  image: string;
  starRating?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  currency: string;
  rooms: PublicRoom[];
}

// Open-source (Unsplash, free for commercial use) fallback used until TBO static
// content images are available. Degrades to a gradient if it fails to load.
const HOTEL_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=70";

export interface PublicSearchParams {
  destination: string;
  /** YYYY-MM-DD */
  checkIn: string;
  /** YYYY-MM-DD */
  checkOut: string;
  /** One entry per room (TBO limits: ≤6 rooms, ≤6 adults & ≤4 children each). */
  paxRooms: tbo.PaxRoom[];
  /** ISO 3166-1 alpha-2; defaults to GB. */
  nationality?: string;
  /** Board basis filter. "All" (or omitted) = no filter. */
  mealPlan?: tbo.MealPlan;
}

export interface PublicSearchResult {
  status: "ok" | "no_availability";
  hotels: PublicHotel[];
}

/** Search live rates and return customer-safe results only.
 *  Destination → hotel codes and hotel display names come from the HotelIndex
 *  (lib/booking/destination.ts): the spec fixtures in mock mode, the TBO Static
 *  content API when live. */
export async function publicSearch(params: PublicSearchParams): Promise<PublicSearchResult> {
  const index = getHotelIndex();
  const codes = await index.resolveCodes(params.destination, 50);
  if (!codes.length) {
    return { status: "no_availability", hotels: [] };
  }
  const hotelCodes = codes.join(",");

  const paxRooms = params.paxRooms?.length
    ? params.paxRooms
    : [{ Adults: 2, Children: 0, ChildrenAges: [] }];

  const res = await tbo.search({
    CheckIn: params.checkIn,
    CheckOut: params.checkOut,
    HotelCodes: hotelCodes,
    GuestNationality: params.nationality ?? "GB",
    PaxRooms: paxRooms,
    IsDetailedResponse: false,
    Filters: params.mealPlan && params.mealPlan !== "All" ? { MealType: params.mealPlan } : undefined,
  });

  if (res.Status.Code === tbo.TBO_STATUS.NO_AVAILABILITY || !res.HotelResult?.length) {
    return { status: "no_availability", hotels: [] };
  }

  const hotels: PublicHotel[] = await Promise.all(res.HotelResult.map(async (hotel) => {
    const content = await index.content(hotel.HotelCode);
    return {
    hotelCode: hotel.HotelCode,
    hotelName: content?.name ?? `Hotel ${hotel.HotelCode}`,
    image: content?.images?.[0] ?? HOTEL_FALLBACK_IMAGE,
    starRating: content?.starRating,
    address: content?.address,
    latitude: content?.latitude,
    longitude: content?.longitude,
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
    };
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
