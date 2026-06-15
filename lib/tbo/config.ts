/**
 * TBO API configuration — resolved from environment variables.
 *
 * Required env vars (set in .env.local locally, and in Vercel project settings):
 *   TBO_BASE_URL    Staging (confirmed by TBO 10 Jun 2026): https://api.tbotechnology.in/HotelAPI
 *                   For live, the HTTPS production URL TBO provides after certification.
 *   TBO_USERNAME    Basic Auth username issued by TBO (after deposit/certification)
 *   TBO_PASSWORD    Basic Auth password issued by TBO
 *
 * Never commit real credentials. .env.local is gitignored.
 */

export interface TboConfig {
  baseUrl: string;
  username: string;
  password: string;
  /** Basic Auth header value, ready to send. */
  authHeader: string;
}

// Staging endpoint confirmed by TBO Application Support (10 Jun 2026). Note the
// older spec showed an HTTP `/TBOHolidays_HotelAPI` URL — that has changed.
const STAGING_BASE_URL = "https://api.tbotechnology.in/HotelAPI";

function base64(input: string): string {
  // Works in Node (Buffer) and edge/runtime (btoa) without pulling deps.
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "utf-8").toString("base64");
  }
  return btoa(input);
}

/**
 * Load and validate TBO config. Throws a clear error if credentials are missing,
 * so a misconfigured deploy fails loudly instead of sending unauthenticated calls.
 */
export function getTboConfig(): TboConfig {
  const baseUrl = (process.env.TBO_BASE_URL || STAGING_BASE_URL).replace(/\/+$/, "");
  const username = process.env.TBO_USERNAME ?? "";
  const password = process.env.TBO_PASSWORD ?? "";

  if (!username || !password) {
    throw new Error(
      "TBO credentials missing. Set TBO_USERNAME and TBO_PASSWORD in the environment.",
    );
  }

  return {
    baseUrl,
    username,
    password,
    authHeader: `Basic ${base64(`${username}:${password}`)}`,
  };
}

/** Recommended per-method timeouts in milliseconds (spec section 4). */
export const TBO_TIMEOUTS_MS = {
  Search: 23_000,
  PreBook: 23_000,
  Book: 120_000,
  Cancel: 60_000,
  BookingDetail: 60_000,
  Static: 60_000,
} as const;

/** Full search-to-book session budget. TBO confirmed 40 min (10 Jun 2026); after this, re-run Search. */
export const TBO_SESSION_TIMEOUT_MS = 40 * 60_000;

/** Mandatory wait before calling BookingDetail after an uncertain Book (spec section 10 note). */
export const TBO_BOOK_RECOVERY_DELAY_MS = 120_000;
