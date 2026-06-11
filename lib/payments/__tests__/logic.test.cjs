/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Pure-logic tests for the payment layer. No network, no Stripe account.
 * Run:  npm run test:payments
 */

const path = require("node:path");
const crypto = require("node:crypto");
const { test } = require("node:test");
const assert = require("node:assert/strict");

process.env.PAYMENTS_MOCK = "1";
process.env.TBO_MOCK = "1";
const BUILD = path.resolve(process.env.PAY_BUILD_DIR || ".pay-build");

const payments = require(path.join(BUILD, "payments", "index.js"));
const stripe = require(path.join(BUILD, "payments", "stripe.js"));
const fulfilment = require(path.join(BUILD, "payments", "fulfilment.js"));

// --- provider factory + mock provider ---------------------------------------

test("getPaymentProvider returns mock provider when PAYMENTS_MOCK=1", () => {
  payments._resetPaymentProvider();
  assert.equal(payments.getPaymentProvider().name, "mock");
});

test("mock createPayment returns a checkout URL carrying the reference", async () => {
  const res = await payments.getPaymentProvider().createPayment({
    amountMinor: 41800, currency: "GBP", reference: "REF1",
    customerEmail: "a@b.com", description: "Hotel", successUrl: "https://x/ok", cancelUrl: "https://x/no",
  });
  assert.match(res.checkoutUrl, /reference=REF1/);
  assert.ok(res.providerPaymentId.startsWith("pi_mock_"));
});

// --- event mapping -----------------------------------------------------------

test("mapStripeEvent maps a paid checkout session to payment_succeeded", () => {
  const ev = stripe.mapStripeEvent({
    type: "checkout.session.completed",
    data: { object: { payment_status: "paid", payment_intent: "pi_123", client_reference_id: "REF9", amount_total: 41800, currency: "gbp" } },
  });
  assert.equal(ev.type, "payment_succeeded");
  assert.equal(ev.reference, "REF9");
  assert.equal(ev.providerPaymentId, "pi_123");
  assert.equal(ev.currency, "GBP");
});

test("mapStripeEvent maps a failed payment intent", () => {
  const ev = stripe.mapStripeEvent({ type: "payment_intent.payment_failed", data: { object: { id: "pi_x", metadata: { reference: "REF7" } } } });
  assert.equal(ev.type, "payment_failed");
  assert.equal(ev.reference, "REF7");
});

test("mapStripeEvent ignores unrelated events", () => {
  assert.equal(stripe.mapStripeEvent({ type: "charge.updated", data: { object: {} } }).type, "ignored");
});

// --- Stripe webhook signature verification ----------------------------------

test("verifyWebhook accepts a correct signature and rejects a bad one", async () => {
  const secret = "whsec_test";
  const provider = new stripe.StripeProvider("sk_test", secret);
  const body = JSON.stringify({
    type: "checkout.session.completed",
    data: { object: { payment_status: "paid", payment_intent: "pi_1", client_reference_id: "REFV", amount_total: 100, currency: "gbp" } },
  });
  const t = Math.floor(Date.now() / 1000);
  const sig = crypto.createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");

  const ok = await provider.verifyWebhook({ rawBody: body, signatureHeader: `t=${t},v1=${sig}` });
  assert.equal(ok.type, "payment_succeeded");
  assert.equal(ok.reference, "REFV");

  await assert.rejects(() => provider.verifyWebhook({ rawBody: body, signatureHeader: `t=${t},v1=deadbeef` }), /signature/i);
});

// --- fulfilment: manual vs auto booking modes -------------------------------

function saveQuote(ref) {
  return fulfilment.getQuoteStore().save({
    reference: ref, bookingCode: "BC1", totalFare: 152.88, currency: "GBP",
    clientReferenceId: `HRC-${ref}`,
    guest: { title: "Mr", firstName: "A", lastName: "B" }, email: "a@b.com", phone: "447000000000",
  });
}

test("manual mode: payment is recorded for staff, NOT auto-booked", async () => {
  process.env.BOOKING_MODE = "manual";
  await saveQuote("REFM");
  const r = await fulfilment.onPaymentSucceeded({ type: "payment_succeeded", reference: "REFM", providerPaymentId: "pi_m" });
  assert.equal(r.status, "awaiting_manual_booking");
  const q = await fulfilment.getQuoteStore().get("REFM");
  assert.equal(q.status, "awaiting_manual_booking");
});

test("auto mode: payment triggers TBO booking and is idempotent", async () => {
  process.env.BOOKING_MODE = "auto";
  await saveQuote("REFA");
  const ev = { type: "payment_succeeded", reference: "REFA", providerPaymentId: "pi_a" };
  const r1 = await fulfilment.onPaymentSucceeded(ev);
  assert.equal(r1.status, "booked");
  assert.ok(r1.confirmationNumber);
  const r2 = await fulfilment.onPaymentSucceeded(ev); // replay
  assert.equal(r2.status, "ignored");
});

test("onPaymentSucceeded flags no_quote when the reference is unknown", async () => {
  const r = await fulfilment.onPaymentSucceeded({ type: "payment_succeeded", reference: "UNKNOWN" });
  assert.equal(r.status, "no_quote");
});

test("auto mode without a bookingCode falls back to manual booking", async () => {
  process.env.BOOKING_MODE = "auto";
  await fulfilment.getQuoteStore().save({
    reference: "REFNOBC", currency: "GBP", clientReferenceId: "HRC-REFNOBC",
    guest: { title: "Mr", firstName: "A", lastName: "B" }, email: "a@b.com", phone: "447000000000",
  });
  const r = await fulfilment.onPaymentSucceeded({ type: "payment_succeeded", reference: "REFNOBC", providerPaymentId: "pi_nobc" });
  assert.equal(r.status, "awaiting_manual_booking");
});

test("bookingMode defaults to manual", () => {
  delete process.env.BOOKING_MODE;
  assert.equal(fulfilment.bookingMode(), "manual");
});
