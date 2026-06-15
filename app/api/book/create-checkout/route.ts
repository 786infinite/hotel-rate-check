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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  bookingCode?: string;
  hotel?: string;
  checkIn?: string;
  checkOut?: string;
  guest?: { title?: "Mr" | "Mrs" | "Ms"; firstName?: string; lastName?: string };
  email?: string;
  phone?: string;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.bookingCode) {
    return NextResponse.json({ error: "Missing bookingCode" }, { status: 400 });
  }
  if (!body.guest?.firstName || !body.guest?.lastName || !body.email || !body.phone) {
    return NextResponse.json({ error: "Please provide guest name, email and phone." }, { status: 400 });
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

  const reference = newBookingReferenceId();
  const guest = {
    title: body.guest.title ?? "Mr",
    firstName: body.guest.firstName,
    lastName: body.guest.lastName,
  };

  await getQuoteStore().save({
    reference,
    bookingCode: quote.bookingCode,
    totalFare: quote.netTotalFare,
    currency: quote.currency,
    clientReferenceId: `HRC-${reference}`,
    guest,
    email: body.email,
    phone: body.phone,
    sellPriceMinor: quote.sellPriceMinor,
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
