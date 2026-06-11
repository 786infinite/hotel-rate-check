/**
 * TBO Holidays Hotel API client (staging-ready).
 *
 * Server-side only — these modules read TBO credentials from the environment.
 * Never import from a client component.
 *
 * Typical flow:
 *   import * as tbo from "@/lib/tbo";
 *   const s = await tbo.search({ ... });
 *   const pb = await tbo.preBook({ BookingCode });
 *   const rooms = tbo.filterSellableRooms(pb.HotelResult![0]);
 *   const price = tbo.priceForCustomer(rooms[0], pb.HotelResult![0].Currency);
 *   // ...take payment via Stripe, verify webhook...
 *   const outcome = await tbo.bookWithRecovery({ ... });
 */

export * from "./types";
export { getTboConfig, TBO_TIMEOUTS_MS, TBO_SESSION_TIMEOUT_MS, TBO_BOOK_RECOVERY_DELAY_MS } from "./config";
export { TBO_STATUS, describeStatus, isSuccess, isRetriable, requiresFreshSearch } from "./status";
export { TboApiError, tboCall } from "./client";
export { setTboLogSink } from "./logging";
export type { TboLogEntry } from "./logging";

export {
  search,
  preBook,
  book,
  cancel,
  bookingDetail,
  countryList,
  cityList,
  hotelCodeList,
  hotelDetails,
} from "./methods";

export { bookWithRecovery, newBookingReferenceId } from "./booking-flow";
export type { BookOutcome } from "./booking-flow";

export {
  priceForCustomer,
  extractPayAtHotel,
  DEFAULT_MARKUP_PCT,
} from "./pricing";
export type { CustomerPrice, PayAtHotelCharge } from "./pricing";

export { isPackageOnly, filterSellableRooms, hasSellableRooms } from "./filters";
export type { RoomFilterOptions } from "./filters";
