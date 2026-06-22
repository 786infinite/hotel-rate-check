/**
 * Fulfilment seam: payment confirmed -> (manual) record for staff, or (auto) book.
 *
 * BOOKING_MODE env controls behaviour:
 *   "manual" (default) — collect payment, mark the quote for staff to book with
 *                        the supplier and send the voucher. No TBO call.
 *   "auto"             — on payment, call TBO bookWithRecovery (only possible
 *                        when the quote carries a TBO bookingCode).
 *
 * QuoteStore is a seam: Vercel KV in production (auto-selected when KV env is
 * present), in-memory otherwise.
 */

import { bookWithRecovery, type BookOutcome } from "../tbo";
import { getNotifier, composeConfirmationEmail, composeReceivedEmail } from "../notify";
import { buildReceiptPdf, type ReceiptData } from "../receipt/pdf";
import type { PaymentEvent } from "./types";

export interface AcceptedQuote {
  reference: string;
  /** TBO bookingCode — present for automated (dashboard) quotes, absent for manual quotes. */
  bookingCode?: string;
  /** TBO net fare for the Book call (present with bookingCode). NOT the sell price. */
  totalFare?: number;
  currency: string;
  clientReferenceId: string;
  guest: { title: "Mr" | "Mrs" | "Ms"; firstName: string; lastName: string };
  /** Lead guest per room (order matches the searched rooms). Falls back to [guest]. */
  guests?: { title: "Mr" | "Mrs" | "Ms"; firstName: string; lastName: string }[];
  email: string;
  phone: string;
  /** What the customer was charged, in pence (for records/reconciliation). */
  sellPriceMinor?: number;
  /** Display context for emails/records (customer-safe). */
  hotel?: string;
  checkIn?: string;
  checkOut?: string;
  providerPaymentId?: string;
  /** TBO/supplier confirmation number, saved once the booking confirms. */
  confirmationNumber?: string;
  /** Optional business details for the receipt. */
  company?: { name?: string; reference?: string };
  status?: "pending" | "paid" | "booked" | "failed" | "refund_due" | "awaiting_manual_booking";
}

export interface QuoteStore {
  get(reference: string): Promise<AcceptedQuote | null>;
  save(quote: AcceptedQuote): Promise<void>;
  update(reference: string, patch: Partial<AcceptedQuote>): Promise<void>;
  /**
   * Atomically claim a reference for fulfilment. Returns true only for the FIRST
   * caller; later callers (e.g. a retried webhook) get false. Prevents
   * double-booking when the provider redelivers a payment event.
   */
  claim(reference: string): Promise<boolean>;
}

// In dev, route handlers and RSC pages load this module in separate bundles, so
// a plain instance field would NOT be shared between them (the /receipt page
// couldn't see a quote saved by the checkout route). Anchor the maps on
// globalThis so every bundle — and HMR reload — sees the same data. This only
// affects the offline/in-memory fallback; production uses the shared KV store.
const g = globalThis as typeof globalThis & {
  __hrcQuoteMap?: Map<string, AcceptedQuote>;
  __hrcQuoteClaimed?: Set<string>;
};
g.__hrcQuoteMap ??= new Map<string, AcceptedQuote>();
g.__hrcQuoteClaimed ??= new Set<string>();

class InMemoryQuoteStore implements QuoteStore {
  private map = g.__hrcQuoteMap!;
  private claimed = g.__hrcQuoteClaimed!;
  async get(reference: string) {
    return this.map.get(reference) ?? null;
  }
  async save(quote: AcceptedQuote) {
    this.map.set(quote.reference, { status: "pending", ...quote });
  }
  async update(reference: string, patch: Partial<AcceptedQuote>) {
    const existing = this.map.get(reference);
    if (existing) this.map.set(reference, { ...existing, ...patch });
  }
  async claim(reference: string) {
    if (this.claimed.has(reference)) return false;
    this.claimed.add(reference);
    return true;
  }
}

let store: QuoteStore | null = null;

function defaultStore(): QuoteStore {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { KVQuoteStore } = require("./quote-store-kv") as typeof import("./quote-store-kv");
    return new KVQuoteStore();
  }
  return new InMemoryQuoteStore();
}

export function setQuoteStore(custom: QuoteStore): void {
  store = custom;
}
export function getQuoteStore(): QuoteStore {
  if (!store) store = defaultStore();
  return store;
}

export function bookingMode(): "manual" | "auto" {
  return process.env.BOOKING_MODE === "auto" ? "auto" : "manual";
}

export type FulfilmentResult =
  | { status: "booked"; confirmationNumber: string; outcome: BookOutcome }
  | { status: "no_booking"; reason: string; outcome?: BookOutcome }
  | { status: "awaiting_manual_booking"; reason: string }
  | { status: "no_quote"; reason: string }
  | { status: "ignored"; reason: string };

