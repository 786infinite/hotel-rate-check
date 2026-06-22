import type { Metadata } from "next";
import Link from "next/link";
import { getQuoteStore } from "@/lib/payments/fulfilment";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Booking receipt | Hotel Rate Check",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

function money(minor: number | null | undefined, currency?: string): string {
  if (minor == null || !currency) return "";
  try { return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(minor / 100); }
  catch { return `${currency} ${(minor / 100).toFixed(2)}`; }
}

export default async function ReceiptPage({ searchParams }: { searchParams: Promise<{ reference?: string | string[] }> }) {
  const sp = await searchParams;
  const reference = (Array.isArray(sp.reference) ? sp.reference[0] : sp.reference)?.trim() ?? "";
  const quote = reference ? await getQuoteStore().get(reference) : null;

  if (!quote) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-[#071526]">
        <h1 className="font-display text-2xl font-semibold">Receipt not found</h1>
        <p className="mt-2 text-gray-600">We couldn’t find a booking for this reference.</p>
        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-[#b88434] hover:underline">← Home</Link>
      </main>
    );
  }

  const billTo = quote.company?.name || `${quote.guest.firstName} ${quote.guest.lastName}`.trim();
  const issued = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-[#071526]">
      <div className="rounded-3xl border border-[#e7ddcd] bg-white p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-display text-2xl font-semibold">{COMPANY.tradingName}</p>
            <p className="text-sm text-gray-600">{COMPANY.legalName}</p>
            {COMPANY.companyNumber && <p className="text-xs text-gray-500">Company no. {COMPANY.companyNumber}</p>}
            {COMPANY.addressLine && <p className="text-xs text-gray-500">{COMPANY.addressLine}</p>}
            {COMPANY.vatNumber && <p className="text-xs text-gray-500">VAT no. {COMPANY.vatNumber}</p>}
            <p className="text-xs text-gray-500">{COMPANY.email}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-xl font-semibold">Booking receipt</p>
            <p className="text-sm text-gray-600">Issued {issued}</p>
            <p className="text-sm text-gray-600">Ref: {quote.reference}</p>
          </div>
        </div>

        <div className="mt-8 border-t border-[#efe6d6] pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Billed to</p>
          <p className="mt-1 font-semibold">{billTo}</p>
          {quote.company?.reference && <p className="text-sm text-gray-600">PO / cost-centre: {quote.company.reference}</p>}
          <p className="text-sm text-gray-600">{quote.email}</p>
        </div>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-[#efe6d6] text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#efe6d6]">
              <td className="py-3">
                {quote.hotel ?? "Hotel booking"}
                {quote.checkIn && quote.checkOut && <span className="block text-xs text-gray-500">{quote.checkIn} → {quote.checkOut}</span>}
                {quote.confirmationNumber && <span className="block text-xs text-gray-500">Hotel confirmation: {quote.confirmationNumber}</span>}
              </td>
              <td className="py-3 text-right tabular-nums">{money(quote.sellPriceMinor, quote.currency)}</td>
            </tr>
            <tr>
              <td className="py-3 font-semibold">Total paid</td>
              <td className="py-3 text-right font-semibold tabular-nums">{money(quote.sellPriceMinor, quote.currency)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 text-xs text-gray-500">Price includes all applicable taxes and fees. Any charges payable directly at the hotel were shown before payment and are not included above.</p>

        <div className="mt-8 flex justify-end">
          <a href={`/api/receipt?reference=${encodeURIComponent(quote.reference)}`} className="rounded-full bg-[#0b1b2e] px-6 py-3 text-sm font-bold text-white hover:bg-[#b88434]">Download PDF</a>
        </div>
      </div>
    </main>
  );
}
