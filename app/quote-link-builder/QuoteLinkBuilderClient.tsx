"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type QuoteFields = {
  customerName: string;
  quoteReference: string;
  hotelName: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  roomType: string;
  boardBasis: string;
  totalPrice: string;
  paymentLink: string;
};

const initialFields: QuoteFields = {
  customerName: "",
  quoteReference: "",
  hotelName: "",
  destination: "",
  checkIn: "",
  checkOut: "",
  guests: "",
  roomType: "",
  boardBasis: "",
  totalPrice: "",
  paymentLink: "",
};

function buildQuoteUrl(fields: QuoteFields) {
  const params = new URLSearchParams();

  params.set("ref", fields.quoteReference.trim());
  params.set("hotel", fields.hotelName.trim());
  params.set("destination", fields.destination.trim());
  params.set("checkin", fields.checkIn.trim());
  params.set("checkout", fields.checkOut.trim());
  params.set("guests", fields.guests.trim());
  params.set("room", fields.roomType.trim());
  params.set("board", fields.boardBasis.trim());
  params.set("price", fields.totalPrice.trim());
  params.set("payment", fields.paymentLink.trim());

  return `https://www.hotelratecheck.com/quote-acceptance?${params.toString()}`;
}

function buildPaymentReceivedUrl(fields: QuoteFields) {
  const params = new URLSearchParams();

  if (fields.quoteReference.trim()) {
    params.set("ref", fields.quoteReference.trim());
  }

  const queryString = params.toString();

  if (!queryString) {
    return "https://www.hotelratecheck.com/payment-received";
  }

  return `https://www.hotelratecheck.com/payment-received?${queryString}`;
}

function isValidStripeLink(value: string) {
  try {
    const url = new URL(value.trim());

    return (
      url.protocol === "https:" &&
      (url.hostname === "buy.stripe.com" ||
        url.hostname === "checkout.stripe.com")
    );
  } catch {
    return false;
  }
}

function formatDate(value: string) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function buildEmailSubject(fields: QuoteFields) {
  const reference = fields.quoteReference.trim();

  if (!reference) {
    return "Your Hotel Rate Check quote";
  }

  return `Your Hotel Rate Check quote - ${reference}`;
}

function buildEmailBody(fields: QuoteFields, quoteUrl: string) {
  const greeting = fields.customerName.trim()
    ? `Hi ${fields.customerName.trim()},`
    : "Hi,";

  return [
    greeting,
    "",
    "We checked the hotel details you sent and have prepared the quote below.",
    "",
    `Quote reference: ${fields.quoteReference.trim() || "[Quote reference]"}`,
    `Hotel: ${fields.hotelName.trim() || "[Hotel name]"}`,
    `Destination: ${fields.destination.trim() || "[Destination]"}`,
    `Check-in: ${formatDate(fields.checkIn.trim()) || "[Check-in date]"}`,
    `Check-out: ${formatDate(fields.checkOut.trim()) || "[Check-out date]"}`,
    `Guests: ${fields.guests.trim() || "[Guests]"}`,
    `Room type: ${fields.roomType.trim() || "[Room type]"}`,
    `Board basis: ${fields.boardBasis.trim() || "[Board basis]"}`,
    `Total price: ${fields.totalPrice.trim() || "[Total price]"}`,
    "",
    "To proceed, please review the quote, accept the booking terms and pay securely using this link:",
    quoteUrl,
    "",
    "Important:",
    "This rate is live and subject to availability until confirmed.",
    "A quote is not a confirmed booking.",
    "Your hotel booking is only confirmed after you accept the quote, complete payment and we receive supplier confirmation.",
    "Once confirmed, hotel bookings cannot be cancelled, changed, transferred or refunded unless required by law or unless the booked accommodation is not provided as confirmed.",
    "",
    "Kind regards,",
    "Hotel Rate Check",
    "quotes@hotelratecheck.com",
  ].join("\n");
}

