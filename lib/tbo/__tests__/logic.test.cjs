/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Pure-logic tests for the TBO client. No network, no credentials.
 *
 * Run:  npm run test:tbo
 * (Compiles lib/tbo to CommonJS in .tbo-build, then executes this with Node's
 *  built-in test runner — no extra dependencies, cross-platform.)
 */

const path = require("node:path");
const { test } = require("node:test");
const assert = require("node:assert/strict");

process.env.TBO_MOCK = process.env.TBO_MOCK || "1";
const BUILD = path.resolve(process.env.TBO_BUILD_DIR || ".tbo-build");

const pricing = require(path.join(BUILD, "pricing.js"));
const filters = require(path.join(BUILD, "filters.js"));
const status = require(path.join(BUILD, "status.js"));
const bookingFlow = require(path.join(BUILD, "booking-flow.js"));

// --- pricing: RecommendedSellingRate floor ----------------------------------

test("priceForCustomer applies markup when above the floor", () => {
  const p = pricing.priceForCustomer({ TotalFare: 100, IsRefundable: true }, "GBP", 10);
  assert.equal(p.sellPrice, 110);
  assert.equal(p.clampedToFloor, false);
});

test("priceForCustomer clamps UP to RecommendedSellingRate", () => {
  const room = { TotalFare: 100, IsRefundable: true, RecommendedSellingRate: "160.67" };
  const p = pricing.priceForCustomer(room, "GBP", 10);
  assert.equal(p.sellPrice, 160.67);
  assert.equal(p.clampedToFloor, true);
});

test("priceForCustomer does not clamp when markup already exceeds the floor", () => {
  const room = { TotalFare: 200, IsRefundable: true, RecommendedSellingRate: "150.00" };
  const p = pricing.priceForCustomer(room, "GBP", 10);
  assert.equal(p.sellPrice, 220);
  assert.equal(p.clampedToFloor, false);
});

test("extractPayAtHotel returns only AtProperty supplements", () => {
  const supplements = [[
    { Index: 1, Type: "AtProperty", Description: "tax", Price: 20, Currency: "AED" },
    { Index: 1, Type: "Included", Description: "wifi", Price: 0, Currency: "AED" },
  ]];
  const out = pricing.extractPayAtHotel(supplements);
  assert.equal(out.length, 1);
  assert.equal(out[0].description, "tax");
});

// --- filters: package/airline-only suppression ------------------------------

test("isPackageOnly detects airline-package wording", () => {
  assert.equal(filters.isPackageOnly(["should be sold only with an airline ticket as part of a package."]), true);
});

test("isPackageOnly is false for ordinary conditions", () => {
  assert.equal(filters.isPackageOnly(["CheckIn Time-Begin: 3:00 PM", "Free WiFi"]), false);
});

test("filterSellableRooms drops all rooms when the hotel rate is package-only", () => {
  const hotel = { Rooms: [{ BookingCode: "x", IsRefundable: true }], RateConditions: ["...sold only with an airline ticket as part of a package."] };
  assert.equal(filters.filterSellableRooms(hotel).length, 0);
});

test("filterSellableRooms keeps rooms for a normal hotel-only rate", () => {
  const hotel = { Rooms: [{ BookingCode: "x", IsRefundable: true }, { BookingCode: "y", IsRefundable: false }], RateConditions: ["CheckOut Time: 12:00 PM"] };
  assert.equal(filters.filterSellableRooms(hotel).length, 2);
  assert.equal(filters.filterSellableRooms(hotel, { refundableOnly: true }).length, 1);
});

// --- status helpers ---------------------------------------------------------

test("isRetriable only for 429/500", () => {
  assert.equal(status.isRetriable(429), true);
  assert.equal(status.isRetriable(500), true);
  assert.equal(status.isRetriable(405), false);
  assert.equal(status.isRetriable(200), false);
});

test("requiresFreshSearch for expired/unavailable", () => {
  assert.equal(status.requiresFreshSearch(315), true);
  assert.equal(status.requiresFreshSearch(207), true);
  assert.equal(status.requiresFreshSearch(200), false);
});

// --- booking flow: timeout recovery never retries Book ----------------------

test("bookWithRecovery returns confirmed on a clean Book success (mock mode)", async () => {
  const req = {
    BookingCode: "c",
    CustomerDetails: [{ CustomerNames: [{ Title: "Mr", FirstName: "A", LastName: "B", Type: "Adult" }] }],
    ClientReferenceId: "ref",
    BookingReferenceId: bookingFlow.newBookingReferenceId(),
    TotalFare: 100,
    EmailId: "a@b.com",
    PhoneNumber: "447000000000",
  };
  const outcome = await bookingFlow.bookWithRecovery(req, { recoveryDelayMs: 0, sleep: () => Promise.resolve() });
  assert.equal(outcome.status, "confirmed");
  assert.ok(outcome.confirmationNumber);
});

test("newBookingReferenceId is unique and <=25 chars", () => {
  const a = bookingFlow.newBookingReferenceId();
  const b = bookingFlow.newBookingReferenceId();
  assert.notEqual(a, b);
  assert.ok(a.length <= 25, `length ${a.length}`);
  assert.ok(a.startsWith("HRC"));
});
