/**
 * Resend email adapter (dependency-free — uses the REST API via fetch).
 *
 * Active when RESEND_API_KEY is set. Set EMAIL_FROM to a verified sender, e.g.
 * "Hotel Rate Check <bookings@hotelratecheck.com>". If you choose a different
 * email provider later, add a sibling adapter and wire it in lib/notify/index.ts.
 */

import { NotifyError, type Notifier, type EmailMessage, type SendResult } from "./types";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export class ResendNotifier implements Notifier {
  readonly name = "resend";
  private readonly apiKey: string;
  private readonly from: string;

  constructor(apiKey?: string, from?: string) {
    this.apiKey = apiKey ?? process.env.RESEND_API_KEY ?? "";
    this.from = from ?? process.env.EMAIL_FROM ?? "Hotel Rate Check <bookings@hotelratecheck.com>";
    if (!this.apiKey) throw new NotifyError("RESEND_API_KEY missing");
  }

  async send(msg: EmailMessage): Promise<SendResult> {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: this.from,
        to: [msg.to],
        subject: msg.subject,
        text: msg.text,
        ...(msg.html ? { html: msg.html } : {}),
      }),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok || !json.id) {
      throw new NotifyError(`Resend send failed: ${json.message ?? res.status}`);
    }
    return { id: json.id, provider: this.name };
  }
}
