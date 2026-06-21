/**
 * Booking email content. Pure functions — no I/O — so they're easy to test and
 * reuse across providers. Customer-safe only (never net cost / supplier data).
 */

import type { EmailMessage } from "./types";
// Relative import (not "@/lib/company"): the test compile (tsconfig.pay-test.json)
// has no path-alias config, matching the rest of lib/. Functionally identical.
import { COMPANY } from "../company";

export interface BookingEmailData {
  to: string;
  reference: string;
  guestName: string;
  hotel?: string;
  checkIn?: string;
  checkOut?: string;
  currency: string;
  /** Amount paid, in minor units (pence). */
  amountMinor?: number;
  /** TBO/supplier confirmation number (confirmed bookings only). */
  confirmationNumber?: string;
}

function money(amountMinor: number | undefined, currency: string): string {
  if (amountMinor == null) return "";
  const amount = amountMinor / 100;
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function stayLine(d: BookingEmailData): string {
  if (d.checkIn && d.checkOut) return `Stay: ${d.checkIn} to ${d.checkOut}\n`;
  return "";
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
function shell(title: string, lines: string[]): string {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#071526">
    <div style="background:#071526;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
      <div style="font-size:18px;font-weight:700">${esc(COMPANY.tradingName)}</div>
    </div>
    <div style="border:1px solid #e7ddcd;border-top:0;border-radius:0 0 12px 12px;padding:24px">
      <h1 style="font-size:20px;margin:0 0 12px">${esc(title)}</h1>
      ${lines.map((l) => `<p style="margin:0 0 10px;line-height:1.6">${l}</p>`).join("")}
      <hr style="border:0;border-top:1px solid #efe6d6;margin:20px 0"/>
      <p style="font-size:12px;color:#6b7280;margin:0">${esc(COMPANY.legalName)} trading as ${esc(COMPANY.tradingName)} · Company No. ${esc(COMPANY.companyNumber)} · VAT ${esc(COMPANY.vatNumber)}<br/>${esc(COMPANY.addressLine)} · ${esc(COMPANY.email)}</p>
    </div>
  </div>`;
}

const SUPPORT = "quotes@hotelratecheck.com";

/** Confirmed booking — includes the confirmation/voucher reference. */
export function composeConfirmationEmail(d: BookingEmailData): EmailMessage {
  const hotel = d.hotel ?? "your hotel";
  const paid = money(d.amountMinor, d.currency);
  const text =
    `Hi ${d.guestName},\n\n` +
    `Good news — your booking at ${hotel} is confirmed.\n\n` +
    `Booking reference: ${d.reference}\n` +
    (d.confirmationNumber ? `Hotel confirmation: ${d.confirmationNumber}\n` : "") +
    stayLine(d) +
    (paid ? `Amount paid: ${paid}\n` : "") +
    `\nYour voucher is attached to your account/booking record. Some hotels charge ` +
    `local taxes or fees directly at check-in — these were shown before you paid.\n\n` +
    `Questions? Reply to this email or contact ${SUPPORT}.\n\n` +
    `Hotel Rate Check`;

  const lines = [
    `Hi ${esc(d.guestName)},`,
    `Good news — your booking at <strong>${esc(hotel)}</strong> is confirmed.`,
    `Booking reference: <strong>${esc(d.reference)}</strong>`,
    ...(d.confirmationNumber ? [`Hotel confirmation: <strong>${esc(d.confirmationNumber)}</strong>`] : []),
    ...(d.checkIn && d.checkOut ? [`Stay: ${esc(d.checkIn)} to ${esc(d.checkOut)}`] : []),
    ...(paid ? [`Amount paid: <strong>${esc(paid)}</strong>`] : []),
    `Your voucher is attached to your account/booking record. Some hotels charge local taxes or fees directly at check-in — these were shown before you paid.`,
    `Questions? Reply to this email or contact <a href="mailto:${esc(SUPPORT)}">${esc(SUPPORT)}</a>.`,
  ];
  const html = shell("Booking confirmed", lines);
  return { to: d.to, subject: `Booking confirmed — ${hotel} (${d.reference})`, text, html };
}

/** Payment captured but booking not yet confirmed with the hotel. */
export function composeReceivedEmail(d: BookingEmailData): EmailMessage {
  const hotel = d.hotel ?? "your hotel";
  const paid = money(d.amountMinor, d.currency);
  const text =
    `Hi ${d.guestName},\n\n` +
    `Thanks — we've received your payment for ${hotel} and are confirming your booking with the hotel.\n\n` +
    `Booking reference: ${d.reference}\n` +
    stayLine(d) +
    (paid ? `Amount paid: ${paid}\n` : "") +
    `\nWe'll email your confirmation and voucher as soon as the hotel confirms. ` +
    `Please don't make non-refundable travel arrangements until you receive it.\n\n` +
    `Questions? Reply to this email or contact ${SUPPORT}.\n\n` +
    `Hotel Rate Check`;

  const lines = [
    `Hi ${esc(d.guestName)},`,
    `Thanks — we've received your payment for <strong>${esc(hotel)}</strong> and are confirming your booking with the hotel.`,
    `Booking reference: <strong>${esc(d.reference)}</strong>`,
    ...(d.checkIn && d.checkOut ? [`Stay: ${esc(d.checkIn)} to ${esc(d.checkOut)}`] : []),
    ...(paid ? [`Amount paid: <strong>${esc(paid)}</strong>`] : []),
    `We'll email your confirmation and voucher as soon as the hotel confirms. Please don't make non-refundable travel arrangements until you receive it.`,
    `Questions? Reply to this email or contact <a href="mailto:${esc(SUPPORT)}">${esc(SUPPORT)}</a>.`,
  ];
  const html = shell("Payment received", lines);
  return { to: d.to, subject: `Payment received — confirming your booking (${d.reference})`, text, html };
}