/** Send a booking email. Best-effort: never throws, never blocks fulfilment. */
async function sendBookingEmail(
  kind: "confirmed" | "received",
  quote: AcceptedQuote,
  confirmationNumber?: string,
): Promise<void> {
  try {
    const data = {
      to: quote.email,
      reference: quote.reference,
      guestName: `${quote.guest.firstName} ${quote.guest.lastName}`.trim(),
      hotel: quote.hotel,
      checkIn: quote.checkIn,
      checkOut: quote.checkOut,
      currency: quote.currency,
      amountMinor: quote.sellPriceMinor,
      confirmationNumber,
    };
    const msg = kind === "confirmed" ? composeConfirmationEmail(data) : composeReceivedEmail(data);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hotelratecheck.com";
      const receipt: ReceiptData = {
        reference: quote.reference,
        email: quote.email,
        guestName: `${quote.guest.firstName} ${quote.guest.lastName}`.trim(),
        company: quote.company,
        hotel: quote.hotel,
        checkIn: quote.checkIn,
        checkOut: quote.checkOut,
        confirmationNumber,
        currency: quote.currency,
        sellPriceMinor: quote.sellPriceMinor,
      };
      const pdf = await buildReceiptPdf(receipt, baseUrl);
      const title = quote.company?.name ? "INVOICE" : "RECEIPT";
      msg.attachments = [{
        filename: `Hotel-Rate-Check-${title}-${quote.reference}.pdf`,
        content: Buffer.from(pdf).toString("base64"),
        contentType: "application/pdf",
      }];
    } catch {
      // attachment is best-effort; never block the email
    }

    await getNotifier().send(msg);
  } catch {
    // Email delivery is best-effort; a failure here must not fail the booking.
  }
}

export async function onPaymentSucceeded(event: PaymentEvent): Promise<FulfilmentResult> {
  if (event.type !== "payment_succeeded" || !event.reference) {
    return { status: "ignored", reason: `event ${event.rawType ?? event.type} not actionable` };
  }

  const quotes = getQuoteStore();
  const quote = await quotes.get(event.reference);
  if (!quote) {
    return { status: "no_quote", reason: `No accepted quote for reference ${event.reference}` };
  }
  if (quote.status === "booked") {
    return { status: "ignored", reason: `Reference ${event.reference} already booked` };
  }

  // Idempotency: only the first delivery of this event proceeds. A retried/
  // duplicate webhook loses the claim and is ignored, so we never double-book.
  const won = await quotes.claim(event.reference);
  if (!won) {
    return { status: "ignored", reason: `Reference ${event.reference} already being processed` };
  }

  await quotes.update(event.reference, { status: "paid", providerPaymentId: event.providerPaymentId });

  const canAutoBook = bookingMode() === "auto" && quote.bookingCode && quote.totalFare != null;

  if (!canAutoBook) {
    if (quote.status === "awaiting_manual_booking") {
      return { status: "ignored", reason: `Reference ${event.reference} already awaiting manual booking` };
    }
    await quotes.update(event.reference, { status: "awaiting_manual_booking" });
    await sendBookingEmail("received", quote);
    const why =
      bookingMode() === "auto"
        ? "auto mode but quote has no TBO booking code (manual quote)"
        : "manual booking mode";
    return {
      status: "awaiting_manual_booking",
      reason: `Payment received for ${event.reference}; queued for manual supplier booking (${why})`,
    };
  }

  const leadGuests = quote.guests?.length ? quote.guests : [quote.guest];
  const outcome = await bookWithRecovery({
    BookingCode: quote.bookingCode as string,
    CustomerDetails: leadGuests.map((g) => ({
      CustomerNames: [
        { Title: g.title, FirstName: g.firstName, LastName: g.lastName, Type: "Adult" as const },
      ],
    })),
    ClientReferenceId: quote.clientReferenceId,
    BookingReferenceId: quote.reference,
    TotalFare: quote.totalFare as number,
    EmailId: quote.email,
    PhoneNumber: quote.phone,
  });

  if (outcome.status === "confirmed" || outcome.status === "confirmed_via_recovery") {
    await quotes.update(event.reference, { status: "booked", confirmationNumber: outcome.confirmationNumber });
    await sendBookingEmail("confirmed", quote, outcome.confirmationNumber);
    return { status: "booked", confirmationNumber: outcome.confirmationNumber, outcome };
  }

  await quotes.update(event.reference, { status: "refund_due" });
  const reason = "reason" in outcome ? outcome.reason : "Booking did not complete";
  return { status: "no_booking", reason, outcome };
}
