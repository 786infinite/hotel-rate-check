/**
 * Processor-agnostic payment layer.
 *
 * The rest of the app talks to a PaymentProvider, never to Stripe directly.
 * Swapping to Revolut Merchant / Trust Payments / Airwallex later = a new
 * adapter implementing this interface, not a rewrite.
 */

/** Input to create a hosted-checkout payment for an accepted quote. */
export interface CreatePaymentInput {
  /** Amount in minor units (pence). */
  amountMinor: number;
  /** ISO currency, e.g. "GBP". */
  currency: string;
  /** Your internal reference for this quote/booking (ties payment → booking). */
  reference: string;
  /** Customer email (receipt + booking). */
  customerEmail: string;
  /** Human-readable line description, e.g. "Hotel X, 2 nights". */
  description: string;
  /** Where to send the customer after success/cancel. */
  successUrl: string;
  cancelUrl: string;
  /** Extra key/values stored on the payment (small; provider limits apply). */
  metadata?: Record<string, string>;
}

export interface CreatePaymentResult {
  /** Provider's payment identifier (used later for refunds). */
  providerPaymentId: string;
  /** URL to redirect the customer to in order to pay. */
  checkoutUrl: string;
}

export interface VerifyWebhookInput {
  /** Raw, unparsed request body (signature is computed over the exact bytes). */
  rawBody: string;
  /** The provider's signature header value. */
  signatureHeader: string | null;
}

/** Normalised payment event, provider-independent. */
export interface PaymentEvent {
  type: "payment_succeeded" | "payment_failed" | "ignored";
  /** Provider payment id (e.g. Stripe PaymentIntent), when known. */
  providerPaymentId?: string;
  /** Our reference echoed back from metadata/client_reference_id. */
  reference?: string;
  amountMinor?: number;
  currency?: string;
  /** Original event type string, for logging. */
  rawType?: string;
}

export interface RefundInput {
  providerPaymentId: string;
  /** Omit for a full refund. */
  amountMinor?: number;
  reason?: string;
}

export interface RefundResult {
  refundId: string;
  status: string;
}

export interface PaymentProvider {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  /** Verify signature and normalise the event. Throws on bad signature. */
  verifyWebhook(input: VerifyWebhookInput): Promise<PaymentEvent>;
  refund(input: RefundInput): Promise<RefundResult>;
}

export class PaymentError extends Error {
  readonly kind: "config" | "signature" | "provider";
  constructor(message: string, kind: PaymentError["kind"]) {
    super(message);
    this.name = "PaymentError";
    this.kind = kind;
  }
}
