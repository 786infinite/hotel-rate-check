/**
 * Booking email content. Pure functions — no I/O — so they're easy to test and
 * reuse across providers. Customer-safe only (never net cost / supplier data).
 */

import type { EmailMessage } from "./types";

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
  return { to: d.to, subject: `Booking confirmed — ${hotel} (${d.reference})`, text };
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
  return { to: d.to, subject: `Payment received — confirming your booking (${d.reference})`, text };
}
