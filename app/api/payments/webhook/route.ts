/**
 * POST /api/payments/webhook
 *
 * Provider payment webhook. Verifies the signature over the RAW body, then on a
 * successful payment triggers fulfilment (TBO bookWithRecovery via the seam).
 *
 * Must read the raw body (signature is computed over exact bytes) -> nodejs runtime.
 * Always returns 200 quickly for handled events so the provider doesn't retry a
 * duplicate; returns 400 only for a bad/again-retryable signature.
 *
 * Works offline with PAYMENTS_MOCK=1 (signature check skipped).
 */

import { NextResponse } from "next/server";
import { getPaymentProvider, PaymentError } from "@/lib/payments";
import { onPaymentSucceeded } from "@/lib/payments/fulfilment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signatureHeader =
    request.headers.get("stripe-signature") ?? request.headers.get("x-signature");

  let event;
  try {
    event = await getPaymentProvider().verifyWebhook({ rawBody, signatureHeader });
  } catch (err) {
    if (err instanceof PaymentError && err.kind === "signature") {
      // Bad signature — reject so it's visible; do NOT process.
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Webhook verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "payment_succeeded") {
    const result = await onPaymentSucceeded(event);
    // Log-worthy outcomes; respond 200 regardless so the provider stops retrying.
    return NextResponse.json({ received: true, result });
  }

  if (event.type === "payment_failed") {
    return NextResponse.json({ received: true, result: { status: "payment_failed", reference: event.reference } });
  }

  return NextResponse.json({ received: true, result: { status: "ignored", rawType: event.rawType } });
}
