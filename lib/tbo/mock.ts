/**
 * Mock resolver for offline development (TBO_MOCK=1).
 *
 * Returns spec-based fixtures instead of calling the live API, so the dashboard
 * and booking flow work before credentials exist. Routing is intentionally
 * simple: by method, with a couple of body-aware branches to demo edge cases
 * (package-only rate, the second room's BookingCode).
 */

import {
  mockSearchResponse,
  mockPreBookResponse,
  mockPreBookPackageOnly,
  mockBookResponse,
  mockBookingDetailResponse,
  PACKAGE_ONLY_BOOKING_CODE,
} from "./fixtures";

export function isMockMode(): boolean {
  return process.env.TBO_MOCK === "1";
}

/** Resolve a mock response for a given method + request body. */
export function resolveMock(method: string, body: unknown): unknown {
  const b = (body ?? {}) as Record<string, unknown>;

  switch (method) {
    case "Search":
      return mockSearchResponse;

    case "PreBook":
      return b.BookingCode === PACKAGE_ONLY_BOOKING_CODE
        ? mockPreBookPackageOnly
        : mockPreBookResponse;

    case "Book":
      return mockBookResponse;

    case "BookingDetail":
      return mockBookingDetailResponse;

    case "Cancel":
      return {
        Status: { Code: 200, Description: "Cancelled" },
        ConfirmationNumber: mockBookingDetailResponse.BookingDetail?.ConfirmationNumber,
      };

    default:
      // Static-content methods: return an empty-but-successful envelope.
      return { Status: { Code: 200, Description: "Successful (mock)" } };
  }
}
