/**
 * Typed wrappers for each TBO API method.
 * Server-side only. These are thin — business rules (pricing floor, package
 * filtering, the safe Book flow) live in pricing.ts / filters.ts / booking-flow.ts.
 */

import { tboCall } from "./client";
import { TBO_TIMEOUTS_MS } from "./config";
import type {
  SearchRequest,
  SearchResponse,
  PreBookRequest,
  PreBookResponse,
  BookRequest,
  BookResponse,
  CancelRequest,
  CancelResponse,
  BookingDetailRequest,
  BookingDetailResponse,
} from "./types";

/**
 * Search room availability.
 * NO_AVAILABILITY (201) is a normal result, not an error — allowNonSuccess.
 */
export function search(req: SearchRequest): Promise<SearchResponse> {
  return tboCall<SearchResponse>({
    method: "Search",
    timeoutMs: TBO_TIMEOUTS_MS.Search,
    body: req,
    allowNonSuccess: true,
  });
}

/**
 * Re-validate live price, availability and cancellation policy for a BookingCode.
 * Must be called immediately before payment. RATE_UNAVAILABLE (207) / expired
 * (315) surface as errors so the caller forces a fresh Search.
 */
export function preBook(req: PreBookRequest): Promise<PreBookResponse> {
  return tboCall<PreBookResponse>({
    method: "PreBook",
    timeoutMs: TBO_TIMEOUTS_MS.PreBook,
    body: { PaymentMode: "Limit", ...req },
  });
}

/**
 * Create + voucher the booking. Use the safe wrapper in booking-flow.ts
 * (`bookWithRecovery`) rather than calling this directly, so timeout recovery
 * is always applied.
 */
export function book(req: BookRequest): Promise<BookResponse> {
  return tboCall<BookResponse>({
    method: "Book",
    timeoutMs: TBO_TIMEOUTS_MS.Book,
    body: { BookingType: "Voucher", PaymentMode: "Limit", ...req },
    correlationId: req.BookingReferenceId,
  });
}

/** Cancel an existing booking by confirmation number. */
export function cancel(req: CancelRequest): Promise<CancelResponse> {
  return tboCall<CancelResponse>({
    method: "Cancel",
    timeoutMs: TBO_TIMEOUTS_MS.Cancel,
    body: req,
  });
}

/** Retrieve booking details / voucher data by ConfirmationNumber or BookingReferenceId. */
export function bookingDetail(req: BookingDetailRequest): Promise<BookingDetailResponse> {
  if (!req.ConfirmationNumber && !req.BookingReferenceId) {
    throw new Error("bookingDetail requires ConfirmationNumber or BookingReferenceId");
  }
  return tboCall<BookingDetailResponse>({
    method: "BookingDetail",
    timeoutMs: TBO_TIMEOUTS_MS.BookingDetail,
    body: { PaymentMode: "Limit", ...req },
    correlationId: req.BookingReferenceId,
    allowNonSuccess: true,
  });
}

// --- Static content (spec §11–16). Refresh roughly monthly; cache locally. ---

export function countryList(): Promise<unknown> {
  return tboCall({ method: "CountryList", timeoutMs: TBO_TIMEOUTS_MS.Static, body: {}, allowNonSuccess: true });
}

export function cityList(countryCode: string): Promise<unknown> {
  return tboCall({
    method: "CityList",
    timeoutMs: TBO_TIMEOUTS_MS.Static,
    body: { CountryCode: countryCode },
    allowNonSuccess: true,
  });
}

export function hotelCodeList(cityCode: string): Promise<unknown> {
  return tboCall({
    method: "TBOHotelCodeList",
    timeoutMs: TBO_TIMEOUTS_MS.Static,
    body: { CityCode: cityCode, IsDetailedResponse: false },
    allowNonSuccess: true,
  });
}

export function hotelDetails(hotelCodes: string): Promise<unknown> {
  return tboCall({
    method: "HotelDetails",
    timeoutMs: TBO_TIMEOUTS_MS.Static,
    body: { Hotelcodes: hotelCodes, Language: "EN" },
    allowNonSuccess: true,
  });
}
