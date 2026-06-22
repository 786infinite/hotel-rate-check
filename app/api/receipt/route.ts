import { buildReceiptPdf, type ReceiptData } from "@/lib/receipt/pdf";
import { getQuoteStore } from "@/lib/payments/fulfilment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference")?.trim() ?? "";
  const quote = reference ? await getQuoteStore().get(reference) : null;
  if (!quote) return new Response("Not found", { status: 404 });

  const data: ReceiptData = {
    reference: quote.reference,
    email: quote.email,
    guestName: `${quote.guest.firstName} ${quote.guest.lastName}`.trim(),
    company: quote.company,
    hotel: quote.hotel,
    checkIn: quote.checkIn,
    checkOut: quote.checkOut,
    confirmationNumber: quote.confirmationNumber,
    currency: quote.currency,
    sellPriceMinor: quote.sellPriceMinor,
  };
  const pdf = await buildReceiptPdf(data, url.origin);
  const title = quote.company?.name ? "INVOICE" : "RECEIPT";

  // Copy into a fresh ArrayBuffer-backed view so the bytes satisfy BodyInit
  // (pdf-lib returns Uint8Array<ArrayBufferLike>, which the strict DOM types reject).
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Hotel-Rate-Check-${title}-${quote.reference}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
