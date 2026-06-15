/**
 * Console notifier — the offline / unconfigured default.
 *
 * Logs the email instead of sending it, so the booking flow is complete and
 * testable with no email provider. Used when NOTIFY_MOCK=1 or when no provider
 * credentials are configured.
 */

import type { Notifier, EmailMessage, SendResult } from "./types";

let counter = 0;

export class ConsoleNotifier implements Notifier {
  readonly name = "console";

  async send(msg: EmailMessage): Promise<SendResult> {
    counter += 1;
    const id = `email_console_${Date.now()}_${counter}`;
    console.info(
      `[notify:console] → ${msg.to}\n  subject: ${msg.subject}\n  ${msg.text.replace(/\n/g, "\n  ")}`,
    );
    return { id, provider: this.name };
  }
}
