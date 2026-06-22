import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
// Relative import (not "@/lib/company"): the payments test compile
// (tsconfig.pay-test.json) has no path-alias config. Functionally identical.
import { COMPANY } from "../company";

export interface ReceiptData {
  reference: string;
  email: string;
  guestName: string;
  company?: { name?: string; reference?: string };
  hotel?: string;
  checkIn?: string;
  checkOut?: string;
  confirmationNumber?: string;
  currency: string;
  sellPriceMinor?: number;
}

function gbp(minor: number, currency: string): string {
  const amt = (minor / 100).toFixed(2);
  return currency === "GBP" ? `£${amt}` : `${currency} ${amt}`;
}

/** Build a branded receipt/invoice PDF. `baseUrl` is used to fetch the logo. */
export async function buildReceiptPdf(d: ReceiptData, baseUrl: string): Promise<Uint8Array> {
  const navy = rgb(0.043, 0.105, 0.18);
  const green = rgb(0.11, 0.42, 0.25);
  const gray = rgb(0.42, 0.45, 0.5);
  const line = rgb(0.9, 0.87, 0.82);

  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const W = 595.28, M = 50;
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let y = 790;

  try {
    const bytes = await fetch(`${baseUrl}/images/logo.png`).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error("no logo"))));
    const png = await doc.embedPng(bytes);
    const w = 150, h = (png.height / png.width) * w;
    page.drawImage(png, { x: M, y: y - h + 14, width: w, height: h });
  } catch {
    page.drawText(COMPANY.tradingName, { x: M, y: y - 6, size: 20, font: bold, color: navy });
  }

  const isInvoice = Boolean(d.company?.name);
  const title = isInvoice ? "INVOICE" : "RECEIPT";
  page.drawText(title, { x: W - M - bold.widthOfTextAtSize(title, 22), y: y - 4, size: 22, font: bold, color: navy });
  const paidW = bold.widthOfTextAtSize("PAID", 9) + 14;
  page.drawRectangle({ x: W - M - paidW, y: y - 28, width: paidW, height: 16, color: rgb(0.85, 0.95, 0.88) });
  page.drawText("PAID", { x: W - M - paidW + 7, y: y - 24, size: 9, font: bold, color: green });

  y -= 72;
  const sellerLines = [COMPANY.legalName, `Company no. ${COMPANY.companyNumber}`, COMPANY.addressLine, `VAT no. ${COMPANY.vatNumber}`, COMPANY.email];
  let sy = y;
  for (const l of sellerLines) { page.drawText(l, { x: M, y: sy, size: 9, font, color: gray }); sy -= 13; }

  const issued = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  let my = y;
  for (const [k, v] of [["Document no.", d.reference], ["Issued", issued]] as [string, string][]) {
    page.drawText(k, { x: W - M - 220, y: my, size: 9, font: bold, color: navy });
    page.drawText(v, { x: W - M - font.widthOfTextAtSize(v, 9), y: my, size: 9, font, color: gray });
    my -= 13;
  }

  y = Math.min(sy, my) - 16;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1, color: line }); y -= 26;

  page.drawText("BILLED TO", { x: M, y, size: 8, font: bold, color: gray }); y -= 15;
  const billName = d.company?.name || d.guestName;
  page.drawText(billName, { x: M, y, size: 12, font: bold, color: navy }); y -= 14;
  if (d.company?.reference) { page.drawText(`PO / cost-centre: ${d.company.reference}`, { x: M, y, size: 9, font, color: gray }); y -= 12; }
  page.drawText(d.email, { x: M, y, size: 9, font, color: gray }); y -= 30;

  page.drawText("DESCRIPTION", { x: M, y, size: 8, font: bold, color: gray });
  page.drawText("AMOUNT", { x: W - M - bold.widthOfTextAtSize("AMOUNT", 8), y, size: 8, font: bold, color: gray });
  y -= 8; page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1, color: line }); y -= 18;

  const amount = gbp(d.sellPriceMinor ?? 0, d.currency);
  page.drawText(d.hotel ?? "Hotel booking", { x: M, y, size: 11, font, color: navy });
  page.drawText(amount, { x: W - M - font.widthOfTextAtSize(amount, 11), y, size: 11, font, color: navy }); y -= 14;
  if (d.checkIn && d.checkOut) { page.drawText(`${d.checkIn} to ${d.checkOut}`, { x: M, y, size: 9, font, color: gray }); y -= 12; }
  if (d.confirmationNumber) { page.drawText(`Hotel confirmation: ${d.confirmationNumber}`, { x: M, y, size: 9, font, color: gray }); y -= 12; }
  y -= 10; page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1, color: line }); y -= 22;

  page.drawText("Total paid", { x: M, y, size: 12, font: bold, color: navy });
  page.drawText(amount, { x: W - M - bold.widthOfTextAtSize(amount, 12), y, size: 12, font: bold, color: navy }); y -= 30;

  const note = "Price includes all applicable taxes and fees. Any charges payable directly at the hotel were shown before payment and are not included above.";
  let s = "";
  for (const word of note.split(" ")) {
    const t = s ? `${s} ${word}` : word;
    if (font.widthOfTextAtSize(t, 8) > W - 2 * M) { page.drawText(s, { x: M, y, size: 8, font, color: gray }); y -= 11; s = word; } else s = t;
  }
  if (s) page.drawText(s, { x: M, y, size: 8, font, color: gray });

  return doc.save();
}
