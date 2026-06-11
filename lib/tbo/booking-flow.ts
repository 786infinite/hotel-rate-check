/**
 * Safe booking flow.
 *
 * The hard rule (spec §10 note): if Book times out or fails with an HTTP/network
 * error, the booking status is UNKNOWN — a booking may or may not have been created.
 * You must NOT retry Book. Instead wait 120 seconds, then call BookingDetail by
 * BookingReferenceId. Only if that confirms no booking exists may you retry.
 *
 * This wrapper enforces that. Call it instead of methods.book() directly.
 */

import { book, bookingDetail } from "./methods";
import { TboApiError } from "./client";
import { TBO_BOOK_RECOVERY_DELAY_MS } from "./config";
import { isSuccess } from "./status";
import type { BookRequest, BookResponse, BookingDetailResponse } from "./types";

export type BookOutcome =
  | {
      /** Book confirmed directly. */
      status: "confirmed";
      confirmationNumber: string;
      book: BookResponse;
    }
  | {
      /** Book was uncertain; BookingDetail recovery found a real booking. */
      status: "confirmed_via_recovery";
      confirmationNumber: string;
      detail: BookingDetailResponse;
    }
  | {
      /** Book was uncertain and recovery confirmed NO booking exists — safe to retry or refund. */
      status: "no_booking";
      reason: string;
    }
  | {
      /** Book failed cleanly (e.g. rate unavailable). No booking created. */
      status: "failed";
      reason: string;
      tboCode?: number;
    };

interface BookWithRecoveryOptions {
  /** Override the 120s wait (e.g. shorten in tests). */
  recoveryDelayMs?: number;
  /** Injectable sleep for testing. */
  sleep?: (ms: number) => Promise<void>;
}

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Book a room with mandatory timeout recovery.
 *
 * Preconditions enforced elsewhere: a fresh PreBook has been shown to and
 * accepted by the customer, and payment has already been verified.
 */
export async function bookWithRecovery(
  req: BookRequest,
  options: BookWithRecoveryOptions = {},
): Promise<BookOutcome> {
  const sleep = options.sleep ?? defaultSleep;
  const recoveryDelayMs = options.recoveryDelayMs ?? TBO_BOOK_RECOVERY_DELAY_MS;

  try {
    const res = await book(req);
    if (isSuccess(res.Status.Code) && res.ConfirmationNumber) {
      return { status: "confirmed", confirmationNumber: res.ConfirmationNumber, book: res };
    }
    // tboCall throws on non-success, so reaching here means success without a
    // confirmation number — treat as uncertain and verify.
    return verify(req, recoveryDelayMs, sleep, "Book returned success without a confirmation number");
  } catch (err) {
    if (err instanceof TboApiError) {
      // Uncertain failures (timeout / network / HTTP) → recovery, never retry Book.
      if (err.kind === "timeout" || err.kind === "network" || err.kind === "http") {
        return verify(req, recoveryDelayMs, sleep, err.message);
      }
      // Clean TBO rejection (e.g. 207 rate unavailable, 405 booking fail, 300 funds).
      // No booking created — safe to refund / offer alternative without recovery wait.
      return { status: "failed", reason: err.message, tboCode: err.tboCode };
    }
    throw err;
  }
}

async function verify(
  req: BookRequest,
  delayMs: number,
  sleep: (ms: number) => Promise<void>,
  reason: string,
): Promise<BookOutcome> {
  await sleep(delayMs);

  const detail = await bookingDetail({ BookingReferenceId: req.BookingReferenceId });
  const bd = detail.BookingDetail;

  if (bd && isSuccess(detail.Status.Code) && bd.ConfirmationNumber) {
    return {
      status: "confirmed_via_recovery",
      confirmationNumber: bd.ConfirmationNumber,
      detail,
    };
  }

  // No booking found for this BookingReferenceId after the recovery wait.
  return {
    status: "no_booking",
    reason: `Book uncertain (${reason}); BookingDetail found no booking for ${req.BookingReferenceId}`,
  };
}

/**
 * Generate a unique BookingReferenceId (≤25 chars per spec).
 * Format: HRC + base36 timestamp + short random, e.g. "HRClq8x2k3f9a1b2".
 */
export function newBookingReferenceId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `HRC${ts}${rand}`.slice(0, 25);
}
