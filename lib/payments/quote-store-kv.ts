/**
 * Vercel KV (Upstash Redis) implementation of QuoteStore.
 *
 * Dependency-free: talks to the KV REST API with fetch, so there's no SDK to
 * install. Vercel injects KV_REST_API_URL and KV_REST_API_TOKEN when you attach
 * a KV store to the project.
 *
 * Quotes are stored as JSON at key "quote:{reference}" with a TTL so abandoned
 * quotes self-expire.
 */

import { PaymentError } from "./types";
import type { AcceptedQuote, QuoteStore } from "./fulfilment";

const QUOTE_TTL_SECONDS = 60 * 60 * 24; // 24h

export class KVQuoteStore implements QuoteStore {
  private readonly url: string;
  private readonly token: string;

  constructor(url?: string, token?: string) {
    this.url = (url ?? process.env.KV_REST_API_URL ?? "").replace(/\/+$/, "");
    this.token = token ?? process.env.KV_REST_API_TOKEN ?? "";
    if (!this.url || !this.token) {
      throw new PaymentError("KV_REST_API_URL / KV_REST_API_TOKEN missing", "config");
    }
  }

  /** Run a single Redis command via the Upstash REST endpoint. */
  private async command(args: (string | number)[]): Promise<unknown> {
    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    const json = (await res.json()) as { result?: unknown; error?: string };
    if (!res.ok || json.error) {
      throw new PaymentError(`KV command failed: ${json.error ?? res.status}`, "provider");
    }
    return json.result;
  }

  private key(reference: string): string {
    return `quote:${reference}`;
  }

  async get(reference: string): Promise<AcceptedQuote | null> {
    const result = await this.command(["GET", this.key(reference)]);
    if (result == null) return null;
    try {
      return JSON.parse(result as string) as AcceptedQuote;
    } catch {
      return null;
    }
  }

  async save(quote: AcceptedQuote): Promise<void> {
    const value = JSON.stringify({ status: "pending", ...quote });
    await this.command(["SET", this.key(quote.reference), value, "EX", QUOTE_TTL_SECONDS]);
  }

  async update(reference: string, patch: Partial<AcceptedQuote>): Promise<void> {
    const existing = await this.get(reference);
    if (!existing) return;
    const merged = JSON.stringify({ ...existing, ...patch });
    await this.command(["SET", this.key(reference), merged, "EX", QUOTE_TTL_SECONDS]);
  }
}
