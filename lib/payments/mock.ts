/**
 * Mock payment provider for offline development (PAYMENTS_MOCK=1).
 *
 * - createPayment returns a fake checkout URL that points back at successUrl.
 * - verifyWebhook skips signature checks and maps a Stripe-shaped JSON body,
 *   so you can POST a fake "checkout.session.completed" to the webhook locally.
 * - refund returns a fake success.
 */

import { mapStripeEvent } from "./stripe";
import type {
  PaymentProvider,
  CreatePaymentInput,
  CreatePaymentResult,
  VerifyWebhookInput,
  PaymentEvent,
  RefundInput,
  RefundResult,
} from "./types";

let counter = 0;

export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    counter += 1;
    const id = `pi_mock_${Date.now()}_${counter}`;
    const sep = input.successUrl.includes("?") ? "&" : "?";
    return {
      providerPaymentId: id,
      checkoutUrl: `${input.successUrl}${sep}mock=1&reference=${encodeURIComponent(input.reference)}&pi=${id}`,
    };
  }

  async verifyWebhook(input: VerifyWebhookInput): Promise<PaymentEvent> {
    // No signature in mock mode — just map the JSON body.
    return mapStripeEvent(JSON.parse(input.rawBody) as Record<string, unknown>);
  }

  async refund(input: RefundInput): Promise<RefundResult> {
    return { refundId: `re_mock_${input.providerPaymentId}`, status: "succeeded" };
  }
}

/** Build a fake checkout.session.completed body for local webhook testing. */
export function mockCheckoutCompleted(opts: {
  reference: string;
  paymentIntentId?: string;
  amountMinor?: number;
  currency?: string;
}): string {
  return JSON.stringify({
    type: "checkout.session.completed",
    data: {
      object: {
        id: `cs_mock_${Date.now()}`,
        payment_status: "paid",
        payment_intent: opts.paymentIntentId ?? `pi_mock_${Date.now()}`,
        client_reference_id: opts.reference,
        amount_total: opts.amountMinor ?? 0,
        currency: (opts.currency ?? "GBP").toLowerCase(),
        metadata: { reference: opts.reference },
      },
    },
  });
}
