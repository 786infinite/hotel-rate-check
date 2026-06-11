/**
 * POST /api/payments/create-checkout
 *
 * Records an accepted quote and creates a hosted-checkout payment, returning the
 * checkout URL to redirect the customer to.
 *
 * Charge amount = customer SELL price (sellPriceMinor). bookingCode/totalFare are
 * optional: present for automated (dashboard) quotes that can later auto-book via
 * TBO; absent for manual quotes (staff books with the supplier after payment).
 *
 * Works offline with PAYMENTS_MOCK=1.
 */

import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { getQuoteStore } from "@/lib/payments/fulfilment";
import { newBookingReferenceId } from "@/lib/tbo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  reference?: string;
  bookingCode?: string;
  totalFare?: number;
  sellPriceMinor: number;
  currency: string;
  description: string;
  guest: { title: "Mr" | "Mrs" | "Ms"; firstName: string; lastName: string };
  email: string;
  phone: string;
  successUrl: string;
  cancelUrl: string;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const required = ["sellPriceMinor", "currency", "email", "phone", "successUrl", "cancelUrl"] as const;
  const missing = required.filter((k) => body[k] === undefined || body[k] === "");
  if (missing.length || !body.guest?.firstName) {
    return NextResponse.json(
      { error: `Missing field(s): ${missing.join(", ")}${body.guest?.firstName ? "" : ", guest"}` },
      { status: 400 },
    );
  }

  const reference = body.reference || newBookingReferenceId();

  await getQuoteStore().save({
    reference,
    bookingCode: body.bookingCode,
    totalFare: body.totalFare,
    currency: body.currency,
    clientReferenceId: `HRC-${reference}`,
    guest: body.guest,
    email: body.email,
    phone: body.phone,
    sellPriceMinor: body.sellPriceMinor,
    status: "pending",
  });

  try {
    const payment = await getPaymentProvider().createPayment({
      amountMinor: body.sellPriceMinor,
      currency: body.currency,
      reference,
      customerEmail: body.email,
      description: body.description || "Hotel booking",
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
      metadata: body.bookingCode ? { bookingCode: body.bookingCode } : undefined,
    });

    await getQuoteStore().update(reference, { providerPaymentId: payment.providerPaymentId });

    return NextResponse.json({
      reference,
      checkoutUrl: payment.checkoutUrl,
      providerPaymentId: payment.providerPaymentId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment creation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
