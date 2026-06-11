/**
 * Payment layer entry point. Resolves the active provider from env.
 *
 * Env:
 *   PAYMENTS_PROVIDER   "stripe" (default). Future: "revolut", "trustpayments", ...
 *   PAYMENTS_MOCK       "1" to use the offline mock provider (no keys/network).
 *   STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET   for the Stripe adapter.
 */

import { StripeProvider } from "./stripe";
import { MockPaymentProvider } from "./mock";
import { PaymentError, type PaymentProvider } from "./types";

export * from "./types";
export { StripeProvider, mapStripeEvent } from "./stripe";
export { MockPaymentProvider, mockCheckoutCompleted } from "./mock";

let cached: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (cached) return cached;

  if (process.env.PAYMENTS_MOCK === "1") {
    cached = new MockPaymentProvider();
    return cached;
  }

  const provider = (process.env.PAYMENTS_PROVIDER ?? "stripe").toLowerCase();
  switch (provider) {
    case "stripe":
      cached = new StripeProvider();
      return cached;
    default:
      throw new PaymentError(`Unknown PAYMENTS_PROVIDER "${provider}"`, "config");
  }
}

/** Reset the cached provider (tests). */
export function _resetPaymentProvider(): void {
  cached = null;
}
