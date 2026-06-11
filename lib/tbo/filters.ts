/**
 * Hotel-only rate safety filters.
 *
 * HotelRateCheck sells hotel-only. TBO can return rates that are only valid when
 * sold with a flight / as part of a package. There is no clean boolean for this —
 * it appears as free text inside RateConditions (spec §7 sample). We detect those
 * phrases and suppress the affected rooms.
 *
 * Conservative by design: if a rate looks package/flight-restricted, drop it.
 */

import type { PreBookHotelResult, PreBookRoomResult } from "./types";

/** Phrases that indicate a rate must not be sold hotel-only. */
const PACKAGE_ONLY_PATTERNS: RegExp[] = [
  /sold only with an airline ticket/i,
  /as part of a package/i,
  /package\s*[- ]?\s*only/i,
  /must be (?:sold|booked) with (?:a )?flight/i,
  /flight\s*\+\s*hotel only/i,
  /tour operator package/i,
];

/** True if any RateCondition string indicates a package/flight-only restriction. */
export function isPackageOnly(rateConditions: string[] | undefined): boolean {
  if (!rateConditions?.length) return false;
  return rateConditions.some((line) =>
    PACKAGE_ONLY_PATTERNS.some((re) => re.test(line)),
  );
}

export interface RoomFilterOptions {
  /** Drop non-refundable rooms. Default false (we sell both, with clear warnings). */
  refundableOnly?: boolean;
}

/**
 * Filter a PreBook hotel result down to rooms safe to sell hotel-only.
 *
 * Note: RateConditions are returned at the hotel level in PreBook, so a
 * package-only condition there suppresses the whole hotel result. If TBO later
 * returns room-level conditions, extend this to filter per room.
 */
export function filterSellableRooms(
  hotel: PreBookHotelResult,
  options: RoomFilterOptions = {},
): PreBookRoomResult[] {
  if (isPackageOnly(hotel.RateConditions)) {
    return [];
  }
  let rooms = hotel.Rooms;
  if (options.refundableOnly) {
    rooms = rooms.filter((r) => r.IsRefundable);
  }
  return rooms;
}

/** Whether a hotel has any sellable hotel-only rooms after filtering. */
export function hasSellableRooms(
  hotel: PreBookHotelResult,
  options: RoomFilterOptions = {},
): boolean {
  return filterSellableRooms(hotel, options).length > 0;
}
