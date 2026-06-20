/**
 * POST /api/book/create-checkout  (PUBLIC, customer-facing)
 *
 * The customer booking entry point. Takes a TBO bookingCode + guest details,
 * re-PreBooks SERVER-SIDE to derive the authoritative sell price and the net
 * fare (net never reaches the client), records the quote, creates a hosted
 * payment, and returns the checkout URL.
 *
 * Net cost and supplier data are never sent to or accepted from the client —
 * the price is recomputed here from the bookingCode.
 *
 * In PAYMENTS_MOCK=1 mode there is no real Stripe webhook, so we simulate
 * payment success inline to keep the flow clickable end-to-end offline.
 */

import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { getQuoteStore, onPaymentSucceeded } from "@/lib/payments/fulfilment";
import { quoteForBooking } from "@/lib/booking/public";
import { newBookingReferenceId } from "@/lib/tbo";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  bookingCode?: string;
  hotel?: string;
  checkIn?: string;
  checkOut?: string;
  /** One lead guest per room (order matches the searched rooms). */
  guests?: { title?: "Mr" | "Mrs" | "Ms"; firstName?: string; lastName?: string }[];
  email?: string;
  phone?: string;
  /** Sell price (pence) the customer was shown on /book, for drift protection. */
  expectedMinor?: number;
}

export async function POST(request: Request) {
  if (!(await rateLimit(`book:${clientIp(request)}`, 10, 60))) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.bookingCode) {
    return NextResponse.json({ error: "Missing bookingCode" }, { status: 400 });
  }
  const guests = (Array.isArray(body.guests) ? body.guests : [])
    .filter((g) => g?.firstName && g?.lastName)
    .map((g) => ({ title: g.title ?? "Mr", firstName: g.firstName as string, lastName: g.lastName as string }));
  if (!guests.length || !body.email || !body.phone) {
    return NextResponse.json(
      { error: "Please provide a lead guest name for each room, plus email and phone." },
      { status: 400 },
    );
  }

  // Re-derive price + net fare from the live rate (server-only).
  let quote;
  try {
    quote = await quoteForBooking(body.bookingCode);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not price this room";
    return NextResponse.json({ error: message }, { status: 502 });
  }
  if (!quote.sellable) {
    return NextResponse.json({ error: quote.reason ?? "This rate is no longer available." }, { status: 409 });
  }

  // #7 currency guard: we charge in GBP. Refuse loudly rather than silently
  // charging a foreign amount as if it were sterling. (Revisit once TBO confirms
  // the currency our B2C rates return in / once FX conversion is added.)
  if (quote.currency !== "GBP") {
    return NextResponse.json(
      { error: "This rate isn't available to book online yet (non-GBP pricing)." },
      { status: 409 },
    );
  }
  // Amount sanity: must be a positive integer number of pence.
  if (!Number.isInteger(quote.sellPriceMinor) || quote.sellPriceMinor <= 0) {
    return NextResponse.json({ error: "Could not price this room. Please try again." }, { status: 502 });
  }
  // Price-drift protection: never silently charge MORE than the customer was shown.
  // (A lower live price is fine — we charge the lower amount.)
  if (typeof body.expectedMinor === "number" && quote.sellPriceMinor > body.expectedMinor + 1) {
    return NextResponse.json(
      {
        error: "The price for this room has changed since you reviewed it. Please go back and check the new price before paying.",
        priceChanged: true,
      },
      { status: 409 },
    );
  }

  const reference = newBookingReferenceId();

  await getQuoteStore().save({
    reference,
    bookingCode: quote.bookingCode,
    totalFare: quote.netTotalFare,
    currency: quote.currency,
    clientReferenceId: `HRC-${reference}`,
    guest: guests[0],
    guests,
    email: body.email,
    phone: body.phone,
    sellPriceMinor: quote.sellPriceMinor,
    hotel: body.hotel,
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    status: "pending",
  });

  const origin = new URL(request.url).origin;
  const successUrl = `${origin}/booking-status?reference=${encodeURIComponent(reference)}`;
  const cancelUrl = `${origin}/book?bookingCode=${encodeURIComponent(body.bookingCode)}`;

  try {
    const payment = await getPaymentProvider().createPayment({
      amountMinor: quote.sellPriceMinor,
      currency: quote.currency,
      reference,
      customerEmail: body.email,
      description: `${body.hotel ?? "Hotel"} — ${quote.roomName}`,
      successUrl,
      cancelUrl,
      metadata: { bookingCode: quote.bookingCode },
    });

    await getQuoteStore().update(reference, { providerPaymentId: payment.providerPaymentId });

    // Offline mock: no Stripe webhook will fire, so drive fulfilment inline.
    if (process.env.PAYMENTS_MOCK === "1") {
      try {
        await onPaymentSucceeded({
          type: "payment_succeeded",
          reference,
          providerPaymentId: payment.providerPaymentId,
          amountMinor: quote.sellPriceMinor,
          currency: quote.currency,
        });
      } catch {
        // Non-fatal in mock; the status page will still show "paid".
      }
    }

    return NextResponse.json({ reference, checkoutUrl: payment.checkoutUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment creation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
