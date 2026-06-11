/**
 * Stripe adapter — dependency-free (Stripe REST + node:crypto).
 *
 * Server-side only. Uses Stripe Checkout (hosted page) for pay-ins and the
 * Refunds API for refunds. Webhook signatures are verified manually per
 * Stripe's scheme (HMAC-SHA256 over "timestamp.rawBody").
 */

import crypto from "node:crypto";
import {
  PaymentError,
  type PaymentProvider,
  type CreatePaymentInput,
  type CreatePaymentResult,
  type VerifyWebhookInput,
  type PaymentEvent,
  type RefundInput,
  type RefundResult,
} from "./types";

const STRIPE_API = "https://api.stripe.com/v1";

function form(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) sp.append(k, String(v));
  }
  return sp.toString();
}

async function stripePost(path: string, secretKey: string, body: string): Promise<Record<string, unknown>> {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const err = (json.error as { message?: string } | undefined)?.message ?? `HTTP ${res.status}`;
    throw new PaymentError(`Stripe ${path} failed: ${err}`, "provider");
  }
  return json;
}

export class StripeProvider implements PaymentProvider {
  readonly name = "stripe";
  private readonly secretKey: string;
  private readonly webhookSecret: string;

  constructor(secretKey?: string, webhookSecret?: string) {
    this.secretKey = secretKey ?? process.env.STRIPE_SECRET_KEY ?? "";
    this.webhookSecret = webhookSecret ?? process.env.STRIPE_WEBHOOK_SECRET ?? "";
    if (!this.secretKey) {
      throw new PaymentError("STRIPE_SECRET_KEY missing", "config");
    }
  }

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const params: Record<string, string | number> = {
      mode: "payment",
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      customer_email: input.customerEmail,
      client_reference_id: input.reference,
      "line_items[0][quantity]": 1,
      "line_items[0][price_data][currency]": input.currency.toLowerCase(),
      "line_items[0][price_data][unit_amount]": input.amountMinor,
      "line_items[0][price_data][product_data][name]": input.description,
      // Mirror reference into PaymentIntent + session metadata for the webhook.
      "metadata[reference]": input.reference,
      "payment_intent_data[metadata][reference]": input.reference,
    };
    for (const [k, v] of Object.entries(input.metadata ?? {})) {
      params[`metadata[${k}]`] = v;
      params[`payment_intent_data[metadata][${k}]`] = v;
    }

    const session = await stripePost("/checkout/sessions", this.secretKey, form(params));
    const url = session.url as string | undefined;
    const paymentIntent = session.payment_intent as string | undefined;
    if (!url) throw new PaymentError("Stripe session returned no URL", "provider");
    return {
      providerPaymentId: paymentIntent ?? (session.id as string),
      checkoutUrl: url,
    };
  }

  async verifyWebhook(input: VerifyWebhookInput): Promise<PaymentEvent> {
    if (!this.webhookSecret) throw new PaymentError("STRIPE_WEBHOOK_SECRET missing", "config");
    if (!input.signatureHeader) throw new PaymentError("Missing Stripe-Signature header", "signature");

    // Header format: "t=timestamp,v1=signature[,v1=...]"
    const parts = Object.fromEntries(
      input.signatureHeader.split(",").map((p) => {
        const i = p.indexOf("=");
        return [p.slice(0, i), p.slice(i + 1)];
      }),
    ) as Record<string, string>;
    const timestamp = parts["t"];
    const provided = parts["v1"];
    if (!timestamp || !provided) throw new PaymentError("Malformed Stripe-Signature", "signature");

    const expected = crypto
      .createHmac("sha256", this.webhookSecret)
      .update(`${timestamp}.${input.rawBody}`, "utf8")
      .digest("hex");

    const a = Buffer.from(expected);
    const b = Buffer.from(provided);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      throw new PaymentError("Stripe webhook signature mismatch", "signature");
    }

    return mapStripeEvent(JSON.parse(input.rawBody) as Record<string, unknown>);
  }

  async refund(input: RefundInput): Promise<RefundResult> {
    const params: Record<string, string | number> = { payment_intent: input.providerPaymentId };
    if (input.amountMinor !== undefined) params.amount = input.amountMinor;
    if (input.reason) params["metadata[reason]"] = input.reason;
    const refund = await stripePost("/refunds", this.secretKey, form(params));
    return { refundId: refund.id as string, status: refund.status as string };
  }
}

/** Map a parsed Stripe event object to our normalised PaymentEvent. */
export function mapStripeEvent(event: Record<string, unknown>): PaymentEvent {
  const type = event.type as string;
  const obj = ((event.data as Record<string, unknown>)?.object ?? {}) as Record<string, unknown>;

  if (type === "checkout.session.completed") {
    const paid = obj.payment_status === "paid";
    const metadata = (obj.metadata as Record<string, string> | undefined) ?? {};
    return {
      type: paid ? "payment_succeeded" : "ignored",
      providerPaymentId: (obj.payment_intent as string) ?? (obj.id as string),
      reference: (obj.client_reference_id as string) ?? metadata.reference,
      amountMinor: obj.amount_total as number | undefined,
      currency: (obj.currency as string | undefined)?.toUpperCase(),
      rawType: type,
    };
  }

  if (type === "payment_intent.payment_failed") {
    const metadata = (obj.metadata as Record<string, string> | undefined) ?? {};
    return {
      type: "payment_failed",
      providerPaymentId: obj.id as string,
      reference: metadata.reference,
      rawType: type,
    };
  }

  return { type: "ignored", rawType: type };
}
