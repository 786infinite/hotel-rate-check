/**
 * GET /api/payments/status?reference=...
 *
 * Customer-safe booking status lookup for the confirmation page. Returns only
 * non-sensitive fields (never net rates or supplier data).
 */

import { NextResponse } from "next/server";
import { getQuoteStore } from "@/lib/payments/fulfilment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference")?.trim();
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const quote = await getQuoteStore().get(reference);
  if (!quote) {
    return NextResponse.json({ reference, status: "unknown" });
  }

  return NextResponse.json({
    reference,
    status: quote.status ?? "pending",
    currency: quote.currency,
    sellPriceMinor: quote.sellPriceMinor ?? null,
    hotel: quote.hotel ?? null,
    checkIn: quote.checkIn ?? null,
    checkOut: quote.checkOut ?? null,
    confirmationNumber: quote.confirmationNumber ?? null,
    roomName: quote.roomName ?? null,
    board: quote.board ?? null,
    refundable: quote.refundable ?? null,
  });
}
