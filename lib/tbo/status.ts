/**
 * TBO response status codes (spec §5) and helpers to interpret them.
 *
 * Note: these are TBO's *internal* status codes carried in the JSON body
 * (Status.Code), not HTTP status codes — though several values overlap.
 */

export const TBO_STATUS = {
  SUCCESS: 200,
  NO_AVAILABILITY: 201,
  RATE_UNAVAILABLE: 207,
  INSUFFICIENT_BALANCE: 300,
  BOOKINGCODE_EXPIRED: 315,
  INVALID_REQUEST: 400,
  UNAUTHORIZED: 401,
  AGENT_BLOCKED: 402,
  BOOKING_FAIL: 405,
  LIMIT_EXCEEDED: 429,
  CANCEL_FAIL: 479,
  UNEXPECTED_ERROR: 500,
} as const;

export type TboStatusCode = (typeof TBO_STATUS)[keyof typeof TBO_STATUS];

const DESCRIPTIONS: Record<number, string> = {
  200: "Successful",
  201: "No availability for the given criteria",
  207: "Given rate is no longer available for booking",
  300: "Agency has insufficient funds for the requested booking",
  315: "Session expired between search and book (BookingCode expired)",
  400: "Invalid request — a parameter/value is incorrect",
  401: "Unauthorized — check API credentials",
  402: "Agency blocked at TBO end",
  405: "Booking failed — cannot create booking",
  429: "QPS limit exceeded",
  479: "Cancel failed — cannot cancel booking",
  500: "Unexpected error — send full JSON logs to apisupport@tboholidays.com",
};

export function describeStatus(code: number): string {
  return DESCRIPTIONS[code] ?? `Unknown TBO status code ${code}`;
}

export function isSuccess(code: number): boolean {
  return code === TBO_STATUS.SUCCESS;
}

/**
 * Whether a failed call is safe to retry as-is.
 * Conservative on purpose: never auto-retry anything that could create/alter a booking.
 * (Book recovery is handled separately via BookingDetail, not by retrying Book.)
 */
export function isRetriable(code: number): boolean {
  switch (code) {
    case TBO_STATUS.LIMIT_EXCEEDED: // 429 — back off and retry
    case TBO_STATUS.UNEXPECTED_ERROR: // 500 — transient server error
      return true;
    default:
      return false;
  }
}

/** Status values that mean "stop and re-run Search/PreBook" rather than retry. */
export function requiresFreshSearch(code: number): boolean {
  return (
    code === TBO_STATUS.RATE_UNAVAILABLE ||
    code === TBO_STATUS.BOOKINGCODE_EXPIRED ||
    code === TBO_STATUS.NO_AVAILABILITY
  );
}