export default function QuoteLinkBuilderClient() {
  const [fields, setFields] = useState<QuoteFields>(initialFields);
  const [copiedItem, setCopiedItem] = useState<
    "link" | "subject" | "email" | "success" | ""
  >("");

  const quoteUrl = useMemo(() => buildQuoteUrl(fields), [fields]);

  const paymentReceivedUrl = useMemo(
    () => buildPaymentReceivedUrl(fields),
    [fields],
  );

  const emailSubject = useMemo(() => buildEmailSubject(fields), [fields]);

  const emailBody = useMemo(
    () => buildEmailBody(fields, quoteUrl),
    [fields, quoteUrl],
  );

  const requiredFieldsComplete = Boolean(
    fields.quoteReference.trim() &&
      fields.hotelName.trim() &&
      fields.checkIn.trim() &&
      fields.checkOut.trim() &&
      fields.totalPrice.trim() &&
      fields.paymentLink.trim(),
  );

  const stripeLinkValid = isValidStripeLink(fields.paymentLink);

  function updateField(key: keyof QuoteFields, value: string) {
    setFields((current) => ({
      ...current,
      [key]: value,
    }));

    setCopiedItem("");
  }

  async function copyText(
    text: string,
    item: "link" | "subject" | "email" | "success",
  ) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);

      window.setTimeout(() => {
        setCopiedItem("");
      }, 2500);
    } catch {
      setCopiedItem("");
    }
  }

  function resetForm() {
    setFields(initialFields);
    setCopiedItem("");
  }

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex rounded-full border border-[#b88434] px-4 py-2 text-sm font-semibold text-[#071526] hover:bg-[#b88434] hover:text-white"
        >
          ← Back to homepage
        </Link>

        <div className="rounded-3xl bg-white p-6 shadow-xl md:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#b88434]">
            Hotel Rate Check
          </p>

          <h1 className="text-3xl font-bold md:text-5xl">
            Quote email builder
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-700">
            Use this internal page after checking a hotel rate. Enter the quote
            details and Stripe payment link, then copy the customer email.
          </p>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            <p className="font-bold">Internal use only</p>
            <p className="mt-2">
              This page is password-protected and does not store anything. It
              only builds the customer email and quote link in your browser.
            </p>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_0.95fr]">
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-[#071526]">
                  Customer first name
                </span>
                <input
                  value={fields.customerName}
                  onChange={(event) =>
                    updateField("customerName", event.target.value)
                  }
                  type="text"
                  placeholder="Example: Muhammad"
                  className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-[#071526]">
                    Quote reference
                  </span>
                  <input
                    value={fields.quoteReference}
                    onChange={(event) =>
                      updateField("quoteReference", event.target.value)
                    }
                    type="text"
                    placeholder="Example: HRC-001"
                    className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-[#071526]">
                    Total price
                  </span>
                  <input
                    value={fields.totalPrice}
                    onChange={(event) =>
                      updateField("totalPrice", event.target.value)
                    }
                    type="text"
                    placeholder="Example: £495 total"
                    className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-[#071526]">
                  Hotel name
                </span>
                <input
                  value={fields.hotelName}
                  onChange={(event) =>
                    updateField("hotelName", event.target.value)
                  }
                  type="text"
                  placeholder="Example: Hilton London Metropole"
                  className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-[#071526]">
                  Destination
                </span>
                <input
                  value={fields.destination}
                  onChange={(event) =>
                    updateField("destination", event.target.value)
                  }
                  type="text"
                  placeholder="Example: London"
                  className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-[#071526]">
                    Check-in date
                  </span>
                  <input
                    value={fields.checkIn}
                    onChange={(event) =>
                      updateField("checkIn", event.target.value)
                    }
                    type="date"
                    className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-[#071526]">
                    Check-out date
                  </span>
                  <input
                    value={fields.checkOut}
                    onChange={(event) =>
                      updateField("checkOut", event.target.value)
                    }
                    type="date"
                    className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <label className="block">
                  <span className="text-sm font-bold text-[#071526]">
                    Guests
                  </span>
                  <input
                    value={fields.guests}
                    onChange={(event) =>
                      updateField("guests", event.target.value)
                    }
                    type="text"
                    placeholder="Example: 2 adults"
                    className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-[#071526]">
                    Room type
                  </span>
                  <input
                    value={fields.roomType}
                    onChange={(event) =>
                      updateField("roomType", event.target.value)
                    }
                    type="text"
                    placeholder="Example: Double Room"
                    className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-[#071526]">
                    Board basis
                  </span>
                  <input
                    value={fields.boardBasis}
                    onChange={(event) =>
                      updateField("boardBasis", event.target.value)
                    }
                    type="text"
                    placeholder="Example: Room only"
                    className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-[#071526]">
                  Stripe payment link
                </span>
                <input
                  value={fields.paymentLink}
                  onChange={(event) =>
                    updateField("paymentLink", event.target.value)
                  }
                  type="url"
                  placeholder="https://buy.stripe.com/..."
                  className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                />
              </label>

              {fields.paymentLink && !stripeLinkValid && (
                <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  The payment link must start with https://buy.stripe.com or
                  https://checkout.stripe.com
                </p>
              )}
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-[#b88434]/30 bg-[#f7f2e9] p-5">
                <h2 className="text-xl font-bold text-[#071526]">
                  Stripe after-payment redirect URL
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-700">
                  When creating the Stripe payment link, use this as the
                  after-payment redirect URL.
                </p>

                <textarea
                  readOnly
                  value={paymentReceivedUrl}
                  rows={3}
                  className="mt-5 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() => copyText(paymentReceivedUrl, "success")}
                  className="mt-4 rounded-full bg-[#071526] px-6 py-3 text-sm font-bold text-white hover:bg-[#b88434]"
                >
                  {copiedItem === "success" ? "Copied" : "Copy redirect URL"}
                </button>
              </div>

              <div className="rounded-2xl border border-[#b88434]/30 bg-[#f7f2e9] p-5">
                <h2 className="text-xl font-bold text-[#071526]">
                  Generated customer link
                </h2>

                <textarea
                  readOnly
                  value={quoteUrl}
                  rows={6}
                  className="mt-5 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => copyText(quoteUrl, "link")}
                    disabled={!requiredFieldsComplete || !stripeLinkValid}
                    className="rounded-full bg-[#071526] px-6 py-3 text-sm font-bold text-white hover:bg-[#b88434] disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {copiedItem === "link" ? "Copied" : "Copy link"}
                  </button>

                  <a
                    href={quoteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`rounded-full border px-6 py-3 text-center text-sm font-bold ${
                      requiredFieldsComplete && stripeLinkValid
                        ? "border-[#071526] text-[#071526] hover:border-[#b88434] hover:text-[#b88434]"
                        : "pointer-events-none border-gray-300 text-gray-400"
                    }`}
                  >
                    Preview
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-[#b88434]/30 bg-white p-5">
                <h2 className="text-xl font-bold text-[#071526]">
                  Email subject
                </h2>

                <input
                  readOnly
                  value={emailSubject}
                  className="mt-4 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() => copyText(emailSubject, "subject")}
                  className="mt-4 rounded-full bg-[#071526] px-6 py-3 text-sm font-bold text-white hover:bg-[#b88434]"
                >
                  {copiedItem === "subject" ? "Copied" : "Copy subject"}
                </button>
              </div>

              <div className="rounded-2xl border border-[#b88434]/30 bg-white p-5">
                <h2 className="text-xl font-bold text-[#071526]">
                  Customer email
                </h2>

                <textarea
                  readOnly
                  value={emailBody}
                  rows={18}
                  className="mt-4 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 outline-none"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => copyText(emailBody, "email")}
                    disabled={!requiredFieldsComplete || !stripeLinkValid}
                    className="rounded-full bg-[#071526] px-6 py-3 text-sm font-bold text-white hover:bg-[#b88434] disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {copiedItem === "email" ? "Copied" : "Copy email"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-gray-300 px-6 py-3 text-sm font-bold text-[#071526] hover:border-[#b88434] hover:text-[#b88434]"
                  >
                    Clear form
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}