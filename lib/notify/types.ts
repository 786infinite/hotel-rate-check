/**
 * Provider-agnostic notification (email) layer.
 *
 * The app sends booking emails through a Notifier, never a specific email API.
 * Swapping Resend → SES → SMTP later = a new adapter, not a rewrite (same shape
 * as lib/payments).
 */

export interface EmailMessage {
  to: string;
  subject: string;
  /** Plain-text body (always provided — required for deliverability). */
  text: string;
  /** Optional HTML body. */
  html?: string;
}

export interface SendResult {
  id: string;
  provider: string;
}

export interface Notifier {
  readonly name: string;
  send(msg: EmailMessage): Promise<SendResult>;
}

export class NotifyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotifyError";
  }
}
