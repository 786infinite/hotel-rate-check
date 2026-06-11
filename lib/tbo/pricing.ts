/**
 * Customer-facing pricing.
 *
 * Rules baked in:
 *  - Apply your markup to TBO's TotalFare.
 *  - Never sell below RecommendedSellingRate when TBO returns it (B2C rule, spec §6).
 *  - Surface AtProperty supplements separately as "pay at hotel" charges — these
 *    are NOT included in the price the customer pays you (spec Key Points).
 *  - Never expose TBO net/wholesale figures to the customer.
 */

import type { RoomResult, PreBookRoomResult, Supplement } from "./types";

export const DEFAULT_MARKUP_PCT = 10;

export interface PayAtHotelCharge {
  description: string;
  price: number;
  currency: string;
}

export interface CustomerPrice {
  /** Price the customer pays HotelRateCheck (your retail price). */
  sellPrice: number;
  /** Currency of sellPrice (the room currency). */
  currency: string;
  /** Charges the guest must pay directly at the hotel — show, don't collect. */
  payAtHotel: PayAtHotelCharge[];
  /** True if the price was raised to meet RecommendedSellingRate. */
  clampedToFloor: boolean;
  /** Markup percentage actually applied (informational). */
  markupPct: number;
}

function toNumber(value: string | number | undefined): number | undefined {
  if (value == null) return undefined;
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : undefined;
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Extract AtProperty supplements (flattened across rooms) for display. */
export function extractPayAtHotel(
  supplements: Supplement[][] | undefined,
): PayAtHotelCharge[] {
  if (!supplements) return [];
  const out: PayAtHotelCharge[] = [];
  for (const perRoom of supplements) {
    for (const s of perRoom) {
      if (s.Type === "AtProperty") {
        out.push({ description: s.Description, price: s.Price, currency: s.Currency });
      }
    }
  }
  return out;
}

/**
 * Compute the customer-facing price for a room.
 *
 * @param room          a Search or PreBook room result (use the PreBook value before payment)
 * @param currency      the hotel result currency
 * @param markupPct     your markup percentage over TotalFare (default 10%)
 */
export function priceForCustomer(
  room: RoomResult | PreBookRoomResult,
  currency: string,
  markupPct: number = DEFAULT_MARKUP_PCT,
): CustomerPrice {
  const net = room.TotalFare;
  const marked = net * (1 + markupPct / 100);

  const floor = toNumber(room.RecommendedSellingRate);
  let sellPrice = marked;
  let clampedToFloor = false;
  if (floor != null && sellPrice < floor) {
    sellPrice = floor;
    clampedToFloor = true;
  }

  return {
    sellPrice: round2(sellPrice),
    currency,
    payAtHotel: extractPayAtHotel(room.Supplements),
    clampedToFloor,
    markupPct,
  };
}
