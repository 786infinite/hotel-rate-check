"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type QuoteFields = {
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

export default function QuoteLinkBuilderPage() {
  const [fields, setFields] = useState<QuoteFields>(initialFields);
  const [copied, setCopied] = useState(false);

  const quoteUrl = useMemo(() => buildQuoteUrl(fields), [fields]);

  const requiredFieldsComplete =
    fields.quoteReference.trim() &&
    fields.hotelName.trim() &&
    fields.checkIn.trim() &&
    fields.checkOut.trim() &&
    fields.totalPrice.trim() &&
    fields.paymentLink.trim();

  const stripeLinkValid = isValidStripeLink(fields.paymentLink);

  function updateField(key: keyof QuoteFields, value: string) {
    setFields((current) => ({
      ...current,
      [key]: value,
    }));

    setCopied(false);
  }

  async function copyQuoteUrl() {
    try {
      await navigator.clipboard.writeText(quoteUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      setCopied(false);
    }
  }

  function resetForm() {
    setFields(initialFields);
    setCopied(false);
  }

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
      <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
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
            Quote link builder
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-700">
            Use this internal page after checking a hotel rate. Enter the quote
            details and Stripe payment link, then copy the generated review,
            accept and pay link into your customer email.
          </p>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            <p className="font-bold">Internal use only</p>
            <p className="mt-2">
              This page does not store anything. It only builds the customer
              quote link in your browser. Do not include unnecessary personal
              information in the link.
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
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

            <aside className="rounded-2xl border border-[#b88434]/30 bg-[#f7f2e9] p-5">
              <h2 className="text-xl font-bold text-[#071526]">
                Generated customer link
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-700">
                Send this one link to the customer after you have checked the
                hotel rate and created the Stripe payment link.
              </p>

              <textarea
                readOnly
                value={quoteUrl}
                rows={10}
                className="mt-5 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none"
              />

              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={copyQuoteUrl}
                  disabled={!requiredFieldsComplete || !stripeLinkValid}
                  className="rounded-full bg-[#071526] px-6 py-3 text-sm font-bold text-white hover:bg-[#b88434] disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {copied ? "Copied" : "Copy customer link"}
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
                  Preview quote page
                </a>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-gray-300 px-6 py-3 text-sm font-bold text-[#071526] hover:border-[#b88434] hover:text-[#b88434]"
                >
                  Clear form
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}