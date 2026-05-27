"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function getParam(searchParams: URLSearchParams, key: string) {
  return searchParams.get(key)?.trim() ?? "";
}

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function QuoteAcceptanceClient() {
  const searchParams = useSearchParams();

  const quoteReference = getParam(searchParams, "ref");
  const hotelName = getParam(searchParams, "hotel");
  const destination = getParam(searchParams, "destination");
  const checkIn = getParam(searchParams, "checkin");
  const checkOut = getParam(searchParams, "checkout");
  const guests = getParam(searchParams, "guests");
  const roomType = getParam(searchParams, "room");
  const boardBasis = getParam(searchParams, "board");
  const totalPrice = getParam(searchParams, "price");
  const paymentLink = getParam(searchParams, "payment");
  const customerName = getParam(searchParams, "name");
  const customerEmail = getParam(searchParams, "email");

  const hasValidQuoteLink =
    quoteReference && hotelName && checkIn && checkOut && totalPrice && paymentLink;

  return (
    <main className="min-h-screen bg-[#f7f2e9] text-[#071526]">
      <section className="mx-auto max-w-4xl px-6 py-12 md:py-16">
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
            Review, accept & pay
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-700">
            Please review your hotel quote carefully. If everything is correct,
            accept the booking terms and continue to secure payment.
          </p>

          {!hasValidQuoteLink && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
              <h2 className="text-xl font-bold text-red-800">
                Quote link incomplete
              </h2>
              <p className="mt-3 text-red-700">
                This page needs to be opened from the personalised quote link we
                send by email. Please check the link or contact us at{" "}
                <a
                  href="mailto:quotes@hotelratecheck.com"
                  className="font-semibold underline"
                >
                  quotes@hotelratecheck.com
                </a>
                .
              </p>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-[#b88434]/30 bg-[#f7f2e9] p-5">
            <h2 className="text-xl font-bold text-[#071526]">Your quote</h2>

            <dl className="mt-5 grid gap-4 text-sm md:grid-cols-2">
              <div>
                <dt className="font-bold text-[#071526]">Quote reference</dt>
                <dd className="mt-1 text-gray-700">
                  {quoteReference || "Not provided"}
                </dd>
              </div>

              <div>
                <dt className="font-bold text-[#071526]">Hotel</dt>
                <dd className="mt-1 text-gray-700">
                  {hotelName || "Not provided"}
                </dd>
              </div>

              <div>
                <dt className="font-bold text-[#071526]">Destination</dt>
                <dd className="mt-1 text-gray-700">
                  {destination || "Not provided"}
                </dd>
              </div>

              <div>
                <dt className="font-bold text-[#071526]">Guests</dt>
                <dd className="mt-1 text-gray-700">
                  {guests || "Not provided"}
                </dd>
              </div>

              <div>
                <dt className="font-bold text-[#071526]">Check-in</dt>
                <dd className="mt-1 text-gray-700">
                  {formatDate(checkIn) || "Not provided"}
                </dd>
              </div>

              <div>
                <dt className="font-bold text-[#071526]">Check-out</dt>
                <dd className="mt-1 text-gray-700">
                  {formatDate(checkOut) || "Not provided"}
                </dd>
              </div>

              <div>
                <dt className="font-bold text-[#071526]">Room type</dt>
                <dd className="mt-1 text-gray-700">
                  {roomType || "Not provided"}
                </dd>
              </div>

              <div>
                <dt className="font-bold text-[#071526]">Board basis</dt>
                <dd className="mt-1 text-gray-700">
                  {boardBasis || "Not provided"}
                </dd>
              </div>

              <div className="md:col-span-2">
                <dt className="font-bold text-[#071526]">Total price</dt>
                <dd className="mt-1 text-lg font-bold text-[#071526]">
                  {totalPrice || "Not provided"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 rounded-2xl border border-[#b88434]/30 bg-white p-5">
            <h2 className="text-xl font-bold text-[#071526]">
              Important booking notice
            </h2>
            <p className="mt-3 text-gray-800">
              A quote is not a confirmed booking. Your hotel booking is only
              confirmed after you accept the quote, complete payment, and we
              receive supplier confirmation.
            </p>
            <p className="mt-3 font-semibold text-[#071526]">
              Once confirmed, hotel bookings cannot be cancelled, changed,
              transferred or refunded unless required by law or unless the
              booked accommodation is not provided as confirmed.
            </p>
          </div>

          <form
            action="/api/quote-acceptance"
            method="POST"
            className="mt-8 space-y-6"
          >
            <input type="hidden" name="quote_reference" value={quoteReference} />
            <input type="hidden" name="hotel_name" value={hotelName} />
            <input type="hidden" name="destination" value={destination} />
            <input type="hidden" name="check_in" value={checkIn} />
            <input type="hidden" name="check_out" value={checkOut} />
            <input type="hidden" name="guests" value={guests} />
            <input type="hidden" name="room_type" value={roomType} />
            <input type="hidden" name="board_basis" value={boardBasis} />
            <input type="hidden" name="total_price" value={totalPrice} />
            <input type="hidden" name="payment_link" value={paymentLink} />

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-[#071526]">
                  Full name
                </span>
                <input
                  required
                  name="full_name"
                  type="text"
                  defaultValue={customerName}
                  className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-[#071526]">
                  Email address
                </span>
                <input
                  required
                  name="email"
                  type="email"
                  defaultValue={customerEmail}
                  className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b88434]"
                />
              </label>
            </div>

            <div className="space-y-4 rounded-2xl border border-gray-200 bg-[#f7f2e9] p-5">
              <label className="flex gap-3">
                <input
                  required
                  name="details_confirmed"
                  value="yes"
                  type="checkbox"
                  className="mt-1 h-5 w-5"
                />
                <span className="text-sm leading-6 text-gray-800">
                  I confirm that I have checked the hotel name, destination,
                  dates, guests, room details, board basis, total price and any
                  supplier terms shown in my quote.
                </span>
              </label>

              <label className="flex gap-3">
                <input
                  required
                  name="terms_accepted"
                  value="yes"
                  type="checkbox"
                  className="mt-1 h-5 w-5"
                />
                <span className="text-sm leading-6 text-gray-800">
                  I accept the Hotel Rate Check{" "}
                  <Link href="/terms" className="font-semibold underline">
                    Terms & Conditions
                  </Link>
                  , including the strict booking, cancellation, change and
                  refund terms.
                </span>
              </label>

              <label className="flex gap-3">
                <input
                  required
                  name="payment_understood"
                  value="yes"
                  type="checkbox"
                  className="mt-1 h-5 w-5"
                />
                <span className="text-sm leading-6 text-gray-800">
                  I understand that payment does not automatically confirm the
                  booking until Hotel Rate Check receives supplier confirmation.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!hasValidQuoteLink}
              className="w-full rounded-full bg-[#071526] px-6 py-4 text-base font-bold text-white hover:bg-[#b88434] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Accept terms & continue to payment
            </button>

            <p className="text-center text-sm text-gray-600">
              Your acceptance will be recorded before you are sent to secure
              payment.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}