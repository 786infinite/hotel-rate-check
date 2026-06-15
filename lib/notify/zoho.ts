/**
 * Zoho ZeptoMail adapter (dependency-free — uses the REST API via fetch).
 *
 * ZeptoMail is Zoho's TRANSACTIONAL email product (the right tool for booking
 * confirmations — your Zoho Mail mailbox is for human email and has low
 * automated-send limits). It uses the same verified domain as your Zoho account.
 *
 * Active when ZEPTOMAIL_TOKEN is set. Env:
 *   ZEPTOMAIL_TOKEN     "Send Mail token" from ZeptoMail (Mail Agents → SMTP/API).
 *   ZEPTOMAIL_API_URL   Region endpoint. Default EU. Use the one matching your
 *                       Zoho data centre:
 *                         EU  https://api.zeptomail.eu/v1.1/email   (default)
 *                         US  https://api.zeptomail.com/v1.1/email
 *                         IN  https://api.zeptomail.in/v1.1/email
 *   EMAIL_FROM          "Hotel Rate Check <bookings@hotelratecheck.com>" (verified sender).
 *
 * If you'd rather send from a Zoho Mail mailbox over SMTP instead of ZeptoMail,
 * that needs an SMTP transport (e.g. nodemailer) — add a sibling adapter.
 */

import { NotifyError, type Notifier, type EmailMessage, type SendResult } from "./types";

const DEFAULT_URL = "https://api.zeptomail.eu/v1.1/email";

/** Parse `EMAIL_FROM` ("Name <addr>" or "addr") into name + address. */
function parseFrom(raw: string): { address: string; name?: string } {
  const m = raw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (m) return { name: m[1] || undefined, address: m[2].trim() };
  return { address: raw.trim() };
}

export class ZohoNotifier implements Notifier {
  readonly name = "zoho-zeptomail";
  private readonly token: string;
  private readonly url: string;
  private readonly from: { address: string; name?: string };

  constructor(token?: string, from?: string, url?: string) {
    this.token = token ?? process.env.ZEPTOMAIL_TOKEN ?? "";
    this.url = url ?? process.env.ZEPTOMAIL_API_URL ?? DEFAULT_URL;
    this.from = parseFrom(from ?? process.env.EMAIL_FROM ?? "Hotel Rate Check <bookings@hotelratecheck.com>");
    if (!this.token) throw new NotifyError("ZEPTOMAIL_TOKEN missing");
  }

  async send(msg: EmailMessage): Promise<SendResult> {
    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        // ZeptoMail requires this exact scheme (NOT "Bearer").
        Authorization: `Zoho-enczapikey ${this.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        from: { address: this.from.address, name: this.from.name },
        to: [{ email_address: { address: msg.to } }],
        subject: msg.subject,
        textbody: msg.text,
        ...(msg.html ? { htmlbody: msg.html } : {}),
      }),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => ({}))) as {
      request_id?: string;
      data?: unknown;
      message?: string;
      error?: { details?: { message?: string }[] };
    };
    if (!res.ok) {
      const detail = json.error?.details?.[0]?.message ?? json.message ?? res.status;
      throw new NotifyError(`ZeptoMail send failed: ${detail}`);
    }
    return { id: json.request_id ?? "zeptomail", provider: this.name };
  }
}
